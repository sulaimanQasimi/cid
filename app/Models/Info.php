<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Info extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'info_type_id',
        'info_category_id',
        'name',
        'code',
        'description',
        'value',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'value' => 'array',
    ];

    /**
     * Get the info type that owns the info.
     */
    public function infoType(): BelongsTo
    {
        return $this->belongsTo(InfoType::class);
    }

    /**
     * Get the info category that owns the info.
     */
    public function infoCategory(): BelongsTo
    {
        return $this->belongsTo(InfoCategory::class);
    }
}
