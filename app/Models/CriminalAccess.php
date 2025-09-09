<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Contracts\Activity;

class CriminalAccess extends Model
{
    use HasFactory, LogsActivity;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'criminal_id',
        'user_id',
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
                'created' => 'دسترسی جدید به مجرم اعطا شد',
                'updated' => 'دسترسی به مجرم بروزرسانی شد',
                'deleted' => 'دسترسی به مجرم حذف شد',
                default => "عملیات {$eventName} روی دسترسی مجرم انجام شد"
            });
    }

    /**
     * Customize the activity before it gets saved.
     */
    public function tapActivity(Activity $activity, string $eventName)
    {
        $activity->description = match($eventName) {
            'created' => 'دسترسی جدید به مجرم اعطا شد',
            'updated' => 'دسترسی به مجرم بروزرسانی شد',
            'deleted' => 'دسترسی به مجرم حذف شد',
            default => "عملیات {$eventName} روی دسترسی مجرم انجام شد"
        };
    }

    /**
     * Get the criminal that the access belongs to.
     */
    public function criminal(): BelongsTo
    {
        return $this->belongsTo(Criminal::class);
    }

    /**
     * Get the user that has access.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
