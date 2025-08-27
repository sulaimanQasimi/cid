<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StatCategory;
use App\Models\StatCategoryItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StatCategoryItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', StatCategoryItem::class);
        
        $categoryId = $request->query('category_id');

        $query = StatCategoryItem::with(['category', 'creator', 'parent', 'children']);

        if ($categoryId) {
            $query->where('stat_category_id', $categoryId);
        }

        $items = $query->orderBy('order')->paginate(10);
        $categories = StatCategory::where('status', 'active')->get(['id', 'name', 'label']);

        return Inertia::render('Admin/StatCategoryItem/Index', [
            'items' => $items,
            'categories' => $categories,
            'filter' => [
                'category_id' => $categoryId,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $this->authorize('create', StatCategoryItem::class);
        
        $categoryId = $request->query('category_id');
        $categories = StatCategory::where('status', 'active')->get(['id', 'name', 'label', 'color']);

        // Get potential parent items (same category if category_id is provided)
        $parentItems = [];
        if ($categoryId) {
            $parentItems = StatCategoryItem::where('stat_category_id', $categoryId)
                ->where('status', 'active')
                ->orderBy('order')
                ->get(['id', 'name', 'label']);
        }

        return Inertia::render('Admin/StatCategoryItem/Create', [
            'categories' => $categories,
            'preselected_category_id' => $categoryId,
            'parentItems' => $parentItems,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', StatCategoryItem::class);
        
        $validated = $request->validate([
            'stat_category_id' => 'required|exists:stat_categories,id',
            'parent_id' => 'nullable|string',
            'name' => 'required|string|max:50',
            'label' => 'required|string|max:100',
            'color' => 'nullable|string|max:20',
            'status' => 'required|in:active,inactive',
            'order' => 'nullable|integer|min:0',
        ]);

        // Check if name is unique within the category
        $exists = StatCategoryItem::where('stat_category_id', $validated['stat_category_id'])
            ->where('name', $validated['name'])
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'name' => 'The name must be unique within the selected category.',
            ])->withInput();
        }

        // Handle 'null' string value for parent_id
        if (isset($validated['parent_id']) && $validated['parent_id'] === 'null') {
            $validated['parent_id'] = null;
        }

        // If parent_id is provided and not null, validate it exists and belongs to the same category
        if (!empty($validated['parent_id']) && $validated['parent_id'] !== null) {
            $parent = StatCategoryItem::find($validated['parent_id']);
            if (!$parent) {
                return back()->withErrors([
                    'parent_id' => 'The selected parent item does not exist.',
                ])->withInput();
            }
            
            if ($parent->stat_category_id != $validated['stat_category_id']) {
                return back()->withErrors([
                    'parent_id' => 'The parent item must belong to the same category.',
                ])->withInput();
            }
        }

        $validated['created_by'] = Auth::id();

        // If order not specified, put at the end
        if (!isset($validated['order'])) {
            $maxOrder = StatCategoryItem::where('stat_category_id', $validated['stat_category_id'])
                ->max('order');
            $validated['order'] = $maxOrder ? $maxOrder + 1 : 0;
        }

        $item = StatCategoryItem::create($validated);

        // Check redirect preference from query parameters
        $redirectToCategory = $request->query('redirect_to_category') === 'true';

        if ($redirectToCategory) {
            return redirect()->route('stat-categories.show', $item->stat_category_id)
                ->with('success', 'Item created successfully.');
        }

        return redirect()->route('stat-category-items.index', ['category_id' => $item->stat_category_id])
            ->with('success', 'Item created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(StatCategoryItem $statCategoryItem)
    {
        $this->authorize('view', $statCategoryItem);
        
        $statCategoryItem->load(['category', 'creator', 'parent', 'children']);
        $hasChildren = $statCategoryItem->children->count() > 0;

        return Inertia::render('Admin/StatCategoryItem/Show', [
            'item' => $statCategoryItem,
            'hasChildren' => $hasChildren
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(StatCategoryItem $statCategoryItem)
    {
        $this->authorize('update', $statCategoryItem);
        
        $categories = StatCategory::where('status', 'active')->get(['id', 'name', 'label', 'color']);

        // Get potential parent items (same category, excluding the current item and its children)
        $parentItems = StatCategoryItem::where('stat_category_id', $statCategoryItem->stat_category_id)
            ->where('id', '!=', $statCategoryItem->id)
            ->where('status', 'active')
            ->orderBy('order')
            ->get(['id', 'name', 'label']);

        // Load children to check if this item has any
        $statCategoryItem->load('children');
        $hasChildren = $statCategoryItem->children->count() > 0;

        return Inertia::render('Admin/StatCategoryItem/Edit', [
            'item' => $statCategoryItem,
            'categories' => $categories,
            'parentItems' => $parentItems,
            'hasChildren' => $hasChildren
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, StatCategoryItem $statCategoryItem)
    {
        $this->authorize('update', $statCategoryItem);
        
        $validated = $request->validate([
            'stat_category_id' => 'required|exists:stat_categories,id',
            'parent_id' => 'nullable|string',
            'name' => 'required|string|max:50',
            'label' => 'required|string|max:100',
            'color' => 'nullable|string|max:20',
            'status' => 'required|in:active,inactive',
            'order' => 'nullable|integer|min:0',
        ]);

        // Check if name is unique within the category (except current item)
        $exists = StatCategoryItem::where('stat_category_id', $validated['stat_category_id'])
            ->where('name', $validated['name'])
            ->where('id', '!=', $statCategoryItem->id)
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'name' => 'The name must be unique within the selected category.',
            ])->withInput();
        }

        // Handle 'null' string value for parent_id
        if (isset($validated['parent_id']) && $validated['parent_id'] === 'null') {
            $validated['parent_id'] = null;
        }

        // If parent_id is provided and not null, validate it exists and belongs to the same category
        if (!empty($validated['parent_id']) && $validated['parent_id'] !== null) {
            if ($validated['parent_id'] == $statCategoryItem->id) {
                return back()->withErrors([
                    'parent_id' => 'An item cannot be its own parent.',
                ])->withInput();
            }

            $parent = StatCategoryItem::find($validated['parent_id']);
            if (!$parent) {
                return back()->withErrors([
                    'parent_id' => 'The selected parent item does not exist.',
                ])->withInput();
            }
            
            if ($parent->stat_category_id != $validated['stat_category_id']) {
                return back()->withErrors([
                    'parent_id' => 'The parent item must belong to the same category.',
                ])->withInput();
            }
        }

        // Check if item has children - if so, then prevent value assignment
        $hasChildren = $statCategoryItem->children()->count() > 0;

        // Set valuedata field to null if the item has children
        if ($hasChildren) {
            // Additional logic could be implemented here if needed
            // For example, to prevent certain fields from being modified if the item has children
        }

        $statCategoryItem->update($validated);

        // Check redirect preference from query parameters
        $redirectToCategory = $request->query('redirect_to_category') === 'true';

        if ($redirectToCategory) {
            return redirect()->route('stat-categories.show', $statCategoryItem->stat_category_id)
                ->with('success', 'Item updated successfully.');
        }

        return redirect()->route('stat-category-items.show', $statCategoryItem)
            ->with('success', 'Item updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StatCategoryItem $statCategoryItem)
    {
        $this->authorize('delete', $statCategoryItem);
        
        // Check if item has children
        if ($statCategoryItem->children()->count() > 0) {
            return back()->with('error', 'Cannot delete an item that has children.');
        }

        $categoryId = $statCategoryItem->stat_category_id;
        $statCategoryItem->delete();

        return redirect()->route('stat-category-items.index', ['category_id' => $categoryId])
            ->with('success', 'Item deleted successfully.');
    }

    /**
     * Reorder the items within a category.
     */
    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:stat_category_items,id',
            'items.*.order' => 'required|integer|min:0',
        ]);

        foreach ($validated['items'] as $item) {
            StatCategoryItem::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return response()->json(['message' => 'Items reordered successfully']);
    }
}
