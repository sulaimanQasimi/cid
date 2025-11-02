<?php

namespace App\Http\Controllers;

use App\Models\InfoType;
use App\Models\Info;
use App\Models\InfoStat;
use App\Models\StatCategory;
use App\Models\StatCategoryItem;
use App\Models\InfoCategory;
use App\Models\Department;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;

class InfoTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', InfoType::class);
        
        $validated = $request->validate([
            'search' => 'nullable|string|max:255',
            'sort_field' => ['nullable', 'string', Rule::in([
                'name', 'code', 'description', 'created_at', 'updated_at', 'infos_count', 'info_stats_count'
            ])],
            'sort_direction' => ['nullable', 'string', Rule::in(['asc', 'desc'])],
            'per_page' => 'nullable|integer|min:5|max:100',
            'page' => 'nullable|integer|min:1'
        ]);

        $query = InfoType::with(['creator:id,name'])
            ->withCount(['infos', 'infoStats'])
            ->where(function($q) {
                $q->where('created_by', Auth::id())
                  ->orWhereHas('accesses', function($accessQuery) {
                      $accessQuery->where('user_id', Auth::id());
                  });
            });

        // Apply search filter
        if (!empty($validated['search'])) {
            $searchTerm = $validated['search'];
            $query->where(function($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('code', 'like', "%{$searchTerm}%")
                  ->orWhere('description', 'like', "%{$searchTerm}%");
            });
        }

        // Apply sorting
        $sortField = $validated['sort_field'] ?? 'created_at';
        $sortDirection = $validated['sort_direction'] ?? 'desc';

        if (in_array($sortField, ['infos_count', 'info_stats_count'])) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->orderBy($sortField, $sortDirection);
        }

        $perPage = $validated['per_page'] ?? 10;
        $infoTypes = $query->paginate($perPage)->withQueryString();

        return Inertia::render('Info/Types/Index', [
            'infoTypes' => $infoTypes,
            'filters' => $request->only(['search', 'sort_field', 'sort_direction', 'per_page']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $this->authorize('create', InfoType::class);
        
        $users = User::orderBy('name')->get(['id', 'name', 'email']);

        return Inertia::render('Info/Types/Create', [
            'users' => $users,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', InfoType::class);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:info_types',
            'code' => 'nullable|string|max:50|unique:info_types',
            'description' => 'nullable|string',
            'stats' => 'nullable|array',
            'stats.*.stat_category_item_id' => 'required|exists:stat_category_items,id',
            'stats.*.value' => 'required|string|max:255',
            'stats.*.notes' => 'nullable|string|max:1000',
            'access_users' => 'nullable|array',
            'access_users.*' => 'integer|exists:users,id',
        ]);

        try {
            DB::transaction(function () use ($validated) {
                $infoType = InfoType::create([
                    'name' => $validated['name'],
                    'code' => $validated['code'],
                    'description' => $validated['description'],
                    'created_by' => Auth::id(),
                ]);

                // Create associated stats
                if (!empty($validated['stats'])) {
                    $this->createInfoStats($infoType, $validated['stats']);
                }

                // Create access permissions
                if (isset($validated['access_users']) && is_array($validated['access_users'])) {
                    foreach ($validated['access_users'] as $userId) {
                        // Don't create access for the creator
                        if ($userId != Auth::id()) {
                            $infoType->accesses()->create(['user_id' => $userId]);
                        }
                    }
                }

                return $infoType;
            });

            return redirect()
                ->route('info-types.index')
                ->with('success', 'Info type created successfully.');

        } catch (\Exception $e) {
            Log::error('Failed to create info type', [
                'error' => $e->getMessage(),
                'data' => $validated
            ]);

            return redirect()
                ->back()
                ->with('error', 'Failed to create info type. Please try again.')
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(InfoType $infoType): Response
    {
        $this->authorize('view', $infoType);
        
        // Load the info type with all necessary relationships
        $infoType->load([
            'creator:id,name'
        ]);

        $infos = $infoType->infos()
            ->with(['infoType:id,name', 'infoCategory:id,name'])
            ->orderBy('created_at', 'desc')
            ->paginate(5);

        // Get data for the create modal
        $infoCategories = InfoCategory::orderBy('name')->get();
        $departments = Department::orderBy('name')->get();

        return Inertia::render('Info/Types/Show', [
            'infoType' => $infoType,
            'infos' => $infos,
            'infoCategories' => $infoCategories,
            'departments' => $departments,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(InfoType $infoType): Response
    {
        $this->authorize('update', $infoType);
        
        $infoType->load(['accesses.user:id,name,email']);
        $users = User::orderBy('name')->get(['id', 'name', 'email']);

        return Inertia::render('Info/Types/Edit', [
            'infoType' => $infoType,
            'users' => $users,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, InfoType $infoType): RedirectResponse
    {
        $this->authorize('update', $infoType);
        
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('info_types')->ignore($infoType->id)],
            'code' => ['nullable', 'string', 'max:50', Rule::unique('info_types')->ignore($infoType->id)],
            'description' => 'nullable|string',
            'access_users' => 'nullable|array',
            'access_users.*' => 'integer|exists:users,id',
            'deleted_users' => 'nullable|array',
            'deleted_users.*' => 'integer|exists:users,id',
        ]);

        try {
            DB::transaction(function () use ($infoType, $validated) {
                $infoType->update([
                    'name' => $validated['name'],
                    'code' => $validated['code'],
                    'description' => $validated['description'],
                    'updated_by' => Auth::id(),
                ]);

                // Handle access permissions update
                if (isset($validated['access_users'])) {
                    // Remove all existing access permissions
                    $infoType->accesses()->delete();
                    
                    // Add new access permissions
                    foreach ($validated['access_users'] as $userId) {
                        // Don't create access for the creator
                        if ($userId != Auth::id()) {
                            $infoType->accesses()->create(['user_id' => $userId]);
                        }
                    }
                }

                // Handle deleted users (for logging/audit purposes)
                if (isset($validated['deleted_users']) && is_array($validated['deleted_users'])) {
                    \Log::info('Users removed from info type access', [
                        'info_type_id' => $infoType->id,
                        'deleted_user_ids' => $validated['deleted_users'],
                        'deleted_by' => Auth::id(),
                        'timestamp' => now()
                    ]);
                }
            });

            return redirect()
                ->route('info-types.show', $infoType)
                ->with('success', 'Info type updated successfully.');

        } catch (\Exception $e) {
            Log::error('Failed to update info type', [
                'error' => $e->getMessage(),
                'info_type_id' => $infoType->id,
                'data' => $validated
            ]);

            return redirect()
                ->back()
                ->with('error', 'Failed to update info type. Please try again.')
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(InfoType $infoType): RedirectResponse
    {
        $this->authorize('delete', InfoType::class);
        
        try {
            // Stats will be automatically soft deleted due to foreign key constraints
            $infoType->delete();

            return redirect()
                ->route('info-types.index')
                ->with('success', 'Info type deleted successfully.');

        } catch (\Exception $e) {
            Log::error('Failed to delete info type', [
                'error' => $e->getMessage(),
                'info_type_id' => $infoType->id
            ]);

            return redirect()
                ->back()
                ->with('error', 'Failed to delete info type. Please try again.');
        }
    }

    /**
     * Display infos for a specific info type.
     */
    public function showInfos(InfoType $infoType): Response
    {
        $this->authorize('view', $infoType);
        
        $infoType->load(['creator:id,name']);
        
        $infos = $infoType->infos()
            ->with(['infoType:id,name', 'infoCategory:id,name'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Info/Types/Infos', [
            'infoType' => $infoType,
            'infos' => $infos,
        ]);
    }

    /**
     * Display the print view for a specific info type.
     */
    public function print(InfoType $infoType): Response
    {
        $this->authorize('view', $infoType);
        
        // Load the info type with all necessary relationships
        $infoType->load([
            'creator:id,name',
            'infoStats' => function($query) {
                $query->with(['statCategoryItem.category'])
                      ->orderBy('created_at', 'desc');
            }
        ]);

        // Load all infos with comprehensive relationships
        $infos = $infoType->infos()
            ->with([
                'infoType:id,name',
                'infoCategory:id,name,code',
                'department:id,name,code',
                'creator:id,name',
                'confirmer:id,name',
                'province:id,name',
                'district:id,name'
            ])
            ->orderBy('created_at', 'desc')
            ->get();

        $statCategories = StatCategory::where('status', 'active')
            ->orderBy('label')
            ->get();

        return Inertia::render('Info/Types/Print', [
            'infoType' => $infoType,
            'infos' => $infos,
            'statCategories' => $statCategories,
        ]);
    }

    /**
     * Get statistical data for forms.
     */
    private function getStatisticalData(): array
    {
        $statCategories = StatCategory::where('status', 'active')
            ->orderBy('label')
            ->get(['id', 'name', 'label', 'color', 'status']);

        $statItems = StatCategoryItem::with(['category:id,name,label,color'])
            ->whereHas('category', fn($query) => $query->where('status', 'active'))
            ->where('status', 'active')
            ->orderBy('order')
            ->get(['id', 'name', 'label', 'color', 'parent_id', 'stat_category_id']);

        return [
            'statCategories' => $statCategories,
            'statItems' => $statItems,
        ];
    }

    /**
     * Create info statistics for a given info type.
     */
    private function createInfoStats(InfoType $infoType, array $statsData): void
    {
        $statsToCreate = [];

        foreach ($statsData as $statData) {
            $statsToCreate[] = [
                'info_type_id' => $infoType->id,
                'stat_category_item_id' => $statData['stat_category_item_id'],
                'string_value' => $statData['value'],
                'notes' => $statData['notes'] ?? null,
                'created_by' => Auth::id(),
                'updated_by' => Auth::id(),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        if (!empty($statsToCreate)) {
            InfoStat::insert($statsToCreate);
        }
    }

}