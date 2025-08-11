import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ShieldCheck, Activity, Target, AlertTriangle, BarChart3, Users, Map, FileText } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Intelligence Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
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
                                <p className="text-sm font-medium text-muted-foreground">Active Cases</p>
                                <p className="text-2xl font-bold text-foreground">24</p>
                            </div>
                            <Target className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/50 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Incidents</p>
                                <p className="text-2xl font-bold text-foreground">8</p>
                            </div>
                            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
                        </div>
                    </div>
                    
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Criminal Records</p>
                                <p className="text-2xl font-bold text-foreground">156</p>
                            </div>
                            <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Reports Generated</p>
                                <p className="text-2xl font-bold text-foreground">42</p>
                            </div>
                            <FileText className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Recent Activity */}
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border">
                        <div className="border-b border-border/50 bg-muted/20 px-6 py-4">
                            <h3 className="font-semibold">Recent Activity</h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">New case assigned: Operation Phoenix</p>
                                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Incident reported: District 3</p>
                                        <p className="text-xs text-muted-foreground">4 hours ago</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Report generated: Monthly Summary</p>
                                        <p className="text-xs text-muted-foreground">6 hours ago</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* System Status */}
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border">
                        <div className="border-b border-border/50 bg-muted/20 px-6 py-4">
                            <h3 className="font-semibold">System Status</h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Database Security</span>
                                    <div className="flex items-center gap-1">
                                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                        <span className="text-xs text-muted-foreground">Secure</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Network Encryption</span>
                                    <div className="flex items-center gap-1">
                                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                        <span className="text-xs text-muted-foreground">Active</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">User Authentication</span>
                                    <div className="flex items-center gap-1">
                                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                        <span className="text-xs text-muted-foreground">Verified</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Backup System</span>
                                    <div className="flex items-center gap-1">
                                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                        <span className="text-xs text-muted-foreground">Online</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Visitor Analytics Section */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Today's Visitor Statistics */}
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border">
                        <div className="border-b border-border/50 bg-muted/20 px-6 py-4">
                            <h3 className="font-semibold">{t('dashboard.visitor_analytics.title')}</h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">{t('dashboard.visitor_analytics.total_visits')}</span>
                                    <span className="text-lg font-semibold text-blue-600">24</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">{t('dashboard.visitor_analytics.unique_visitors')}</span>
                                    <span className="text-lg font-semibold text-green-600">18</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">{t('dashboard.visitor_analytics.records_viewed')}</span>
                                    <span className="text-lg font-semibold text-purple-600">12</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">{t('dashboard.visitor_analytics.avg_time_spent')}</span>
                                    <span className="text-lg font-semibold text-orange-600">4m 32s</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Visitor Insights */}
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border">
                        <div className="border-b border-border/50 bg-muted/20 px-6 py-4">
                            <h3 className="font-semibold">{t('dashboard.visitor_insights.title')}</h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">{t('dashboard.visitor_insights.bounce_rate')}</span>
                                    <span className="text-lg font-semibold text-red-600">23%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">{t('dashboard.visitor_insights.most_active_department')}</span>
                                    <span className="text-lg font-semibold text-blue-600">Investigation</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">{t('dashboard.visitor_insights.top_viewed_record')}</span>
                                    <span className="text-lg font-semibold text-green-600">Case #CR-2024-001</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">{t('dashboard.visitor_insights.peak_activity_time')}</span>
                                    <span className="text-lg font-semibold text-purple-600">2:00 PM</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Full Width Chart Area */}
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[300px] overflow-hidden rounded-xl border">
                    <div className="border-b border-border/50 bg-muted/20 px-6 py-4">
                        <h3 className="font-semibold">Intelligence Analytics</h3>
                    </div>
                    <div className="p-6">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        <div className="relative z-10 flex h-64 items-center justify-center">
                            <div className="text-center">
                                <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground/50" />
                                <p className="mt-2 text-sm text-muted-foreground">Analytics dashboard coming soon</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
