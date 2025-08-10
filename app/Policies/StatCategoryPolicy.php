<?php

namespace App\Policies;

use App\Models\StatCategory;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class StatCategoryPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('stat_category.view_any');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, StatCategory $statCategory): bool
    {
        return $user->hasPermissionTo('stat_category.view');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('stat_category.create');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, StatCategory $statCategory): bool
    {
        return $user->hasPermissionTo('stat_category.update');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, StatCategory $statCategory): bool
    {
        return $user->hasPermissionTo('stat_category.delete');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, StatCategory $statCategory): bool
    {
        return $user->hasPermissionTo('stat_category.restore');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, StatCategory $statCategory): bool
    {
        return $user->hasPermissionTo('stat_category.force_delete');
    }
}
