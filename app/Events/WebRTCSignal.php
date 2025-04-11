<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class WebRTCSignal implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The meeting ID.
     */
    public $meetingId;

    /**
     * The sender's peer ID.
     */
    public $senderPeerId;

    /**
     * The receiver's peer ID.
     */
    public $receiverPeerId;

    /**
     * The signal type.
     */
    public $type;

    /**
     * The signal payload.
     */
    public $payload;

    /**
     * Create a new event instance.
     */
    public function __construct(int $meetingId, string $senderPeerId, string $receiverPeerId, string $type, $payload)
    {
        $this->meetingId = $meetingId;
        $this->senderPeerId = $senderPeerId;
        $this->receiverPeerId = $receiverPeerId;
        $this->type = $type;
        $this->payload = $payload;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('peer.' . $this->receiverPeerId),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'signal';
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'meeting_id' => $this->meetingId,
            'sender_peer_id' => $this->senderPeerId,
            'receiver_peer_id' => $this->receiverPeerId,
            'type' => $this->type,
            'payload' => $this->payload,
            'timestamp' => now()->toIso8601String(),
        ];
    }
}
