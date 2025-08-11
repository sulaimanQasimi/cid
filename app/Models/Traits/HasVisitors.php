<?php

namespace App\Models\Traits;

use App\Models\Visitor;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait HasVisitors
{
    /**
     * Get all visitors for this model.
     */
    public function visitors(): MorphMany
    {
        return $this->morphMany(Visitor::class, 'visitable');
    }

    /**
     * Record a visit for this model.
     */
    public function recordVisit(array $data = []): Visitor
    {
        $defaultData = [
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'user_id' => auth()->id(),
            'session_id' => session()->getId(),
            'url' => request()->fullUrl(),
            'referrer' => request()->header('referer'),
            'method' => request()->method(),
            'visited_at' => now(),
        ];

        return $this->visitors()->create(array_merge($defaultData, $data));
    }

    /**
     * Get visits count for this model.
     */
    public function getVisitsCountAttribute(): int
    {
        return $this->visitors()->count();
    }

    /**
     * Get unique visitors count for this model.
     */
    public function getUniqueVisitorsCountAttribute(): int
    {
        return $this->visitors()->distinct('ip_address')->count('ip_address');
    }

    /**
     * Get today's visits count for this model.
     */
    public function getTodayVisitsCountAttribute(): int
    {
        return $this->visitors()->today()->count();
    }

    /**
     * Get this week's visits count for this model.
     */
    public function getThisWeekVisitsCountAttribute(): int
    {
        return $this->visitors()->thisWeek()->count();
    }

    /**
     * Get this month's visits count for this model.
     */
    public function getThisMonthVisitsCountAttribute(): int
    {
        return $this->visitors()->thisMonth()->count();
    }

    /**
     * Get recent visitors for this model.
     */
    public function getRecentVisitorsAttribute()
    {
        return $this->visitors()
            ->with('user')
            ->orderBy('visited_at', 'desc')
            ->limit(10)
            ->get();
    }

    /**
     * Get bounce rate for this model.
     */
    public function getBounceRateAttribute(): float
    {
        $totalVisits = $this->visitors()->count();
        if ($totalVisits === 0) {
            return 0.0;
        }

        $bounceVisits = $this->visitors()->bounces()->count();
        return round(($bounceVisits / $totalVisits) * 100, 2);
    }

    /**
     * Get average time spent on this model.
     */
    public function getAverageTimeSpentAttribute(): ?int
    {
        return $this->visitors()
            ->whereNotNull('duration_seconds')
            ->avg('duration_seconds');
    }

    /**
     * Get top referrers for this model.
     */
    public function getTopReferrersAttribute()
    {
        return $this->visitors()
            ->whereNotNull('referrer')
            ->selectRaw('referrer, COUNT(*) as count')
            ->groupBy('referrer')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get();
    }

    /**
     * Get device distribution for this model.
     */
    public function getDeviceDistributionAttribute()
    {
        return $this->visitors()
            ->whereNotNull('device_type')
            ->selectRaw('device_type, COUNT(*) as count')
            ->groupBy('device_type')
            ->orderBy('count', 'desc')
            ->get();
    }

    /**
     * Get browser distribution for this model.
     */
    public function getBrowserDistributionAttribute()
    {
        return $this->visitors()
            ->whereNotNull('browser')
            ->selectRaw('browser, COUNT(*) as count')
            ->groupBy('browser')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get();
    }

    /**
     * Get geographic distribution for this model.
     */
    public function getGeographicDistributionAttribute()
    {
        return $this->visitors()
            ->whereNotNull('country')
            ->selectRaw('country, COUNT(*) as count')
            ->groupBy('country')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get();
    }
}
