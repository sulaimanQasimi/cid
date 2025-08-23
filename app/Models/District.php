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

class District extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'province_id',
        'code',
        'description',
        'status',
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
                'created' => 'ولسوالی جدید ایجاد شد',
                'updated' => 'اطلاعات ولسوالی بروزرسانی شد',
                'deleted' => 'ولسوالی حذف شد',
                default => "عملیات {$eventName} روی ولسوالی انجام شد"
            });
    }

    /**
     * Customize the activity before it gets saved.
     */
    public function tapActivity(Activity $activity, string $eventName)
    {
        $activity->description = match($eventName) {
            'created' => 'ولسوالی جدید ایجاد شد',
            'updated' => 'اطلاعات ولسوالی بروزرسانی شد',
            'deleted' => 'ولسوالی حذف شد',
            default => "عملیات {$eventName} روی ولسوالی انجام شد"
        };
    }

    /**
     * Get the user that created the district.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the province that owns the district.
     */
    public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class);
    }

    /**
     * Get the incidents for the district.
     */
    public function incidents(): HasMany
    {
        return $this->hasMany(Incident::class);
    }
}
