<?php

namespace App\Http\Controllers;

use App\Models\Info;
use App\Models\InfoType;
use App\Models\InfoCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class InfoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Info/Index', [
            'infos' => Info::with(['infoType', 'infoCategory', 'user'])
                ->orderBy('created_at', 'desc')
                ->paginate(10),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Info/Create', [
            'infoTypes' => InfoType::orderBy('name')->get(),
            'infoCategories' => InfoCategory::orderBy('name')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'info_type_id' => 'required|exists:info_types,id',
            'info_category_id' => 'required|exists:info_categories,id',
            'name' => 'nullable|string|max:255',
            'code' => 'nullable|string|max:255|unique:infos,code',
            'description' => 'nullable|string|max:255',
            'value' => 'nullable|array',
            'user_id' => 'nullable|exists:users,id',
            'confirmed' => 'boolean',
        ]);

        // Set the user who created the record
        $validated['created_by'] = Auth::id();

        Info::create($validated);

        return Redirect::route('infos.index')->with('success', 'Info created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Info $info)
    {
        $info->load(['infoType', 'infoCategory', 'user', 'creator', 'confirmer']);

        return Inertia::render('Info/Show', [
            'info' => $info,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Info $info)
    {
        return Inertia::render('Info/Edit', [
            'info' => $info,
            'infoTypes' => InfoType::orderBy('name')->get(),
            'infoCategories' => InfoCategory::orderBy('name')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Info $info)
    {
        $validated = $request->validate([
            'info_type_id' => 'required|exists:info_types,id',
            'info_category_id' => 'required|exists:info_categories,id',
            'name' => 'nullable|string|max:255',
            'code' => 'nullable|string|max:255|unique:infos,code,' . $info->id,
            'description' => 'nullable|string|max:255',
            'value' => 'nullable|array',
            'user_id' => 'nullable|exists:users,id',
            'confirmed' => 'boolean',
        ]);

        // If confirming for the first time, set the confirmer
        if (!$info->confirmed && $request->confirmed) {
            $validated['confirmed_by'] = Auth::id();
        }

        $info->update($validated);

        return Redirect::route('infos.index')->with('success', 'Info updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Info $info)
    {
        $info->delete();

        return Redirect::route('infos.index')->with('success', 'Info deleted successfully.');
    }
}
