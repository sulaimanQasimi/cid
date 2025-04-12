<?php

namespace App\Http\Controllers;

use App\Models\Criminal;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CriminalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
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

        // Get paginated results
        $criminals = $query->paginate($perPage)->withQueryString();

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
        $departments = Department::orderBy('name')->get();

        return Inertia::render('Criminal/Create', [
            'departments' => $departments,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'photo' => 'nullable|image|max:2048',
            'number' => 'nullable|string|max:50',
            'name' => 'required|string|max:255',
            'father_name' => 'nullable|string|max:255',
            'grandfather_name' => 'nullable|string|max:255',
            'id_card_number' => 'nullable|string|max:50',
            'phone_number' => 'nullable|string|max:50',
            'original_residence' => 'nullable|string|max:1000',
            'current_residence' => 'nullable|string|max:1000',
            'crime_type' => 'nullable|string|max:255',
            'arrest_location' => 'nullable|string|max:255',
            'arrested_by' => 'nullable|string|max:255',
            'arrest_date' => 'nullable|date',
            'referred_to' => 'nullable|string|max:255',
            'final_verdict' => 'nullable|string|max:1000',
            'notes' => 'nullable|string|max:1000',
            'department_id' => 'nullable|string|exists:departments,id|not_in:none',
        ]);

        // Handle 'none' value for department_id
        if (isset($validated['department_id']) && $validated['department_id'] === 'none') {
            $validated['department_id'] = null;
        }

        // Handle photo upload
        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('photos', 'public');
        }

        // Set the user who created the record
        $validated['created_by'] = Auth::id();

        // Create the criminal record
        $criminal = Criminal::create($validated);

        return Redirect::route('criminals.index')
            ->with('success', 'Criminal record created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Criminal $criminal)
    {
        $criminal->load(['department', 'creator']);

        return Inertia::render('Criminal/Show', [
            'criminal' => $criminal,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Criminal $criminal)
    {
        $departments = Department::orderBy('name')->get();

        return Inertia::render('Criminal/Edit', [
            'criminal' => $criminal,
            'departments' => $departments,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Criminal $criminal)
    {
        $validated = $request->validate([
            'photo' => 'nullable|image|max:2048',
            'number' => 'nullable|string|max:50',
            'name' => 'required|string|max:255',
            'father_name' => 'nullable|string|max:255',
            'grandfather_name' => 'nullable|string|max:255',
            'id_card_number' => 'nullable|string|max:50',
            'phone_number' => 'nullable|string|max:50',
            'original_residence' => 'nullable|string|max:1000',
            'current_residence' => 'nullable|string|max:1000',
            'crime_type' => 'nullable|string|max:255',
            'arrest_location' => 'nullable|string|max:255',
            'arrested_by' => 'nullable|string|max:255',
            'arrest_date' => 'nullable|date',
            'referred_to' => 'nullable|string|max:255',
            'final_verdict' => 'nullable|string|max:1000',
            'notes' => 'nullable|string|max:1000',
            'department_id' => 'nullable|string|exists:departments,id|not_in:none',
        ]);

        // Handle 'none' value for department_id
        if (isset($validated['department_id']) && $validated['department_id'] === 'none') {
            $validated['department_id'] = null;
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

        return Redirect::route('criminals.index')
            ->with('success', 'Criminal record updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Criminal $criminal)
    {
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
        $criminal->load(['department', 'creator']);

        return Inertia::render('Criminal/Print', [
            'criminal' => $criminal,
        ]);
    }
}
