import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Database, Folder, LayoutGrid, List, Tag, Users, Shield, UserCog, Video, Calendar, Building, FileText, QrCode, Globe, TabletSmartphone, AlertTriangle, AlertCircle, FileBarChart } from 'lucide-react';
import AppLogo from './app-logo';
import { LanguageSwitcher } from './language-switcher';
import { useLanguage } from '@/lib/i18n/language-context';
import React from 'react';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Info Management',
        href: '#info',
        icon: Database,
        items: [
            {
                title: 'Info Records',
                href: route('infos.index'),
                icon: List,
            },
            {
                title: 'Departments',
                href: route('departments.index'),
                icon: Building,
            },
            {
                title: 'Info Types',
                href: route('info-types.index'),
                icon: Tag,
            },
            {
                title: 'Info Categories',
                href: route('info-categories.index'),
                icon: Folder,
            },
        ],
    },
    {
        title: 'Criminals',
        href: route('criminals.index'),
        icon: FileText,
    },
    {
        title: 'Incident Management',
        href: '#incidents',
        icon: AlertTriangle,
        items: [
            {
                title: 'Incidents',
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
        title: 'Report Scan',
        href: route('reports.scan'),
        icon: QrCode,
    },
    {
        title: 'Meetings',
        href: '#meetings',
        icon: Video,
        items: [
            {
                title: 'All Meetings',
                href: route('meetings.index'),
                icon: Calendar,
            },
            {
                title: 'Create Meeting',
                href: route('meetings.create'),
                icon: Video,
            },
        ],
    },
    {
        title: 'User Management',
        href: '#users',
        icon: Users,
        items: [
            {
                title: 'Users',
                href: route('users.index'),
                icon: Users,
            },
            {
                title: 'Roles',
                href: route('roles.index'),
                icon: UserCog,
            },
            {
                title: 'Permissions',
                href: route('permissions.index'),
                icon: Shield,
            }
        ],
    },
    {
        title: 'Languages',
        href: '#languages',
        icon: Globe,
        items: [
            {
                title: 'Manage Languages',
                href: route('languages.index'),
                icon: Globe,
            },
            {
                title: 'Translations',
                href: route('translations.index'),
                icon: Tag,
            },
            {
                title: 'Language Test',
                href: route('language-test'),
                icon: TabletSmartphone,
            },
        ],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits',
        icon: BookOpen,
    },
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
        <Sidebar collapsible="icon" variant="inset" side={sidebarSide}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <div className="px-4 py-2">
                    <LanguageSwitcher variant="sidebar" />
                </div>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
