<?php

namespace App\Http\Controllers;

use App\Models\IncidentReport;
use App\Models\Incident;
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
                        ->withQueryString(); // Preserve the query parameters in pagination links

        // Get incident report access information for the current user
        $user = auth()->user();
        $incidentReportAccess = null;
        
        if ($user) {
            $incidentReportAccess = [
                'canViewIncidentReports' => $user->canViewIncidentReports(),
                'canCreateIncidentReports' => $user->canCreateIncidentReports(),
                'canUpdateIncidentReports' => $user->canUpdateIncidentReports(),
                'canDeleteIncidentReports' => $user->canDeleteIncidentReports(),
                'canAccessIncidentsOnly' => $user->canAccessIncidentsOnly(),
                'hasIncidentReportAccess' => $user->hasIncidentReportAccess(),
                'currentAccess' => $user->getCurrentIncidentReportAccess() ? [
                    'access_type' => $user->getCurrentIncidentReportAccess()->access_type,
                    'expires_at' => $user->getCurrentIncidentReportAccess()->expires_at,
                    'is_active' => $user->getCurrentIncidentReportAccess()->is_active,
                    'is_global' => $user->getCurrentIncidentReportAccess()->isGlobal(),
                    'incident_report_id' => $user->getCurrentIncidentReportAccess()->incident_report_id,
                ] : null,
            ];
        }

        return Inertia::render('Incidents/Reports/Index', [
            'reports' => $reports,
            'filters' => $request->only(['search', 'status', 'security_level', 'sort_field', 'sort_direction']),
            'incidentReportAccess' => $incidentReportAccess,
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

        return Inertia::render('Incidents/Reports/Create', [
            'statItems' => $statItems,
            'statCategories' => $statCategories,
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
            'attachments' => 'nullable|array',
            'stats' => 'nullable|array',
            'stats.*.stat_category_item_id' => 'required|exists:stat_category_items,id',
            'stats.*.value' => 'required',
            'stats.*.notes' => 'nullable|string|max:1000',
        ]);

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
        $this->authorize('view', $incidentReport);
        
        $incidentReport->load(['submitter:id,name', 'approver:id,name']);

        $incidents = $incidentReport->incidents()
            ->with(['district:id,name', 'category:id,name,color'])
            ->orderBy('incident_date', 'desc')
            ->paginate(5);

        // Get all active stat categories
        $statCategories = StatCategory::where('status', 'active')
            ->orderBy('label')
            ->get();

        // Load report stats with their related items and categories
        $reportStats = $incidentReport->reportStats()
            ->with(['statCategoryItem.category'])
            ->get();

        // Get incident report access information for the current user and specific report
        $user = auth()->user();
        $incidentReportAccess = null;
        
        if ($user) {
            // Get report-specific access first, then fall back to global access
            $reportSpecificAccess = $user->getCurrentIncidentReportAccessForReport($incidentReport->id);
            $globalAccess = $user->getCurrentIncidentReportAccess();
            
            $currentAccess = $reportSpecificAccess ?: $globalAccess;
            
            $incidentReportAccess = [
                'canViewIncidentReports' => $user->canViewIncidentReports(),
                'canViewIncidentReport' => $user->canViewIncidentReport($incidentReport->id),
                'canCreateIncidentReports' => $user->canCreateIncidentReports(),
                'canUpdateIncidentReports' => $user->canUpdateIncidentReports(),
                'canUpdateIncidentReport' => $user->canUpdateIncidentReport($incidentReport->id),
                'canDeleteIncidentReports' => $user->canDeleteIncidentReports(),
                'canDeleteIncidentReport' => $user->canDeleteIncidentReport($incidentReport->id),
                'canAccessIncidentsOnly' => $user->canAccessIncidentsOnly(),
                'canAccessIncidentsOnlyForReport' => $user->canAccessIncidentsOnlyForReport($incidentReport->id),
                'hasIncidentReportAccess' => $user->hasIncidentReportAccess(),
                'hasIncidentReportAccessForReport' => $user->hasIncidentReportAccessForReport($incidentReport->id),
                'currentAccess' => $currentAccess ? [
                    'access_type' => $currentAccess->access_type,
                    'expires_at' => $currentAccess->expires_at,
                    'is_active' => $currentAccess->is_active,
                    'is_global' => $currentAccess->isGlobal(),
                    'incident_report_id' => $currentAccess->incident_report_id,
                    'is_report_specific' => $reportSpecificAccess ? true : false,
                ] : null,
            ];
        }

        return Inertia::render('Incidents/Reports/Show', [
            'report' => $incidentReport,
            'incidents' => $incidents,
            'reportStats' => $reportStats,
            'statCategories' => $statCategories,
            'incidentReportAccess' => $incidentReportAccess,
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
