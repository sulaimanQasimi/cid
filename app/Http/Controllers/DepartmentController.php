<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Info;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the departments.
     */
    public function index()
    {
        $this->authorize('viewAny', Department::class);
        $departments = Department::withCount('infos')->paginate(10);

        return Inertia::render('Department/Index', [
            'departments' => $departments
        ]);
    }

    /**
     * Show the form for creating a new department.
     */
    public function create()
    {
        $this->authorize('create', Department::class);
        return Inertia::render('Department/Create');
    }

    /**
     * Store a newly created department in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Department::class);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:departments,code',
        ]);

        Department::create($validated);

        return redirect()->route('departments.index')
            ->with('message', 'Department created successfully');
    }

    /**
     * Display the specified department.
     */
    public function show(Department $department)
    {
        $this->authorize('view', $department);
        $department->load(['infos' => function ($query) {
            $query->with('infoType', 'infoCategory');
        }]);

        return Inertia::render('Department/Show', [
            'department' => $department
        ]);
    }

    /**
     * Show the form for editing the specified department.
     */
    public function edit(Department $department)
    {
        $this->authorize('update', $department);
        return Inertia::render('Department/Edit', [
            'department' => $department
        ]);
    }

    /**
     * Update the specified department in storage.
     */
    public function update(Request $request, Department $department)
    {
        $this->authorize('update', $department);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:departments,code,' . $department->id,
        ]);

        $department->update($validated);

        return redirect()->route('departments.index')
            ->with('message', 'Department updated successfully');
    }

    /**
     * Remove the specified department from storage.
     */
    public function destroy(Department $department)
    {
        $this->authorize('delete', $department);
        $department->delete();

        return redirect()->route('departments.index')
            ->with('message', 'Department deleted successfully');
    }
}
