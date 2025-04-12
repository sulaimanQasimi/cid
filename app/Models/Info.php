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
        'department_id',
        'name',
        'code',
        'description',
        'value',
        'user_id',
        'confirmed',
        'created_by',
        'confirmed_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'value' => 'array',
        'confirmed' => 'boolean',
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

    /**
     * Get the department that owns the info.
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * Get the user that owns the info.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the user who created the info.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user who confirmed the info.
     */
    public function confirmer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'confirmed_by');
    }
}
