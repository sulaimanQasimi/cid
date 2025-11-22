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
  Folder,
  Eye,
  FileText
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';
import { usePermissions } from '@/hooks/use-permissions';
import { CanUpdate, CanDelete } from '@/components/ui/permission-guard';
import Header from '@/components/template/header';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { formatPersianDateOnly } from '@/lib/utils/date';

interface User {
  id: number;
  name: string;
  email: string;
  department?: {
    id: number;
    name: string;
  };
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
  confirmed: boolean;
  description: string | null;
}

interface NationalInsightCenterInfoItem {
  id: number;
  title: string;
  registration_number: string;
  description: string | null;
  date: string | null;
  created_at: string;
  updated_at: string;
  nationalInsightCenterInfo?: NationalInsightCenterInfo;
  national_insight_center_info?: NationalInsightCenterInfo;
  infoCategory?: InfoCategory | null;
  info_category?: InfoCategory | null;
  province: Province | null;
  district: District | null;
  creator: User | null;
  confirmer: User | null;
}

interface ShowProps {
  item: NationalInsightCenterInfoItem;
}

export default function Show({ item }: ShowProps) {
  const { t } = useTranslation();
  const { canUpdate, canDelete } = usePermissions();

  // Normalize the data to handle both snake_case and camelCase from backend
  const nationalInsightCenterInfo = item.nationalInsightCenterInfo || item.national_insight_center_info;
  const infoCategory = item.infoCategory || item.info_category;

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('national_insight_center_info.page_title'),
      href: route('national-insight-center-infos.index'),
    },
    {
      title: nationalInsightCenterInfo?.name || t('national_insight_center_info_item.unknown'),
      href: nationalInsightCenterInfo?.id ? route('national-insight-center-infos.show', { national_insight_center_info: nationalInsightCenterInfo.id }) : route('national-insight-center-infos.index'),
    },
    {
      title: item.title,
      href: '#',
    },
  ];

  const handleDelete = () => {
    router.delete(route('national-insight-center-info-items.destroy', item.id));
  };



  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('national_insight_center_info_item.show.page_title', { name: item.title })} />

      <div className="container px-0 py-6">
        <Header
          title={t('national_insight_center_info_item.show.page_title', { name: item.title })}
          description={t('national_insight_center_info_item.show.description')}
          icon={<FileText className="h-6 w-6 text-white" />}
          model="national_insight_center_info_item"
          routeName={() => route('national-insight-center-info-items.show', item.id)}
          buttonText={t('national_insight_center_info_item.show.edit_button')}
          theme="purple"
          buttonSize="lg"
          showBackButton={true}
          backRouteName={() => nationalInsightCenterInfo?.id ? route('national-insight-center-infos.show', { national_insight_center_info: nationalInsightCenterInfo.id }) : route('national-insight-center-infos.index')}
          backButtonText={t('national_insight_center_info_item.show.back_button')}
          showButton={canUpdate('national_insight_center_info_item')}
          actionButtons={
            <>
              <CanDelete model="national_insight_center_info_item">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="lg" className="bg-red-500/20 backdrop-blur-md border-red-400/30 text-white hover:bg-red-500/30 shadow-2xl rounded-2xl px-4 py-3 transition-all duration-300 hover:scale-105">
                      <Trash2 className="h-5 w-5" />
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

              <CanUpdate model="national_insight_center_info_item">
                <Button asChild variant="outline" size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-4 py-3 transition-all duration-300 hover:scale-105">
                  <Link href={route('national-insight-center-info-items.edit', item.id)} className="flex items-center">
                    <Edit className="h-5 w-5" />
                  </Link>
                </Button>
              </CanUpdate>
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
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('national_insight_center_info_item.show.title_label')}</Label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('national_insight_center_info_item.show.registration_number')}</Label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{item.registration_number}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('national_insight_center_info_item.show.status')}</Label>
                  <Badge 
                    variant={nationalInsightCenterInfo?.confirmed ? "default" : "secondary"}
                    className={nationalInsightCenterInfo?.confirmed ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"}
                  >
                    {nationalInsightCenterInfo?.confirmed ? (
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

                {item.province && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('national_insight_center_info_item.show.province')}</Label>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{item.province.name || item.province.label || '-'}</p>
                  </div>
                )}

                {item.district && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('national_insight_center_info_item.show.district')}</Label>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{item.district.name || item.district.label || '-'}</p>
                  </div>
                )}
              </div>

              {item.description && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('national_insight_center_info_item.show.description_label')}</Label>
                  <p className="text-gray-900 dark:text-white leading-relaxed">{item.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

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
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatPersianDateOnly(item.created_at)}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('national_insight_center_info_item.show.updated_at')}</Label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatPersianDateOnly(item.updated_at)}</p>
                </div>

                {item.creator && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('national_insight_center_info_item.show.created_by')}</Label>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{item.creator?.name || t('national_insight_center_info_item.unknown')}</p>
                    </div>
                    {item.creator?.email && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('national_insight_center_info_item.show.creator_email') || 'ایمیل ایجادکننده'}</Label>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{item.creator.email}</p>
                      </div>
                    )}
                    {item.creator?.department && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('national_insight_center_info_item.show.creator_department') || 'دپارتمان ایجادکننده'}</Label>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{item.creator.department.name}</p>
                      </div>
                    )}
                  </>
                )}

                {item.confirmer && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('national_insight_center_info_item.show.confirmed_by')}</Label>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{item.confirmer?.name || t('national_insight_center_info_item.unknown')}</p>
                    </div>
                    {item.confirmer?.email && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('national_insight_center_info_item.show.confirmer_email') || 'ایمیل تأییدکننده'}</Label>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{item.confirmer.email}</p>
                      </div>
                    )}
                    {item.confirmer?.department && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('national_insight_center_info_item.show.confirmer_department') || 'دپارتمان تأییدکننده'}</Label>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{item.confirmer.department.name}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
