import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, CheckCircle, User, Calendar, Building2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';
import { formatPersianDateOnly } from '@/lib/utils/date';

interface NationalInsightCenterInfo {
  id: number;
  name: string;
  code: string | null;
  description: string | null;
  confirmed: boolean;
  confirmed_at: string | null;
  created_at: string;
  updated_at: string;
  creator?: {
    id: number;
    name: string;
  };
  confirmer?: {
    id: number;
    name: string;
  };
  infoStats?: Array<{
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

interface InfoItem {
  id: number;
  title: string;
  registration_number: string | null;
  description: string | null;
  date: string;
  confirmed: boolean;
  created_at: string;
  info_category?: {
    id: number;
    name: string;
    code: string;
  };
  department?: {
    id: number;
    name: string;
    code: string;
  };
  creator?: {
    id: number;
    name: string;
  };
}

interface Props {
  nationalInsightCenterInfo: NationalInsightCenterInfo;
  infos: InfoItem[];
}

export default function NationalInsightCenterInfoPrint({
  nationalInsightCenterInfo,
  infos
}: Props) {
  const { t } = useTranslation();
  
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('info.page_title'),
      href: route('national-insight-center-infos.index'),
    },
    {
      title: t('national_insight_center_info.page_title'),
      href: route('national-insight-center-infos.index'),
    },
    {
      title: nationalInsightCenterInfo.name,
      href: route('national-insight-center-infos.show', { national_insight_center_info: nationalInsightCenterInfo.id }),
    },
    {
      title: t('national_insight_center_info.print.title'),
      href: '#',
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('national_insight_center_info.print.title', { name: nationalInsightCenterInfo.name })} />

      <div className="container px-0 py-6" dir="rtl">
        {/* Print Controls */}
        <div className="mb-6 print:hidden">
          <div className="flex items-center justify-between">
            <Button
              onClick={handleBack}
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('national_insight_center_info.print.back_button')}
            </Button>
            <Button
              onClick={handlePrint}
              size="lg"
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
            >
              <FileText className="h-4 w-4" />
              {t('national_insight_center_info.print.print_button')}
            </Button>
          </div>
        </div>

        {/* Print Content */}
        <div className="print:mx-0 print:my-0 print:p-0">
          {/* Header */}
          <div className="text-center mb-8 print:mb-4">
            <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-200 mb-2 print:text-2xl">
              {t('national_insight_center_info.print.header_title')}
            </h1>
            <h2 className="text-2xl font-semibold text-purple-700 dark:text-purple-300 print:text-xl">
              {nationalInsightCenterInfo.name}
            </h2>
            {nationalInsightCenterInfo.code && (
              <p className="text-lg text-purple-600 dark:text-purple-400 print:text-base">
                {t('national_insight_center_info.print.code')}: {nationalInsightCenterInfo.code}
              </p>
            )}
          </div>

          {/* Basic Information */}
          <Card className="mb-6 print:mb-4 print:shadow-none print:border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
                <FileText className="h-5 w-5" />
                {t('national_insight_center_info.print.basic_info')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-purple-700 dark:text-purple-300">
                    {t('national_insight_center_info.print.name')}:
                  </label>
                  <p className="text-purple-800 dark:text-purple-200">{nationalInsightCenterInfo.name}</p>
                </div>
                {nationalInsightCenterInfo.code && (
                  <div>
                    <label className="font-semibold text-purple-700 dark:text-purple-300">
                      {t('national_insight_center_info.print.code')}:
                    </label>
                    <p className="text-purple-800 dark:text-purple-200">{nationalInsightCenterInfo.code}</p>
                  </div>
                )}
                <div>
                  <label className="font-semibold text-purple-700 dark:text-purple-300">
                    {t('national_insight_center_info.print.status')}:
                  </label>
                  <div className="mt-1">
                    {nationalInsightCenterInfo.confirmed ? (
                      <Badge className="bg-green-100 text-green-800 border-green-300 flex items-center gap-1 w-fit">
                        <CheckCircle className="h-3 w-3" />
                        {t('national_insight_center_info.confirmed')}
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 w-fit">
                        {t('national_insight_center_info.pending')}
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-purple-700 dark:text-purple-300">
                    {t('national_insight_center_info.print.created_at')}:
                  </label>
                  <p className="text-purple-800 dark:text-purple-200">
                    {formatPersianDateOnly(nationalInsightCenterInfo.created_at)}
                  </p>
                </div>
                {nationalInsightCenterInfo.creator && (
                  <div>
                    <label className="font-semibold text-purple-700 dark:text-purple-300">
                      {t('national_insight_center_info.print.created_by')}:
                    </label>
                    <p className="text-purple-800 dark:text-purple-200">{nationalInsightCenterInfo.creator.name}</p>
                  </div>
                )}
                {nationalInsightCenterInfo.confirmed && nationalInsightCenterInfo.confirmer && (
                  <div>
                    <label className="font-semibold text-purple-700 dark:text-purple-300">
                      {t('national_insight_center_info.print.confirmed_by')}:
                    </label>
                    <p className="text-purple-800 dark:text-purple-200">{nationalInsightCenterInfo.confirmer.name}</p>
                  </div>
                )}
                {nationalInsightCenterInfo.confirmed && nationalInsightCenterInfo.confirmed_at && (
                  <div>
                    <label className="font-semibold text-purple-700 dark:text-purple-300">
                      {t('national_insight_center_info.print.confirmed_at')}:
                    </label>
                    <p className="text-purple-800 dark:text-purple-200">
                      {formatPersianDateOnly(nationalInsightCenterInfo.confirmed_at)}
                    </p>
                  </div>
                )}
              </div>
              {nationalInsightCenterInfo.description && (
                <div>
                  <label className="font-semibold text-purple-700 dark:text-purple-300">
                    {t('national_insight_center_info.print.description')}:
                  </label>
                  <p className="text-purple-800 dark:text-purple-200 mt-1">
                    {nationalInsightCenterInfo.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistics */}
          {nationalInsightCenterInfo.infoStats && nationalInsightCenterInfo.infoStats.length > 0 && (
            <Card className="mb-6 print:mb-4 print:shadow-none print:border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
                  <Building2 className="h-5 w-5" />
                  {t('national_insight_center_info.print.statistics')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {nationalInsightCenterInfo.infoStats.map((stat) => (
                    <div key={stat.id} className="border-l-4 border-purple-300 pl-4">
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: stat.stat_category_item.category.color }}
                        ></div>
                        <span className="font-semibold text-purple-700 dark:text-purple-300">
                          {stat.stat_category_item.category.label}
                        </span>
                        <span className="text-purple-600 dark:text-purple-400">-</span>
                        <span className="font-medium text-purple-800 dark:text-purple-200">
                          {stat.stat_category_item.label}
                        </span>
                      </div>
                      <p className="text-purple-800 dark:text-purple-200 font-medium">
                        {stat.string_value}
                      </p>
                      {stat.notes && (
                        <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                          {stat.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Related Info Items */}
          {infos && infos.length > 0 && (
            <Card className="print:shadow-none print:border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
                  <FileText className="h-5 w-5" />
                  {t('national_insight_center_info.print.related_items')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {infos.map((info) => (
                    <div key={info.id} className="border border-purple-200 dark:border-purple-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-purple-800 dark:text-purple-200">
                          {info.title}
                        </h4>
                        {info.confirmed ? (
                          <Badge className="bg-green-100 text-green-800 border-green-300 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            {t('national_insight_center_info.confirmed')}
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                            {t('national_insight_center_info.pending')}
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        {info.registration_number && (
                          <div>
                            <span className="font-medium text-purple-700 dark:text-purple-300">
                              {t('national_insight_center_info.print.registration_number')}:
                            </span>
                            <span className="text-purple-800 dark:text-purple-200 ml-1">
                              {info.registration_number}
                            </span>
                          </div>
                        )}
                        {info.info_category && (
                          <div>
                            <span className="font-medium text-purple-700 dark:text-purple-300">
                              {t('national_insight_center_info.print.category')}:
                            </span>
                            <span className="text-purple-800 dark:text-purple-200 ml-1">
                              {info.info_category.name}
                            </span>
                          </div>
                        )}
                        {info.department && (
                          <div>
                            <span className="font-medium text-purple-700 dark:text-purple-300">
                              {t('national_insight_center_info.print.department')}:
                            </span>
                            <span className="text-purple-800 dark:text-purple-200 ml-1">
                              {info.department.name}
                            </span>
                          </div>
                        )}
                        <div>
                          <span className="font-medium text-purple-700 dark:text-purple-300">
                            {t('national_insight_center_info.print.date')}:
                          </span>
                          <span className="text-purple-800 dark:text-purple-200 ml-1">
                            {formatPersianDateOnly(info.date)}
                          </span>
                        </div>
                        {info.creator && (
                          <div>
                            <span className="font-medium text-purple-700 dark:text-purple-300">
                              {t('national_insight_center_info.print.created_by')}:
                            </span>
                            <span className="text-purple-800 dark:text-purple-200 ml-1">
                              {info.creator.name}
                            </span>
                          </div>
                        )}
                      </div>
                      {info.description && (
                        <div className="mt-2">
                          <span className="font-medium text-purple-700 dark:text-purple-300">
                            {t('national_insight_center_info.print.description')}:
                          </span>
                          <p className="text-purple-800 dark:text-purple-200 mt-1">
                            {info.description}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
