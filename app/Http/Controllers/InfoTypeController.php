<?php

namespace App\Http\Controllers;

use App\Models\InfoType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class InfoTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', InfoType::class);
        
        // Validate query parameters
        $validated = $request->validate([
            'per_page' => 'nullable|integer|min:5|max:100',
            'search' => 'nullable|string|max:100',
            'sort' => ['nullable', 'string', Rule::in(['name', 'code', 'description', 'created_at', 'updated_at'])],
            'direction' => ['nullable', 'string', Rule::in(['asc', 'desc'])],
            'page' => 'nullable|integer|min:1',
        ]);

        $perPage = $validated['per_page'] ?? 10;
        $search = $validated['search'] ?? '';
        $sort = $validated['sort'] ?? 'name';
        $direction = $validated['direction'] ?? 'asc';

        // Apply search and sorting
        $query = InfoType::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $query->orderBy($sort, $direction);

        // Get real-time data without caching
        $types = $query->paginate($perPage)->withQueryString();

        return Inertia::render('Info/Types/Index', [
            'types' => $types,
            'filters' => [
                'search' => $search,
                'sort' => $sort,
                'direction' => $direction,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', InfoType::class);

        return Inertia::render('Info/Types/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', InfoType::class);

        $validated = $request->validate([
            'name' => 'required|string|min:2|max:255',
            'code' => [
                'nullable',
                'string',
                'max:50',
                'regex:/^[A-Za-z0-9_\-\.]+$/',
                'unique:info_types,code'
            ],
            'description' => 'nullable|string|max:1000',
        ], [
            'name.required' => 'The name field is required.',
            'name.min' => 'The name must be at least 2 characters.',
            'code.regex' => 'The code may only contain letters, numbers, dashes, underscores, and periods.',
            'code.unique' => 'This code is already in use.',
        ]);

        // Sanitize inputs
        $validated['name'] = strip_tags($validated['name']);
        if (isset($validated['code'])) {
            $validated['code'] = strip_tags($validated['code']);
        }
        if (isset($validated['description'])) {
            $validated['description'] = strip_tags($validated['description']);
        }

        try {
            InfoType::create($validated);
            return Redirect::route('info-types.index')->with('success', 'Info type created successfully.');
        } catch (\Exception $e) {
            return Redirect::back()
                ->with('error', 'Failed to create info type: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(InfoType $infoType)
    {
        $this->authorize('view', $infoType);
        
        // Load related data
        $infoType->load(['infos' => function($query) {
            $query->latest()->limit(5);
        }]);

        return Inertia::render('Info/Types/Show', [
            'infoType' => $infoType,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(InfoType $infoType)
    {
        $this->authorize('update', $infoType);

        return Inertia::render('Info/Types/Edit', [
            'infoType' => $infoType,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, InfoType $infoType)
    {
        $this->authorize('update', $infoType);

        $validated = $request->validate([
            'name' => 'required|string|min:2|max:255',
            'code' => [
                'nullable',
                'string',
                'max:50',
                'regex:/^[A-Za-z0-9_\-\.]+$/',
                Rule::unique('info_types', 'code')->ignore($infoType->id)
            ],
            'description' => 'nullable|string|max:1000',
        ], [
            'name.required' => 'The name field is required.',
            'name.min' => 'The name must be at least 2 characters.',
            'code.regex' => 'The code may only contain letters, numbers, dashes, underscores, and periods.',
            'code.unique' => 'This code is already in use.',
        ]);

        // Sanitize inputs
        $validated['name'] = strip_tags($validated['name']);
        if (isset($validated['code'])) {
            $validated['code'] = strip_tags($validated['code']);
        }
        if (isset($validated['description'])) {
            $validated['description'] = strip_tags($validated['description']);
        }

        try {
            $infoType->update($validated);
            return Redirect::route('info-types.index')->with('success', 'Info type updated successfully.');
        } catch (\Exception $e) {
            return Redirect::back()
                ->with('error', 'Failed to update info type: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(InfoType $infoType)
    {
        $this->authorize('delete', $infoType);

        // Check if the info type has associated infos
        if ($infoType->infos()->count() > 0) {
            return Redirect::back()->with('error', 'Cannot delete info type with associated info records.');
        }

        try {
            $infoType->delete();
            return Redirect::route('info-types.index')->with('success', 'Info type deleted successfully.');
        } catch (\Exception $e) {
            return Redirect::back()->with('error', 'Failed to delete info type: ' . $e->getMessage());
        }
    }
}
