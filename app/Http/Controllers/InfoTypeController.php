<?php

namespace App\Http\Controllers;

use App\Models\InfoType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class InfoTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Info/Types/Index', [
            'infoTypes' => InfoType::orderBy('name')->paginate(10),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Info/Types/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:255|unique:info_types,code',
            'description' => 'nullable|string|max:255',
        ]);

        InfoType::create($validated);

        return Redirect::route('info-types.index')->with('success', 'Info type created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(InfoType $infoType)
    {
        return Inertia::render('Info/Types/Show', [
            'infoType' => $infoType,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(InfoType $infoType)
    {
        return Inertia::render('Info/Types/Edit', [
            'infoType' => $infoType,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, InfoType $infoType)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:255|unique:info_types,code,' . $infoType->id,
            'description' => 'nullable|string|max:255',
        ]);

        $infoType->update($validated);

        return Redirect::route('info-types.index')->with('success', 'Info type updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(InfoType $infoType)
    {
        $infoType->delete();

        return Redirect::route('info-types.index')->with('success', 'Info type deleted successfully.');
    }
}
