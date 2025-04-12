import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Database, Folder, LayoutGrid, List, Tag, Users, Shield, UserCog, Video, Calendar, Building, FileText, QrCode } from 'lucide-react';
import AppLogo from './app-logo';

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
    return (
        <Sidebar collapsible="icon" variant="inset">
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
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
