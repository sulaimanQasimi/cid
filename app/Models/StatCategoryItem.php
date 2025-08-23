<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Contracts\Activity;

class StatCategoryItem extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'stat_category_id',
        'parent_id',
        'name',
        'label',
        'color',
        'status',
        'order',
        'created_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
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
                'created' => 'آیتم آمار جدید ایجاد شد',
                'updated' => 'اطلاعات آیتم آمار بروزرسانی شد',
                'deleted' => 'آیتم آمار حذف شد',
                default => "عملیات {$eventName} روی آیتم آمار انجام شد"
            });
    }

    /**
     * Customize the activity before it gets saved.
     */
    public function tapActivity(Activity $activity, string $eventName)
    {
        $activity->description = match($eventName) {
            'created' => 'آیتم آمار جدید ایجاد شد',
            'updated' => 'اطلاعات آیتم آمار بروزرسانی شد',
            'deleted' => 'آیتم آمار حذف شد',
            default => "عملیات {$eventName} روی آیتم آمار انجام شد"
        };
    }

    /**
     * Get the category that owns this item.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(StatCategory::class, 'stat_category_id');
    }

    /**
     * Get the user who created this item.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the report stats for this item.
     */
    public function reportStats(): HasMany
    {
        return $this->hasMany(ReportStat::class);
    }

    /**
     * Get the parent item.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(StatCategoryItem::class, 'parent_id');
    }

    /**
     * Get the child items.
     */
    public function children(): HasMany
    {
        return $this->hasMany(StatCategoryItem::class, 'parent_id');
    }

    /**
     * Check if this item has any children.
     */
    public function hasChildren(): bool
    {
        return $this->children()->count() > 0;
    }
}
