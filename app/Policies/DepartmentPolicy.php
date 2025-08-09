<?php

namespace App\Policies;

use App\Models\Department;
use App\Models\User;

class DepartmentPolicy
{
    /**
     * Determine whether the user can view any departments.
     */
    public function viewAny(User $user): bool
    {
        return true; // All authenticated users can view the list
    }

    /**
     * Determine whether the user can view a department.
     */
    public function view(User $user, Department $department): bool
    {
        return true; // Everyone can view department details
    }

    /**
     * Determine whether the user can create departments.
     */
    public function create(User $user): bool
    {
        return true; // Adjust to role-based checks as needed
    }

    /**
     * Determine whether the user can update the department.
     */
    public function update(User $user, Department $department): bool
    {
        return true; // Adjust to role-based checks as needed
    }

    /**
     * Determine whether the user can delete the department.
     * Prevent deleting when infos exist under the department.
     */
    public function delete(User $user, Department $department): bool
    {
        if ($department->infos()->count() > 0) {
            return false;
        }

        return true; // Adjust to role-based checks as needed
    }

    /**
     * Determine whether the user can restore the department.
     */
    public function restore(User $user, Department $department): bool
    {
        return true;
    }

    /**
     * Determine whether the user can permanently delete the department.
     */
    public function forceDelete(User $user, Department $department): bool
    {
        return false; // Disallow force delete by default
    }
}
