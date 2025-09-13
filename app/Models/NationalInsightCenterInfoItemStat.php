<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Contracts\Activity;

class NationalInsightCenterInfoItemStat extends Model
{
    use HasFactory, LogsActivity;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'national_insight_center_info_item_id',
        'stat_category_item_id',
        'string_value',
        'notes',
        'created_by',
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
                'created' => 'آمار آیتم اطلاعات مرکز ملی بصیر جدید ثبت شد',
                'updated' => 'آمار آیتم اطلاعات مرکز ملی بصیر بروزرسانی شد',
                'deleted' => 'آمار آیتم اطلاعات مرکز ملی بصیر حذف شد',
                default => "عملیات {$eventName} روی آمار آیتم اطلاعات مرکز ملی بصیر انجام شد"
            });
    }

    /**
     * Customize the activity before it gets saved.
     */
    public function tapActivity(Activity $activity, string $eventName)
    {
        $activity->description = match($eventName) {
            'created' => 'آمار آیتم اطلاعات مرکز ملی بصیر جدید ثبت شد',
            'updated' => 'آمار آیتم اطلاعات مرکز ملی بصیر بروزرسانی شد',
            'deleted' => 'آمار آیتم اطلاعات مرکز ملی بصیر حذف شد',
            default => "عملیات {$eventName} روی آمار آیتم اطلاعات مرکز ملی بصیر انجام شد"
        };
    }

    /**
     * Get the national insight center info item that owns this stat.
     */
    public function nationalInsightCenterInfoItem(): BelongsTo
    {
        return $this->belongsTo(NationalInsightCenterInfoItem::class);
    }

    /**
     * Get the stat category item that owns this stat.
     */
    public function statCategoryItem(): BelongsTo
    {
        return $this->belongsTo(StatCategoryItem::class);
    }

    /**
     * Get the user that created this stat.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}