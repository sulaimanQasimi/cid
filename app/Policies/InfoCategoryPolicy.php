<?php

namespace App\Policies;

use App\Models\InfoCategory;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class InfoCategoryPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('info_category.view_any');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, InfoCategory $infoCategory): bool
    {
        return $user->hasPermissionTo('info_category.view');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('info_category.create');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, InfoCategory $infoCategory): bool
    {
        return $user->hasPermissionTo('info_category.update');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, InfoCategory $infoCategory): bool
    {
        return $user->hasPermissionTo('info_category.delete');
    }

    /**
     * Determine whether the user can confirm the model.
     */
    public function confirm(User $user, InfoCategory $infoCategory): bool
    {
        return $user->hasPermissionTo('info_category.confirm');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, InfoCategory $infoCategory): bool
    {
        return $user->hasPermissionTo('info_category.restore');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, InfoCategory $infoCategory): bool
    {
        return $user->hasPermissionTo('info_category.force_delete');
    }
}
