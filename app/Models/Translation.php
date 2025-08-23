<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Contracts\Activity;

class Translation extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'language_id',
        'key',
        'value',
        'group',
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
                'created' => 'ترجمه جدید اضافه شد',
                'updated' => 'ترجمه بروزرسانی شد',
                'deleted' => 'ترجمه حذف شد',
                default => "عملیات {$eventName} روی ترجمه انجام شد"
            });
    }

    /**
     * Customize the activity before it gets saved.
     */
    public function tapActivity(Activity $activity, string $eventName)
    {
        $activity->description = match($eventName) {
            'created' => 'ترجمه جدید اضافه شد',
            'updated' => 'ترجمه بروزرسانی شد',
            'deleted' => 'ترجمه حذف شد',
            default => "عملیات {$eventName} روی ترجمه انجام شد"
        };
    }

    /**
     * Get the language that owns the translation
     */
    public function language(): BelongsTo
    {
        return $this->belongsTo(Language::class);
    }

    /**
     * Get all translations for a specific language
     *
     * @param string $code
     * @param string|null $group
     * @return array
     */
    public static function getTranslations(string $code, string $group = null): array
    {
        $query = self::query()
            ->join('languages', 'languages.id', '=', 'translations.language_id')
            ->where('languages.code', $code)
            ->where('languages.active', true);

        if ($group) {
            $query->where('translations.group', $group);
        }

        $translations = $query->pluck('translations.value', 'translations.key')->toArray();

        return $translations;
    }

    /**
     * Get all translations grouped by groups
     *
     * @param string $code
     * @return array
     */
    public static function getAllGrouped(string $code): array
    {
        $translations = self::query()
            ->join('languages', 'languages.id', '=', 'translations.language_id')
            ->where('languages.code', $code)
            ->where('languages.active', true)
            ->get(['translations.key', 'translations.value', 'translations.group'])
            ->groupBy('group')
            ->map(function ($items) {
                return collect($items)->pluck('value', 'key')->toArray();
            })
            ->toArray();

        return $translations;
    }
}
