<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;

class Language extends Model
{
    use HasFactory;

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
