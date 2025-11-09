import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pencil, Trash, ExternalLink, FileText, BarChart3, TrendingUp, AlertTriangle, Plus, Database, Settings, Printer, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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


interface NationalInsightCenterInfo {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  code: string;
  date: string | null;
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

interface Props {
  nationalInsightCenterInfo: NationalInsightCenterInfo;
  infos: {
    data: Info[];
    links: any[];
  };
  aggregatedStats?: AggregatedStat[];
  infoCategories?: InfoCategory[];
  departments?: Department[];
}

export default function ShowNationalInsightCenterInfo({ nationalInsightCenterInfo, infos, aggregatedStats = [], infoCategories = [], departments = [] }: Props) {
  const { t } = useTranslation();
  const { canCreate, canView, canUpdate, canDelete } = usePermissions();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<Info | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = React.useState(false);

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
              <CanDelete model="national_insight_center_info">
                <Button
                  size="lg"
                  variant="destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="bg-red-500/20 backdrop-blur-md border-red-300/30 text-white hover:bg-red-500/30 shadow-2xl rounded-2xl px-4 py-3 transition-all duration-300 hover:scale-105"
                >
                  <Trash className="h-5 w-5" />
                </Button>
              </CanDelete>
              <CanUpdate model="national_insight_center_info">
                <Button asChild size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-4 py-3 transition-all duration-300 hover:scale-105">
                  <Link href={route('national-insight-center-infos.edit', nationalInsightCenterInfo.id)} className="flex items-center">
                    <Pencil className="h-5 w-5" />
                  </Link>
                </Button>
              </CanUpdate>
              <Button asChild size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-4 py-3 transition-all duration-300 hover:scale-105">
                <Link href={route('national-insight-center-infos.print', nationalInsightCenterInfo.id)} className="flex items-center">
                  <Printer className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-4 py-3 transition-all duration-300 hover:scale-105" title={t('weekly_report.page_title')}>
                <Link href={route('national-insight-center-infos.weekly-report', nationalInsightCenterInfo.id)} className="flex items-center">
                  <Calendar className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-4 py-3 transition-all duration-300 hover:scale-105">
                <Link href={route('national-insight-center-infos.index')} className="flex items-center">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
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
                  <h3 className="text-md font-semibold text-purple-800 dark:text-purple-200 mb-2">{t('national_insight_center_info.show.date_label')}</h3>
                  <p className="text-purple-800 dark:text-purple-200 bg-white dark:bg-gray-800 p-4 rounded-xl border border-purple-200 dark:border-purple-700">
                    {nationalInsightCenterInfo.date ? formatPersianDateOnly(nationalInsightCenterInfo.date) : t('national_insight_center_info.na')}
                  </p>
                </div>
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

        {/* Aggregated Statistics Section */}
        {aggregatedStats && aggregatedStats.length > 0 && (
          <Card className="shadow-2xl bg-gradient-to-bl from-white dark:from-gray-800 to-purple-50/30 dark:to-purple-900/20 border-0 overflow-hidden mb-8">
            <CardHeader className="bg-gradient-to-l from-purple-500 to-purple-600 text-white py-6">
              <CardTitle className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{t('national_insight_center_info.show.statistics_title')}</div>
                  <div className="text-purple-100 text-sm font-medium">{t('national_insight_center_info.show.statistics_description')}</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full border border-purple-200 dark:border-purple-700 rounded-lg bg-white dark:bg-gray-800 text-sm" style={{ borderCollapse: 'collapse' }}>
                  <tbody>
                    {/* Group stats by category */}
                    {(() => {
                      const groupedStats = aggregatedStats.reduce((acc, stat) => {
                        const categoryId = stat.stat_category_item.category.id;
                        if (!acc[categoryId]) {
                          acc[categoryId] = {
                            category: stat.stat_category_item.category,
                            items: []
                          };
                        }
                        acc[categoryId].items.push(stat);
                        return acc;
                      }, {} as Record<number, { category: any; items: AggregatedStat[] }>);

                      const categoryEntries = Object.entries(groupedStats);
                      
                      return (
                        <>
                          {/* First Row: All Categories */}
                          <tr className="border-b border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20">
                            {categoryEntries.map(([categoryId, categoryData]) => (
                              <td 
                                key={categoryId}
                                colSpan={categoryData.items.length} 
                                className="font-bold text-center py-2 border-r border-purple-200 dark:border-purple-700 text-purple-800 dark:text-purple-200 text-sm"
                                style={{ backgroundColor: categoryData.category.color + '20' }}
                              >
                                {categoryData.category.label}
                              </td>
                            ))}
                          </tr>
                          
                          {/* Second Row: Item Labels */}
                          <tr className="border-b border-purple-200 dark:border-purple-700 bg-purple-25 dark:bg-purple-900/10">
                            {categoryEntries.map(([categoryId, categoryData]) => (
                              <React.Fragment key={categoryId}>
                                {categoryData.items.map((stat) => (
                                  <th 
                                    key={stat.id}
                                    className="text-center py-1 font-semibold border-r border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 bg-white dark:bg-gray-800 text-xs"
                                  >
                                    {stat.stat_category_item.label}
                                  </th>
                                ))}
                              </React.Fragment>
                            ))}
                          </tr>
                          
                          {/* Third Row: Values */}
                          <tr className="border-b border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-800">
                            {categoryEntries.map(([categoryId, categoryData]) => (
                              <React.Fragment key={categoryId}>
                                {categoryData.items.map((stat) => (
                                  <td 
                                    key={stat.id}
                                    className="text-center py-1 border-r border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-800"
                                  >
                                    <Badge variant="outline" className="bg-gradient-to-l from-green-100 dark:from-green-800 to-green-200 dark:to-green-700 text-green-800 dark:text-green-200 border-green-300 dark:border-green-600 px-2 py-0.5 rounded text-xs font-semibold">
                                      {stat.string_value}
                                    </Badge>
                                  </td>
                                ))}
                              </React.Fragment>
                            ))}
                          </tr>
                          
                          {/* Notes Row (if any) */}
                          {aggregatedStats.some(stat => stat.notes) && (
                            <tr className="border-b border-purple-200 dark:border-purple-700 bg-gray-50 dark:bg-gray-700/50">
                              {categoryEntries.map(([categoryId, categoryData]) => (
                                <React.Fragment key={categoryId}>
                                  {categoryData.items.map((stat) => (
                                    <td 
                                      key={`notes-${stat.id}`}
                                      className="text-center py-1 text-xs border-r border-purple-200 dark:border-purple-700 text-purple-600 dark:text-purple-400 bg-gray-50 dark:bg-gray-700/50"
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

        {/* No Statistics Message */}
        {(!aggregatedStats || aggregatedStats.length === 0) && (
          <Card className="shadow-2xl bg-gradient-to-bl from-white dark:from-gray-800 to-purple-50/30 dark:to-purple-900/20 border-0 overflow-hidden mb-8">
            <CardContent className="text-center py-8">
              <div className="flex flex-col items-center gap-4 text-purple-600 dark:text-purple-400">
                <div className="p-4 bg-purple-100 dark:bg-purple-800/50 rounded-full flex items-center justify-center border border-purple-200 dark:border-purple-700">
                  <BarChart3 className="h-12 w-12 text-purple-400 dark:text-purple-300" />
                </div>
                <p className="text-xl font-bold text-purple-800 dark:text-purple-200">{t('national_insight_center_info.show.no_statistics')}</p>
                <p className="text-purple-500 dark:text-purple-400 max-w-md">{t('national_insight_center_info.show.no_statistics_description')}</p>
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
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewItem(info)}
                                title={t('national_insight_center_info.show.actions.view_details')}
                                className="h-10 w-10 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-800 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-300 hover:scale-110"
                              >
                                <BarChart3 className="h-5 w-5" />
                              </Button>
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

      {/* Item Details Modal */}
      <Dialog open={isItemModalOpen} onOpenChange={setIsItemModalOpen}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl font-bold text-purple-800 dark:text-purple-200">
              {selectedItem?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4">
              {/* Basic Information */}
              <Card className="bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-700 shadow-lg dark:shadow-gray-900/20">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border-b border-purple-200 dark:border-purple-700 py-3">
                  <CardTitle className="text-base text-purple-800 dark:text-purple-200">
                    {t('national_insight_center_info.modal.basic_info')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                        {t('national_insight_center_info.modal.id')}:
                      </label>
                      <p className="text-purple-900 dark:text-purple-100 font-medium bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded border border-purple-200 dark:border-purple-700 text-sm">
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
                          className={`text-xs ${selectedItem.confirmed
                              ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 border-green-300 dark:border-green-600'
                              : 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-600'
                            }`}
                        >
                          {selectedItem.confirmed ? t('national_insight_center_info.confirmed') : t('national_insight_center_info.pending')}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                        {t('national_insight_center_info.modal.created_at')}:
                      </label>
                      <p className="text-purple-900 dark:text-purple-100 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded border border-purple-200 dark:border-purple-700 text-sm">
                        {formatPersianDateOnly(selectedItem.created_at)}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                        {t('national_insight_center_info.modal.info_category')}:
                      </label>
                      <p className="text-purple-900 dark:text-purple-100 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded border border-purple-200 dark:border-purple-700 text-sm">
                        {selectedItem.info_category?.name || '-'}
                      </p>
                    </div>
                  </div>
                  {selectedItem.description && (
                    <div>
                      <label className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                        {t('national_insight_center_info.modal.description')}:
                      </label>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded border border-purple-200 dark:border-purple-700 mt-1">
                        <p className="text-purple-900 dark:text-purple-100 text-justify leading-relaxed text-sm">
                          {selectedItem.description}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Statistics */}
              {selectedItem.item_stats && selectedItem.item_stats.length > 0 && (
                <Card className="bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-700 shadow-lg dark:shadow-gray-900/20">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border-b border-purple-200 dark:border-purple-700 py-3">
                    <CardTitle className="text-base text-purple-800 dark:text-purple-200 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      {t('national_insight_center_info.modal.statistics')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="overflow-x-auto">
                      <table className="w-full border border-purple-200 dark:border-purple-700 rounded-lg bg-white dark:bg-gray-800 text-sm" style={{ borderCollapse: 'collapse' }}>
                        {/* Group stats by category */}
                        {(() => {
                          const groupedStats = selectedItem.item_stats.reduce((acc, stat) => {
                            const categoryId = stat.stat_category_item.category.id;
                            if (!acc[categoryId]) {
                              acc[categoryId] = {
                                category: stat.stat_category_item.category,
                                items: []
                              };
                            }
                            acc[categoryId].items.push(stat);
                            return acc;
                          }, {} as Record<number, { category: any; items: any[] }>);

                          const categoryEntries = Object.entries(groupedStats);
                          
                          return (
                            <>
                              {/* First Row: All Categories */}
                              <tr className="border-b border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20">
                                {categoryEntries.map(([categoryId, categoryData]) => (
                                  <td 
                                    key={categoryId}
                                    colSpan={categoryData.items.length} 
                                    className="font-bold text-center py-2 border-r border-purple-200 dark:border-purple-700 text-purple-800 dark:text-purple-200 text-sm"
                                    style={{ backgroundColor: categoryData.category.color + '20' }}
                                  >
                                    {categoryData.category.label}
                                  </td>
                                ))}
                              </tr>
                              
                              {/* Second Row: Item Labels */}
                              <tr className="border-b border-purple-200 dark:border-purple-700 bg-purple-25 dark:bg-purple-900/10">
                                {categoryEntries.map(([categoryId, categoryData]) => (
                                  <React.Fragment key={categoryId}>
                                    {categoryData.items.map((stat) => (
                                      <th 
                                        key={stat.id}
                                        className="text-center py-1 font-semibold border-r border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 bg-white dark:bg-gray-800 text-xs"
                                      >
                                        {stat.stat_category_item.label}
                                      </th>
                                    ))}
                                  </React.Fragment>
                                ))}
                              </tr>
                              
                              {/* Third Row: Values */}
                              <tr className="border-b border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-800">
                                {categoryEntries.map(([categoryId, categoryData]) => (
                                  <React.Fragment key={categoryId}>
                                    {categoryData.items.map((stat) => (
                                      <td 
                                        key={stat.id}
                                        className="text-center py-1 border-r border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-800"
                                      >
                                        <Badge variant="outline" className="bg-gradient-to-l from-green-100 dark:from-green-800 to-green-200 dark:to-green-700 text-green-800 dark:text-green-200 border-green-300 dark:border-green-600 px-2 py-0.5 rounded text-xs font-semibold">
                                          {stat.string_value}
                                        </Badge>
                                      </td>
                                    ))}
                                  </React.Fragment>
                                ))}
                              </tr>
                              
                              {/* Notes Row (if any) */}
                              {selectedItem.item_stats.some(stat => stat.notes) && (
                                <tr className="border-b border-purple-200 dark:border-purple-700 bg-gray-50 dark:bg-gray-700/50">
                                  {categoryEntries.map(([categoryId, categoryData]) => (
                                    <React.Fragment key={categoryId}>
                                      {categoryData.items.map((stat) => (
                                        <td 
                                          key={`notes-${stat.id}`}
                                          className="text-center py-1 text-xs border-r border-purple-200 dark:border-purple-700 text-purple-600 dark:text-purple-400 bg-gray-50 dark:bg-gray-700/50"
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
                <Card className="bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-700 shadow-lg dark:shadow-gray-900/20">
                  <CardContent className="text-center py-4">
                    <div className="flex flex-col items-center gap-3 text-purple-600 dark:text-purple-400">
                      <div className="p-3 bg-purple-100 dark:bg-purple-800/50 rounded-full flex items-center justify-center border border-purple-200 dark:border-purple-700">
                        <BarChart3 className="h-8 w-8 text-purple-400 dark:text-purple-300" />
                      </div>
                      <p className="text-base font-bold text-purple-800 dark:text-purple-200">{t('national_insight_center_info.modal.no_statistics')}</p>
                      <p className="text-purple-500 dark:text-purple-400 max-w-md text-sm">{t('national_insight_center_info.modal.no_statistics_description')}</p>
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
