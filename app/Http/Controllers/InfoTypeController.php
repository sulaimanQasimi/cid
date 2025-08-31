<?php

namespace App\Http\Controllers;

use App\Models\InfoType;
use App\Models\Info;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\StatCategoryItem;
use App\Models\StatCategory;
use App\Models\InfoStat;

class InfoTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', InfoType::class);
        
        $query = InfoType::with(['creator:id,name'])
            ->withCount(['infos', 'infoStats']);

        // Apply search filter
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('code', 'like', "%{$searchTerm}%")
                  ->orWhere('description', 'like', "%{$searchTerm}%");
            });
        }

        // Apply sorting
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');

        // Ensure valid sort field to prevent SQL injection
        $allowedSortFields = [
            'name',
            'code',
            'description',
            'created_at',
            'updated_at'
        ];

        // Handle special case for infos_count which requires a subquery
        if ($sortField === 'infos_count') {
            $query->withCount('infos');
            $query->orderBy('infos_count', $sortDirection);
        } else {
            // Default sorting for other fields
            if (!in_array($sortField, $allowedSortFields)) {
                $sortField = 'created_at';
            }

            // Ensure valid sort direction
            $sortDirection = strtolower($sortDirection) === 'asc' ? 'asc' : 'desc';

            $query->orderBy($sortField, $sortDirection);
        }

        $infoTypes = $query->paginate(10)
                        ->withQueryString(); // Preserve the query parameters in pagination links

        return Inertia::render('Info/Types/Index', [
            'infoTypes' => $infoTypes,
            'filters' => $request->only(['search', 'sort_field', 'sort_direction']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', InfoType::class);
        
        // Get active statistical categories
        $statCategories = StatCategory::where('status', 'active')
            ->orderBy('label')
            ->get();

        // Get active statistical category items with parent-child relationships
        $statItems = StatCategoryItem::with(['category', 'parent'])
            ->withCount('children')  // Add count of children
            ->whereHas('category', function ($query) {
                $query->where('status', 'active');
            })
            ->where('status', 'active')
            ->orderBy('order')
            ->get()
            ->map(function ($item) {
                // Convert to array and include essential fields for tree view
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'label' => $item->label,
                    'color' => $item->color,
                    'parent_id' => $item->parent_id,
                    'children_count' => $item->children_count,
                    'category' => [
                        'id' => $item->category->id,
                        'name' => $item->category->name,
                        'label' => $item->category->label,
                        'color' => $item->category->color,
                    ]
                ];
            });

        return Inertia::render('Info/Types/Create', [
            'statItems' => $statItems,
            'statCategories' => $statCategories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', InfoType::class);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:info_types',
            'code' => 'nullable|string|max:50|unique:info_types',
            'description' => 'nullable|string',
            'stats' => 'nullable|array',
            'stats.*.stat_category_item_id' => 'required|exists:stat_category_items,id',
            'stats.*.value' => 'required',
            'stats.*.notes' => 'nullable|string|max:1000',
        ]);

        $validated['created_by'] = Auth::id();

        $infoType = InfoType::create($validated);

        // Create info stats if provided
        if (!empty($validated['stats'])) {
            foreach ($validated['stats'] as $stat) {
                $infoStat = new InfoStat();
                $infoStat->info_type_id = $infoType->id;
                $infoStat->stat_category_item_id = $stat['stat_category_item_id'];
                $infoStat->setValue($stat['value']);
                $infoStat->notes = $stat['notes'] ?? null;
                $infoStat->created_by = Auth::id();
                $infoStat->save();
            }
        }

        return redirect()->route('info-types.show', $infoType)
            ->with('success', 'Info type created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(InfoType $infoType)
    {
        $this->authorize('view', $infoType);
        
        $infoType->load(['creator:id,name']);

        $infos = $infoType->infos()
            ->with(['infoType:id,name', 'infoCategory:id,name,color'])
            ->orderBy('created_at', 'desc')
            ->paginate(5);

        // Get all active stat categories
        $statCategories = StatCategory::where('status', 'active')
            ->orderBy('label')
            ->get();

        // Load info stats with their related items and categories
        $infoStats = $infoType->infoStats()
            ->with(['statCategoryItem.category'])
            ->get();

        return Inertia::render('Info/Types/Show', [
            'infoType' => $infoType,
            'infos' => $infos,
            'infoStats' => $infoStats,
            'statCategories' => $statCategories,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(InfoType $infoType)
    {
        $this->authorize('update', $infoType);
        
        // Get active statistical categories
        $statCategories = StatCategory::where('status', 'active')
            ->orderBy('label')
            ->get();

        // Get active statistical category items with parent-child relationships
        $statItems = StatCategoryItem::with(['category', 'parent'])
            ->withCount('children')  // Add count of children
            ->whereHas('category', function ($query) {
                $query->where('status', 'active');
            })
            ->where('status', 'active')
            ->orderBy('order')
            ->get()
            ->map(function ($item) {
                // Convert to array and include essential fields for tree view
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'label' => $item->label,
                    'color' => $item->color,
                    'parent_id' => $item->parent_id,
                    'children_count' => $item->children_count,
                    'category' => [
                        'id' => $item->category->id,
                        'name' => $item->category->name,
                        'label' => $item->category->label,
                        'color' => $item->category->color,
                    ]
                ];
            });

        // Load info stats with their related items and categories
        $infoStats = $infoType->infoStats()
            ->with(['statCategoryItem.category'])
            ->get();

        return Inertia::render('Info/Types/Edit', [
            'infoType' => $infoType,
            'statItems' => $statItems,
            'infoStats' => $infoStats,
            'statCategories' => $statCategories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, InfoType $infoType)
    {
        $this->authorize('update', $infoType);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:info_types,name,' . $infoType->id,
            'code' => 'nullable|string|max:50|unique:info_types,code,' . $infoType->id,
            'description' => 'nullable|string',
            'stats' => 'nullable|array',
            'stats.*.stat_category_item_id' => 'required|exists:stat_category_items,id',
            'stats.*.value' => 'required',
            'stats.*.notes' => 'nullable|string|max:1000',
        ]);

        $validated['updated_by'] = Auth::id();

        $infoType->update($validated);

        // Update info stats if provided
        if (isset($validated['stats'])) {
            // Delete existing stats
            $infoType->infoStats()->delete();
            
            // Create new stats
            if (!empty($validated['stats'])) {
                foreach ($validated['stats'] as $stat) {
                    $infoStat = new InfoStat();
                    $infoStat->info_type_id = $infoType->id;
                    $infoStat->stat_category_item_id = $stat['stat_category_item_id'];
                    $infoStat->setValue($stat['value']);
                    $infoStat->notes = $stat['notes'] ?? null;
                    $infoStat->created_by = Auth::id();
                    $infoStat->updated_by = Auth::id();
                    $infoStat->save();
                }
            }
        }

        return redirect()->route('info-types.show', $infoType)
            ->with('success', 'Info type updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(InfoType $infoType)
    {
        $this->authorize('delete', InfoType::class);
        
        // Stats will be automatically deleted due to cascade delete in migration
        $infoType->delete();

        return redirect()->route('info-types.index')
            ->with('success', 'Info type deleted successfully.');
    }

    /**
     * Manage stats for a specific info type.
     */
    public function manageStats(InfoType $infoType)
    {
        $this->authorize('update', $infoType);
        
        // Get active statistical categories
        $statCategories = StatCategory::where('status', 'active')
            ->orderBy('label')
            ->get();

        // Get active statistical category items
        $statItems = StatCategoryItem::with(['category'])
            ->whereHas('category', function ($query) {
                $query->where('status', 'active');
            })
            ->where('status', 'active')
            ->orderBy('order')
            ->get();

        // Load current stats with relationships
        $infoType->load(['infoStats.statCategoryItem.category']);

        return Inertia::render('Info/Types/ManageStats', [
            'infoType' => $infoType,
            'statItems' => $statItems,
            'statCategories' => $statCategories,
        ]);
    }

    /**
     * Update stats for a specific info type.
     */
    public function updateStats(Request $request, InfoType $infoType)
    {
        $this->authorize('update', $infoType);
        
        $validated = $request->validate([
            'stats' => 'nullable|array',
            'stats.*.stat_category_item_id' => 'required|exists:stat_category_items,id',
            'stats.*.value' => 'required|string',
            'stats.*.notes' => 'nullable|string|max:1000',
        ]);

        try {
            \Log::info('=== STATS UPDATE STARTED ===', [
                'info_type_id' => $infoType->id,
                'stats_count' => count($validated['stats'] ?? []),
                'stats_data' => $validated['stats'] ?? []
            ]);
            
            \DB::transaction(function () use ($validated, $infoType) {
                // First, get all existing stats for this info type (including soft-deleted)
                $existingStats = InfoStat::withTrashed()
                    ->where('info_type_id', $infoType->id)
                    ->get()
                    ->keyBy('stat_category_item_id');
                
                $processedItemIds = [];
                
                // Process each stat in the request
                if (!empty($validated['stats'])) {
                    foreach ($validated['stats'] as $statData) {
                        $itemId = $statData['stat_category_item_id'];
                        $processedItemIds[] = $itemId;
                        
                        if (isset($existingStats[$itemId])) {
                            // Update existing stat (restore if soft-deleted)
                            $existingStat = $existingStats[$itemId];
                            if ($existingStat->trashed()) {
                                $existingStat->restore();
                            }
                            $existingStat->setValue($statData['value']);
                            $existingStat->notes = $statData['notes'] ?? null;
                            $existingStat->updated_by = Auth::id();
                            $existingStat->save();
                        } else {
                            // Create new stat
                            InfoStat::create([
                                'info_type_id' => $infoType->id,
                                'stat_category_item_id' => $itemId,
                                'string_value' => $statData['value'],
                                'notes' => $statData['notes'] ?? null,
                                'created_by' => Auth::id(),
                                'updated_by' => Auth::id(),
                            ]);
                        }
                    }
                }
                
                // Soft delete stats that are no longer in the request
                $infoType->infoStats()
                    ->whereNotIn('stat_category_item_id', $processedItemIds)
                    ->delete();
            });

            \Log::info('=== STATS UPDATE COMPLETED ===', [
                'info_type_id' => $infoType->id
            ]);

            return redirect()->route('info-types.show', $infoType)
                ->with('success', 'Stats updated successfully.');
                
        } catch (\Exception $e) {
            \Log::error('Stats update failed: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Failed to update stats. Please try again.')
                ->withInput();
        }
    }

    /**
     * Display infos for a specific info type.
     */
    public function showInfos(InfoType $infoType)
    {
        $infoType->load(['creator:id,name']);
        $infos = $infoType->infos()
            ->with(['infoType:id,name', 'infoCategory:id,name,color'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Info/Types/Infos', [
            'infoType' => $infoType,
            'infos' => $infos,
        ]);
    }
}
