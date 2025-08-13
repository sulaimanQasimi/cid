import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

// Simple clean navigation styling to match the image design

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
    const { state } = useSidebar();
    const isCollapsed = state === 'collapsed';

    const toggleSubmenu = (title: string) => {
        setOpenSubmenu(openSubmenu === title ? null : title);
    };

    const renderNavItem = (item: NavItem) => {
        const hasItems = item.items && item.items.length > 0;
        const isActive = item.href === page.url ||
            (hasItems && item.items?.some(subItem => subItem.href === page.url));

        if (hasItems) {
            const isOpen = openSubmenu === item.title;
            
            return (
                <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                        asChild
                        tooltip={{ children: item.title }}
                        isActive={isActive}
                        className="mx-3 my-1 text-blue-900 hover:text-blue-900 hover:bg-blue-200 data-[active=true]:bg-blue-600 data-[active=true]:text-white transition-colors rounded-md"
                    >
                        <Link href={item.href || '#'} prefetch>
                            <div className="flex items-center gap-3 w-full">
                                {item.icon && <item.icon className="h-4 w-4 text-blue-900 group-hover:text-blue-900 group-data-[active=true]:text-black" />}
                                {!isCollapsed && <span className="text-sm font-medium">{item.title}</span>}
                            </div>
                            {!isCollapsed && item.items && item.items.length > 0 && (
                                <ChevronDown 
                                    className={`ml-auto h-4 w-4 text-blue-900 group-hover:text-blue-900 group-data-[active=true]:text-black transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        toggleSubmenu(item.title);
                                    }}
                                />
                            )}
                        </Link>
                    </SidebarMenuButton>

                    {isOpen && !isCollapsed && item.items && item.items.length > 0 && (
                        <div className="ml-6 space-y-1 pl-2">
                            {item.items.map((subItem) => (
                                <SidebarMenuButton
                                    key={subItem.title}
                                    asChild
                                    isActive={subItem.href === page.url}
                                    tooltip={{ children: subItem.title }}
                                    className="mx-3 text-blue-900 hover:text-blue-900 hover:bg-blue-200 data-[active=true]:bg-blue-600 data-[active=true]:text-white transition-colors rounded-md"
                                >
                                    <Link href={subItem.href || '#'} prefetch>
                                        <div className="flex items-center gap-3 w-full pl-4">
                                            {subItem.icon && <subItem.icon className="h-3 w-3 text-blue-900 group-hover:text-blue-900 group-data-[active=true]:text-black" />}
                                            <span className="text-xs">{subItem.title}</span>
                                        </div>
                                    </Link>
                                </SidebarMenuButton>
                            ))}
                        </div>
                    )}
                </SidebarMenuItem>
            );
        }
        
        return (
            <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={{ children: item.title }}
                    className="mx-3 my-1 text-blue-900 hover:text-blue-900 hover:bg-blue-200 data-[active=true]:bg-blue-600 data-[active=true]:text-white transition-colors rounded-md"
                >
                    <Link href={item.href || '#'} prefetch>
                        <div className="flex items-center gap-3 w-full">
                            {item.icon && <item.icon className="h-4 w-4 text-blue-900 group-hover:text-blue-900 group-data-[active=true]:text-black" />}
                            {!isCollapsed && <span className="text-sm font-medium">{item.title}</span>}
                        </div>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        );
    };

    return (
        <SidebarGroup className="px-0 py-4">
            <SidebarMenu className="space-y-1">
                {items.map(renderNavItem)}
            </SidebarMenu>
        </SidebarGroup>
    );
}
