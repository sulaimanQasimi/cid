<?php

namespace App\Policies;

use App\Models\InfoType;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class InfoTypePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('info_type.view_any');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, InfoType $infoType): bool
    {
        return $user->hasPermissionTo('info_type.view');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('info_type.create');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, InfoType $infoType): bool
    {
        return $user->hasPermissionTo('info_type.update');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, InfoType $infoType): bool
    {
        return $user->hasPermissionTo('info_type.delete');
    }

    /**
     * Determine whether the user can confirm the model.
     */
    public function confirm(User $user, InfoType $infoType): bool
    {
        return $user->hasPermissionTo('info_type.confirm');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, InfoType $infoType): bool
    {
        return $user->hasPermissionTo('info_type.restore');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, InfoType $infoType): bool
    {
        return $user->hasPermissionTo('info_type.force_delete');
    }
}
