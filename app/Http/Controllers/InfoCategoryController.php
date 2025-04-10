<?php

namespace App\Http\Controllers;

use App\Models\InfoCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class InfoCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Info/Categories/Index', [
            'infoCategories' => InfoCategory::orderBy('name')->paginate(10),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Info/Categories/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:255|unique:info_categories,code',
            'description' => 'nullable|string|max:255',
        ]);

        InfoCategory::create($validated);

        return Redirect::route('info-categories.index')->with('success', 'Info category created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(InfoCategory $infoCategory)
    {
        return Inertia::render('Info/Categories/Show', [
            'infoCategory' => $infoCategory,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(InfoCategory $infoCategory)
    {
        return Inertia::render('Info/Categories/Edit', [
            'infoCategory' => $infoCategory,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, InfoCategory $infoCategory)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:255|unique:info_categories,code,' . $infoCategory->id,
            'description' => 'nullable|string|max:255',
        ]);

        $infoCategory->update($validated);

        return Redirect::route('info-categories.index')->with('success', 'Info category updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(InfoCategory $infoCategory)
    {
        $infoCategory->delete();

        return Redirect::route('info-categories.index')->with('success', 'Info category deleted successfully.');
    }
}
