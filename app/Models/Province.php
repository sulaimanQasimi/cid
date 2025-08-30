<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Contracts\Activity;

class Province extends Model
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
        'governor',
        'capital',
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
                'created' => 'ولایت جدید ایجاد شد',
                'updated' => 'اطلاعات ولایت بروزرسانی شد',
                'deleted' => 'ولایت حذف شد',
                default => "عملیات {$eventName} روی ولایت انجام شد"
            });
    }

    /**
     * Customize the activity before it gets saved.
     */
    public function tapActivity(Activity $activity, string $eventName)
    {
        $activity->description = match($eventName) {
            'created' => 'ولایت جدید ایجاد شد',
            'updated' => 'اطلاعات ولایت بروزرسانی شد',
            'deleted' => 'ولایت حذف شد',
            default => "عملیات {$eventName} روی ولایت انجام شد"
        };
    }

    /**
     * Get the user that created the province.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the districts for the province.
     */
    public function districts(): HasMany
    {
        return $this->hasMany(District::class);
    }

    /**
     * Get the incidents for the province through districts.
     */
    public function incidents(): HasManyThrough
    {
        return $this->hasManyThrough(Incident::class, District::class);
    }
}
