import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ShieldCheck, Activity, Target, AlertTriangle, BarChart3, Users, Map, FileText, Eye, Clock, TrendingUp, MapPin, Zap, Database, Server, Globe, Shield, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';
import { useEffect, useRef, useState } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';

interface DashboardProps {
    stats: {
        total_incidents: number;
        total_departments: number;
        total_districts: number;
        total_provinces: number;
        total_meetings: number;
        total_info_items: number;
        total_reports: number;
        active_incidents: number;
        pending_reports: number;
    };
    locationStats: {
        provinces: Array<{
            id: number;
            name: string;
            code: string;
            capital: string;
            districts_count: number;
            incidents_count: number;
            status: string;
        }>;
        districts: Array<{
            id: number;
            name: string;
            code: string;
            province_id: number;
            province_name: string;
            province_code: string;
            incidents_count: number;
            status: string;
        }>;
        incidents_by_location: Record<string, {
            total: number;
            resolved: number;
            active: number;
            district_name: string;
            province_name: string;
        }>;
    };
    incidentStats: {
        total_incidents: number;
        today_incidents: number;
        this_week_incidents: number;
        this_month_incidents: number;
        resolved_incidents: number;
        pending_incidents: number;
        investigating_incidents: number;
        incidents_by_status: Record<string, number>;
    };
    systemHealth: {
        system_status: string;
        database_size: string;
        storage_usage: {
            total: string;
            used: string;
            free: string;
            usage_percentage: number;
        };
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Intelligence Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({
    stats,
    locationStats,
    incidentStats,
    systemHealth,
}: DashboardProps) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        // Simulate loading for better UX
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Intelligence Dashboard" />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                <div className="flex h-full flex-1 flex-col gap-6 p-4 sm:gap-8 sm:p-6">
                    {/* Enhanced Header Section */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 text-white shadow-2xl sm:p-8">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/10 blur-xl"></div>
                        <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-white/5 blur-2xl"></div>
                        
                        <div className="relative z-10 flex flex-col items-center justify-between gap-6 lg:flex-row">
                            <div className="space-y-2 text-center lg:text-left">
                                <div className="flex items-center justify-center gap-3 lg:justify-start">
                                    <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
                                        <Shield className="h-6 w-6 text-white sm:h-8 sm:w-8" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">Intelligence Dashboard</h1>
                                        <p className="text-blue-100 text-sm font-medium sm:text-base lg:text-lg">Secure operations overview and system status</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-col items-center gap-4 sm:flex-row">
                                <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm sm:p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse"></div>
                                        <span className="font-semibold text-sm sm:text-base">System Secure</span>
                                    </div>
                                    <div className="text-blue-100 text-xs mt-1 sm:text-sm">
                                        Last updated: {new Date().toLocaleTimeString()}
                                    </div>
                                </div>
                                
                                <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm sm:p-4">
                                    <div className="text-center">
                                        <div className="text-xl font-bold sm:text-2xl">{stats.total_incidents}</div>
                                        <div className="text-blue-100 text-xs sm:text-sm">Total Incidents</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Quick Stats Grid */}
                    <div className="grid auto-rows-min gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Active Cases Card */}
                        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 p-4 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl sm:p-6">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                            <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-white/10 blur-xl"></div>
                            
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
                                        <Target className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex items-center gap-1 text-green-300">
                                        <ArrowUpRight className="h-4 w-4" />
                                        <span className="text-sm font-medium">+12%</span>
                                    </div>
                                </div>
                                
                                <div className="space-y-1">
                                    <p className="text-blue-100 text-sm font-medium">{t('dashboard.active_cases')}</p>
                                    <p className="text-3xl font-black">{stats.active_incidents}</p>
                                    <p className="text-blue-200 text-xs">Currently monitoring</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Active Incidents Card */}
                        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500 via-red-600 to-pink-600 p-4 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl sm:p-6">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                            <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-white/10 blur-xl"></div>
                            
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
                                        <AlertTriangle className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex items-center gap-1 text-yellow-300">
                                        <ArrowUpRight className="h-4 w-4" />
                                        <span className="text-sm font-medium">+8%</span>
                                    </div>
                                </div>
                                
                                <div className="space-y-1">
                                    <p className="text-red-100 text-sm font-medium">{t('dashboard.active_incidents')}</p>
                                    <p className="text-3xl font-black">{stats.active_incidents}</p>
                                    <p className="text-red-200 text-xs">Require attention</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Total Provinces Card */}
                        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 p-4 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl sm:p-6">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                            <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-white/10 blur-xl"></div>
                            
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
                                        <MapPin className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex items-center gap-1 text-green-300">
                                        <Minus className="h-4 w-4" />
                                        <span className="text-sm font-medium">0%</span>
                                    </div>
                                </div>
                                
                                <div className="space-y-1">
                                    <p className="text-green-100 text-sm font-medium">{t('dashboard.total_provinces')}</p>
                                    <p className="text-3xl font-black">{stats.total_provinces}</p>
                                    <p className="text-green-200 text-xs">Coverage areas</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Reports Generated Card */}
                        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 via-violet-600 to-purple-600 p-4 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl sm:p-6">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                            <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-white/10 blur-xl"></div>
                            
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
                                        <FileText className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex items-center gap-1 text-green-300">
                                        <ArrowUpRight className="h-4 w-4" />
                                        <span className="text-sm font-medium">+24%</span>
                                    </div>
                                </div>
                                
                                <div className="space-y-1">
                                    <p className="text-purple-100 text-sm font-medium">{t('dashboard.reports_generated')}</p>
                                    <p className="text-3xl font-black">{stats.total_reports}</p>
                                    <p className="text-purple-200 text-xs">This month</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Location Statistics & System Status */}
                    <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
                        {/* Province Statistics */}
                        <div className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl dark:bg-slate-800/80 dark:border-slate-700/50">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20"></div>
                            
                            <div className="relative z-10">
                                <div className="border-b border-gray-200/50 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 px-6 py-5 dark:border-slate-600/50 dark:from-blue-500/20 dark:to-indigo-500/20">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-3">
                                            <Globe className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100">{t('dashboard.province_statistics')}</h3>
                                            <p className="text-sm text-gray-600 dark:text-slate-400">Geographic coverage overview</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-6">
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/30">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-lg bg-blue-500 p-2">
                                                    <MapPin className="h-4 w-4 text-white" />
                                                </div>
                                                <span className="font-medium text-gray-700 dark:text-slate-300">{t('dashboard.total_provinces')}</span>
                                            </div>
                                            <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{locationStats.provinces.length}</span>
                                        </div>
                                        
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/30">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-lg bg-green-500 p-2">
                                                    <Map className="h-4 w-4 text-white" />
                                                </div>
                                                <span className="font-medium text-gray-700 dark:text-slate-300">{t('dashboard.total_districts')}</span>
                                            </div>
                                            <span className="text-2xl font-black text-green-600 dark:text-green-400">{locationStats.districts.length}</span>
                                        </div>
                                        
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/30">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-lg bg-purple-500 p-2">
                                                    <AlertTriangle className="h-4 w-4 text-white" />
                                                </div>
                                                <span className="font-medium text-gray-700 dark:text-slate-300">{t('dashboard.total_incidents')}</span>
                                            </div>
                                            <span className="text-2xl font-black text-purple-600 dark:text-purple-400">{incidentStats.total_incidents}</span>
                                        </div>
                                        
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/30">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-lg bg-orange-500 p-2">
                                                    <Activity className="h-4 w-4 text-white" />
                                                </div>
                                                <span className="font-medium text-gray-700 dark:text-slate-300">{t('dashboard.active_incidents')}</span>
                                            </div>
                                            <span className="text-2xl font-black text-orange-600 dark:text-orange-400">{incidentStats.pending_incidents + incidentStats.investigating_incidents}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* System Status */}
                        <div className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl dark:bg-slate-800/80 dark:border-slate-700/50">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20"></div>
                            
                            <div className="relative z-10">
                                <div className="border-b border-gray-200/50 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-6 py-5 dark:border-slate-600/50 dark:from-emerald-500/20 dark:to-teal-500/20">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-3">
                                            <Server className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100">{t('dashboard.system_status')}</h3>
                                            <p className="text-sm text-gray-600 dark:text-slate-400">Infrastructure health monitor</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-6">
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/30">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-lg bg-green-500 p-2">
                                                    <div className="h-4 w-4 rounded-full bg-white animate-pulse"></div>
                                                </div>
                                                <span className="font-medium text-gray-700 dark:text-slate-300">{t('dashboard.system_status')}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                                                <span className="font-bold text-green-600 dark:text-green-400 capitalize">{systemHealth.system_status}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/30">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-lg bg-blue-500 p-2">
                                                    <Database className="h-4 w-4 text-white" />
                                                </div>
                                                <span className="font-medium text-gray-700 dark:text-slate-300">{t('dashboard.database_size')}</span>
                                            </div>
                                            <span className="font-bold text-blue-600 dark:text-blue-400">{systemHealth.database_size}</span>
                                        </div>
                                        
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/30">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-lg bg-purple-500 p-2">
                                                    <BarChart3 className="h-4 w-4 text-white" />
                                                </div>
                                                <span className="font-medium text-gray-700 dark:text-slate-300">{t('dashboard.storage_usage')}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                                                    <div 
                                                        className="h-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500"
                                                        style={{ width: `${systemHealth.storage_usage.usage_percentage}%` }}
                                                    ></div>
                                                </div>
                                                <span className="font-bold text-purple-600 dark:text-purple-400">{systemHealth.storage_usage.usage_percentage}%</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-teal-50 to-teal-100/50 dark:from-teal-950/30 dark:to-teal-900/30">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-lg bg-teal-500 p-2">
                                                    <Zap className="h-4 w-4 text-white" />
                                                </div>
                                                <span className="font-medium text-gray-700 dark:text-slate-300">{t('dashboard.storage_free')}</span>
                                            </div>
                                            <span className="font-bold text-teal-600 dark:text-teal-400">{systemHealth.storage_usage.free}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced AmCharts Map */}
                    <div className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl dark:bg-slate-800/80 dark:border-slate-700/50">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20"></div>
                        
                        <div className="relative z-10">
                            <div className="border-b border-gray-200/50 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 px-6 py-5 dark:border-slate-600/50 dark:from-indigo-500/20 dark:to-purple-500/20">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-3">
                                            <Map className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100">{t('dashboard.location_map')}</h3>
                                            <p className="text-sm text-gray-600 dark:text-slate-400">Interactive geographic visualization</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        {isLoading ? (
                                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
                                                <span>Loading map...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                                                <span>Map loaded</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <div className="relative">
                                    {isLoading ? (
                                        <div className="flex h-96 w-full items-center justify-center rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                                            <div className="text-center">
                                                <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
                                                <p className="text-gray-600 dark:text-slate-400">Initializing map visualization...</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div id="mapChart" className="h-96 w-full rounded-xl overflow-hidden shadow-lg"></div>
                                    )}
                                </div>
                                
                                {/* Map Legend */}
                                <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-indigo-500"></div>
                                        <span className="text-gray-600 dark:text-slate-400">Provinces with incidents</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-gray-400"></div>
                                        <span className="text-gray-600 dark:text-slate-400">No incidents reported</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );

    // AmCharts Map Implementation
    useEffect(() => {
        // Create root element
        const root = am5.Root.new("mapChart");

        // Set themes
        root.setThemes([am5.Theme.new(root)]);

        // Create chart
        const chart = root.container.children.push(
            am5map.MapChart.new(root, {
                panX: "translateX",
                panY: "translateY"
            })
        );

        // Create a simple polygon series for demonstration
        const polygonSeries = chart.series.push(
            am5map.MapPolygonSeries.new(root, {
                fill: am5.color(0xdddddd)
            })
        );

        // Add data to the map
        const mapData = locationStats.provinces.map(province => ({
            id: province.code,
            name: province.name,
            value: province.incidents_count,
            districts: province.districts_count
        }));

        polygonSeries.data.setAll(mapData);

        // Configure polygon appearance
        polygonSeries.mapPolygons.template.setAll({
            tooltipText: "{name}: {value} incidents, {districts} districts",
            interactive: true,
            fill: am5.color(0xdddddd)
        });

        // Create hover state
        polygonSeries.mapPolygons.template.states.create("hover", {
            fill: am5.color(0x999999)
        });

        // Create active state
        polygonSeries.mapPolygons.template.states.create("active", {
            fill: am5.color(0x666666)
        });

        // Add legend
        const legend = chart.children.push(
            am5.Legend.new(root, {
                centerX: am5.p50,
                x: am5.p50,
                centerY: am5.p100,
                y: am5.p100,
                layout: root.horizontalLayout
            })
        );

        legend.data.setAll([{
            name: "Provinces with incidents",
            fill: am5.color(0x666666)
        }]);

        // Cleanup function
        return () => {
            root.dispose();
        };
    }, [locationStats]);
}
