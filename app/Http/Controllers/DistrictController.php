<?php

namespace App\Http\Controllers;

use App\Models\District;
use App\Models\Province;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DistrictController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $districts = District::with(['creator:id,name', 'province:id,name'])
            ->orderBy('name', 'asc')
            ->paginate(10);

        $provinces = Province::where('status', 'active')
            ->orderBy('name', 'asc')
            ->get(['id', 'name']);

        return Inertia::render('District/Index', [
            'districts' => $districts,
            'provinces' => $provinces,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $provinces = Province::where('status', 'active')
            ->orderBy('name', 'asc')
            ->get(['id', 'name']);

        return Inertia::render('District/Create', [
            'provinces' => $provinces,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'province_id' => 'required|exists:provinces,id',
            'code' => 'required|string|max:10|unique:districts',
            'description' => 'nullable|string',
            'status' => 'required|string|in:active,inactive',
        ]);

        $validated['created_by'] = Auth::id();

        $district = District::create($validated);

        return redirect()->route('districts.show', $district)
            ->with('success', 'District created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(District $district)
    {
        $district->load(['creator:id,name', 'province:id,name,code']);

        $incidents = $district->incidents()
            ->with(['category:id,name,color'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('District/Show', [
            'district' => $district,
            'incidents' => $incidents,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(District $district)
    {
        $provinces = Province::where('status', 'active')
            ->orderBy('name', 'asc')
            ->get(['id', 'name']);

        return Inertia::render('District/Edit', [
            'district' => $district,
            'provinces' => $provinces,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, District $district)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'province_id' => 'required|exists:provinces,id',
            'code' => 'required|string|max:10|unique:districts,code,' . $district->id,
            'description' => 'nullable|string',
            'status' => 'required|string|in:active,inactive',
        ]);

        $district->update($validated);

        return redirect()->route('districts.show', $district)
            ->with('success', 'District updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(District $district)
    {
        // Check if there are related incidents
        if ($district->incidents()->count() > 0) {
            return redirect()->route('districts.index')
                ->with('error', 'Cannot delete district with related incidents. Please reassign or delete all incidents first.');
        }

        $district->delete();

        return redirect()->route('districts.index')
            ->with('success', 'District deleted successfully.');
    }
}
