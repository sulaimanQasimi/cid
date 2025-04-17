<?php

namespace App\Http\Controllers;

use App\Models\IncidentReport;
use App\Models\Incident;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\StatCategoryItem;
use App\Models\ReportStat;

class IncidentReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reports = IncidentReport::with(['submitter:id,name'])
            ->withCount('incidents')
            ->orderBy('report_date', 'desc')
            ->paginate(10);

        return Inertia::render('Incidents/Reports/Index', [
            'reports' => $reports,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $statItems = StatCategoryItem::with('category')
            ->whereHas('category', function ($query) {
                $query->where('status', 'active');
            })
            ->where('status', 'active')
            ->orderBy('order')
            ->get();

        return Inertia::render('Incidents/Reports/Create', [
            'statItems' => $statItems,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'report_number' => 'nullable|string|max:255',
            'details' => 'required|string',
            'action_taken' => 'nullable|string',
            'recommendation' => 'nullable|string',
            'security_level' => 'required|string|in:normal,restricted,classified',
            'report_date' => 'required|date',
            'report_status' => 'required|string|in:submitted,reviewed,approved',
            'source' => 'nullable|string',
            'attachments' => 'nullable|array',
            'stats' => 'nullable|array',
            'stats.*.stat_category_item_id' => 'required|exists:stat_category_items,id',
            'stats.*.value' => 'required',
            'stats.*.notes' => 'nullable|string|max:1000',
        ]);

        $validated['submitted_by'] = Auth::id();

        // Generate a unique report number if not provided
        if (empty($validated['report_number'])) {
            $validated['report_number'] = 'RPT-' . date('Y') . '-' . str_pad(IncidentReport::count() + 1, 4, '0', STR_PAD_LEFT);
        }

        $report = IncidentReport::create($validated);

        // Create report stats if provided
        if (!empty($validated['stats'])) {
            foreach ($validated['stats'] as $stat) {
                $reportStat = new ReportStat();
                $reportStat->incident_report_id = $report->id;
                $reportStat->stat_category_item_id = $stat['stat_category_item_id'];
                $reportStat->setValue($stat['value']);
                $reportStat->notes = $stat['notes'] ?? null;
                $reportStat->created_by = Auth::id();
                $reportStat->save();
            }
        }

        return redirect()->route('incident-reports.show', $report)
            ->with('success', 'Incident report created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(IncidentReport $incidentReport)
    {
        $incidentReport->load(['submitter:id,name', 'approver:id,name']);

        $incidents = $incidentReport->incidents()
            ->with(['district:id,name', 'category:id,name,color'])
            ->orderBy('incident_date', 'desc')
            ->paginate(5);

        $reportStats = $incidentReport->reportStats()
            ->with(['statCategoryItem.category'])
            ->get();

        return Inertia::render('Incidents/Reports/Show', [
            'report' => $incidentReport,
            'incidents' => $incidents,
            'reportStats' => $reportStats,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(IncidentReport $incidentReport)
    {
        $statItems = StatCategoryItem::with('category')
            ->whereHas('category', function ($query) {
                $query->where('status', 'active');
            })
            ->where('status', 'active')
            ->orderBy('order')
            ->get();

        $reportStats = $incidentReport->reportStats()
            ->with(['statCategoryItem.category'])
            ->get();

        return Inertia::render('Incidents/Reports/Edit', [
            'report' => $incidentReport,
            'statItems' => $statItems,
            'reportStats' => $reportStats,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, IncidentReport $incidentReport)
    {
        $validated = $request->validate([
            'report_number' => 'nullable|string|max:255',
            'details' => 'required|string',
            'action_taken' => 'nullable|string',
            'recommendation' => 'nullable|string',
            'security_level' => 'required|string|in:normal,restricted,classified',
            'report_date' => 'required|date',
            'report_status' => 'required|string|in:submitted,reviewed,approved',
            'source' => 'nullable|string',
            'attachments' => 'nullable|array',
            'approved_by' => 'nullable|exists:users,id',
        ]);

        // Set approved_by if status is changed to approved
        if ($validated['report_status'] === 'approved' && $incidentReport->report_status !== 'approved') {
            $validated['approved_by'] = Auth::id();
        }

        $incidentReport->update($validated);

        return redirect()->route('incident-reports.show', $incidentReport)
            ->with('success', 'Incident report updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(IncidentReport $incidentReport)
    {
        $incidentReport->delete();

        return redirect()->route('incident-reports.index')
            ->with('success', 'Incident report deleted successfully.');
    }

    /**
     * Display incidents for a specific report.
     */
    public function showIncidents(IncidentReport $incidentReport)
    {
        $incidentReport->load(['submitter:id,name']);
        $incidents = $incidentReport->incidents()
            ->with(['district:id,name', 'category:id,name,color'])
            ->orderBy('incident_date', 'desc')
            ->get();

        return Inertia::render('Incidents/Reports/Incidents', [
            'report' => $incidentReport,
            'incidents' => $incidents,
        ]);
    }
}
