<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Contracts\Activity;

class Meeting extends Model
{
    use HasFactory, LogsActivity;

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
     * Get the activity log options for the model.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->setDescriptionForEvent(fn(string $eventName) => match($eventName) {
                'created' => 'جلسه جدید ایجاد شد',
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
            'created' => 'جلسه جدید ایجاد شد',
            'updated' => 'اطلاعات جلسه بروزرسانی شد',
            'deleted' => 'جلسه حذف شد',
            default => "عملیات {$eventName} روی جلسه انجام شد"
        };
    }

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
