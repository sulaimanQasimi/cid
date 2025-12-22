<?php

namespace App\Policies;

use App\Models\NationalInsightCenterInfo;
use App\Models\NationalInsightCenterInfoItem;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class NationalInsightCenterInfoItemPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('national_insight_center_info_item.view_any');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, NationalInsightCenterInfoItem $nationalInsightCenterInfoItem): bool
    {
        return $user->hasPermissionTo('national_insight_center_info_item.view') &&
               ($nationalInsightCenterInfoItem->created_by === $user->id ||
               $nationalInsightCenterInfoItem->nationalInsightCenterInfo->created_by === $user->id ||
                $nationalInsightCenterInfoItem->nationalInsightCenterInfo->hasAccess($user));
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, ?NationalInsightCenterInfo $nationalInsightCenterInfo = null): bool
    {
        // If NationalInsightCenterInfo is provided, check if it's confirmed
        if ($nationalInsightCenterInfo && $nationalInsightCenterInfo->confirmed) {
            return false;
        }
         if ( $nationalInsightCenterInfo->hasAccess($user)) {
            return true;
        }

        return false;  
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, NationalInsightCenterInfoItem $nationalInsightCenterInfoItem): bool
    {
        // Cannot update if parent is confirmed
        if ($nationalInsightCenterInfoItem->nationalInsightCenterInfo->confirmed) {
            return false;
        }

        // Cannot update if item itself is confirmed
        if ($nationalInsightCenterInfoItem->confirmed) {
            return false;
        }

        return $nationalInsightCenterInfoItem->created_by === $user->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, NationalInsightCenterInfoItem $nationalInsightCenterInfoItem): bool
    {
        // Cannot delete if parent is confirmed
        if ($nationalInsightCenterInfoItem->nationalInsightCenterInfo->confirmed) {
            return false;
        }

        return $user->hasPermissionTo('national_insight_center_info_item.delete') &&
               ($nationalInsightCenterInfoItem->created_by === $user->id);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, NationalInsightCenterInfoItem $nationalInsightCenterInfoItem): bool
    {
        // Cannot restore if parent is confirmed
        if ($nationalInsightCenterInfoItem->nationalInsightCenterInfo->confirmed) {
            return false;
        }

        return $user->hasPermissionTo('national_insight_center_info_item.restore') &&
               ($nationalInsightCenterInfoItem->created_by === $user->id);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, NationalInsightCenterInfoItem $nationalInsightCenterInfoItem): bool
    {
        // Cannot force delete if parent is confirmed
        if ($nationalInsightCenterInfoItem->nationalInsightCenterInfo->confirmed) {
            return false;
        }

        return $user->hasPermissionTo('national_insight_center_info_item.force_delete') &&
               ($nationalInsightCenterInfoItem->created_by === $user->id);
    }

    /**
     * Determine whether the user can confirm the model.
     */
    public function confirm(User $user, NationalInsightCenterInfoItem $nationalInsightCenterInfoItem): bool
    {
        // Cannot confirm if parent is confirmed
        if ($nationalInsightCenterInfoItem->nationalInsightCenterInfo->confirmed) {
            return false;
        }

        // Cannot confirm if item is already confirmed
        if ($nationalInsightCenterInfoItem->confirmed) {
            return false;
        }

        // Only the creator of the NationalInsightCenterInfo can confirm items
        return $nationalInsightCenterInfoItem->nationalInsightCenterInfo->created_by === $user->id;
    }
}
