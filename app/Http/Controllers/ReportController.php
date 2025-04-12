<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Events\ReportCreated;

class ReportController extends Controller
{
    /**
     * Store a newly created report in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'reportable_type' => 'required|string',
            'reportable_id' => 'required|integer',
            'properties' => 'required|array',
        ]);

        $report = new Report();
        $report->reportable_type = $request->reportable_type;
        $report->reportable_id = $request->reportable_id;
        $report->created_by = Auth::id() ?? $request->user_id ?? 1;
        $report->properties = $request->properties;
        $report->save();

        // Broadcast report created event
        broadcast(new ReportCreated($report))->toOthers();

        return response()->json([
            'success' => true,
            'message' => 'Report created successfully',
            'report' => $report,
        ]);
    }

    /**
     * Display the specified report.
     *
     * @param  \App\Models\Report  $report
     * @return \Illuminate\Http\Response
     */
    public function show(Report $report)
    {
        return response()->json([
            'report' => $report,
        ]);
    }
}
