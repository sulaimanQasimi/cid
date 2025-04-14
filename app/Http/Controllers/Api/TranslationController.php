<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Language;
use App\Models\Translation;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class TranslationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'language_code' => 'required|string|exists:languages,code',
            'group' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $language = Language::where('code', $request->input('language_code'))->firstOrFail();

        if ($request->has('group')) {
            $translations = Translation::where('language_id', $language->id)
                ->where('group', $request->input('group'))
                ->orderBy('key')
                ->get();
        } else {
            $translations = Translation::where('language_id', $language->id)
                ->orderBy('group')
                ->orderBy('key')
                ->get();
        }

        return response()->json([
            'translations' => $translations,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'language_code' => 'required|string|exists:languages,code',
            'key' => 'required|string',
            'value' => 'nullable|string',
            'group' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $language = Language::where('code', $request->input('language_code'))->firstOrFail();

        $translation = Translation::updateOrCreate(
            [
                'language_id' => $language->id,
                'key' => $request->input('key'),
                'group' => $request->input('group', 'general'),
            ],
            [
                'value' => $request->input('value'),
            ]
        );

        return response()->json([
            'message' => 'Translation created/updated successfully',
            'translation' => $translation,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $translation = Translation::findOrFail($id);

        return response()->json([
            'translation' => $translation,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $translation = Translation::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'key' => 'string',
            'value' => 'nullable|string',
            'group' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $translation->update($request->only(['key', 'value', 'group']));

        return response()->json([
            'message' => 'Translation updated successfully',
            'translation' => $translation,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $translation = Translation::findOrFail($id);
        $translation->delete();

        return response()->json([
            'message' => 'Translation deleted successfully',
        ]);
    }

    /**
     * Get all translations for a language
     *
     * @param string $languageCode The language code (can be 'code' or 'languageCode' from route)
     * @return JsonResponse
     */
    public function getLanguageTranslations(string $languageCode): JsonResponse
    {
        // Ensure the language exists and is active
        $language = Language::where('code', $languageCode)
            ->where('active', true)
            ->first();

        if (!$language) {
            // If language not found, try to get default language
            $language = Language::getDefault();

            if (!$language) {
                return response()->json([
                    'message' => 'No active language found',
                    'translations' => [],
                ], 404);
            }
        }

        $translations = Translation::getTranslations($language->code);

        return response()->json([
            'language' => $language,
            'translations' => $translations,
        ]);
    }

    /**
     * Import translations from a JSON file
     */
    public function import(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'language_code' => 'required|string|exists:languages,code',
            'translations' => 'required|array',
            'group' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $language = Language::where('code', $request->input('language_code'))->firstOrFail();
        $group = $request->input('group', 'general');
        $translations = $request->input('translations');

        $count = 0;
        foreach ($translations as $key => $value) {
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

        return response()->json([
            'message' => "Imported $count translations successfully",
        ]);
    }

    /**
     * Export translations to JSON
     */
    public function export(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'language_code' => 'required|string|exists:languages,code',
            'group' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $language = Language::where('code', $request->input('language_code'))->firstOrFail();

        if ($request->has('group')) {
            $translations = Translation::getTranslations($language->code, $request->input('group'));
            $data = [
                'language' => $language,
                'group' => $request->input('group'),
                'translations' => $translations,
            ];
        } else {
            $translations = Translation::getAllGrouped($language->code);
            $data = [
                'language' => $language,
                'translations' => $translations,
            ];
        }

        return response()->json($data);
    }
}
