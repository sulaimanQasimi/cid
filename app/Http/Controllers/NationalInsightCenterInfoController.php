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

        $query = NationalInsightCenterInfo::with(['creator:id,name'])
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
        
        $statItems = StatCategoryItem::with('category')
            ->whereHas('category', function($query) {
                $query->where('status', 'active');
            })
            ->orderBy('name')
            ->get();

        $statCategories = StatCategory::where('status', 'active')
            ->orderBy('label')
            ->get();

        $users = User::orderBy('name')->get();

        return Inertia::render('NationalInsightCenterInfo/Create', [
            'statItems' => $statItems,
            'statCategories' => $statCategories,
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
            'stats' => 'nullable|array',
            'stats.*.stat_category_item_id' => 'required|exists:stat_category_items,id',
            'stats.*.value' => 'required|string|max:255',
            'stats.*.notes' => 'nullable|string|max:1000',
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

                // Create associated stats
                if (!empty($validated['stats'])) {
                    $this->createInfoStats($nationalInsightCenterInfo, $validated['stats']);
                }

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
            'infoStats.statCategoryItem.category'
        ]);

        $infos = $nationalInsightCenterInfo->infoItems()
            ->with(['infoCategory:id,name,code', 'department:id,name,code', 'creator:id,name'])
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
        
        $statItems = StatCategoryItem::with('category')
            ->whereHas('category', function($query) {
                $query->where('status', 'active');
            })
            ->orderBy('name')
            ->get();

        $statCategories = StatCategory::where('status', 'active')
            ->orderBy('label')
            ->get();

        $users = User::orderBy('name')->get();

        // Load existing stats
        $nationalInsightCenterInfo->load(['infoStats.statCategoryItem.category']);

        return Inertia::render('NationalInsightCenterInfo/Edit', [
            'nationalInsightCenterInfo' => $nationalInsightCenterInfo,
            'statItems' => $statItems,
            'statCategories' => $statCategories,
            'users' => $users,
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
            'stats' => 'nullable|array',
            'stats.*.stat_category_item_id' => 'required|exists:stat_category_items,id',
            'stats.*.value' => 'required|string|max:255',
            'stats.*.notes' => 'nullable|string|max:1000',
            'access_users' => 'nullable|array',
            'access_users.*' => 'integer|exists:users,id',
        ]);

        try {
            DB::transaction(function () use ($nationalInsightCenterInfo, $validated) {
                $nationalInsightCenterInfo->update([
                    'name' => $validated['name'],
                    'code' => $validated['code'],
                    'description' => $validated['description'],
                    'updated_by' => Auth::id(),
                ]);

                // Update associated stats
                if (isset($validated['stats'])) {
                    $this->updateInfoStats($nationalInsightCenterInfo, $validated['stats']);
                }

                // Update access permissions
                if (isset($validated['access_users'])) {
                    $this->updateAccessPermissions($nationalInsightCenterInfo, $validated['access_users']);
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
}