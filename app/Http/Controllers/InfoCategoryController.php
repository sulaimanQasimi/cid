<?php

namespace App\Http\Controllers;

use App\Models\InfoCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class InfoCategoryController extends Controller
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
            'sort' => ['nullable', 'string', Rule::in(['name', 'code', 'description', 'created_at', 'updated_at'])],
            'direction' => ['nullable', 'string', Rule::in(['asc', 'desc'])],
            'page' => 'nullable|integer|min:1',
        ]);

        $perPage = $validated['per_page'] ?? 10;
        $search = $validated['search'] ?? '';
        $sort = $validated['sort'] ?? 'name';
        $direction = $validated['direction'] ?? 'asc';

        // Apply search and sorting
        $query = InfoCategory::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $query->orderBy($sort, $direction);

        // Get real-time data without caching
        $categories = $query->paginate($perPage)->withQueryString();

        return Inertia::render('Info/Categories/Index', [
            'categories' => $categories,
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
        // Check authorization
        Gate::authorize('create', InfoCategory::class);

        return Inertia::render('Info/Categories/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Check authorization
        Gate::authorize('create', InfoCategory::class);

        $validated = $request->validate([
            'name' => 'required|string|min:2|max:255',
            'code' => [
                'nullable',
                'string',
                'max:50',
                'regex:/^[A-Za-z0-9_\-\.]+$/',
                'unique:info_categories,code'
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
            InfoCategory::create($validated);

            // Clear the cache for info categories
            Cache::forget('info_categories_all');

            return Redirect::route('info-categories.index')->with('success', 'Info category created successfully.');
        } catch (\Exception $e) {
            return Redirect::back()
                ->with('error', 'Failed to create info category: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(InfoCategory $infoCategory)
    {
        // Load related data
        $infoCategory->load(['infos' => function($query) {
            $query->latest()->limit(5);
        }]);

        return Inertia::render('Info/Categories/Show', [
            'infoCategory' => $infoCategory,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(InfoCategory $infoCategory)
    {
        // Check authorization
        Gate::authorize('update', $infoCategory);

        return Inertia::render('Info/Categories/Edit', [
            'infoCategory' => $infoCategory,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, InfoCategory $infoCategory)
    {
        // Check authorization
        Gate::authorize('update', $infoCategory);

        $validated = $request->validate([
            'name' => 'required|string|min:2|max:255',
            'code' => [
                'nullable',
                'string',
                'max:50',
                'regex:/^[A-Za-z0-9_\-\.]+$/',
                Rule::unique('info_categories', 'code')->ignore($infoCategory->id)
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
            $infoCategory->update($validated);

            // Clear relevant caches
            Cache::forget('info_categories_all');
            Cache::forget("info_category_{$infoCategory->id}");

            return Redirect::route('info-categories.index')->with('success', 'Info category updated successfully.');
        } catch (\Exception $e) {
            return Redirect::back()
                ->with('error', 'Failed to update info category: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(InfoCategory $infoCategory)
    {
        // Check authorization
        Gate::authorize('delete', $infoCategory);

        // Check if the info category has associated infos
        if ($infoCategory->infos()->count() > 0) {
            return Redirect::back()->with('error', 'Cannot delete info category with associated info records.');
        }

        try {
            $infoCategory->delete();

            // Clear relevant caches
            Cache::forget('info_categories_all');
            Cache::forget("info_category_{$infoCategory->id}");

            return Redirect::route('info-categories.index')->with('success', 'Info category deleted successfully.');
        } catch (\Exception $e) {
            return Redirect::back()->with('error', 'Failed to delete info category: ' . $e->getMessage());
        }
    }
}
