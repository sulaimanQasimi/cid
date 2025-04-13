<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Language;
use App\Models\Translation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TranslationController extends Controller
{
    /**
     * Display a listing of the translations.
     */
    public function index(Request $request)
    {
        $languages = Language::orderBy('default', 'desc')
            ->orderBy('name')
            ->get();

        $selectedLanguage = $request->query('language');
        $selectedGroup = $request->query('group');

        if (!$selectedLanguage && count($languages) > 0) {
            $selectedLanguage = $languages->firstWhere('default', true)?->code ?? $languages->first()->code;
        }

        $language = Language::where('code', $selectedLanguage)->first();

        $query = Translation::query()
            ->when($language, function ($query) use ($language) {
                $query->where('language_id', $language->id);
            })
            ->when($selectedGroup, function ($query) use ($selectedGroup) {
                $query->where('group', $selectedGroup);
            });

        $translations = $query->orderBy('group')
            ->orderBy('key')
            ->paginate(50)
            ->withQueryString();

        $groups = Translation::select('group')
            ->when($language, function ($query) use ($language) {
                $query->where('language_id', $language->id);
            })
            ->groupBy('group')
            ->pluck('group');

        return Inertia::render('Translations/Index', [
            'languages' => $languages,
            'translations' => $translations,
            'groups' => $groups,
            'filters' => [
                'language' => $selectedLanguage,
                'group' => $selectedGroup,
            ],
        ]);
    }

    /**
     * Show the form for creating a new translation.
     */
    public function create()
    {
        $languages = Language::where('active', true)
            ->orderBy('default', 'desc')
            ->orderBy('name')
            ->get();

        $groups = Translation::select('group')
            ->groupBy('group')
            ->pluck('group');

        return Inertia::render('Translations/Create', [
            'languages' => $languages,
            'groups' => $groups,
        ]);
    }

    /**
     * Store a newly created translation in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'language_id' => 'required|exists:languages,id',
            'key' => 'required|string',
            'value' => 'nullable|string',
            'group' => 'nullable|string',
        ]);

        // Check if the translation already exists
        $exists = Translation::where('language_id', $request->input('language_id'))
            ->where('key', $request->input('key'))
            ->where('group', $request->input('group', 'general'))
            ->exists();

        if ($exists) {
            return redirect()->back()
                ->with('error', 'Translation key already exists in this language and group.');
        }

        Translation::create([
            'language_id' => $request->input('language_id'),
            'key' => $request->input('key'),
            'value' => $request->input('value'),
            'group' => $request->input('group', 'general'),
        ]);

        return redirect()->route('translations.index', [
            'language' => Language::find($request->input('language_id'))->code,
            'group' => $request->input('group', 'general'),
        ])->with('success', 'Translation created successfully.');
    }

    /**
     * Show the form for editing the specified translation.
     */
    public function edit(Translation $translation)
    {
        $languages = Language::where('active', true)
            ->orderBy('default', 'desc')
            ->orderBy('name')
            ->get();

        $groups = Translation::select('group')
            ->groupBy('group')
            ->pluck('group');

        return Inertia::render('Translations/Edit', [
            'translation' => $translation,
            'languages' => $languages,
            'groups' => $groups,
        ]);
    }

    /**
     * Update the specified translation in storage.
     */
    public function update(Request $request, Translation $translation)
    {
        $request->validate([
            'language_id' => 'required|exists:languages,id',
            'key' => 'required|string',
            'value' => 'nullable|string',
            'group' => 'nullable|string',
        ]);

        // Check if the new key+group would conflict with existing translation
        if ($request->input('key') !== $translation->key ||
            $request->input('group', 'general') !== $translation->group ||
            $request->input('language_id') !== $translation->language_id) {

            $exists = Translation::where('language_id', $request->input('language_id'))
                ->where('key', $request->input('key'))
                ->where('group', $request->input('group', 'general'))
                ->where('id', '!=', $translation->id)
                ->exists();

            if ($exists) {
                return redirect()->back()
                    ->with('error', 'Translation key already exists in this language and group.');
            }
        }

        $translation->update([
            'language_id' => $request->input('language_id'),
            'key' => $request->input('key'),
            'value' => $request->input('value'),
            'group' => $request->input('group', 'general'),
        ]);

        return redirect()->route('translations.index', [
            'language' => Language::find($request->input('language_id'))->code,
            'group' => $request->input('group', 'general'),
        ])->with('success', 'Translation updated successfully.');
    }

    /**
     * Remove the specified translation from storage.
     */
    public function destroy(Translation $translation)
    {
        $language = $translation->language;
        $group = $translation->group;

        $translation->delete();

        return redirect()->route('translations.index', [
            'language' => $language->code,
            'group' => $group,
        ])->with('success', 'Translation deleted successfully.');
    }

    /**
     * Import translations from JSON file
     */
    public function import(Request $request)
    {
        $request->validate([
            'language_id' => 'required|exists:languages,id',
            'file' => 'required|file|mimes:json',
            'group' => 'nullable|string',
        ]);

        $language = Language::findOrFail($request->input('language_id'));
        $group = $request->input('group', 'general');

        try {
            $json = json_decode(file_get_contents($request->file('file')), true);

            if (!is_array($json)) {
                throw new \Exception("Invalid JSON format");
            }

            $count = 0;
            foreach ($json as $key => $value) {
                if (is_string($value)) {
                    Translation::updateOrCreate(
                        [
                            'language_id' => $language->id,
                            'key' => $key,
                            'group' => $group,
                        ],
                        [
                            'value' => $value,
                        ]
                    );
                    $count++;
                }
            }

            return redirect()->route('translations.index', [
                'language' => $language->code,
                'group' => $group,
            ])->with('success', "Imported $count translations successfully.");
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to import translations: ' . $e->getMessage());
        }
    }

    /**
     * Export translations to JSON file
     */
    public function export(Request $request)
    {
        $request->validate([
            'language_id' => 'required|exists:languages,id',
            'group' => 'nullable|string',
        ]);

        $language = Language::findOrFail($request->input('language_id'));
        $group = $request->input('group');

        $query = Translation::where('language_id', $language->id);

        if ($group) {
            $query->where('group', $group);
            $filename = "{$language->code}_{$group}.json";
        } else {
            $filename = "{$language->code}.json";
        }

        $translations = $query->pluck('value', 'key')->toArray();

        return response()->json($translations)
            ->header('Content-Disposition', "attachment; filename=$filename")
            ->header('Content-Type', 'application/json');
    }
}
