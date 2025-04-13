<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Language;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class LanguageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $languages = Language::orderBy('default', 'desc')
            ->orderBy('name')
            ->get();

        return response()->json([
            'languages' => $languages,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|max:10|unique:languages,code',
            'name' => 'required|string|max:50',
            'direction' => 'required|in:ltr,rtl',
            'active' => 'boolean',
            'default' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // If this is set as default, remove default from others
        if ($request->input('default', false)) {
            Language::where('default', true)->update(['default' => false]);
        }

        $language = Language::create($request->all());

        return response()->json([
            'message' => 'Language created successfully',
            'language' => $language,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $language = Language::findOrFail($id);

        return response()->json([
            'language' => $language,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $language = Language::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'code' => 'string|max:10|unique:languages,code,' . $language->id,
            'name' => 'string|max:50',
            'direction' => 'in:ltr,rtl',
            'active' => 'boolean',
            'default' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // If this is set as default, remove default from others
        if ($request->has('default') && $request->input('default')) {
            Language::where('default', true)->update(['default' => false]);
        }

        $language->update($request->all());

        return response()->json([
            'message' => 'Language updated successfully',
            'language' => $language,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $language = Language::findOrFail($id);

        // Prevent deleting the default language
        if ($language->default) {
            return response()->json([
                'message' => 'Cannot delete the default language',
            ], 422);
        }

        $language->delete();

        return response()->json([
            'message' => 'Language deleted successfully',
        ]);
    }
}
