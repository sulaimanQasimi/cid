<?php

namespace App\Http\Controllers;

use App\Models\NationalInsightCenterInfoItem;
use App\Models\NationalInsightCenterInfo;
use App\Models\InfoCategory;
use App\Models\Province;
use App\Models\District;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;

class NationalInsightCenterInfoItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', NationalInsightCenterInfoItem::class);
        
        $validated = $request->validate([
            'search' => 'nullable|string|max:255',
            'national_insight_center_info_id' => 'nullable|integer|exists:national_insight_center_infos,id',
            'per_page' => 'nullable|integer|min:5|max:100',
            'page' => 'nullable|integer|min:1'
        ]);

        $query = NationalInsightCenterInfoItem::with([
            'nationalInsightCenterInfo:id,name',
            'infoCategory:id,name',
            'department:id,name',
            'creator:id,name'
        ])->whereHas('nationalInsightCenterInfo', function($q) {
            $q->where('created_by', Auth::id())
              ->orWhereHas('accesses', function($accessQuery) {
                  $accessQuery->where('user_id', Auth::id());
              });
        });

        // Apply search filter
        if (!empty($validated['search'])) {
            $query->where(function($q) use ($validated) {
                $q->where('name', 'like', '%' . $validated['search'] . '%')
                  ->orWhere('code', 'like', '%' . $validated['search'] . '%')
                  ->orWhere('description', 'like', '%' . $validated['search'] . '%');
            });
        }

        // Filter by national insight center info
        if (!empty($validated['national_insight_center_info_id'])) {
            $query->where('national_insight_center_info_id', $validated['national_insight_center_info_id']);
        }

        $query->orderBy('created_at', 'desc');

        // Get paginated results
        $perPage = $validated['per_page'] ?? 10;
        $items = $query->paginate($perPage);

        // Get data for filters
        $nationalInsightCenterInfos = NationalInsightCenterInfo::where(function($q) {
            $q->where('created_by', Auth::id())
              ->orWhereHas('accesses', function($accessQuery) {
                  $accessQuery->where('user_id', Auth::id());
              });
        })->orderBy('name')->get();

        return Inertia::render('NationalInsightCenterInfoItem/Index', [
            'items' => $items,
            'nationalInsightCenterInfos' => $nationalInsightCenterInfos,
            'filters' => [
                'search' => $validated['search'] ?? '',
                'national_insight_center_info_id' => $validated['national_insight_center_info_id'] ?? null,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): Response
    {
        $this->authorize('create', NationalInsightCenterInfoItem::class);
        
        $nationalInsightCenterInfoId = $request->get('national_insight_center_info_id');
        
        $nationalInsightCenterInfos = NationalInsightCenterInfo::where(function($q) {
            $q->where('created_by', Auth::id())
              ->orWhereHas('accesses', function($accessQuery) {
                  $accessQuery->where('user_id', Auth::id());
              });
        })->orderBy('name')->get();
        $infoCategories = InfoCategory::orderBy('name')->get();
        $provinces = Province::orderBy('name')->with('districts')->get();

        return Inertia::render('NationalInsightCenterInfoItem/Create', [
            'nationalInsightCenterInfos' => $nationalInsightCenterInfos,
            'infoCategories' => $infoCategories,
            'provinces' => $provinces,
            'nationalInsightCenterInfoId' => $nationalInsightCenterInfoId,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', NationalInsightCenterInfoItem::class);
        
        $validated = $request->validate([
            'national_insight_center_info_id' => 'required|exists:national_insight_center_infos,id',
            'title' => 'required|string|max:255',
            'registration_number' => 'required|string|max:255|unique:national_insight_center_info_items',
            'info_category_id' => 'nullable|exists:info_categories,id',
            'province_id' => 'nullable|exists:provinces,id',
            'district_id' => 'nullable|exists:districts,id',
            'description' => 'nullable|string',
            'date' => 'nullable|date',
        ]);

        try {
            $item = NationalInsightCenterInfoItem::create([
                'national_insight_center_info_id' => $validated['national_insight_center_info_id'],
                'title' => $validated['title'],
                'registration_number' => $validated['registration_number'],
                'info_category_id' => $validated['info_category_id'],
                'department_id' => Auth::user()->department_id,
                'province_id' => $validated['province_id'],
                'district_id' => $validated['district_id'],
                'description' => $validated['description'],
                'date' => $validated['date'],
                'created_by' => Auth::id(),
                'confirmed' => false,
                'confirmed_by' => null,
                // 'confirmed_at' => null,
            ]);

            return redirect()
                ->route('national-insight-center-info-items.show', $item)
                ->with('success', 'National Insight Center Info Item created successfully.');

        } catch (\Exception $e) {
            Log::error('Failed to create national insight center info item', [
                'error' => $e->getMessage(),
                'data' => $validated
            ]);

            return redirect()
                ->back()
                ->with('error', 'Failed to create national insight center info item. Please try again.')
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(NationalInsightCenterInfoItem $item): Response
    {
        $this->authorize('view', $item);

        // Record the visit
        $item->recordVisit();

        // Load related data
        $item->load([
            'nationalInsightCenterInfo',
            'infoCategory',
            'province',
            'district',
            'creator.department',
            'confirmer.department',
        ]);

        return Inertia::render('NationalInsightCenterInfoItem/Show', [
            'item' => $item,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(NationalInsightCenterInfoItem $item): Response
    {
        $this->authorize('update', $item);

        // Load data for dropdowns
        $nationalInsightCenterInfos = NationalInsightCenterInfo::where(function($q) {
            $q->where('created_by', Auth::id())
              ->orWhereHas('accesses', function($accessQuery) {
                  $accessQuery->where('user_id', Auth::id());
              });
        })->orderBy('name')->get();
        $infoCategories = InfoCategory::orderBy('name')->get();
        $provinces = Province::orderBy('name')->with('districts')->get();
     
        // Load the item with its relationships
        $item->load([
            'nationalInsightCenterInfo',
            'infoCategory',
            'province',
            'district',
            'creator'
        ]);

        return Inertia::render('NationalInsightCenterInfoItem/Edit', [
            'item' => $item,
            'nationalInsightCenterInfos' => $nationalInsightCenterInfos,
            'infoCategories' => $infoCategories,
            'provinces' => $provinces,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, NationalInsightCenterInfoItem $item): RedirectResponse
    {
        $this->authorize('update', $item);
        
        $validated = $request->validate([
            'national_insight_center_info_id' => 'required|exists:national_insight_center_infos,id',
            'title' => 'required|string|max:255',
            'registration_number' => 'required|string|max:255|unique:national_insight_center_info_items,registration_number,' . $item->id,
            'info_category_id' => 'nullable|exists:info_categories,id',
            'province_id' => 'nullable|exists:provinces,id',
            'district_id' => 'nullable|exists:districts,id',
            'description' => 'nullable|string',
            'date' => 'nullable|date',
        ]);

        try {
            $item->update([
                'national_insight_center_info_id' => $validated['national_insight_center_info_id'],
                'title' => $validated['title'],
                'registration_number' => $validated['registration_number'],
                'info_category_id' => $validated['info_category_id'],
                'department_id' => Auth::user()->department_id,
                'province_id' => $validated['province_id'],
                'district_id' => $validated['district_id'],
                'description' => $validated['description'],
                'date' => $validated['date'],
            ]);

            return redirect()
                ->route('national-insight-center-info-items.show', $item)
                ->with('success', 'National Insight Center Info Item updated successfully.');

        } catch (\Exception $e) {
            Log::error('Failed to update national insight center info item', [
                'error' => $e->getMessage(),
                'item_id' => $item->id,
                'data' => $validated
            ]);

            return redirect()
                ->back()
                ->with('error', 'Failed to update national insight center info item. Please try again.')
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(NationalInsightCenterInfoItem $item): RedirectResponse
    {
        $this->authorize('delete', $item);
        
        try {
            $item->delete();

            return redirect()
                ->route('national-insight-center-info-items.index')
                ->with('success', 'National Insight Center Info Item deleted successfully.');

        } catch (\Exception $e) {
            Log::error('Failed to delete national insight center info item', [
                'error' => $e->getMessage(),
                'item_id' => $item->id
            ]);

            return redirect()
                ->back()
                ->with('error', 'Failed to delete national insight center info item. Please try again.');
        }
    }

    /**
     * Confirm the specified resource.
     */
    public function confirm(NationalInsightCenterInfoItem $item): RedirectResponse
    {
        $this->authorize('confirm', $item);
        
        try {
            $item->update([
                'confirmed' => true,
                'confirmed_by' => Auth::id(),
            ]);

            return redirect()
                ->back()
                ->with('success', 'National Insight Center Info Item confirmed successfully.');

        } catch (\Exception $e) {
            Log::error('Failed to confirm national insight center info item', [
                'error' => $e->getMessage(),
                'item_id' => $item->id
            ]);

            return redirect()
                ->back()
                ->with('error', 'Failed to confirm national insight center info item. Please try again.');
        }
    }

}
