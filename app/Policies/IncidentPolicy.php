<?php

namespace App\Policies;

use App\Models\Incident;
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
        // Check if user has incident report access (for incidents only or full access)
        if (!$user->hasIncidentReportAccess('incidents_only') && !$user->hasIncidentReportAccess('read_only')) {
            return false;
        }

        return $user->hasPermissionTo('incident.view_any');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Incident $incident): bool
    {
        // Check if user has incident report access (for incidents only or full access)
        if (!$user->hasIncidentReportAccess('incidents_only') && !$user->hasIncidentReportAccess('read_only')) {
            return false;
        }

        return $user->hasPermissionTo('incident.view');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Check if user has incident report access with create permissions
        if (!$user->canCreateIncidentReports()) {
            return false;
        }

        return $user->hasPermissionTo('incident.create');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Incident $incident): bool
    {
        // Check if user has incident report access with update permissions
        if (!$user->canUpdateIncidentReports()) {
            return false;
        }

        // Check basic permission first
        if (!$user->hasPermissionTo('incident.update')) {
            return false;
        }

        // Use the model's method to check if user can edit
        return $incident->canBeEditedBy($user);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Incident $incident): bool
    {
        // Check if user has incident report access with delete permissions
        if (!$user->canDeleteIncidentReports()) {
            return false;
        }

        // Check basic permission first
        if (!$user->hasPermissionTo('incident.delete')) {
            return false;
        }

        // Use the model's method to check if user can delete
        return $incident->canBeDeletedBy($user);
    }

    /**
     * Determine whether the user can confirm the incident.
     */
    public function confirm(User $user, Incident $incident): bool
    {
        // Check if user has incident report access with update permissions
        if (!$user->canUpdateIncidentReports()) {
            return false;
        }

        return $user->hasRole('admin') && $user->hasPermissionTo('incident.confirm');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Incident $incident): bool
    {
        // Check if user has incident report access with update permissions
        if (!$user->canUpdateIncidentReports()) {
            return false;
        }

        return $user->hasPermissionTo('incident.restore');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Incident $incident): bool
    {
        // Check if user has incident report access with delete permissions
        if (!$user->canDeleteIncidentReports()) {
            return false;
        }

        return $user->hasPermissionTo('incident.force_delete');
    }
}
