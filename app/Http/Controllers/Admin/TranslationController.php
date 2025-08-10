<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Language;
use App\Models\Translation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class TranslationController extends Controller
{
    /**
     * Read translations from resources/js/lib/i18n/translations/{code}.json
     */
    protected function readJsonTranslations(string $languageCode): ?array
    {
        $path = resource_path('js/lib/i18n/translations/' . $languageCode . '.json');
        if (!file_exists($path)) {
            return null;
        }
        $json = json_decode(file_get_contents($path), true);
        return is_array($json) ? $json : null;
    }

    protected function extractGroupFromKey(string $key): string
    {
        $pos = strpos($key, '.');
        return $pos !== false ? substr($key, 0, $pos) : 'general';
    }
    /**
     * Display a listing of the translations.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Translation::class);
        
        $languages = Language::orderBy('default', 'desc')
            ->orderBy('name')
            ->get();

        $selectedLanguage = $request->query('language');
        $selectedGroup = $request->query('group');

        if (!$selectedLanguage && count($languages) > 0) {
            $selectedLanguage = $languages->firstWhere('default', true)?->code ?? $languages->first()->code;
        }

        $language = Language::where('code', $selectedLanguage)->first();

        // Prefer JSON file source for faster reads; fall back to DB
        $jsonMap = $selectedLanguage ? $this->readJsonTranslations($selectedLanguage) : null;

        if ($jsonMap !== null) {
            // Build items from JSON
            $items = [];
            foreach ($jsonMap as $key => $value) {
                $group = $this->extractGroupFromKey($key);
                if ($selectedGroup && $group !== $selectedGroup) {
                    continue;
                }
                $items[] = [
                    'id' => null,
                    'language_id' => $language?->id,
                    'key' => $key,
                    'value' => is_string($value) ? $value : json_encode($value, JSON_UNESCAPED_UNICODE),
                    'group' => $group,
                ];
            }

            // Sort by group then key
            usort($items, function ($a, $b) {
                return [$a['group'], $a['key']] <=> [$b['group'], $b['key']];
            });

            // Manual pagination
            $perPage = (int)($request->query('per_page', 50));
            $page = max(1, (int)$request->query('page', 1));
            $total = count($items);
            $lastPage = (int)max(1, ceil($total / $perPage));
            $offset = ($page - 1) * $perPage;
            $data = array_slice($items, $offset, $perPage);

            $translations = [
                'data' => $data,
                'current_page' => $page,
                'last_page' => $lastPage,
                'per_page' => $perPage,
                'total' => $total,
            ];

            // Build groups list from JSON keys
            $groups = collect(array_values(array_unique(array_map(function ($key) {
                $pos = strpos($key, '.');
                return $pos !== false ? substr($key, 0, $pos) : 'general';
            }, array_keys($jsonMap)))))->values();

        } else {
            // Fallback to DB-backed listing
            $query = Translation::query()
                ->when($language, function ($query) use ($language) {
                    $query->where('language_id', $language->id);
                })
                ->when($selectedGroup, function ($query) use ($selectedGroup) {
                    $query->where('group', $selectedGroup);
                });

            $paginator = $query->orderBy('group')
                ->orderBy('key')
                ->paginate(50)
                ->withQueryString();

            $translations = $paginator;

            $groups = Translation::select('group')
                ->when($language, function ($query) use ($language) {
                    $query->where('language_id', $language->id);
                })
                ->groupBy('group')
                ->pluck('group');
        }

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
        $this->authorize('create', Translation::class);
        
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
     * Export translations to JSON files for frontend use
     *
     * @param string|null $languageCode
     * @return bool
     */
    protected function exportToJsonFiles(?string $languageCode = null): bool
    {
        try {
            // Get languages to export
            $query = Language::where('active', true);
            if ($languageCode) {
                $query->where('code', $languageCode);
            }
            $languages = $query->get();

            foreach ($languages as $language) {
                // Get all translations for this language
                $translations = Translation::getTranslations($language->code);

                // Ensure the directory exists
                $dir = resource_path('js/lib/i18n/translations');
                if (!file_exists($dir)) {
                    mkdir($dir, 0755, true);
                }

                // Write the JSON file
                $filePath = $dir . '/' . $language->code . '.json';
                file_put_contents(
                    $filePath,
                    json_encode($translations, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
                );
            }

            return true;
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Failed to export translations: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Store a newly created translation in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Translation::class);
        
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

        $translation = Translation::create([
            'language_id' => $request->input('language_id'),
            'key' => $request->input('key'),
            'value' => $request->input('value'),
            'group' => $request->input('group', 'general'),
        ]);

        // Get the language code
        $language = Language::find($request->input('language_id'));

        // Export translations to JSON files
        $this->exportToJsonFiles($language->code);

        return redirect()->route('translations.index', [
            'language' => $language->code,
            'group' => $request->input('group', 'general'),
        ])->with('success', 'Translation created successfully.');
    }

    /**
     * Show the form for editing the specified translation.
     */
    public function edit(Translation $translation)
    {
        $this->authorize('update', $translation);
        
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
        $this->authorize('update', $translation);
        
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

        $oldLanguageId = $translation->language_id;
        $oldLanguage = Language::find($oldLanguageId);

        $translation->update([
            'language_id' => $request->input('language_id'),
            'key' => $request->input('key'),
            'value' => $request->input('value'),
            'group' => $request->input('group', 'general'),
        ]);

        // Get the language code
        $newLanguage = Language::find($request->input('language_id'));

        // Export translations to JSON files - both languages if they differ
        if ($oldLanguage->code !== $newLanguage->code) {
            $this->exportToJsonFiles($oldLanguage->code);
        }
        $this->exportToJsonFiles($newLanguage->code);

        return redirect()->route('translations.index', [
            'language' => $newLanguage->code,
            'group' => $request->input('group', 'general'),
        ])->with('success', 'Translation updated successfully.');
    }

    /**
     * Remove the specified translation from storage.
     */
    public function destroy(Translation $translation)
    {
        $this->authorize('delete', $translation);
        
        $language = $translation->language;
        $group = $translation->group;

        $translation->delete();

        // Export translations to JSON files
        $this->exportToJsonFiles($language->code);

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

    /**
     * Manually export translations to JSON files for frontend use
     */
    public function exportToJson(Request $request)
    {
        $languages = Language::where('active', true)->get();
        $count = 0;

        foreach ($languages as $language) {
            // Get all translations for this language
            $translations = Translation::getTranslations($language->code);

            // Ensure the directory exists
            $dir = resource_path('js/lib/i18n/translations');
            if (!file_exists($dir)) {
                mkdir($dir, 0755, true);
            }

            // Write the JSON file
            $filePath = $dir . '/' . $language->code . '.json';
            file_put_contents(
                $filePath,
                json_encode($translations, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
            );
            $count++;
        }

        return redirect()->back()->with('success', "Exported translations for {$count} languages to JSON files.");
    }

    /**
     * Display a listing of all translations for a specific language.
     *
     * @param string $languageCode
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(string $languageCode)
    {
        // Get the language
        $language = Language::where('code', $languageCode)->first();

        if (!$language) {
            return response()->json([
                'error' => 'Language not found',
                'translations' => [],
            ], 404);
        }

        // Get all translations for this language
        $translations = Translation::getTranslations($languageCode);

        return response()->json([
            'language' => $language,
            'translations' => $translations,
        ]);
    }
}
