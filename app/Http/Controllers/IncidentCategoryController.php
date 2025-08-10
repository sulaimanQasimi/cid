<?php

namespace App\Http\Controllers;

use App\Models\IncidentCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class IncidentCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', IncidentCategory::class);
        
        $categories = IncidentCategory::orderBy('name')
            ->withCount('incidents')
            ->paginate(10);

        return Inertia::render('Incidents/Categories/Index', [
            'categories' => $categories,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', IncidentCategory::class);
        
        return Inertia::render('Incidents/Categories/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', IncidentCategory::class);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:50',
            'severity_level' => 'nullable|integer|min:1|max:5',
            'status' => 'required|string|in:active,inactive',
        ]);

        $validated['created_by'] = Auth::id();

        IncidentCategory::create($validated);

        return redirect()->route('incident-categories.index')
            ->with('success', 'Incident category created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(IncidentCategory $incidentCategory)
    {
        $this->authorize('view', $incidentCategory);
        
        $incidentCategory->load(['creator']);
        $incidentCategory->loadCount('incidents');

        return Inertia::render('Incidents/Categories/Show', [
            'category' => $incidentCategory,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(IncidentCategory $incidentCategory)
    {
        $this->authorize('update', $incidentCategory);
        
        return Inertia::render('Incidents/Categories/Edit', [
            'category' => $incidentCategory,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, IncidentCategory $incidentCategory)
    {
        $this->authorize('update', $incidentCategory);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:50',
            'severity_level' => 'nullable|integer|min:1|max:5',
            'status' => 'required|string|in:active,inactive',
        ]);

        $incidentCategory->update($validated);

        return redirect()->route('incident-categories.index')
            ->with('success', 'Incident category updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(IncidentCategory $incidentCategory)
    {
        $this->authorize('delete', $incidentCategory);
        
        $incidentCategory->delete();

        return redirect()->route('incident-categories.index')
            ->with('success', 'Incident category deleted successfully.');
    }
}
