<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Namu\WireChat\Traits\Chatable;
use Spatie\Permission\Traits\HasRoles;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Contracts\Activity;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles, LogsActivity;

    use Chatable;    
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];


    public function canCreateChats(): bool
    {
        return $this->hasAnyRole(['superadmin', 'admin']);
    }

    public function canUpdateChats(): bool
    {
        return $this->hasAnyRole(['superadmin', 'admin']);
    }
    
    

    public function canCreateGroups(): bool
    {
        return $this->hasAnyRole(['superadmin', 'admin']);
    }

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
                'created' => 'کاربر جدید ثبت شد',
                'updated' => 'اطلاعات کاربر بروزرسانی شد',
                'deleted' => 'کاربر حذف شد',
                default => "عملیات {$eventName} روی کاربر انجام شد"
            });
    }

    /**
     * Customize the activity before it gets saved.
     */
    public function tapActivity(Activity $activity, string $eventName)
    {
        $activity->description = match($eventName) {
            'created' => 'کاربر جدید ثبت شد',
            'updated' => 'اطلاعات کاربر بروزرسانی شد',
            'deleted' => 'کاربر حذف شد',
            default => "عملیات {$eventName} روی کاربر انجام شد"
        };
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the incident report access records for this user.
     */
    public function incidentReportAccess(): HasMany
    {
        return $this->hasMany(IncidentReportAccess::class);
    }

    /**
     * Get the current valid incident report access for this user (global access).
     */
    public function getCurrentIncidentReportAccess()
    {
        return $this->incidentReportAccess()
                   ->valid()
                   ->global()
                   ->latest()
                   ->first();
    }

    /**
     * Get the current valid incident report access for a specific report.
     */
    public function getCurrentIncidentReportAccessForReport($reportId)
    {
        return $this->incidentReportAccess()
                   ->valid()
                   ->forReport($reportId)
                   ->latest()
                   ->first();
    }

    /**
     * Check if user has access to incident reports (global access).
     */
    public function hasIncidentReportAccess(string $type = 'read_only'): bool
    {
        // Super admins and admins always have access
        if ($this->hasAnyRole(['superadmin', 'admin'])) {
            return true;
        }

        $access = $this->getCurrentIncidentReportAccess();
        
        if (!$access) {
            return false;
        }

        return $access->hasAccessType($type);
    }

    /**
     * Check if user has access to a specific incident report.
     */
    public function hasIncidentReportAccessForReport($reportId, string $type = 'read_only'): bool
    {
        // Super admins and admins always have access
        if ($this->hasAnyRole(['superadmin', 'admin'])) {
            return true;
        }

        // First check for report-specific access
        $reportAccess = $this->getCurrentIncidentReportAccessForReport($reportId);
        if ($reportAccess && $reportAccess->hasAccessType($type)) {
            return true;
        }

        // If no report-specific access, check for global access
        $globalAccess = $this->getCurrentIncidentReportAccess();
        if ($globalAccess && $globalAccess->hasAccessType($type)) {
            return true;
        }

        return false;
    }

    /**
     * Check if user can view incident reports (global access).
     */
    public function canViewIncidentReports(): bool
    {
        return $this->hasIncidentReportAccess('read_only');
    }

    /**
     * Check if user can view a specific incident report.
     */
    public function canViewIncidentReport($reportId): bool
    {
        return $this->hasIncidentReportAccessForReport($reportId, 'read_only');
    }

    /**
     * Check if user can create incident reports (global access).
     */
    public function canCreateIncidentReports(): bool
    {
        return $this->hasIncidentReportAccess('create');
    }

    /**
     * Check if user can create incident reports (global access only).
     */
    public function canCreateIncidentReport(): bool
    {
        return $this->hasIncidentReportAccess('create');
    }

    /**
     * Check if user can update incident reports (global access).
     */
    public function canUpdateIncidentReports(): bool
    {
        return $this->hasIncidentReportAccess('update');
    }

    /**
     * Check if user can update a specific incident report.
     */
    public function canUpdateIncidentReport($reportId): bool
    {
        return $this->hasIncidentReportAccessForReport($reportId, 'update');
    }

    /**
     * Check if user can delete incident reports (global access).
     */
    public function canDeleteIncidentReports(): bool
    {
        return $this->hasIncidentReportAccess('delete');
    }

    /**
     * Check if user can delete a specific incident report.
     */
    public function canDeleteIncidentReport($reportId): bool
    {
        return $this->hasIncidentReportAccessForReport($reportId, 'delete');
    }

    /**
     * Check if user can access incidents only (global access).
     */
    public function canAccessIncidentsOnly(): bool
    {
        return $this->hasIncidentReportAccess('incidents_only');
    }

    /**
     * Check if user can access incidents only for a specific report.
     */
    public function canAccessIncidentsOnlyForReport($reportId): bool
    {
        return $this->hasIncidentReportAccessForReport($reportId, 'incidents_only');
    }
}
