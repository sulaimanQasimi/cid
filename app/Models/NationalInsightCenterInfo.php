<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Contracts\Activity;

class NationalInsightCenterInfo extends Model
{
    use HasFactory, LogsActivity;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'code',
        'description',
        'created_by',
        'updated_by',
        'confirmed',
        'confirmed_by',
        'confirmed_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'confirmed' => 'boolean',
        'confirmed_at' => 'datetime',
    ];

    /**
     * Get the activity log options for the model.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->setDescriptionForEvent(fn(string $eventName) => match($eventName) {
                'created' => 'اطلاعات مرکز بینش ملی جدید ایجاد شد',
                'updated' => 'اطلاعات مرکز بینش ملی بروزرسانی شد',
                'deleted' => 'اطلاعات مرکز بینش ملی حذف شد',
                'confirmed' => 'اطلاعات مرکز بینش ملی تأیید شد',
                default => "عملیات {$eventName} روی اطلاعات مرکز بینش ملی انجام شد"
            });
    }

    /**
     * Customize the activity before it gets saved.
     */
    public function tapActivity(Activity $activity, string $eventName)
    {
        $activity->description = match($eventName) {
            'created' => 'اطلاعات مرکز بینش ملی جدید ایجاد شد',
            'updated' => 'اطلاعات مرکز بینش ملی بروزرسانی شد',
            'deleted' => 'اطلاعات مرکز بینش ملی حذف شد',
            'confirmed' => 'اطلاعات مرکز بینش ملی تأیید شد',
            default => "عملیات {$eventName} روی اطلاعات مرکز بینش ملی انجام شد"
        };
    }

    /**
     * Get the info items associated with the national insight center info.
     */
    public function infoItems(): HasMany
    {
        return $this->hasMany(NationalInsightCenterInfoItem::class);
    }

    /**
     * Get the stats associated with the national insight center info.
     */
    public function infoStats(): HasMany
    {
        return $this->hasMany(InfoStat::class, 'national_insight_center_info_id');
    }

    /**
     * Get the user that created this national insight center info.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user that last updated this national insight center info.
     */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Get the user that confirmed this national insight center info.
     */
    public function confirmer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'confirmed_by');
    }

    /**
     * Get the access permissions for this national insight center info.
     */
    public function accesses(): HasMany
    {
        return $this->hasMany(NationalInsightCenterInfoAccess::class);
    }

    /**
     * Get the users who have access to this national insight center info.
     */
    public function accessibleUsers(): HasMany
    {
        return $this->hasMany(User::class, 'id', 'user_id')
            ->join('national_insight_center_info_accesses', 'users.id', '=', 'national_insight_center_info_accesses.user_id')
            ->where('national_insight_center_info_accesses.national_insight_center_info_id', $this->id);
    }

    /**
     * Check if a user has access to this national insight center info.
     */
    public function hasAccess(User $user): bool
    {
        // Creator always has access
        if ($this->created_by === $user->id) {
            return true;
        }

        // Check if user has explicit access
        return $this->accesses()->where('user_id', $user->id)->exists();
    }
}
