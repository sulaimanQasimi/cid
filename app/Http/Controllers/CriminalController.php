<?php

namespace App\Http\Controllers;

use App\Models\Criminal;
use App\Models\Department;
use App\Models\User;
use App\Services\PersianDateService;
use App\Services\VisitorTrackingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CriminalController extends Controller
{
    protected $trackingService;

    public function __construct(VisitorTrackingService $trackingService)
    {
        $this->trackingService = $trackingService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Criminal::class);
        
        // Validate query parameters
        $validated = $request->validate([
            'per_page' => 'nullable|integer|min:5|max:100',
            'search' => 'nullable|string|max:100',
            'sort' => [
                'nullable',
                'string',
                Rule::in(['name', 'number', 'crime_type', 'arrest_date', 'created_at', 'updated_at', 'department_id'])
            ],
            'direction' => ['nullable', 'string', Rule::in(['asc', 'desc'])],
            'department_id' => 'nullable|integer|exists:departments,id',
            'page' => 'nullable|integer|min:1',
        ]);

        $perPage = $validated['per_page'] ?? 10;
        $search = $validated['search'] ?? '';
        $sort = $validated['sort'] ?? 'created_at';
        $direction = $validated['direction'] ?? 'desc';
        $departmentFilter = $validated['department_id'] ?? null;

        // Apply search and filters
        $query = Criminal::with(['department', 'creator']);

        // Filter by access permissions - user can only see criminals they created or have access to
        $query->where(function ($q) {
            $q->where('created_by', Auth::id())
              ->orWhereHas('accesses', function ($accessQuery) {
                  $accessQuery->where('user_id', Auth::id());
              });
        });

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('number', 'like', "%{$search}%")
                  ->orWhere('father_name', 'like', "%{$search}%")
                  ->orWhere('id_card_number', 'like', "%{$search}%")
                  ->orWhere('crime_type', 'like', "%{$search}%");
            });
        }

        if ($departmentFilter) {
            $query->where('department_id', $departmentFilter);
        }

        $query->orderBy($sort, $direction);
        // Get paginated results with visitor statistics
        $criminals = $query->paginate($perPage)->withQueryString();
        
        // Load visitor statistics for each criminal
        $criminals->getCollection()->transform(function ($criminal) {
            $criminal->visits_count = $criminal->visits_count;
            $criminal->unique_visitors_count = $criminal->unique_visitors_count;
            $criminal->today_visits_count = $criminal->today_visits_count;
            $criminal->this_week_visits_count = $criminal->this_week_visits_count;
            $criminal->this_month_visits_count = $criminal->this_month_visits_count;
            $criminal->bounce_rate = $criminal->bounce_rate;
            $criminal->average_time_spent = $criminal->average_time_spent;
            return $criminal;
        });

        // Get all departments for filtering
        $departments = Department::orderBy('name')->get();

        return Inertia::render('Criminal/Index', [
            'criminals' => $criminals,
            'departments' => $departments,
            'filters' => [
                'search' => $search,
                'sort' => $sort,
                'direction' => $direction,
                'per_page' => $perPage,
                'department_id' => $departmentFilter,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Criminal::class);
        
        $departments = Department::orderBy('name')->get();
        $users = User::orderBy('name')->get();

        return Inertia::render('Criminal/Create', [
            'departments' => $departments,
            'users' => $users,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Criminal::class);
        
        $validated = $request->validate([
            'photo' => 'nullable|image|max:2048',
            'number' => 'nullable|string|max:50',
            'name' => 'required|string|max:255',
            'father_name' => 'nullable|string|max:255',
            'grandfather_name' => 'nullable|string|max:255',
            'id_card_number' => 'nullable|string|max:50',
            'phone_number' => 'nullable|string|max:50',
            'original_residence' => 'nullable|string',
            'current_residence' => 'nullable|string',
            'crime_type' => 'nullable|string|max:255',
            'arrest_location' => 'nullable|string|max:255',
            'arrested_by' => 'nullable|string|max:255',
            'arrest_date' => 'nullable|string',
            'referred_to' => 'nullable|string|max:255',
            'final_verdict' => 'nullable|string',
            'notes' => 'nullable|string',
            'department_id' => 'nullable|string',
            'access_users' => 'nullable|array',
            'access_users.*' => 'integer|exists:users,id',
        ]);

        // Convert Persian date to Carbon date for database storage
        if (!empty($validated['arrest_date'])) {
            $validated['arrest_date'] = PersianDateService::toDatabaseFormat($validated['arrest_date']);
            if (!$validated['arrest_date']) {
                return back()->withErrors(['arrest_date' => 'Invalid date format. Please use Persian date format (YYYY/MM/DD).']);
            }
        }

        // Handle 'none' value for department_id
        if (isset($validated['department_id']) && $validated['department_id'] === 'none') {
            $validated['department_id'] = null;
        } elseif (isset($validated['department_id']) && $validated['department_id'] !== null) {
            // Validate that the department exists if it's not 'none'
            $request->validate([
                'department_id' => 'exists:departments,id'
            ]);
        }

        // Handle photo upload
        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('photos', 'public');
        }

        // Set the user who created the record
        $validated['created_by'] = Auth::id();

        // Create the criminal record
        $criminal = Criminal::create($validated);

        // Handle access permissions
        if (isset($validated['access_users']) && is_array($validated['access_users'])) {
            foreach ($validated['access_users'] as $userId) {
                // Don't create access for the creator (they already have access)
                if ($userId != Auth::id()) {
                    $criminal->accesses()->create(['user_id' => $userId]);
                }
            }
        }

        return Redirect::route('criminals.index')
            ->with('success', 'Criminal record created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Criminal $criminal)
    {
        $this->authorize('view', $criminal);
        
        $criminal->load(['department', 'creator']);

        // Track the visit to this criminal record
        $this->trackingService->trackVisit($criminal);

        // dd($criminal);
        // return $criminal;

        return Inertia::render('Criminal/Show', [
            'criminal' => $criminal,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Criminal $criminal)
    {
        $this->authorize('update', $criminal);
        
        $departments = Department::orderBy('name')->get();
        $users = User::orderBy('name')->get();
        
        // Load current access permissions
        $criminal->load('accesses.user');

        return Inertia::render('Criminal/Edit', [
            'criminal' => $criminal,
            'departments' => $departments,
            'users' => $users,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Criminal $criminal)
    {
        $this->authorize('update', $criminal);
        
        $validated = $request->validate([
            'photo' => 'nullable|image|max:2048',
            'number' => 'nullable|string|max:50',
            'name' => 'required|string|max:255',
            'father_name' => 'nullable|string|max:255',
            'grandfather_name' => 'nullable|string|max:255',
            'id_card_number' => 'nullable|string|max:50',
            'phone_number' => 'nullable|string|max:50',
            'original_residence' => 'nullable|string',
            'current_residence' => 'nullable|string',
            'crime_type' => 'nullable|string|max:255',
            'arrest_location' => 'nullable|string|max:255',
            'arrested_by' => 'nullable|string|max:255',
            'arrest_date' => 'nullable|string',
            'referred_to' => 'nullable|string|max:255',
            'final_verdict' => 'nullable|string',
            'notes' => 'nullable|string',
            'department_id' => 'nullable|string',
            'access_users' => 'nullable|array',
            'access_users.*' => 'integer|exists:users,id',
            'deleted_users' => 'nullable|array',
            'deleted_users.*' => 'integer|exists:users,id',
        ]);

        // Convert Persian date to Carbon date for database storage
        if (!empty($validated['arrest_date'])) {
            $validated['arrest_date'] = PersianDateService::toDatabaseFormat($validated['arrest_date']);
            if (!$validated['arrest_date']) {
                return back()->withErrors(['arrest_date' => 'Invalid date format. Please use Persian date format (YYYY/MM/DD).']);
            }
        }

        // Handle 'none' value for department_id
        if (isset($validated['department_id']) && $validated['department_id'] === 'none') {
            $validated['department_id'] = null;
        } elseif (isset($validated['department_id']) && $validated['department_id'] !== null) {
            // Validate that the department exists if it's not 'none'
            $request->validate([
                'department_id' => 'exists:departments,id'
            ]);
        }

        // Handle photo upload
        if ($request->hasFile('photo')) {
            // Delete old photo if exists
            if ($criminal->photo) {
                Storage::disk('public')->delete($criminal->photo);
            }
            $validated['photo'] = $request->file('photo')->store('photos', 'public');
        }

        // Update the criminal record
        $criminal->update($validated);
        // Handle access permissions update
        if (isset($validated['access_users'])) {
            // Remove all existing access permissions
            $criminal->accesses()->delete();
            
            // Add new access permissions
            if (is_array($validated['access_users'])) {
                foreach ($validated['access_users'] as $userId) {
                    // Don't create access for the creator (they already have access)
                    if ($userId != $criminal->created_by) {
                        $criminal->accesses()->create(['user_id' => $userId]);
                    }
                }
            }
        }

        // Handle deleted users (for logging/audit purposes)
        if (isset($validated['deleted_users']) && is_array($validated['deleted_users'])) {
            // Log the deleted users for audit purposes
            \Log::info('Users removed from criminal access', [
                'criminal_id' => $criminal->id,
                'deleted_user_ids' => $validated['deleted_users'],
                'deleted_by' => auth()->id(),
                'timestamp' => now()
            ]);
        }

        return Redirect::route('criminals.index')
            ->with('success', 'Criminal record updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Criminal $criminal)
    {
        $this->authorize('delete', $criminal);
        
        // Delete the photo if exists
        if ($criminal->photo) {
            Storage::disk('public')->delete($criminal->photo);
        }

        // Delete the criminal record
        $criminal->delete();

        return Redirect::route('criminals.index')
            ->with('success', 'Criminal record deleted successfully.');
    }

    /**
     * Display a printable version of the specified resource.
     */
    public function print(Criminal $criminal)
    {
        $this->authorize('view', $criminal);
        
        $criminal->load(['department', 'creator']);

        // Don't preload any reports, as we'll create a new one on the client side
        $criminal->report = null;

        return Inertia::render('Criminal/Print', [
            'criminal' => $criminal,
        ]);
    }

    /**
     * Display a comprehensive list of all criminals with all details.
     */
    public function comprehensiveList(Request $request)
    {
        $this->authorize('viewComprehensiveList', Criminal::class);
        
        // Validate query parameters
        $validated = $request->validate([
            'per_page' => 'nullable|integer|min:5|max:100',
            'search' => 'nullable|string|max:100',
            'sort' => [
                'nullable',
                'string',
                Rule::in(['name', 'number', 'crime_type', 'arrest_date', 'created_at', 'updated_at', 'department_id', 'id_card_number', 'phone_number'])
            ],
            'direction' => ['nullable', 'string', Rule::in(['asc', 'desc'])],
            'department_id' => 'nullable|integer|exists:departments,id',
            'page' => 'nullable|integer|min:1',
        ]);

        $perPage = $validated['per_page'] ?? 25;
        $search = $validated['search'] ?? '';
        $sort = $validated['sort'] ?? 'created_at';
        $direction = $validated['direction'] ?? 'desc';
        $departmentFilter = $validated['department_id'] ?? null;

        // Apply search and filters - comprehensive list shows all criminals
        $query = Criminal::with(['department', 'creator']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('number', 'like', "%{$search}%")
                  ->orWhere('father_name', 'like', "%{$search}%")
                  ->orWhere('grandfather_name', 'like', "%{$search}%")
                  ->orWhere('id_card_number', 'like', "%{$search}%")
                  ->orWhere('phone_number', 'like', "%{$search}%")
                  ->orWhere('crime_type', 'like', "%{$search}%")
                  ->orWhere('arrest_location', 'like', "%{$search}%")
                  ->orWhere('arrested_by', 'like', "%{$search}%")
                  ->orWhere('original_residence', 'like', "%{$search}%")
                  ->orWhere('current_residence', 'like', "%{$search}%")
                  ->orWhere('referred_to', 'like', "%{$search}%");
            });
        }

        if ($departmentFilter) {
            $query->where('department_id', $departmentFilter);
        }

        $query->orderBy($sort, $direction);
        
        // Get paginated results
        $criminals = $query->paginate($perPage)->withQueryString();

        // Get all departments for filtering
        $departments = Department::orderBy('name')->get();

        return Inertia::render('Criminal/ComprehensiveList', [
            'criminals' => $criminals,
            'departments' => $departments,
            'filters' => [
                'search' => $search,
                'sort' => $sort,
                'direction' => $direction,
                'per_page' => $perPage,
                'department_id' => $departmentFilter,
            ],
        ]);
    }
}
