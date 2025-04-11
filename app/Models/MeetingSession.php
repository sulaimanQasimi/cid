<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MeetingSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'meeting_id',
        'user_id',
        'peer_id',
        'ice_candidates',
        'session_data',
        'peer_connections',
        'offline_data',
        'session_started_at',
        'session_ended_at',
    ];

    protected $casts = [
        'ice_candidates' => 'array',
        'session_data' => 'array',
        'peer_connections' => 'array',
        'offline_data' => 'array',
        'session_started_at' => 'datetime',
        'session_ended_at' => 'datetime',
    ];

    /**
     * Get the meeting this session belongs to
     */
    public function meeting(): BelongsTo
    {
        return $this->belongsTo(Meeting::class);
    }

    /**
     * Get the user who this session belongs to
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
