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
import { LanguageSwitcher } from './language-switcher';
import { useLanguage } from '@/lib/i18n/language-context';
import React from 'react';

const mainNavItems: NavItem[] = [
    {
        title: 'Intelligence Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Intelligence Operations',
        href: '#intelligence',
        icon: ShieldCheck,
        items: [
            {
                title: 'Active Cases',
                href: route('infos.index'),
                icon: Target,
            },
            {
                title: 'Surveillance',
                href: route('departments.index'),
                icon: Eye,
            },
            {
                title: 'Intelligence Reports',
                href: route('info-types.index'),
                icon: FileBarChart,
            },
            {
                title: 'Case Categories',
                href: route('info-categories.index'),
                icon: Folder,
            },
        ],
    },
    {
        title: 'Criminal Database',
        href: '#criminals',
        icon: Users,
        items: [
            {
                title: 'Criminal Records',
                href: route('criminals.index'),
                icon: FileText,
            },
            {
                title: 'Watch Lists',
                href: '#watch-lists',
                icon: AlertTriangle,
            },
        ],
    },
    {
        title: 'Incident Management',
        href: '#incidents',
        icon: AlertTriangle,
        items: [
            {
                title: 'Active Incidents',
                href: route('incidents.index'),
                icon: AlertCircle,
            },
            {
                title: 'Incident Reports',
                href: route('incident-reports.index'),
                icon: FileBarChart,
            },
            {
                title: 'Incident Categories',
                href: route('incident-categories.index'),
                icon: Tag,
            },
        ],
    },
    {
        title: 'Analysis & Reports',
        href: '#analysis',
        icon: BarChart3,
        items: [
            {
                title: 'Report Scanner',
                href: route('reports.scan'),
                icon: QrCode,
            },
            {
                title: 'Analytics',
                href: '#analytics',
                icon: BarChart3,
            },
            {
                title: 'Archive',
                href: '#archive',
                icon: Archive,
            },
        ],
    },
    {
        title: 'Secure Communications',
        href: '#communications',
        icon: Lock,
        items: [
            {
                title: 'Secure Meetings',
                href: route('meetings.index'),
                icon: Video,
            },
            {
                title: 'Meeting Schedule',
                href: route('meetings.create'),
                icon: Calendar,
            },
        ],
    },
    {
        title: 'Geographic Intelligence',
        href: '#geographic',
        icon: Map,
        items: [
            {
                title: 'Provinces',
                href: route('provinces.index'),
                icon: Map,
            },
            {
                title: 'Districts',
                href: route('districts.index'),
                icon: MapPin,
            },
        ],
    },
    {
        title: 'System Administration',
        href: '#admin',
        icon: Settings,
        items: [
            {
                title: 'User Management',
                href: route('users.index'),
                icon: Users,
            },
            {
                title: 'Role Management',
                href: route('roles.index'),
                icon: UserCog,
            },
            {
                title: 'Security Permissions',
                href: route('permissions.index'),
                icon: Shield,
            },
            {
                title: 'System Settings',
                href: '#system-settings',
                icon: Settings,
            },
        ],
    },
    {
        title: 'Multilingual Support',
        href: '#languages',
        icon: Globe,
        items: [
            {
                title: 'Language Management',
                href: route('languages.index'),
                icon: Globe,
            },
            {
                title: 'Translations',
                href: route('translations.index'),
                icon: Tag,
            },
            {
                title: 'Language Testing',
                href: route('language-test'),
                icon: TabletSmartphone,
            },
        ],
    },
    {
        title: 'Data Configuration',
        href: '#data',
        icon: Database,
        items: [
            {
                title: 'Stat Categories',
                href: route('stat-categories.index'),
                icon: Database,
            },
            {
                title: 'Stat Items',
                href: route('stat-category-items.index'),
                icon: Tag,
            },
        ],
    },
];

const footerNavItems: NavItem[] = [
];

export function AppSidebar() {
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
                        Intelligence Department
                    </div>
                </div>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="border-t border-border/50 bg-gradient-to-t from-muted/20 to-background">
                <div className="px-4 py-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <Activity className="h-3 w-3" />
                        System Status: Secure
                    </div>
                </div>
                <NavFooter items={footerNavItems} className="mt-auto px-4" />
                <div className="px-4 py-2">
                    <LanguageSwitcher variant="sidebar" />
                </div>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
