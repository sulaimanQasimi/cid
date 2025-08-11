<?php

namespace App\Services;

use App\Models\Visitor;
use Jenssegers\Agent\Agent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class VisitorTrackingService
{
    protected $agent;
    protected $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
        $this->agent = new Agent();
        $this->agent->setUserAgent($request->userAgent());
    }

    /**
     * Track a visit for a specific model.
     */
    public function trackVisit($visitable, array $additionalData = []): Visitor
    {
        $data = array_merge($this->getBasicData(), $additionalData);
        
        return $visitable->recordVisit($data);
    }

    /**
     * Get basic visitor data from the current request.
     */
    protected function getBasicData(): array
    {
        return [
            'ip_address' => $this->getClientIp(),
            'user_agent' => $this->request->userAgent(),
            'user_id' => auth()->id(),
            'session_id' => session()->getId(),
            'url' => $this->request->fullUrl(),
            'referrer' => $this->request->header('referer'),
            'method' => $this->request->method(),
            'device_type' => $this->getDeviceType(),
            'browser' => $this->agent->browser(),
            'browser_version' => $this->agent->version($this->agent->browser()),
            'platform' => $this->agent->platform(),
            'platform_version' => $this->agent->version($this->agent->platform()),
            'metadata' => $this->getMetadata(),
        ];
    }

    /**
     * Get the client's real IP address.
     */
    protected function getClientIp(): string
    {
        $ip = $this->request->header('CF-Connecting-IP'); // Cloudflare
        if (!$ip) {
            $ip = $this->request->header('X-Forwarded-For'); // Proxy
        }
        if (!$ip) {
            $ip = $this->request->header('X-Real-IP'); // Nginx
        }
        if (!$ip) {
            $ip = $this->request->ip(); // Laravel default
        }

        // Handle multiple IPs in X-Forwarded-For
        if (strpos($ip, ',') !== false) {
            $ips = explode(',', $ip);
            $ip = trim($ips[0]);
        }

        return $ip;
    }

    /**
     * Get device type based on user agent.
     */
    protected function getDeviceType(): string
    {
        if ($this->agent->isTablet()) {
            return 'tablet';
        } elseif ($this->agent->isMobile()) {
            return 'mobile';
        } else {
            return 'desktop';
        }
    }

    /**
     * Get additional metadata about the visit.
     */
    protected function getMetadata(): array
    {
        return [
            'language' => $this->request->getPreferredLanguage(),
            'accept_language' => $this->request->header('Accept-Language'),
            'accept_encoding' => $this->request->header('Accept-Encoding'),
            'connection' => $this->request->header('Connection'),
            'host' => $this->request->header('Host'),
            'user_agent_parsed' => [
                'is_robot' => $this->agent->isRobot(),
                'is_phone' => $this->agent->isPhone(),
                'is_desktop' => $this->agent->isDesktop(),
                'is_tablet' => $this->agent->isTablet(),
                'device' => $this->agent->device(),
                'languages' => $this->agent->languages(),
            ],
        ];
    }

    /**
     * Get geolocation data for an IP address.
     */
    public function getGeolocation(string $ip): array
    {
        // Skip local IPs
        if ($this->isLocalIp($ip)) {
            return [
                'country' => null,
                'city' => null,
                'region' => null,
                'latitude' => null,
                'longitude' => null,
            ];
        }

        try {
            // You can use different geolocation services
            // For this example, we'll use a free service
            $response = Http::timeout(5)->get("http://ip-api.com/json/{$ip}");
            
            if ($response->successful()) {
                $data = $response->json();
                
                if ($data['status'] === 'success') {
                    return [
                        'country' => $data['country'] ?? null,
                        'city' => $data['city'] ?? null,
                        'region' => $data['regionName'] ?? null,
                        'latitude' => $data['lat'] ?? null,
                        'longitude' => $data['lon'] ?? null,
                    ];
                }
            }
        } catch (\Exception $e) {
            // Log the error if needed
            \Log::warning('Failed to get geolocation for IP: ' . $ip, [
                'error' => $e->getMessage()
            ]);
        }

        return [
            'country' => null,
            'city' => null,
            'region' => null,
            'latitude' => null,
            'longitude' => null,
        ];
    }

    /**
     * Check if an IP address is local.
     */
    protected function isLocalIp(string $ip): bool
    {
        return in_array($ip, ['127.0.0.1', '::1']) || 
               strpos($ip, '192.168.') === 0 || 
               strpos($ip, '10.') === 0 || 
               strpos($ip, '172.') === 0;
    }

    /**
     * Update visit duration for a specific visitor.
     */
    public function updateDuration(Visitor $visitor, int $durationSeconds): bool
    {
        return $visitor->update(['duration_seconds' => $durationSeconds]);
    }

    /**
     * Mark a visit as a bounce.
     */
    public function markAsBounce(Visitor $visitor): bool
    {
        return $visitor->update(['is_bounce' => true]);
    }

    /**
     * Get analytics data for a specific model.
     */
    public function getAnalytics($visitable, string $period = 'month'): array
    {
        $query = $visitable->visitors();

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
        }

        $visitors = $query->get();

        return [
            'total_visits' => $visitors->count(),
            'unique_visitors' => $visitors->unique('ip_address')->count(),
            'authenticated_visitors' => $visitors->whereNotNull('user_id')->count(),
            'anonymous_visitors' => $visitors->whereNull('user_id')->count(),
            'bounce_rate' => $this->calculateBounceRate($visitors),
            'average_time_spent' => $visitors->whereNotNull('duration_seconds')->avg('duration_seconds'),
            'device_distribution' => $this->getDeviceDistribution($visitors),
            'browser_distribution' => $this->getBrowserDistribution($visitors),
            'geographic_distribution' => $this->getGeographicDistribution($visitors),
        ];
    }

    /**
     * Calculate bounce rate from a collection of visitors.
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
     * Get device distribution from visitors.
     */
    protected function getDeviceDistribution($visitors): array
    {
        return $visitors->groupBy('device_type')
            ->map(function ($group) {
                return $group->count();
            })
            ->toArray();
    }

    /**
     * Get browser distribution from visitors.
     */
    protected function getBrowserDistribution($visitors): array
    {
        return $visitors->whereNotNull('browser')
            ->groupBy('browser')
            ->map(function ($group) {
                return $group->count();
            })
            ->sortDesc()
            ->take(10)
            ->toArray();
    }

    /**
     * Get geographic distribution from visitors.
     */
    protected function getGeographicDistribution($visitors): array
    {
        return $visitors->whereNotNull('country')
            ->groupBy('country')
            ->map(function ($group) {
                return $group->count();
            })
            ->sortDesc()
            ->take(10)
            ->toArray();
    }
}
