import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
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
    Clock3,
    Activity,
    PieChart,
    Map,
    History,
    ExternalLink
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

interface BreadcrumbItem {
    title: string;
    href: string;
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

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('analytics.page_title'), href: route('analytics.index') },
        { title: model.name, href: '#' }
    ];

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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('analytics.page_title')} - ${model.name}`} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 text-white shadow-2xl">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
                    
                    <div className="relative z-10 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
                                <BarChart3 className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">{model.name}</h1>
                                <p className="text-white/90 flex items-center gap-2 mt-2 text-lg">
                                    <Activity className="h-5 w-5" />
                                    {model.type} {t('analytics.page_title')} Dashboard
                                </p>
                            </div>
                        </div>
                        
                        {/* Period Filter */}
                        <div className="flex items-center gap-4">
                            <Select value={period} onValueChange={handlePeriodChange}>
                                <SelectTrigger className="w-56 bg-white/20 backdrop-blur-sm border-white/30 text-white">
                                    <Calendar className="h-5 w-5 mr-2" />
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
                            
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => router.get(route('analytics.index'))}
                                className="hidden lg:flex bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                {t('analytics.back_to_analytics')}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Analytics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="relative overflow-hidden group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full -translate-y-20 translate-x-20 blur-xl"></div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-blue-700">{t('analytics.overview.total_visits')}</CardTitle>
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                                <Eye className="h-5 w-5 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                {formatNumber(analytics.total_visits)}
                            </div>
                            <p className="text-sm text-blue-600/80 mt-2 font-medium">
                                {formatNumber(analytics.unique_visitors)} {t('analytics.overview.unique_visitors')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 rounded-full -translate-y-20 translate-x-20 blur-xl"></div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-emerald-700">{t('analytics.overview.authenticated_users')}</CardTitle>
                            <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                                <Users className="h-5 w-5 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                                {formatNumber(analytics.authenticated_visitors)}
                            </div>
                            <p className="text-sm text-emerald-600/80 mt-2 font-medium">
                                {analytics.total_visits > 0 
                                    ? Math.round((analytics.authenticated_visitors / analytics.total_visits) * 100)
                                    : 0}% {t('analytics.overview.of_total_visits')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-amber-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full -translate-y-20 translate-x-20 blur-xl"></div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-amber-700">{t('analytics.overview.bounce_rate')}</CardTitle>
                            <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg">
                                <ArrowUpRight className="h-5 w-5 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                                {analytics.bounce_rate}%
                            </div>
                            <p className="text-sm text-amber-600/80 mt-2 font-medium">
                                {t('analytics.overview.single_page_visits')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-violet-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-violet-400/20 to-violet-600/20 rounded-full -translate-y-20 translate-x-20 blur-xl"></div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-violet-700">{t('analytics.overview.avg_time_spent')}</CardTitle>
                            <div className="p-3 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl shadow-lg">
                                <Clock className="h-5 w-5 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-violet-800 bg-clip-text text-transparent">
                                {formatDuration(analytics.average_time_spent || 0)}
                            </div>
                            <p className="text-sm text-violet-600/80 mt-2 font-medium">
                                {t('analytics.overview.per_session')}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Analytics */}
                <Tabs defaultValue="timeline" className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <TabsList className="grid w-full sm:w-auto grid-cols-2 sm:grid-cols-5 bg-gradient-to-r from-gray-50 to-gray-100 p-1 rounded-xl shadow-lg">
                            <TabsTrigger value="timeline" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">
                                <History className="h-4 w-4" />
                                <span className="hidden sm:inline">{t('analytics.tabs.timeline')}</span>
                            </TabsTrigger>
                            <TabsTrigger value="devices" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">
                                <MonitorSmartphone className="h-4 w-4" />
                                <span className="hidden sm:inline">{t('analytics.tabs.devices')}</span>
                            </TabsTrigger>
                            <TabsTrigger value="browsers" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">
                                <Globe2 className="h-4 w-4" />
                                <span className="hidden sm:inline">{t('analytics.tabs.browsers')}</span>
                            </TabsTrigger>
                            <TabsTrigger value="geography" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-violet-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">
                                <Map className="h-4 w-4" />
                                <span className="hidden sm:inline">{t('analytics.tabs.geography')}</span>
                            </TabsTrigger>
                            <TabsTrigger value="recent" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-rose-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">
                                <Users className="h-4 w-4" />
                                <span className="hidden sm:inline">{t('analytics.tabs.recent')}</span>
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="timeline" className="space-y-4">
                        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50/30">
                            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                                <CardTitle className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <History className="h-6 w-6" />
                                    </div>
                                    {t('analytics.timeline.title')}
                                </CardTitle>
                                <CardDescription className="text-blue-100">
                                    {t('analytics.timeline.description', { type: model.type.toLowerCase() })}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {timeline.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                                                <Activity className="h-10 w-10 text-blue-600" />
                                            </div>
                                            <p className="text-blue-600 font-medium">{t('analytics.timeline.no_visits')}</p>
                                        </div>
                                    ) : (
                                        timeline.map((visit, index) => (
                                            <div key={visit.id} className="border border-blue-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-white to-blue-50/50 hover:from-blue-50/50 hover:to-blue-100/50">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-3 h-3 rounded-full ${visit.is_bounce ? 'bg-gradient-to-r from-red-400 to-red-600' : 'bg-gradient-to-r from-green-400 to-green-600'} shadow-lg`}></div>
                                                            <Badge variant={visit.is_bounce ? "destructive" : "secondary"} className="text-xs font-semibold px-3 py-1">
                                                                {visit.is_bounce ? t('analytics.timeline.bounce') : t('analytics.timeline.engaged')}
                                                            </Badge>
                                                        </div>
                                                        <span className="text-sm text-blue-600 font-medium">
                                                            {new Date(visit.visited_at).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge className={`${getDeviceColor(visit.device_type)} text-xs font-semibold px-3 py-1`}>
                                                            {getDeviceIcon(visit.device_type)}
                                                            <span className="ml-1 capitalize">{visit.device_type}</span>
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                                                        <span className="text-blue-700 text-xs font-semibold uppercase tracking-wide">{t('analytics.timeline.ip_address')}</span>
                                                        <div className="font-bold text-sm text-blue-900 mt-1">{visit.ip_address}</div>
                                                    </div>
                                                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
                                                        <span className="text-emerald-700 text-xs font-semibold uppercase tracking-wide">{t('analytics.timeline.browser')}</span>
                                                        <div className="font-bold text-sm text-emerald-900 mt-1">{visit.browser}</div>
                                                    </div>
                                                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
                                                        <span className="text-amber-700 text-xs font-semibold uppercase tracking-wide">{t('analytics.timeline.location')}</span>
                                                        <div className="font-bold text-sm text-amber-900 mt-1">{visit.location}</div>
                                                    </div>
                                                    <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-xl p-4 border border-violet-200">
                                                        <span className="text-violet-700 text-xs font-semibold uppercase tracking-wide">{t('analytics.timeline.duration')}</span>
                                                        <div className="font-bold text-sm text-violet-900 mt-1">{visit.duration}</div>
                                                    </div>
                                                </div>
                                                {visit.user && (
                                                    <div className="mt-4 pt-4 border-t border-blue-200">
                                                        <div className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                                                            <div className="p-2 bg-white/20 rounded-lg">
                                                                <User className="h-5 w-5" />
                                                            </div>
                                                            <div>
                                                                <span className="text-sm font-semibold">{t('analytics.timeline.authenticated_user')}:</span>
                                                                <div className="font-bold text-lg">{visit.user.name}</div>
                                                                <span className="text-blue-100 text-sm">({visit.user.email})</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="devices" className="space-y-4">
                        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-emerald-50/30">
                            <CardHeader className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-t-lg">
                                <CardTitle className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <MonitorSmartphone className="h-6 w-6" />
                                    </div>
                                    {t('analytics.devices.title')}
                                </CardTitle>
                                <CardDescription className="text-emerald-100">
                                    {t('analytics.devices.description', { type: model.type.toLowerCase() })}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {Object.entries(analytics.device_distribution).length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="p-4 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                                                <MonitorSmartphone className="h-10 w-10 text-emerald-600" />
                                            </div>
                                            <p className="text-emerald-600 font-medium">{t('analytics.devices.no_data')}</p>
                                        </div>
                                    ) : (
                                        Object.entries(analytics.device_distribution).map(([deviceType, count]) => (
                                            <div key={deviceType} className="flex items-center justify-between p-6 border border-emerald-200 rounded-xl hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-emerald-50/50 hover:from-emerald-50/50 hover:to-emerald-100/50">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                                                        {getDeviceIcon(deviceType)}
                                                    </div>
                                                    <div>
                                                        <span className="capitalize font-bold text-lg text-emerald-900">{deviceType}</span>
                                                        <div className="text-sm text-emerald-600 font-medium">{count} {t('analytics.devices.visits')}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="w-40 bg-emerald-200 rounded-full h-4 shadow-inner">
                                                        <div 
                                                            className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-4 rounded-full transition-all duration-500 shadow-lg" 
                                                            style={{ 
                                                                width: `${analytics.total_visits > 0 
                                                                    ? (count / analytics.total_visits) * 100 
                                                                    : 0}%` 
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="text-lg font-bold w-20 text-right text-emerald-600">
                                                        {analytics.total_visits > 0 
                                                            ? Math.round((count / analytics.total_visits) * 100)
                                                            : 0}{t('analytics.common.percentage')}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="browsers" className="space-y-4">
                        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-amber-50/30">
                            <CardHeader className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-t-lg">
                                <CardTitle className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <Globe2 className="h-6 w-6" />
                                    </div>
                                    {t('analytics.browsers.title')}
                                </CardTitle>
                                <CardDescription className="text-amber-100">
                                    {t('analytics.browsers.description', { type: model.type.toLowerCase() })}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {Object.entries(analytics.browser_distribution).length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="p-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                                                <Globe2 className="h-10 w-10 text-amber-600" />
                                            </div>
                                            <p className="text-amber-600 font-medium">{t('analytics.browsers.no_data')}</p>
                                        </div>
                                    ) : (
                                        Object.entries(analytics.browser_distribution)
                                            .sort(([,a], [,b]) => b - a)
                                            .slice(0, 10)
                                            .map(([browser, count], index) => (
                                            <div key={browser} className="flex items-center justify-between p-6 border border-amber-200 rounded-xl hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-amber-50/50 hover:from-amber-50/50 hover:to-amber-100/50">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg">
                                                        <Globe2 className="h-5 w-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-lg text-amber-900">{browser}</span>
                                                        <div className="text-sm text-amber-600 font-medium">{count} {t('analytics.common.visits')}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="w-40 bg-amber-200 rounded-full h-4 shadow-inner">
                                                        <div 
                                                            className="bg-gradient-to-r from-amber-500 to-amber-600 h-4 rounded-full transition-all duration-500 shadow-lg" 
                                                            style={{ 
                                                                width: `${analytics.total_visits > 0 
                                                                    ? (count / analytics.total_visits) * 100 
                                                                    : 0}%` 
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="text-lg font-bold w-20 text-right text-amber-600">
                                                        {analytics.total_visits > 0 
                                                            ? Math.round((count / analytics.total_visits) * 100)
                                                            : 0}{t('analytics.common.percentage')}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="geography" className="space-y-4">
                        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-violet-50/30">
                            <CardHeader className="bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-t-lg">
                                <CardTitle className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <Map className="h-6 w-6" />
                                    </div>
                                    {t('analytics.geography.title')}
                                </CardTitle>
                                <CardDescription className="text-violet-100">
                                    {t('analytics.geography.description', { type: model.type.toLowerCase() })}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {Object.entries(analytics.geographic_distribution).length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="p-4 bg-gradient-to-br from-violet-100 to-violet-200 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                                                <Map className="h-10 w-10 text-violet-600" />
                                            </div>
                                            <p className="text-violet-600 font-medium">{t('analytics.geography.no_data')}</p>
                                        </div>
                                    ) : (
                                        Object.entries(analytics.geographic_distribution)
                                            .sort(([,a], [,b]) => b - a)
                                            .slice(0, 10)
                                            .map(([country, count], index) => (
                                            <div key={country} className="flex items-center justify-between p-6 border border-violet-200 rounded-xl hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-violet-50/50 hover:from-violet-50/50 hover:to-violet-100/50">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl shadow-lg">
                                                        <MapPin className="h-5 w-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-lg text-violet-900">{country}</span>
                                                        <div className="text-sm text-violet-600 font-medium">{count} {t('analytics.common.visits')}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="w-40 bg-violet-200 rounded-full h-4 shadow-inner">
                                                        <div 
                                                            className="bg-gradient-to-r from-violet-500 to-violet-600 h-4 rounded-full transition-all duration-500 shadow-lg" 
                                                            style={{ 
                                                                width: `${analytics.total_visits > 0 
                                                                    ? (count / analytics.total_visits) * 100 
                                                                    : 0}%` 
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="text-lg font-bold w-20 text-right text-violet-600">
                                                        {analytics.total_visits > 0 
                                                            ? Math.round((count / analytics.total_visits) * 100)
                                                            : 0}{t('analytics.common.percentage')}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="recent" className="space-y-4">
                        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-rose-50/30">
                            <CardHeader className="bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-t-lg">
                                <CardTitle className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <Users className="h-6 w-6" />
                                    </div>
                                    {t('analytics.recent.title')}
                                </CardTitle>
                                <CardDescription className="text-rose-100">
                                    {t('analytics.recent.description', { type: model.type.toLowerCase() })}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {recentVisitors.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="p-4 bg-gradient-to-br from-rose-100 to-rose-200 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                                                <Users className="h-10 w-10 text-rose-600" />
                                            </div>
                                            <p className="text-rose-600 font-medium">{t('analytics.recent.no_visitors')}</p>
                                        </div>
                                    ) : (
                                        recentVisitors.map((visitor) => (
                                            <div key={visitor.id} className="border border-rose-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-white to-rose-50/50 hover:from-rose-50/50 hover:to-rose-100/50">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-3 h-3 rounded-full ${visitor.is_bounce ? 'bg-gradient-to-r from-red-400 to-red-600' : 'bg-gradient-to-r from-green-400 to-green-600'} shadow-lg`}></div>
                                                            <Badge variant={visitor.is_bounce ? "destructive" : "secondary"} className="text-xs font-semibold px-3 py-1">
                                                                {visitor.is_bounce ? t('analytics.timeline.bounce') : t('analytics.timeline.engaged')}
                                                            </Badge>
                                                        </div>
                                                        <span className="text-sm text-rose-600 font-medium">
                                                            {new Date(visitor.visited_at).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge className={`${getDeviceColor(visitor.device_type)} text-xs font-semibold px-3 py-1`}>
                                                            {getDeviceIcon(visitor.device_type)}
                                                            <span className="ml-1 capitalize">{visitor.device_type}</span>
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                                                        <span className="text-blue-700 text-xs font-semibold uppercase tracking-wide">{t('analytics.timeline.ip_address')}</span>
                                                        <div className="font-bold text-sm text-blue-900 mt-1">{visitor.ip_address}</div>
                                                    </div>
                                                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
                                                        <span className="text-emerald-700 text-xs font-semibold uppercase tracking-wide">{t('analytics.timeline.browser')}</span>
                                                        <div className="font-bold text-sm text-emerald-900 mt-1">{visitor.browser}</div>
                                                    </div>
                                                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
                                                        <span className="text-amber-700 text-xs font-semibold uppercase tracking-wide">{t('analytics.timeline.location')}</span>
                                                        <div className="font-bold text-sm text-amber-900 mt-1">{visitor.location_formatted}</div>
                                                    </div>
                                                    <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-xl p-4 border border-violet-200">
                                                        <span className="text-violet-700 text-xs font-semibold uppercase tracking-wide">{t('analytics.timeline.duration')}</span>
                                                        <div className="font-bold text-sm text-violet-900 mt-1">{visitor.duration_formatted}</div>
                                                    </div>
                                                </div>
                                                {visitor.user && (
                                                    <div className="mt-4 pt-4 border-t border-rose-200">
                                                        <div className="flex items-center gap-3 bg-gradient-to-r from-rose-500 to-rose-600 rounded-xl p-4 text-white">
                                                            <div className="p-2 bg-white/20 rounded-lg">
                                                                <User className="h-5 w-5" />
                                                            </div>
                                                            <div>
                                                                <span className="text-sm font-semibold">{t('analytics.timeline.authenticated_user')}:</span>
                                                                <div className="font-bold text-lg">{visitor.user.name}</div>
                                                                <span className="text-rose-100 text-sm">({visitor.user.email})</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}