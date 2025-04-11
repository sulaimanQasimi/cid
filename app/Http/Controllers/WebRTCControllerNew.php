<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\MeetingSession;
use App\Models\MeetingMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Event;

class WebRTCControllerNew extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Initialize a WebRTC session for a meeting.
     */
    public function initSession(Request $request, $meetingId)
    {
        $meeting = Meeting::findOrFail($meetingId);

        // Check if user is authorized to join this meeting
        if (!$meeting->participants()->where('user_id', Auth::id())->exists()) {
            return response()->json(['error' => 'Unauthorized to join this meeting'], 403);
        }

        $validated = $request->validate([
            'peer_id' => 'required|string',
        ]);

        // Create or update session record
        $session = MeetingSession::updateOrCreate(
            [
                'meeting_id' => $meetingId,
                'user_id' => Auth::id(),
            ],
            [
                'peer_id' => $validated['peer_id'],
                'session_started_at' => now(),
                'session_data' => json_encode([
                    'user_agent' => $request->header('User-Agent'),
                    'ip' => $request->ip(),
                    'is_offline' => $meeting->offline_enabled,
                ]),
                'ice_candidates' => json_encode([]),
                'peer_connections' => json_encode([]),
            ]
        );

        // Broadcast to other participants that a new user has joined
        if (function_exists('broadcast')) {
            broadcast(new \App\Events\UserJoinedMeeting($meeting, Auth::user(), $session));
        }

        // Get all active peers in this meeting
        $activePeers = MeetingSession::where('meeting_id', $meetingId)
            ->where('user_id', '!=', Auth::id())
            ->whereNotNull('session_started_at')
            ->whereNull('session_ended_at')
            ->with('user:id,name,email')
            ->get(['id', 'user_id', 'peer_id']);

        return response()->json([
            'session_id' => $session->id,
            'peer_id' => $session->peer_id,
            'active_peers' => $activePeers,
            'is_offline_enabled' => $meeting->offline_enabled,
        ]);
    }

    /**
     * Save ICE candidates for a session.
     */
    public function saveIceCandidates(Request $request, $sessionId)
    {
        $session = MeetingSession::where('id', $sessionId)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $validated = $request->validate([
            'candidates' => 'required|array',
        ]);

        $session->update([
            'ice_candidates' => json_encode($validated['candidates']),
        ]);

        return response()->json(['success' => true]);
    }

    /**
     * Exchange signaling data between peers.
     */
    public function signal(Request $request)
    {
        $validated = $request->validate([
            'sender_peer_id' => 'required|string',
            'receiver_peer_id' => 'required|string',
            'meeting_id' => 'required|exists:meetings,id',
            'type' => 'required|string|in:offer,answer,candidate',
            'payload' => 'required',
            'is_offline' => 'boolean',
        ]);

        $senderSession = MeetingSession::where('peer_id', $validated['sender_peer_id'])
            ->where('meeting_id', $validated['meeting_id'])
            ->firstOrFail();

        $receiverSession = MeetingSession::where('peer_id', $validated['receiver_peer_id'])
            ->where('meeting_id', $validated['meeting_id'])
            ->first();

        // If we're in offline mode and the receiver is not available,
        // store the signal for later processing
        if (!$receiverSession && ($request->input('is_offline', false) === true)) {
            // Store the signal in the sender's session for offline use
            $offlineData = json_decode($senderSession->offline_data ?? '{}', true);
            $offlineData['pending_signals'] = $offlineData['pending_signals'] ?? [];
            $offlineData['pending_signals'][] = $validated;

            $senderSession->update([
                'offline_data' => json_encode($offlineData),
            ]);

            return response()->json(['success' => true, 'stored_offline' => true]);
        }

        if (!$receiverSession) {
            return response()->json(['error' => 'Receiver peer not found'], 404);
        }

        // Update peer connections in the sender's session
        $peerConnections = json_decode($senderSession->peer_connections ?? '[]', true);
        $peerConnections[$validated['receiver_peer_id']] = [
            'status' => $validated['type'] === 'answer' ? 'connected' : 'connecting',
            'last_activity' => now()->toIso8601String(),
        ];
        $senderSession->update(['peer_connections' => json_encode($peerConnections)]);

        // Broadcast the signal to the receiver
        if (function_exists('broadcast')) {
            broadcast(new \App\Events\WebRTCSignal(
                $validated['meeting_id'],
                $validated['sender_peer_id'],
                $validated['receiver_peer_id'],
                $validated['type'],
                $validated['payload']
            ));
        } else {
            // If broadcasting is not available (e.g., in offline mode)
            // Store the signal in the receiver's offline_data
            $offlineData = json_decode($receiverSession->offline_data ?? '{}', true);
            $offlineData['pending_signals'] = $offlineData['pending_signals'] ?? [];
            $offlineData['pending_signals'][] = $validated;

            $receiverSession->update([
                'offline_data' => json_encode($offlineData),
            ]);
        }

        return response()->json(['success' => true]);
    }

    /**
     * End a WebRTC session.
     */
    public function endSession(Request $request, $sessionId)
    {
        $session = MeetingSession::where('id', $sessionId)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $session->update([
            'session_ended_at' => now(),
        ]);

        // Broadcast that the user has left
        if (function_exists('broadcast')) {
            broadcast(new \App\Events\UserLeftMeeting($session->meeting_id, $session->peer_id));
        }

        return response()->json(['success' => true]);
    }

    /**
     * Send a chat message in a meeting.
     */
    public function sendMessage(Request $request, $meetingId)
    {
        $meeting = Meeting::findOrFail($meetingId);

        // Check if user is authorized to send messages in this meeting
        if (!$meeting->participants()->where('user_id', Auth::id())->exists()) {
            return response()->json(['error' => 'Unauthorized to send messages in this meeting'], 403);
        }

        $validated = $request->validate([
            'message' => 'required|string',
            'is_offline' => 'boolean',
        ]);

        $message = MeetingMessage::create([
            'meeting_id' => $meetingId,
            'user_id' => Auth::id(),
            'message' => $validated['message'],
            'is_offline' => $validated['is_offline'] ?? false,
        ]);

        // Broadcast the message to other participants
        if (function_exists('broadcast') && !($validated['is_offline'] ?? false)) {
            broadcast(new \App\Events\NewMeetingMessage($meeting, Auth::user(), $message));
        }

        return response()->json([
            'success' => true,
            'message' => $message->load('user:id,name,email'),
        ]);
    }

    /**
     * Get chat messages for a meeting.
     */
    public function getMessages($meetingId)
    {
        $meeting = Meeting::findOrFail($meetingId);

        // Check if user is authorized to view messages in this meeting
        if (!$meeting->participants()->where('user_id', Auth::id())->exists()) {
            return response()->json(['error' => 'Unauthorized to view messages in this meeting'], 403);
        }

        $messages = MeetingMessage::where('meeting_id', $meetingId)
            ->with('user:id,name,email')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json(['messages' => $messages]);
    }

    /**
     * Sync offline data when a user comes back online.
     */
    public function syncOfflineData(Request $request, $sessionId)
    {
        $session = MeetingSession::where('id', $sessionId)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $validated = $request->validate([
            'offline_data' => 'required|array',
            'messages' => 'array',
        ]);

        // Update session with offline data
        $session->update([
            'offline_data' => json_encode($validated['offline_data']),
        ]);

        // Process any offline messages
        if (isset($validated['messages']) && is_array($validated['messages'])) {
            foreach ($validated['messages'] as $message) {
                if (isset($message['content'])) {
                    MeetingMessage::create([
                        'meeting_id' => $session->meeting_id,
                        'user_id' => Auth::id(),
                        'message' => $message['content'],
                        'is_offline' => true,
                        'created_at' => $message['timestamp'] ?? now(),
                    ]);
                }
            }
        }

        // Get any pending signals for this session's peer
        $pendingSignals = MeetingSession::where('meeting_id', $session->meeting_id)
            ->where('user_id', '!=', Auth::id())
            ->get()
            ->flatMap(function ($otherSession) use ($session) {
                $offlineData = json_decode($otherSession->offline_data ?? '{}', true);
                $pendingSignals = $offlineData['pending_signals'] ?? [];

                return collect($pendingSignals)->filter(function ($signal) use ($session) {
                    return $signal['receiver_peer_id'] === $session->peer_id;
                })->values();
            });

        return response()->json([
            'success' => true,
            'pending_signals' => $pendingSignals,
        ]);
    }
}
