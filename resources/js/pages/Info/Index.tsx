import { Pagination } from '@/components/pagination';
import Header from '@/components/template/header';
import SearchFilters from '@/components/template/SearchFilters';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CanConfirm, CanDelete, CanUpdate, CanView } from '@/components/ui/permission-guard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePermissions } from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { useTranslation } from '@/lib/i18n/translate';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { AlertTriangle, BarChart3, Check, Eye, Pencil, Shield, Trash, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';

interface InfoRecord {
    id: number;
    name: string;
    code: string | null;
    description: string | null;
    info_type_id: number;
    info_category_id: number;
    department_id: number | null;
    user_id: number | null;
    created_by: number | null;
    confirmed: boolean;
    value?: any;
    created_at: string;
    updated_at: string;
    infoType?: {
        id: number;
        name: string;
    };
    infoCategory?: {
        id: number;
        name: string;
    };
    department?: {
        id: number;
        name: string;
        code: string;
    } | null;
    user?: {
        id: number;
        name: string;
    } | null;
    creator?: {
        id: number;
        name: string;
    } | null;
    // Visitor statistics
    visits_count?: number;
    unique_visitors_count?: number;
    today_visits_count?: number;
    this_week_visits_count?: number;
    this_month_visits_count?: number;
    bounce_rate?: number;
    average_time_spent?: number;
}

interface InfoCategory {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

interface InfoType {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

interface Department {
    id: number;
    name: string;
    code: string;
}

interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number;
    total: number;
}

interface Props {
    infos: {
        data?: InfoRecord[];
        links?: PaginationLinks[];
        meta?: PaginationMeta;
    };
    types: InfoType[];
    categories: InfoCategory[];
    departments: Department[];
    filters: {
        search: string;
        sort: string;
        direction: string;
        per_page: number;
        type_id?: string;
        category_id?: string;
        department_id?: string;
    };
}

const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'info_type_id', label: 'Type' },
    { value: 'info_category_id', label: 'Category' },
    { value: 'department_id', label: 'Department' },
    { value: 'created_at', label: 'Created Date' },
    { value: 'updated_at', label: 'Updated Date' },
];

const perPageOptions = [
    { value: 10, label: '10 per page' },
    { value: 25, label: '25 per page' },
    { value: 50, label: '50 per page' },
    { value: 100, label: '100 per page' },
];

export default function InfoIndex({ infos, types = [], categories = [], departments = [], filters }: Props) {
    const { canCreate, canView, canUpdate, canDelete, canConfirm } = usePermissions();
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('info.page_title'),
            href: '#',
        },
        {
            title: t('info.page_title'),
            href: route('infos.index'),
        },
    ];
    const [searchQuery, setSearchQuery] = useState(filters.search);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [infoToDelete, setInfoToDelete] = useState<InfoRecord | null>(null);
    const [selectedType, setSelectedType] = useState<string>(filters.type_id || '');
    const [selectedCategory, setSelectedCategory] = useState<string>(filters.category_id || '');
    const [selectedDepartment, setSelectedDepartment] = useState<string>(filters.department_id || '');

    // Handle search form submission
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({ search: searchQuery });
    };

    // Handle sort change
    const handleSortChange = (value: string) => {
        applyFilters({ sort: value });
    };

    // Handle direction change
    const handleDirectionChange = () => {
        const newDirection = filters.direction === 'asc' ? 'desc' : 'asc';
        applyFilters({ direction: newDirection });
    };

    // Handle per page change
    const handlePerPageChange = (value: string) => {
        applyFilters({ per_page: parseInt(value) });
    };

    // Handle type filter change
    const handleTypeChange = (value: string) => {
        setSelectedType(value);
        applyFilters({ type_id: value === '_all' ? undefined : value });
    };

    // Handle category filter change
    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
        applyFilters({ category_id: value === '_all' ? undefined : value });
    };

    // Handle department filter change
    const handleDepartmentChange = (value: string) => {
        setSelectedDepartment(value);
        applyFilters({ department_id: value === '_all' ? undefined : value });
    };

    // Navigate to page
    const goToPage = (page: number) => {
        router.get(route('infos.index'), { ...filters, page }, { preserveState: true, preserveScroll: true });
    };

    // Apply filters to the URL
    const applyFilters = (newFilters: Partial<Props['filters']>) => {
        router.get(route('infos.index'), { ...filters, ...newFilters, page: 1 }, { preserveState: true, preserveScroll: true });
    };

    // Reset all filters
    const resetFilters = () => {
        setSearchQuery('');
        setSelectedType('');
        setSelectedCategory('');
        setSelectedDepartment('');
        router.get(route('infos.index'), {
            search: '',
            sort: 'name',
            direction: 'asc',
            per_page: 10,
            page: 1,
            type_id: undefined,
            category_id: undefined,
            department_id: undefined,
        });
    };

    // Open delete confirmation dialog
    const openDeleteDialog = (info: InfoRecord) => {
        setInfoToDelete(info);
        setIsDeleteDialogOpen(true);
    };

    // Handle delete confirmation
    const confirmDelete = () => {
        if (infoToDelete) {
            router.delete(route('infos.destroy', infoToDelete.id), {
                onSuccess: () => {
                    setInfoToDelete(null);
                    setIsDeleteDialogOpen(false);
                },
            });
        }
    };

    // Handle info confirmation
    const confirmInfo = (info: InfoRecord) => {
        router.patch(
            route('infos.confirm', info.id),
            {},
            {
                onSuccess: () => {
                    // The page will refresh automatically
                },
                onError: (errors) => {
                    console.error('Confirmation error:', errors);
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('info.page_title')} />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('info.delete_dialog.title')}</AlertDialogTitle>
                        <AlertDialogDescription>{t('info.delete_dialog.description', { name: infoToDelete?.name || '' })}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>{t('info.delete_dialog.cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                            {t('info.delete_dialog.confirm')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="container px-0 py-6">
                {/* Modern Header with Glassmorphism */}
                <Header
                    title={t('info.page_title')}
                    description={t('info.page_description')}
                    buttonText={t('info.add_button')}
                    icon={<Shield className="h-10 w-10 text-white dark:text-gray-100" />}
                    model="info"
                    routeName="infos.create"
                    theme="purple"
                />

                <SearchFilters
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onSearchSubmit={handleSearch}
                    searchPlaceholder={t('info.search_placeholder')}
                    filters={{
                        type: selectedType,
                        category: selectedCategory,
                        department: selectedDepartment,
                        sort: filters.sort,
                        direction: filters.direction as 'asc' | 'desc',
                        per_page: filters.per_page
                    }}
                    onTypeChange={handleTypeChange}
                    onCategoryChange={handleCategoryChange}
                    onDepartmentChange={handleDepartmentChange}
                    onSortChange={handleSortChange}
                    onDirectionChange={handleDirectionChange}
                    onPerPageChange={handlePerPageChange}
                    onResetFilters={resetFilters}
                    types={[
                        { value: '_all', label: t('info.all_types') },
                        ...types.map(type => ({ value: type.id.toString(), label: type.name }))
                    ]}
                    categories={[
                        { value: '_all', label: t('info.all_categories') },
                        ...categories.map(category => ({ value: category.id.toString(), label: category.name }))
                    ]}
                    departments={[
                        { value: '_all', label: t('info.all_departments') },
                        ...departments.map(department => ({ value: department.id.toString(), label: department.name }))
                    ]}
                    sortOptions={sortOptions.map(option => ({
                        value: option.value,
                        label: t(`info.sort_options.${option.value}`)
                    }))}
                    perPageOptions={perPageOptions.map(option => ({
                        value: option.value,
                        label: t('info.per_page_option', { count: option.value.toString() })
                    }))}
                    title={t('info.search_filters')}
                    description={t('info.find_and_filter')}
                />

                {/* Results Table */}
                <div className="mt-8">
                    <Header
                        title={t('info.table.title')}
                        description={t('info.table.description')}
                        icon={<TrendingUp className="h-6 w-6 text-white" />}
                        model="info"
                        routeName="infos.create"
                        theme="purple"
                        buttonText={t('info.add_button')}
                    />
                    
                    <Card className="overflow-hidden rounded-lg border dark:border-gray-700 dark:bg-gray-800 shadow-sm">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50 dark:bg-muted/30">
                                        <TableHead className="px-6 py-4 font-semibold text-foreground dark:text-foreground">{t('info.table.id')}</TableHead>
                                        <TableHead className="px-6 py-4 font-semibold text-foreground dark:text-foreground">{t('info.table.name')}</TableHead>
                                        <TableHead className="px-6 py-4 font-semibold text-foreground dark:text-foreground">{t('info.table.type')}</TableHead>
                                        <TableHead className="px-6 py-4 font-semibold text-foreground dark:text-foreground">{t('info.table.category')}</TableHead>
                                        <TableHead className="px-6 py-4 font-semibold text-foreground dark:text-foreground">
                                            {t('info.table.department')}
                                        </TableHead>
                                        <TableHead className="px-6 py-4 font-semibold text-foreground dark:text-foreground">{t('info.table.owner')}</TableHead>
                                        <TableHead className="px-6 py-4 font-semibold text-foreground dark:text-foreground">{t('info.table.status')}</TableHead>
                                        <TableHead className="px-6 py-4 font-semibold text-foreground dark:text-foreground">{t('info.table.visits')}</TableHead>
                                        <TableHead className="px-6 py-4 font-semibold text-foreground dark:text-foreground">
                                            {t('info.table.created_at')}
                                        </TableHead>
                                        <TableHead className="px-6 py-4 text-right font-semibold text-foreground dark:text-foreground">
                                            {t('info.table.actions')}
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                    <TableBody>
                                        {infos.data && infos.data.length > 0 ? (
                                            infos.data.map((info: InfoRecord) => (
                                                <TableRow
                                                    key={info.id}
                                                    className="hover:bg-muted/50 dark:hover:bg-muted/30 border-b border-border dark:border-border"
                                                >
                                                    <TableCell className="px-6 py-4 font-medium text-foreground dark:text-foreground">{info.id}</TableCell>
                                                    <TableCell className="px-6 py-4 font-medium text-foreground dark:text-foreground">{info.name}</TableCell>
                                                    <TableCell className="px-6 py-4">
                                                        {info.infoType ? (
                                                            <Badge variant="secondary" className="bg-secondary text-secondary-foreground dark:bg-secondary dark:text-secondary-foreground">
                                                                {info.infoType.name}
                                                            </Badge>
                                                        ) : (
                                                            <span className="text-muted-foreground dark:text-muted-foreground">-</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="px-6 py-4">
                                                        {info.infoCategory ? (
                                                            <Badge variant="secondary" className="bg-secondary text-secondary-foreground dark:bg-secondary dark:text-secondary-foreground">
                                                                {info.infoCategory.name}
                                                            </Badge>
                                                        ) : (
                                                            <span className="text-muted-foreground dark:text-muted-foreground">-</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="px-6 py-4">
                                                        {info.department ? (
                                                            <Badge variant="secondary" className="bg-secondary text-secondary-foreground dark:bg-secondary dark:text-secondary-foreground">
                                                                {info.department.name}
                                                            </Badge>
                                                        ) : (
                                                            <span className="text-muted-foreground dark:text-muted-foreground">-</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="px-6 py-4">
                                                        {info.user ? (
                                                            <Badge variant="outline" className="border-border text-foreground dark:border-border dark:text-foreground">
                                                                {info.user.name}
                                                            </Badge>
                                                        ) : info.creator ? (
                                                            <Badge variant="outline" className="border-border text-foreground dark:border-border dark:text-foreground">
                                                                {info.creator.name}
                                                            </Badge>
                                                        ) : (
                                                            <span className="text-muted-foreground dark:text-muted-foreground">-</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="px-6 py-4">
                                                        {info.confirmed ? (
                                                            <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                                {t('info.status.confirmed')}
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                                                {t('info.status.pending')}
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="px-6 py-4">
                                                        <div className="text-center">
                                                            <div className="font-semibold text-foreground dark:text-foreground">{info.visits_count || 0}</div>
                                                            <div className="text-xs text-muted-foreground dark:text-muted-foreground">{t('info.table.visits_label')}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-6 py-4 text-muted-foreground dark:text-muted-foreground">
                                                        {new Date(info.created_at).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell className="px-6 py-4">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <CanView model="info">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    asChild
                                                                    title={t('info.actions.view')}
                                                                    className="h-8 w-8"
                                                                >
                                                                    <Link href={route('infos.show', info.id)}>
                                                                        <Eye className="h-4 w-4" />
                                                                    </Link>
                                                                </Button>
                                                            </CanView>
                                                            <CanUpdate model="info">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    asChild
                                                                    disabled={info.confirmed}
                                                                    title={
                                                                        info.confirmed
                                                                            ? t('info.actions.cannot_edit_confirmed')
                                                                            : t('info.actions.edit')
                                                                    }
                                                                    className="h-8 w-8"
                                                                >
                                                                    <Link href={route('infos.edit', info.id)}>
                                                                        <Pencil className="h-4 w-4" />
                                                                    </Link>
                                                                </Button>
                                                            </CanUpdate>
                                                            <CanDelete model="info">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => openDeleteDialog(info)}
                                                                    disabled={info.confirmed}
                                                                    title={
                                                                        info.confirmed
                                                                            ? t('info.actions.cannot_delete_confirmed')
                                                                            : t('info.actions.delete')
                                                                    }
                                                                    className="h-8 w-8"
                                                                >
                                                                    <Trash className="h-4 w-4" />
                                                                </Button>
                                                            </CanDelete>
                                                            <CanConfirm model="info">
                                                                {!info.confirmed && (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => confirmInfo(info)}
                                                                        title={t('info.actions.confirm')}
                                                                        className="h-8 w-8"
                                                                    >
                                                                        <Check className="h-4 w-4" />
                                                                    </Button>
                                                                )}
                                                            </CanConfirm>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                asChild
                                                                title={t('criminal.analytics.view_analytics')}
                                                                className="h-8 w-8"
                                                            >
                                                                <Link href={`/analytics/Info/${info.id}`}>
                                                                    <BarChart3 className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={10} className="h-32 text-center">
                                                    <div className="flex flex-col items-center gap-4 text-muted-foreground dark:text-muted-foreground">
                                                        <div className="rounded-full bg-muted dark:bg-black p-4">
                                                            <AlertTriangle className="h-8 w-8 text-muted-foreground dark:text-muted-foreground dark:bg-black" />
                                                        </div>
                                                        <p className="text-lg font-semibold text-foreground dark:text-foreground">{t('info.no_records')}</p>
                                                        <p className="text-sm text-muted-foreground dark:text-muted-foreground">{t('info.no_records_description')}</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                        </CardContent>
                    </Card>
                </div>

                {/* Pagination */}
                {infos && infos.links && infos.links.length > 0 && (
                    <div className="mt-6 flex justify-center">
                        <Pagination links={infos.links} />
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
