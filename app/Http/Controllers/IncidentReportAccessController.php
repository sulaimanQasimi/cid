<?php

namespace App\Http\Controllers;

use App\Models\IncidentReportAccess;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class IncidentReportAccessController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            // Only super admins can manage incident report access
            if (!auth()->user()->hasRole('superadmin')) {
                abort(403, 'Access denied. Super admin privileges required.');
            }
            
            return $next($request);
        });
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = IncidentReportAccess::with(['user:id,name,email', 'grantedBy:id,name', 'incidentReport:id,report_number,report_date'])
            ->orderBy('created_at', 'desc');

        // Apply search filter
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->whereHas('user', function($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('email', 'like', "%{$searchTerm}%");
            });
        }

        // Apply status filter
        if ($request->has('status') && !empty($request->status)) {
            switch ($request->status) {
                case 'active':
                    $query->valid();
                    break;
                case 'expired':
                    $query->expired();
                    break;
                case 'inactive':
                    $query->where('is_active', false);
                    break;
            }
        }

        // Apply access type filter
        if ($request->has('access_type') && !empty($request->access_type)) {
            $query->where('access_type', $request->access_type);
        }

        // Apply report filter
        if ($request->has('report_type') && !empty($request->report_type)) {
            switch ($request->report_type) {
                case 'global':
                    $query->global();
                    break;
                case 'specific':
                    $query->whereNotNull('incident_report_id');
                    break;
            }
        }

        // Apply specific report filter
        if ($request->has('incident_report_id') && !empty($request->incident_report_id)) {
            $query->where('incident_report_id', $request->incident_report_id);
        }

        $accessRecords = $query->paginate(15)
                              ->withQueryString();

        // Get all incident reports for filtering
        $incidentReports = \App\Models\IncidentReport::select('id', 'report_number', 'report_date')
            ->orderBy('report_date', 'desc')
            ->get();

        return Inertia::render('IncidentReportAccess/Index', [
            'accessRecords' => $accessRecords,
            'incidentReports' => $incidentReports,
            'filters' => $request->only(['search', 'status', 'access_type', 'report_type', 'incident_report_id']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Get users who don't have active incident report access (both global and report-specific)
        $usersWithoutAccess = User::whereDoesntHave('incidentReportAccess', function($query) {
            $query->valid();
        })
        ->whereDoesntHave('roles', function($query) {
            $query->whereIn('name', ['superadmin', 'admin']);
        })
        ->select('id', 'name', 'email')
        ->orderBy('name')
        ->get();

        // Get all incident reports for selection
        $incidentReports = \App\Models\IncidentReport::select('id', 'report_number', 'report_date')
            ->orderBy('report_date', 'desc')
            ->get();

        return Inertia::render('IncidentReportAccess/Create', [
            'users' => $usersWithoutAccess,
            'incidentReports' => $incidentReports,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'incident_report_id' => 'nullable|exists:incident_reports,id',
            'access_type' => 'required|in:full,read_only,incidents_only',
            'notes' => 'nullable|string|max:1000',
            'expires_at' => 'nullable|date|after:now',
        ]);

        // Check if user already has active access for this specific report (or global if no report specified)
        $existingAccess = IncidentReportAccess::where('user_id', $validated['user_id'])
            ->where('incident_report_id', $validated['incident_report_id'])
            ->valid()
            ->first();

        if ($existingAccess) {
            $message = $validated['incident_report_id'] 
                ? 'This user already has active access for this specific incident report.'
                : 'This user already has active global incident report access.';
            return back()->withErrors(['user_id' => $message]);
        }

        // For report-specific access, also check if user has global access that would conflict
        if ($validated['incident_report_id']) {
            $globalAccess = IncidentReportAccess::where('user_id', $validated['user_id'])
                ->whereNull('incident_report_id')
                ->valid()
                ->first();
            
            if ($globalAccess) {
                return back()->withErrors([
                    'incident_report_id' => 'This user already has global access. Report-specific access is not needed.'
                ]);
            }
        }

        // Deactivate any existing access records for this user and report combination
        IncidentReportAccess::where('user_id', $validated['user_id'])
            ->where('incident_report_id', $validated['incident_report_id'])
            ->update(['is_active' => false]);

        // Create new access record
        $access = IncidentReportAccess::create([
            'user_id' => $validated['user_id'],
            'incident_report_id' => $validated['incident_report_id'],
            'granted_by' => Auth::id(),
            'access_type' => $validated['access_type'],
            'notes' => $validated['notes'],
            'expires_at' => $validated['expires_at'],
            'is_active' => true,
        ]);

        $message = $validated['incident_report_id'] 
            ? 'Incident report access granted successfully for this specific report.'
            : 'Global incident report access granted successfully.';

        return redirect()->route('incident-report-access.index')
            ->with('success', $message);
    }

    /**
     * Display the specified resource.
     */
    public function show(IncidentReportAccess $incidentReportAccess)
    {
        $incidentReportAccess->load(['user:id,name,email', 'grantedBy:id,name', 'incidentReport:id,report_number,report_date']);

        return Inertia::render('IncidentReportAccess/Show', [
            'accessRecord' => $incidentReportAccess,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(IncidentReportAccess $incidentReportAccess)
    {
        $incidentReportAccess->load(['user:id,name,email']);

        // Get all incident reports for selection
        $incidentReports = \App\Models\IncidentReport::select('id', 'report_number', 'report_date')
            ->orderBy('report_date', 'desc')
            ->get();

        return Inertia::render('IncidentReportAccess/Edit', [
            'accessRecord' => $incidentReportAccess,
            'incidentReports' => $incidentReports,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, IncidentReportAccess $incidentReportAccess)
    {
        $validated = $request->validate([
            'incident_report_id' => 'nullable|exists:incident_reports,id',
            'access_type' => 'required|in:full,read_only,incidents_only',
            'notes' => 'nullable|string|max:1000',
            'expires_at' => 'nullable|date',
            'is_active' => 'boolean',
        ]);

        $incidentReportAccess->update($validated);

        return redirect()->route('incident-report-access.index')
            ->with('success', 'Incident report access updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(IncidentReportAccess $incidentReportAccess)
    {
        $incidentReportAccess->update(['is_active' => false]);

        return redirect()->route('incident-report-access.index')
            ->with('success', 'Incident report access revoked successfully.');
    }

    /**
     * Revoke access for a user.
     */
    public function revoke(Request $request, $userId)
    {
        $user = User::findOrFail($userId);
        
        // Deactivate all active access records for this user
        IncidentReportAccess::where('user_id', $userId)
            ->where('is_active', true)
            ->update(['is_active' => false]);

        return redirect()->route('incident-report-access.index')
            ->with('success', "Access revoked for user: {$user->name}");
    }

    /**
     * Extend access for a user.
     */
    public function extend(Request $request, IncidentReportAccess $incidentReportAccess)
    {
        $validated = $request->validate([
            'extension_days' => 'required|integer|min:1|max:365',
        ]);

        $newExpiryDate = $incidentReportAccess->expires_at 
            ? $incidentReportAccess->expires_at->addDays($validated['extension_days'])
            : now()->addDays($validated['extension_days']);

        $incidentReportAccess->update([
            'expires_at' => $newExpiryDate,
        ]);

        return redirect()->route('incident-report-access.index')
            ->with('success', 'Access extended successfully.');
    }

    /**
     * Get users available for access grant.
     */
    public function getAvailableUsers(Request $request)
    {
        $reportId = $request->input('incident_report_id');
        
        $query = User::whereDoesntHave('roles', function($query) {
            $query->whereIn('name', ['superadmin', 'admin']);
        });

        if ($reportId) {
            // For report-specific access, exclude users who already have access to this report
            $query->whereDoesntHave('incidentReportAccess', function($q) use ($reportId) {
                $q->where('incident_report_id', $reportId)
                  ->valid();
            });
        } else {
            // For global access, exclude users who already have any valid access
            $query->whereDoesntHave('incidentReportAccess', function($q) {
                $q->valid();
            });
        }

        $users = $query->select('id', 'name', 'email')
            ->orderBy('name')
            ->get();

        return response()->json($users);
    }
}
