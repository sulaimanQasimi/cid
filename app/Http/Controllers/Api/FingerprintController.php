<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Criminal;
use App\Models\CriminalFingerprint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class FingerprintController extends Controller
{
    /**
     * Store a newly created fingerprint.
     */
    public function store(Request $request, Criminal $criminal)
    {
        $this->authorize('update', $criminal);

        $validated = $request->validate([
            'finger_position' => [
                'required',
                'string',
                Rule::in([
                    'right_thumb',
                    'right_index',
                    'right_middle',
                    'right_ring',
                    'right_pinky',
                    'left_thumb',
                    'left_index',
                    'left_middle',
                    'left_ring',
                    'left_pinky'
                ])
            ],
            'template' => 'required|string',
            'image_base64' => 'required|string',
            'quality_score' => 'nullable|integer|min:0|max:100',
        ]);

        // Check if fingerprint already exists for this position
        $existing = $criminal->fingerprints()
            ->where('finger_position', $validated['finger_position'])
            ->first();

        if ($existing) {
            // Update existing fingerprint
            $existing->update([
                'template' => $validated['template'],
                'image_base64' => $validated['image_base64'],
                'quality_score' => $validated['quality_score'] ?? null,
                'captured_at' => now(),
                'captured_by' => Auth::id(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Fingerprint updated successfully.',
                'data' => $existing->load('capturedBy'),
            ]);
        }

        // Create new fingerprint
        $fingerprint = $criminal->fingerprints()->create([
            'finger_position' => $validated['finger_position'],
            'template' => $validated['template'],
            'image_base64' => $validated['image_base64'],
            'quality_score' => $validated['quality_score'] ?? null,
            'captured_at' => now(),
            'captured_by' => Auth::id(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Fingerprint saved successfully.',
            'data' => $fingerprint->load('capturedBy'),
        ], 201);
    }

    /**
     * Display all fingerprints for a criminal.
     */
    public function index(Criminal $criminal)
    {
        $this->authorize('view', $criminal);

        $fingerprints = $criminal->fingerprints()
            ->with('capturedBy')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $fingerprints,
        ]);
    }

    /**
     * Display a specific fingerprint.
     */
    public function show(Criminal $criminal, string $fingerPosition)
    {
        $this->authorize('view', $criminal);

        $fingerprint = $criminal->fingerprints()
            ->where('finger_position', $fingerPosition)
            ->with('capturedBy')
            ->first();

        if (!$fingerprint) {
            return response()->json([
                'success' => false,
                'message' => 'Fingerprint not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $fingerprint,
        ]);
    }

    /**
     * Remove the specified fingerprint.
     */
    public function destroy(Criminal $criminal, string $fingerPosition)
    {
        $this->authorize('update', $criminal);

        $fingerprint = $criminal->fingerprints()
            ->where('finger_position', $fingerPosition)
            ->first();

        if (!$fingerprint) {
            return response()->json([
                'success' => false,
                'message' => 'Fingerprint not found.',
            ], 404);
        }

        $fingerprint->delete();

        return response()->json([
            'success' => true,
            'message' => 'Fingerprint deleted successfully.',
        ]);
    }

    /**
     * Get stored template for verification (client-side verification).
     */
    public function getTemplateForVerify(Criminal $criminal, string $fingerPosition)
    {
        $this->authorize('view', $criminal);

        // Get the stored fingerprint for this position
        $storedFingerprint = $criminal->fingerprints()
            ->where('finger_position', $fingerPosition)
            ->first();

        if (!$storedFingerprint) {
            return response()->json([
                'success' => false,
                'message' => 'Fingerprint not found for this position.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'template' => $storedFingerprint->template,
                'finger_position' => $fingerPosition,
            ],
        ]);
    }
}
