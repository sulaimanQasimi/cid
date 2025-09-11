<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Contracts\Activity;

class Department extends Model
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
                'created' => 'اداره جدید ایجاد شد',
                'updated' => 'اطلاعات اداره بروزرسانی شد',
                'deleted' => 'اداره حذف شد',
                default => "عملیات {$eventName} روی اداره انجام شد"
            });
    }

    /**
     * Customize the activity before it gets saved.
     */
    public function tapActivity(Activity $activity, string $eventName)
    {
        $activity->description = match($eventName) {
            'created' => 'اداره جدید ایجاد شد',
            'updated' => 'اطلاعات اداره بروزرسانی شد',
            'deleted' => 'اداره حذف شد',
            default => "عملیات {$eventName} روی اداره انجام شد"
        };
    }

    /**
     * Get the infos for the department.
     */
    public function infos(): HasMany
    {
        return $this->hasMany(Info::class);
    }

    /**
     * Get the criminals for the department.
     */
    public function criminals(): HasMany
    {
        return $this->hasMany(Criminal::class);
    }

    /**
     * Get the users for the department.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
