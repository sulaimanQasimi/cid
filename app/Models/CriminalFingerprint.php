<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CriminalFingerprint extends Model
{
    protected $fillable = [
        'criminal_id',
        'finger_position',
        'template',
        'image_base64',
        'quality_score',
        'captured_at',
        'captured_by',
    ];

    protected $casts = [
        'captured_at' => 'datetime',
        'quality_score' => 'integer',
    ];

    /**
     * Get the criminal that owns the fingerprint.
     */
    public function criminal(): BelongsTo
    {
        return $this->belongsTo(Criminal::class);
    }

    /**
     * Get the user who captured the fingerprint.
     */
    public function capturedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'captured_by');
    }
}
