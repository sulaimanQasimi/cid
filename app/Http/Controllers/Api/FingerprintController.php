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
     * Verify a fingerprint against a specific stored fingerprint.
     */
    public function verify(Request $request, Criminal $criminal, string $fingerPosition)
    {
        $this->authorize('view', $criminal);

        $validated = $request->validate([
            'template' => 'required|string',
            'security_level' => 'nullable|string|in:LOWEST,LOWER,LOW,BELOW_NORMAL,NORMAL,ABOVE_NORMAL,HIGH,HIGHER,HIGHEST',
        ]);

        $securityLevel = $validated['security_level'] ?? 'NORMAL';
        $verifyTemplate = $validated['template'];

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

        // Get client IP address
        $clientIp = $request->ip();
        
        // Handle proxy headers if present
        if ($request->header('X-Forwarded-For')) {
            $ips = explode(',', $request->header('X-Forwarded-For'));
            $clientIp = trim($ips[0]);
        } elseif ($request->header('X-Real-IP')) {
            $clientIp = $request->header('X-Real-IP');
        } elseif ($request->header('CF-Connecting-IP')) {
            $clientIp = $request->header('CF-Connecting-IP');
        }

        // Construct API URL using client IP
        $apiUrl = "http://{$clientIp}:8080/api/fingerprint/compare";

        // Call the fingerprint API to compare templates
        try {
            $response = Http::timeout(10)->post($apiUrl, [
                'template1' => $storedFingerprint->template,
                'template2' => $verifyTemplate,
                'securityLevel' => $securityLevel,
            ]);

            if (!$response->successful()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Fingerprint API error: ' . $response->body(),
                ], 500);
            }

            $result = $response->json();

            // Normalize response - handle both capitalized and lowercase keys
            $success = $result['Success'] ?? $result['success'] ?? false;
            
            // Extract match and score from nested data structure
            $data = $result['Data'] ?? $result['data'] ?? $result;
            $match = $data['Match'] ?? $data['match'] ?? $result['Match'] ?? false;
            $score = $data['Score'] ?? $data['score'] ?? $result['Score'] ?? null;
            $message = $result['Message'] ?? $result['message'] ?? 'Verification completed.';

            return response()->json([
                'success' => $success,
                'message' => $message,
                'data' => [
                    'match' => (bool) $match,
                    'score' => $score !== null ? (int) $score : null,
                    'finger_position' => $fingerPosition,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Verification failed: ' . $e->getMessage(),
            ], 500);
        }
    }
}
