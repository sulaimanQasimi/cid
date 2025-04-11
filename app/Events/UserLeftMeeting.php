<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserLeftMeeting implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The meeting ID.
     */
    public $meetingId;

    /**
     * The peer ID of the user who left.
     */
    public $peerId;

    /**
     * Create a new event instance.
     */
    public function __construct(int $meetingId, string $peerId)
    {
        $this->meetingId = $meetingId;
        $this->peerId = $peerId;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('meeting.' . $this->meetingId),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'user.left';
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'meeting_id' => $this->meetingId,
            'peer_id' => $this->peerId,
            'left_at' => now()->toIso8601String(),
        ];
    }
}
