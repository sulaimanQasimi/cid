import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pencil, Trash, ExternalLink, FileText, BarChart3, TrendingUp, AlertTriangle, Plus, Database, Settings, Printer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/lib/i18n/translate';
import { usePermissions } from '@/hooks/use-permissions';
import { CanCreate, CanView, CanUpdate, CanDelete } from '@/components/ui/permission-guard';
import { formatPersianDateOnly } from '@/lib/utils/date';
import Header from '@/components/template/header';

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
}

interface InfoStat {
  id: number;
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
  integer_value: number | null;
  string_value: string | null;
  notes: string | null;
  created_at: string;
}

interface NationalInsightCenterInfo {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  infoStats: InfoStat[];
  code: string;
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

interface Props {
  nationalInsightCenterInfo: NationalInsightCenterInfo;
  infos: {
    data: Info[];
    links: any[];
  };
  infoCategories?: InfoCategory[];
  departments?: Department[];
}

export default function ShowNationalInsightCenterInfo({ nationalInsightCenterInfo, infos, infoCategories = [], departments = [] }: Props) {
  const { t } = useTranslation();
  const { canCreate, canView, canUpdate, canDelete } = usePermissions();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

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
              <Button asChild variant="outline" size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105">
                <Link href={route('national-insight-center-infos.index')} className="flex items-center gap-3">
                  <ArrowLeft className="h-5 w-5" />
                  {t('national_insight_center_info.show.back_button')}
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105">
                <Link href={route('national-insight-center-infos.print', nationalInsightCenterInfo.id)} className="flex items-center gap-3">
                  <Printer className="h-5 w-5" />
                  {t('national_insight_center_info.show.print_button')}
                </Link>
              </Button>
              <CanUpdate model="national_insight_center_info">
                <Button asChild size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105">
                  <Link href={route('national-insight-center-infos.edit', nationalInsightCenterInfo.id)} className="flex items-center gap-3">
                    <Pencil className="h-5 w-5" />
                    {t('national_insight_center_info.show.edit_button')}
                  </Link>
                </Button>
              </CanUpdate>
              <CanDelete model="national_insight_center_info">
                <Button
                  size="lg"
                  variant="destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="bg-red-500/20 backdrop-blur-md border-red-300/30 text-white hover:bg-red-500/30 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105"
                >
                  <Trash className="h-5 w-5 mr-2" />
                  {t('national_insight_center_info.show.delete_button')}
                </Button>
              </CanDelete>
            </>
          }
        />

        {/* National Insight Center Info Details Card */}
        <Card className="shadow-2xl bg-gradient-to-bl from-white dark:from-gray-800 to-purple-50/30 dark:to-purple-900/20 border-0 overflow-hidden mb-8">
          <CardHeader className="bg-gradient-to-l from-purple-500 to-purple-600 text-white py-6">
            <CardTitle className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold">{t('national_insight_center_info.show.details_title')}</div>
                <div className="text-purple-100 text-sm font-medium">{t('national_insight_center_info.show.details_description')}</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-semibold text-purple-800 dark:text-purple-200 mb-2">{t('national_insight_center_info.show.name_label')}</h3>
                  <p className="text-xl font-bold text-purple-900 dark:text-purple-100 bg-white dark:bg-gray-800 p-4 rounded-xl border border-purple-200 dark:border-purple-700">
                    {nationalInsightCenterInfo.name}
                  </p>
                </div>
                <div>
                  <h3 className="text-md font-semibold text-purple-800 dark:text-purple-200 mb-2">{t('national_insight_center_info.show.description_label')}</h3>
                  <p className="text-purple-800 dark:text-purple-200 bg-white dark:bg-gray-800 p-4 rounded-xl border border-purple-200 dark:border-purple-700 min-h-[60px]">
                    {nationalInsightCenterInfo.description || t('national_insight_center_info.show.no_description')}
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-semibold text-purple-800 dark:text-purple-200 mb-2">{t('national_insight_center_info.show.created_at_label')}</h3>
                  <p className="text-purple-800 dark:text-purple-200 bg-white dark:bg-gray-800 p-4 rounded-xl border border-purple-200 dark:border-purple-700">
                    {formatPersianDateOnly(nationalInsightCenterInfo.created_at)}
                  </p>
                </div>
                <div>
                  <h3 className="text-md font-semibold text-purple-800 dark:text-purple-200 mb-2">{t('national_insight_center_info.show.updated_at_label')}</h3>
                  <p className="text-purple-800 dark:text-purple-200 bg-white dark:bg-gray-800 p-4 rounded-xl border border-purple-200 dark:border-purple-700">
                    {formatPersianDateOnly(nationalInsightCenterInfo.updated_at)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Display Card */}
        <div className="mt-8">
          <Header
            title={t('national_insight_center_info.show.stats_title')}
            description={t('national_insight_center_info.show.stats_description')}
            icon={<Database className="h-6 w-6 text-white" />}
            model="national_insight_center_info"
            routeName={route('national-insight-center-infos.stats', nationalInsightCenterInfo.id)}
            buttonText={t('national_insight_center_info.show.manage_stats_button')}
            theme="purple"
            showButton={canUpdate('national_insight_center_info')}
          />
          <Card className="shadow-2xl overflow-hidden bg-gradient-to-bl from-white dark:from-gray-800 to-purple-50/30 dark:to-purple-900/20 border-0 rounded-3xl">
            <CardContent className="p-0">
              <div className="overflow-hidden rounded-b-3xl">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-l from-purple-100 dark:from-purple-900 to-purple-200 dark:to-purple-800 border-0">
                      <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('national_insight_center_info.show.stats_table.category')}</TableHead>
                      <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('national_insight_center_info.show.stats_table.item')}</TableHead>
                      <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('national_insight_center_info.show.stats_table.value')}</TableHead>
                      <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('national_insight_center_info.show.stats_table.notes')}</TableHead>
                      <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('national_insight_center_info.show.stats_table.created_at')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {nationalInsightCenterInfo.infoStats && nationalInsightCenterInfo.infoStats.length > 0 ? (
                      nationalInsightCenterInfo.infoStats.map((stat) => (
                        <TableRow key={stat.id} className="hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-colors duration-300 border-b border-purple-100 dark:border-purple-800">
                          <TableCell className="py-6 px-6">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: stat.stat_category_item.category.color }}
                              ></div>
                              <span className="font-semibold text-purple-800 dark:text-purple-200">
                                {stat.stat_category_item.category.label}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold text-purple-900 dark:text-purple-100 py-6 px-6 text-lg">
                            {stat.stat_category_item.label}
                          </TableCell>
                          <TableCell className="py-6 px-6">
                            <Badge variant="outline" className="bg-gradient-to-l from-green-100 dark:from-green-800 to-green-200 dark:to-green-700 text-green-800 dark:text-green-200 border-green-300 dark:border-green-600 px-4 py-2 rounded-xl font-semibold">
                              {stat.integer_value !== null ? stat.integer_value : stat.string_value}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-6 px-6">
                            <span className="text-purple-700 dark:text-purple-300">
                              {stat.notes || '-'}
                            </span>
                          </TableCell>
                          <TableCell className="text-purple-800 dark:text-purple-200 py-6 px-6 font-medium">
                            {formatPersianDateOnly(stat.created_at)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-32">
                          <div className="flex flex-col items-center justify-center gap-4 text-purple-600 dark:text-purple-400 h-full w-full">
                            <div className="p-4 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center">
                              <Database className="h-16 w-16 text-purple-400 dark:text-purple-300" />
                            </div>
                            <p className="text-xl font-bold text-center">{t('national_insight_center_info.show.no_stats')}</p>
                            <p className="text-purple-500 dark:text-purple-400 text-center">{t('national_insight_center_info.show.no_stats_description')}</p>
                            <CanUpdate model="national_insight_center_info">
                              <div className="flex justify-center">
                                <Button asChild className="bg-gradient-to-l from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center">
                                  <Link href={route('national-insight-center-infos.stats', nationalInsightCenterInfo.id)} className="flex items-center gap-3">
                                    <Plus className="h-5 w-5" />
                                    {t('national_insight_center_info.show.add_first_stat_button')}
                                  </Link>
                                </Button>
                              </div>
                            </CanUpdate>
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
              <Button asChild>
                <Link href={route('national-insight-center-info-items.create', { national_insight_center_info_id: nationalInsightCenterInfo.id })}>
                  <Plus className="h-5 w-5 mr-2" />
                  {t('national_insight_center_info.show.create_info_button')}
                </Link>
              </Button>
            }
          />
          <Card className="shadow-2xl overflow-hidden bg-gradient-to-bl from-white dark:from-gray-800 to-purple-50/30 dark:to-purple-900/20 border-0 rounded-3xl">
            <CardContent className="p-0">
              <div className="overflow-hidden rounded-b-3xl">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-l from-purple-100 dark:from-purple-900 to-purple-200 dark:to-purple-800 border-0">
                      <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('national_insight_center_info.show.table.id')}</TableHead>
                      <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('national_insight_center_info.show.table.title')}</TableHead>
                      <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('national_insight_center_info.show.table.status')}</TableHead>
                      <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('national_insight_center_info.show.table.created_at')}</TableHead>
                      <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6 text-right">{t('national_insight_center_info.show.table.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {infos.data && infos.data.length > 0 ? (
                      infos.data.map((info) => (
                        <TableRow key={info.id} className="hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-colors duration-300 border-b border-purple-100 dark:border-purple-800">
                          <TableCell className="font-bold text-purple-900 dark:text-purple-100 py-6 px-6 text-lg">{info.id}</TableCell>
                          <TableCell className="font-bold text-purple-900 dark:text-purple-100 py-6 px-6 text-lg">{info.name}</TableCell>
                          <TableCell className="py-6 px-6">
                            <Badge
                              variant="outline"
                              className={`px-4 py-2 rounded-xl font-semibold ${info.confirmed
                                  ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 border-green-300 dark:border-green-600'
                                  : 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-600'
                                }`}
                            >
                              {info.confirmed ? 'Confirmed' : 'Pending'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-purple-800 dark:text-purple-200 py-6 px-6 font-medium">
                            {formatPersianDateOnly(info.created_at)}
                          </TableCell>
                          <TableCell className="py-6 px-6">
                            <div className="flex items-center gap-2 justify-end">
                              <CanView model="national_insight_center_info_item">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  asChild
                                  title={t('national_insight_center_info.show.actions.view')}
                                  className="h-10 w-10 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-300 hover:scale-110"
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
                          <div className="flex flex-col items-center justify-center gap-4 text-purple-600 dark:text-purple-400 h-full w-full">
                            <div className="p-4 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center">
                              <AlertTriangle className="h-16 w-16 text-purple-400 dark:text-purple-300" />
                            </div>
                            <p className="text-xl font-bold text-center">{t('national_insight_center_info.show.no_info_records')}</p>
                            <p className="text-purple-500 dark:text-purple-400 text-center">{t('national_insight_center_info.show.no_info_records_description')}</p>
                            <CanCreate model="national_insight_center_info_item">
                              <div className="flex justify-center">
                                <Button asChild className="bg-gradient-to-l from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-3">
                                  <Link href={route('national-insight-center-info-items.create', { national_insight_center_info_id: nationalInsightCenterInfo.id })}>
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
    </AppLayout>
  );
}
