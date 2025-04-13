<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Language;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LanguageController extends Controller
{
    /**
     * Display a listing of the languages.
     */
    public function index()
    {
        $languages = Language::orderBy('default', 'desc')
            ->orderBy('name')
            ->get();

        return Inertia::render('Languages/Index', [
            'languages' => $languages,
        ]);
    }

    /**
     * Show the form for creating a new language.
     */
    public function create()
    {
        return Inertia::render('Languages/Create');
    }

    /**
     * Store a newly created language in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|string|max:10|unique:languages,code',
            'name' => 'required|string|max:50',
            'direction' => 'required|in:ltr,rtl',
            'active' => 'boolean',
            'default' => 'boolean',
        ]);

        // If this is set as default, remove default from others
        if ($request->input('default', false)) {
            Language::where('default', true)->update(['default' => false]);
        }

        Language::create($request->all());

        return redirect()->route('languages.index')
            ->with('success', 'Language created successfully.');
    }

    /**
     * Show the form for editing the specified language.
     */
    public function edit(Language $language)
    {
        return Inertia::render('Languages/Edit', [
            'language' => $language,
        ]);
    }

    /**
     * Update the specified language in storage.
     */
    public function update(Request $request, Language $language)
    {
        $request->validate([
            'code' => 'required|string|max:10|unique:languages,code,' . $language->id,
            'name' => 'required|string|max:50',
            'direction' => 'required|in:ltr,rtl',
            'active' => 'boolean',
            'default' => 'boolean',
        ]);

        // If this is set as default, remove default from others
        if ($request->input('default', false)) {
            Language::where('default', true)
                ->where('id', '!=', $language->id)
                ->update(['default' => false]);
        }

        $language->update($request->all());

        return redirect()->route('languages.index')
            ->with('success', 'Language updated successfully');
    }

    /**
     * Remove the specified language from storage.
     */
    public function destroy(Language $language)
    {
        // Prevent deleting the default language
        if ($language->default) {
            return redirect()->route('languages.index')
                ->with('error', 'Cannot delete the default language.');
        }

        $language->delete();

        return redirect()->route('languages.index')
            ->with('success', 'Language deleted successfully');
    }
}
