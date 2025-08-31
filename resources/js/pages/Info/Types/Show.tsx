import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pencil, Trash, ExternalLink, FileText, BarChart3, TrendingUp, AlertTriangle, Plus, Database, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/lib/i18n/translate';
import { usePermissions } from '@/hooks/use-permissions';
import { CanCreate, CanView, CanUpdate, CanDelete } from '@/components/ui/permission-guard';

interface Info {
  id: number;
  title: string;
  content: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface InfoType {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  infos: Info[];
  infoStats: any[]; // Added for stats
}

interface Props {
  infoType: InfoType;
}

export default function ShowInfoType({ infoType }: Props) {
  const { t } = useTranslation();
  const { canCreate, canView, canUpdate, canDelete } = usePermissions();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('info.page_title'),
      href: route('infos.index'),
    },
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
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-purple-600 via-indigo-600 to-blue-600 p-8 lg:p-12 text-white shadow-2xl mb-8 group">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="absolute top-0 left-0 w-80 h-80 bg-white/10 rounded-full -translate-y-40 -translate-x-40 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 translate-x-32 blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full -translate-x-16 -translate-y-16 blur-xl group-hover:scale-150 transition-transform duration-500"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8">
            <div className="flex items-center gap-8">
              <div className="p-6 bg-white/20 backdrop-blur-md rounded-3xl border border-white/30 shadow-2xl group-hover:scale-105 transition-transform duration-300">
                <FileText className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl tracking-tight">{infoType.name}</h2>
                <div className="text-white/90 flex items-center gap-3 text-xl font-medium">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  {t('info_types.show.description')}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button asChild variant="outline" size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105">
                <Link href={route('info-types.index')} className="flex items-center gap-3">
                  <ArrowLeft className="h-5 w-5" />
                  {t('info_types.show.back_button')}
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
            </div>
          </div>
        </div>

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
                    {new Date(infoType.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">{t('info_types.show.updated_at_label')}</h3>
                  <p className="text-purple-800 bg-gradient-to-l from-purple-50 to-white p-4 rounded-xl border border-purple-200">
                    {new Date(infoType.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Display Card */}
        <Card className="shadow-2xl bg-gradient-to-bl from-white to-purple-50/30 border-0 rounded-3xl overflow-hidden mb-8">
          <CardHeader className="bg-gradient-to-l from-purple-500 to-purple-600 text-white py-6">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
                  <Database className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{t('info_types.show.stats_title')}</div>
                  <div className="text-purple-100 text-sm font-medium">{t('info_types.show.stats_description')}</div>
                </div>
              </div>
              <CanUpdate model="info_type">
                <Button asChild size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105">
                  <Link href={route('info-types.stats', infoType.id)} className="flex items-center gap-3">
                    <Settings className="h-5 w-5" />
                    {t('info_types.show.manage_stats_button')}
                  </Link>
                </Button>
              </CanUpdate>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-hidden rounded-b-3xl">
              {infoType.infoStats && infoType.infoStats.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-l from-purple-100 to-purple-200 border-0">
                      <TableHead className="text-purple-800 font-bold text-lg py-6 px-6">{t('info_types.show.stats_table.category')}</TableHead>
                      <TableHead className="text-purple-800 font-bold text-lg py-6 px-6">{t('info_types.show.stats_table.item')}</TableHead>
                      <TableHead className="text-purple-800 font-bold text-lg py-6 px-6">{t('info_types.show.stats_table.value')}</TableHead>
                      <TableHead className="text-purple-800 font-bold text-lg py-6 px-6">{t('info_types.show.stats_table.notes')}</TableHead>
                      <TableHead className="text-purple-800 font-bold text-lg py-6 px-6">{t('info_types.show.stats_table.created_at')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {infoType.infoStats.map((stat) => (
                      <TableRow key={stat.id} className="hover:bg-purple-50/50 transition-colors duration-300 border-b border-purple-100">
                        <TableCell className="py-6 px-6">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: stat.stat_category_item.category.color }}
                            ></div>
                            <span className="font-semibold text-purple-800">
                              {stat.stat_category_item.category.label}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-purple-900 py-6 px-6">
                          {stat.stat_category_item.label}
                        </TableCell>
                        <TableCell className="py-6 px-6">
                          <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1">
                            {stat.integer_value !== null ? stat.integer_value : stat.string_value}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-6 px-6">
                          <span className="text-purple-700">
                            {stat.notes || '-'}
                          </span>
                        </TableCell>
                        <TableCell className="text-purple-800 py-6 px-6 font-medium">
                          {new Date(stat.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="h-32 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4 text-purple-600">
                    <div className="p-4 bg-purple-100 rounded-full">
                      <Database className="h-16 w-16 text-purple-400" />
                    </div>
                    <p className="text-xl font-bold">{t('info_types.show.no_stats')}</p>
                    <p className="text-purple-500">{t('info_types.show.no_stats_description')}</p>
                    <CanUpdate model="info_type">
                      <Button asChild className="bg-gradient-to-l from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105">
                        <Link href={route('info-types.stats', infoType.id)} className="flex items-center gap-3">
                          <Plus className="h-5 w-5" />
                          {t('info_types.show.add_first_stat_button')}
                        </Link>
                      </Button>
                    </CanUpdate>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Associated Info Records */}
        <Card className="shadow-2xl overflow-hidden bg-gradient-to-bl from-white to-purple-50/30 border-0 rounded-3xl">
          <CardHeader className="bg-gradient-to-l from-purple-500 to-purple-600 text-white py-6">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{t('info_types.show.associated_info_title')}</div>
                  <div className="text-purple-100 text-sm font-medium">{t('info_types.show.associated_info_description')}</div>
                </div>
              </div>
              <CanCreate model="info">
                <Button asChild size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105">
                  <Link href={route('infos.create', { type_id: infoType.id })} className="flex items-center gap-3">
                    <Plus className="h-5 w-5" />
                    {t('info_types.show.create_info_button')}
                  </Link>
                </Button>
              </CanCreate>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-hidden rounded-b-3xl">
              {infoType.infos && infoType.infos.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-l from-purple-100 to-purple-200 border-0">
                      <TableHead className="text-purple-800 font-bold text-lg py-6 px-6">{t('info_types.show.table.id')}</TableHead>
                      <TableHead className="text-purple-800 font-bold text-lg py-6 px-6">{t('info_types.show.table.title')}</TableHead>
                      <TableHead className="text-purple-800 font-bold text-lg py-6 px-6">{t('info_types.show.table.status')}</TableHead>
                      <TableHead className="text-purple-800 font-bold text-lg py-6 px-6">{t('info_types.show.table.created_at')}</TableHead>
                      <TableHead className="text-purple-800 font-bold text-lg py-6 px-6 text-right">{t('info_types.show.table.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {infoType.infos.map((info) => (
                      <TableRow key={info.id} className="hover:bg-purple-50/50 transition-colors duration-300 border-b border-purple-100">
                        <TableCell className="font-bold text-purple-900 py-6 px-6 text-lg">{info.id}</TableCell>
                        <TableCell className="font-bold text-purple-900 py-6 px-6 text-lg">{info.title}</TableCell>
                        <TableCell className="py-6 px-6">
                          <Badge 
                            variant="outline" 
                            className={`px-4 py-2 rounded-xl font-semibold ${
                              info.status === 'published'
                                ? 'bg-green-100 text-green-800 border-green-300'
                                : info.status === 'draft'
                                ? 'bg-gray-100 text-gray-800 border-gray-300'
                                : 'bg-yellow-100 text-yellow-800 border-yellow-300'
                            }`}
                          >
                            {info.status.charAt(0).toUpperCase() + info.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-purple-800 py-6 px-6 font-medium">
                          {new Date(info.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="py-6 px-6">
                          <div className="flex items-center gap-2 justify-end">
                            <CanView model="info">
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                title={t('info_types.show.actions.view')}
                                className="h-10 w-10 rounded-xl hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-all duration-300 hover:scale-110"
                              >
                                <Link href={route('infos.show', info.id)}>
                                  <ExternalLink className="h-5 w-5" />
                                </Link>
                              </Button>
                            </CanView>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="h-32 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4 text-purple-600">
                    <div className="p-4 bg-purple-100 rounded-full">
                      <AlertTriangle className="h-16 w-16 text-purple-400" />
                    </div>
                    <p className="text-xl font-bold">{t('info_types.show.no_info_records')}</p>
                    <p className="text-purple-500">{t('info_types.show.no_info_records_description')}</p>
                    <CanCreate model="info">
                      <Button asChild className="bg-gradient-to-l from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105">
                        <Link href={route('infos.create', { type_id: infoType.id })} className="flex items-center gap-3">
                          <Plus className="h-5 w-5" />
                          {t('info_types.show.create_first_info_button')}
                        </Link>
                      </Button>
                    </CanCreate>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
