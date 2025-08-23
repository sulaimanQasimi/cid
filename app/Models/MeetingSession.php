<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Contracts\Activity;

class MeetingSession extends Model
{
    use HasFactory, LogsActivity;

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
     * Get the activity log options for the model.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->setDescriptionForEvent(fn(string $eventName) => match($eventName) {
                'created' => 'جلسه جدید شروع شد',
                'updated' => 'اطلاعات جلسه بروزرسانی شد',
                'deleted' => 'جلسه حذف شد',
                default => "عملیات {$eventName} روی جلسه انجام شد"
            });
    }

    /**
     * Customize the activity before it gets saved.
     */
    public function tapActivity(Activity $activity, string $eventName)
    {
        $activity->description = match($eventName) {
            'created' => 'جلسه جدید شروع شد',
            'updated' => 'اطلاعات جلسه بروزرسانی شد',
            'deleted' => 'جلسه حذف شد',
            default => "عملیات {$eventName} روی جلسه انجام شد"
        };
    }

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
