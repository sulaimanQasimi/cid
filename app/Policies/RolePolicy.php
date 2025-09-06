<?php

namespace App\Policies;

use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Auth\Access\HandlesAuthorization;

class RolePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any roles.
     */
    public function viewAny(User $user): bool
    {
        // Only admin and superadmin can view all roles
        return $user->hasAnyRole(['admin', 'superadmin']);
    }

    /**
     * Determine whether the user can view the role.
     */
    public function view(User $user, Role $role): bool
    {
        // Only admin and superadmin can view roles
        return $user->hasAnyRole(['admin', 'superadmin']);
    }

    /**
     * Determine whether the user can create roles.
     */
    public function create(User $user): bool
    {
        // Only admin and superadmin can create roles
        return $user->hasAnyRole(['admin', 'superadmin']);
    }

    /**
     * Determine whether the user can update the role.
     */
    public function update(User $user, Role $role): bool
    {
        // Only admin and superadmin can update roles
        return $user->hasAnyRole(['admin', 'superadmin']);
    }

    /**
     * Determine whether the user can delete the role.
     */
    public function delete(User $user, Role $role): bool
    {
        // Don't allow deleting the admin or superadmin roles
        if (in_array($role->name, ['admin', 'superadmin'])) {
            return false;
        }
        
        // Only superadmin can delete roles
        return $user->hasRole('superadmin');
    }

    /**
     * Determine whether the user can restore the role.
     */
    public function restore(User $user, Role $role): bool
    {
        // Only superadmin can restore roles
        return $user->hasRole('superadmin');
    }

    /**
     * Determine whether the user can permanently delete the role.
     */
    public function forceDelete(User $user, Role $role): bool
    {
        // Don't allow permanently deleting the admin or superadmin roles
        if (in_array($role->name, ['admin', 'superadmin'])) {
            return false;
        }
        
        // Only superadmin can permanently delete roles
        return $user->hasRole('superadmin');
    }
}
