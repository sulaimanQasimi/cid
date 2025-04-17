<?php

namespace App\Http\Controllers;

use App\Models\Incident;
use App\Models\IncidentCategory;
use App\Models\IncidentReport;
use App\Models\District;
use App\Models\Province;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class IncidentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $incidents = Incident::with([
            'district:id,name',
            'district.province:id,name',
            'category:id,name,color',
            'report:id,report_number',
        ])
        ->orderBy('incident_date', 'desc')
        ->paginate(10);

        return Inertia::render('Incidents/Index', [
            'incidents' => $incidents,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $districts = District::with('province:id,name')
            ->orderBy('name')
            ->get();

        $categories = IncidentCategory::where('status', 'active')
            ->orderBy('name')
            ->get();

        $reports = IncidentReport::select('id', 'report_number', 'report_date')
            ->orderBy('report_date', 'desc')
            ->get();

        return Inertia::render('Incidents/Create', [
            'districts' => $districts,
            'categories' => $categories,
            'reports' => $reports,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'incident_date' => 'required|date',
            'incident_time' => 'nullable|date_format:H:i',
            'district_id' => 'required|exists:districts,id',
            'incident_category_id' => 'required|exists:incident_categories,id',
            'incident_report_id' => 'nullable|exists:incident_reports,id',
            'location' => 'nullable|string|max:255',
            'coordinates' => 'nullable|string|max:255',
            'casualties' => 'nullable|integer|min:0',
            'injuries' => 'nullable|integer|min:0',
            'incident_type' => 'required|string|max:255',
            'status' => 'required|string|in:reported,investigating,resolved,closed',
        ]);

        $validated['reported_by'] = Auth::id();

        $incident = Incident::create($validated);

        return redirect()->route('incidents.show', $incident)
            ->with('success', 'Incident created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Incident $incident)
    {
        $incident->load([
            'district',
            'district.province',
            'category',
            'report',
            'reporter:id,name',
        ]);

        return Inertia::render('Incidents/Show', [
            'incident' => $incident,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Incident $incident)
    {
        $districts = District::with('province:id,name')
            ->orderBy('name')
            ->get();

        $categories = IncidentCategory::where('status', 'active')
            ->orderBy('name')
            ->get();

        $reports = IncidentReport::select('id', 'report_number', 'report_date')
            ->orderBy('report_date', 'desc')
            ->get();

        return Inertia::render('Incidents/Edit', [
            'incident' => $incident,
            'districts' => $districts,
            'categories' => $categories,
            'reports' => $reports,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Incident $incident)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'incident_date' => 'required|date',
            'incident_time' => 'nullable|date_format:H:i',
            'district_id' => 'required|exists:districts,id',
            'incident_category_id' => 'required|exists:incident_categories,id',
            'incident_report_id' => 'nullable|exists:incident_reports,id',
            'location' => 'nullable|string|max:255',
            'coordinates' => 'nullable|string|max:255',
            'casualties' => 'nullable|integer|min:0',
            'injuries' => 'nullable|integer|min:0',
            'incident_type' => 'required|string|max:255',
            'status' => 'required|string|in:reported,investigating,resolved,closed',
        ]);

        $incident->update($validated);

        return redirect()->route('incidents.show', $incident)
            ->with('success', 'Incident updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Incident $incident)
    {
        $incident->delete();

        return redirect()->route('incidents.index')
            ->with('success', 'Incident deleted successfully.');
    }

    /**
     * Link an incident to a report.
     */
    public function linkToReport(Incident $incident, IncidentReport $report)
    {
        $incident->update(['incident_report_id' => $report->id]);

        return redirect()->route('incidents.show', $incident)
            ->with('success', 'Incident linked to report successfully.');
    }
}
