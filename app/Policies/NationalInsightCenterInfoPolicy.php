<?php

namespace App\Policies;

use App\Models\NationalInsightCenterInfo;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class NationalInsightCenterInfoPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('national_insight_center_info.view_any');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, NationalInsightCenterInfo $nationalInsightCenterInfo): bool
    {
        return $user->hasPermissionTo('national_insight_center_info.view') && 
               ($nationalInsightCenterInfo->created_by === $user->id || $nationalInsightCenterInfo->hasAccess($user));
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('national_insight_center_info.create');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, NationalInsightCenterInfo $nationalInsightCenterInfo): bool
    {
        // Cannot update if confirmed
        if ($nationalInsightCenterInfo->confirmed) {
            return false;
        }
        
        return $user->hasPermissionTo('national_insight_center_info.update') && 
               ($nationalInsightCenterInfo->created_by === $user->id);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, NationalInsightCenterInfo $nationalInsightCenterInfo): bool
    {
        // Cannot delete if confirmed
        if ($nationalInsightCenterInfo->confirmed) {
            return false;
        }
        
        return $user->hasPermissionTo('national_insight_center_info.delete') && 
               $nationalInsightCenterInfo->created_by === $user->id;
    }

    /**
     * Determine whether the user can confirm the model.
     */
    public function confirm(User $user, NationalInsightCenterInfo $nationalInsightCenterInfo): bool
    {
        // Only the creator can confirm and only if not already confirmed
        return $user->hasPermissionTo('national_insight_center_info.confirm') && 
               $nationalInsightCenterInfo->created_by === $user->id && 
               !$nationalInsightCenterInfo->confirmed;
    }

    /**
     * Determine whether the user can print the model.
     */
    public function print(User $user, NationalInsightCenterInfo $nationalInsightCenterInfo): bool
    {
        // Creator can always print, or user with print permission
        return $nationalInsightCenterInfo->created_by === $user->id || 
               $user->hasPermissionTo('national_insight_center_info.print');
    }

    /**
     * Determine whether the user can print dates report.
     * If a specific record is provided, also checks access to that record.
     */
    public function printDates(User $user, NationalInsightCenterInfo $nationalInsightCenterInfo = null): bool
    {
        // Check permission first
        if (!$user->hasPermissionTo('national_insight_center_info.print')) {
            return false;
        }
        
        // If a specific record is provided, also check access
        if ($nationalInsightCenterInfo !== null) {
            return $nationalInsightCenterInfo->created_by === $user->id || $nationalInsightCenterInfo->hasAccess($user);
        }
        
        // If no record provided, just check permission (for print-dates route)
        return true;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, NationalInsightCenterInfo $nationalInsightCenterInfo): bool
    {
        // Cannot restore if confirmed
        if ($nationalInsightCenterInfo->confirmed) {
            return false;
        }
        
        return $user->hasPermissionTo('national_insight_center_info.restore') && 
               $nationalInsightCenterInfo->created_by === $user->id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, NationalInsightCenterInfo $nationalInsightCenterInfo): bool
    {
        // Cannot force delete if confirmed
        if ($nationalInsightCenterInfo->confirmed) {
            return false;
        }
        
        return $user->hasPermissionTo('national_insight_center_info.force_delete') && 
               $nationalInsightCenterInfo->created_by === $user->id;
    }
}
