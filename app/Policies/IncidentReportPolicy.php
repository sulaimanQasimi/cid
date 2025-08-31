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
        if (!$user->canViewIncidentReports()) {
            return false;
        }

        return $user->hasPermissionTo('incident_report.view_any');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, IncidentReport $incidentReport): bool
    {
        // Check if user has incident report access for this specific report
        if (!$user->canViewIncidentReport($incidentReport->id)) {
            return false;
        }

        return $user->hasPermissionTo('incident_report.view');
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
        return $user->hasPermissionTo('incident_report.update');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, IncidentReport $incidentReport): bool
    {
        return $user->hasPermissionTo('incident_report.delete');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, IncidentReport $incidentReport): bool
    {
        return $user->hasPermissionTo('incident_report.restore');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, IncidentReport $incidentReport): bool
    {
        return $user->hasPermissionTo('incident_report.force_delete');
    }
}
