<?php

namespace App\Events;

use App\Models\Meeting;
use App\Models\User;
use App\Models\MeetingMessage;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewMeetingMessage implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The meeting instance.
     */
    public $meeting;

    /**
     * The user who sent the message.
     */
    public $user;

    /**
     * The message instance.
     */
    public $message;

    /**
     * Create a new event instance.
     */
    public function __construct(Meeting $meeting, User $user, MeetingMessage $message)
    {
        $this->meeting = $meeting;
        $this->user = $user;
        $this->message = $message;
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
        return 'message.new';
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
            'message' => [
                'id' => $this->message->id,
                'content' => $this->message->message,
                'created_at' => $this->message->created_at->toIso8601String(),
            ],
        ];
    }
}
