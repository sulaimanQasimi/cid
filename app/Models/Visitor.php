<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Carbon\Carbon;

class Visitor extends Model
{
    protected $fillable = [
        'ip_address',
        'user_agent',
        'country',
        'city',
        'region',
        'latitude',
        'longitude',
        'user_id',
        'session_id',
        'url',
        'referrer',
        'method',
        'visitable_type',
        'visitable_id',
        'visited_at',
        'duration_seconds',
        'device_type',
        'browser',
        'browser_version',
        'platform',
        'platform_version',
        'is_bounce',
        'metadata',
    ];

    protected $casts = [
        'visited_at' => 'datetime',
        'is_bounce' => 'boolean',
        'metadata' => 'array',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    protected $dates = [
        'visited_at',
        'created_at',
        'updated_at',
    ];

    /**
     * Get the user that owns the visit.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the parent visitable model.
     */
    public function visitable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Scope a query to only include visits from today.
     */
    public function scopeToday($query)
    {
        return $query->whereDate('visited_at', Carbon::today());
    }

    /**
     * Scope a query to only include visits from this week.
     */
    public function scopeThisWeek($query)
    {
        return $query->whereBetween('visited_at', [
            Carbon::now()->startOfWeek(),
            Carbon::now()->endOfWeek()
        ]);
    }

    /**
     * Scope a query to only include visits from this month.
     */
    public function scopeThisMonth($query)
    {
        return $query->whereMonth('visited_at', Carbon::now()->month)
                    ->whereYear('visited_at', Carbon::now()->year);
    }

    /**
     * Scope a query to only include visits from a specific IP address.
     */
    public function scopeFromIp($query, $ip)
    {
        return $query->where('ip_address', $ip);
    }

    /**
     * Scope a query to only include visits from authenticated users.
     */
    public function scopeAuthenticated($query)
    {
        return $query->whereNotNull('user_id');
    }

    /**
     * Scope a query to only include visits from anonymous users.
     */
    public function scopeAnonymous($query)
    {
        return $query->whereNull('user_id');
    }

    /**
     * Scope a query to only include bounce visits.
     */
    public function scopeBounces($query)
    {
        return $query->where('is_bounce', true);
    }

    /**
     * Get the duration in a human-readable format.
     */
    public function getDurationFormattedAttribute(): string
    {
        if (!$this->duration_seconds) {
            return 'Unknown';
        }

        $hours = floor($this->duration_seconds / 3600);
        $minutes = floor(($this->duration_seconds % 3600) / 60);
        $seconds = $this->duration_seconds % 60;

        if ($hours > 0) {
            return sprintf('%dh %dm %ds', $hours, $minutes, $seconds);
        } elseif ($minutes > 0) {
            return sprintf('%dm %ds', $minutes, $seconds);
        } else {
            return sprintf('%ds', $seconds);
        }
    }

    /**
     * Get the location as a formatted string.
     */
    public function getLocationFormattedAttribute(): string
    {
        $parts = array_filter([$this->city, $this->region, $this->country]);
        return $parts ? implode(', ', $parts) : 'Unknown';
    }

    /**
     * Get the device information as a formatted string.
     */
    public function getDeviceFormattedAttribute(): string
    {
        $parts = array_filter([$this->device_type, $this->platform, $this->browser]);
        return $parts ? implode(' - ', $parts) : 'Unknown';
    }

    /**
     * Check if the visit is from a mobile device.
     */
    public function getIsMobileAttribute(): bool
    {
        return $this->device_type === 'mobile';
    }

    /**
     * Check if the visit is from a desktop device.
     */
    public function getIsDesktopAttribute(): bool
    {
        return $this->device_type === 'desktop';
    }

    /**
     * Check if the visit is from a tablet device.
     */
    public function getIsTabletAttribute(): bool
    {
        return $this->device_type === 'tablet';
    }

    /**
     * Get the time ago since the visit.
     */
    public function getTimeAgoAttribute(): string
    {
        return $this->visited_at->diffForHumans();
    }

    /**
     * Boot the model and add any global scopes.
     */
    protected static function boot()
    {
        parent::boot();

        // Set visited_at to current time if not provided
        static::creating(function ($visitor) {
            if (!$visitor->visited_at) {
                $visitor->visited_at = now();
            }
        });
    }
}
