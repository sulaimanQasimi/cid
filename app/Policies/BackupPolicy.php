<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class BackupPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any backups.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('manage backups');
    }

    /**
     * Determine whether the user can view backups.
     */
    public function view(User $user): bool
    {
        return $user->can('manage backups');
    }

    /**
     * Determine whether the user can create backups.
     */
    public function create(User $user): bool
    {
        return $user->can('manage backups');
    }

    /**
     * Determine whether the user can download backups.
     */
    public function download(User $user): bool
    {
        return $user->can('manage backups');
    }

    /**
     * Determine whether the user can delete backups.
     */
    public function delete(User $user): bool
    {
        return $user->can('manage backups');
    }

    /**
     * Determine whether the user can manage backups.
     */
    public function manage(User $user): bool
    {
        return $user->can('manage backups');
    }
}
