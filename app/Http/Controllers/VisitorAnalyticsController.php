<?php

namespace App\Http\Controllers;

use App\Models\Visitor;
use App\Models\Criminal;
use App\Models\Incident;
use App\Models\User;
use App\Models\Info;
use App\Services\VisitorTrackingService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class VisitorAnalyticsController extends Controller
{
    protected $trackingService;

    public function __construct(VisitorTrackingService $trackingService)
    {
        $this->trackingService = $trackingService;
    }

    /**
     * Display the main analytics dashboard.
     */
    public function index(Request $request)
    {
        $period = $request->get('period', 'month');
        $modelType = $request->get('model_type', 'all');

        // Get overall statistics
        $overallStats = $this->getOverallStats($period);
        
        // Get model-specific statistics
        $modelStats = $this->getModelStats($period, $modelType);
        
        // Get detailed analytics
        $detailedAnalytics = $this->getDetailedAnalytics($period);

        return Inertia::render('VisitorAnalytics/Index', [
            'overallStats' => $overallStats,
            'modelStats' => $modelStats,
            'detailedAnalytics' => $detailedAnalytics,
            'filters' => [
                'period' => $period,
                'modelType' => $modelType,
                'availablePeriods' => [
                    'today' => 'Today',
                    'week' => 'This Week',
                    'month' => 'This Month',
                    'year' => 'This Year',
                    'all' => 'All Time'
                ],
                'availableModels' => [
                    'all' => 'All Models',
                    'Criminal' => 'Criminals',
                    'Incident' => 'Incidents',
                    'User' => 'Users',
                    'Info' => 'Information',
                    'Page' => 'Pages'
                ]
            ]
        ]);
    }

    /**
     * Display analytics for a specific model.
     */
    public function show(Request $request, $modelType, $modelId = null)
    {
        $period = $request->get('period', 'month');
        
        // Get the model instance
        $model = $this->getModelInstance($modelType, $modelId);
        
        if (!$model) {
            abort(404, 'Model not found');
        }

        // Get model-specific analytics
        $analytics = $this->trackingService->getAnalytics($model, $period);
        
        // Get recent visitors
        $recentVisitors = $model->recent_visitors;
        
        // Get visitor timeline
        $timeline = $this->getVisitorTimeline($model, $period);

        return Inertia::render('VisitorAnalytics/Show', [
            'model' => [
                'type' => $modelType,
                'id' => $model->id ?? null,
                'name' => $this->getModelName($model),
                'url' => $this->getModelUrl($model)
            ],
            'analytics' => $analytics,
            'recentVisitors' => $recentVisitors,
            'timeline' => $timeline,
            'filters' => [
                'period' => $period,
                'availablePeriods' => [
                    'today' => 'Today',
                    'week' => 'This Week',
                    'month' => 'This Month',
                    'year' => 'This Year',
                    'all' => 'All Time'
                ]
            ]
        ]);
    }

    /**
     * Get overall statistics.
     */
    protected function getOverallStats(string $period): array
    {
        $query = Visitor::query();
        $this->applyPeriodFilter($query, $period);

        $visitors = $query->get();

        return [
            'total_visits' => $visitors->count(),
            'unique_visitors' => $visitors->unique('ip_address')->count(),
            'authenticated_visitors' => $visitors->whereNotNull('user_id')->count(),
            'anonymous_visitors' => $visitors->whereNull('user_id')->count(),
            'bounce_rate' => $this->calculateBounceRate($visitors),
            'average_time_spent' => $visitors->whereNotNull('duration_seconds')->avg('duration_seconds'),
            'total_pages' => $visitors->unique('url')->count(),
            'total_sessions' => $visitors->unique('session_id')->count(),
        ];
    }

    /**
     * Get model-specific statistics.
     */
    protected function getModelStats(string $period, string $modelType): array
    {
        $stats = [];

        if ($modelType === 'all' || $modelType === 'Criminal') {
            $stats['Criminal'] = $this->getModelTypeStats(Criminal::class, $period);
        }

        if ($modelType === 'all' || $modelType === 'Incident') {
            $stats['Incident'] = $this->getModelTypeStats(Incident::class, $period);
        }

        if ($modelType === 'all' || $modelType === 'User') {
            $stats['User'] = $this->getModelTypeStats(User::class, $period);
        }

        if ($modelType === 'all' || $modelType === 'Info') {
            $stats['Info'] = $this->getModelTypeStats(Info::class, $period);
        }

        if ($modelType === 'all' || $modelType === 'Page') {
            $stats['Page'] = $this->getPageStats($period);
        }

        return $stats;
    }

    /**
     * Get statistics for a specific model type.
     */
    protected function getModelTypeStats(string $modelClass, string $period): array
    {
        $query = $modelClass::query();
        $models = $query->get();

        $totalVisits = 0;
        $totalUniqueVisitors = 0;
        $totalBounces = 0;
        $totalTimeSpent = 0;
        $visitCount = 0;

        foreach ($models as $model) {
            if (method_exists($model, 'visitors')) {
                $visitors = $model->visitors();
                $this->applyPeriodFilter($visitors, $period);
                $modelVisitors = $visitors->get();

                $totalVisits += $modelVisitors->count();
                $totalUniqueVisitors += $modelVisitors->unique('ip_address')->count();
                $totalBounces += $modelVisitors->where('is_bounce', true)->count();
                $totalTimeSpent += $modelVisitors->whereNotNull('duration_seconds')->sum('duration_seconds');
                $visitCount += $modelVisitors->whereNotNull('duration_seconds')->count();
            }
        }

        return [
            'total_visits' => $totalVisits,
            'unique_visitors' => $totalUniqueVisitors,
            'bounce_rate' => $totalVisits > 0 ? round(($totalBounces / $totalVisits) * 100, 2) : 0,
            'average_time_spent' => $visitCount > 0 ? round($totalTimeSpent / $visitCount) : 0,
            'model_count' => $models->count(),
        ];
    }

    /**
     * Get page statistics.
     */
    protected function getPageStats(string $period): array
    {
        $query = Visitor::where('visitable_type', 'Page');
        $this->applyPeriodFilter($query, $period);
        $visitors = $query->get();

        return [
            'total_visits' => $visitors->count(),
            'unique_visitors' => $visitors->unique('ip_address')->count(),
            'bounce_rate' => $this->calculateBounceRate($visitors),
            'average_time_spent' => $visitors->whereNotNull('duration_seconds')->avg('duration_seconds'),
            'page_count' => $visitors->unique('visitable_id')->count(),
        ];
    }

    /**
     * Get detailed analytics.
     */
    protected function getDetailedAnalytics(string $period): array
    {
        $query = Visitor::query();
        $this->applyPeriodFilter($query, $period);
        $visitors = $query->get();

        return [
            'device_distribution' => $this->getDeviceDistribution($visitors),
            'browser_distribution' => $this->getBrowserDistribution($visitors),
            'geographic_distribution' => $this->getGeographicDistribution($visitors),
            'hourly_distribution' => $this->getHourlyDistribution($visitors),
            'daily_distribution' => $this->getDailyDistribution($visitors),
            'top_pages' => $this->getTopPages($visitors),
            'top_referrers' => $this->getTopReferrers($visitors),
        ];
    }

    /**
     * Get visitor timeline for a specific model.
     */
    protected function getVisitorTimeline($model, string $period): array
    {
        $query = $model->visitors();
        $this->applyPeriodFilter($query, $period);
        $visitors = $query->orderBy('visited_at', 'desc')->get();

        $timeline = [];
        foreach ($visitors as $visitor) {
            $timeline[] = [
                'id' => $visitor->id,
                'visited_at' => $visitor->visited_at->format('Y-m-d H:i:s'),
                'ip_address' => $visitor->ip_address,
                'device_type' => $visitor->device_type,
                'browser' => $visitor->browser,
                'location' => $visitor->location_formatted,
                'duration' => $visitor->duration_formatted,
                'is_bounce' => $visitor->is_bounce,
                'user' => $visitor->user ? [
                    'id' => $visitor->user->id,
                    'name' => $visitor->user->name,
                    'email' => $visitor->user->email,
                ] : null,
            ];
        }

        return $timeline;
    }

    /**
     * Apply period filter to query.
     */
    protected function applyPeriodFilter($query, string $period): void
    {
        switch ($period) {
            case 'today':
                $query->today();
                break;
            case 'week':
                $query->thisWeek();
                break;
            case 'month':
                $query->thisMonth();
                break;
            case 'year':
                $query->whereYear('visited_at', Carbon::now()->year);
                break;
            // 'all' doesn't apply any filter
        }
    }

    /**
     * Calculate bounce rate.
     */
    protected function calculateBounceRate($visitors): float
    {
        $total = $visitors->count();
        if ($total === 0) {
            return 0.0;
        }

        $bounces = $visitors->where('is_bounce', true)->count();
        return round(($bounces / $total) * 100, 2);
    }

    /**
     * Get device distribution.
     */
    protected function getDeviceDistribution($visitors): array
    {
        return $visitors->whereNotNull('device_type')
            ->groupBy('device_type')
            ->map(function ($group) {
                return [
                    'device_type' => $group->first()->device_type,
                    'count' => $group->count(),
                    'percentage' => round(($group->count() / $visitors->count()) * 100, 2)
                ];
            })
            ->values()
            ->toArray();
    }

    /**
     * Get browser distribution.
     */
    protected function getBrowserDistribution($visitors): array
    {
        return $visitors->whereNotNull('browser')
            ->groupBy('browser')
            ->map(function ($group) use ($visitors) {
                return [
                    'browser' => $group->first()->browser,
                    'count' => $group->count(),
                    'percentage' => round(($group->count() / $visitors->count()) * 100, 2)
                ];
            })
            ->sortByDesc('count')
            ->take(10)
            ->values()
            ->toArray();
    }

    /**
     * Get geographic distribution.
     */
    protected function getGeographicDistribution($visitors): array
    {
        return $visitors->whereNotNull('country')
            ->groupBy('country')
            ->map(function ($group) use ($visitors) {
                return [
                    'country' => $group->first()->country,
                    'count' => $group->count(),
                    'percentage' => round(($group->count() / $visitors->count()) * 100, 2)
                ];
            })
            ->sortByDesc('count')
            ->take(10)
            ->values()
            ->toArray();
    }

    /**
     * Get hourly distribution.
     */
    protected function getHourlyDistribution($visitors): array
    {
        $hourlyData = [];
        for ($i = 0; $i < 24; $i++) {
            $hourlyData[$i] = 0;
        }

        foreach ($visitors as $visitor) {
            $hour = $visitor->visited_at->hour;
            $hourlyData[$hour]++;
        }

        return collect($hourlyData)->map(function ($count, $hour) {
            return [
                'hour' => $hour,
                'count' => $count,
                'label' => sprintf('%02d:00', $hour)
            ];
        })->values()->toArray();
    }

    /**
     * Get daily distribution.
     */
    protected function getDailyDistribution($visitors): array
    {
        $dailyData = [];
        $startDate = Carbon::now()->subDays(30);
        
        for ($i = 0; $i < 30; $i++) {
            $date = $startDate->copy()->addDays($i);
            $dailyData[$date->format('Y-m-d')] = 0;
        }

        foreach ($visitors as $visitor) {
            $date = $visitor->visited_at->format('Y-m-d');
            if (isset($dailyData[$date])) {
                $dailyData[$date]++;
            }
        }

        return collect($dailyData)->map(function ($count, $date) {
            return [
                'date' => $date,
                'count' => $count,
                'label' => Carbon::parse($date)->format('M d')
            ];
        })->values()->toArray();
    }

    /**
     * Get top pages.
     */
    protected function getTopPages($visitors): array
    {
        return $visitors->whereNotNull('url')
            ->groupBy('url')
            ->map(function ($group) use ($visitors) {
                return [
                    'url' => $group->first()->url,
                    'count' => $group->count(),
                    'percentage' => round(($group->count() / $visitors->count()) * 100, 2)
                ];
            })
            ->sortByDesc('count')
            ->take(10)
            ->values()
            ->toArray();
    }

    /**
     * Get top referrers.
     */
    protected function getTopReferrers($visitors): array
    {
        return $visitors->whereNotNull('referrer')
            ->groupBy('referrer')
            ->map(function ($group) use ($visitors) {
                return [
                    'referrer' => $group->first()->referrer,
                    'count' => $group->count(),
                    'percentage' => round(($group->count() / $visitors->count()) * 100, 2)
                ];
            })
            ->sortByDesc('count')
            ->take(10)
            ->values()
            ->toArray();
    }

    /**
     * Get model instance.
     */
    protected function getModelInstance(string $modelType, $modelId = null)
    {
        if ($modelType === 'Page') {
            return (object) [
                'id' => $modelId,
                'visitable_type' => 'Page',
                'visitable_id' => $modelId
            ];
        }

        $modelClass = "App\\Models\\{$modelType}";
        
        if (!class_exists($modelClass)) {
            return null;
        }

        if ($modelId) {
            return $modelClass::find($modelId);
        }

        return new $modelClass();
    }

    /**
     * Get model name.
     */
    protected function getModelName($model): string
    {
        if (isset($model->name)) {
            return $model->name;
        }

        if (isset($model->title)) {
            return $model->title;
        }

        if (isset($model->id)) {
            return "ID: {$model->id}";
        }

        return 'Unknown';
    }

    /**
     * Get model URL.
     */
    protected function getModelUrl($model): string
    {
        if (isset($model->url)) {
            return $model->url;
        }

        if (isset($model->id)) {
            $modelType = class_basename($model);
            return route(strtolower($modelType) . '.show', $model->id);
        }

        return '#';
    }
}
