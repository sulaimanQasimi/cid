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
        // Only the creator can view the criminal
        return $user->hasPermissionTo('criminal.view') && ($criminal->created_by === $user->id || $criminal->hasAccess($user));
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
        // Only the creator can update the criminal
        return $user->hasPermissionTo('criminal.update') && $criminal->created_by === $user->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Criminal $criminal): bool
    {
        // Check if user has the general permission and has access to the criminal
        // Only the creator can delete the criminal
        return $user->hasPermissionTo('criminal.delete') && ($criminal->created_by === $user->id);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Criminal $criminal): bool
    {
        return $user->hasPermissionTo('criminal.restore') && ($criminal->created_by === $user->id);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Criminal $criminal): bool
    {
        return $user->hasPermissionTo('criminal.force_delete') && ($criminal->created_by === $user->id);
    }

    /**
     * Determine whether the user can view the comprehensive list of criminals.
     */
    public function viewComprehensiveList(User $user): bool
    {
        return $user->hasPermissionTo('criminal.view_comprehensive_list');
    }
}