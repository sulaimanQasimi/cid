<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MeetingMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'meeting_id',
        'user_id',
        'message',
        'is_offline',
    ];

    protected $casts = [
        'is_offline' => 'boolean',
    ];

    /**
     * Get the meeting this message belongs to
     */
    public function meeting(): BelongsTo
    {
        return $this->belongsTo(Meeting::class);
    }

    /**
     * Get the user who sent this message
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
