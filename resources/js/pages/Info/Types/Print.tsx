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
  creator?: {
    id: number;
    name: string;
  };
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

  const getStatusBadge = (confirmed: boolean) => {
    if (confirmed) {
      return (
        <Badge 
          variant="outline" 
          className="px-3 py-1 rounded-lg font-semibold bg-green-100 text-green-800 border-green-300"
        >
          Confirmed
        </Badge>
      );
    } else {
      return (
        <Badge 
          variant="outline" 
          className="px-3 py-1 rounded-lg font-semibold bg-yellow-100 text-yellow-800 border-yellow-300"
        >
          Pending
        </Badge>
      );
    }
  };

  return (
    <>
      <Head title={t('info_types.print.title', { name: infoType.name || 'Info Type' })} />
      
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
              {t('info_types.print.page_title', { name: infoType.name || 'Info Type' })}
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
      <div className="container mx-auto p-6 print:p-2 print:mx-0 print:max-w-none">
        {/* Header */}
        <div className="text-center mb-6 print:mb-3 print:pb-2 print:border-b print:border-gray-300">
          <div className="flex items-center justify-center gap-2 mb-2 print:mb-1">
            <div className="p-2 bg-purple-100 rounded-full print:p-1">
              <FileText className="h-6 w-6 text-purple-600 print:h-4 print:w-4" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 print:text-lg print:font-semibold">
              {infoType.name || 'Info Type'}
            </h1>
          </div>
          <div className="text-gray-600 text-base print:text-sm print:font-medium">
            {t('info_types.print.report_title')}
          </div>
          <div className="text-gray-500 text-xs print:text-xs mt-1">
            {t('info_types.print.generated_on')}: {formatPersianDateTime(new Date().toISOString())}
          </div>
        </div>

        {/* Info Type Details */}
        <Card className="mb-4 print:mb-2 print:shadow-none print:border print:border-gray-300">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white print:bg-gray-100 print:text-gray-900 print:py-2">
            <CardTitle className="flex items-center gap-2 print:gap-1">
              <div className="p-1 bg-white/20 rounded-lg print:bg-gray-200 print:p-0.5">
                <FileText className="h-4 w-4 print:h-3 print:w-3" />
              </div>
              <div>
                <div className="text-lg font-bold print:text-sm print:font-semibold">
                  {t('info_types.print.details_title')}
                </div>
                <div className="text-purple-100 text-xs print:text-gray-600 print:text-xs">
                  {t('info_types.print.details_description')}
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 print:p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2 print:gap-2">
              <div className="space-y-2 print:space-y-1">
                <div>
                  <h3 className="text-xs font-semibold text-gray-700 mb-0.5 print:text-xs print:font-medium">
                    {t('info_types.print.name_label')}
                  </h3>
                  <p className="text-base font-bold text-gray-900 print:text-sm print:font-semibold">
                    {infoType.name || 'Info Type'}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-gray-700 mb-0.5 print:text-xs print:font-medium">
                    {t('info_types.print.description_label')}
                  </h3>
                  <p className="text-sm text-gray-800 print:text-xs print:leading-tight">
                    {infoType.description || t('info_types.print.no_description')}
                  </p>
                </div>
              </div>
              <div className="space-y-2 print:space-y-1">
                <div>
                  <h3 className="text-xs font-semibold text-gray-700 mb-0.5 print:text-xs print:font-medium">
                    {t('info_types.print.created_at_label')}
                  </h3>
                  <p className="text-sm text-gray-800 print:text-xs">
                    {formatDate(infoType.created_at)}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-gray-700 mb-0.5 print:text-xs print:font-medium">
                    {t('info_types.print.updated_at_label')}
                  </h3>
                  <p className="text-sm text-gray-800 print:text-xs">
                    {formatDate(infoType.updated_at)}
                  </p>
                </div>
                {infoType.creator && infoType.creator.name && (
                  <div>
                    <h3 className="text-xs font-semibold text-gray-700 mb-0.5 print:text-xs print:font-medium">
                      {t('info_types.print.created_by_label')}
                    </h3>
                    <p className="text-sm text-gray-800 print:text-xs">
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
          <Card className="mb-4 print:mb-2 print:shadow-none print:border print:border-gray-300">
            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white print:bg-gray-100 print:text-gray-900 print:py-2">
              <CardTitle className="flex items-center gap-2 print:gap-1">
                <div className="p-1 bg-white/20 rounded-lg print:bg-gray-200 print:p-0.5">
                  <BarChart3 className="h-4 w-4 print:h-3 print:w-3" />
                </div>
                <div>
                  <div className="text-lg font-bold print:text-sm print:font-semibold">
                    {t('info_types.print.stats_title')}
                  </div>
                  <div className="text-green-100 text-xs print:text-gray-600 print:text-xs">
                    {t('info_types.print.stats_description')}
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 print:p-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 print:grid-cols-3 print:gap-1">
                {infoType.infoStats.map((stat) => (
                  <div key={stat.id} className="bg-gray-50 p-3 rounded-lg print:bg-white print:border print:border-gray-200 print:p-1">
                    <div className="flex items-center gap-1 mb-1 print:mb-0.5">
                      <div
                        className="w-2 h-2 rounded-full print:w-1.5 print:h-1.5"
                        style={{ backgroundColor: stat.stat_category_item.category.color }}
                      ></div>
                      <span className="text-xs font-medium text-gray-700 print:text-xs print:font-normal">
                        {stat.stat_category_item.category.label}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1 print:text-xs print:font-medium">
                      {stat.stat_category_item.label}
                    </h4>
                    <p className="text-base font-bold text-green-600 mb-1 print:text-sm print:font-semibold">
                      {stat.integer_value !== null ? stat.integer_value : stat.string_value}
                    </p>
                    {stat.notes && (
                      <p className="text-xs text-gray-600 italic print:text-xs print:leading-tight">
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
          <Card className="mb-4 print:mb-2 print:shadow-none print:border print:border-gray-300">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white print:bg-gray-100 print:text-gray-900 print:py-2">
              <CardTitle className="flex items-center gap-2 print:gap-1">
                <div className="p-1 bg-white/20 rounded-lg print:bg-gray-200 print:p-0.5">
                  <Database className="h-4 w-4 print:h-3 print:w-3" />
                </div>
                <div>
                  <div className="text-lg font-bold print:text-sm print:font-semibold">
                    {t('info_types.print.associated_info_title')}
                  </div>
                  <div className="text-blue-100 text-xs print:text-gray-600 print:text-xs">
                    {t('info_types.print.associated_info_description')} ({infos.length} {t('info_types.print.records_count')})
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 print:p-2">
              <div className="space-y-3 print:space-y-1">
                {infos.map((info) => (
                  <div key={info.id} className="bg-white border border-gray-200 rounded-lg p-3 print:border-gray-300 print:shadow-none print:p-1">
                    <div className="flex items-start justify-between mb-2 print:mb-1">
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-900 mb-1 print:text-sm print:font-medium">
                          {info.name || 'Untitled'}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-gray-600 print:text-xs print:gap-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 print:h-2 print:w-2" />
                            {formatDate(info.created_at)}
                          </div>
                          {info.info_category && info.info_category.name && (
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3 print:h-2 print:w-2" />
                              {info.info_category.name}
                            </div>
                          )}
                          {info.code && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs bg-gray-100 px-1 py-0.5 rounded print:text-xs print:px-0.5 print:py-0">
                                {info.code}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="ml-2 print:ml-1">
                        {getStatusBadge(info.confirmed)}
                      </div>
                    </div>
                    <div className="text-gray-700 print:text-xs">
                      <p className="line-clamp-2 print:line-clamp-none print:leading-tight">
                        {info.description || 'No description available'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center text-gray-500 text-xs print:text-xs mt-4 print:mt-2 border-t border-gray-200 pt-2 print:border-gray-300 print:pt-1">
          <p>{t('info_types.print.footer_text')}</p>
          <p className="mt-0.5 print:mt-0">{t('info_types.print.generated_by')}: {t('app.name')}</p>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            margin: 0.5in;
            size: A4;
          }
          
          body {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
            font-size: 10px;
            line-height: 1.2;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:p-0 {
            padding: 0 !important;
          }
          
          .print\\:p-1 {
            padding: 0.25rem !important;
          }
          
          .print\\:p-2 {
            padding: 0.5rem !important;
          }
          
          .print\\:mx-0 {
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
          
          .print\\:max-w-none {
            max-width: none !important;
          }
          
          .print\\:mb-1 {
            margin-bottom: 0.25rem !important;
          }
          
          .print\\:mb-2 {
            margin-bottom: 0.5rem !important;
          }
          
          .print\\:mb-3 {
            margin-bottom: 0.75rem !important;
          }
          
          .print\\:mb-4 {
            margin-bottom: 1rem !important;
          }
          
          .print\\:mt-0 {
            margin-top: 0 !important;
          }
          
          .print\\:mt-1 {
            margin-top: 0.25rem !important;
          }
          
          .print\\:mt-2 {
            margin-top: 0.5rem !important;
          }
          
          .print\\:py-2 {
            padding-top: 0.5rem !important;
            padding-bottom: 0.5rem !important;
          }
          
          .print\\:pt-1 {
            padding-top: 0.25rem !important;
          }
          
          .print\\:pb-2 {
            padding-bottom: 0.5rem !important;
          }
          
          .print\\:gap-1 {
            gap: 0.25rem !important;
          }
          
          .print\\:gap-2 {
            gap: 0.5rem !important;
          }
          
          .print\\:space-y-1 > * + * {
            margin-top: 0.25rem !important;
          }
          
          .print\\:text-lg {
            font-size: 1rem !important;
          }
          
          .print\\:text-sm {
            font-size: 0.75rem !important;
          }
          
          .print\\:text-xs {
            font-size: 0.625rem !important;
          }
          
          .print\\:font-medium {
            font-weight: 500 !important;
          }
          
          .print\\:font-semibold {
            font-weight: 600 !important;
          }
          
          .print\\:leading-tight {
            line-height: 1.1 !important;
          }
          
          .print\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          
          .print\\:grid-cols-3 {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
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
          
          .print\\:h-2 {
            height: 0.5rem !important;
          }
          
          .print\\:w-2 {
            width: 0.5rem !important;
          }
          
          .print\\:h-3 {
            height: 0.75rem !important;
          }
          
          .print\\:w-3 {
            width: 0.75rem !important;
          }
          
          .print\\:h-4 {
            height: 1rem !important;
          }
          
          .print\\:w-4 {
            width: 1rem !important;
          }
          
          .print\\:px-0\\.5 {
            padding-left: 0.125rem !important;
            padding-right: 0.125rem !important;
          }
          
          .print\\:py-0 {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }
          
          .print\\:p-0\\.5 {
            padding: 0.125rem !important;
          }
          
          .print\\:mb-0\\.5 {
            margin-bottom: 0.125rem !important;
          }
          
          .print\\:mt-0\\.5 {
            margin-top: 0.125rem !important;
          }
          
          .print\\:ml-1 {
            margin-left: 0.25rem !important;
          }
          
          .print\\:w-1\\.5 {
            width: 0.375rem !important;
          }
          
          .print\\:h-1\\.5 {
            height: 0.375rem !important;
          }
        }
      `}</style>
    </>
  );
}
