<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Services\PersianDateService;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Contracts\Activity;

class IncidentReport extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'report_number',
        'details',
        'action_taken',
        'recommendation',
        'security_level',
        'report_date',
        'report_status',
        'source',
        'attachments',
        'submitted_by',
        'approved_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'report_date' => 'date',
        'attachments' => 'array',
    ];

    /**
     * Get the report date in Persian format
     */
    public function getPersianReportDateAttribute()
    {
        if (!$this->report_date) {
            return null;
        }
        
        // Ensure we have a Carbon instance
        $date = $this->report_date instanceof \Carbon\Carbon 
            ? $this->report_date 
            : \Carbon\Carbon::parse($this->report_date);
            
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
                'created' => 'گزارش حادثه جدید ایجاد شد',
                'updated' => 'اطلاعات گزارش حادثه بروزرسانی شد',
                'deleted' => 'گزارش حادثه حذف شد',
                default => "عملیات {$eventName} روی گزارش حادثه انجام شد"
            });
    }

    /**
     * Customize the activity before it gets saved.
     */
    public function tapActivity(Activity $activity, string $eventName)
    {
        $activity->description = match($eventName) {
            'created' => 'گزارش حادثه جدید ایجاد شد',
            'updated' => 'اطلاعات گزارش حادثه بروزرسانی شد',
            'deleted' => 'گزارش حادثه حذف شد',
            default => "عملیات {$eventName} روی گزارش حادثه انجام شد"
        };
    }

    /**
     * Get the incidents belonging to this report.
     */
    public function incidents(): HasMany
    {
        return $this->hasMany(Incident::class);
    }

    /**
     * Get the user that submitted the report.
     */
    public function submitter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }

    /**
     * Get the user that approved the report.
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Get the statistical data for this report.
     */
    public function reportStats(): HasMany
    {
        return $this->hasMany(ReportStat::class);
    }
}
