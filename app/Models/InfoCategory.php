<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Contracts\Activity;

class InfoCategory extends Model
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
                'created' => 'دسته‌بندی اطلاعات جدید ایجاد شد',
                'updated' => 'اطلاعات دسته‌بندی اطلاعات بروزرسانی شد',
                'deleted' => 'دسته‌بندی اطلاعات حذف شد',
                default => "عملیات {$eventName} روی دسته‌بندی اطلاعات انجام شد"
            });
    }

    /**
     * Customize the activity before it gets saved.
     */
    public function tapActivity(Activity $activity, string $eventName)
    {
        $activity->description = match($eventName) {
            'created' => 'دسته‌بندی اطلاعات جدید ایجاد شد',
            'updated' => 'اطلاعات دسته‌بندی اطلاعات بروزرسانی شد',
            'deleted' => 'دسته‌بندی اطلاعات حذف شد',
            default => "عملیات {$eventName} روی دسته‌بندی اطلاعات انجام شد"
        };
    }

    /**
     * Get the info records associated with the info category.
     */
    public function infos(): HasMany
    {
        return $this->hasMany(Info::class);
    }
}
