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
import { CanConfirm, CanDelete, CanUpdate } from '@/components/ui/permission-guard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePermissions } from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { useTranslation } from '@/lib/i18n/translate';
import { type BreadcrumbItem } from '@/types';
import { Info, InfoCategory, InfoType, User } from '@/types/info';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    BadgeInfo,
    Building,
    Building2,
    Calendar,
    Check,
    Clock,
    Eye,
    FileCheck,
    FileText,
    Gavel,
    Home,
    MapPin,
    Pencil,
    Trash,
    Users,
    X,
} from 'lucide-react';
import { lazy, Suspense, useState } from 'react';

// Lazy load the LocationDisplay component
const LocationDisplay = lazy(() => import('@/components/LocationDisplay'));

interface Department {
    id: number;
    name: string;
    code: string;
}

interface Props {
    info: Info & {
        infoType?: InfoType;
        infoCategory?: InfoCategory;
        department?: Department | null;
        user?: User;
        creator?: User;
        confirmer?: User;
        // Visitor statistics
        visits_count?: number;
        unique_visitors_count?: number;
        today_visits_count?: number;
        this_week_visits_count?: number;
        this_month_visits_count?: number;
        bounce_rate?: number;
        average_time_spent?: number;
    };
}

export default function ShowInfo({ info }: Props) {
    const { t } = useTranslation();
    const { canUpdate, canDelete } = usePermissions();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('info_types.page_title'),
            href: route('info-types.index'),
        },
        {
            title: t('info.show.breadcrumb'),
            href: '#',
        },
    ];

    const handleDelete = () => {
        router.delete(route('infos.destroy', info.id), {
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
            },
        });
    };

    const handleConfirm = () => {
        router.patch(
            route('infos.confirm', info.id),
            {},
            {
                onSuccess: () => {
                    setIsConfirmDialogOpen(false);
                },
            },
        );
    };

    // Function to format the value object for display
    const formatValue = (value: any) => {
        if (!value) return t('info.show.no_content');

        if (typeof value === 'object') {
            // If it's an object with content property, return the content
            if (value.content) return value.content;

            // If it's an object with location property, filter it out to avoid cluttering the view
            const { location, ...rest } = value;

            // If there are other properties, show them
            if (Object.keys(rest).length > 0) {
                return JSON.stringify(rest, null, 2);
            }

            // If only location was present, indicate that
            if (location) {
                return t('info.show.location_data_available');
            }

            return JSON.stringify(value, null, 2);
        }

        return String(value);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('info.show.page_title', { name: info.name || 'Info Record' })} />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('info.show.delete_dialog.title')}</AlertDialogTitle>
                        <AlertDialogDescription>{t('info.show.delete_dialog.description')}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('info.show.delete_dialog.cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            {t('info.show.delete_dialog.confirm')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Confirm Dialog */}
            <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('info.show.confirm_dialog.title')}</AlertDialogTitle>
                        <AlertDialogDescription>{t('info.show.confirm_dialog.description')}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('info.show.confirm_dialog.cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirm} className="bg-green-600 hover:bg-green-700">
                            {t('info.show.confirm_dialog.confirm')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="container px-0 py-8">
                {/* Professional Header */}
                <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-xl lg:p-10">
                    {/* Subtle background pattern */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>

                    <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-6">
                            <div className="rounded-xl border border-white/20 bg-white/10 p-4 shadow-lg backdrop-blur-sm">
                                <Eye className="h-8 w-8 text-white" />
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tight text-white lg:text-4xl">{info.name || t('info.show.title')}</h1>
                                <p className="flex items-center gap-2 text-lg font-medium text-slate-300">
                                    <FileText className="h-5 w-5" />
                                    {t('info.show.description')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {!info.confirmed && (
                                <CanConfirm model="info">
                                    <Button
                                        onClick={() => setIsConfirmDialogOpen(true)}
                                        className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white shadow-lg transition-all duration-200 hover:bg-green-700"
                                    >
                                        <Check className="h-4 w-4" />
                                    </Button>
                                </CanConfirm>
                            )}
                            <CanDelete model="info">
                                <Button
                                    variant="destructive"
                                    onClick={() => setIsDeleteDialogOpen(true)}
                                    className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white shadow-lg transition-all duration-200 hover:bg-red-700"
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </CanDelete>
                            <CanUpdate model="info">
                                <Button
                                    asChild
                                    className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow-lg transition-all duration-200 hover:bg-blue-700"
                                >
                                    <Link href={route('infos.edit', info.id)} className="flex items-center gap-2">
                                        <Pencil className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </CanUpdate>

                            <Button
                                variant="outline"
                                asChild
                                className="rounded-lg border-white/20 bg-white/10 px-4 py-2 font-medium text-white shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-white/20"
                            >
                                <Link href={route('info-types.index')} className="flex items-center gap-2">
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Info Details Card */}
                <Card className="mb-8 overflow-hidden rounded-xl border border-slate-200 shadow-lg">
                    <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 py-6">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-3">
                                <div className="rounded-lg bg-blue-100 p-2">
                                    <BadgeInfo className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <div className="text-xl font-semibold text-slate-900">{t('info.show.details.title')}</div>
                                    <div className="text-sm text-slate-600">{t('info.show.details.description')}</div>
                                </div>
                            </CardTitle>
                            <Badge
                                variant={info.confirmed ? 'default' : 'secondary'}
                                className="rounded-lg border-green-200 bg-green-100 px-3 py-1 font-medium text-green-800"
                            >
                                {info.confirmed ? (
                                    <div className="flex items-center gap-1">
                                        <Check className="h-3 w-3" />
                                        {t('info.show.status.confirmed')}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1">
                                        <X className="h-3 w-3" />
                                        {t('info.show.status.unconfirmed')}
                                    </div>
                                )}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                    <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                                        <FileText className="h-4 w-4 text-slate-400" />
                                        {t('info.show.fields.name')}
                                    </h3>
                                    <p className="font-medium text-slate-900">{info.name || t('info.show.not_specified')}</p>
                                </div>

                                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                    <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                                        <FileCheck className="h-4 w-4 text-slate-400" />
                                        {t('info.show.fields.code')}
                                    </h3>
                                    <p className="font-mono font-medium text-slate-900">{info.code || t('info.show.not_specified')}</p>
                                </div>

                                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                    <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                                        <Gavel className="h-4 w-4 text-slate-400" />
                                        {t('info.show.fields.type')}
                                    </h3>
                                    <p className="text-slate-900">
                                        {info.infoType ? (
                                            <Link
                                                href={route('info-types.show', info.infoType.id)}
                                                className="font-medium text-blue-600 transition-colors hover:text-blue-800 hover:underline"
                                            >
                                                {info.infoType.name}
                                            </Link>
                                        ) : (
                                            <span className="text-slate-500">{t('info.show.not_specified')}</span>
                                        )}
                                    </p>
                                </div>

                                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                    <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                                        <Home className="h-4 w-4 text-slate-400" />
                                        {t('info.show.fields.category')}
                                    </h3>
                                    <p className="text-slate-900">
                                        {info.infoCategory ? (
                                            <Link
                                                href={route('info-categories.show', info.infoCategory.id)}
                                                className="font-medium text-blue-600 transition-colors hover:text-blue-800 hover:underline"
                                            >
                                                {info.infoCategory.name}
                                            </Link>
                                        ) : (
                                            <span className="text-slate-500">{t('info.show.not_specified')}</span>
                                        )}
                                    </p>
                                </div>

                                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                    <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                                        <Building2 className="h-4 w-4 text-slate-400" />
                                        {t('info.show.fields.department')}
                                    </h3>
                                    <p className="text-slate-900">
                                        {info.department ? (
                                            <Link
                                                href={route('departments.show', info.department.id)}
                                                className="flex items-center gap-2 font-medium text-blue-600 transition-colors hover:text-blue-800 hover:underline"
                                            >
                                                <Building className="h-4 w-4" />
                                                {info.department.name}
                                            </Link>
                                        ) : (
                                            <span className="text-slate-500">{t('info.show.not_assigned')}</span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                    <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                                        <FileText className="h-4 w-4 text-slate-400" />
                                        {t('info.show.fields.description')}
                                    </h3>
                                    <p className="text-slate-900">{info.description || t('info.show.no_description')}</p>
                                </div>

                                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                    <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                                        <Users className="h-4 w-4 text-slate-400" />
                                        {t('info.show.fields.created_by')}
                                    </h3>
                                    <p className="font-medium text-slate-900">{info.creator?.name || t('info.show.system')}</p>
                                </div>

                                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                    <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                                        <Users className="h-4 w-4 text-slate-400" />
                                        {t('info.show.fields.owner')}
                                    </h3>
                                    <p className="font-medium text-slate-900">{info.user?.name || t('info.show.not_assigned')}</p>
                                </div>

                                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                    <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                                        <Calendar className="h-4 w-4 text-slate-400" />
                                        {t('info.show.fields.created_at')}
                                    </h3>
                                    <p className="font-medium text-slate-900">{new Date(info.created_at).toLocaleString()}</p>
                                </div>

                                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                    <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                                        <Clock className="h-4 w-4 text-slate-400" />
                                        {t('info.show.fields.updated_at')}
                                    </h3>
                                    <p className="font-medium text-slate-900">{new Date(info.updated_at).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Content Card */}
                <Card className="mb-8 overflow-hidden rounded-xl border border-slate-200 shadow-lg">
                    <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 py-6">
                        <CardTitle className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-100 p-2">
                                <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <div className="text-xl font-semibold text-slate-900">{t('info.show.content.title')}</div>
                                <div className="text-sm text-slate-600">{t('info.show.content.description')}</div>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <Tabs defaultValue="basic">
                            <TabsList className="mb-6 grid w-full grid-cols-2 rounded-lg bg-slate-100 p-1">
                                <TabsTrigger
                                    value="basic"
                                    className="rounded-md data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
                                >
                                    {t('info.show.content_tabs.basic')}
                                </TabsTrigger>
                                {info.value && info.value.location && (
                                    <TabsTrigger
                                        value="location"
                                        className="flex items-center gap-1 rounded-md data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
                                    >
                                        <MapPin className="h-4 w-4" />
                                        {t('info.show.content_tabs.location')}
                                    </TabsTrigger>
                                )}
                            </TabsList>

                            <TabsContent value="basic">
                                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                    <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap text-slate-900">
                                        {formatValue(info.value?.content || info.value)}
                                    </pre>
                                </div>
                            </TabsContent>

                            {info.value && info.value.location && (
                                <TabsContent value="location">
                                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                        <Suspense
                                            fallback={
                                                <div className="flex h-[400px] items-center justify-center rounded-lg bg-slate-100">
                                                    <div className="font-medium text-slate-600">{t('info.show.loading_map')}</div>
                                                </div>
                                            }
                                        >
                                            <LocationDisplay location={info.value.location} />
                                        </Suspense>
                                    </div>
                                </TabsContent>
                            )}
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Visitor Statistics Card */}
                <Card className="mb-8 overflow-hidden rounded-xl border border-slate-200 shadow-lg">
                    <CardHeader className="border-b border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100 py-6">
                        <CardTitle className="flex items-center gap-3">
                            <div className="rounded-lg bg-purple-100 p-2">
                                <Eye className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <div className="text-xl font-semibold text-slate-900">{t('info.show.visitor_stats.title')}</div>
                                <div className="text-sm text-slate-600">{t('info.show.visitor_stats.description')}</div>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
                                <div className="mb-1 text-2xl font-bold text-purple-600">{info.visits_count || 0}</div>
                                <div className="text-sm text-slate-600">{t('info.show.visitor_stats.total_visits')}</div>
                            </div>
                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
                                <div className="mb-1 text-2xl font-bold text-purple-600">{info.unique_visitors_count || 0}</div>
                                <div className="text-sm text-slate-600">{t('info.show.visitor_stats.unique_visitors')}</div>
                            </div>
                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
                                <div className="mb-1 text-2xl font-bold text-purple-600">{info.today_visits_count || 0}</div>
                                <div className="text-sm text-slate-600">{t('info.show.visitor_stats.today_visits')}</div>
                            </div>
                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
                                <div className="mb-1 text-2xl font-bold text-purple-600">{info.this_week_visits_count || 0}</div>
                                <div className="text-sm text-slate-600">{t('info.show.visitor_stats.this_week_visits')}</div>
                            </div>
                        </div>
                        {info.bounce_rate !== undefined && info.average_time_spent !== undefined && (
                            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
                                    <div className="mb-1 text-2xl font-bold text-purple-600">{info.bounce_rate?.toFixed(1)}%</div>
                                    <div className="text-sm text-slate-600">{t('info.show.visitor_stats.bounce_rate')}</div>
                                </div>
                                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
                                    <div className="mb-1 text-2xl font-bold text-purple-600">
                                        {info.average_time_spent ? Math.round(info.average_time_spent / 60) : 0}
                                    </div>
                                    <div className="text-sm text-slate-600">{t('info.show.visitor_stats.avg_time_minutes')}</div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Confirmation Details Card */}
                {info.confirmed && info.confirmer && (
                    <Card className="overflow-hidden rounded-xl border border-slate-200 shadow-lg">
                        <CardHeader className="border-b border-green-200 bg-gradient-to-r from-green-50 to-green-100 py-6">
                            <CardTitle className="flex items-center gap-3">
                                <div className="rounded-lg bg-green-100 p-2">
                                    <Check className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <div className="text-xl font-semibold text-slate-900">{t('info.show.confirmation.title')}</div>
                                    <div className="text-sm text-slate-600">{t('info.show.confirmation.description')}</div>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                    <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                                        <Users className="h-4 w-4 text-slate-400" />
                                        {t('info.show.fields.confirmed_by')}
                                    </h3>
                                    <p className="font-medium text-slate-900">{info.confirmer?.name || t('info.show.unknown')}</p>
                                </div>
                                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                    <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                                        <Calendar className="h-4 w-4 text-slate-400" />
                                        {t('info.show.fields.confirmation_date')}
                                    </h3>
                                    <p className="font-medium text-slate-900">{new Date(info.updated_at).toLocaleString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
