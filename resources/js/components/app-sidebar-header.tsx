import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 dark:border-gray-700 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4 bg-white dark:bg-gray-900">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
        </header>
    );
}
