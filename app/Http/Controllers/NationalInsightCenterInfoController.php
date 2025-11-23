<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Info;
use App\Models\InfoCategory;
use App\Models\NationalInsightCenterInfo;
use App\Models\StatCategory;
use App\Models\StatCategoryItem;
use App\Models\User;
use App\Services\PersianDateService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;

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
            'per_page' => 'nullable|integer|min:5|max:100',
            'page' => 'nullable|integer|min:1',
        ]);

        $query = NationalInsightCenterInfo::with(['creator:id,name', 'confirmer:id,name'])
            ->withCount(['infoItems', 'infoStats'])
            ->where(function ($q) {
                $q->where('created_by', Auth::id())
                    ->orWhereHas('accesses', function ($accessQuery) {
                        $accessQuery->where('user_id', Auth::id());
                    });
            });

        // Apply search filter
        if (! empty($validated['search'])) {
            $query->where(function ($q) use ($validated) {
                $q->where('name', 'like', '%'.$validated['search'].'%')
                    ->orWhere('code', 'like', '%'.$validated['search'].'%')
                    ->orWhere('description', 'like', '%'.$validated['search'].'%')
                    ->orWhere('date', 'like', '%'.$validated['search'].'%');
            });
        }

        // Sort by newest first
        $query->orderBy('created_at', 'desc');

        // Get paginated results
        $perPage = $validated['per_page'] ?? 10;
        $nationalInsightCenterInfos = $query->paginate($perPage);

        return Inertia::render('NationalInsightCenterInfo/Index', [
            'nationalInsightCenterInfos' => $nationalInsightCenterInfos,
            'filters' => [
                'search' => $validated['search'] ?? '',
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

        // Load stat categories and items for statistics management
        $statItems = StatCategoryItem::with('category')
            ->whereHas('category', function ($query) {
                $query->where('status', 'active');
            })
            ->orderBy('name')
            ->get();

        $statCategories = StatCategory::where('status', 'active')
            ->orderBy('label')
            ->get();

        return Inertia::render('NationalInsightCenterInfo/Create', [
            'users' => $users,
            'statItems' => $statItems,
            'statCategories' => $statCategories,
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
            'date' => 'required|string',
            'access_users' => 'nullable|array',
            'access_users.*' => 'integer|exists:users,id',
            'stats' => 'nullable|array',
            'stats.*.stat_category_item_id' => 'required|integer|exists:stat_category_items,id',
            'stats.*.value' => 'required|string|max:255',
            'stats.*.notes' => 'nullable|string|max:1000',
        ]);

        // Convert Persian date to database format
        $validated['date'] = PersianDateService::toDatabaseFormat($validated['date']);
        if (! $validated['date']) {
            return redirect()
                ->back()
                ->withErrors(['date' => 'Invalid date format. Please use Persian date format (YYYY/MM/DD).'])
                ->withInput();
        }

        // Check uniqueness after conversion
        if (NationalInsightCenterInfo::where('date', $validated['date'])->exists()) {
            return redirect()
                ->back()
                ->withErrors(['date' => 'A record with this date already exists.'])
                ->withInput();
        }

        try {
            DB::transaction(function () use ($validated) {
                $nationalInsightCenterInfo = NationalInsightCenterInfo::create([
                    'name' => $validated['name'],
                    'code' => $validated['code'],
                    'description' => $validated['description'],
                    'date' => $validated['date'],
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

                // Create statistics if provided
                if (isset($validated['stats']) && is_array($validated['stats'])) {
                    $this->createInfoStats($nationalInsightCenterInfo, $validated['stats']);
                }

                return $nationalInsightCenterInfo;
            });

            return redirect()
                ->route('national-insight-center-infos.index')
                ->with('success', 'National Insight Center Info created successfully.');

        } catch (\Exception $e) {
            Log::error('Failed to create national insight center info', [
                'error' => $e->getMessage(),
                'data' => $validated,
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
            'confirmer:id,name',
            'infoStats.statCategoryItem.category',
        ]);

        $infos = $nationalInsightCenterInfo->infoItems()
            ->with([
                'infoCategory:id,name,code',
                'department:id,name,code',
                'creator:id,name',
            ])
            ->orderBy('created_at', 'desc')
            ->paginate(5);

        $statCategories = StatCategory::where('status', 'active')
            ->orderBy('label')
            ->get();

        // Get data for the create modal
        $infoCategories = InfoCategory::orderBy('name')->get();
        $departments = Department::orderBy('name')->get();

        return Inertia::render('NationalInsightCenterInfo/Show', [
            'nationalInsightCenterInfo' => $nationalInsightCenterInfo,
            'infos' => $infos,
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

        // Load existing access users and infoStats
        $nationalInsightCenterInfo->load(['accesses.user:id,name', 'confirmer:id,name', 'infoStats']);

        // Load stat categories and items for statistics management
        $statItems = StatCategoryItem::with('category')
            ->whereHas('category', function ($query) {
                $query->where('status', 'active');
            })
            ->orderBy('name')
            ->get();

        $statCategories = StatCategory::where('status', 'active')
            ->orderBy('label')
            ->get();

        // Get infoStats as a separate variable
        $infoStats = $nationalInsightCenterInfo->infoStats;

        return Inertia::render('NationalInsightCenterInfo/Edit', [
            'nationalInsightCenterInfo' => $nationalInsightCenterInfo,
            'infoStats' => $infoStats,
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
        Log::info($request->all());
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('national_insight_center_infos')->ignore($nationalInsightCenterInfo->id)],
            'code' => ['nullable', 'string', 'max:50', Rule::unique('national_insight_center_infos')->ignore($nationalInsightCenterInfo->id)],
            'description' => 'nullable|string',
            'date' => 'required|string',
            'access_users' => 'nullable|array',
            'access_users.*' => 'integer|exists:users,id',
            'stats' => 'nullable|array',
            'stats.*.stat_category_item_id' => 'required|integer|exists:stat_category_items,id',
            'stats.*.value' => 'required|string|max:255',
            'stats.*.notes' => 'nullable|string|max:1000',
        ]);

        // Convert Persian date to database format
        $validated['date'] = PersianDateService::toDatabaseFormat($validated['date']);
        if (! $validated['date']) {
            return redirect()
                ->back()
                ->withErrors(['date' => 'Invalid date format. Please use Persian date format (YYYY/MM/DD).'])
                ->withInput();
        }

        // Check uniqueness after conversion (excluding current record)
        if (NationalInsightCenterInfo::where('date', $validated['date'])->where('id', '!=', $nationalInsightCenterInfo->id)->exists()) {
            return redirect()
                ->back()
                ->withErrors(['date' => 'A record with this date already exists.'])
                ->withInput();
        }

        try {
            DB::transaction(function () use ($nationalInsightCenterInfo, $validated) {
                $nationalInsightCenterInfo->update([
                    'name' => $validated['name'],
                    'code' => $validated['code'],
                    'description' => $validated['description'],
                    'date' => $validated['date'],
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
                'data' => $validated,
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
                'national_insight_center_info_id' => $nationalInsightCenterInfo->id,
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
            $nationalInsightCenterInfo->infoItems()->update([
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
                'national_insight_center_info_id' => $nationalInsightCenterInfo->id,
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
        $this->authorize('print', $nationalInsightCenterInfo);

        // Load the national insight center info with all necessary relationships
        $nationalInsightCenterInfo->load([
            'creator:id,name,department_id',
            'creator.department:id,name',
            'confirmer:id,name',
            'infoStats.statCategoryItem.category',
        ]);
        $infos = $nationalInsightCenterInfo->infoItems()
            ->with([
                'infoCategory:id,name,code',
                'department:id,name,code',
                'creator:id,name',
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
        $this->authorize('printDates', $nationalInsightCenterInfo);

        // Get date parameters (default to current week and previous week)
        $currentWeekStart = $request->input('current_week_start');
        $currentWeekEnd = $request->input('current_week_end');

        // If not provided, use current week (Monday to Sunday)
        if (! $currentWeekStart || ! $currentWeekEnd) {
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
            'confirmer:id,name',
        ]);

        // Get all items for current week
        $currentWeekItems = $nationalInsightCenterInfo->infoItems()
            ->whereBetween('date', [$currentWeekStart->format('Y-m-d'), $currentWeekEnd->format('Y-m-d')])
            ->with([
                'infoCategory:id,name,code',
                'department:id,name,code',
                'province:id,name',
                'district:id,name',
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

            if (! isset($data['by_category'][$categoryId])) {
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

        // Aggregate statistics removed - stats no longer associated with items

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
        } elseif ($currentWeekData['total_items'] > 0) {
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

    /**
     * Display report page for national insight center info with date range filter.
     */
    public function report(Request $request): Response
    {
        $this->authorize('printDates', NationalInsightCenterInfo::class);

        $validated = $request->validate([
            'date_from' => 'nullable|string',
            'date_to' => 'nullable|string',
        ]);

        // Convert Persian dates to database format if provided
        $dateFrom = null;
        $dateTo = null;

        if (! empty($validated['date_from'])) {
            $dateFrom = PersianDateService::toDatabaseFormat($validated['date_from']);
        }

        if (! empty($validated['date_to'])) {
            $dateTo = PersianDateService::toDatabaseFormat($validated['date_to']);
        }

        // Get all national insight center infos accessible by the user
        $query = NationalInsightCenterInfo::with(['creator:id,name', 'confirmer:id,name'])
            ->withCount(['infoItems', 'infoStats'])
            ->where(function ($q) {
                $q->where('created_by', Auth::id())
                    ->orWhereHas('accesses', function ($accessQuery) {
                        $accessQuery->where('user_id', Auth::id());
                    });
            });

        // Apply date filters if provided
        if ($dateFrom) {
            $query->where('date', '>=', $dateFrom);
        }

        if ($dateTo) {
            $query->where('date', '<=', $dateTo);
        }

        $nationalInsightCenterInfos = $query->orderBy('date', 'desc')->get();

        return Inertia::render('NationalInsightCenterInfo/Report', [
            'nationalInsightCenterInfos' => $nationalInsightCenterInfos,
            'filters' => [
                'date_from' => $validated['date_from'] ?? '',
                'date_to' => $validated['date_to'] ?? '',
            ],
        ]);
    }

    /**
     * Get dates data for national insight center info report.
     */
    public function dates(Request $request)
    {
        $this->authorize('viewAny', NationalInsightCenterInfo::class);

        $validated = $request->validate([
            'date_from' => 'nullable|string',
            'date_to' => 'nullable|string',
        ]);

        // Convert Persian dates to database format if provided
        $dateFrom = null;
        $dateTo = null;

        if (! empty($validated['date_from'])) {
            $dateFrom = PersianDateService::toDatabaseFormat($validated['date_from']);
        }

        if (! empty($validated['date_to'])) {
            $dateTo = PersianDateService::toDatabaseFormat($validated['date_to']);
        }

        // Get all national insight center infos accessible by the user
        $query = NationalInsightCenterInfo::with(['creator:id,name', 'confirmer:id,name'])
            ->withCount(['infoItems', 'infoStats'])
            ->where(function ($q) {
                $q->where('created_by', Auth::id())
                    ->orWhereHas('accesses', function ($accessQuery) {
                        $accessQuery->where('user_id', Auth::id());
                    });
            });

        // Apply date filters if provided
        if ($dateFrom) {
            $query->where('date', '>=', $dateFrom);
        }

        if ($dateTo) {
            $query->where('date', '<=', $dateTo);
        }

        $nationalInsightCenterInfos = $query->orderBy('date', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $nationalInsightCenterInfos,
            'filters' => [
                'date_from' => $validated['date_from'] ?? '',
                'date_to' => $validated['date_to'] ?? '',
            ],
        ]);
    }

    /**
     * Print dates report for national insight center info.
     */
    public function printDates(Request $request): Response
    {
        $this->authorize('printDates', NationalInsightCenterInfo::class);

        $validated = $request->validate([
            'date_from' => 'nullable|string',
            'date_to' => 'nullable|string',
        ]);

        // Convert Persian dates to database format if provided
        $dateFrom = null;
        $dateTo = null;

        if (! empty($validated['date_from'])) {
            $dateFrom = PersianDateService::toDatabaseFormat($validated['date_from']);
        }

        if (! empty($validated['date_to'])) {
            $dateTo = PersianDateService::toDatabaseFormat($validated['date_to']);
        }
        // Call the stored procedure to get IDs by date filter
        $idsResult = DB::select(
            'CALL sp_get_ids_by_date(?, ?)',
            [$dateFrom, $dateTo]
        );
        $ids = collect($idsResult)->pluck('id')->toArray();
        // Use the IDs from the stored procedure to call the SUM integer value SP and get per-category totals
        // dd($ids);

        $statSums = [];
        $sub_items = [];
        if (! empty($ids)) {
            // Convert array to comma-separated string for the SP input
            $idsString = implode(',', $ids);
            // The procedure will return stat_category_item_id and total_integer_value
            $statSums = DB::select('CALL sp_sum_integer_values_by_category(?)', [$idsString]);
            $sub_items = DB::select('CALL sp_get_sub_items_by_ids(?)', [$idsString]);
        }
        // Get all national insight center infos accessible by the user with their info items

        // Aggregate all stats from national insight center infos only (not from info items)
        // dd($sub_items);
        return Inertia::render('NationalInsightCenterInfo/PrintDates', [
            'sub_items' => $sub_items,
            'statSums' => $statSums,
            'dateFrom' => $validated['date_from'] ?? null,
            'dateTo' => $validated['date_to'] ?? null,
        ]);
    }
}
