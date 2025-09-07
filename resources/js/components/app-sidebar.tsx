import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { 
    Database, 
    Folder, 
    LayoutGrid,
    Tag, 
    Users, 
    Shield, 
    UserCog, 
    Building, 
    FileText, 
    QrCode, 
    Globe, 
    AlertTriangle, 
    AlertCircle, 
    FileBarChart, 
    Map, 
    MapPin,
    ShieldCheck,
    Eye,
    BarChart3,
    Settings,
    Target,
    MessageCircle,
    Sun,
    Moon,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';
import { useTranslation } from '@/lib/i18n/translate';
import { hasPermission } from '@/lib/permissions';
import { useAppearance } from '@/hooks/use-appearance';
import { Button } from '@/components/ui/button';
import React from 'react';
 

const footerNavItems: NavItem[] = [
];

function getPermissionBasedNavigation(auth: any, t: any): NavItem[] {
    const navigation: NavItem[] = []
    // Dashboard - always visible
    navigation.push({ 
        title: t('sidebar.intelligence_dashboard'), 
        href: '/dashboard', 
        icon: LayoutGrid 
    });
    
    // Chats - always visible for authenticated users
    navigation.push({ 
        title: t('sidebar.chats'), 
        href: '/chats', 
        icon: MessageCircle 
    });
    
    // Intelligence Operations
    const intelligenceItems: NavItem[] = [];
    if (auth.permissions.includes('info.view_any')) {
        intelligenceItems.push({ 
            title: t('sidebar.active_cases'), 
            href: '/infos', 
            icon: Target 
        });
    }
    if (auth.permissions.includes('department.view_any')) {
        intelligenceItems.push({ 
            title: t('sidebar.surveillance'), 
            href: '/departments', 
            icon: Eye 
        });
    }
    if (auth.permissions.includes('info_type.view_any')) {
        intelligenceItems.push({ 
            title: t('sidebar.intelligence_reports'), 
            href: '/info-types', 
            icon: FileBarChart 
        });
    }
    if (auth.permissions.includes('info_category.view_any')) {
        intelligenceItems.push({ 
            title: t('sidebar.case_categories'), 
            href: '/info-categories', 
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
    if (auth.permissions.includes('criminal.view_any')) {
        criminalItems.push({ 
            title: t('sidebar.criminal_records'), 
            href: '/criminals', 
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
    if (auth.permissions.includes('incident.view_any')) {
        incidentItems.push({ 
            title: t('sidebar.active_incidents'), 
            href: '/incidents', 
            icon: AlertCircle 
        });
    }
    if (auth.is_admin) {
        incidentItems.push({ 
            title: t('incident_reports-access'), 
            href: '/incident-report-access', 
            icon: FileBarChart 
        });
    }
    if (auth.permissions.includes('incident_report.view_any')) {
        incidentItems.push({ 
            title: t('sidebar.incident_reports'), 
            href: '/incident-reports', 
            icon: FileBarChart 
        });
    }
    if (auth.permissions.includes('incident_category.view_any')) {
        incidentItems.push({ 
            title: t('sidebar.incident_categories'), 
            href: '/incident-categories', 
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
    if (auth.permissions.includes('report.view_any')) {
        analysisItems.push({ 
            title: t('sidebar.report_scanner'), 
            href: '/reports/scan', 
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
    if (auth.permissions.includes('province.view_any')) {
        geographicItems.push({ 
            title: t('sidebar.provinces'), 
            href: '/provinces', 
            icon: Map 
        });
    }
    if (auth.permissions.includes('district.view_any')) {
        geographicItems.push({ 
            title: t('sidebar.districts'), 
            href: '/districts', 
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
    if (auth.permissions.includes('user.view_any')) {
        adminItems.push({ 
            title: t('sidebar.user_management'), 
            href: '/users', 
            icon: Users 
        });
    }
        if (auth.permissions.includes('department.view_any')) {
        adminItems.push({ 
            title: t('sidebar.department_management'), 
            href: '/departments', 
            icon: Building 
        });
    }
    if (auth.permissions.includes('role.view_any')) {
        adminItems.push({ 
            title: t('sidebar.role_management'), 
            href: '/roles', 
            icon: UserCog 
        });
    }
    
    if (auth.permissions.includes('permission.view_any')) {
        adminItems.push({ 
            title: t('sidebar.security_permissions'), 
            href: '/permissions', 
            icon: Shield 
        });
    }
    
    // Analytics - accessible to all authenticated users
    adminItems.push({ 
        title: t('sidebar.visitor_analytics'), 
        href: '/analytics', 
        icon: BarChart3 
    });
    
    // Backup Management - admin only
    if (auth.permissions.includes('manage backups')) {
        adminItems.push({ 
            title: t('sidebar.backup_management'), 
            href: '/backup', 
            icon: Database 
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
    if (auth.permissions.includes('language.view_any')) {
        languageItems.push({ 
            title: t('sidebar.language_management'), 
            href: route('languages.index'), 
            icon: Globe 
        });
    }
    if (auth.permissions.includes('translation.view_any')) {
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
    if (auth.permissions.includes('stat_category.view_any')) {
        dataItems.push({ 
            title: t('sidebar.stat_categories'), 
            href: route('stat-categories.index'), 
            icon: Database 
        });
    }
    if (auth.permissions.includes('stat_category_item.view_any')) {
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
    const { appearance, updateAppearance } = useAppearance();

    const toggleTheme = () => {
        updateAppearance(appearance === 'light' ? 'dark' : 'light');
    };
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
                    left:  !important;
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
        <Sidebar 
            collapsible="icon" 
            variant="sidebar" 
            side={sidebarSide} 
            className="bg-slate-900 dark:bg-slate-950 border-r border-slate-800 dark:border-slate-700 shadow-2xl z-50"
        >
            {/* Clean Header */}
            <SidebarHeader className="p-4 border-b border-slate-800 dark:border-slate-700">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton 
                            size="lg" 
                            asChild 
                            className=" bg-blue-600 transition-colors justify-start text-white hover:text-blue-600 hover:bg-blue-700"
                        >
                            <Link href="/dashboard" prefetch>
                                <div className="flex items-center gap-3 w-full">
                                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                                        <ShieldCheck className="h-4 w-4 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                                        <div className="font-semibold text-white text-sm">
                                            {t('common.app_name')}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* Content Area */}
            <SidebarContent className="p-0 overflow-hidden">
                <NavMain
                    items={getPermissionBasedNavigation(auth, t)}
                />
            </SidebarContent>

            {/* Footer */}
            <SidebarFooter className="p-4 border-t border-slate-800 dark:border-slate-700 space-y-3">
                {/* Theme Toggle */}
                <div className="flex justify-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleTheme}
                        className="w-full flex items-center gap-2 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                        {appearance === 'light' ? (
                            <>
                                <Moon className="h-4 w-4" />
                                <span className="group-data-[collapsible=icon]:hidden">{t('common.dark_mode')}</span>
                            </>
                        ) : (
                            <>
                                <Sun className="h-4 w-4" />
                                <span className="group-data-[collapsible=icon]:hidden">{t('common.light_mode')}</span>
                            </>
                        )}
                    </Button>
                </div>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
