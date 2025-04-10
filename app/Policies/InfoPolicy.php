<?php

namespace App\Policies;

use App\Models\Info;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class InfoPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true; // All authenticated users can view the list
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Info $info): bool
    {
        // Users can view info if:
        // 1. They created it
        // 2. They're the associated user
        // 3. They confirmed it
        // 4. The info is confirmed (public)
        return $user->id === $info->created_by ||
               $user->id === $info->user_id ||
               $user->id === $info->confirmed_by ||
               $info->confirmed;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Can implement more sophisticated rules based on user roles
        return true; // All authenticated users can create
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Info $info): bool
    {
        // Users can update info if:
        // 1. They created it
        // 2. They're the associated user (if set)
        // 3. They have admin privileges (implement admin check if needed)
        return $user->id === $info->created_by ||
               ($info->user_id && $user->id === $info->user_id);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Info $info): bool
    {
        // Only the creator or admins can delete
        return $user->id === $info->created_by;
    }

    /**
     * Determine whether the user can confirm the model.
     */
    public function confirm(User $user, Info $info): bool
    {
        // Users can't confirm their own entries - implement role-based logic here
        return $user->id !== $info->created_by;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Info $info): bool
    {
        // Only admins or the creator can restore
        return $user->id === $info->created_by;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Info $info): bool
    {
        // Only admins should have this right
        return false;
    }
}
