import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { FileText, BarChart3, Database, Calendar, User, ArrowLeft, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/lib/i18n/translate';
import { formatPersianDateOnly, formatPersianDateTime } from '@/lib/utils/date';

interface Info {
  id: number;
  title: string;
  content: string;
  status: string;
  created_at: string;
  updated_at: string;
  infoType?: {
    id: number;
    name: string;
  };
  infoCategory?: {
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
  creator?: {
    id: number;
    name: string;
  };
  infos: Info[];
  infoStats: InfoStat[];
}

interface StatCategory {
  id: number;
  name: string;
  label: string;
  color: string;
  status: string;
}

interface Props {
  infoType: InfoType;
  infos: Info[];
  statCategories: StatCategory[];
}

export default function PrintInfoType({ infoType, infos, statCategories }: Props) {
  const { t } = useTranslation();

  // Auto-print when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const formatDate = (dateString: string) => {
    return formatPersianDateOnly(dateString);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
      draft: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;

    return (
      <Badge 
        variant="outline" 
        className={`px-3 py-1 rounded-lg font-semibold ${config.bg} ${config.text} ${config.border}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <>
      <Head title={t('info_types.print.title', { name: infoType.name })} />
      
      {/* Print Controls - Hidden when printing */}
      <div className="print:hidden bg-white border-b border-gray-200 p-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('info_types.print.back_button')}
            </Button>
            <h1 className="text-xl font-semibold text-gray-800">
              {t('info_types.print.page_title', { name: infoType.name })}
            </h1>
          </div>
          <Button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Printer className="h-4 w-4" />
            {t('info_types.print.print_button')}
          </Button>
        </div>
      </div>

      {/* Print Content */}
      <div className="container mx-auto p-6 print:p-0 print:mx-0">
        {/* Header */}
        <div className="text-center mb-8 print:mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 print:text-2xl">
              {infoType.name}
            </h1>
          </div>
          <div className="text-gray-600 text-lg print:text-base">
            {t('info_types.print.report_title')}
          </div>
          <div className="text-gray-500 text-sm print:text-xs mt-2">
            {t('info_types.print.generated_on')}: {formatPersianDateTime(new Date().toISOString())}
          </div>
        </div>

        {/* Info Type Details */}
        <Card className="mb-6 print:mb-4 print:shadow-none print:border print:border-gray-300">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white print:bg-gray-100 print:text-gray-900">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg print:bg-gray-200">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-bold print:text-lg">
                  {t('info_types.print.details_title')}
                </div>
                <div className="text-purple-100 text-sm print:text-gray-600">
                  {t('info_types.print.details_description')}
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 print:p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1 print:text-xs">
                    {t('info_types.print.name_label')}
                  </h3>
                  <p className="text-lg font-bold text-gray-900 print:text-base">
                    {infoType.name}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1 print:text-xs">
                    {t('info_types.print.description_label')}
                  </h3>
                  <p className="text-gray-800 print:text-sm">
                    {infoType.description || t('info_types.print.no_description')}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1 print:text-xs">
                    {t('info_types.print.created_at_label')}
                  </h3>
                  <p className="text-gray-800 print:text-sm">
                    {formatDate(infoType.created_at)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1 print:text-xs">
                    {t('info_types.print.updated_at_label')}
                  </h3>
                  <p className="text-gray-800 print:text-sm">
                    {formatDate(infoType.updated_at)}
                  </p>
                </div>
                {infoType.creator && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1 print:text-xs">
                      {t('info_types.print.created_by_label')}
                    </h3>
                    <p className="text-gray-800 print:text-sm">
                      {infoType.creator.name}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        {infoType.infoStats && infoType.infoStats.length > 0 && (
          <Card className="mb-6 print:mb-4 print:shadow-none print:border print:border-gray-300">
            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white print:bg-gray-100 print:text-gray-900">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg print:bg-gray-200">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-bold print:text-lg">
                    {t('info_types.print.stats_title')}
                  </div>
                  <div className="text-green-100 text-sm print:text-gray-600">
                    {t('info_types.print.stats_description')}
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 print:p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 print:grid-cols-2 print:gap-3">
                {infoType.infoStats.map((stat) => (
                  <div key={stat.id} className="bg-gray-50 p-4 rounded-lg print:bg-white print:border print:border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: stat.stat_category_item.category.color }}
                      ></div>
                      <span className="text-sm font-medium text-gray-700 print:text-xs">
                        {stat.stat_category_item.category.label}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1 print:text-sm">
                      {stat.stat_category_item.label}
                    </h4>
                    <p className="text-lg font-bold text-green-600 mb-2 print:text-base">
                      {stat.integer_value !== null ? stat.integer_value : stat.string_value}
                    </p>
                    {stat.notes && (
                      <p className="text-sm text-gray-600 italic print:text-xs">
                        {stat.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Associated Info Records */}
        {infos && infos.length > 0 && (
          <Card className="mb-6 print:mb-4 print:shadow-none print:border print:border-gray-300">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white print:bg-gray-100 print:text-gray-900">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg print:bg-gray-200">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-bold print:text-lg">
                    {t('info_types.print.associated_info_title')}
                  </div>
                  <div className="text-blue-100 text-sm print:text-gray-600">
                    {t('info_types.print.associated_info_description')} ({infos.length} {t('info_types.print.records_count')})
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 print:p-4">
              <div className="space-y-4 print:space-y-3">
                {infos.map((info) => (
                  <div key={info.id} className="bg-white border border-gray-200 rounded-lg p-4 print:border-gray-300 print:shadow-none">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 print:text-base">
                          {info.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 print:text-xs">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(info.created_at)}
                          </div>
                          {info.infoCategory && (
                            <div className="flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              {info.infoCategory.name}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        {getStatusBadge(info.status)}
                      </div>
                    </div>
                    <div className="text-gray-700 print:text-sm">
                      <p className="line-clamp-3 print:line-clamp-none">
                        {info.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm print:text-xs mt-8 print:mt-6 border-t border-gray-200 pt-4 print:border-gray-300">
          <p>{t('info_types.print.footer_text')}</p>
          <p className="mt-1">{t('info_types.print.generated_by')}: {t('app.name')}</p>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:p-0 {
            padding: 0 !important;
          }
          
          .print\\:mx-0 {
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
          
          .print\\:mb-4 {
            margin-bottom: 1rem !important;
          }
          
          .print\\:mb-6 {
            margin-bottom: 1.5rem !important;
          }
          
          .print\\:p-4 {
            padding: 1rem !important;
          }
          
          .print\\:text-2xl {
            font-size: 1.5rem !important;
          }
          
          .print\\:text-lg {
            font-size: 1.125rem !important;
          }
          
          .print\\:text-base {
            font-size: 1rem !important;
          }
          
          .print\\:text-sm {
            font-size: 0.875rem !important;
          }
          
          .print\\:text-xs {
            font-size: 0.75rem !important;
          }
          
          .print\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          
          .print\\:gap-3 {
            gap: 0.75rem !important;
          }
          
          .print\\:gap-4 {
            gap: 1rem !important;
          }
          
          .print\\:space-y-3 > * + * {
            margin-top: 0.75rem !important;
          }
          
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          
          .print\\:border {
            border-width: 1px !important;
          }
          
          .print\\:border-gray-300 {
            border-color: #d1d5db !important;
          }
          
          .print\\:bg-gray-100 {
            background-color: #f3f4f6 !important;
          }
          
          .print\\:bg-gray-200 {
            background-color: #e5e7eb !important;
          }
          
          .print\\:bg-white {
            background-color: #ffffff !important;
          }
          
          .print\\:text-gray-900 {
            color: #111827 !important;
          }
          
          .print\\:text-gray-600 {
            color: #4b5563 !important;
          }
          
          .print\\:line-clamp-none {
            -webkit-line-clamp: unset !important;
            display: block !important;
          }
        }
      `}</style>
    </>
  );
}
