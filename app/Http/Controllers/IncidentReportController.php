<?php

namespace App\Http\Controllers;

use App\Models\IncidentReport;
use App\Models\Incident;
use App\Models\District;
use App\Models\IncidentCategory;
use App\Services\PersianDateService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\StatCategoryItem;
use App\Models\StatCategory;
use App\Models\ReportStat;

class IncidentReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', IncidentReport::class);
        
        $query = IncidentReport::with(['submitter:id,name'])
            ->withCount('incidents');

        // Apply search filter
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('report_number', 'like', "%{$searchTerm}%")
                  ->orWhere('details', 'like', "%{$searchTerm}%")
                  ->orWhere('source', 'like', "%{$searchTerm}%");
            });
        }

        // Apply status filter
        if ($request->has('status') && !empty($request->status)) {
            $query->where('report_status', $request->status);
        }

        // Apply security level filter
        if ($request->has('security_level') && !empty($request->security_level)) {
            $query->where('security_level', $request->security_level);
        }

        // Apply sorting
        $sortField = $request->input('sort_field', 'report_date');
        $sortDirection = $request->input('sort_direction', 'desc');

        // Ensure valid sort field to prevent SQL injection
        $allowedSortFields = [
            'report_number',
            'report_date',
            'report_status',
            'security_level'
        ];

        // Handle special case for incidents_count which requires a subquery
        if ($sortField === 'incidents_count') {
            $query->withCount('incidents');
            $query->orderBy('incidents_count', $sortDirection);
        } else {
            // Default sorting for other fields
            if (!in_array($sortField, $allowedSortFields)) {
                $sortField = 'report_date';
            }

            // Ensure valid sort direction
            $sortDirection = strtolower($sortDirection) === 'asc' ? 'asc' : 'desc';

            $query->orderBy($sortField, $sortDirection);
        }

        $reports = $query->paginate(10)
                        ->through(function ($report) {
                            return [
                                'id' => $report->id,
                                'report_number' => $report->report_number,
                                'report_date' => $report->report_date,
                                'report_status' => $report->report_status,
                                'security_level' => $report->security_level,
                                'incidents_count' => $report->incidents_count,
                                'submitter' => $report->submitter,
                                'can_view' => Auth::user()->can('view', $report),
                                'can_update' => Auth::user()->can('update', $report),
                                'can_delete' => Auth::user()->can('delete', $report),
                            ];
                        })
                        ->withQueryString(); // Preserve the query parameters in pagination links

        return Inertia::render('Incidents/Reports/Index', [
            'reports' => $reports,
            'filters' => $request->only(['search', 'status', 'security_level', 'sort_field', 'sort_direction']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', IncidentReport::class);
        
        // Get active statistical categories
        $statCategories = StatCategory::where('status', 'active')
            ->orderBy('label')
            ->get();

        return Inertia::render('Incidents/Reports/Create', [
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', IncidentReport::class);
        
        $validated = $request->validate([
            'report_number' => 'nullable|string|max:255',
            'details' => 'required|string',
            'action_taken' => 'nullable|string',
            'recommendation' => 'nullable|string',
            'security_level' => 'required|string|in:normal,restricted,classified',
            'report_date' => 'required|string',
            'report_status' => 'required|string|in:submitted,reviewed,approved',
            'source' => 'nullable|string',
            'attachments' => 'nullable|array',        ]);

        // Convert Persian date to Carbon date for database storage
        $validated['report_date'] = PersianDateService::toDatabaseFormat($validated['report_date']);
        if (!$validated['report_date']) {
            return back()->withErrors(['report_date' => 'Invalid date format. Please use Persian date format (YYYY/MM/DD).']);
        }

        $validated['submitted_by'] = Auth::id();

        // Generate a unique report number if not provided
        if (empty($validated['report_number'])) {
            $validated['report_number'] = 'RPT-' . date('Y') . '-' . str_pad(IncidentReport::count() + 1, 4, '0', STR_PAD_LEFT);
        }

        $report = IncidentReport::create($validated);


        return redirect()->route('incident-reports.show', $report)
            ->with('success', 'Incident report created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(IncidentReport $incidentReport)
    {
        $this->authorize('view', $incidentReport);
        
        $incidentReport->load(['submitter:id,name', 'approver:id,name']);

        $incidents = $incidentReport->incidents()
            ->with(['district:id,name', 'category:id,name,color'])
            ->orderBy('incident_date', 'desc')
            ->paginate(5);

        // Get data for creating incidents in modal
        $districts = District::with('province:id,name')
            ->orderBy('name')
            ->get();

        $categories = IncidentCategory::where('status', 'active')
            ->orderBy('name')
            ->get();

        $reports = IncidentReport::select('id', 'report_number', 'report_date')
            ->orderBy('report_date', 'desc')
            ->get();

        return Inertia::render('Incidents/Reports/Show', [
            'report' => $incidentReport,
            'incidents' => $incidents,
            'districts' => $districts,
            'categories' => $categories,
            'reports' => $reports,
        ]);
    }

    /**
     * Display incidents for a specific report.
     */
    public function incidents(IncidentReport $incidentReport)
    {
        $this->authorize('view', $incidentReport);
        
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

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(IncidentReport $incidentReport)
    {
        $this->authorize('update', $incidentReport);
        
        // Get active statistical categories
        $statCategories = StatCategory::where('status', 'active')
            ->orderBy('label')
            ->get();

        // Get active statistical category items with parent-child relationships
        $statItems = StatCategoryItem::with(['category', 'parent'])
            ->withCount('children')  // Add count of children
            ->whereHas('category', function ($query) {
                $query->where('status', 'active');
            })
            ->where('status', 'active')
            ->orderBy('order')
            ->get()
            ->map(function ($item) {
                // Convert to array and include essential fields for tree view
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'label' => $item->label,
                    'color' => $item->color,
                    'parent_id' => $item->parent_id,
                    'children_count' => $item->children_count,
                    'category' => [
                        'id' => $item->category->id,
                        'name' => $item->category->name,
                        'label' => $item->category->label,
                        'color' => $item->category->color,
                    ]
                ];
            });

        // Load report stats with their related items and categories
        $reportStats = $incidentReport->reportStats()
            ->with(['statCategoryItem.category'])
            ->get();

        return Inertia::render('Incidents/Reports/Edit', [
            'report' => $incidentReport,
            'statItems' => $statItems,
            'reportStats' => $reportStats,
            'statCategories' => $statCategories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, IncidentReport $incidentReport)
    {
        $this->authorize('update', $incidentReport);
        
        $validated = $request->validate([
            'report_number' => 'nullable|string|max:255',
            'details' => 'required|string',
            'action_taken' => 'nullable|string',
            'recommendation' => 'nullable|string',
            'security_level' => 'required|string|in:normal,restricted,classified',
            'report_date' => 'required|string',
            'report_status' => 'required|string|in:submitted,reviewed,approved',
            'source' => 'nullable|string',
            'attachments' => 'nullable|array',
            'approved_by' => 'nullable|exists:users,id',
        ]);

        // Convert Persian date to Carbon date for database storage
        $validated['report_date'] = PersianDateService::toDatabaseFormat($validated['report_date']);
        if (!$validated['report_date']) {
            return back()->withErrors(['report_date' => 'Invalid date format. Please use Persian date format (YYYY/MM/DD).']);
        }

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
        $this->authorize('delete', $incidentReport);
        
        $incidentReport->delete();

        return redirect()->route('incident-reports.index')
            ->with('success', 'Incident report deleted successfully.');
    }

    /**
     * Display the print view for a specific report.
     */
    public function print(IncidentReport $incidentReport)
    {
        $this->authorize('view', $incidentReport);
        
        // Check if user is admin
        if (!auth()->user()->hasRole('admin')) {
            abort(403, 'Only administrators can print reports.');
        }
        
        // Load the report with all necessary relationships
        $incidentReport->load([
            'submitter:id,name',
            'approver:id,name'
        ]);

        // Load all incidents for this report (no pagination for print)
        $incidents = $incidentReport->incidents()
            ->with([
                'district:id,name',
                'category:id,name,color',
                'reporter:id,name'
            ])
            ->orderBy('incident_date', 'desc')
            ->get();

        // Get all active stat categories
        $statCategories = StatCategory::where('status', 'active')
            ->orderBy('label')
            ->get();

        // Load report stats with their related items and categories
        $reportStats = $incidentReport->reportStats()
            ->with(['statCategoryItem.category'])
            ->get();

        // Group stats by category for better organization
        $statsByCategory = [];
        foreach ($reportStats as $stat) {
            $categoryName = $stat->statCategoryItem->category->label;
            if (!isset($statsByCategory[$categoryName])) {
                $statsByCategory[$categoryName] = [
                    'category' => $stat->statCategoryItem->category,
                    'stats' => []
                ];
            }
            $statsByCategory[$categoryName]['stats'][] = $stat;
        }

        // Generate barcode data
        $barcodeData = [
            'report_number' => $incidentReport->report_number,
            'report_id' => $incidentReport->id,
            'date' => $incidentReport->report_date,
            'security_level' => $incidentReport->security_level,
        ];

        return Inertia::render('Incidents/Reports/Print', [
            'report' => $incidentReport,
            'incidents' => $incidents,
            'reportStats' => $reportStats,
            'statsByCategory' => $statsByCategory,
            'statCategories' => $statCategories,
            'barcodeData' => $barcodeData,
            'isAdmin' => auth()->user()->hasRole('admin'),
        ]);
    }
}
