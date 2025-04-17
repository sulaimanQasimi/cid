<?php

namespace App\Http\Controllers;

use App\Models\ReportStat;
use App\Models\IncidentReport;
use App\Models\StatCategoryItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ReportStatController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created stat in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'incident_report_id' => [
                'required',
                'exists:incident_reports,id',
                Rule::unique('report_stats', 'incident_report_id')
                    ->where('stat_category_item_id', $request->stat_category_item_id)
                    ->whereNull('deleted_at')
            ],
            'stat_category_item_id' => 'required|exists:stat_category_items,id',
            'value' => 'required',
            'notes' => 'nullable|string|max:1000',
        ]);

        // Get the stat category item to check its type
        $statItem = StatCategoryItem::findOrFail($validated['stat_category_item_id']);

        // Create a new report stat
        $reportStat = new ReportStat();
        $reportStat->incident_report_id = $validated['incident_report_id'];
        $reportStat->stat_category_item_id = $validated['stat_category_item_id'];
        $reportStat->setValue($validated['value']);
        $reportStat->notes = $validated['notes'] ?? null;
        $reportStat->created_by = Auth::id();
        $reportStat->save();

        return redirect()
            ->route('incident-reports.show', $validated['incident_report_id'])
            ->with('success', 'Statistical data added successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified stat in storage.
     */
    public function update(Request $request, ReportStat $reportStat)
    {
        $validated = $request->validate([
            'value' => 'required',
            'notes' => 'nullable|string|max:1000',
        ]);

        // Update the report stat
        $reportStat->setValue($validated['value']);
        $reportStat->notes = $validated['notes'] ?? null;
        $reportStat->updated_by = Auth::id();
        $reportStat->save();

        return redirect()
            ->route('incident-reports.show', $reportStat->incident_report_id)
            ->with('success', 'Statistical data updated successfully.');
    }

    /**
     * Remove the specified stat from storage.
     */
    public function destroy(ReportStat $reportStat)
    {
        $reportId = $reportStat->incident_report_id;
        $reportStat->delete();

        return redirect()
            ->route('incident-reports.show', $reportId)
            ->with('success', 'Statistical data removed successfully.');
    }

    /**
     * Batch update multiple stats for a report.
     */
    public function batchUpdate(Request $request, IncidentReport $incidentReport)
    {
        $validated = $request->validate([
            'stats' => 'required|array',
            'stats.*.stat_category_item_id' => [
                'required',
                'exists:stat_category_items,id',
            ],
            'stats.*.value' => 'required',
            'stats.*.notes' => 'nullable|string|max:1000',
        ]);

        foreach ($validated['stats'] as $stat) {
            // Find or create the stat
            $reportStat = ReportStat::firstOrNew([
                'incident_report_id' => $incidentReport->id,
                'stat_category_item_id' => $stat['stat_category_item_id'],
            ]);

            // Set the values
            $reportStat->setValue($stat['value']);
            $reportStat->notes = $stat['notes'] ?? null;

            // Set user tracking fields
            if (!$reportStat->exists) {
                $reportStat->created_by = Auth::id();
            } else {
                $reportStat->updated_by = Auth::id();
            }

            $reportStat->save();
        }

        return redirect()
            ->route('incident-reports.show', $incidentReport)
            ->with('success', 'Statistical data updated successfully.');
    }
}
