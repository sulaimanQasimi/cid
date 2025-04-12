<?php

namespace App\Http\Controllers;

use App\Models\Info;
use App\Models\InfoType;
use App\Models\InfoCategory;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class InfoController extends Controller
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
                Rule::in(['name', 'code', 'description', 'created_at', 'updated_at', 'info_type_id', 'info_category_id', 'department_id'])
            ],
            'direction' => ['nullable', 'string', Rule::in(['asc', 'desc'])],
            'type_id' => 'nullable|integer|exists:info_types,id',
            'category_id' => 'nullable|integer|exists:info_categories,id',
            'department_id' => 'nullable|integer|exists:departments,id',
            'page' => 'nullable|integer|min:1',
        ]);

        $perPage = $validated['per_page'] ?? 10;
        $search = $validated['search'] ?? '';
        $sort = $validated['sort'] ?? 'name';
        $direction = $validated['direction'] ?? 'asc';
        $typeFilter = $validated['type_id'] ?? null;
        $categoryFilter = $validated['category_id'] ?? null;
        $departmentFilter = $validated['department_id'] ?? null;

        // Apply search and filters
        $query = Info::with(['infoType', 'infoCategory', 'department']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($typeFilter) {
            $query->where('info_type_id', $typeFilter);
        }

        if ($categoryFilter) {
            $query->where('info_category_id', $categoryFilter);
        }

        if ($departmentFilter) {
            $query->where('department_id', $departmentFilter);
        }

        $query->orderBy($sort, $direction);

        // Get paginated results
        $infos = $query->paginate($perPage)->withQueryString();

        // Get all types, categories, and departments for filtering
        $types = InfoType::orderBy('name')->get();
        $categories = InfoCategory::orderBy('name')->get();
        $departments = Department::orderBy('name')->get();

        return Inertia::render('Info/Index', [
            'infos' => $infos,
            'types' => $types,
            'categories' => $categories,
            'departments' => $departments,
            'filters' => [
                'search' => $search,
                'sort' => $sort,
                'direction' => $direction,
                'per_page' => $perPage,
                'type_id' => $typeFilter,
                'category_id' => $categoryFilter,
                'department_id' => $departmentFilter,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Check authorization
        Gate::authorize('create', Info::class);

        // Get data for dropdowns without caching
        $infoTypes = InfoType::orderBy('name')->get();
        $infoCategories = InfoCategory::orderBy('name')->get();
        $departments = Department::orderBy('name')->get();

        return Inertia::render('Info/Create', [
            'infoTypes' => $infoTypes,
            'infoCategories' => $infoCategories,
            'departments' => $departments,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Check authorization
        Gate::authorize('create', Info::class);

        $validated = $request->validate([
            'info_type_id' => 'required|integer|exists:info_types,id',
            'info_category_id' => 'required|integer|exists:info_categories,id',
            'department_id' => 'nullable|string|exists:departments,id|not_in:none',
            'name' => 'nullable|string|min:2|max:255',
            'code' => [
                'nullable',
                'string',
                'max:50',
                'regex:/^[A-Za-z0-9_\-\.]+$/',
                'unique:infos,code'
            ],
            'description' => 'nullable|string|max:1000',
            'value' => 'nullable|array',
            'value.content' => 'nullable|string',
            'value.location' => 'nullable|array',
            'value.location.lat' => 'nullable|numeric',
            'value.location.lng' => 'nullable|numeric',
            'value.location.province' => 'nullable|string|max:255',
            'user_id' => 'nullable|integer|exists:users,id',
            'confirmed' => 'boolean',
        ], [
            'info_type_id.required' => 'The info type field is required.',
            'info_category_id.required' => 'The info category field is required.',
            'department_id.exists' => 'The selected department does not exist.',
            'department_id.not_in' => 'Please select a valid department.',
            'name.min' => 'The name must be at least 2 characters.',
            'code.regex' => 'The code may only contain letters, numbers, dashes, underscores, and periods.',
            'code.unique' => 'This code is already in use.',
            'value.location.lat.numeric' => 'The latitude must be a valid number.',
            'value.location.lng.numeric' => 'The longitude must be a valid number.',
            'value.location.province.max' => 'The province name cannot exceed 255 characters.',
        ]);

        // Handle 'none' value for department_id
        if (isset($validated['department_id']) && $validated['department_id'] === 'none') {
            $validated['department_id'] = null;
        }

        // Sanitize inputs
        if (isset($validated['name'])) {
            $validated['name'] = strip_tags($validated['name']);
        }
        if (isset($validated['code'])) {
            $validated['code'] = strip_tags($validated['code']);
        }
        if (isset($validated['description'])) {
            $validated['description'] = strip_tags($validated['description']);
        }

        // Sanitize array values
        if (isset($validated['value']) && is_array($validated['value'])) {
            foreach ($validated['value'] as $key => $val) {
                if (is_string($val)) {
                    $validated['value'][$key] = strip_tags($val);
                }

                // Handle nested location array
                if ($key === 'location' && is_array($val)) {
                    if (isset($val['province']) && is_string($val['province'])) {
                        $validated['value']['location']['province'] = strip_tags($val['province']);
                    }
                }
            }
        }

        // Set the user who created the record
        $validated['created_by'] = Auth::id();

        // Create the record within a transaction
        try {
            DB::beginTransaction();
            $info = Info::create($validated);
            DB::commit();

            return Redirect::route('infos.index')->with('success', 'Info created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return Redirect::back()->with('error', 'An error occurred while creating the info: ' . $e->getMessage())->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Info $info)
    {
        // Check if the user can view this info
        Gate::authorize('view', $info);

        // Load related data without caching
        $info->load(['infoType', 'infoCategory', 'department', 'user', 'creator', 'confirmer']);

        return Inertia::render('Info/Show', [
            'info' => $info,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Info $info)
    {
        // Check authorization
        Gate::authorize('update', $info);

        // Load data for dropdowns
        $infoTypes = InfoType::orderBy('name')->get();
        $infoCategories = InfoCategory::orderBy('name')->get();
        $departments = Department::orderBy('name')->get();

        // Load the info with its relationships
        $info->load(['infoType', 'infoCategory', 'department']);

        return Inertia::render('Info/Edit', [
            'info' => $info,
            'infoTypes' => $infoTypes,
            'infoCategories' => $infoCategories,
            'departments' => $departments,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Info $info)
    {
        // Check authorization
        Gate::authorize('update', $info);

        $validated = $request->validate([
            'info_type_id' => 'required|integer|exists:info_types,id',
            'info_category_id' => 'required|integer|exists:info_categories,id',
            'department_id' => 'nullable|string|exists:departments,id|not_in:none',
            'name' => 'nullable|string|min:2|max:255',
            'code' => [
                'nullable',
                'string',
                'max:50',
                'regex:/^[A-Za-z0-9_\-\.]+$/',
                Rule::unique('infos', 'code')->ignore($info->id)
            ],
            'description' => 'nullable|string|max:1000',
            'value' => 'nullable|array',
            'value.content' => 'nullable|string',
            'value.location' => 'nullable|array',
            'value.location.lat' => 'nullable|numeric',
            'value.location.lng' => 'nullable|numeric',
            'value.location.province' => 'nullable|string|max:255',
            'user_id' => 'nullable|integer|exists:users,id',
            'confirmed' => 'boolean',
        ], [
            'info_type_id.required' => 'The info type field is required.',
            'info_category_id.required' => 'The info category field is required.',
            'department_id.exists' => 'The selected department does not exist.',
            'department_id.not_in' => 'Please select a valid department.',
            'name.min' => 'The name must be at least 2 characters.',
            'code.regex' => 'The code may only contain letters, numbers, dashes, underscores, and periods.',
            'code.unique' => 'This code is already in use.',
            'value.location.lat.numeric' => 'The latitude must be a valid number.',
            'value.location.lng.numeric' => 'The longitude must be a valid number.',
            'value.location.province.max' => 'The province name cannot exceed 255 characters.',
        ]);

        // Handle 'none' value for department_id
        if (isset($validated['department_id']) && $validated['department_id'] === 'none') {
            $validated['department_id'] = null;
        }

        // Sanitize inputs
        if (isset($validated['name'])) {
            $validated['name'] = strip_tags($validated['name']);
        }
        if (isset($validated['code'])) {
            $validated['code'] = strip_tags($validated['code']);
        }
        if (isset($validated['description'])) {
            $validated['description'] = strip_tags($validated['description']);
        }

        // Sanitize array values
        if (isset($validated['value']) && is_array($validated['value'])) {
            foreach ($validated['value'] as $key => $val) {
                if (is_string($val)) {
                    $validated['value'][$key] = strip_tags($val);
                }

                // Handle nested location array
                if ($key === 'location' && is_array($val)) {
                    if (isset($val['province']) && is_string($val['province'])) {
                        $validated['value']['location']['province'] = strip_tags($val['province']);
                    }
                }
            }
        }

        // If confirming for the first time, set the confirmer
        if (!$info->confirmed && $request->confirmed) {
            // Check if the user can confirm
            Gate::authorize('confirm', $info);

            $validated['confirmed_by'] = Auth::id();
        }

        // Update the record within a transaction
        try {
            DB::beginTransaction();
            $info->update($validated);
            DB::commit();

            return Redirect::route('infos.index')->with('success', 'Info updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return Redirect::back()->with('error', 'An error occurred while updating the info: ' . $e->getMessage())->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Info $info)
    {
        // Check authorization
        Gate::authorize('delete', $info);

        try {
            DB::beginTransaction();
            $info->delete();
            DB::commit();

            return Redirect::route('infos.index')->with('success', 'Info deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return Redirect::back()->with('error', 'An error occurred while deleting the info: ' . $e->getMessage());
        }
    }
}
