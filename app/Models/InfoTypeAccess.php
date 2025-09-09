<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class InfoTypeAccess extends Model
{
    use HasFactory, LogsActivity;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'info_type_id',
        'user_id',
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
                'created' => 'دسترسی جدید به نوع اطلاعات اعطا شد',
                'updated' => 'دسترسی نوع اطلاعات بروزرسانی شد',
                'deleted' => 'دسترسی نوع اطلاعات حذف شد',
                default => "عملیات {$eventName} روی دسترسی نوع اطلاعات انجام شد"
            });
    }

    /**
     * Get the info type that owns the access.
     */
    public function infoType(): BelongsTo
    {
        return $this->belongsTo(InfoType::class);
    }

    /**
     * Get the user that has access.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}