<?php

namespace App\Policies;

use App\Models\MeetingSession;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class MeetingSessionPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('meeting_session.view_any');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, MeetingSession $meetingSession): bool
    {
        return $user->hasPermissionTo('meeting_session.view');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('meeting_session.create');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, MeetingSession $meetingSession): bool
    {
        return $user->hasPermissionTo('meeting_session.update');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, MeetingSession $meetingSession): bool
    {
        return $user->hasPermissionTo('meeting_session.delete');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, MeetingSession $meetingSession): bool
    {
        return $user->hasPermissionTo('meeting_session.restore');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, MeetingSession $meetingSession): bool
    {
        return $user->hasPermissionTo('meeting_session.force_delete');
    }
}
