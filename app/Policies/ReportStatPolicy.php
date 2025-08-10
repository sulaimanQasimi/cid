<?php

namespace App\Policies;

use App\Models\ReportStat;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ReportStatPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('report_stat.view_any');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ReportStat $reportStat): bool
    {
        return $user->hasPermissionTo('report_stat.view');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('report_stat.create');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ReportStat $reportStat): bool
    {
        return $user->hasPermissionTo('report_stat.update');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ReportStat $reportStat): bool
    {
        return $user->hasPermissionTo('report_stat.delete');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ReportStat $reportStat): bool
    {
        return $user->hasPermissionTo('report_stat.restore');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ReportStat $reportStat): bool
    {
        return $user->hasPermissionTo('report_stat.force_delete');
    }
}
