<?php

namespace App\Policies;

use App\Models\Info;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class InfoPolicy
{
    use HandlesAuthorization;

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
        // Admin and managers can view all infos
        if ($user->hasAnyRole(['admin', 'superadmin', 'manager'])) {
            return $user->hasPermissionTo('info.view');
        }

        // Regular users can only view their own infos
        return $user->hasPermissionTo('info.view') && 
               ($info->user_id === $user->id || $info->created_by === $user->id);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('info.create');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Info $info): bool
    {
        // Cannot update confirmed infos
        if ($info->confirmed) {
            return false;
        }

        // Admin and managers can update all non-confirmed infos
        if ($user->hasAnyRole(['admin', 'superadmin', 'manager'])) {
            return $user->hasPermissionTo('info.update');
        }

        // Regular users can only update their own non-confirmed infos
        return $user->hasPermissionTo('info.update') && 
               ($info->user_id === $user->id || $info->created_by === $user->id);
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

        // Admin and managers can delete all non-confirmed infos
        if ($user->hasAnyRole(['admin', 'superadmin', 'manager'])) {
            return $user->hasPermissionTo('info.delete');
        }

        // Regular users can only delete their own non-confirmed infos
        return $user->hasPermissionTo('info.delete') && 
               ($info->user_id === $user->id || $info->created_by === $user->id);
    }

    /**
     * Determine whether the user can confirm the model.
     */
    public function confirm(User $user, Info $info): bool
    {
        // Only admin and superadmin can confirm infos
        if ($user->hasAnyRole(['admin', 'superadmin'])) {
            return $user->hasPermissionTo('info.confirm');
        }

        return false;
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
