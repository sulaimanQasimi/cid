<?php

namespace App\Policies;

use App\Models\Meeting;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class MeetingPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('list-meeting');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Meeting $meeting): bool
    {
        if ($user->hasPermissionTo('view-meeting')) {
            // Allow if user is the creator
            if ($meeting->created_by === $user->id) {
                return true;
            }

            // Allow if user is a participant
            return $meeting->participants()->where('user_id', $user->id)->exists();
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create-meeting');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Meeting $meeting): bool
    {
        if ($user->hasPermissionTo('update-meeting')) {
            // Allow if user is the creator
            if ($meeting->created_by === $user->id) {
                return true;
            }

            // Allow if user is a co-host
            return $meeting->participants()
                ->where('user_id', $user->id)
                ->wherePivot('role', 'co-host')
                ->exists();
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Meeting $meeting): bool
    {
        if ($user->hasPermissionTo('delete-meeting')) {
            // Only allow creator to delete
            return $meeting->created_by === $user->id;
        }

        return false;
    }

    /**
     * Determine whether the user can join the meeting.
     */
    public function join(User $user, Meeting $meeting): bool
    {
        if ($user->hasPermissionTo('join-meeting')) {
            // Creator can always join
            if ($meeting->created_by === $user->id) {
                return true;
            }

            // Participants can join
            return $meeting->participants()->where('user_id', $user->id)->exists();
        }

        return false;
    }

    /**
     * Determine whether the user can start an offline meeting.
     */
    public function startOffline(User $user): bool
    {
        return $user->hasPermissionTo('start-offline-meeting');
    }

    /**
     * Determine whether the user can join an offline meeting.
     */
    public function joinOffline(User $user, Meeting $meeting): bool
    {
        if ($user->hasPermissionTo('join-offline-meeting')) {
            // Only if meeting is offline enabled
            if (!$meeting->offline_enabled) {
                return false;
            }

            // Creator can always join
            if ($meeting->created_by === $user->id) {
                return true;
            }

            // Participants can join
            return $meeting->participants()->where('user_id', $user->id)->exists();
        }

        return false;
    }
}
