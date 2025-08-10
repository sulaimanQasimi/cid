<?php

namespace App\Policies;

use App\Models\Criminal;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class CriminalPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('criminal.view_any');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Criminal $criminal): bool
    {
        return $user->hasPermissionTo('criminal.view');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('criminal.create');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Criminal $criminal): bool
    {
        return $user->hasPermissionTo('criminal.update');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Criminal $criminal): bool
    {
        return $user->hasPermissionTo('criminal.delete');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Criminal $criminal): bool
    {
        return $user->hasPermissionTo('criminal.restore');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Criminal $criminal): bool
    {
        return $user->hasPermissionTo('criminal.force_delete');
    }
}
