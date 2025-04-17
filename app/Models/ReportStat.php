<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ReportStat extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'incident_report_id',
        'stat_category_item_id',
        'integer_value',
        'string_value',
        'notes',
        'created_by',
        'updated_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'integer_value' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Get the incident report that owns this stat.
     */
    public function incidentReport(): BelongsTo
    {
        return $this->belongsTo(IncidentReport::class);
    }

    /**
     * Get the stat category item this stat belongs to.
     */
    public function statCategoryItem(): BelongsTo
    {
        return $this->belongsTo(StatCategoryItem::class);
    }

    /**
     * Get the user that created this stat.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user that last updated this stat.
     */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Get the value, regardless of whether it's stored as integer or string.
     *
     * @return mixed
     */
    public function getValue()
    {
        return $this->integer_value !== null ? $this->integer_value : $this->string_value;
    }

    /**
     * Set the value based on its type.
     *
     * @param mixed $value
     * @return void
     */
    public function setValue($value): void
    {
        if (is_numeric($value) && is_int((int)$value)) {
            $this->integer_value = (int)$value;
            $this->string_value = null;
        } else {
            $this->string_value = (string)$value;
            $this->integer_value = null;
        }
    }
}
