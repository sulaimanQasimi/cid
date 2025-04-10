<?php

namespace App\Policies;

use App\Models\InfoCategory;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class InfoCategoryPolicy
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
    public function view(User $user, InfoCategory $infoCategory): bool
    {
        return true; // All authenticated users can view info categories
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Only users with admin rights should create info categories
        // In a real app, check for admin role
        // return $this->isAdmin($user);
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, InfoCategory $infoCategory): bool
    {
        // Only users with admin rights should update info categories
        return $this->isAdmin($user);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, InfoCategory $infoCategory): bool
    {
        // Only users with admin rights should delete info categories
        // First check if there are any infos using this category
        if ($infoCategory->infos()->count() > 0) {
            return false;
        }

        return $this->isAdmin($user);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, InfoCategory $infoCategory): bool
    {
        // Only users with admin rights should restore info categories
        return $this->isAdmin($user);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, InfoCategory $infoCategory): bool
    {
        // Only users with admin rights should force delete info categories
        // First check if there are any infos using this category
        if ($infoCategory->infos()->count() > 0) {
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
