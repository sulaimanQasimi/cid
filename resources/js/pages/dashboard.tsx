import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ShieldCheck, Activity, Target, AlertTriangle, BarChart3, Users, Map, FileText, Eye, Clock, TrendingUp, MapPin } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';
import { useEffect, useRef } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import * as am5geodata from '@amcharts/amcharts5-geodata';

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
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Intelligence Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Intelligence Dashboard</h1>
                        <p className="text-muted-foreground">Secure operations overview and system status</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span>System Status: Secure</span>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{t('dashboard.active_cases')}</p>
                                <p className="text-2xl font-bold text-foreground">{stats.active_incidents}</p>
                            </div>
                            <Target className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/50 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{t('dashboard.active_incidents')}</p>
                                <p className="text-2xl font-bold text-foreground">{stats.active_incidents}</p>
                            </div>
                            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
                        </div>
                    </div>
                    
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{t('dashboard.total_provinces')}</p>
                                <p className="text-2xl font-bold text-foreground">{stats.total_provinces}</p>
                            </div>
                            <MapPin className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{t('dashboard.reports_generated')}</p>
                                <p className="text-2xl font-bold text-foreground">{stats.total_reports}</p>
                            </div>
                            <FileText className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                </div>

                {/* Location Statistics */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Province Statistics */}
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border">
                        <div className="border-b border-border/50 bg-muted/20 px-6 py-4">
                            <h3 className="font-semibold">{t('dashboard.province_statistics')}</h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">{t('dashboard.total_provinces')}</span>
                                    <span className="text-lg font-semibold text-blue-600">{locationStats.provinces.length}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">{t('dashboard.total_districts')}</span>
                                    <span className="text-lg font-semibold text-green-600">{locationStats.districts.length}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">{t('dashboard.total_incidents')}</span>
                                    <span className="text-lg font-semibold text-purple-600">{incidentStats.total_incidents}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">{t('dashboard.active_incidents')}</span>
                                    <span className="text-lg font-semibold text-orange-600">{incidentStats.pending_incidents + incidentStats.investigating_incidents}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* System Status */}
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border">
                        <div className="border-b border-border/50 bg-muted/20 px-6 py-4">
                            <h3 className="font-semibold">{t('dashboard.system_status')}</h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">{t('dashboard.system_status')}</span>
                                    <div className="flex items-center gap-1">
                                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                        <span className="text-xs text-muted-foreground">{systemHealth.system_status}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">{t('dashboard.database_size')}</span>
                                    <span className="text-xs text-muted-foreground">{systemHealth.database_size}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">{t('dashboard.storage_usage')}</span>
                                    <span className="text-xs text-muted-foreground">{systemHealth.storage_usage.usage_percentage}%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">{t('dashboard.storage_free')}</span>
                                    <span className="text-xs text-muted-foreground">{systemHealth.storage_usage.free}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AmCharts Map */}
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[500px] overflow-hidden rounded-xl border">
                    <div className="border-b border-border/50 bg-muted/20 px-6 py-4">
                        <h3 className="font-semibold">{t('dashboard.location_map')}</h3>
                    </div>
                    <div className="p-6">
                        <div id="mapChart" className="h-96 w-full"></div>
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
