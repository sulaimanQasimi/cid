import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
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
import { hasPermission, PermissionPatterns } from '@/lib/permissions';
import React from 'react';
 

const footerNavItems: NavItem[] = [
];

function getPermissionBasedNavigation(auth: any, t: any): NavItem[] {
    const navigation: NavItem[] = [];
    
    // Dashboard - always visible
    navigation.push({ 
        title: t('sidebar.intelligence_dashboard'), 
        href: '/dashboard', 
        icon: LayoutGrid 
    });
    
    // Intelligence Operations
    const intelligenceItems: NavItem[] = [];
    if (hasPermission(auth, PermissionPatterns.info.viewAny)) {
        intelligenceItems.push({ 
            title: t('sidebar.active_cases'), 
            href: route('infos.index'), 
            icon: Target 
        });
    }
    if (hasPermission(auth, PermissionPatterns.department.viewAny)) {
        intelligenceItems.push({ 
            title: t('sidebar.surveillance'), 
            href: route('departments.index'), 
            icon: Eye 
        });
    }
    if (hasPermission(auth, PermissionPatterns.infoType.viewAny)) {
        intelligenceItems.push({ 
            title: t('sidebar.intelligence_reports'), 
            href: route('info-types.index'), 
            icon: FileBarChart 
        });
    }
    if (hasPermission(auth, PermissionPatterns.infoCategory.viewAny)) {
        intelligenceItems.push({ 
            title: t('sidebar.case_categories'), 
            href: route('info-categories.index'), 
            icon: Folder 
        });
    }
    
    if (intelligenceItems.length > 0) {
        navigation.push({
            title: t('sidebar.intelligence_operations'),
            href: '#intelligence',
            icon: ShieldCheck,
            items: intelligenceItems
        });
    }
    
    // Criminal Database
    const criminalItems: NavItem[] = [];
    if (hasPermission(auth, PermissionPatterns.criminal.viewAny)) {
        criminalItems.push({ 
            title: t('sidebar.criminal_records'), 
            href: route('criminals.index'), 
            icon: FileText 
        });
    }
    if (criminalItems.length > 0) {
        navigation.push({
            title: t('sidebar.criminal_database'),
            href: '#criminals',
            icon: Users,
            items: criminalItems
        });
    }
    
    // Incident Management
    const incidentItems: NavItem[] = [];
    if (hasPermission(auth, PermissionPatterns.incident.viewAny)) {
        incidentItems.push({ 
            title: t('sidebar.active_incidents'), 
            href: route('incidents.index'), 
            icon: AlertCircle 
        });
    }
    if (hasPermission(auth, PermissionPatterns.incidentReport.viewAny)) {
        incidentItems.push({ 
            title: t('sidebar.incident_reports'), 
            href: route('incident-reports.index'), 
            icon: FileBarChart 
        });
    }
    if (hasPermission(auth, PermissionPatterns.incidentCategory.viewAny)) {
        incidentItems.push({ 
            title: t('sidebar.incident_categories'), 
            href: route('incident-categories.index'), 
            icon: Tag 
        });
    }
    
    if (incidentItems.length > 0) {
        navigation.push({
            title: t('sidebar.incident_management'),
            href: '#incidents',
            icon: AlertTriangle,
            items: incidentItems
        });
    }
    
    // Analysis Reports
    const analysisItems: NavItem[] = [];
    if (hasPermission(auth, PermissionPatterns.report.viewAny)) {
        analysisItems.push({ 
            title: t('sidebar.report_scanner'), 
            href: route('reports.scan'), 
            icon: QrCode 
        });
    }
    
    if (analysisItems.length > 0) {
        navigation.push({
            title: t('sidebar.analysis_reports'),
            href: '#analysis',
            icon: BarChart3,
            items: analysisItems
        });
    }
    
    // Geographic Intelligence
    const geographicItems: NavItem[] = [];
    if (hasPermission(auth, PermissionPatterns.province.viewAny)) {
        geographicItems.push({ 
            title: t('sidebar.provinces'), 
            href: route('provinces.index'), 
            icon: Map 
        });
    }
    if (hasPermission(auth, PermissionPatterns.district.viewAny)) {
        geographicItems.push({ 
            title: t('sidebar.districts'), 
            href: route('districts.index'), 
            icon: MapPin 
        });
    }
    
    if (geographicItems.length > 0) {
        navigation.push({
            title: t('sidebar.geographic_intelligence'),
            href: '#geographic',
            icon: Map,
            items: geographicItems
        });
    }
    
    // System Administration
    const adminItems: NavItem[] = [];
    if (hasPermission(auth, PermissionPatterns.user.viewAny)) {
        adminItems.push({ 
            title: t('sidebar.user_management'), 
            href: route('users.index'), 
            icon: Users 
        });
    }
    if (hasPermission(auth, 'role.view_any')) {
        adminItems.push({ 
            title: t('sidebar.role_management'), 
            href: route('roles.index'), 
            icon: UserCog 
        });
    }
    if (hasPermission(auth, 'permission.view_any')) {
        adminItems.push({ 
            title: t('sidebar.security_permissions'), 
            href: route('permissions.index'), 
            icon: Shield 
        });
    }
    
    if (adminItems.length > 0) {
        navigation.push({
            title: t('sidebar.system_administration'),
            href: '#admin',
            icon: Settings,
            items: adminItems
        });
    }
    
    // Multilingual Support
    const languageItems: NavItem[] = [];
    if (hasPermission(auth, PermissionPatterns.language.viewAny)) {
        languageItems.push({ 
            title: t('sidebar.language_management'), 
            href: route('languages.index'), 
            icon: Globe 
        });
    }
    if (hasPermission(auth, PermissionPatterns.translation.viewAny)) {
        languageItems.push({ 
            title: t('sidebar.translations'), 
            href: route('translations.index'), 
            icon: Tag 
        });
    }
    
    if (languageItems.length > 0) {
        navigation.push({
            title: t('sidebar.multilingual_support'),
            href: '#languages',
            icon: Globe,
            items: languageItems
        });
    }
    
    // Data Configuration
    const dataItems: NavItem[] = [];
    if (hasPermission(auth, PermissionPatterns.statCategory.viewAny)) {
        dataItems.push({ 
            title: t('sidebar.stat_categories'), 
            href: route('stat-categories.index'), 
            icon: Database 
        });
    }
    if (hasPermission(auth, PermissionPatterns.statCategoryItem.viewAny)) {
        dataItems.push({ 
            title: t('sidebar.stat_items'), 
            href: route('stat-category-items.index'), 
            icon: Tag 
        });
    }
    
    if (dataItems.length > 0) {
        navigation.push({
            title: t('sidebar.data_configuration'),
            href: '#data',
            icon: Database,
            items: dataItems
        });
    }
    
    return navigation;
}

export function AppSidebar() {
    const { t } = useTranslation();
    const { direction } = useLanguage();
    const { auth } = usePage().props as any;
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
                    items={getPermissionBasedNavigation(auth, t)}
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
