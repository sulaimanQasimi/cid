# CID System - Visitor Tracking Documentation

## Overview

The CID system includes a comprehensive visitor tracking system that allows you to track visits to any model or page with detailed analytics.

## Features

- **Morphable Relationships**: Track visits to any model using polymorphic relationships
- **IP Address Tracking**: Store and analyze visitor IP addresses
- **Geolocation**: Automatic geolocation detection for IP addresses
- **Device Detection**: Detect device type, browser, platform, and version
- **User Agent Parsing**: Detailed user agent analysis
- **Session Tracking**: Track user sessions across visits
- **Duration Tracking**: Track time spent on pages/models
- **Bounce Rate Analysis**: Identify single-page visits
- **Analytics**: Built-in analytics and reporting methods
- **Middleware Integration**: Automatic tracking via middleware
- **Service Layer**: Clean service architecture for tracking logic

## Installation

The visitor tracking system is already integrated into the CID system. No additional installation is required.

### Dependencies

The system uses `jenssegers/agent` for user agent parsing, which is already included in the project dependencies.

## Usage

### Making Models Visitable

To make any model trackable, use the `HasVisitors` trait:

```php
<?php

namespace App\Models;

use App\Models\Traits\HasVisitors;
use Illuminate\Database\Eloquent\Model;

class Criminal extends Model
{
    use HasVisitors;
    
    // ... your model code
}
```

### Manual Tracking

Track visits manually using the service:

```php
use App\Services\VisitorTrackingService;

class CriminalController extends Controller
{
    public function show(Criminal $criminal, VisitorTrackingService $trackingService)
    {
        // Track the visit
        $trackingService->trackVisit($criminal);
        
        return Inertia::render('Criminal/Show', [
            'criminal' => $criminal
        ]);
    }
}
```

### Using the Trait Methods

Once a model uses the `HasVisitors` trait, you can use these methods:

```php
$criminal = Criminal::find(1);

// Record a visit
$criminal->recordVisit([
    'duration_seconds' => 300,
    'is_bounce' => false,
]);

// Get visit statistics
$criminal->visits_count; // Total visits
$criminal->unique_visitors_count; // Unique visitors
$criminal->today_visits_count; // Today's visits
$criminal->this_week_visits_count; // This week's visits
$criminal->this_month_visits_count; // This month's visits
$criminal->bounce_rate; // Bounce rate percentage
$criminal->average_time_spent; // Average time spent

// Get recent visitors
$recentVisitors = $criminal->recent_visitors;

// Get analytics data
$topReferrers = $criminal->top_referrers;
$deviceDistribution = $criminal->device_distribution;
$browserDistribution = $criminal->browser_distribution;
$geographicDistribution = $criminal->geographic_distribution;
```

### Using the Service for Analytics

```php
use App\Services\VisitorTrackingService;

class AnalyticsController extends Controller
{
    public function index(VisitorTrackingService $trackingService)
    {
        $criminal = Criminal::find(1);
        
        // Get analytics for different periods
        $todayAnalytics = $trackingService->getAnalytics($criminal, 'today');
        $weekAnalytics = $trackingService->getAnalytics($criminal, 'week');
        $monthAnalytics = $trackingService->getAnalytics($criminal, 'month');
        
        return Inertia::render('Analytics/Index', [
            'todayAnalytics' => $todayAnalytics,
            'weekAnalytics' => $weekAnalytics,
            'monthAnalytics' => $monthAnalytics,
        ]);
    }
}
```

## Database Schema

### Visitors Table

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| ip_address | varchar(45) | IPv6 compatible IP address |
| user_agent | text | Full user agent string |
| country | varchar(255) | Country from geolocation |
| city | varchar(255) | City from geolocation |
| region | varchar(255) | Region/State from geolocation |
| latitude | decimal(10,8) | Latitude coordinate |
| longitude | decimal(11,8) | Longitude coordinate |
| user_id | bigint | Foreign key to users (nullable) |
| session_id | varchar(255) | Session identifier |
| url | text | Full URL visited |
| referrer | text | Referrer URL |
| method | varchar(10) | HTTP method |
| visitable_type | varchar(255) | Polymorphic model type |
| visitable_id | bigint | Polymorphic model ID |
| visited_at | timestamp | When the visit occurred |
| duration_seconds | integer | Time spent on page |
| device_type | varchar(255) | mobile/desktop/tablet |
| browser | varchar(255) | Browser name |
| browser_version | varchar(255) | Browser version |
| platform | varchar(255) | Operating system |
| platform_version | varchar(255) | OS version |
| is_bounce | boolean | Single page visit |
| metadata | json | Additional data |
| created_at | timestamp | Record creation time |
| updated_at | timestamp | Record update time |

## Model Relationships

### Visitor Model

```php
// Belongs to a user (optional)
$visitor->user;

// Polymorphic relationship to the visited model
$visitor->visitable; // Returns the model that was visited
```

### Visitable Models

```php
// Has many visitors
$model->visitors; // Returns collection of Visitor models
```

## Query Scopes

The Visitor model includes several useful query scopes:

```php
// Time-based scopes
Visitor::today()->get();
Visitor::thisWeek()->get();
Visitor::thisMonth()->get();

// IP-based scope
Visitor::fromIp('192.168.1.1')->get();

// User-based scopes
Visitor::authenticated()->get(); // Only authenticated users
Visitor::anonymous()->get(); // Only anonymous users

// Bounce scope
Visitor::bounces()->get(); // Only bounce visits
```

## Accessor Methods

The Visitor model includes several accessor methods for formatted data:

```php
$visitor = Visitor::first();

$visitor->duration_formatted; // "2m 30s"
$visitor->location_formatted; // "Kabul, Kabul, Afghanistan"
$visitor->device_formatted; // "mobile - iOS - Safari"
$visitor->time_ago; // "2 hours ago"
$visitor->is_mobile; // true/false
$visitor->is_desktop; // true/false
$visitor->is_tablet; // true/false
```

## Geolocation

The system includes automatic geolocation detection using the IP-API service:

```php
use App\Services\VisitorTrackingService;

$trackingService = new VisitorTrackingService(request());
$location = $trackingService->getGeolocation('8.8.8.8');

// Returns:
// [
//     'country' => 'United States',
//     'city' => 'Mountain View',
//     'region' => 'California',
//     'latitude' => 37.4056,
//     'longitude' => -122.0775,
// ]
```

## Analytics Examples

### Dashboard Analytics

```php
class DashboardController extends Controller
{
    public function index(VisitorTrackingService $trackingService)
    {
        // Overall analytics
        $overallStats = [
            'total_visits' => Visitor::count(),
            'unique_visitors' => Visitor::distinct('ip_address')->count('ip_address'),
            'today_visits' => Visitor::today()->count(),
            'this_week_visits' => Visitor::thisWeek()->count(),
            'this_month_visits' => Visitor::thisMonth()->count(),
        ];

        // Device distribution
        $deviceStats = Visitor::selectRaw('device_type, COUNT(*) as count')
            ->groupBy('device_type')
            ->orderBy('count', 'desc')
            ->get();

        // Geographic distribution
        $geoStats = Visitor::whereNotNull('country')
            ->selectRaw('country, COUNT(*) as count')
            ->groupBy('country')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get();

        return Inertia::render('Dashboard', [
            'overallStats' => $overallStats,
            'deviceStats' => $deviceStats,
            'geoStats' => $geoStats,
        ]);
    }
}
```

### Model-Specific Analytics

```php
class CriminalAnalyticsController extends Controller
{
    public function show(Criminal $criminal, VisitorTrackingService $trackingService)
    {
        $analytics = $trackingService->getAnalytics($criminal, 'month');
        
        return Inertia::render('Criminals/Analytics', [
            'criminal' => $criminal,
            'analytics' => $analytics,
        ]);
    }
}
```

## Frontend Integration

### Visitor Analytics Pages

The system includes visitor analytics pages:

- **Analytics Index**: `/analytics` - Overall system analytics
- **Model Analytics**: `/analytics/{modelType}` - Analytics for specific model types
- **Model Detail Analytics**: `/analytics/{modelType}/{modelId}` - Analytics for specific models

### Using Analytics Data

```typescript
import { usePage } from '@inertiajs/react';

function AnalyticsPage() {
  const { analytics } = usePage().props;
  
  return (
    <div>
      <h1>Visitor Analytics</h1>
      <p>Total Visits: {analytics.total_visits}</p>
      <p>Unique Visitors: {analytics.unique_visitors}</p>
      {/* Display charts and statistics */}
    </div>
  );
}
```

## Performance Considerations

1. **Indexes**: The migration includes indexes on frequently queried columns
2. **Batch Processing**: For large datasets, consider batch processing
3. **Caching**: Cache analytics results for better performance
4. **Cleanup**: Implement a cleanup job for old visitor records

## Privacy Considerations

1. **GDPR Compliance**: Consider implementing data retention policies
2. **IP Anonymization**: Consider hashing or anonymizing IP addresses
3. **User Consent**: Ensure you have user consent for tracking
4. **Data Retention**: Implement automatic cleanup of old records

## Troubleshooting

### Common Issues

1. **Geolocation not working**: Check if the IP-API service is accessible
2. **Device detection issues**: Verify `jenssegers/agent` is installed
3. **Performance issues**: Check database indexes and consider caching
4. **Memory issues**: Implement pagination for large datasets

### Debugging

Enable logging in the `VisitorTrackingService`:

```php
\Log::info('Tracking visit', [
    'model' => get_class($visitable),
    'ip' => $this->getClientIp(),
    'user_agent' => $this->request->userAgent(),
]);
```

## API Reference

### Visitor Model Methods

- `user()` - BelongsTo relationship to User
- `visitable()` - MorphTo relationship to visited model
- `scopeToday()` - Filter visits from today
- `scopeThisWeek()` - Filter visits from this week
- `scopeThisMonth()` - Filter visits from this month
- `scopeFromIp()` - Filter visits by IP address
- `scopeAuthenticated()` - Filter authenticated user visits
- `scopeAnonymous()` - Filter anonymous visits
- `scopeBounces()` - Filter bounce visits

### HasVisitors Trait Methods

- `visitors()` - MorphMany relationship to Visitor
- `recordVisit()` - Record a new visit
- `visits_count` - Total visits count
- `unique_visitors_count` - Unique visitors count
- `today_visits_count` - Today's visits count
- `this_week_visits_count` - This week's visits count
- `this_month_visits_count` - This month's visits count
- `bounce_rate` - Bounce rate percentage
- `average_time_spent` - Average time spent
- `recent_visitors` - Recent visitors collection
- `top_referrers` - Top referrers collection
- `device_distribution` - Device distribution collection
- `browser_distribution` - Browser distribution collection
- `geographic_distribution` - Geographic distribution collection

### VisitorTrackingService Methods

- `trackVisit()` - Track a visit for a model
- `getGeolocation()` - Get geolocation data for IP
- `updateDuration()` - Update visit duration
- `markAsBounce()` - Mark visit as bounce
- `getAnalytics()` - Get analytics data for a model

---

**Document Version**: 1.0  
**Last Updated**: January 2025

