import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from '@/lib/i18n/translate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    Users, 
    Eye, 
    Clock, 
    Globe, 
    Monitor, 
    Smartphone, 
    Tablet,
    BarChart3,
    TrendingUp,
    MapPin,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    ArrowLeft,
    User,
    Globe2,
    MonitorSmartphone,
    Clock3
} from 'lucide-react';

interface Model {
    type: string;
    id: number | null;
    name: string;
    url: string;
}

interface Analytics {
    total_visits: number;
    unique_visitors: number;
    authenticated_visitors: number;
    anonymous_visitors: number;
    bounce_rate: number;
    average_time_spent: number;
    device_distribution: Record<string, number>;
    browser_distribution: Record<string, number>;
    geographic_distribution: Record<string, number>;
}

interface RecentVisitor {
    id: number;
    visited_at: string;
    ip_address: string;
    device_type: string;
    browser: string;
    location_formatted: string;
    duration_formatted: string;
    is_bounce: boolean;
    user?: {
        id: number;
        name: string;
        email: string;
    };
}

interface TimelineItem {
    id: number;
    visited_at: string;
    ip_address: string;
    device_type: string;
    browser: string;
    location: string;
    duration: string;
    is_bounce: boolean;
    user?: {
        id: number;
        name: string;
        email: string;
    };
}

interface Filters {
    period: string;
    availablePeriods: Record<string, string>;
}

interface Props {
    model: Model;
    analytics: Analytics;
    recentVisitors: RecentVisitor[];
    timeline: TimelineItem[];
    filters: Filters;
}

export default function VisitorAnalyticsShow({ model, analytics, recentVisitors, timeline, filters }: Props) {
    const { t } = useTranslation();
    const [period, setPeriod] = useState(filters.period);

    const handlePeriodChange = (value: string) => {
        setPeriod(value);
        router.get(route('analytics.show', [model.type, model.id]), { period: value }, { preserveState: true });
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat().format(num);
    };

    const formatDuration = (seconds: number) => {
        if (!seconds) return '0s';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) return `${hours}h ${minutes}m`;
        if (minutes > 0) return `${minutes}m ${secs}s`;
        return `${secs}s`;
    };

    const getDeviceIcon = (deviceType: string) => {
        switch (deviceType) {
            case 'desktop': return <Monitor className="h-4 w-4" />;
            case 'mobile': return <Smartphone className="h-4 w-4" />;
            case 'tablet': return <Tablet className="h-4 w-4" />;
            default: return <Monitor className="h-4 w-4" />;
        }
    };

    const getDeviceColor = (deviceType: string) => {
        switch (deviceType) {
            case 'desktop': return 'bg-blue-100 text-blue-800';
            case 'mobile': return 'bg-green-100 text-green-800';
            case 'tablet': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
            <Head title={`Analytics - ${model.name}`} />
            
            <div className="container mx-auto py-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" onClick={() => router.get(route('analytics.index'))}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Analytics
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold">{model.name}</h1>
                            <p className="text-muted-foreground">
                                {model.type} Analytics
                            </p>
                        </div>
                    </div>
                    
                    {/* Period Filter */}
                    <Select value={period} onValueChange={handlePeriodChange}>
                        <SelectTrigger className="w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(filters.availablePeriods).map(([key, label]) => (
                                <SelectItem key={key} value={key}>
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Analytics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatNumber(analytics.total_visits)}</div>
                            <p className="text-xs text-muted-foreground">
                                {formatNumber(analytics.unique_visitors)} unique visitors
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Authenticated Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatNumber(analytics.authenticated_visitors)}</div>
                            <p className="text-xs text-muted-foreground">
                                {analytics.total_visits > 0 
                                    ? Math.round((analytics.authenticated_visitors / analytics.total_visits) * 100)
                                    : 0}% of total visits
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics.bounce_rate}%</div>
                            <p className="text-xs text-muted-foreground">
                                Single page visits
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg. Time Spent</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatDuration(analytics.average_time_spent || 0)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Per session
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Analytics */}
                <Tabs defaultValue="timeline" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="timeline">Visitor Timeline</TabsTrigger>
                        <TabsTrigger value="devices">Device Distribution</TabsTrigger>
                        <TabsTrigger value="browsers">Browser Distribution</TabsTrigger>
                        <TabsTrigger value="geography">Geography</TabsTrigger>
                        <TabsTrigger value="recent">Recent Visitors</TabsTrigger>
                    </TabsList>

                    <TabsContent value="timeline" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Visitor Timeline</CardTitle>
                                <CardDescription>
                                    Recent visits to this {model.type.toLowerCase()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {timeline.map((visit) => (
                                        <div key={visit.id} className="border rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <Badge variant={visit.is_bounce ? "destructive" : "secondary"}>
                                                        {visit.is_bounce ? "Bounce" : "Engaged"}
                                                    </Badge>
                                                    <span className="text-sm text-muted-foreground">
                                                        {new Date(visit.visited_at).toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge className={getDeviceColor(visit.device_type)}>
                                                        {getDeviceIcon(visit.device_type)}
                                                        <span className="ml-1 capitalize">{visit.device_type}</span>
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <span className="text-muted-foreground">IP Address:</span>
                                                    <div className="font-medium">{visit.ip_address}</div>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Browser:</span>
                                                    <div className="font-medium">{visit.browser}</div>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Location:</span>
                                                    <div className="font-medium">{visit.location}</div>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Duration:</span>
                                                    <div className="font-medium">{visit.duration}</div>
                                                </div>
                                            </div>
                                            {visit.user && (
                                                <div className="mt-3 pt-3 border-t">
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm text-muted-foreground">Authenticated User:</span>
                                                        <span className="font-medium">{visit.user.name}</span>
                                                        <span className="text-muted-foreground">({visit.user.email})</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="devices" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Device Distribution</CardTitle>
                                <CardDescription>
                                    How visitors access this {model.type.toLowerCase()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {Object.entries(analytics.device_distribution).map(([deviceType, count]) => (
                                        <div key={deviceType} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                {getDeviceIcon(deviceType)}
                                                <span className="capitalize">{deviceType}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className="bg-blue-600 h-2 rounded-full" 
                                                        style={{ 
                                                            width: `${analytics.total_visits > 0 
                                                                ? (count / analytics.total_visits) * 100 
                                                                : 0}%` 
                                                        }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium w-16 text-right">
                                                    {count} ({analytics.total_visits > 0 
                                                        ? Math.round((count / analytics.total_visits) * 100)
                                                        : 0}%)
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="browsers" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Browser Distribution</CardTitle>
                                <CardDescription>
                                    Most popular browsers for this {model.type.toLowerCase()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {Object.entries(analytics.browser_distribution)
                                        .sort(([,a], [,b]) => b - a)
                                        .slice(0, 10)
                                        .map(([browser, count]) => (
                                        <div key={browser} className="flex items-center justify-between">
                                            <span>{browser}</span>
                                            <div className="flex items-center gap-4">
                                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className="bg-green-600 h-2 rounded-full" 
                                                        style={{ 
                                                            width: `${analytics.total_visits > 0 
                                                                ? (count / analytics.total_visits) * 100 
                                                                : 0}%` 
                                                        }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium w-16 text-right">
                                                    {count} ({analytics.total_visits > 0 
                                                        ? Math.round((count / analytics.total_visits) * 100)
                                                        : 0}%)
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="geography" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Geographic Distribution</CardTitle>
                                <CardDescription>
                                    Where visitors of this {model.type.toLowerCase()} are located
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {Object.entries(analytics.geographic_distribution)
                                        .sort(([,a], [,b]) => b - a)
                                        .slice(0, 10)
                                        .map(([country, count]) => (
                                        <div key={country} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <MapPin className="h-4 w-4" />
                                                <span>{country}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className="bg-purple-600 h-2 rounded-full" 
                                                        style={{ 
                                                            width: `${analytics.total_visits > 0 
                                                                ? (count / analytics.total_visits) * 100 
                                                                : 0}%` 
                                                        }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium w-16 text-right">
                                                    {count} ({analytics.total_visits > 0 
                                                        ? Math.round((count / analytics.total_visits) * 100)
                                                        : 0}%)
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="recent" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Visitors</CardTitle>
                                <CardDescription>
                                    Latest visitors to this {model.type.toLowerCase()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentVisitors.map((visitor) => (
                                        <div key={visitor.id} className="border rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <Badge variant={visitor.is_bounce ? "destructive" : "secondary"}>
                                                        {visitor.is_bounce ? "Bounce" : "Engaged"}
                                                    </Badge>
                                                    <span className="text-sm text-muted-foreground">
                                                        {new Date(visitor.visited_at).toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge className={getDeviceColor(visitor.device_type)}>
                                                        {getDeviceIcon(visitor.device_type)}
                                                        <span className="ml-1 capitalize">{visitor.device_type}</span>
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <span className="text-muted-foreground">IP Address:</span>
                                                    <div className="font-medium">{visitor.ip_address}</div>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Browser:</span>
                                                    <div className="font-medium">{visitor.browser}</div>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Location:</span>
                                                    <div className="font-medium">{visitor.location_formatted}</div>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Duration:</span>
                                                    <div className="font-medium">{visitor.duration_formatted}</div>
                                                </div>
                                            </div>
                                            {visitor.user && (
                                                <div className="mt-3 pt-3 border-t">
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm text-muted-foreground">Authenticated User:</span>
                                                        <span className="font-medium">{visitor.user.name}</span>
                                                        <span className="text-muted-foreground">({visitor.user.email})</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}
