<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Traits\HasVisitors;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Contracts\Activity;

// Controller: app/Http/Controllers/IncidentController.php
// Route pages: resources/js/pages/Incidents/
// Route File: routes/incident.php
class Incident extends Model
{
    use HasFactory, SoftDeletes, HasVisitors, LogsActivity;

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
        'is_confirmed',
        'confirmed_by',
        'confirmed_at',
        'confirmation_notes',
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
        'is_confirmed' => 'boolean',
        'confirmed_at' => 'datetime',
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
                'created' => 'حادثه جدید ثبت شد',
                'updated' => 'اطلاعات حادثه بروزرسانی شد',
                'deleted' => 'حادثه حذف شد',
                default => "عملیات {$eventName} روی حادثه انجام شد"
            });
    }

    /**
     * Customize the activity before it gets saved.
     */
    public function tapActivity(Activity $activity, string $eventName)
    {
        $activity->description = match($eventName) {
            'created' => 'حادثه جدید ثبت شد',
            'updated' => 'اطلاعات حادثه بروزرسانی شد',
            'deleted' => 'حادثه حذف شد',
            default => "عملیات {$eventName} روی حادثه انجام شد"
        };
    }

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

    /**
     * Get the admin that confirmed the incident.
     */
    public function confirmer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'confirmed_by');
    }

    /**
     * Check if the incident can be edited by the given user.
     */
    public function canBeEditedBy(User $user): bool
    {
        // Admin can always edit
        if ($user->hasRole('admin')) {
            return true;
        }

        // Creator can edit if not confirmed
        if ($this->reported_by === $user->id && !$this->is_confirmed) {
            return true;
        }

        return false;
    }

    /**
     * Check if the incident can be deleted by the given user.
     */
    public function canBeDeletedBy(User $user): bool
    {
        // Admin can always delete
        if ($user->hasRole('admin')) {
            return true;
        }

        // Creator can delete if not confirmed
        if ($this->reported_by === $user->id && !$this->is_confirmed) {
            return true;
        }

        return false;
    }
}
