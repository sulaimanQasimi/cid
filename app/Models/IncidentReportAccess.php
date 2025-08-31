<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class IncidentReportAccess extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'incident_report_access';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'incident_report_id',
        'granted_by',
        'access_type',
        'notes',
        'expires_at',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    /**
     * Get the user that has access.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the incident report that this access is for.
     */
    public function incidentReport(): BelongsTo
    {
        return $this->belongsTo(IncidentReport::class);
    }

    /**
     * Get the user that granted the access.
     */
    public function grantedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'granted_by');
    }

    /**
     * Check if the access is still valid (not expired).
     */
    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    /**
     * Check if the access is currently valid.
     */
    public function isValid(): bool
    {
        return $this->is_active && !$this->isExpired();
    }

    /**
     * Get the access type label.
     */
    public function getAccessTypeLabelAttribute(): string
    {
        return match($this->access_type) {
            'full' => 'Full Access',
            'read_only' => 'Read Only',
            'incidents_only' => 'Incidents Only',
            default => 'Unknown'
        };
    }

    /**
     * Scope to get only active and non-expired access records.
     */
    public function scopeValid($query)
    {
        return $query->where('is_active', true)
                    ->where(function($q) {
                        $q->whereNull('expires_at')
                          ->orWhere('expires_at', '>', now());
                    });
    }

    /**
     * Scope to get expired access records.
     */
    public function scopeExpired($query)
    {
        return $query->where('is_active', true)
                    ->where('expires_at', '<', now());
    }

    /**
     * Scope to get access records for a specific incident report.
     */
    public function scopeForReport($query, $reportId)
    {
        return $query->where('incident_report_id', $reportId);
    }

    /**
     * Scope to get global access records (no specific report).
     */
    public function scopeGlobal($query)
    {
        return $query->whereNull('incident_report_id');
    }

    /**
     * Check if user has specific access type.
     */
    public function hasAccessType(string $type): bool
    {
        if (!$this->isValid()) {
            return false;
        }

        return match($type) {
            'full' => $this->access_type === 'full',
            'read_only' => in_array($this->access_type, ['full', 'read_only']),
            'incidents_only' => in_array($this->access_type, ['full', 'incidents_only']),
            'create' => $this->access_type === 'full',
            'update' => $this->access_type === 'full',
            'delete' => $this->access_type === 'full',
            default => false
        };
    }

    /**
     * Check if this is a global access record.
     */
    public function isGlobal(): bool
    {
        return is_null($this->incident_report_id);
    }

    /**
     * Check if this is a report-specific access record.
     */
    public function isReportSpecific(): bool
    {
        return !is_null($this->incident_report_id);
    }
}
