<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StatCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StatCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = StatCategory::with('creator')
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/StatCategory/Index', [
            'categories' => $categories,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/StatCategory/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50|unique:stat_categories',
            'label' => 'required|string|max:100',
            'color' => 'required|string|max:20',
            'status' => 'required|in:active,inactive',
        ]);

        $validated['created_by'] = Auth::id();

        $category = StatCategory::create($validated);

        return redirect()->route('stat-categories.index')
            ->with('success', 'Category created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(StatCategory $statCategory)
    {
        $statCategory->load(['creator', 'items']);

        return Inertia::render('Admin/StatCategory/Show', [
            'category' => $statCategory
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(StatCategory $statCategory)
    {
        return Inertia::render('Admin/StatCategory/Edit', [
            'category' => $statCategory
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, StatCategory $statCategory)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50|unique:stat_categories,name,' . $statCategory->id,
            'label' => 'required|string|max:100',
            'color' => 'required|string|max:20',
            'status' => 'required|in:active,inactive',
        ]);

        $statCategory->update($validated);

        return redirect()->route('stat-categories.show', $statCategory)
            ->with('success', 'Category updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StatCategory $statCategory)
    {
        $statCategory->delete();

        return redirect()->route('stat-categories.index')
            ->with('success', 'Category deleted successfully.');
    }
}
