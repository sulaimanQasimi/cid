import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { 
    BookOpen, 
    Database, 
    Folder, 
    LayoutGrid, 
    List, 
    Tag, 
    Users, 
    Shield, 
    UserCog, 
    Video, 
    Calendar, 
    Building, 
    FileText, 
    QrCode, 
    Globe, 
    TabletSmartphone, 
    AlertTriangle, 
    AlertCircle, 
    FileBarChart, 
    Map, 
    MapPin,
    ShieldCheck,
    Eye,
    Search,
    BarChart3,
    Settings,
    Lock,
    Activity,
    Target,
    Briefcase,
    Archive
} from 'lucide-react';
import AppLogo from './app-logo';
import { useLanguage } from '@/lib/i18n/language-context';
import { useTranslation } from '@/lib/i18n/translate';
import React from 'react';
 

const footerNavItems: NavItem[] = [
];

export function AppSidebar() {
    const { t } = useTranslation();
    const { direction } = useLanguage();
    // Determine sidebar side based on current language direction
    const sidebarSide = direction === 'rtl' ? 'right' : 'left';

    // Apply RTL-specific styles to force the sidebar positioning
    React.useEffect(() => {
        // Force the sidebar position based on direction
        if (direction === 'rtl') {
            // Add RTL-specific styles to override default positioning
            const style = document.createElement('style');
            style.id = 'rtl-sidebar-styles';
            style.textContent = `
                /* RTL Sidebar Positioning */
                [data-sidebar="sidebar"] {
                    right: 0 !important;
                    left: auto !important;
                }
                [data-slot="sidebar-inset"] {
                    margin-right: 0 !important;
                    margin-left: 0.5rem !important;
                }
                .fixed.md\\:flex {
                    right: 0 !important;
                    left: auto !important;
                }
                [data-side="right"] {
                    right: 0 !important;
                    left: auto !important;
                }
                .group-data-\\[side\\=left\\]\\:-right-4 {
                    left: -1rem !important;
                    right: auto !important;
                }
            `;
            document.head.appendChild(style);

            return () => {
                const existingStyle = document.getElementById('rtl-sidebar-styles');
                if (existingStyle) {
                    existingStyle.remove();
                }
            };
        }
    }, [direction]);

    return (
        <Sidebar collapsible="icon" variant="inset" side={sidebarSide} className="border-r border-border/50 bg-gradient-to-b from-background to-muted/20">
            <SidebarHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-primary/10">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-primary/10 transition-colors">
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="px-2 py-4">
                <div className="mb-4 px-3">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        <ShieldCheck className="h-3 w-3" />
                        {t('sidebar.intelligence_department')}
                    </div>
                </div>
                <NavMain
                    items={[
                        { title: t('sidebar.intelligence_dashboard'), href: '/dashboard', icon: LayoutGrid },
                        {
                            title: t('sidebar.intelligence_operations'), href: '#intelligence', icon: ShieldCheck, items: [
                                { title: t('sidebar.active_cases'), href: route('infos.index'), icon: Target },
                                { title: t('sidebar.surveillance'), href: route('departments.index'), icon: Eye },
                                { title: t('sidebar.intelligence_reports'), href: route('info-types.index'), icon: FileBarChart },
                                { title: t('sidebar.case_categories'), href: route('info-categories.index'), icon: Folder },
                            ]
                        },
                        {
                            title: t('sidebar.criminal_database'), href: '#criminals', icon: Users, items: [
                                { title: t('sidebar.criminal_records'), href: route('criminals.index'), icon: FileText },
                                { title: t('sidebar.watch_lists'), href: '#watch-lists', icon: AlertTriangle },
                            ]
                        },
                        {
                            title: t('sidebar.incident_management'), href: '#incidents', icon: AlertTriangle, items: [
                                { title: t('sidebar.active_incidents'), href: route('incidents.index'), icon: AlertCircle },
                                { title: t('sidebar.incident_reports'), href: route('incident-reports.index'), icon: FileBarChart },
                                { title: t('sidebar.incident_categories'), href: route('incident-categories.index'), icon: Tag },
                            ]
                        },
                        {
                            title: t('sidebar.analysis_reports'), href: '#analysis', icon: BarChart3, items: [
                                { title: t('sidebar.report_scanner'), href: route('reports.scan'), icon: QrCode },
                                { title: t('sidebar.analytics'), href: '#analytics', icon: BarChart3 },
                                { title: t('sidebar.archive'), href: '#archive', icon: Archive },
                            ]
                        },
                        {
                            title: t('sidebar.secure_communications'), href: '#communications', icon: Lock, items: [
                                { title: t('sidebar.secure_meetings'), href: route('meetings.index'), icon: Video },
                                { title: t('sidebar.meeting_schedule'), href: route('meetings.create'), icon: Calendar },
                            ]
                        },
                        {
                            title: t('sidebar.geographic_intelligence'), href: '#geographic', icon: Map, items: [
                                { title: t('sidebar.provinces'), href: route('provinces.index'), icon: Map },
                                { title: t('sidebar.districts'), href: route('districts.index'), icon: MapPin },
                            ]
                        },
                        {
                            title: t('sidebar.system_administration'), href: '#admin', icon: Settings, items: [
                                { title: t('sidebar.user_management'), href: route('users.index'), icon: Users },
                                { title: t('sidebar.role_management'), href: route('roles.index'), icon: UserCog },
                                { title: t('sidebar.security_permissions'), href: route('permissions.index'), icon: Shield },
                                { title: t('sidebar.system_settings'), href: '#system-settings', icon: Settings },
                            ]
                        },
                        {
                            title: t('sidebar.multilingual_support'), href: '#languages', icon: Globe, items: [
                                { title: t('sidebar.language_management'), href: route('languages.index'), icon: Globe },
                                { title: t('sidebar.translations'), href: route('translations.index'), icon: Tag },
                                { title: t('sidebar.language_testing'), href: route('language-test'), icon: TabletSmartphone },
                            ]
                        },
                        {
                            title: t('sidebar.data_configuration'), href: '#data', icon: Database, items: [
                                { title: t('sidebar.stat_categories'), href: route('stat-categories.index'), icon: Database },
                                { title: t('sidebar.stat_items'), href: route('stat-category-items.index'), icon: Tag },
                            ]
                        },
                    ] as NavItem[]}
                />
            </SidebarContent>

            <SidebarFooter className="border-t border-border/50 bg-gradient-to-t from-muted/20 to-background">
                <div className="px-4 py-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <Activity className="h-3 w-3" />
                        {t('sidebar.system_status_secure')}
                    </div>
                </div>
                <NavFooter items={footerNavItems} className="mt-auto px-4" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
