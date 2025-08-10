<?php

namespace App\Policies;

use App\Models\District;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class DistrictPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('district.view_any');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, District $district): bool
    {
        return $user->hasPermissionTo('district.view');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('district.create');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, District $district): bool
    {
        return $user->hasPermissionTo('district.update');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, District $district): bool
    {
        return $user->hasPermissionTo('district.delete');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, District $district): bool
    {
        return $user->hasPermissionTo('district.restore');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, District $district): bool
    {
        return $user->hasPermissionTo('district.force_delete');
    }
}
