<?php

namespace App\Policies;

use App\Models\InfoType;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class InfoTypePolicy
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
    public function view(User $user, InfoType $infoType): bool
    {
        return true; // All authenticated users can view info types
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Only users with admin rights should create info types
        // In a real app, check for admin role
        return $this->isAdmin($user);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, InfoType $infoType): bool
    {
        // Only users with admin rights should update info types
        return $this->isAdmin($user);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, InfoType $infoType): bool
    {
        // Only users with admin rights should delete info types
        // First check if there are any infos using this type
        if ($infoType->infos()->count() > 0) {
            return false;
        }

        return $this->isAdmin($user);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, InfoType $infoType): bool
    {
        // Only users with admin rights should restore info types
        return $this->isAdmin($user);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, InfoType $infoType): bool
    {
        // Only users with admin rights should force delete info types
        // First check if there are any infos using this type
        if ($infoType->infos()->count() > 0) {
            return false;
        }

        return $this->isAdmin($user);
    }

    /**
     * Check if user is an admin
     * This is a placeholder - implement proper role checking
     */
    private function isAdmin(User $user): bool
    {
        // Implement proper admin check based on your user roles system
        // For now, we'll return true for specific test users
        // In a real app, you would check roles and permissions
        return in_array($user->email, [
            'admin@example.com',
            // Add other admin emails
        ]);
    }
}
