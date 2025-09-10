<?php

namespace App\Http\Controllers;

use App\Models\NationalInsightCenterInfoItem;
use App\Models\NationalInsightCenterInfo;
use App\Models\InfoCategory;
use App\Models\Department;
use App\Models\User;
use App\Models\StatCategory;
use App\Models\StatCategoryItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;

class NationalInsightCenterInfoItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', NationalInsightCenterInfoItem::class);
        
        $validated = $request->validate([
            'search' => 'nullable|string|max:255',
            'national_insight_center_info_id' => 'nullable|integer|exists:national_insight_center_infos,id',
            'per_page' => 'nullable|integer|min:5|max:100',
            'page' => 'nullable|integer|min:1'
        ]);

        $query = NationalInsightCenterInfoItem::with([
            'nationalInsightCenterInfo:id,name',
            'infoCategory:id,name',
            'department:id,name',
            'user:id,name',
            'creator:id,name'
        ]);

        // Apply search filter
        if (!empty($validated['search'])) {
            $query->where(function($q) use ($validated) {
                $q->where('name', 'like', '%' . $validated['search'] . '%')
                  ->orWhere('code', 'like', '%' . $validated['search'] . '%')
                  ->orWhere('description', 'like', '%' . $validated['search'] . '%');
            });
        }

        // Filter by national insight center info
        if (!empty($validated['national_insight_center_info_id'])) {
            $query->where('national_insight_center_info_id', $validated['national_insight_center_info_id']);
        }

        $query->orderBy('created_at', 'desc');

        // Get paginated results
        $perPage = $validated['per_page'] ?? 10;
        $items = $query->paginate($perPage);

        // Get data for filters
        $nationalInsightCenterInfos = NationalInsightCenterInfo::orderBy('name')->get();

        return Inertia::render('NationalInsightCenterInfoItem/Index', [
            'items' => $items,
            'nationalInsightCenterInfos' => $nationalInsightCenterInfos,
            'filters' => [
                'search' => $validated['search'] ?? '',
                'national_insight_center_info_id' => $validated['national_insight_center_info_id'] ?? null,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): Response
    {
        $this->authorize('create', NationalInsightCenterInfoItem::class);
        
        $nationalInsightCenterInfoId = $request->get('national_insight_center_info_id');
        
        $nationalInsightCenterInfos = NationalInsightCenterInfo::orderBy('name')->get();
        $infoCategories = InfoCategory::orderBy('name')->get();
        $departments = Department::orderBy('name')->get();
        $users = User::orderBy('name')->get();

        return Inertia::render('NationalInsightCenterInfoItem/Create', [
            'nationalInsightCenterInfos' => $nationalInsightCenterInfos,
            'infoCategories' => $infoCategories,
            'departments' => $departments,
            'users' => $users,
            'nationalInsightCenterInfoId' => $nationalInsightCenterInfoId,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', NationalInsightCenterInfoItem::class);
        
        $validated = $request->validate([
            'national_insight_center_info_id' => 'required|exists:national_insight_center_infos,id',
            'info_category_id' => 'nullable|exists:info_categories,id',
            'department_id' => 'nullable|exists:departments,id',
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'value' => 'nullable|array',
            'user_id' => 'nullable|exists:users,id',
        ]);

        try {
            $item = NationalInsightCenterInfoItem::create([
                'national_insight_center_info_id' => $validated['national_insight_center_info_id'],
                'info_category_id' => $validated['info_category_id'],
                'department_id' => $validated['department_id'],
                'name' => $validated['name'],
                'code' => $validated['code'],
                'description' => $validated['description'],
                'value' => $validated['value'],
                'user_id' => $validated['user_id'],
                'created_by' => Auth::id(),
            ]);

            return redirect()
                ->route('national-insight-center-info-items.show', $item)
                ->with('success', 'National Insight Center Info Item created successfully.');

        } catch (\Exception $e) {
            Log::error('Failed to create national insight center info item', [
                'error' => $e->getMessage(),
                'data' => $validated
            ]);

            return redirect()
                ->back()
                ->with('error', 'Failed to create national insight center info item. Please try again.')
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(NationalInsightCenterInfoItem $nationalInsightCenterInfoItem): Response
    {
        $this->authorize('view', $nationalInsightCenterInfoItem);

        // Record the visit
        $nationalInsightCenterInfoItem->recordVisit();

        // Load related data
        $nationalInsightCenterInfoItem->load([
            'nationalInsightCenterInfo',
            'infoCategory',
            'department',
            'user',
            'creator',
            'confirmer',
            'infoStats.statCategoryItem.category'
        ]);

        return Inertia::render('NationalInsightCenterInfoItem/Show', [
            'item' => $nationalInsightCenterInfoItem,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(NationalInsightCenterInfoItem $nationalInsightCenterInfoItem): Response
    {
        $this->authorize('update', $nationalInsightCenterInfoItem);

        // Load data for dropdowns
        $nationalInsightCenterInfos = NationalInsightCenterInfo::orderBy('name')->get();
        $infoCategories = InfoCategory::orderBy('name')->get();
        $departments = Department::orderBy('name')->get();
        $users = User::orderBy('name')->get();

        // Load the item with its relationships
        $nationalInsightCenterInfoItem->load([
            'nationalInsightCenterInfo',
            'infoCategory',
            'department',
            'user'
        ]);

        return Inertia::render('NationalInsightCenterInfoItem/Edit', [
            'item' => $nationalInsightCenterInfoItem,
            'nationalInsightCenterInfos' => $nationalInsightCenterInfos,
            'infoCategories' => $infoCategories,
            'departments' => $departments,
            'users' => $users,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, NationalInsightCenterInfoItem $nationalInsightCenterInfoItem): RedirectResponse
    {
        $this->authorize('update', $nationalInsightCenterInfoItem);
        
        $validated = $request->validate([
            'national_insight_center_info_id' => 'required|exists:national_insight_center_infos,id',
            'info_category_id' => 'nullable|exists:info_categories,id',
            'department_id' => 'nullable|exists:departments,id',
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'value' => 'nullable|array',
            'user_id' => 'nullable|exists:users,id',
        ]);

        try {
            $nationalInsightCenterInfoItem->update([
                'national_insight_center_info_id' => $validated['national_insight_center_info_id'],
                'info_category_id' => $validated['info_category_id'],
                'department_id' => $validated['department_id'],
                'name' => $validated['name'],
                'code' => $validated['code'],
                'description' => $validated['description'],
                'value' => $validated['value'],
                'user_id' => $validated['user_id'],
            ]);

            return redirect()
                ->route('national-insight-center-info-items.show', $nationalInsightCenterInfoItem)
                ->with('success', 'National Insight Center Info Item updated successfully.');

        } catch (\Exception $e) {
            Log::error('Failed to update national insight center info item', [
                'error' => $e->getMessage(),
                'item_id' => $nationalInsightCenterInfoItem->id,
                'data' => $validated
            ]);

            return redirect()
                ->back()
                ->with('error', 'Failed to update national insight center info item. Please try again.')
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(NationalInsightCenterInfoItem $nationalInsightCenterInfoItem): RedirectResponse
    {
        $this->authorize('delete', $nationalInsightCenterInfoItem);
        
        try {
            $nationalInsightCenterInfoItem->delete();

            return redirect()
                ->route('national-insight-center-info-items.index')
                ->with('success', 'National Insight Center Info Item deleted successfully.');

        } catch (\Exception $e) {
            Log::error('Failed to delete national insight center info item', [
                'error' => $e->getMessage(),
                'item_id' => $nationalInsightCenterInfoItem->id
            ]);

            return redirect()
                ->back()
                ->with('error', 'Failed to delete national insight center info item. Please try again.');
        }
    }

    /**
     * Confirm the specified resource.
     */
    public function confirm(NationalInsightCenterInfoItem $nationalInsightCenterInfoItem): RedirectResponse
    {
        $this->authorize('confirm', $nationalInsightCenterInfoItem);
        
        try {
            $nationalInsightCenterInfoItem->update([
                'confirmed' => true,
                'confirmed_by' => Auth::id(),
            ]);

            return redirect()
                ->back()
                ->with('success', 'National Insight Center Info Item confirmed successfully.');

        } catch (\Exception $e) {
            Log::error('Failed to confirm national insight center info item', [
                'error' => $e->getMessage(),
                'item_id' => $nationalInsightCenterInfoItem->id
            ]);

            return redirect()
                ->back()
                ->with('error', 'Failed to confirm national insight center info item. Please try again.');
        }
    }

    /**
     * Show the form for managing statistics.
     */
    public function manageStats(NationalInsightCenterInfoItem $nationalInsightCenterInfoItem): Response
    {
        $this->authorize('update', $nationalInsightCenterInfoItem);
        
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
        $nationalInsightCenterInfoItem->load(['infoStats.statCategoryItem.category']);

        return Inertia::render('NationalInsightCenterInfoItem/ManageStats', [
            'item' => $nationalInsightCenterInfoItem,
            'statItems' => $statItems,
            'statCategories' => $statCategories,
        ]);
    }

    /**
     * Update statistics for a specific national insight center info item.
     */
    public function updateStats(Request $request, NationalInsightCenterInfoItem $nationalInsightCenterInfoItem): RedirectResponse
    {
        $this->authorize('update', $nationalInsightCenterInfoItem);
        
        $validated = $request->validate([
            'stats' => 'required|array|min:1',
            'stats.*.stat_category_item_id' => 'required|integer|exists:stat_category_items,id',
            'stats.*.value' => 'required|string|max:255',
            'stats.*.notes' => 'nullable|string|max:1000',
        ]);

        try {
            DB::transaction(function () use ($nationalInsightCenterInfoItem, $validated) {
                $this->updateInfoStats($nationalInsightCenterInfoItem, $validated['stats']);
            });

            return redirect()
                ->route('national-insight-center-info-items.show', $nationalInsightCenterInfoItem)
                ->with('success', 'Statistics updated successfully.');

        } catch (\Exception $e) {
            Log::error('Failed to update national insight center info item statistics', [
                'error' => $e->getMessage(),
                'item_id' => $nationalInsightCenterInfoItem->id,
                'stats_data' => $validated['stats'] ?? []
            ]);

            return redirect()
                ->back()
                ->with('error', 'Failed to update statistics. Please try again.')
                ->withInput();
        }
    }

    /**
     * Create info stats for the national insight center info item.
     */
    private function createInfoStats(NationalInsightCenterInfoItem $nationalInsightCenterInfoItem, array $stats): void
    {
        foreach ($stats as $stat) {
            $nationalInsightCenterInfoItem->infoStats()->create([
                'stat_category_item_id' => $stat['stat_category_item_id'],
                'string_value' => $stat['value'],
                'notes' => $stat['notes'] ?? null,
            ]);
        }
    }

    /**
     * Update info stats for the national insight center info item.
     */
    private function updateInfoStats(NationalInsightCenterInfoItem $nationalInsightCenterInfoItem, array $stats): void
    {
        // Delete existing stats
        $nationalInsightCenterInfoItem->infoStats()->delete();

        // Create new stats
        $this->createInfoStats($nationalInsightCenterInfoItem, $stats);
    }
}
