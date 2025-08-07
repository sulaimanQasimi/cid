import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuAction
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

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
                        onClick={() => toggleSubmenu(item.title)}
                        tooltip={{ children: item.title }}
                        isActive={isActive}
                        className="w-full flex items-center justify-between hover:bg-primary/5 transition-colors"
                    >
                        <div className="flex items-center">
                            {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                            <span className="font-medium">{item.title}</span>
                        </div>
                        <ChevronDown className={`ml-auto h-4 w-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </SidebarMenuButton>

                    {isOpen && (
                        <div className="ml-6 mt-1 space-y-1 border-l border-border/50 pl-2">
                            {item.items?.map((subItem) => (
                                <SidebarMenuButton
                                    key={subItem.title}
                                    asChild
                                    isActive={subItem.href === page.url}
                                    tooltip={{ children: subItem.title }}
                                    className="pl-4 hover:bg-primary/5 transition-colors"
                                >
                                    <Link href={subItem.href || '#'} prefetch>
                                        {subItem.icon && <subItem.icon className="h-4 w-4 mr-2" />}
                                        <span className="text-sm">{subItem.title}</span>
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
                    className="hover:bg-primary/5 transition-colors"
                >
                    <Link href={item.href || '#'} prefetch>
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span className="font-medium">{item.title}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        );
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarMenu>
                {items.map(renderNavItem)}
            </SidebarMenu>
        </SidebarGroup>
    );
}
