<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Traits\HasVisitors;
// Controller: app/Http/Controllers/IncidentController.php
// Route pages: resources/js/pages/Incidents/

class Incident extends Model
{
    use HasFactory, SoftDeletes, HasVisitors;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'description',
        'incident_date',
        'incident_time',
        'district_id',
        'incident_category_id',
        'incident_report_id',
        'location',
        'coordinates',
        'casualties',
        'injuries',
        'incident_type',
        'status',
        'reported_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'incident_date' => 'date',
        'incident_time' => 'datetime',
        'casualties' => 'integer',
        'injuries' => 'integer',
    ];

    /**
     * Get the district that owns the incident.
     */
    public function district(): BelongsTo
    {
        return $this->belongsTo(District::class);
    }

    /**
     * Get the category of the incident.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(IncidentCategory::class, 'incident_category_id');
    }

    /**
     * Get the report that this incident belongs to.
     */
    public function report(): BelongsTo
    {
        return $this->belongsTo(IncidentReport::class, 'incident_report_id');
    }

    /**
     * Get the user that reported the incident.
     */
    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reported_by');
    }
}
