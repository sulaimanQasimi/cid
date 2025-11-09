import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Calendar, FileText, Search, Filter, Printer } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';
import Header from '@/components/template/header';
import PersianDatePicker from '@/components/ui/PersianDatePicker';
import axios from 'axios';

interface Props {
  filters?: {
    date_from: string;
    date_to: string;
  };
}

export default function NationalInsightCenterInfoReport({
  filters = { date_from: '', date_to: '' }
}: Props) {
  const { t } = useTranslation();
  
  const [dateFrom, setDateFrom] = useState(filters.date_from || '');
  const [dateTo, setDateTo] = useState(filters.date_to || '');

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
      title: t('national_insight_center_info.report.page_title'),
      href: '#',
    },
  ];

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    // Call the dates endpoint
    fetchDates();
    router.get(route('national-insight-center-infos.report'), {
      date_from: dateFrom,
      date_to: dateTo,
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const fetchDates = async () => {
    try {
      const response = await axios.get(route('national-insight-center-infos.dates'), {
        params: {
          date_from: dateFrom,
          date_to: dateTo,
        },
      });
      console.log('Dates data:', response.data);
      // Handle the response data here if needed
    } catch (error) {
      console.error('Error fetching dates:', error);
    }
  };

  const handleReset = () => {
    setDateFrom('');
    setDateTo('');
    router.get(route('national-insight-center-infos.report'), {}, {
      replace: true,
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('national_insight_center_info.report.page_title')} />

      <div className="container px-0 py-6" dir="rtl">
        <Header
          title={t('national_insight_center_info.report.page_title')}
          description={t('national_insight_center_info.report.page_description')}
          icon={<FileText className="h-6 w-6 text-white" />}
          model="national_insight_center_info"
          routeName="national-insight-center-infos.report"
          theme="purple"
          showBackButton={true}
          backRouteName={() => route('national-insight-center-infos.index')}
          backButtonText={t('national_insight_center_info.report.back_button')}
          showButton={false}
        />

        {/* Filter Card */}
        <Card className="shadow-2xl bg-gradient-to-bl from-white dark:from-gray-800 to-purple-50/30 dark:to-purple-900/20 border-0 overflow-visible">
          <CardHeader className="bg-gradient-to-l from-purple-500 to-purple-600 text-white py-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Filter className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-white">
                  {t('national_insight_center_info.report.filter_title')}
                </CardTitle>
                <p className="text-purple-100 text-sm mt-1">
                  {t('national_insight_center_info.report.filter_description')}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 overflow-visible">
            <form onSubmit={handleFilter} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date From Field */}
                <div className="space-y-4 relative">
                  <Label htmlFor="date_from" dir="rtl" className="text-lg font-semibold text-purple-800 dark:text-purple-200 flex items-center gap-2 text-right">
                    <Calendar className="h-4 w-4" />
                    {t('national_insight_center_info.report.date_from_label')}
                  </Label>
                  <PersianDatePicker
                    id="date_from"
                    value={dateFrom}
                    onChange={(value) => setDateFrom(value)}
                    placeholder={t('national_insight_center_info.report.date_from_placeholder')}
                    className="w-full h-12 text-lg border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 rounded-xl shadow-lg"
                  />
                </div>

                {/* Date To Field */}
                <div className="space-y-4 relative">
                  <Label htmlFor="date_to" dir="rtl" className="text-lg font-semibold text-purple-800 dark:text-purple-200 flex items-center gap-2 text-right">
                    <Calendar className="h-4 w-4" />
                    {t('national_insight_center_info.report.date_to_label')}
                  </Label>
                  <PersianDatePicker
                    id="date_to"
                    value={dateTo}
                    onChange={(value) => setDateTo(value)}
                    placeholder={t('national_insight_center_info.report.date_to_placeholder')}
                    className="w-full h-12 text-lg border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 rounded-xl shadow-lg"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="px-6 py-3"
                >
                  {t('national_insight_center_info.report.reset_button')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const params = new URLSearchParams();
                    if (dateFrom) params.append('date_from', dateFrom);
                    if (dateTo) params.append('date_to', dateTo);
                    window.open(route('national-insight-center-infos.print-dates') + '?' + params.toString(), '_blank');
                  }}
                  className="px-6 py-3 flex items-center gap-2"
                >
                  <Printer className="h-4 w-4" />
                  {t('national_insight_center_info.report.print_button')}
                </Button>
                <Button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 px-6 py-3 flex items-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  {t('national_insight_center_info.report.filter_button')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

