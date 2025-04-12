<?php

use App\Models\Meeting;
use App\Models\MeetingSession;
use App\Models\User;
use App\Models\Report;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

// Private channel for user notifications
Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Private channel for meetings
Broadcast::channel('meeting.{meetingId}', function (User $user, int $meetingId) {
    $meeting = Meeting::findOrFail($meetingId);

    // Allow the meeting creator or any participant to listen
    return $meeting->created_by === $user->id ||
           $meeting->participants()->where('user_id', $user->id)->exists();
});

// Private channel for peer-to-peer communication
Broadcast::channel('peer.{peerId}', function (User $user, string $peerId) {
    // Check if this peer ID belongs to a session created by this user
    $session = MeetingSession::where('peer_id', $peerId)
        ->where('user_id', $user->id)
        ->first();

    return $session !== null;
});

// General reports channel
Broadcast::channel('reports', function (User $user) {
    // Allow authenticated users to listen to all reports
    return true;
});

// Specific report channel
Broadcast::channel('reports.{type}.{id}', function (User $user, $type, $id) {
    // Allow authenticated users to listen to specific report types
    // In a real app, you would add more specific permission checks here
    return true;
});
