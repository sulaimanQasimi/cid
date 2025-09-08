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
use Illuminate\Support\Facades\Log;

class InfoController extends Controller
{


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Info::class);

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
        $validated['user_id'] = Auth::id();

        // Create the record within a transaction
        try {
            DB::beginTransaction();
            $info = Info::create($validated);
            DB::commit();

            // Redirect to the info type show page if type_id is provided, otherwise to info-types index
            if ($validated['info_type_id']) {
                return Redirect::route('info-types.show', $validated['info_type_id'])->with('success', 'Info created successfully.');
            }
            return Redirect::route('info-types.index')->with('success', 'Info created successfully.');
        } catch (\Exception $e) {
            Log::error('Error creating info: ' . $e->getMessage());
            DB::rollBack();
            return Redirect::back()->with('error', 'An error occurred while creating the info: ' . $e->getMessage())->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Info $info)
    {
        $this->authorize('view', $info);

        // Record the visit
        $info->recordVisit();

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
        $this->authorize('update', $info);

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
        $this->authorize('update', $info);

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

            // Redirect to the info type show page if type_id is provided, otherwise to info-types index
            if ($validated['info_type_id']) {
                return Redirect::route('info-types.show', $validated['info_type_id'])->with('success', 'Info updated successfully.');
            }
            return Redirect::route('info-types.index')->with('success', 'Info updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return Redirect::back()->with('error', 'An error occurred while updating the info: ' . $e->getMessage())->withInput();
        }
    }

    /**
     * Confirm the specified info.
     */
    public function confirm(Info $info)
    {
        $this->authorize('confirm', $info);

        try {
            DB::beginTransaction();
            
            $info->update([
                'confirmed' => true,
                'confirmed_by' => Auth::id(),
            ]);
            
            DB::commit();

            // Redirect to the info type show page if type_id is available, otherwise to info-types index
            if ($info->info_type_id) {
                return Redirect::route('info-types.show', $info->info_type_id)->with('success', __('info.confirmation.success'));
            }
            return Redirect::route('info-types.index')->with('success', __('info.confirmation.success'));
        } catch (\Exception $e) {
            DB::rollBack();
            return Redirect::back()->with('error', 'An error occurred while confirming the info: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Info $info)
    {
        $this->authorize('delete', $info);

        try {
            DB::beginTransaction();
            $info->delete();
            DB::commit();

            // Redirect to the info type show page if type_id is available, otherwise to info-types index
            if ($info->info_type_id) {
                return Redirect::route('info-types.show', $info->info_type_id)->with('success', 'Info deleted successfully.');
            }
            return Redirect::route('info-types.index')->with('success', 'Info deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return Redirect::back()->with('error', 'An error occurred while deleting the info: ' . $e->getMessage());
        }
    }
}
