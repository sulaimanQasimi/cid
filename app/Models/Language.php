<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Contracts\Activity;

class Language extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'code',
        'name',
        'direction',
        'active',
        'default',
    ];

    protected $casts = [
        'active' => 'boolean',
        'default' => 'boolean',
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
                'created' => 'زبان جدید اضافه شد',
                'updated' => 'اطلاعات زبان بروزرسانی شد',
                'deleted' => 'زبان حذف شد',
                default => "عملیات {$eventName} روی زبان انجام شد"
            });
    }

    /**
     * Customize the activity before it gets saved.
     */
    public function tapActivity(Activity $activity, string $eventName)
    {
        $activity->description = match($eventName) {
            'created' => 'زبان جدید اضافه شد',
            'updated' => 'اطلاعات زبان بروزرسانی شد',
            'deleted' => 'زبان حذف شد',
            default => "عملیات {$eventName} روی زبان انجام شد"
        };
    }

    /**
     * Get all translations for this language
     */
    public function translations(): HasMany
    {
        return $this->hasMany(Translation::class);
    }

    /**
     * Get the default language
     *
     * @return Language|null
     */
    public static function getDefault()
    {
        return self::where('default', true)
            ->where('active', true)
            ->first();
    }

    /**
     * Get all active languages
     *
     * @return Collection
     */
    public static function getActive()
    {
        return self::where('active', true)
            ->orderBy('default', 'desc')
            ->orderBy('name')
            ->get();
    }
}
