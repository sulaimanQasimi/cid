<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Meeting extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'meeting_code',
        'scheduled_at',
        'duration_minutes',
        'is_recurring',
        'status',
        'created_by',
        'offline_enabled',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'is_recurring' => 'boolean',
        'offline_enabled' => 'boolean',
    ];

    /**
     * Get the user who created the meeting
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the participants for the meeting
     */
    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'meeting_participants')
            ->withPivot('role', 'joined_at', 'left_at', 'status')
            ->withTimestamps();
    }
}
