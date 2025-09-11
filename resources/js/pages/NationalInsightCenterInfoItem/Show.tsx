import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Clock, 
  User, 
  Calendar,
  Building2,
  Folder,
  BarChart3,
  Eye,
  FileText
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';
import { usePermissions } from '@/hooks/use-permissions';
import { CanUpdate, CanDelete, CanConfirm } from '@/components/ui/permission-guard';
import Header from '@/components/template/header';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface User {
  id: number;
  name: string;
  email: string;
}

interface InfoCategory {
  id: number;
  name: string;
  label: string;
  color: string;
}

interface Province {
  id: number;
  name: string;
  label: string;
  color: string;
}

interface District {
  id: number;
  name: string;
  label: string;
  color: string;
}

interface NationalInsightCenterInfo {
  id: number;
  name: string;
  code: string;
  description: string | null;
}

interface InfoStat {
  id: number;
  stat_category_item_id: number;
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
}

interface NationalInsightCenterInfoItem {
  id: number;
  title: string;
  registration_number: string;
  description: string | null;
  date: string | null;
  confirmed: boolean;
  created_at: string;
  updated_at: string;
  nationalInsightCenterInfo: NationalInsightCenterInfo;
  infoCategory: InfoCategory | null;
  province: Province | null;
  district: District | null;
  creator: User | null;
  confirmer: User | null;
  infoStats: InfoStat[];
}

interface ShowProps {
  item: NationalInsightCenterInfoItem;
}

export default function Show({ item }: ShowProps) {
  const { t } = useTranslation();
  const { canUpdate, canDelete, canConfirm } = usePermissions();

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('national_insight_center_info.page_title'),
      href: route('national-insight-center-infos.index'),
    },
    {
      title: item.nationalInsightCenterInfo.name,
      href: route('national-insight-center-infos.show', item.nationalInsightCenterInfo.id),
    },
    {
      title: item.title,
      href: '#',
    },
  ];

  const handleDelete = () => {
    router.delete(route('national-insight-center-info-items.destroy', item.id));
  };

  const handleConfirm = () => {
    router.patch(route('national-insight-center-info-items.confirm', item.id));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('national_insight_center_info_item.show.title', { name: item.title })} />

      <div className="container px-0 py-6">
        <Header
          title={t('national_insight_center_info_item.show.title', { name: item.title })}
          description={t('national_insight_center_info_item.show.description')}
          icon={<FileText className="h-6 w-6 text-white" />}
          model="national_insight_center_info_item"
          routeName="national-insight-center-info-items.show"
          buttonText={t('national_insight_center_info_item.show.edit_button')}
          theme="purple"
          buttonSize="lg"
          showBackButton={true}
          backRouteName="national-insight-center-infos.show"
          backButtonText={t('national_insight_center_info_item.show.back_button')}
          showButton={canUpdate('national_insight_center_info_item')}
          actionButtons={
            <>
              <CanUpdate model="national_insight_center_info_item">
                <Button asChild variant="outline" size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105">
                  <Link href={route('national-insight-center-info-items.edit', item.id)} className="flex items-center gap-3">
                    <Edit className="h-5 w-5" />
                    {t('national_insight_center_info_item.show.edit_button')}
                  </Link>
                </Button>
              </CanUpdate>

              <CanUpdate model="national_insight_center_info_item">
                <Button asChild variant="outline" size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105">
                  <Link href={route('national-insight-center-info-items.stats', item.id)} className="flex items-center gap-3">
                    <BarChart3 className="h-5 w-5" />
                    {t('national_insight_center_info_item.show.stats_button')}
                  </Link>
                </Button>
              </CanUpdate>

              {!item.confirmed && (
                <CanConfirm model="national_insight_center_info_item">
                  <Button
                    onClick={handleConfirm}
                    variant="outline"
                    size="lg"
                    className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    {t('national_insight_center_info_item.show.confirm_button')}
                  </Button>
                </CanConfirm>
              )}

              <CanDelete model="national_insight_center_info_item">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="lg" className="bg-red-500/20 backdrop-blur-md border-red-400/30 text-white hover:bg-red-500/30 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105">
                      <Trash2 className="h-5 w-5 mr-2" />
                      {t('national_insight_center_info_item.show.delete_button')}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('national_insight_center_info_item.show.delete_confirm_title')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('national_insight_center_info_item.show.delete_confirm_description', { name: item.title })}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                        {t('common.delete')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CanDelete>
            </>
          }
        />

        <div className="grid gap-8">
          {/* Basic Information */}
          <Card className="shadow-2xl bg-gradient-to-bl from-white dark:from-gray-800 to-purple-50/30 dark:to-purple-900/20 border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
              <CardTitle className="text-xl font-bold flex items-center gap-3">
                <FileText className="h-6 w-6" />
                {t('national_insight_center_info_item.show.basic_info')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('national_insight_center_info_item.show.title')}</Label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('national_insight_center_info_item.show.registration_number')}</Label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{item.registration_number}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('national_insight_center_info_item.show.status')}</Label>
                  <Badge 
                    variant={item.confirmed ? "default" : "secondary"}
                    className={item.confirmed ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"}
                  >
                    {item.confirmed ? (
                      <><CheckCircle className="h-4 w-4 mr-1" /> {t('national_insight_center_info_item.show.confirmed')}</>
                    ) : (
                      <><Clock className="h-4 w-4 mr-1" /> {t('national_insight_center_info_item.show.pending')}</>
                    )}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('national_insight_center_info_item.show.date')}</Label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {item.date ? new Date(item.date).toLocaleDateString('fa-IR') : '-'}
                  </p>
                </div>
              </div>

              {item.description && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('national_insight_center_info_item.show.description')}</Label>
                  <p className="text-gray-900 dark:text-white leading-relaxed">{item.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Related Information */}
          <Card className="shadow-2xl bg-gradient-to-bl from-white dark:from-gray-800 to-purple-50/30 dark:to-purple-900/20 border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
              <CardTitle className="text-xl font-bold flex items-center gap-3">
                <Building2 className="h-6 w-6" />
                {t('national_insight_center_info_item.show.related_info')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('national_insight_center_info_item.show.national_insight_center_info')}</Label>
                  <Link 
                    href={route('national-insight-center-infos.show', item.nationalInsightCenterInfo.id)}
                    className="text-lg font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
                  >
                    {item.nationalInsightCenterInfo.name}
                  </Link>
                </div>

                {item.infoCategory && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('national_insight_center_info_item.show.info_category')}</Label>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.infoCategory.color }}
                      ></div>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">{item.infoCategory.label}</span>
                    </div>
                  </div>
                )}

                {item.province && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('national_insight_center_info_item.show.province')}</Label>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.province.color }}
                      ></div>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">{item.province.label}</span>
                    </div>
                  </div>
                )}

                {item.district && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('national_insight_center_info_item.show.district')}</Label>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.district.color }}
                      ></div>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">{item.district.label}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          {item.infoStats && item.infoStats.length > 0 && (
            <Card className="shadow-2xl bg-gradient-to-bl from-white dark:from-gray-800 to-purple-50/30 dark:to-purple-900/20 border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
                <CardTitle className="text-xl font-bold flex items-center gap-3">
                  <BarChart3 className="h-6 w-6" />
                  {t('national_insight_center_info_item.show.statistics')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {item.infoStats.map((stat) => (
                    <div key={stat.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: stat.stat_category_item.category.color }}
                          ></div>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {stat.stat_category_item.category.label} - {stat.stat_category_item.label}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-2">{stat.string_value}</p>
                      {stat.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 italic">{stat.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Audit Information */}
          <Card className="shadow-2xl bg-gradient-to-bl from-white dark:from-gray-800 to-purple-50/30 dark:to-purple-900/20 border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
              <CardTitle className="text-xl font-bold flex items-center gap-3">
                <Calendar className="h-6 w-6" />
                {t('national_insight_center_info_item.show.audit_info')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('national_insight_center_info_item.show.created_at')}</Label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatDate(item.created_at)}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('national_insight_center_info_item.show.updated_at')}</Label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatDate(item.updated_at)}</p>
                </div>

                {item.creator && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('national_insight_center_info_item.show.created_by')}</Label>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{item.creator.name}</p>
                  </div>
                )}

                {item.confirmer && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('national_insight_center_info_item.show.confirmed_by')}</Label>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{item.confirmer.name}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
