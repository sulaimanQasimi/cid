import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pencil, Trash, ExternalLink, FileText, BarChart3, TrendingUp, AlertTriangle, Plus, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/lib/i18n/translate';
import { usePermissions } from '@/hooks/use-permissions';
import { CanCreate, CanView, CanUpdate, CanDelete } from '@/components/ui/permission-guard';
import Header from '@/components/template/header';

interface Info {
  id: number;
  title: string;
  content: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface InfoCategory {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  infos: Info[];
}

interface Props {
  infoCategory: InfoCategory;
}

export default function ShowInfoCategory({ infoCategory }: Props) {
  const { canCreate, canView, canUpdate, canDelete } = usePermissions();
  const { t } = useTranslation();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('info.page_title'),
      href: route('info-types.index'),
    },
    {
      title: t('info_categories.page_title'),
      href: route('info-categories.index'),
    },
    {
      title: infoCategory.name,
      href: '#',
    },
  ];

  const handleDelete = () => {
    router.delete(route('info-categories.destroy', infoCategory.id), {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('info_categories.show.title', { name: infoCategory.name })} />
      
      <div className="container px-0 py-6">
        {/* Header Component */}
        <Header
          title={t('info_categories.show.title', { name: infoCategory.name })}
          description={t('info_categories.show.description')}
          icon={<FileText className="h-6 w-6 text-white" />}
          model="info_category"
          routeName={route('info-categories.show', infoCategory.id)}
          theme="purple"
          buttonText={t('info_categories.show.edit_button')}
          showBackButton={true}
          backRouteName={route('info-categories.index')}
          backButtonText={t('common.back_to_list')}
          showButton={false}
          actionButtons={
            <>
              <Button asChild variant="outline" size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105">
                <Link href={route('info-categories.index')} className="flex items-center gap-3">
                  <ArrowLeft className="h-5 w-5" />
                  {t('common.back_to_list')}
                </Link>
              </Button>
              <CanUpdate model="info_category">
                <Button asChild size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105">
                  <Link href={route('info-categories.edit', infoCategory.id)} className="flex items-center gap-3">
                    <Pencil className="h-5 w-5" />
                    {t('info_categories.show.edit_button')}
                  </Link>
                </Button>
              </CanUpdate>
              <CanDelete model="info_category">
                <Button 
                  size="lg"
                  variant="destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="bg-red-500/20 backdrop-blur-md border-red-300/30 text-white hover:bg-red-500/30 shadow-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105"
                >
                  <Trash className="h-5 w-5 mr-2" />
                  {t('info_categories.show.delete_button')}
                </Button>
              </CanDelete>
            </>
          }
        />

        {/* Category Details */}
        <div className="mb-8">
          <Card className="shadow-2xl overflow-hidden bg-gradient-to-bl from-white dark:from-gray-800 to-purple-50/30 dark:to-purple-900/20 border-0 ">
            <CardHeader className="bg-gradient-to-l from-purple-500 to-purple-600 text-white py-6">
              <CardTitle className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm shadow-lg">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{t('info_categories.show.details_title')}</div>
                  <div className="text-purple-100 text-sm font-medium">{t('info_categories.show.details_description')}</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-2">{t('info_categories.show.name_label')}</h3>
                    <p className="text-lg text-purple-900 dark:text-purple-100 font-medium bg-white dark:bg-gray-800 p-4 rounded-xl border border-purple-200 dark:border-purple-700">{infoCategory.name}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-2">{t('info_categories.show.description_label')}</h3>
                    <p className="text-purple-800 dark:text-purple-200 bg-white dark:bg-gray-800 p-4 rounded-xl border border-purple-200 dark:border-purple-700 min-h-[60px]">
                      {infoCategory.description || t('info_categories.show.no_description')}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-2">{t('info_categories.show.created_at_label')}</h3>
                    <p className="text-purple-800 dark:text-purple-200 bg-white dark:bg-gray-800 p-4 rounded-xl border border-purple-200 dark:border-purple-700">{new Date(infoCategory.created_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-2">{t('info_categories.show.updated_at_label')}</h3>
                    <p className="text-purple-800 dark:text-purple-200 bg-white dark:bg-gray-800 p-4 rounded-xl border border-purple-200 dark:border-purple-700">{new Date(infoCategory.updated_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Associated Info Records */}
        <div className="mb-8">
          <Card className="shadow-2xl overflow-hidden bg-gradient-to-bl from-white dark:from-gray-800 to-purple-50/30 dark:to-purple-900/20 border-0 ">
            <CardHeader className="bg-gradient-to-l from-purple-500 to-purple-600 text-white py-6">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 backdrop-blur-sm shadow-lg">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{t('info_categories.show.associated_info_title')}</div>
                    <div className="text-purple-100 text-sm font-medium">{t('info_categories.show.associated_info_description')}</div>
                  </div>
                </div>
                <CanCreate model="info">
                  <Button asChild size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105">
                    <Link href={route('info-types.index')} className="flex items-center gap-3">
                      <Plus className="h-5 w-5" />
                      {t('info_categories.show.create_info_button')}
                    </Link>
                  </Button>
                </CanCreate>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {infoCategory.infos && infoCategory.infos.length > 0 ? (
                <div className="overflow-hidden rounded-b-3xl">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-l from-purple-100 dark:from-purple-900 to-purple-200 dark:to-purple-800 border-0">
                        <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('info_categories.show.table.id')}</TableHead>
                        <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('info_categories.show.table.title')}</TableHead>
                        <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('info_categories.show.table.status')}</TableHead>
                        <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('info_categories.show.table.created_at')}</TableHead>
                        <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6 text-right">{t('info_categories.show.table.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {infoCategory.infos.map((info) => (
                        <TableRow key={info.id} className="hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-colors duration-300 border-b border-purple-100 dark:border-purple-800">
                          <TableCell className="font-bold text-purple-900 dark:text-purple-100 py-6 px-6 text-lg">{info.id}</TableCell>
                          <TableCell className="font-bold text-purple-900 dark:text-purple-100 py-6 px-6 text-lg">{info.title}</TableCell>
                          <TableCell className="py-6 px-6">
                            <Badge 
                              variant={info.status === 'published' ? 'default' : info.status === 'draft' ? 'secondary' : 'outline'}
                              className={`${
                                info.status === 'published'
                                  ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 border-green-300 dark:border-green-600'
                                  : info.status === 'draft'
                                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600'
                                  : 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-600'
                              }`}
                            >
                              {info.status.charAt(0).toUpperCase() + info.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-purple-800 dark:text-purple-200 py-6 px-6 font-medium">
                            {new Date(info.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="py-6 px-6">
                            <div className="flex items-center gap-2 justify-end">
                              <CanView model="info">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  asChild
                                  title={t('info_categories.show.actions.view')}
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
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="flex flex-col items-center gap-4 text-purple-600 dark:text-purple-400">
                    <div className="p-4 bg-purple-100 dark:bg-purple-800 rounded-full">
                      <AlertTriangle className="h-16 w-16 text-purple-400 dark:text-purple-300" />
                    </div>
                    <p className="text-xl font-bold">{t('info_categories.show.no_info_records')}</p>
                    <p className="text-purple-500 dark:text-purple-400">{t('info_categories.show.no_info_records_description')}</p>
                    <CanCreate model="info">
                      <Button asChild className="mt-4 bg-gradient-to-l from-purple-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <Link href={route('info-types.index')}>
                          <Plus className="h-5 w-5 mr-2" />
                          {t('info_categories.show.create_first_info_button')}
                        </Link>
                      </Button>
                    </CanCreate>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('info_categories.show.delete_dialog.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('info_categories.show.delete_dialog.description', { name: infoCategory.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>{t('info_categories.show.delete_dialog.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              {t('info_categories.show.delete_dialog.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
