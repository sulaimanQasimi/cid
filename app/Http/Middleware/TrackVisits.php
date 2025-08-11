<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Services\VisitorTrackingService;
use Symfony\Component\HttpFoundation\Response;

class TrackVisits
{
    protected $trackingService;

    public function __construct(VisitorTrackingService $trackingService)
    {
        $this->trackingService = $trackingService;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Only track GET requests to avoid tracking form submissions, API calls, etc.
        if ($request->isMethod('GET') && !$request->isXmlHttpRequest()) {
            $this->trackVisit($request);
        }

        return $response;
    }

    /**
     * Track the visit if the route has a visitable model.
     */
    protected function trackVisit(Request $request): void
    {
        try {
            // Get the route parameters
            $route = $request->route();
            if (!$route) {
                return;
            }

            $parameters = $route->parameters();
            
            // Look for visitable models in route parameters
            foreach ($parameters as $parameter) {
                if (is_object($parameter) && method_exists($parameter, 'visitors')) {
                    // This is a visitable model, track the visit
                    $this->trackingService->trackVisit($parameter);
                    break; // Only track the first visitable model found
                }
            }

            // Also track visits to specific pages if needed
            $this->trackPageVisit($request);

        } catch (\Exception $e) {
            // Log the error but don't break the request
            \Log::warning('Failed to track visit: ' . $e->getMessage(), [
                'url' => $request->fullUrl(),
                'ip' => $request->ip(),
            ]);
        }
    }

    /**
     * Track visits to specific pages or routes.
     */
    protected function trackPageVisit(Request $request): void
    {
        $routeName = $request->route()->getName();
        $path = $request->path();

        // Define which pages to track
        $trackablePages = [
            'dashboard' => 'Dashboard',
            'criminals.index' => 'Criminals List',
            'incidents.index' => 'Incidents List',
            'reports.index' => 'Reports List',
            'users.index' => 'Users List',
        ];

        // Check if current route should be tracked
        if (isset($trackablePages[$routeName])) {
            $this->trackingService->trackVisit((object) [
                'visitable_type' => 'Page',
                'visitable_id' => $routeName,
            ], [
                'url' => $request->fullUrl(),
                'metadata' => [
                    'page_name' => $trackablePages[$routeName],
                    'route_name' => $routeName,
                ],
            ]);
        }
    }
}
