<?php

namespace App\Policies;

use App\Models\IncidentReport;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class IncidentReportPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // Check if user has incident report access

        return $user->hasPermissionTo('incident_report.view_any');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, IncidentReport $incidentReport): bool
    {
        // Check if user is the submitter (always has access)
        if ($user->id === $incidentReport->submitted_by) {
            return true;
        }

        // Check if user has global incident report access
        if ($user->canViewIncidentReport($incidentReport->id)) {
            return true;
        }

        // Check if user has been granted access to this specific report
        $hasAccess = $incidentReport->accesses()
            ->where('user_id', $user->id)
            ->exists();

        if ($hasAccess) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('incident_report.create');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, IncidentReport $incidentReport): bool
    {
        // Don't allow update if report is approved
        if (!is_null($incidentReport->approved_by)) {
            return false;
        }

        // Allow update if user has appropriate 'update' access, or is submitter
        return $user->hasPermissionTo('incident_report.update') && $user->id === $incidentReport->submitted_by;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, IncidentReport $incidentReport): bool
    {
        // Don't allow delete if report is approved
        if (!is_null($incidentReport->approved_by)) {
            return false;
        }

        return $user->hasPermissionTo('incident_report.delete') && $user->id === $incidentReport->submitted_by;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, IncidentReport $incidentReport): bool
    {
        return $user->hasPermissionTo('incident_report.restore') && $user->id === $incidentReport->submitted_by;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, IncidentReport $incidentReport): bool
    {
        return $user->hasPermissionTo('incident_report.force_delete') && $user->id === $incidentReport->submitted_by;
    }
    public function printReport(User $user, IncidentReport $incidentReport): bool
    {
        // Check if user is the submitter (always has access)
        if ($user->id === $incidentReport->submitted_by) {
            return true;
        }

        // Check if user has been granted access to this specific report
        $hasAccess = $incidentReport->accesses()
            ->where('user_id', $user->id)
            ->exists();

        if ($hasAccess) {
            return true;
        }
        return false;
    }

    /**
     * Determine whether the user can confirm the incident report.
     */
    public function confirm(User $user, IncidentReport $incidentReport): bool
    {
        // Only admin and superadmin can confirm reports
        return $user->hasAnyRole(['admin', 'superadmin']);
    }
}
