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
      href: route('infos.index'),
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
        {/* Modern Header with Glassmorphism */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-purple-600 via-indigo-600 to-blue-600 p-8 lg:p-12 text-white shadow-2xl mb-8 group">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="absolute top-0 left-0 w-80 h-80 bg-white/10 rounded-full -translate-y-40 -translate-x-40 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 translate-x-32 blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full -translate-x-16 -translate-y-16 blur-xl group-hover:scale-150 transition-transform duration-500"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8">
            <div className="flex items-center gap-8">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => window.history.back()}
                className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105 group/btn"
              >
                <div className="p-1 bg-white/20 rounded-lg group-hover/btn:scale-110 transition-transform duration-300">
                  <ArrowRight className="h-5 w-5" />
                </div>
                {t('common.back')}
              </Button>
              
              <div className="p-6 bg-white/20 backdrop-blur-md rounded-3xl border border-white/30 shadow-2xl group-hover:scale-105 transition-transform duration-300">
                <FileText className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl tracking-tight">{infoCategory.name}</h2>
                <div className="text-white/90 flex items-center gap-3 text-xl font-medium">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  {t('info_categories.show.description')}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <CanUpdate model="info_category">
                <Button asChild size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105 group/btn">
                  <Link href={route('info-categories.edit', infoCategory.id)} className="flex items-center gap-3">
                    <div className="p-1 bg-white/20 rounded-lg group-hover/btn:scale-110 transition-transform duration-300">
                      <Pencil className="h-5 w-5" />
                    </div>
                    {t('info_categories.show.edit_button')}
                  </Link>
                </Button>
              </CanUpdate>
              <CanDelete model="info_category">
                <Button 
                  size="lg" 
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="bg-red-500/20 backdrop-blur-md border-red-300/30 text-white hover:bg-red-500/30 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105 group/btn"
                >
                  <div className="p-1 bg-red-500/20 rounded-lg group-hover/btn:scale-110 transition-transform duration-300">
                    <Trash className="h-5 w-5" />
                  </div>
                  {t('info_categories.show.delete_button')}
                </Button>
              </CanDelete>
            </div>
          </div>
        </div>

        {/* Category Details */}
        <div className="mb-8">
          <Card className="shadow-2xl overflow-hidden bg-gradient-to-bl from-white to-purple-50/30 border-0 rounded-3xl">
            <CardHeader className="bg-gradient-to-l from-purple-500 to-purple-600 text-white py-6">
              <CardTitle className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
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
                    <h3 className="text-lg font-semibold text-purple-900 mb-2">{t('info_categories.show.name_label')}</h3>
                    <p className="text-lg text-purple-800 font-medium">{infoCategory.name}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-purple-900 mb-2">{t('info_categories.show.description_label')}</h3>
                    <p className="text-purple-800">
                      {infoCategory.description || t('info_categories.show.no_description')}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-purple-900 mb-2">{t('info_categories.show.created_at_label')}</h3>
                    <p className="text-purple-800">{new Date(infoCategory.created_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-purple-900 mb-2">{t('info_categories.show.updated_at_label')}</h3>
                    <p className="text-purple-800">{new Date(infoCategory.updated_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Associated Info Records */}
        <div className="mb-8">
          <Card className="shadow-2xl overflow-hidden bg-gradient-to-bl from-white to-purple-50/30 border-0 rounded-3xl">
            <CardHeader className="bg-gradient-to-l from-purple-500 to-purple-600 text-white py-6">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{t('info_categories.show.associated_info_title')}</div>
                    <div className="text-purple-100 text-sm font-medium">{t('info_categories.show.associated_info_description')}</div>
                  </div>
                </div>
                <CanCreate model="info">
                  <Button asChild size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105 group/btn">
                    <Link href={route('infos.create', { category_id: infoCategory.id })} className="flex items-center gap-3">
                      <div className="p-1 bg-white/20 rounded-lg group-hover/btn:scale-110 transition-transform duration-300">
                        <Plus className="h-5 w-5" />
                      </div>
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
                      <TableRow className="bg-gradient-to-l from-purple-100 to-purple-200 border-0">
                        <TableHead className="text-purple-800 font-bold text-lg py-6 px-6">{t('info_categories.show.table.id')}</TableHead>
                        <TableHead className="text-purple-800 font-bold text-lg py-6 px-6">{t('info_categories.show.table.title')}</TableHead>
                        <TableHead className="text-purple-800 font-bold text-lg py-6 px-6">{t('info_categories.show.table.status')}</TableHead>
                        <TableHead className="text-purple-800 font-bold text-lg py-6 px-6">{t('info_categories.show.table.created_at')}</TableHead>
                        <TableHead className="text-purple-800 font-bold text-lg py-6 px-6 text-right">{t('info_categories.show.table.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {infoCategory.infos.map((info) => (
                        <TableRow key={info.id} className="hover:bg-purple-50/50 transition-colors duration-300 border-b border-purple-100">
                          <TableCell className="font-bold text-purple-900 py-6 px-6 text-lg">{info.id}</TableCell>
                          <TableCell className="font-bold text-purple-900 py-6 px-6 text-lg">{info.title}</TableCell>
                          <TableCell className="py-6 px-6">
                            <Badge 
                              variant={info.status === 'published' ? 'default' : info.status === 'draft' ? 'secondary' : 'outline'}
                              className={`${
                                info.status === 'published'
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                  : info.status === 'draft'
                                  ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                  : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
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
                                  title={t('info_categories.show.actions.view')}
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
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="flex flex-col items-center gap-4 text-purple-600">
                    <div className="p-4 bg-purple-100 rounded-full">
                      <AlertTriangle className="h-16 w-16 text-purple-400" />
                    </div>
                    <p className="text-xl font-bold">{t('info_categories.show.no_info_records')}</p>
                    <p className="text-purple-500">{t('info_categories.show.no_info_records_description')}</p>
                    <CanCreate model="info">
                      <Button asChild className="mt-4 bg-gradient-to-l from-purple-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <Link href={route('infos.create', { category_id: infoCategory.id })}>
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
