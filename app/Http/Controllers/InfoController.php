<?php

namespace App\Http\Controllers;

use App\Models\Info;
use App\Models\InfoType;
use App\Models\InfoCategory;
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
                Rule::in(['name', 'code', 'description', 'created_at', 'updated_at', 'info_type_id', 'info_category_id'])
            ],
            'direction' => ['nullable', 'string', Rule::in(['asc', 'desc'])],
            'type_id' => 'nullable|integer|exists:info_types,id',
            'category_id' => 'nullable|integer|exists:info_categories,id',
            'page' => 'nullable|integer|min:1',
        ]);

        $perPage = $validated['per_page'] ?? 10;
        $search = $validated['search'] ?? '';
        $sort = $validated['sort'] ?? 'created_at';
        $direction = $validated['direction'] ?? 'desc';
        $typeFilter = $validated['type_id'] ?? null;
        $categoryFilter = $validated['category_id'] ?? null;

        // Apply search and filters
        $query = Info::with(['infoType', 'infoCategory', 'user']);

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

        $query->orderBy($sort, $direction);

        // Get data without caching for real-time results
        $infos = $query->paginate($perPage)->withQueryString();

        // Get all types and categories for display without caching
        $types = InfoType::orderBy('name')->get();
        $categories = InfoCategory::orderBy('name')->get();

        return Inertia::render('Info/Index', [
            'infos' => $infos,
            'types' => $types,
            'categories' => $categories,
            'filters' => [
                'search' => $search,
                'sort' => $sort,
                'direction' => $direction,
                'type_id' => $typeFilter,
                'category_id' => $categoryFilter,
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
        Gate::authorize('create', Info::class);

        // Get data for dropdowns from cache or fetch them
        $infoTypes = Cache::remember('info_types_all', now()->addHours(6), function () {
            return InfoType::orderBy('name')->get();
        });

        $infoCategories = Cache::remember('info_categories_all', now()->addHours(6), function () {
            return InfoCategory::orderBy('name')->get();
        });

        return Inertia::render('Info/Create', [
            'infoTypes' => $infoTypes,
            'infoCategories' => $infoCategories,
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
            'value.*' => 'nullable|string|max:255',
            'user_id' => 'nullable|integer|exists:users,id',
            'confirmed' => 'boolean',
        ], [
            'info_type_id.required' => 'The info type field is required.',
            'info_category_id.required' => 'The info category field is required.',
            'name.min' => 'The name must be at least 2 characters.',
            'code.regex' => 'The code may only contain letters, numbers, dashes, underscores, and periods.',
            'code.unique' => 'This code is already in use.',
            'value.*.max' => 'Each value item cannot exceed 255 characters.',
        ]);

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
            }
        }

        // Set the user who created the record
        $validated['created_by'] = Auth::id();

        // Create the record within a transaction
        try {
            DB::beginTransaction();

            $info = Info::create($validated);

            // Store cache key for later invalidation
            $this->storeCacheKey("infos.");

            DB::commit();

            // Clear the infos cache
            $this->clearInfosCache();

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

        // Check if we have a cached version
        $cachedInfo = Cache::remember("info_{$info->id}", now()->addHour(), function () use ($info) {
            return $info->load(['infoType', 'infoCategory', 'user', 'creator', 'confirmer']);
        });

        return Inertia::render('Info/Show', [
            'info' => $cachedInfo,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Info $info)
    {
        // Check authorization
        Gate::authorize('update', $info);

        // Get data for dropdowns from cache or fetch them
        $infoTypes = Cache::remember('info_types_all', now()->addHours(6), function () {
            return InfoType::orderBy('name')->get();
        });

        $infoCategories = Cache::remember('info_categories_all', now()->addHours(6), function () {
            return InfoCategory::orderBy('name')->get();
        });

        return Inertia::render('Info/Edit', [
            'info' => $info,
            'infoTypes' => $infoTypes,
            'infoCategories' => $infoCategories,
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
            'value.*' => 'nullable|string|max:255',
            'user_id' => 'nullable|integer|exists:users,id',
            'confirmed' => 'boolean',
        ], [
            'info_type_id.required' => 'The info type field is required.',
            'info_category_id.required' => 'The info category field is required.',
            'name.min' => 'The name must be at least 2 characters.',
            'code.regex' => 'The code may only contain letters, numbers, dashes, underscores, and periods.',
            'code.unique' => 'This code is already in use.',
            'value.*.max' => 'Each value item cannot exceed 255 characters.',
        ]);

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

            // Clear the infos cache
            $this->clearInfosCache();
            Cache::forget("info_{$info->id}");

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

            // Clear the infos cache
            $this->clearInfosCache();
            Cache::forget("info_{$info->id}");

            return Redirect::route('infos.index')->with('success', 'Info deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return Redirect::back()->with('error', 'An error occurred while deleting the info: ' . $e->getMessage());
        }
    }

    /**
     * Store a cache key for later invalidation
     */
    private function storeCacheKey(string $keyPrefix)
    {
        $keys = Cache::get('cache_keys_infos', []);
        $keys[] = $keyPrefix . time();
        Cache::put('cache_keys_infos', $keys, now()->addDays(1));
    }

    /**
     * Clear all infos-related cache keys
     */
    private function clearInfosCache()
    {
        // Clear all cache keys starting with 'infos.'
        $keys = Cache::get('cache_keys_infos', []);
        foreach ($keys as $key) {
            Cache::forget($key);
        }

        // Reset the keys array
        Cache::put('cache_keys_infos', [], now()->addDays(1));

        // Clear list cache keys
        Cache::forget('info_types_for_filter');
        Cache::forget('info_categories_for_filter');
    }
}
