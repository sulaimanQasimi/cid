<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Contracts\Activity;

class IncidentCategory extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'code',
        'description',
        'color',
        'severity_level',
        'status',
        'created_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'severity_level' => 'integer',
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
                'created' => 'دسته‌بندی حادثه جدید ایجاد شد',
                'updated' => 'اطلاعات دسته‌بندی حادثه بروزرسانی شد',
                'deleted' => 'دسته‌بندی حادثه حذف شد',
                default => "عملیات {$eventName} روی دسته‌بندی حادثه انجام شد"
            });
    }

    /**
     * Customize the activity before it gets saved.
     */
    public function tapActivity(Activity $activity, string $eventName)
    {
        $activity->description = match($eventName) {
            'created' => 'دسته‌بندی حادثه جدید ایجاد شد',
            'updated' => 'اطلاعات دسته‌بندی حادثه بروزرسانی شد',
            'deleted' => 'دسته‌بندی حادثه حذف شد',
            default => "عملیات {$eventName} روی دسته‌بندی حادثه انجام شد"
        };
    }

    /**
     * Get the user that created the category.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the incidents in this category.
     */
    public function incidents(): HasMany
    {
        return $this->hasMany(Incident::class, 'incident_category_id');
    }
}
