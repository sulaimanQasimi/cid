<?php

namespace App\Policies;

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
                $nationalInsightCenterInfoItem->nationalInsightCenterInfo->hasAccess($user));
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('national_insight_center_info_item.create');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, NationalInsightCenterInfoItem $nationalInsightCenterInfoItem): bool
    {
        return $user->hasPermissionTo('national_insight_center_info_item.update') && 
               ($nationalInsightCenterInfoItem->created_by === $user->id || 
                $nationalInsightCenterInfoItem->nationalInsightCenterInfo->hasAccess($user));
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, NationalInsightCenterInfoItem $nationalInsightCenterInfoItem): bool
    {
        return $user->hasPermissionTo('national_insight_center_info_item.delete') && 
               ($nationalInsightCenterInfoItem->created_by === $user->id || 
                $nationalInsightCenterInfoItem->nationalInsightCenterInfo->hasAccess($user));
    }

    /**
     * Determine whether the user can confirm the model.
     */
    public function confirm(User $user, NationalInsightCenterInfoItem $nationalInsightCenterInfoItem): bool
    {
        return $user->hasPermissionTo('national_insight_center_info_item.confirm');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, NationalInsightCenterInfoItem $nationalInsightCenterInfoItem): bool
    {
        return $user->hasPermissionTo('national_insight_center_info_item.restore') && 
               ($nationalInsightCenterInfoItem->created_by === $user->id || 
                $nationalInsightCenterInfoItem->nationalInsightCenterInfo->hasAccess($user));
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, NationalInsightCenterInfoItem $nationalInsightCenterInfoItem): bool
    {
        return $user->hasPermissionTo('national_insight_center_info_item.force_delete') && 
               ($nationalInsightCenterInfoItem->created_by === $user->id || 
                $nationalInsightCenterInfoItem->nationalInsightCenterInfo->hasAccess($user));
    }
}
