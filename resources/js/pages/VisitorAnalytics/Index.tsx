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
    ArrowDownRight,
    Activity,
    Zap
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
            <Head title={t('analytics.page_title')} />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                <div className="container mx-auto py-8 px-4 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
                                    {t('analytics.page_title')}
                                </h1>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 text-lg">
                                {t('analytics.page_description')}
                            </p>
                        </div>
                        
                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                <Select value={period} onValueChange={handlePeriodChange}>
                                    <SelectTrigger className="w-48 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                                        {Object.entries(filters.availablePeriods).map(([key, label]) => (
                                            <SelectItem key={key} value={key} className="hover:bg-slate-100 dark:hover:bg-slate-700">
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <Activity className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                <Select value={modelType} onValueChange={handleModelTypeChange}>
                                    <SelectTrigger className="w-48 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                                        {Object.entries(filters.availableModels).map(([key, label]) => (
                                            <SelectItem key={key} value={key} className="hover:bg-slate-100 dark:hover:bg-slate-700">
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Overall Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {t('analytics.total_visits')}
                                </CardTitle>
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                                    {formatNumber(overallStats.total_visits)}
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                    {formatNumber(overallStats.unique_visitors)} {t('analytics.unique_visitors')}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {t('analytics.authenticated_users')}
                                </CardTitle>
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                    <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                                    {formatNumber(overallStats.authenticated_visitors)}
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                    {overallStats.total_visits > 0 
                                        ? Math.round((overallStats.authenticated_visitors / overallStats.total_visits) * 100)
                                        : 0}% {t('analytics.of_total_visits')}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {t('analytics.bounce_rate')}
                                </CardTitle>
                                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                    <ArrowUpRight className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                                    {overallStats.bounce_rate}%
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                    {t('analytics.single_page_visits')}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {t('analytics.avg_time_spent')}
                                </CardTitle>
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                    <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                                    {formatDuration(overallStats.average_time_spent || 0)}
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                    {t('analytics.per_session')}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Model Stats */}
                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-lg">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                    <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl text-slate-900 dark:text-slate-100">
                                        {t('analytics.model_performance')}
                                    </CardTitle>
                                    <CardDescription className="text-slate-600 dark:text-slate-400">
                                        {t('analytics.model_performance_description')}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Object.entries(modelStats).map(([modelName, stats]) => (
                                    <div key={modelName} className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">
                                                {modelName}
                                            </h3>
                                            <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700">
                                                {stats.model_count || stats.page_count || 0} {t('analytics.items')}
                                            </Badge>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-600 dark:text-slate-400">{t('analytics.visits')}:</span>
                                                <span className="font-semibold text-slate-900 dark:text-slate-100">
                                                    {formatNumber(stats.total_visits)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-600 dark:text-slate-400">{t('analytics.unique')}:</span>
                                                <span className="font-semibold text-slate-900 dark:text-slate-100">
                                                    {formatNumber(stats.unique_visitors)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-600 dark:text-slate-400">{t('analytics.bounce_rate')}:</span>
                                                <span className="font-semibold text-slate-900 dark:text-slate-100">
                                                    {stats.bounce_rate}%
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-600 dark:text-slate-400">{t('analytics.avg_time')}:</span>
                                                <span className="font-semibold text-slate-900 dark:text-slate-100">
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
                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-lg">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                                    <Zap className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl text-slate-900 dark:text-slate-100">
                                        {t('analytics.detailed_analytics')}
                                    </CardTitle>
                                    <CardDescription className="text-slate-600 dark:text-slate-400">
                                        {t('analytics.detailed_analytics_description')}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="devices" className="space-y-6">
                                <TabsList className="grid w-full grid-cols-5 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                                    <TabsTrigger 
                                        value="devices" 
                                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100 data-[state=active]:shadow-sm"
                                    >
                                        {t('analytics.devices')}
                                    </TabsTrigger>
                                    <TabsTrigger 
                                        value="browsers"
                                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100 data-[state=active]:shadow-sm"
                                    >
                                        {t('analytics.browsers')}
                                    </TabsTrigger>
                                    <TabsTrigger 
                                        value="geography"
                                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100 data-[state=active]:shadow-sm"
                                    >
                                        {t('analytics.geography')}
                                    </TabsTrigger>
                                    <TabsTrigger 
                                        value="pages"
                                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100 data-[state=active]:shadow-sm"
                                    >
                                        {t('analytics.top_pages')}
                                    </TabsTrigger>
                                    <TabsTrigger 
                                        value="referrers"
                                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100 data-[state=active]:shadow-sm"
                                    >
                                        {t('analytics.referrers')}
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="devices" className="space-y-4">
                                    <div className="space-y-4">
                                        {detailedAnalytics.device_distribution.map((device) => (
                                            <div key={device.device_type} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                                        {getDeviceIcon(device.device_type)}
                                                    </div>
                                                    <span className="capitalize font-medium text-slate-900 dark:text-slate-100">
                                                        {device.device_type}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-40 bg-slate-200 dark:bg-slate-600 rounded-full h-3">
                                                        <div 
                                                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500" 
                                                            style={{ width: `${device.percentage}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 w-20 text-right">
                                                        {device.count} ({device.percentage}%)
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="browsers" className="space-y-4">
                                    <div className="space-y-4">
                                        {detailedAnalytics.browser_distribution.map((browser) => (
                                            <div key={browser.browser} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                                        <Globe className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                    </div>
                                                    <span className="font-medium text-slate-900 dark:text-slate-100">
                                                        {browser.browser}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-40 bg-slate-200 dark:bg-slate-600 rounded-full h-3">
                                                        <div 
                                                            className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500" 
                                                            style={{ width: `${browser.percentage}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 w-20 text-right">
                                                        {browser.count} ({browser.percentage}%)
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="geography" className="space-y-4">
                                    <div className="space-y-4">
                                        {detailedAnalytics.geographic_distribution.map((geo) => (
                                            <div key={geo.country} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                                        <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                                    </div>
                                                    <span className="font-medium text-slate-900 dark:text-slate-100">
                                                        {geo.country}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-40 bg-slate-200 dark:bg-slate-600 rounded-full h-3">
                                                        <div 
                                                            className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500" 
                                                            style={{ width: `${geo.percentage}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 w-20 text-right">
                                                        {geo.count} ({geo.percentage}%)
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="pages" className="space-y-4">
                                    <div className="space-y-4">
                                        {detailedAnalytics.top_pages.map((page) => (
                                            <div key={page.url} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                                        <BarChart3 className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                                    </div>
                                                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate max-w-md">
                                                        {page.url}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-40 bg-slate-200 dark:bg-slate-600 rounded-full h-3">
                                                        <div 
                                                            className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-500" 
                                                            style={{ width: `${page.percentage}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 w-20 text-right">
                                                        {page.count} ({page.percentage}%)
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="referrers" className="space-y-4">
                                    <div className="space-y-4">
                                        {detailedAnalytics.top_referrers.map((referrer) => (
                                            <div key={referrer.referrer} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                                        <ArrowUpRight className="h-4 w-4 text-red-600 dark:text-red-400" />
                                                    </div>
                                                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate max-w-md">
                                                        {referrer.referrer}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-40 bg-slate-200 dark:bg-slate-600 rounded-full h-3">
                                                        <div 
                                                            className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-500" 
                                                            style={{ width: `${referrer.percentage}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 w-20 text-right">
                                                        {referrer.count} ({referrer.percentage}%)
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
