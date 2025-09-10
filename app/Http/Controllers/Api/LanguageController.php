<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Language;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class LanguageController extends Controller
{
    public function updateTranslation(Request $request, string $key): JsonResponse
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'value' => 'required|string',
            'language' => 'required|string|in:fa,en', // Add more languages as needed
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $language = $request->input('language', 'fa');
        $value = $request->input('value');
        
        // Construct the JSON file path based on language
        $jsonPath = resource_path("js/lib/i18n/translations/{$language}.json");
        
        // Ensure the directory exists
        $directory = dirname($jsonPath);
        if (!is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        // Load existing translations
        $translations = [];
        if (file_exists($jsonPath)) {
            $jsonContent = file_get_contents($jsonPath);
            $translations = json_decode($jsonContent, true);
            if (!is_array($translations)) {
                $translations = [];
            }
        }

        // Update the specific key
        $translations[$key] = $value;

        // Save back to file
        $jsonData = json_encode($translations, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        
        if (file_put_contents($jsonPath, $jsonData) === false) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to save translation file'
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Translation updated successfully',
            'key' => $key,
            'value' => $value,
            'language' => $language
        ]);
    }

}
