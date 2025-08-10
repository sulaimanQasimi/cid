<?php

namespace App\Policies;

use App\Models\Translation;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TranslationPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('translation.view_any');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Translation $translation): bool
    {
        return $user->hasPermissionTo('translation.view');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('translation.create');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Translation $translation): bool
    {
        return $user->hasPermissionTo('translation.update');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Translation $translation): bool
    {
        return $user->hasPermissionTo('translation.delete');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Translation $translation): bool
    {
        return $user->hasPermissionTo('translation.restore');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Translation $translation): bool
    {
        return $user->hasPermissionTo('translation.force_delete');
    }
}
