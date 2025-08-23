<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Contracts\Activity;

class MeetingMessage extends Model
{
    use HasFactory, LogsActivity;

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
     * Get the activity log options for the model.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->setDescriptionForEvent(fn(string $eventName) => match($eventName) {
                'created' => 'پیام جدید ارسال شد',
                'updated' => 'پیام بروزرسانی شد',
                'deleted' => 'پیام حذف شد',
                default => "عملیات {$eventName} روی پیام انجام شد"
            });
    }

    /**
     * Customize the activity before it gets saved.
     */
    public function tapActivity(Activity $activity, string $eventName)
    {
        $activity->description = match($eventName) {
            'created' => 'پیام جدید ارسال شد',
            'updated' => 'پیام بروزرسانی شد',
            'deleted' => 'پیام حذف شد',
            default => "عملیات {$eventName} روی پیام انجام شد"
        };
    }

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
