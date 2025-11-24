<?php

namespace App\Policies;

use App\Models\Info;
use App\Models\InfoType;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class InfoPolicy
{
    use HandlesAuthorization;

    /**
     * Check if user has access to an InfoType.
     * User has access if they are the creator or have explicit access through accesses relationship.
     */
    protected function hasInfoTypeAccess(User $user, InfoType $infoType): bool
    {
        return $infoType->hasAccess($user);
    }

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('info.view_any');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Info $info): bool
    {
        return $info->created_by === $user->id || $info->infoType?->created_by === $user->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, ?InfoType $infoType = null): bool
    {
            return $this->hasInfoTypeAccess($user, $infoType);
       
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Info $info): bool
    { 
        return $info->created_by === $user->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Info $info): bool
    {
        // Cannot delete confirmed infos
        if ($info->confirmed) {
            return false;
        }

        // Check permission first
        if (!$user->hasPermissionTo('info.delete')) {
            return false;
        }

        // Admin and managers can delete all non-confirmed infos
        if ($user->hasAnyRole(['admin', 'superadmin', 'manager'])) {
            return true;
        }

        // Load InfoType if not already loaded
        if (!$info->relationLoaded('infoType')) {
            $info->load('infoType');
        }

        // Check if user has access to the InfoType
        if ($info->infoType && !$this->hasInfoTypeAccess($user, $info->infoType)) {
            return false;
        }

        // Regular users can only delete their own non-confirmed infos
        return $info->user_id === $user->id || $info->created_by === $user->id;
    }

    /**
     * Determine whether the user can confirm the model.
     */
    public function confirm(User $user, Info $info): bool
    {
        // Only admin and superadmin can confirm infos
        return $info->infoType?->created_by === $user->id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Info $info): bool
    {
        // Only admin and managers can restore infos
        if ($user->hasAnyRole(['admin', 'superadmin', 'manager'])) {
            return $user->hasPermissionTo('info.restore');
        }

        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Info $info): bool
    {
        // Only admin and managers can permanently delete infos
        if ($user->hasAnyRole(['admin', 'superadmin', 'manager'])) {
            return $user->hasPermissionTo('info.force_delete');
        }

        return false;
    }
}
