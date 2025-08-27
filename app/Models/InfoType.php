<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Contracts\Activity;

class InfoType extends Model
{
    use HasFactory, LogsActivity;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'code',
        'description',
        'created_by',
        'updated_by',
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
                'created' => 'نوع اطلاعات جدید ایجاد شد',
                'updated' => 'اطلاعات نوع اطلاعات بروزرسانی شد',
                'deleted' => 'نوع اطلاعات حذف شد',
                default => "عملیات {$eventName} روی نوع اطلاعات انجام شد"
            });
    }

    /**
     * Customize the activity before it gets saved.
     */
    public function tapActivity(Activity $activity, string $eventName)
    {
        $activity->description = match($eventName) {
            'created' => 'نوع اطلاعات جدید ایجاد شد',
            'updated' => 'اطلاعات نوع اطلاعات بروزرسانی شد',
            'deleted' => 'نوع اطلاعات حذف شد',
            default => "عملیات {$eventName} روی نوع اطلاعات انجام شد"
        };
    }

    /**
     * Get the info records associated with the info type.
     */
    public function infos(): HasMany
    {
        return $this->hasMany(Info::class);
    }

    /**
     * Get the stats associated with the info type.
     */
    public function infoStats(): HasMany
    {
        return $this->hasMany(InfoStat::class);
    }

    /**
     * Get the user that created this info type.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user that last updated this info type.
     */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
