<?php

namespace App\Http\Controllers;

use App\Models\Province;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProvinceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $provinces = Province::with('creator:id,name')
            ->orderBy('name', 'asc')
            ->paginate(10);

        return Inertia::render('Province/Index', [
            'provinces' => $provinces,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Province/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:provinces',
            'description' => 'nullable|string',
            'governor' => 'nullable|string|max:255',
            'capital' => 'nullable|string|max:255',
            'status' => 'required|string|in:active,inactive',
        ]);

        $validated['created_by'] = Auth::id();

        $province = Province::create($validated);

        return redirect()->route('provinces.show', $province)
            ->with('success', 'Province created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Province $province)
    {
        $province->load('creator:id,name');

        $districts = $province->districts()
            ->with('creator:id,name')
            ->orderBy('name', 'asc')
            ->paginate(10);

        return Inertia::render('Province/Show', [
            'province' => $province,
            'districts' => $districts,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Province $province)
    {
        return Inertia::render('Province/Edit', [
            'province' => $province,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Province $province)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:provinces,code,' . $province->id,
            'description' => 'nullable|string',
            'governor' => 'nullable|string|max:255',
            'capital' => 'nullable|string|max:255',
            'status' => 'required|string|in:active,inactive',
        ]);

        $province->update($validated);

        return redirect()->route('provinces.show', $province)
            ->with('success', 'Province updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Province $province)
    {
        // Check if there are related districts
        if ($province->districts()->count() > 0) {
            return redirect()->route('provinces.index')
                ->with('error', 'Cannot delete province with related districts. Please delete all districts first.');
        }

        $province->delete();

        return redirect()->route('provinces.index')
            ->with('success', 'Province deleted successfully.');
    }
}
