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
        return $user->hasPermissionTo('info.view');
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
        return $user->hasPermissionTo('info.update');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Info $info): bool
    {
        return $user->hasPermissionTo('info.delete');
    }

    /**
     * Determine whether the user can confirm the model.
     */
    public function confirm(User $user, Info $info): bool
    {
        return $user->hasPermissionTo('info.confirm');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Info $info): bool
    {
        return $user->hasPermissionTo('info.restore');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Info $info): bool
    {
        return $user->hasPermissionTo('info.force_delete');
    }
}
