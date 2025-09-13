<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Traits\HasVisitors;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Contracts\Activity;

class NationalInsightCenterInfoItem extends Model
{
    use HasFactory, HasVisitors, LogsActivity;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'national_insight_center_info_id',
        'title',
        'registration_number',
        'info_category_id',
        'department_id',
        'province_id',
        'district_id',
        'description',
        'date',
        'created_by',
        'confirmed',
        'confirmed_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date' => 'date',
        'confirmed' => 'boolean',
    ];

    protected $appends = [
        'visits_count',
        'unique_visitors_count',
        'today_visits_count',
        'this_week_visits_count',
        'this_month_visits_count',
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
                'created' => 'آیتم اطلاعات مرکز ملی بصیر جدید ثبت شد',
                'updated' => 'آیتم اطلاعات مرکز ملی بصیر بروزرسانی شد',
                'deleted' => 'آیتم اطلاعات مرکز ملی بصیر حذف شد',
                default => "عملیات {$eventName} روی آیتم اطلاعات مرکز ملی بصیر انجام شد"
            });
    }

    /**
     * Customize the activity before it gets saved.
     */
    public function tapActivity(Activity $activity, string $eventName)
    {
        $activity->description = match($eventName) {
            'created' => 'آیتم اطلاعات مرکز ملی بصیر جدید ثبت شد',
            'updated' => 'آیتم اطلاعات مرکز ملی بصیر بروزرسانی شد',
            'deleted' => 'آیتم اطلاعات مرکز ملی بصیر حذف شد',
            default => "عملیات {$eventName} روی آیتم اطلاعات مرکز ملی بصیر انجام شد"
        };
    }

    /**
     * Get the national insight center info that owns this item.
     */
    public function nationalInsightCenterInfo(): BelongsTo
    {
        return $this->belongsTo(NationalInsightCenterInfo::class);
    }

    /**
     * Get the info category that owns this item.
     */
    public function infoCategory(): BelongsTo
    {
        return $this->belongsTo(InfoCategory::class);
    }

    /**
     * Get the department that owns this item.
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * Get the province that owns this item.
     */
    public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class);
    }

    /**
     * Get the district that owns this item.
     */
    public function district(): BelongsTo
    {
        return $this->belongsTo(District::class);
    }

    /**
     * Get the user that created this item.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user that confirmed this item.
     */
    public function confirmer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'confirmed_by');
    }

    /**
     * Get the stats associated with this item.
     */
    public function infoStats(): HasMany
    {
        return $this->hasMany(InfoStat::class, 'national_insight_center_info_item_id');
    }

    /**
     * Get the item stats associated with this item.
     */
    public function itemStats(): HasMany
    {
        return $this->hasMany(NationalInsightCenterInfoItemStat::class);
    }
}
