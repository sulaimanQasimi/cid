<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NationalInsightCenterInfoAccess extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'national_insight_center_info_id',
        'user_id',
    ];

    /**
     * Get the national insight center info that owns the access.
     */
    public function nationalInsightCenterInfo(): BelongsTo
    {
        return $this->belongsTo(NationalInsightCenterInfo::class);
    }

    /**
     * Get the user that has access.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
