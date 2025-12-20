<?php

namespace App\Policies;

use App\Models\Incident;
use App\Models\IncidentReport;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class IncidentPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {

        return $user->hasPermissionTo('incident.view_any');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Incident $incident): bool
    {
        // Check if user is the submitter, reporter, or has access to the incident report
        if ($user->id === $incident->report->submitted_by || $user->id === $incident->reported_by || $incident->report->accesses()
            ->where('user_id', $user->id)
            ->exists()) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, ?IncidentReport $incidentReport = null): bool
    {

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
     * Determine whether the user can update the model.
     */
    public function update(User $user, Incident $incident): bool
    {
        // Check if user has incident report access with update permissions
        return $user->hasPermissionTo('incident.update') && $user->id === $incident->submitted_by;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Incident $incident): bool
    {
        // Check if user has incident report access with delete permissions
        return $user->hasPermissionTo('incident.delete') && $user->id === $incident->report->submitted_by;
    }

    /**
     * Determine whether the user can confirm the incident.
     */
    public function confirm(User $user, Incident $incident): bool
    {
        // Check if user has incident report access with update permissions
        return $user->hasPermissionTo('incident.confirm') && $user->id === $incident->report->submitted_by;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Incident $incident): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Incident $incident): bool
    {
        return false;
    }
}
