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
import InfoCreateModal from '@/components/InfoCreateModal';

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

interface InfoType {
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
  infoType: InfoType;
  infos: {
    data: Info[];
    links: any[];
  };
  infoCategories?: InfoCategory[];
  departments?: Department[];
}

export default function ShowInfoType({ infoType, infos, infoCategories = [], departments = [] }: Props) {
  const { t } = useTranslation();
  const { canCreate, canView, canUpdate, canDelete } = usePermissions();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('info_types.page_title'),
      href: route('info-types.index'),
    },
    {
      title: infoType.name,
      href: '#',
    },
  ];

  const handleDelete = () => {
    router.delete(route('info-types.destroy', infoType.id), {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('info_types.show.title', { name: infoType.name })} />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('info_types.delete_dialog.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('info_types.delete_dialog.description', { name: infoType.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('info_types.delete_dialog.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              {t('info_types.delete_dialog.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="container px-0 py-6">
        {/* Modern Header with Glassmorphism */}
   
        <Header
          title={t('info_types.show.title', { name: infoType.name })}
          description={t('info_types.show.description')}
          icon={<TrendingUp className="h-6 w-6 text-white" />}
          model="info_type"
          routeName={route('info-types.show', infoType.id)}
          theme="purple"
          buttonText={t('common.edit', { name: infoType.name })}
          showBackButton={true}
          backRouteName={route('info-types.index')}
          backButtonText={t('common.back_to_list')}
          showButton={false}
          actionButtons={
            <>
              <Button asChild variant="outline" size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105">
                <Link href={route('info-types.index')} className="flex items-center gap-3">
                  <ArrowLeft className="h-5 w-5" />
                  {t('info_types.show.back_button')}
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105">
                <Link href={route('info-types.print', infoType.id)} className="flex items-center gap-3">
                  <Printer className="h-5 w-5" />
                  {t('info_types.show.print_button')}
                </Link>
              </Button>
              <CanUpdate model="info_type">
                <Button asChild size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105">
                  <Link href={route('info-types.edit', infoType.id)} className="flex items-center gap-3">
                    <Pencil className="h-5 w-5" />
                    {t('info_types.show.edit_button')}
                  </Link>
                </Button>
              </CanUpdate>
              <CanDelete model="info_type">
                <Button
                  size="lg"
                  variant="destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="bg-red-500/20 backdrop-blur-md border-red-300/30 text-white hover:bg-red-500/30 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105"
                >
                  <Trash className="h-5 w-5 mr-2" />
                  {t('info_types.show.delete_button')}
                </Button>
              </CanDelete>
            </>
          }
        />

        {/* Info Type Details Card */}
        <Card className="shadow-2xl bg-gradient-to-bl from-white to-purple-50/30 border-0 rounded-3xl overflow-hidden mb-8">
          <CardHeader className="bg-gradient-to-l from-purple-500 to-purple-600 text-white py-6">
            <CardTitle className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold">{t('info_types.show.details_title')}</div>
                <div className="text-purple-100 text-sm font-medium">{t('info_types.show.details_description')}</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">{t('info_types.show.name_label')}</h3>
                  <p className="text-xl font-bold text-purple-900 bg-gradient-to-l from-purple-50 to-white p-4 rounded-xl border border-purple-200">
                    {infoType.name}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">{t('info_types.show.description_label')}</h3>
                  <p className="text-purple-800 bg-gradient-to-l from-purple-50 to-white p-4 rounded-xl border border-purple-200 min-h-[60px]">
                    {infoType.description || t('info_types.show.no_description')}
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">{t('info_types.show.created_at_label')}</h3>
                  <p className="text-purple-800 bg-gradient-to-l from-purple-50 to-white p-4 rounded-xl border border-purple-200">
                    {formatPersianDateOnly(infoType.created_at)}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">{t('info_types.show.updated_at_label')}</h3>
                  <p className="text-purple-800 bg-gradient-to-l from-purple-50 to-white p-4 rounded-xl border border-purple-200">
                    {formatPersianDateOnly(infoType.updated_at)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Display Card */}
        <div className="mt-8">
          <Header
            title={t('info_types.show.stats_title')}
            description={t('info_types.show.stats_description')}
            icon={<Database className="h-6 w-6 text-white" />}
            model="info_type"
            routeName={route('info-types.stats', infoType.id)}
            buttonText={t('info_types.show.manage_stats_button')}
            theme="purple"
            showButton={canUpdate('info_type')}
          />
          <Card className="shadow-2xl overflow-hidden bg-gradient-to-bl from-white dark:from-gray-800 to-purple-50/30 dark:to-purple-900/20 border-0 rounded-3xl">
            <CardContent className="p-0">
              <div className="overflow-hidden rounded-b-3xl">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-l from-purple-100 dark:from-purple-900 to-purple-200 dark:to-purple-800 border-0">
                      <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('info_types.show.stats_table.category')}</TableHead>
                      <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('info_types.show.stats_table.item')}</TableHead>
                      <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('info_types.show.stats_table.value')}</TableHead>
                      <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('info_types.show.stats_table.notes')}</TableHead>
                      <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('info_types.show.stats_table.created_at')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {infoType.infoStats && infoType.infoStats.length > 0 ? (
                      infoType.infoStats.map((stat) => (
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
                            <p className="text-xl font-bold text-center">{t('info_types.show.no_stats')}</p>
                            <p className="text-purple-500 dark:text-purple-400 text-center">{t('info_types.show.no_stats_description')}</p>
                            <CanUpdate model="info_type">
                              <div className="flex justify-center">
                                <Button asChild className="bg-gradient-to-l from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center">
                                  <Link href={route('info-types.stats', infoType.id)} className="flex items-center gap-3">
                                    <Plus className="h-5 w-5" />
                                    {t('info_types.show.add_first_stat_button')}
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
            title={t('info_types.show.associated_info_title')}
            description={t('info_types.show.associated_info_description')}
            icon={<FileText className="h-6 w-6 text-white" />}
            model="info"
            routeName={route('info-types.show', infoType.id)}
            buttonText={t('info_types.show.create_info_button')}
            theme="purple"
            showButton={false}
            actionButtons={
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-5 w-5 mr-2" />
                {t('info_types.show.create_info_button')}
              </Button>
            }
          />
          <Card className="shadow-2xl overflow-hidden bg-gradient-to-bl from-white dark:from-gray-800 to-purple-50/30 dark:to-purple-900/20 border-0 rounded-3xl">
            <CardContent className="p-0">
              <div className="overflow-hidden rounded-b-3xl">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-l from-purple-100 dark:from-purple-900 to-purple-200 dark:to-purple-800 border-0">
                      <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('info_types.show.table.id')}</TableHead>
                      <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('info_types.show.table.title')}</TableHead>
                      <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('info_types.show.table.status')}</TableHead>
                      <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('info_types.show.table.created_at')}</TableHead>
                      <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6 text-right">{t('info_types.show.table.actions')}</TableHead>
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
                              <CanView model="info">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  asChild
                                  title={t('info_types.show.actions.view')}
                                  className="h-10 w-10 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-300 hover:scale-110"
                                >
                                  <Link href={route('infos.show', info.id)}>
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
                            <p className="text-xl font-bold text-center">{t('info_types.show.no_info_records')}</p>
                            <p className="text-purple-500 dark:text-purple-400 text-center">{t('info_types.show.no_info_records_description')}</p>
                            <CanCreate model="info">
                              <div className="flex justify-center">
                                <Button 
                                  onClick={() => setIsCreateModalOpen(true)}
                                  className="bg-gradient-to-l from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-3"
                                >
                                  <Plus className="h-5 w-5" />
                                  {t('info_types.show.create_first_info_button')}
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

        {/* Info Create Modal */}
        <InfoCreateModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          infoTypes={[infoType]}
          infoCategories={infoCategories}
          departments={departments}
          typeId={infoType.id}
        />
      </div>
    </AppLayout>
  );
}
