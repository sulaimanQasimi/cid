<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use App\Models\Traits\HasVisitors;
use App\Services\PersianDateService;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Contracts\Activity;

/**
 * @property int $id
 * @property string $photo
 * @property string $number
 * @property string $name
 * @property string $father_name
 * @property string $grandfather_name
 * @property string $id_card_number
 * @property string $phone_number
 * @property string $original_residence
 * @property string $current_residence
 * @property string $crime_type
 * @property string $arrest_location
 * @property string $arrested_by
 * @property string $arrest_date
 * @property string $referred_to
 * @property string $final_verdict
 * @property string $notes
 * @property int $department_id
 * @property int $created_by
 * @property int $visits_count
 * @property int $unique_visitors_count
 * @property int $today_visits_count
 * @property int $this_week_visits_count
 * @property int $this_month_visits_count
 */
class Criminal extends Model
{
    use HasFactory, HasVisitors, LogsActivity;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'photo',
        'number',
        'name',
        'father_name',
        'grandfather_name',
        'id_card_number',
        'phone_number',
        'original_residence',
        'current_residence',
        'crime_type',
        'arrest_location',
        'arrested_by',
        'arrest_date',
        'referred_to',
        'final_verdict',
        'notes',
        'department_id',
        'created_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'arrest_date' => 'date',
    ];

    protected $appends = [
        'visits_count',
        'unique_visitors_count',
        'today_visits_count',
        'this_week_visits_count',
        'this_month_visits_count',
    ];

    /**
     * Get the arrest date in Persian format
     */
    public function getPersianArrestDateAttribute()
    {
        if (!$this->arrest_date) {
            return null;
        }
        
        // Ensure we have a Carbon instance
        $date = $this->arrest_date instanceof \Carbon\Carbon 
            ? $this->arrest_date 
            : \Carbon\Carbon::parse($this->arrest_date);
            
        return PersianDateService::fromCarbon($date);
    }

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
                'created' => 'مجرم جدید ایجاد شد',
                'updated' => 'اطلاعات مجرم بروزرسانی شد',
                'deleted' => 'مجرم حذف شد',
                default => "عملیات {$eventName} روی مجرم انجام شد"
            });
    }

    /**
     * Customize the activity before it gets saved.
     */
    public function tapActivity(Activity $activity, string $eventName)
    {
        $activity->description = match($eventName) {
            'created' => 'مجرم جدید ایجاد شد',
            'updated' => 'اطلاعات مجرم بروزرسانی شد',
            'deleted' => 'مجرم حذف شد',
            default => "عملیات {$eventName} روی مجرم انجام شد"
        };
    }

    /**
     * Get the department that the criminal belongs to.
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * Get the user who created the criminal record.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the reports for this criminal.
     */
    public function reports(): MorphMany
    {
        return $this->morphMany(Report::class, 'reportable');
    }

    /**
     * Get the access records for this criminal.
     */
    public function accesses(): HasMany
    {
        return $this->hasMany(CriminalAccess::class);
    }

    /**
     * Get the fingerprints for this criminal.
     */
    public function fingerprints(): HasMany
    {
        return $this->hasMany(CriminalFingerprint::class);
    }

    /**
     * Get the users who have access to this criminal.
     */
    public function accessibleUsers(): HasMany
    {
        return $this->hasMany(User::class, 'id', 'user_id')
            ->join('criminal_accesses', 'users.id', '=', 'criminal_accesses.user_id')
            ->where('criminal_accesses.criminal_id', $this->id);
    }

    /**
     * Check if a user has access to this criminal.
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
