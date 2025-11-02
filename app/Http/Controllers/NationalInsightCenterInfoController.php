<?php

namespace App\Http\Controllers;

use App\Models\NationalInsightCenterInfo;
use App\Models\Info;
use App\Models\InfoStat;
use App\Models\StatCategory;
use App\Models\StatCategoryItem;
use App\Models\InfoCategory;
use App\Models\Department;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Carbon\Carbon;

class NationalInsightCenterInfoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', NationalInsightCenterInfo::class);
        
        $validated = $request->validate([
            'search' => 'nullable|string|max:255',
            'sort_field' => ['nullable', 'string', Rule::in([
                'name', 'code', 'description', 'created_at', 'updated_at', 'info_items_count', 'info_stats_count'
            ])],
            'sort_direction' => ['nullable', 'string', Rule::in(['asc', 'desc'])],
            'per_page' => 'nullable|integer|min:5|max:100',
            'page' => 'nullable|integer|min:1'
        ]);

        $query = NationalInsightCenterInfo::with(['creator:id,name', 'confirmer:id,name'])
            ->withCount(['infoItems', 'infoStats'])
            ->where(function($q) {
                $q->where('created_by', Auth::id())
                  ->orWhereHas('accesses', function($accessQuery) {
                      $accessQuery->where('user_id', Auth::id());
                  });
            });

        // Apply search filter
        if (!empty($validated['search'])) {
            $query->where(function($q) use ($validated) {
                $q->where('name', 'like', '%' . $validated['search'] . '%')
                  ->orWhere('code', 'like', '%' . $validated['search'] . '%')
                  ->orWhere('description', 'like', '%' . $validated['search'] . '%');
            });
        }

        // Apply sorting
        $sortField = $validated['sort_field'] ?? 'name';
        $sortDirection = $validated['sort_direction'] ?? 'asc';
        $query->orderBy($sortField, $sortDirection);

        // Get paginated results
        $perPage = $validated['per_page'] ?? 10;
        $nationalInsightCenterInfos = $query->paginate($perPage);

        return Inertia::render('NationalInsightCenterInfo/Index', [
            'nationalInsightCenterInfos' => $nationalInsightCenterInfos,
            'filters' => [
                'search' => $validated['search'] ?? '',
                'sort' => $sortField,
                'direction' => $sortDirection,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $this->authorize('create', NationalInsightCenterInfo::class);
        
        $users = User::orderBy('name')->get();

        return Inertia::render('NationalInsightCenterInfo/Create', [
            'users' => $users,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', NationalInsightCenterInfo::class);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:national_insight_center_infos',
            'code' => 'nullable|string|max:50|unique:national_insight_center_infos',
            'description' => 'nullable|string',
            'access_users' => 'nullable|array',
            'access_users.*' => 'integer|exists:users,id',
        ]);

        try {
            DB::transaction(function () use ($validated) {
                $nationalInsightCenterInfo = NationalInsightCenterInfo::create([
                    'name' => $validated['name'],
                    'code' => $validated['code'],
                    'description' => $validated['description'],
                    'created_by' => Auth::id(),
                ]);


                // Create access permissions
                if (isset($validated['access_users']) && is_array($validated['access_users'])) {
                    foreach ($validated['access_users'] as $userId) {
                        // Don't create access for the creator
                        if ($userId != Auth::id()) {
                            $nationalInsightCenterInfo->accesses()->create(['user_id' => $userId]);
                        }
                    }
                }

                return $nationalInsightCenterInfo;
            });

            return redirect()
                ->route('national-insight-center-infos.index')
                ->with('success', 'National Insight Center Info created successfully.');

        } catch (\Exception $e) {
            Log::error('Failed to create national insight center info', [
                'error' => $e->getMessage(),
                'data' => $validated
            ]);

            return redirect()
                ->back()
                ->with('error', 'Failed to create national insight center info. Please try again.')
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(NationalInsightCenterInfo $nationalInsightCenterInfo): Response
    {
        $this->authorize('view', $nationalInsightCenterInfo);
        
        // Load the national insight center info with all necessary relationships
        $nationalInsightCenterInfo->load([
            'creator:id,name',
            'confirmer:id,name'
        ]);

        $infos = $nationalInsightCenterInfo->infoItems()
            ->with([
                'infoCategory:id,name,code', 
                'department:id,name,code', 
                'creator:id,name', 
                'itemStats' => function($query) {
                    $query->with(['statCategoryItem.category']);
                }
            ])
            ->orderBy('created_at', 'desc')
            ->paginate(5);

        // Aggregate all item stats from all info items
        $aggregatedStats = $nationalInsightCenterInfo->infoItems()
            ->with('itemStats.statCategoryItem.category')
            ->get()
            ->pluck('itemStats')
            ->flatten()
            ->values();

        $statCategories = StatCategory::where('status', 'active')
            ->orderBy('label')
            ->get();

        // Get data for the create modal
        $infoCategories = InfoCategory::orderBy('name')->get();
        $departments = Department::orderBy('name')->get();

        return Inertia::render('NationalInsightCenterInfo/Show', [
            'nationalInsightCenterInfo' => $nationalInsightCenterInfo,
            'infos' => $infos,
            'aggregatedStats' => $aggregatedStats,
            'statCategories' => $statCategories,
            'infoCategories' => $infoCategories,
            'departments' => $departments,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(NationalInsightCenterInfo $nationalInsightCenterInfo): Response
    {
        $this->authorize('update', $nationalInsightCenterInfo);
        
        $users = User::orderBy('name')->get();

        // Load existing access users
        $nationalInsightCenterInfo->load(['accesses.user:id,name', 'confirmer:id,name']);

        // Load stat categories and items for statistics management
        $statItems = StatCategoryItem::with('category')
            ->whereHas('category', function($query) {
                $query->where('status', 'active');
            })
            ->orderBy('name')
            ->get();

        $statCategories = StatCategory::where('status', 'active')
            ->orderBy('label')
            ->get();

        // Load existing stats
        $nationalInsightCenterInfo->load(['infoStats.statCategoryItem.category']);

        return Inertia::render('NationalInsightCenterInfo/Edit', [
            'nationalInsightCenterInfo' => $nationalInsightCenterInfo,
            'users' => $users,
            'statItems' => $statItems,
            'statCategories' => $statCategories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, NationalInsightCenterInfo $nationalInsightCenterInfo): RedirectResponse
    {
        $this->authorize('update', $nationalInsightCenterInfo);
        
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('national_insight_center_infos')->ignore($nationalInsightCenterInfo->id)],
            'code' => ['nullable', 'string', 'max:50', Rule::unique('national_insight_center_infos')->ignore($nationalInsightCenterInfo->id)],
            'description' => 'nullable|string',
            'access_users' => 'nullable|array',
            'access_users.*' => 'integer|exists:users,id',
            'stats' => 'nullable|array',
            'stats.*.stat_category_item_id' => 'required|integer|exists:stat_category_items,id',
            'stats.*.value' => 'required|string|max:255',
            'stats.*.notes' => 'nullable|string|max:1000',
        ]);

        try {
            DB::transaction(function () use ($nationalInsightCenterInfo, $validated) {
                $nationalInsightCenterInfo->update([
                    'name' => $validated['name'],
                    'code' => $validated['code'],
                    'description' => $validated['description'],
                    'updated_by' => Auth::id(),
                ]);

                // Update access permissions
                if (isset($validated['access_users'])) {
                    $this->updateAccessPermissions($nationalInsightCenterInfo, $validated['access_users']);
                }

                // Update statistics if provided
                if (isset($validated['stats']) && is_array($validated['stats'])) {
                    $this->updateInfoStats($nationalInsightCenterInfo, $validated['stats']);
                }
            });

            return redirect()
                ->route('national-insight-center-infos.show', $nationalInsightCenterInfo)
                ->with('success', 'National Insight Center Info updated successfully.');

        } catch (\Exception $e) {
            Log::error('Failed to update national insight center info', [
                'error' => $e->getMessage(),
                'national_insight_center_info_id' => $nationalInsightCenterInfo->id,
                'data' => $validated
            ]);

            return redirect()
                ->back()
                ->with('error', 'Failed to update national insight center info. Please try again.')
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(NationalInsightCenterInfo $nationalInsightCenterInfo): RedirectResponse
    {
        $this->authorize('delete', $nationalInsightCenterInfo);
        
        try {
            $nationalInsightCenterInfo->delete();

            return redirect()
                ->route('national-insight-center-infos.index')
                ->with('success', 'National Insight Center Info deleted successfully.');

        } catch (\Exception $e) {
            Log::error('Failed to delete national insight center info', [
                'error' => $e->getMessage(),
                'national_insight_center_info_id' => $nationalInsightCenterInfo->id
            ]);

            return redirect()
                ->back()
                ->with('error', 'Failed to delete national insight center info. Please try again.');
        }
    }

    /**
     * Confirm the national insight center info.
     */
    public function confirm(NationalInsightCenterInfo $nationalInsightCenterInfo): RedirectResponse
    {
        $this->authorize('confirm', $nationalInsightCenterInfo);

        try {
            $nationalInsightCenterInfo->update([
                'confirmed' => true,
                'confirmed_by' => Auth::id(),
                'confirmed_at' => now(),
            ]);

            return redirect()
                ->back()
                ->with('success', 'National Insight Center Info confirmed successfully.');

        } catch (\Exception $e) {
            Log::error('Failed to confirm national insight center info', [
                'error' => $e->getMessage(),
                'national_insight_center_info_id' => $nationalInsightCenterInfo->id
            ]);

            return redirect()
                ->back()
                ->with('error', 'Failed to confirm national insight center info. Please try again.');
        }
    }


    /**
     * Update access permissions for the national insight center info.
     */
    private function updateAccessPermissions(NationalInsightCenterInfo $nationalInsightCenterInfo, array $accessUsers): void
    {
        // Delete existing access permissions
        $nationalInsightCenterInfo->accesses()->delete();

        // Create new access permissions
        foreach ($accessUsers as $userId) {
            // Don't create access for the creator
            if ($userId != Auth::id()) {
                $nationalInsightCenterInfo->accesses()->create(['user_id' => $userId]);
            }
        }
    }

    /**
     * Create info stats for the national insight center info.
     */
    private function createInfoStats(NationalInsightCenterInfo $nationalInsightCenterInfo, array $stats): void
    {
        foreach ($stats as $stat) {
            $nationalInsightCenterInfo->infoStats()->create([
                'stat_category_item_id' => $stat['stat_category_item_id'],
                'string_value' => $stat['value'],
                'notes' => $stat['notes'] ?? null,
                'created_by' => Auth::id(),
            ]);
        }
    }

    /**
     * Update info stats for the national insight center info.
     */
    private function updateInfoStats(NationalInsightCenterInfo $nationalInsightCenterInfo, array $stats): void
    {
        // Delete existing stats
        $nationalInsightCenterInfo->infoStats()->delete();

        // Create new stats
        $this->createInfoStats($nationalInsightCenterInfo, $stats);
    }

    /**
     * Print the national insight center info.
     */
    public function print(NationalInsightCenterInfo $nationalInsightCenterInfo): Response
    {
        $this->authorize('view', $nationalInsightCenterInfo);
        
        // Load the national insight center info with all necessary relationships
        $nationalInsightCenterInfo->load([
            'creator:id,name,department_id',
            'creator.department:id,name',
            'confirmer:id,name',
            'infoStats.statCategoryItem.category'
        ]);
        $infos = $nationalInsightCenterInfo->infoItems()
            ->with([
                'infoCategory:id,name,code', 
                'department:id,name,code', 
                'creator:id,name', 
                'itemStats' => function($query) {
                    $query->with(['statCategoryItem.category']);
                }
            ])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('NationalInsightCenterInfo/Print', [
            'nationalInsightCenterInfo' => $nationalInsightCenterInfo,
            'infos' => $infos,
        ]);
    }

    /**
     * Generate weekly report for national insight center info.
     */
    public function weeklyReport(Request $request, NationalInsightCenterInfo $nationalInsightCenterInfo): Response
    {
        $this->authorize('view', $nationalInsightCenterInfo);

        // Get date parameters (default to current week and previous week)
        $currentWeekStart = $request->input('current_week_start');
        $currentWeekEnd = $request->input('current_week_end');
        
        // If not provided, use current week (Monday to Sunday)
        if (!$currentWeekStart || !$currentWeekEnd) {
            $now = Carbon::now();
            $currentWeekStart = $now->copy()->startOfWeek();
            $currentWeekEnd = $now->copy()->endOfWeek();
        } else {
            $currentWeekStart = Carbon::parse($currentWeekStart);
            $currentWeekEnd = Carbon::parse($currentWeekEnd);
        }

        $previousWeekStart = $currentWeekStart->copy()->subWeek();
        $previousWeekEnd = $currentWeekEnd->copy()->subWeek();

        // Load the national insight center info
        $nationalInsightCenterInfo->load([
            'creator:id,name,department_id',
            'creator.department:id,name',
            'confirmer:id,name'
        ]);

        // Get all items for current week
        $currentWeekItems = $nationalInsightCenterInfo->infoItems()
            ->whereBetween('date', [$currentWeekStart->format('Y-m-d'), $currentWeekEnd->format('Y-m-d')])
            ->with([
                'infoCategory:id,name,code',
                'department:id,name,code',
                'province:id,name',
                'district:id,name',
                'itemStats.statCategoryItem.category'
            ])
            ->get();

        // Get all items for previous week
        $previousWeekItems = $nationalInsightCenterInfo->infoItems()
            ->whereBetween('date', [$previousWeekStart->format('Y-m-d'), $previousWeekEnd->format('Y-m-d')])
            ->with([
                'infoCategory:id,name,code',
                'department:id,name,code',
                'province:id,name',
                'district:id,name',
                'itemStats.statCategoryItem.category'
            ])
            ->get();

        // Aggregate data by category
        $currentWeekData = $this->aggregateWeeklyData($currentWeekItems);
        $previousWeekData = $this->aggregateWeeklyData($previousWeekItems);

        // Calculate comparisons
        $comparisons = $this->calculateComparisons($currentWeekData, $previousWeekData);

        // Get categories for grouping
        $categories = InfoCategory::orderBy('name')->get();

        // Get all stat categories and items
        $statCategories = StatCategory::where('status', 'active')
            ->with('items')
            ->orderBy('label')
            ->get();

        return Inertia::render('NationalInsightCenterInfo/WeeklyReport', [
            'nationalInsightCenterInfo' => $nationalInsightCenterInfo,
            'currentWeekData' => $currentWeekData,
            'previousWeekData' => $previousWeekData,
            'comparisons' => $comparisons,
            'currentWeekItems' => $currentWeekItems,
            'previousWeekItems' => $previousWeekItems,
            'dateRange' => [
                'current_week_start' => $currentWeekStart->format('Y-m-d'),
                'current_week_end' => $currentWeekEnd->format('Y-m-d'),
                'previous_week_start' => $previousWeekStart->format('Y-m-d'),
                'previous_week_end' => $previousWeekEnd->format('Y-m-d'),
            ],
            'categories' => $categories,
            'statCategories' => $statCategories,
        ]);
    }

    /**
     * Aggregate weekly data by category and statistics.
     */
    private function aggregateWeeklyData($items): array
    {
        $data = [
            'total_items' => $items->count(),
            'by_category' => [],
            'by_stat_category' => [],
            'casualties' => [
                'dead' => 0,
                'injured' => 0,
                'captured' => 0,
                'surrendered' => 0,
            ],
            'incidents' => [
                'total' => 0,
                'terrorist' => 0,
                'non_terrorist' => 0,
            ],
            'traffic' => [
                'military' => 0,
                'civilian' => 0,
            ],
            'security_activities' => 0,
            'border_violations' => 0,
            'air_violations' => 0,
        ];

        // Group by category
        foreach ($items as $item) {
            $categoryId = $item->info_category_id ?? 'uncategorized';
            $categoryName = $item->infoCategory->name ?? 'Uncategorized';
            
            if (!isset($data['by_category'][$categoryId])) {
                $data['by_category'][$categoryId] = [
                    'id' => $categoryId,
                    'name' => $categoryName,
                    'code' => $item->infoCategory->code ?? null,
                    'count' => 0,
                    'items' => [],
                ];
            }
            
            $data['by_category'][$categoryId]['count']++;
            $data['by_category'][$categoryId]['items'][] = $item;
        }

        // Aggregate statistics
        foreach ($items as $item) {
            foreach ($item->itemStats as $stat) {
                $statCategoryId = $stat->statCategoryItem->category->id;
                $statCategoryName = $stat->statCategoryItem->category->label;
                $statItemName = $stat->statCategoryItem->label;
                
                if (!isset($data['by_stat_category'][$statCategoryId])) {
                    $data['by_stat_category'][$statCategoryId] = [
                        'id' => $statCategoryId,
                        'name' => $statCategoryName,
                        'items' => [],
                    ];
                }
                
                if (!isset($data['by_stat_category'][$statCategoryId]['items'][$statItemName])) {
                    $data['by_stat_category'][$statCategoryId]['items'][$statItemName] = [
                        'name' => $statItemName,
                        'value' => 0,
                        'count' => 0,
                    ];
                }
                
                // Try to parse numeric value, otherwise count occurrences
                $value = $stat->string_value;
                if (is_numeric($value)) {
                    $data['by_stat_category'][$statCategoryId]['items'][$statItemName]['value'] += (float)$value;
                } else {
                    $data['by_stat_category'][$statCategoryId]['items'][$statItemName]['count']++;
                }
            }
        }

        // Convert stat category items to array for easier frontend consumption
        foreach ($data['by_stat_category'] as &$category) {
            $category['items'] = array_values($category['items']);
        }

        return $data;
    }

    /**
     * Calculate week-over-week comparisons.
     */
    private function calculateComparisons(array $currentWeekData, array $previousWeekData): array
    {
        $comparisons = [
            'total_items' => [
                'current' => $currentWeekData['total_items'],
                'previous' => $previousWeekData['total_items'],
                'change' => $currentWeekData['total_items'] - $previousWeekData['total_items'],
                'percentage_change' => 0,
            ],
            'categories' => [],
        ];

        // Calculate percentage change
        if ($previousWeekData['total_items'] > 0) {
            $comparisons['total_items']['percentage_change'] = 
                (($currentWeekData['total_items'] - $previousWeekData['total_items']) / $previousWeekData['total_items']) * 100;
        } else if ($currentWeekData['total_items'] > 0) {
            $comparisons['total_items']['percentage_change'] = 100;
        }

        // Compare categories
        $allCategories = array_unique(array_merge(
            array_keys($currentWeekData['by_category']),
            array_keys($previousWeekData['by_category'])
        ));

        foreach ($allCategories as $categoryId) {
            $currentCount = $currentWeekData['by_category'][$categoryId]['count'] ?? 0;
            $previousCount = $previousWeekData['by_category'][$categoryId]['count'] ?? 0;
            
            $comparisons['categories'][$categoryId] = [
                'name' => $currentWeekData['by_category'][$categoryId]['name'] ?? $previousWeekData['by_category'][$categoryId]['name'] ?? 'Unknown',
                'current' => $currentCount,
                'previous' => $previousCount,
                'change' => $currentCount - $previousCount,
                'percentage_change' => $previousCount > 0 
                    ? (($currentCount - $previousCount) / $previousCount) * 100 
                    : ($currentCount > 0 ? 100 : 0),
            ];
        }

        return $comparisons;
    }
}