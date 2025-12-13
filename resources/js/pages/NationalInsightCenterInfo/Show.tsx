import Header from '@/components/template/header';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CanCreate, CanDelete, CanUpdate, CanView } from '@/components/ui/permission-guard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePermissions } from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { useTranslation } from '@/lib/i18n/translate';
import { formatPersianDateOnly } from '@/lib/utils/date';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, BarChart3, Calendar, CheckCircle, ExternalLink, FileText, Pencil, Plus, Printer, Trash, TrendingUp } from 'lucide-react';
import React from 'react';

interface Info {
    id: number;
    name: string;
    code: string;
    description: string;
    confirmed: boolean;
    created_at: string;
    updated_at: string;
    info_type: {
        id: number;
        name: string;
    };
    info_category: {
        id: number;
        name: string;
    };
    item_stats?: Array<{
        id: number;
        string_value: string;
        notes: string | null;
        stat_category_item: {
            id: number;
            name: string;
            label: string;
            category: {
                id: number;
                name: string;
                label: string;
                color: string;
            };
        };
    }>;
}

interface InfoStat {
    id: number;
    stat_category_item_id: number;
    string_value: string;
    notes: string | null;
    statCategoryItem: {
        id: number;
        name: string;
        label: string;
        category: {
            id: number;
            name: string;
            label: string;
            color: string;
        };
    };
}

interface NationalInsightCenterInfo {
    id: number;
    confirmed: boolean;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    code: string;
    date: string | null;
    created_by?: number;
    creator?: {
        id: number;
        name: string;
    };
    infoStats?: InfoStat[];
}

interface InfoCategory {
    id: number;
    name: string;
    description: string | null;
    code: string;
    created_at: string;
    updated_at: string;
}

interface Department {
    id: number;
    name: string;
    code: string;
}

interface AggregatedStat {
    id: number;
    string_value: string;
    notes: string | null;
    stat_category_item: {
        id: number;
        name: string;
        label: string;
        category: {
            id: number;
            name: string;
            label: string;
            color: string;
        };
    };
    national_insight_center_info_item?: {
        id: number;
        title: string;
    };
}

interface StatSum {
    stat_category_item_id: number;
    stat_category_id: number;
    parent_id: number | null;
    item_name: string;
    item_label: string;
    item_color: string | null;
    item_status: string;
    item_order: number;
    category_id: number;
    category_name: string;
    category_label: string;
    category_color: string | null;
    category_status: string;
    total_integer_value: number;
}

interface Props {
    nationalInsightCenterInfo: NationalInsightCenterInfo;
    infos: {
        data: Info[];
        links: any[];
    };
    aggregatedStats?: AggregatedStat[];
    statSums?: StatSum[];
    infoCategories?: InfoCategory[];
    departments?: Department[];
}

export default function ShowNationalInsightCenterInfo({
    nationalInsightCenterInfo,
    infos,
    aggregatedStats = [],
    statSums = [],
    infoCategories = [],
    departments = [],
}: Props) {
    const { t } = useTranslation();
    const { auth } = usePage().props as any;
    const { canCreate, canView, canUpdate, canDelete, can } = usePermissions();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState<Info | null>(null);
    const [isItemModalOpen, setIsItemModalOpen] = React.useState(false);

    // Check if current user is the creator of the NationalInsightCenterInfo
    const isCreator = auth?.user?.id === (nationalInsightCenterInfo.created_by || nationalInsightCenterInfo.creator?.id);

    const handleConfirmItem = (itemId: number) => {
        router.patch(route('national-insight-center-info-items.confirm', itemId), {}, {
            preserveScroll: true,
            onSuccess: () => {
                // Success is handled by the redirect with flash message
            },
        });
    };

    // Group statSums by category_name
    const categories = React.useMemo(() => {
        return statSums.reduce(
            (acc, item) => {
                const categoryName = item.category_name || 'بدون دسته‌بندی';
                if (!acc[categoryName]) {
                    acc[categoryName] = [];
                }
                acc[categoryName].push(item);
                return acc;
            },
            {} as Record<string, StatSum[]>,
        );
    }, [statSums]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('national_insight_center_info.page_title'),
            href: route('national-insight-center-infos.index'),
        },
        {
            title: nationalInsightCenterInfo.name,
            href: '#',
        },
    ];

    const handleDelete = () => {
        router.delete(route('national-insight-center-infos.destroy', nationalInsightCenterInfo.id), {
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
            },
        });
    };

    const handleViewItem = (item: Info) => {
        setSelectedItem(item);
        setIsItemModalOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('national_insight_center_info.show.title', { name: nationalInsightCenterInfo.name })} />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('national_insight_center_info.delete_dialog.title')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('national_insight_center_info.delete_dialog.description', { name: nationalInsightCenterInfo.name })}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('national_insight_center_info.delete_dialog.cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            {t('national_insight_center_info.delete_dialog.confirm')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="container px-0 py-6">
                {/* Modern Header with Glassmorphism */}

                <Header
                    title={t('national_insight_center_info.show.title', { name: nationalInsightCenterInfo.name })}
                    description={t('national_insight_center_info.show.description')}
                    icon={<TrendingUp className="h-6 w-6 text-white" />}
                    model="national_insight_center_info"
                    routeName={route('national-insight-center-infos.show', { national_insight_center_info: nationalInsightCenterInfo.id })}
                    theme="purple"
                    buttonText={t('common.edit', { name: nationalInsightCenterInfo.name })}
                    showBackButton={true}
                    backRouteName={route('national-insight-center-infos.index')}
                    backButtonText={t('common.back_to_list')}
                    showButton={false}
                    actionButtons={
                        <>
                            {!nationalInsightCenterInfo.confirmed && (
                                <>
                                    <CanDelete model="national_insight_center_info">
                                        <Button
                                            size="lg"
                                            variant="destructive"
                                            onClick={() => setIsDeleteDialogOpen(true)}
                                            className="rounded-2xl border-red-300/30 bg-red-500/20 px-4 py-3 text-white shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-red-500/30"
                                        >
                                            <Trash className="h-5 w-5" />
                                        </Button>
                                    </CanDelete>
                                    <CanUpdate model="national_insight_center_info">
                                        <Button
                                            asChild
                                            size="lg"
                                            className="rounded-2xl border-white/30 bg-white/20 px-4 py-3 text-white shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/30"
                                        >
                                            <Link
                                                href={route('national-insight-center-infos.edit', nationalInsightCenterInfo.id)}
                                                className="flex items-center"
                                            >
                                                <Pencil className="h-5 w-5" />
                                            </Link>
                                        </Button>
                                    </CanUpdate>
                                </>
                            )}
                            <Button
                                asChild
                                size="lg"
                                className="rounded-2xl border-white/30 bg-white/20 px-4 py-3 text-white shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/30"
                            >
                                <Link href={route('national-insight-center-infos.print', nationalInsightCenterInfo.id)} className="flex items-center">
                                    <Printer className="h-5 w-5" />
                                </Link>
                            </Button>
                            {can('national_insight_center_info.print_dates') && (
                                <Button
                                    asChild
                                    size="lg"
                                    className="rounded-2xl border-white/30 bg-white/20 px-4 py-3 text-white shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/30"
                                    title={t('weekly_report.page_title')}
                                >
                                    <Link
                                        href={route('national-insight-center-infos.weekly-report', nationalInsightCenterInfo.id)}
                                        className="flex items-center"
                                    >
                                        <Calendar className="h-5 w-5" />
                                    </Link>
                                </Button>
                            )}
                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="rounded-2xl border-white/30 bg-white/20 px-4 py-3 text-white shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/30"
                            >
                                <Link href={route('national-insight-center-infos.index')} className="flex items-center">
                                    <ArrowLeft className="h-5 w-5" />
                                </Link>
                            </Button>
                        </>
                    }
                />

                {/* National Insight Center Info Details Card */}
                <Card className="mb-8 overflow-hidden border-0 bg-gradient-to-bl from-white to-purple-50/30 shadow-2xl dark:from-gray-800 dark:to-purple-900/20">
                    <CardHeader className="bg-gradient-to-l from-purple-500 to-purple-600 py-6 text-white">
                        <CardTitle className="flex items-center gap-4">
                            <div className="rounded-2xl bg-white/20 p-3 shadow-lg backdrop-blur-sm">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{t('national_insight_center_info.show.details_title')}</div>
                                <div className="text-sm font-medium text-purple-100">
                                    {t('national_insight_center_info.show.details_description')}
                                </div>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-md mb-2 font-semibold text-purple-800 dark:text-purple-200">
                                        {t('national_insight_center_info.show.name_label')}
                                    </h3>
                                    <p className="rounded-xl border border-purple-200 bg-white p-4 text-xl font-bold text-purple-900 dark:border-purple-700 dark:bg-gray-800 dark:text-purple-100">
                                        {nationalInsightCenterInfo.name}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-md mb-2 font-semibold text-purple-800 dark:text-purple-200">
                                        {t('national_insight_center_info.show.description_label')}
                                    </h3>
                                    <p className="min-h-[60px] rounded-xl border border-purple-200 bg-white p-4 text-purple-800 dark:border-purple-700 dark:bg-gray-800 dark:text-purple-200">
                                        {nationalInsightCenterInfo.description || t('national_insight_center_info.show.no_description')}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-md mb-2 font-semibold text-purple-800 dark:text-purple-200">
                                        {t('national_insight_center_info.show.date_label')}
                                    </h3>
                                    <p className="rounded-xl border border-purple-200 bg-white p-4 text-purple-800 dark:border-purple-700 dark:bg-gray-800 dark:text-purple-200">
                                        {nationalInsightCenterInfo.date
                                            ? formatPersianDateOnly(nationalInsightCenterInfo.date)
                                            : t('national_insight_center_info.na')}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-md mb-2 font-semibold text-purple-800 dark:text-purple-200">
                                        {t('national_insight_center_info.show.created_at_label')}
                                    </h3>
                                    <p className="rounded-xl border border-purple-200 bg-white p-4 text-purple-800 dark:border-purple-700 dark:bg-gray-800 dark:text-purple-200">
                                        {formatPersianDateOnly(nationalInsightCenterInfo.created_at)}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-md mb-2 font-semibold text-purple-800 dark:text-purple-200">
                                        {t('national_insight_center_info.show.updated_at_label')}
                                    </h3>
                                    <p className="rounded-xl border border-purple-200 bg-white p-4 text-purple-800 dark:border-purple-700 dark:bg-gray-800 dark:text-purple-200">
                                        {formatPersianDateOnly(nationalInsightCenterInfo.updated_at)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* National Insight Center Info Statistics Section */}
                {nationalInsightCenterInfo.infoStats && nationalInsightCenterInfo.infoStats.length > 0 && (
                    <Card className="mb-8 overflow-hidden border-0 bg-gradient-to-bl from-white to-purple-50/30 shadow-2xl dark:from-gray-800 dark:to-purple-900/20">
                        <CardHeader className="bg-gradient-to-l from-purple-500 to-purple-600 py-6 text-white">
                            <CardTitle className="flex items-center gap-4">
                                <div className="rounded-2xl bg-white/20 p-3 shadow-lg backdrop-blur-sm">
                                    <BarChart3 className="h-6 w-6" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{t('national_insight_center_info.show.info_stats_title')}</div>
                                    <div className="text-sm font-medium text-purple-100">
                                        {t('national_insight_center_info.show.info_stats_description')}
                                    </div>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="overflow-x-auto">
                                <table
                                    className="w-full rounded-lg border border-purple-200 bg-white text-sm dark:border-purple-700 dark:bg-gray-800"
                                    style={{ borderCollapse: 'collapse' }}
                                >
                                    <tbody>
                                        {/* Group stats by category */}
                                        {(() => {
                                            const groupedStats = nationalInsightCenterInfo.infoStats.reduce(
                                                (acc, stat) => {
                                                    const categoryId = stat.statCategoryItem.category.id;
                                                    if (!acc[categoryId]) {
                                                        acc[categoryId] = {
                                                            category: stat.statCategoryItem.category,
                                                            items: [],
                                                        };
                                                    }
                                                    acc[categoryId].items.push(stat);
                                                    return acc;
                                                },
                                                {} as Record<number, { category: any; items: InfoStat[] }>,
                                            );

                                            const categoryEntries = Object.entries(groupedStats);

                                            return (
                                                <>
                                                    {/* First Row: All Categories */}
                                                    <tr className="border-b border-purple-200 bg-purple-50 dark:border-purple-700 dark:bg-purple-900/20">
                                                        {categoryEntries.map(([categoryId, categoryData]) => (
                                                            <td
                                                                key={categoryId}
                                                                colSpan={categoryData.items.length}
                                                                className="border-r border-purple-200 py-2 text-center text-sm font-bold text-purple-800 dark:border-purple-700 dark:text-purple-200"
                                                                style={{ backgroundColor: categoryData.category.color + '20' }}
                                                            >
                                                                {categoryData.category.label}
                                                            </td>
                                                        ))}
                                                    </tr>

                                                    {/* Second Row: Item Labels */}
                                                    <tr className="bg-purple-25 border-b border-purple-200 dark:border-purple-700 dark:bg-purple-900/10">
                                                        {categoryEntries.map(([categoryId, categoryData]) => (
                                                            <React.Fragment key={categoryId}>
                                                                {categoryData.items.map((stat) => (
                                                                    <th
                                                                        key={stat.id}
                                                                        className="border-r border-purple-200 bg-white py-1 text-center text-xs font-semibold text-purple-700 dark:border-purple-700 dark:bg-gray-800 dark:text-purple-300"
                                                                    >
                                                                        {stat.statCategoryItem.label}
                                                                    </th>
                                                                ))}
                                                            </React.Fragment>
                                                        ))}
                                                    </tr>

                                                    {/* Third Row: Values */}
                                                    <tr className="border-b border-purple-200 bg-white dark:border-purple-700 dark:bg-gray-800">
                                                        {categoryEntries.map(([categoryId, categoryData]) => (
                                                            <React.Fragment key={categoryId}>
                                                                {categoryData.items.map((stat) => (
                                                                    <td
                                                                        key={stat.id}
                                                                        className="border-r border-purple-200 bg-white py-1 text-center dark:border-purple-700 dark:bg-gray-800"
                                                                    >
                                                                        <Badge
                                                                            variant="outline"
                                                                            className="rounded border-green-300 bg-gradient-to-l from-green-100 to-green-200 px-2 py-0.5 text-xs font-semibold text-green-800 dark:border-green-600 dark:from-green-800 dark:to-green-700 dark:text-green-200"
                                                                        >
                                                                            {stat.string_value}
                                                                        </Badge>
                                                                    </td>
                                                                ))}
                                                            </React.Fragment>
                                                        ))}
                                                    </tr>

                                                    {/* Notes Row (if any) */}
                                                    {nationalInsightCenterInfo.infoStats.some((stat) => stat.notes) && (
                                                        <tr className="border-b border-purple-200 bg-gray-50 dark:border-purple-700 dark:bg-gray-700/50">
                                                            {categoryEntries.map(([categoryId, categoryData]) => (
                                                                <React.Fragment key={categoryId}>
                                                                    {categoryData.items.map((stat) => (
                                                                        <td
                                                                            key={`notes-${stat.id}`}
                                                                            className="border-r border-purple-200 bg-gray-50 py-1 text-center text-xs text-purple-600 dark:border-purple-700 dark:bg-gray-700/50 dark:text-purple-400"
                                                                        >
                                                                            {stat.notes || ''}
                                                                        </td>
                                                                    ))}
                                                                </React.Fragment>
                                                            ))}
                                                        </tr>
                                                    )}
                                                </>
                                            );
                                        })()}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Aggregated Statistics Section */}
                {aggregatedStats && aggregatedStats.length > 0 && (
                    <Card className="mb-8 overflow-hidden border-0 bg-gradient-to-bl from-white to-purple-50/30 shadow-2xl dark:from-gray-800 dark:to-purple-900/20">
                        <CardHeader className="bg-gradient-to-l from-purple-500 to-purple-600 py-6 text-white">
                            <CardTitle className="flex items-center gap-4">
                                <div className="rounded-2xl bg-white/20 p-3 shadow-lg backdrop-blur-sm">
                                    <BarChart3 className="h-6 w-6" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{t('national_insight_center_info.show.statistics_title')}</div>
                                    <div className="text-sm font-medium text-purple-100">
                                        {t('national_insight_center_info.show.statistics_description')}
                                    </div>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="overflow-x-auto">
                                <table
                                    className="w-full rounded-lg border border-purple-200 bg-white text-sm dark:border-purple-700 dark:bg-gray-800"
                                    style={{ borderCollapse: 'collapse' }}
                                >
                                    <tbody>
                                        {/* Group stats by category */}
                                        {(() => {
                                            const groupedStats = aggregatedStats.reduce(
                                                (acc, stat) => {
                                                    const categoryId = stat.stat_category_item.category.id;
                                                    if (!acc[categoryId]) {
                                                        acc[categoryId] = {
                                                            category: stat.stat_category_item.category,
                                                            items: [],
                                                        };
                                                    }
                                                    acc[categoryId].items.push(stat);
                                                    return acc;
                                                },
                                                {} as Record<number, { category: any; items: AggregatedStat[] }>,
                                            );

                                            const categoryEntries = Object.entries(groupedStats);

                                            return (
                                                <>
                                                    {/* First Row: All Categories */}
                                                    <tr className="border-b border-purple-200 bg-purple-50 dark:border-purple-700 dark:bg-purple-900/20">
                                                        {categoryEntries.map(([categoryId, categoryData]) => (
                                                            <td
                                                                key={categoryId}
                                                                colSpan={categoryData.items.length}
                                                                className="border-r border-purple-200 py-2 text-center text-sm font-bold text-purple-800 dark:border-purple-700 dark:text-purple-200"
                                                                style={{ backgroundColor: categoryData.category.color + '20' }}
                                                            >
                                                                {categoryData.category.label}
                                                            </td>
                                                        ))}
                                                    </tr>

                                                    {/* Second Row: Item Labels */}
                                                    <tr className="bg-purple-25 border-b border-purple-200 dark:border-purple-700 dark:bg-purple-900/10">
                                                        {categoryEntries.map(([categoryId, categoryData]) => (
                                                            <React.Fragment key={categoryId}>
                                                                {categoryData.items.map((stat) => (
                                                                    <th
                                                                        key={stat.id}
                                                                        className="border-r border-purple-200 bg-white py-1 text-center text-xs font-semibold text-purple-700 dark:border-purple-700 dark:bg-gray-800 dark:text-purple-300"
                                                                    >
                                                                        {stat.stat_category_item.label}
                                                                    </th>
                                                                ))}
                                                            </React.Fragment>
                                                        ))}
                                                    </tr>

                                                    {/* Third Row: Values */}
                                                    <tr className="border-b border-purple-200 bg-white dark:border-purple-700 dark:bg-gray-800">
                                                        {categoryEntries.map(([categoryId, categoryData]) => (
                                                            <React.Fragment key={categoryId}>
                                                                {categoryData.items.map((stat) => (
                                                                    <td
                                                                        key={stat.id}
                                                                        className="border-r border-purple-200 bg-white py-1 text-center dark:border-purple-700 dark:bg-gray-800"
                                                                    >
                                                                        <Badge
                                                                            variant="outline"
                                                                            className="rounded border-green-300 bg-gradient-to-l from-green-100 to-green-200 px-2 py-0.5 text-xs font-semibold text-green-800 dark:border-green-600 dark:from-green-800 dark:to-green-700 dark:text-green-200"
                                                                        >
                                                                            {stat.string_value}
                                                                        </Badge>
                                                                    </td>
                                                                ))}
                                                            </React.Fragment>
                                                        ))}
                                                    </tr>

                                                    {/* Notes Row (if any) */}
                                                    {aggregatedStats.some((stat) => stat.notes) && (
                                                        <tr className="border-b border-purple-200 bg-gray-50 dark:border-purple-700 dark:bg-gray-700/50">
                                                            {categoryEntries.map(([categoryId, categoryData]) => (
                                                                <React.Fragment key={categoryId}>
                                                                    {categoryData.items.map((stat) => (
                                                                        <td
                                                                            key={`notes-${stat.id}`}
                                                                            className="border-r border-purple-200 bg-gray-50 py-1 text-center text-xs text-purple-600 dark:border-purple-700 dark:bg-gray-700/50 dark:text-purple-400"
                                                                        >
                                                                            {stat.notes || ''}
                                                                        </td>
                                                                    ))}
                                                                </React.Fragment>
                                                            ))}
                                                        </tr>
                                                    )}
                                                </>
                                            );
                                        })()}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Statistics Table */}
                {Object.keys(categories).length > 0 ? (
                    <Card className="mb-8 overflow-hidden border-0 bg-gradient-to-bl from-white to-purple-50/30 shadow-2xl dark:from-gray-800 dark:to-purple-900/20">
                        <CardContent className="p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200">
                                    {t('national_insight_center_info.show.statistics_title') || 'آمار تجمیعی'}
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <div className="overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
                                    <table className="w-fit min-w-full border-collapse bg-white dark:bg-gray-800">
                                        <thead>
                                            <tr className="bg-gradient-to-b from-gray-700 to-gray-800 text-white dark:from-gray-900 dark:to-gray-800">
                                                {Object.entries(categories).map(([key, category]) => (
                                                    <th
                                                        key={key}
                                                        colSpan={category.length}
                                                        className="border border-gray-400 px-4 py-3 text-center text-sm font-bold dark:border-gray-600"
                                                    >
                                                        {key}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="bg-white dark:bg-gray-800">
                                                {Object.values(categories)
                                                    .flat()
                                                    .map((item, index) => (
                                                        <td
                                                            key={index}
                                                            className="h-22 rotate-90 border border-gray-300 px-4 py-2 text-center text-sm text-gray-900 dark:border-gray-600 dark:text-gray-100"
                                                        >
                                                            {item.item_name}
                                                        </td>
                                                    ))}
                                            </tr>
                                            <tr className="bg-gray-50 dark:bg-gray-700">
                                                {Object.values(categories)
                                                    .flat()
                                                    .map((item, index) => (
                                                        <td
                                                            key={index}
                                                            className="border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-900 dark:border-gray-600 dark:text-gray-100"
                                                        >
                                                            {item.total_integer_value ?? 0}
                                                        </td>
                                                    ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="mb-8 overflow-hidden border-0 bg-gradient-to-bl from-white to-purple-50/30 shadow-2xl dark:from-gray-800 dark:to-purple-900/20">
                        <CardContent className="py-8 text-center">
                            <div className="flex flex-col items-center gap-4 text-purple-600 dark:text-purple-400">
                                <div className="flex items-center justify-center rounded-full border border-purple-200 bg-purple-100 p-4 dark:border-purple-700 dark:bg-purple-800/50">
                                    <BarChart3 className="h-12 w-12 text-purple-400 dark:text-purple-300" />
                                </div>
                                <p className="text-xl font-bold text-purple-800 dark:text-purple-200">
                                    {t('national_insight_center_info.show.no_statistics')}
                                </p>
                                <p className="max-w-md text-purple-500 dark:text-purple-400">
                                    {t('national_insight_center_info.show.no_statistics_description')}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Associated Info Records */}
                <div className="mt-8">
                    <Header
                        title={t('national_insight_center_info.show.associated_info_title')}
                        description={t('national_insight_center_info.show.associated_info_description')}
                        icon={<FileText className="h-6 w-6 text-white" />}
                        model="national_insight_center_info_item"
                        routeName="national-insight-center-info-items.create"
                        buttonText={t('national_insight_center_info.show.create_info_button')}
                        theme="purple"
                        showButton={false}
                        actionButtons={
                            <>
                                {!nationalInsightCenterInfo.confirmed && (
                                    <Button asChild>
                                        <Link
                                            href={route('national-insight-center-info-items.create', {
                                                nationalInsightCenterInfo: nationalInsightCenterInfo.id,
                                            })}
                                        >
                                            <Plus className="mr-2 h-5 w-5" />
                                            {t('national_insight_center_info.show.create_info_button')}
                                        </Link>
                                    </Button>
                                )}
                            </>
                        }
                    />
                    <Card className="overflow-hidden rounded-3xl border-0 bg-gradient-to-bl from-white to-purple-50/30 shadow-2xl dark:from-gray-800 dark:to-purple-900/20">
                        <CardContent className="p-0">
                            <div className="overflow-hidden rounded-b-3xl">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-0 bg-gradient-to-l from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800">
                                            <TableHead className="px-6 py-6 text-lg font-bold text-purple-800 dark:text-purple-200">
                                                {t('national_insight_center_info.show.table.id')}
                                            </TableHead>
                                            <TableHead className="px-6 py-6 text-lg font-bold text-purple-800 dark:text-purple-200">
                                                {t('national_insight_center_info.show.table.title')}
                                            </TableHead>
                                            <TableHead className="px-6 py-6 text-lg font-bold text-purple-800 dark:text-purple-200">
                                                {t('national_insight_center_info.show.table.status')}
                                            </TableHead>
                                            <TableHead className="px-6 py-6 text-lg font-bold text-purple-800 dark:text-purple-200">
                                                {t('national_insight_center_info.show.table.created_at')}
                                            </TableHead>
                                            <TableHead className="px-6 py-6 text-right text-lg font-bold text-purple-800 dark:text-purple-200">
                                                {t('national_insight_center_info.show.table.actions')}
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {infos.data && infos.data.length > 0 ? (
                                            infos.data.map((info) => (
                                                <TableRow
                                                    key={info.id}
                                                    className="border-b border-purple-100 transition-colors duration-300 hover:bg-purple-50/50 dark:border-purple-800 dark:hover:bg-purple-900/20"
                                                >
                                                    <TableCell className="px-6 py-6 text-lg font-bold text-purple-900 dark:text-purple-100">
                                                        {info.id}
                                                    </TableCell>
                                                    <TableCell className="px-6 py-6 text-lg font-bold text-purple-900 dark:text-purple-100">
                                                        {info.name}
                                                    </TableCell>
                                                    <TableCell className="px-6 py-6">
                                                        <Badge
                                                            variant="outline"
                                                            className={`rounded-xl px-4 py-2 font-semibold ${
                                                                info.confirmed
                                                                    ? 'border-green-300 bg-green-100 text-green-800 dark:border-green-600 dark:bg-green-800 dark:text-green-200'
                                                                    : 'border-yellow-300 bg-yellow-100 text-yellow-800 dark:border-yellow-600 dark:bg-yellow-800 dark:text-yellow-200'
                                                            }`}
                                                        >
                                                            {info.confirmed ? 'Confirmed' : 'Pending'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="px-6 py-6 font-medium text-purple-800 dark:text-purple-200">
                                                        {formatPersianDateOnly(info.created_at)}
                                                    </TableCell>
                                                    <TableCell className="px-6 py-6">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleViewItem(info)}
                                                                title={t('national_insight_center_info.show.actions.view_details')}
                                                                className="h-10 w-10 rounded-xl text-purple-600 transition-all duration-300 hover:scale-110 hover:bg-purple-100 hover:text-purple-700 dark:text-purple-400 dark:hover:bg-purple-800 dark:hover:text-purple-300"
                                                            >
                                                                <BarChart3 className="h-5 w-5" />
                                                            </Button>
                                                            {isCreator && !info.confirmed && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => handleConfirmItem(info.id)}
                                                                    title={t('national_insight_center_info.show.actions.confirm') || 'تأیید'}
                                                                    className="h-10 w-10 rounded-xl text-green-600 transition-all duration-300 hover:scale-110 hover:bg-green-100 hover:text-green-700 dark:text-green-400 dark:hover:bg-green-800 dark:hover:text-green-300"
                                                                >
                                                                    <CheckCircle className="h-5 w-5" />
                                                                </Button>
                                                            )}
                                                            <CanView model="national_insight_center_info_item">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    asChild
                                                                    title={t('national_insight_center_info.show.actions.view')}
                                                                    className="h-10 w-10 rounded-xl text-blue-600 transition-all duration-300 hover:scale-110 hover:bg-blue-100 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-800 dark:hover:text-blue-300"
                                                                >
                                                                    <Link href={route('national-insight-center-info-items.show', info.id)}>
                                                                        <ExternalLink className="h-5 w-5" />
                                                                    </Link>
                                                                </Button>
                                                            </CanView>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} className="h-32">
                                                    <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-purple-600 dark:text-purple-400">
                                                        <div className="flex items-center justify-center rounded-full bg-purple-100 p-4 dark:bg-purple-800">
                                                            <AlertTriangle className="h-16 w-16 text-purple-400 dark:text-purple-300" />
                                                        </div>
                                                        <p className="text-center text-xl font-bold">
                                                            {t('national_insight_center_info.show.no_info_records')}
                                                        </p>
                                                        <p className="text-center text-purple-500 dark:text-purple-400">
                                                            {t('national_insight_center_info.show.no_info_records_description')}
                                                        </p>
                                                        <CanCreate model="national_insight_center_info_item">
                                                            <div className="flex justify-center">
                                                                <Button
                                                                    asChild
                                                                    className="flex items-center gap-3 rounded-2xl bg-gradient-to-l from-purple-500 to-purple-600 px-6 py-3 text-lg font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:from-purple-600 hover:to-purple-700"
                                                                >
                                                                    <Link
                                                                        href={route('national-insight-center-info-items.create', {
                                                                            nationalInsightCenterInfo: nationalInsightCenterInfo.id,
                                                                        })}
                                                                    >
                                                                        <Plus className="h-5 w-5" />
                                                                        {t('national_insight_center_info.show.create_first_info_button')}
                                                                    </Link>
                                                                </Button>
                                                            </div>
                                                        </CanCreate>
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
            </div>

            {/* Item Details Modal */}
            <Dialog open={isItemModalOpen} onOpenChange={setIsItemModalOpen}>
                <DialogContent className="max-h-[95vh] max-w-5xl overflow-y-auto border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                    <DialogHeader className="pb-4">
                        <DialogTitle className="text-xl font-bold text-purple-800 dark:text-purple-200">{selectedItem?.name}</DialogTitle>
                    </DialogHeader>

                    {selectedItem && (
                        <div className="space-y-4">
                            {/* Basic Information */}
                            <Card className="border-purple-200 bg-white shadow-lg dark:border-purple-700 dark:bg-gray-800 dark:shadow-gray-900/20">
                                <CardHeader className="border-b border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100 py-3 dark:border-purple-700 dark:from-purple-900/30 dark:to-purple-800/30">
                                    <CardTitle className="text-base text-purple-800 dark:text-purple-200">
                                        {t('national_insight_center_info.modal.basic_info')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 p-4">
                                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                                        <div>
                                            <label className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                                                {t('national_insight_center_info.modal.id')}:
                                            </label>
                                            <p className="rounded border border-purple-200 bg-purple-50 px-2 py-1 text-sm font-medium text-purple-900 dark:border-purple-700 dark:bg-purple-900/20 dark:text-purple-100">
                                                {selectedItem.id}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                                                {t('national_insight_center_info.modal.status')}:
                                            </label>
                                            <div className="mt-1">
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs ${
                                                        selectedItem.confirmed
                                                            ? 'border-green-300 bg-green-100 text-green-800 dark:border-green-600 dark:bg-green-800 dark:text-green-200'
                                                            : 'border-yellow-300 bg-yellow-100 text-yellow-800 dark:border-yellow-600 dark:bg-yellow-800 dark:text-yellow-200'
                                                    }`}
                                                >
                                                    {selectedItem.confirmed
                                                        ? t('national_insight_center_info.confirmed')
                                                        : t('national_insight_center_info.pending')}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                                                {t('national_insight_center_info.modal.created_at')}:
                                            </label>
                                            <p className="rounded border border-purple-200 bg-purple-50 px-2 py-1 text-sm text-purple-900 dark:border-purple-700 dark:bg-purple-900/20 dark:text-purple-100">
                                                {formatPersianDateOnly(selectedItem.created_at)}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                                                {t('national_insight_center_info.modal.info_category')}:
                                            </label>
                                            <p className="rounded border border-purple-200 bg-purple-50 px-2 py-1 text-sm text-purple-900 dark:border-purple-700 dark:bg-purple-900/20 dark:text-purple-100">
                                                {selectedItem.info_category?.name || '-'}
                                            </p>
                                        </div>
                                    </div>
                                    {selectedItem.description && (
                                        <div>
                                            <label className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                                                {t('national_insight_center_info.modal.description')}:
                                            </label>
                                            <div className="mt-1 rounded border border-purple-200 bg-purple-50 p-3 dark:border-purple-700 dark:bg-purple-900/20">
                                                <p className="text-justify text-sm leading-relaxed text-purple-900 dark:text-purple-100">
                                                    {selectedItem.description}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Statistics */}
                            {selectedItem.item_stats && selectedItem.item_stats.length > 0 && (
                                <Card className="border-purple-200 bg-white shadow-lg dark:border-purple-700 dark:bg-gray-800 dark:shadow-gray-900/20">
                                    <CardHeader className="border-b border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100 py-3 dark:border-purple-700 dark:from-purple-900/30 dark:to-purple-800/30">
                                        <CardTitle className="flex items-center gap-2 text-base text-purple-800 dark:text-purple-200">
                                            <BarChart3 className="h-4 w-4" />
                                            {t('national_insight_center_info.modal.statistics')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <div className="overflow-x-auto">
                                            <table
                                                className="w-full rounded-lg border border-purple-200 bg-white text-sm dark:border-purple-700 dark:bg-gray-800"
                                                style={{ borderCollapse: 'collapse' }}
                                            >
                                                {/* Group stats by category */}
                                                {(() => {
                                                    const groupedStats = selectedItem.item_stats.reduce(
                                                        (acc, stat) => {
                                                            const categoryId = stat.stat_category_item.category.id;
                                                            if (!acc[categoryId]) {
                                                                acc[categoryId] = {
                                                                    category: stat.stat_category_item.category,
                                                                    items: [],
                                                                };
                                                            }
                                                            acc[categoryId].items.push(stat);
                                                            return acc;
                                                        },
                                                        {} as Record<number, { category: any; items: any[] }>,
                                                    );

                                                    const categoryEntries = Object.entries(groupedStats);

                                                    return (
                                                        <>
                                                            {/* First Row: All Categories */}
                                                            <tr className="border-b border-purple-200 bg-purple-50 dark:border-purple-700 dark:bg-purple-900/20">
                                                                {categoryEntries.map(([categoryId, categoryData]) => (
                                                                    <td
                                                                        key={categoryId}
                                                                        colSpan={categoryData.items.length}
                                                                        className="border-r border-purple-200 py-2 text-center text-sm font-bold text-purple-800 dark:border-purple-700 dark:text-purple-200"
                                                                        style={{ backgroundColor: categoryData.category.color + '20' }}
                                                                    >
                                                                        {categoryData.category.label}
                                                                    </td>
                                                                ))}
                                                            </tr>

                                                            {/* Second Row: Item Labels */}
                                                            <tr className="bg-purple-25 border-b border-purple-200 dark:border-purple-700 dark:bg-purple-900/10">
                                                                {categoryEntries.map(([categoryId, categoryData]) => (
                                                                    <React.Fragment key={categoryId}>
                                                                        {categoryData.items.map((stat) => (
                                                                            <th
                                                                                key={stat.id}
                                                                                className="border-r border-purple-200 bg-white py-1 text-center text-xs font-semibold text-purple-700 dark:border-purple-700 dark:bg-gray-800 dark:text-purple-300"
                                                                            >
                                                                                {stat.stat_category_item.label}
                                                                            </th>
                                                                        ))}
                                                                    </React.Fragment>
                                                                ))}
                                                            </tr>

                                                            {/* Third Row: Values */}
                                                            <tr className="border-b border-purple-200 bg-white dark:border-purple-700 dark:bg-gray-800">
                                                                {categoryEntries.map(([categoryId, categoryData]) => (
                                                                    <React.Fragment key={categoryId}>
                                                                        {categoryData.items.map((stat) => (
                                                                            <td
                                                                                key={stat.id}
                                                                                className="border-r border-purple-200 bg-white py-1 text-center dark:border-purple-700 dark:bg-gray-800"
                                                                            >
                                                                                <Badge
                                                                                    variant="outline"
                                                                                    className="rounded border-green-300 bg-gradient-to-l from-green-100 to-green-200 px-2 py-0.5 text-xs font-semibold text-green-800 dark:border-green-600 dark:from-green-800 dark:to-green-700 dark:text-green-200"
                                                                                >
                                                                                    {stat.string_value}
                                                                                </Badge>
                                                                            </td>
                                                                        ))}
                                                                    </React.Fragment>
                                                                ))}
                                                            </tr>

                                                            {/* Notes Row (if any) */}
                                                            {selectedItem.item_stats.some((stat) => stat.notes) && (
                                                                <tr className="border-b border-purple-200 bg-gray-50 dark:border-purple-700 dark:bg-gray-700/50">
                                                                    {categoryEntries.map(([categoryId, categoryData]) => (
                                                                        <React.Fragment key={categoryId}>
                                                                            {categoryData.items.map((stat) => (
                                                                                <td
                                                                                    key={`notes-${stat.id}`}
                                                                                    className="border-r border-purple-200 bg-gray-50 py-1 text-center text-xs text-purple-600 dark:border-purple-700 dark:bg-gray-700/50 dark:text-purple-400"
                                                                                >
                                                                                    {stat.notes || ''}
                                                                                </td>
                                                                            ))}
                                                                        </React.Fragment>
                                                                    ))}
                                                                </tr>
                                                            )}
                                                        </>
                                                    );
                                                })()}
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* No Statistics Message */}
                            {(!selectedItem.item_stats || selectedItem.item_stats.length === 0) && (
                                <Card className="border-purple-200 bg-white shadow-lg dark:border-purple-700 dark:bg-gray-800 dark:shadow-gray-900/20">
                                    <CardContent className="py-4 text-center">
                                        <div className="flex flex-col items-center gap-3 text-purple-600 dark:text-purple-400">
                                            <div className="flex items-center justify-center rounded-full border border-purple-200 bg-purple-100 p-3 dark:border-purple-700 dark:bg-purple-800/50">
                                                <BarChart3 className="h-8 w-8 text-purple-400 dark:text-purple-300" />
                                            </div>
                                            <p className="text-base font-bold text-purple-800 dark:text-purple-200">
                                                {t('national_insight_center_info.modal.no_statistics')}
                                            </p>
                                            <p className="max-w-md text-sm text-purple-500 dark:text-purple-400">
                                                {t('national_insight_center_info.modal.no_statistics_description')}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
