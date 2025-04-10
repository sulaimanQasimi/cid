<?php

namespace App\Http\Controllers;

use App\Models\InfoCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class InfoCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $search = $request->input('search', '');
        $sort = $request->input('sort', 'name');
        $direction = $request->input('direction', 'asc');

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

        // Cache results for 5 minutes with a cache key that includes query parameters
        $cacheKey = "info_categories.{$perPage}.{$search}.{$sort}.{$direction}." . $request->input('page', 1);
        $infoCategories = Cache::remember($cacheKey, now()->addMinutes(5), function () use ($query, $perPage) {
            return $query->paginate($perPage)->withQueryString();
        });

        return Inertia::render('Info/Categories/Index', [
            'infoCategories' => $infoCategories,
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
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:255|unique:info_categories,code',
            'description' => 'nullable|string|max:255',
        ]);

        // Sanitize inputs
        $validated['name'] = strip_tags($validated['name']);
        if (isset($validated['code'])) {
            $validated['code'] = strip_tags($validated['code']);
        }
        if (isset($validated['description'])) {
            $validated['description'] = strip_tags($validated['description']);
        }

        InfoCategory::create($validated);

        // Clear the cache for info categories
        Cache::forget('info_categories_all');

        return Redirect::route('info-categories.index')->with('success', 'Info category created successfully.');
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
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:255|unique:info_categories,code,' . $infoCategory->id,
            'description' => 'nullable|string|max:255',
        ]);

        // Sanitize inputs
        $validated['name'] = strip_tags($validated['name']);
        if (isset($validated['code'])) {
            $validated['code'] = strip_tags($validated['code']);
        }
        if (isset($validated['description'])) {
            $validated['description'] = strip_tags($validated['description']);
        }

        $infoCategory->update($validated);

        // Clear relevant caches
        Cache::forget('info_categories_all');
        Cache::forget("info_category_{$infoCategory->id}");

        return Redirect::route('info-categories.index')->with('success', 'Info category updated successfully.');
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

        $infoCategory->delete();

        // Clear relevant caches
        Cache::forget('info_categories_all');
        Cache::forget("info_category_{$infoCategory->id}");

        return Redirect::route('info-categories.index')->with('success', 'Info category deleted successfully.');
    }
}
