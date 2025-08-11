import React, { useState, useEffect } from 'react';
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
    ArrowDownRight
} from 'lucide-react';

interface OverallStats {
    total_visits: number;
    unique_visitors: number;
    authenticated_visitors: number;
    anonymous_visitors: number;
    bounce_rate: number;
    average_time_spent: number;
    total_pages: number;
    total_sessions: number;
}

interface ModelStats {
    total_visits: number;
    unique_visitors: number;
    bounce_rate: number;
    average_time_spent: number;
    model_count?: number;
    page_count?: number;
}

interface DetailedAnalytics {
    device_distribution: Array<{
        device_type: string;
        count: number;
        percentage: number;
    }>;
    browser_distribution: Array<{
        browser: string;
        count: number;
        percentage: number;
    }>;
    geographic_distribution: Array<{
        country: string;
        count: number;
        percentage: number;
    }>;
    hourly_distribution: Array<{
        hour: number;
        count: number;
        label: string;
    }>;
    daily_distribution: Array<{
        date: string;
        count: number;
        label: string;
    }>;
    top_pages: Array<{
        url: string;
        count: number;
        percentage: number;
    }>;
    top_referrers: Array<{
        referrer: string;
        count: number;
        percentage: number;
    }>;
}

interface Filters {
    period: string;
    modelType: string;
    availablePeriods: Record<string, string>;
    availableModels: Record<string, string>;
}

interface Props {
    overallStats: OverallStats;
    modelStats: Record<string, ModelStats>;
    detailedAnalytics: DetailedAnalytics;
    filters: Filters;
}

export default function VisitorAnalyticsIndex({ overallStats, modelStats, detailedAnalytics, filters }: Props) {
    const { t } = useTranslation();
    const [period, setPeriod] = useState(filters.period);
    const [modelType, setModelType] = useState(filters.modelType);

    const handlePeriodChange = (value: string) => {
        setPeriod(value);
        router.get(route('analytics.index'), { period: value, model_type: modelType }, { preserveState: true });
    };

    const handleModelTypeChange = (value: string) => {
        setModelType(value);
        router.get(route('analytics.index'), { period, model_type: value }, { preserveState: true });
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

    return (
        <>
            <Head title="Visitor Analytics" />
            
            <div className="container mx-auto py-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Visitor Analytics</h1>
                        <p className="text-muted-foreground">
                            Comprehensive analytics and insights for your application
                        </p>
                    </div>
                    
                    {/* Filters */}
                    <div className="flex gap-4">
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
                        
                        <Select value={modelType} onValueChange={handleModelTypeChange}>
                            <SelectTrigger className="w-40">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(filters.availableModels).map(([key, label]) => (
                                    <SelectItem key={key} value={key}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Overall Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatNumber(overallStats.total_visits)}</div>
                            <p className="text-xs text-muted-foreground">
                                {formatNumber(overallStats.unique_visitors)} unique visitors
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Authenticated Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatNumber(overallStats.authenticated_visitors)}</div>
                            <p className="text-xs text-muted-foreground">
                                {overallStats.total_visits > 0 
                                    ? Math.round((overallStats.authenticated_visitors / overallStats.total_visits) * 100)
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
                            <div className="text-2xl font-bold">{overallStats.bounce_rate}%</div>
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
                                {formatDuration(overallStats.average_time_spent || 0)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Per session
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Model Stats */}
                <Card>
                    <CardHeader>
                        <CardTitle>Model Performance</CardTitle>
                        <CardDescription>
                            Visitor statistics by model type
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(modelStats).map(([modelName, stats]) => (
                                <div key={modelName} className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold">{modelName}</h3>
                                        <Badge variant="secondary">
                                            {stats.model_count || stats.page_count || 0} items
                                        </Badge>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Visits:</span>
                                            <span className="font-medium">{formatNumber(stats.total_visits)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Unique:</span>
                                            <span className="font-medium">{formatNumber(stats.unique_visitors)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Bounce Rate:</span>
                                            <span className="font-medium">{stats.bounce_rate}%</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Avg. Time:</span>
                                            <span className="font-medium">
                                                {formatDuration(stats.average_time_spent || 0)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Detailed Analytics */}
                <Tabs defaultValue="devices" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="devices">Devices</TabsTrigger>
                        <TabsTrigger value="browsers">Browsers</TabsTrigger>
                        <TabsTrigger value="geography">Geography</TabsTrigger>
                        <TabsTrigger value="pages">Top Pages</TabsTrigger>
                        <TabsTrigger value="referrers">Referrers</TabsTrigger>
                    </TabsList>

                    <TabsContent value="devices" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Device Distribution</CardTitle>
                                <CardDescription>
                                    How visitors access your application
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {detailedAnalytics.device_distribution.map((device) => (
                                        <div key={device.device_type} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                {getDeviceIcon(device.device_type)}
                                                <span className="capitalize">{device.device_type}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className="bg-blue-600 h-2 rounded-full" 
                                                        style={{ width: `${device.percentage}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium w-16 text-right">
                                                    {device.count} ({device.percentage}%)
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
                                    Most popular browsers among visitors
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {detailedAnalytics.browser_distribution.map((browser) => (
                                        <div key={browser.browser} className="flex items-center justify-between">
                                            <span>{browser.browser}</span>
                                            <div className="flex items-center gap-4">
                                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className="bg-green-600 h-2 rounded-full" 
                                                        style={{ width: `${browser.percentage}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium w-16 text-right">
                                                    {browser.count} ({browser.percentage}%)
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
                                    Where your visitors are located
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {detailedAnalytics.geographic_distribution.map((geo) => (
                                        <div key={geo.country} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <MapPin className="h-4 w-4" />
                                                <span>{geo.country}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className="bg-purple-600 h-2 rounded-full" 
                                                        style={{ width: `${geo.percentage}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium w-16 text-right">
                                                    {geo.count} ({geo.percentage}%)
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="pages" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Pages</CardTitle>
                                <CardDescription>
                                    Most visited pages in your application
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {detailedAnalytics.top_pages.map((page) => (
                                        <div key={page.url} className="flex items-center justify-between">
                                            <span className="text-sm truncate max-w-md">{page.url}</span>
                                            <div className="flex items-center gap-4">
                                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className="bg-orange-600 h-2 rounded-full" 
                                                        style={{ width: `${page.percentage}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium w-16 text-right">
                                                    {page.count} ({page.percentage}%)
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="referrers" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Referrers</CardTitle>
                                <CardDescription>
                                    Where your visitors are coming from
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {detailedAnalytics.top_referrers.map((referrer) => (
                                        <div key={referrer.referrer} className="flex items-center justify-between">
                                            <span className="text-sm truncate max-w-md">{referrer.referrer}</span>
                                            <div className="flex items-center gap-4">
                                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className="bg-red-600 h-2 rounded-full" 
                                                        style={{ width: `${referrer.percentage}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium w-16 text-right">
                                                    {referrer.count} ({referrer.percentage}%)
                                                </span>
                                            </div>
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
