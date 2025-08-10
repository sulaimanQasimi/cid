<?php

namespace App\Policies;

use App\Models\StatCategoryItem;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class StatCategoryItemPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('stat_category_item.view_any');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, StatCategoryItem $statCategoryItem): bool
    {
        return $user->hasPermissionTo('stat_category_item.view');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('stat_category_item.create');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, StatCategoryItem $statCategoryItem): bool
    {
        return $user->hasPermissionTo('stat_category_item.update');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, StatCategoryItem $statCategoryItem): bool
    {
        return $user->hasPermissionTo('stat_category_item.delete');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, StatCategoryItem $statCategoryItem): bool
    {
        return $user->hasPermissionTo('stat_category_item.restore');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, StatCategoryItem $statCategoryItem): bool
    {
        return $user->hasPermissionTo('stat_category_item.force_delete');
    }
}
