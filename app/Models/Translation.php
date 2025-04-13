<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Translation extends Model
{
    use HasFactory;

    protected $fillable = [
        'language_id',
        'key',
        'value',
        'group',
    ];

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
