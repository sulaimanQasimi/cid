<?php

namespace App\Http\Controllers;

use App\Models\InfoType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class InfoTypeController extends Controller
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
        $query = InfoType::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $query->orderBy($sort, $direction);

        // Cache results for 5 minutes with a cache key that includes query parameters
        $cacheKey = "info_types.{$perPage}.{$search}.{$sort}.{$direction}." . $request->input('page', 1);
        $infoTypes = Cache::remember($cacheKey, now()->addMinutes(5), function () use ($query, $perPage) {
            return $query->paginate($perPage)->withQueryString();
        });

        return Inertia::render('Info/Types/Index', [
            'infoTypes' => $infoTypes,
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
        Gate::authorize('create', InfoType::class);

        return Inertia::render('Info/Types/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Check authorization
        Gate::authorize('create', InfoType::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:255|unique:info_types,code',
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

        InfoType::create($validated);

        // Clear the cache for info types
        Cache::forget('info_types_all');

        return Redirect::route('info-types.index')->with('success', 'Info type created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(InfoType $infoType)
    {
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
        // Check authorization
        Gate::authorize('update', $infoType);

        return Inertia::render('Info/Types/Edit', [
            'infoType' => $infoType,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, InfoType $infoType)
    {
        // Check authorization
        Gate::authorize('update', $infoType);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:255|unique:info_types,code,' . $infoType->id,
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

        $infoType->update($validated);

        // Clear relevant caches
        Cache::forget('info_types_all');
        Cache::forget("info_type_{$infoType->id}");

        return Redirect::route('info-types.index')->with('success', 'Info type updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(InfoType $infoType)
    {
        // Check authorization
        Gate::authorize('delete', $infoType);

        // Check if the info type has associated infos
        if ($infoType->infos()->count() > 0) {
            return Redirect::back()->with('error', 'Cannot delete info type with associated info records.');
        }

        $infoType->delete();

        // Clear relevant caches
        Cache::forget('info_types_all');
        Cache::forget("info_type_{$infoType->id}");

        return Redirect::route('info-types.index')->with('success', 'Info type deleted successfully.');
    }
}
