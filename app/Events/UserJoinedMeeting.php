<?php

namespace App\Events;

use App\Models\Meeting;
use App\Models\User;
use App\Models\MeetingSession;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserJoinedMeeting implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The meeting instance.
     */
    public $meeting;

    /**
     * The user who joined.
     */
    public $user;

    /**
     * The session data.
     */
    public $session;

    /**
     * Create a new event instance.
     */
    public function __construct(Meeting $meeting, User $user, MeetingSession $session)
    {
        $this->meeting = $meeting;
        $this->user = $user;
        $this->session = $session;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('meeting.' . $this->meeting->id),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'user.joined';
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'meeting_id' => $this->meeting->id,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
            ],
            'peer_id' => $this->session->peer_id,
            'joined_at' => now()->toIso8601String(),
        ];
    }
}
