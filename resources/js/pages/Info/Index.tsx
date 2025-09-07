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
                    <Card className="overflow-hidden rounded-3xl border-0 bg-gradient-to-bl from-white to-purple-50/30 dark:from-gray-800 dark:to-purple-900/30 shadow-2xl">
                        <CardHeader className="bg-gradient-to-l from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 py-6 text-white dark:text-gray-100">
                            <CardTitle className="flex items-center gap-4">
                                <div className="rounded-2xl bg-white/20 dark:bg-gray-800/20 p-3 shadow-lg backdrop-blur-sm">
                                    <TrendingUp className="h-6 w-6" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{t('info.table.title')}</div>
                                    <div className="text-sm font-medium text-purple-100 dark:text-purple-200">{t('info.table.description')}</div>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-hidden rounded-b-3xl">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-0 bg-gradient-to-l from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-900">
                                            <TableHead className="px-6 py-6 text-lg font-bold text-purple-800 dark:text-purple-200">{t('info.table.id')}</TableHead>
                                            <TableHead className="px-6 py-6 text-lg font-bold text-purple-800 dark:text-purple-200">{t('info.table.name')}</TableHead>
                                            <TableHead className="px-6 py-6 text-lg font-bold text-purple-800 dark:text-purple-200">{t('info.table.type')}</TableHead>
                                            <TableHead className="px-6 py-6 text-lg font-bold text-purple-800 dark:text-purple-200">{t('info.table.category')}</TableHead>
                                            <TableHead className="px-6 py-6 text-lg font-bold text-purple-800 dark:text-purple-200">
                                                {t('info.table.department')}
                                            </TableHead>
                                            <TableHead className="px-6 py-6 text-lg font-bold text-purple-800 dark:text-purple-200">{t('info.table.owner')}</TableHead>
                                            <TableHead className="px-6 py-6 text-lg font-bold text-purple-800 dark:text-purple-200">{t('info.table.status')}</TableHead>
                                            <TableHead className="px-6 py-6 text-lg font-bold text-purple-800 dark:text-purple-200">{t('info.table.visits')}</TableHead>
                                            <TableHead className="px-6 py-6 text-lg font-bold text-purple-800 dark:text-purple-200">
                                                {t('info.table.created_at')}
                                            </TableHead>
                                            <TableHead className="px-6 py-6 text-right text-lg font-bold text-purple-800 dark:text-purple-200">
                                                {t('info.table.actions')}
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {infos.data && infos.data.length > 0 ? (
                                            infos.data.map((info: InfoRecord) => (
                                                <TableRow
                                                    key={info.id}
                                                    className="border-b border-purple-100 dark:border-purple-800 transition-colors duration-300 hover:bg-purple-50/50 dark:hover:bg-purple-900/50"
                                                >
                                                    <TableCell className="px-6 py-6 text-lg font-bold text-purple-900 dark:text-purple-100">{info.id}</TableCell>
                                                    <TableCell className="px-6 py-6 text-lg font-bold text-purple-900 dark:text-purple-100">{info.name}</TableCell>
                                                    <TableCell className="px-6 py-6">
                                                        {info.infoType ? (
                                                            <Badge
                                                                variant="outline"
                                                                className="rounded-xl border-purple-300 dark:border-purple-600 bg-gradient-to-l from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-900 px-4 py-2 font-semibold text-purple-800 dark:text-purple-200"
                                                            >
                                                                {info.infoType.name}
                                                            </Badge>
                                                        ) : (
                                                            <span className="font-medium text-purple-600 dark:text-purple-400">-</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="px-6 py-6">
                                                        {info.infoCategory ? (
                                                            <Badge
                                                                variant="outline"
                                                                className="rounded-xl border-purple-300 dark:border-purple-600 bg-gradient-to-l from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-900 px-4 py-2 font-semibold text-purple-800 dark:text-purple-200"
                                                            >
                                                                {info.infoCategory.name}
                                                            </Badge>
                                                        ) : (
                                                            <span className="font-medium text-purple-600 dark:text-purple-400">-</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="px-6 py-6">
                                                        {info.department ? (
                                                            <Badge
                                                                variant="outline"
                                                                className="rounded-xl border-purple-300 dark:border-purple-600 bg-gradient-to-l from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-900 px-4 py-2 font-semibold text-purple-800 dark:text-purple-200"
                                                            >
                                                                {info.department.name}
                                                            </Badge>
                                                        ) : (
                                                            <span className="font-medium text-purple-600 dark:text-purple-400">-</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="px-6 py-6">
                                                        {info.user ? (
                                                            <Badge
                                                                variant="outline"
                                                                className="rounded-xl border-blue-300 dark:border-blue-600 bg-gradient-to-l from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900 px-4 py-2 font-semibold text-blue-800 dark:text-blue-200"
                                                            >
                                                                {info.user.name}
                                                            </Badge>
                                                        ) : info.creator ? (
                                                            <Badge
                                                                variant="outline"
                                                                className="rounded-xl border-green-300 dark:border-green-600 bg-gradient-to-l from-green-100 to-green-200 dark:from-green-800 dark:to-green-900 px-4 py-2 font-semibold text-green-800 dark:text-green-200"
                                                            >
                                                                {info.creator.name}
                                                            </Badge>
                                                        ) : (
                                                            <span className="font-medium text-purple-600 dark:text-purple-400">-</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="px-6 py-6">
                                                        {info.confirmed ? (
                                                            <Badge
                                                                variant="outline"
                                                                className="rounded-xl border-green-300 dark:border-green-600 bg-gradient-to-l from-green-100 to-green-200 dark:from-green-800 dark:to-green-900 px-4 py-2 font-semibold text-green-800 dark:text-green-200"
                                                            >
                                                                {t('info.status.confirmed')}
                                                            </Badge>
                                                        ) : (
                                                            <Badge
                                                                variant="outline"
                                                                className="rounded-xl border-yellow-300 dark:border-yellow-600 bg-gradient-to-l from-yellow-100 to-yellow-200 dark:from-yellow-800 dark:to-yellow-900 px-4 py-2 font-semibold text-yellow-800 dark:text-yellow-200"
                                                            >
                                                                {t('info.status.pending')}
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="px-6 py-6">
                                                        <div className="flex flex-col items-center gap-1">
                                                            <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{info.visits_count || 0}</div>
                                                            <div className="text-xs text-purple-500 dark:text-purple-400">{t('info.table.visits_label')}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-6 py-6 font-medium text-purple-800 dark:text-purple-200">
                                                        {new Date(info.created_at).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell className="px-6 py-6">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <CanView model="info">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    asChild
                                                                    title={t('info.actions.view')}
                                                                    className="h-10 w-10 rounded-xl text-blue-600 dark:text-blue-400 transition-all duration-300 hover:scale-110 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300"
                                                                >
                                                                    <Link href={route('infos.show', info.id)}>
                                                                        <Eye className="h-5 w-5" />
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
                                                                    className={`h-10 w-10 rounded-xl transition-all duration-300 hover:scale-110 ${
                                                                        info.confirmed
                                                                            ? 'cursor-not-allowed text-gray-400 dark:text-gray-500 opacity-50'
                                                                            : 'text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900 hover:text-green-700 dark:hover:text-green-300'
                                                                    }`}
                                                                >
                                                                    <Link href={route('infos.edit', info.id)}>
                                                                        <Pencil className="h-5 w-5" />
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
                                                                    className={`h-10 w-10 rounded-xl transition-all duration-300 hover:scale-110 ${
                                                                        info.confirmed
                                                                            ? 'cursor-not-allowed text-gray-400 dark:text-gray-500 opacity-50'
                                                                            : 'text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-700 dark:hover:text-red-300'
                                                                    }`}
                                                                >
                                                                    <Trash className="h-5 w-5" />
                                                                </Button>
                                                            </CanDelete>
                                                            <CanConfirm model="info">
                                                                {!info.confirmed && (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => confirmInfo(info)}
                                                                        title={t('info.actions.confirm')}
                                                                        className="h-10 w-10 rounded-xl text-green-600 dark:text-green-400 transition-all duration-300 hover:scale-110 hover:bg-green-100 dark:hover:bg-green-900 hover:text-green-700 dark:hover:text-green-300"
                                                                    >
                                                                        <Check className="h-5 w-5" />
                                                                    </Button>
                                                                )}
                                                            </CanConfirm>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                asChild
                                                                title={t('criminal.analytics.view_analytics')}
                                                                className="h-10 w-10 rounded-xl text-purple-600 dark:text-purple-400 transition-all duration-300 hover:scale-110 hover:bg-purple-100 dark:hover:bg-purple-900 hover:text-purple-700 dark:hover:text-purple-300"
                                                            >
                                                                <Link href={`/analytics/Info/${info.id}`}>
                                                                    <BarChart3 className="h-5 w-5" />
                                                                </Link>
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={10} className="h-32 text-center">
                                                    <div className="flex flex-col items-center gap-4 text-purple-600 dark:text-purple-400">
                                                        <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-4">
                                                            <AlertTriangle className="h-16 w-16 text-purple-400 dark:text-purple-500" />
                                                        </div>
                                                        <p className="text-xl font-bold">{t('info.no_records')}</p>
                                                        <p className="text-purple-500 dark:text-purple-400">{t('info.no_records_description')}</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Pagination */}
                {infos && infos.links && infos.links.length > 0 && (
                    <div className="mt-8 flex justify-center">
                        <div className="rounded-3xl border border-purple-200 dark:border-purple-700 bg-gradient-to-l from-purple-50 to-white dark:from-purple-900 dark:to-gray-800 p-4 shadow-2xl">
                            <Pagination links={infos.links} />
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
