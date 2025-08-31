<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Contracts\Activity;

class InfoStat extends Model
{
    use HasFactory, LogsActivity;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'info_type_id',
        'stat_category_item_id',
        'integer_value',
        'string_value',
        'notes',
        'created_by',
        'updated_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'integer_value' => 'integer',
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
                'created' => 'آمار جدید ثبت شد',
                'updated' => 'اطلاعات آمار بروزرسانی شد',
                'deleted' => 'آمار حذف شد',
                default => "عملیات {$eventName} روی آمار انجام شد"
            });
    }

    /**
     * Customize the activity before it gets saved.
     */
    public function tapActivity(Activity $activity, string $eventName)
    {
        $activity->description = match($eventName) {
            'created' => 'آمار جدید ثبت شد',
            'updated' => 'اطلاعات آمار بروزرسانی شد',
            'deleted' => 'آمار حذف شد',
            default => "عملیات {$eventName} روی آمار انجام شد"
        };
    }

    /**
     * Get the info type that owns this stat.
     */
    public function infoType(): BelongsTo
    {
        return $this->belongsTo(InfoType::class);
    }

    /**
     * Get the stat category item this stat belongs to.
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

    /**
     * Get the user that last updated this stat.
     */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Get the value, regardless of whether it's stored as integer or string.
     *
     * @return mixed
     */
    public function getValue()
    {
        return $this->integer_value !== null ? $this->integer_value : $this->string_value;
    }

    /**
     * Set the value based on its type.
     *
     * @param mixed $value
     * @return void
     */
    public function setValue($value): void
    {
        if (is_numeric($value) && is_int((int)$value)) {
            $this->integer_value = (int)$value;
            $this->string_value = null;
        } else {
            $this->string_value = (string)$value;
            $this->integer_value = null;
        }
    }
}
