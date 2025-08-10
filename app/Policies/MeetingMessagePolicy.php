<?php

namespace App\Policies;

use App\Models\MeetingMessage;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class MeetingMessagePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('meeting_message.view_any');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, MeetingMessage $meetingMessage): bool
    {
        return $user->hasPermissionTo('meeting_message.view');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('meeting_message.create');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, MeetingMessage $meetingMessage): bool
    {
        return $user->hasPermissionTo('meeting_message.update');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, MeetingMessage $meetingMessage): bool
    {
        return $user->hasPermissionTo('meeting_message.delete');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, MeetingMessage $meetingMessage): bool
    {
        return $user->hasPermissionTo('meeting_message.restore');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, MeetingMessage $meetingMessage): bool
    {
        return $user->hasPermissionTo('meeting_message.force_delete');
    }
}
