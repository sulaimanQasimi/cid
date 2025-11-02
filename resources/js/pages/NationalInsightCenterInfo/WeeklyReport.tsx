import React, { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Calendar, ToggleLeft, ToggleRight, Printer } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';
import { formatPersianDateOnly, formatPersianDateTime } from '@/lib/utils/date';
import {
  IncidentComparisonChart,
  CasualtiesChart,
  SimpleComparisonChart,
} from '@/components/reports/WeeklyReportCharts';

interface NationalInsightCenterInfo {
  id: number;
  name: string;
  code: string | null;
  description: string | null;
  confirmed: boolean;
  created_at: string;
  creator?: {
    id: number;
    name: string;
    department?: {
      id: number;
      name: string;
    };
  };
}

interface WeeklyData {
  total_items: number;
  by_category: Record<
    string | number,
    {
      id: string | number;
      name: string;
      code: string | null;
      count: number;
      items: any[];
    }
  >;
  by_stat_category: Record<
    number,
    {
      id: number;
      name: string;
      items: Array<{
        name: string;
        value: number;
        count: number;
      }>;
    }
  >;
}

interface Comparison {
  total_items: {
    current: number;
    previous: number;
    change: number;
    percentage_change: number;
  };
  categories: Record<
    string | number,
    {
      name: string;
      current: number;
      previous: number;
      change: number;
      percentage_change: number;
    }
  >;
}

interface Props {
  nationalInsightCenterInfo: NationalInsightCenterInfo;
  currentWeekData: WeeklyData;
  previousWeekData: WeeklyData;
  comparisons: Comparison;
  currentWeekItems: any[];
  previousWeekItems: any[];
  dateRange: {
    current_week_start: string;
    current_week_end: string;
    previous_week_start: string;
    previous_week_end: string;
  };
  categories: Array<{
    id: number;
    name: string;
    code: string | null;
  }>;
  statCategories: Array<{
    id: number;
    label: string;
    name: string;
    items: any[];
  }>;
}

export default function WeeklyReport({
  nationalInsightCenterInfo,
  currentWeekData,
  previousWeekData,
  comparisons,
  dateRange,
  categories,
}: Props) {
  const { t } = useTranslation();
  const [isOfficialStyle, setIsOfficialStyle] = useState(true);

  // Prepare chart data
  const overallIncidentData = useMemo(() => {
    return [
      {
        category: t('weekly_report.labels.total'),
        current: currentWeekData.total_items,
        previous: previousWeekData.total_items,
      },
    ];
  }, [currentWeekData.total_items, previousWeekData.total_items, t]);

  const categoryComparisonData = useMemo(() => {
    return Object.values(comparisons.categories).map((cat) => ({
      category: cat.name,
      current: cat.current,
      previous: cat.previous,
    }));
  }, [comparisons.categories]);

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    window.history.back();
  };

  const percentageChange = comparisons.total_items.percentage_change;
  const changeText =
    percentageChange > 0
      ? t('weekly_report.comparison.increase_by', { percentage: Math.abs(percentageChange).toFixed(0) })
      : percentageChange < 0
        ? t('weekly_report.comparison.decrease_by', { percentage: Math.abs(percentageChange).toFixed(0) })
        : t('weekly_report.comparison.no_change');

  return (
    <div
      className={`print:max-w-none print:p-0 print:m-0 ${
        isOfficialStyle ? 'official-document-style' : 'enhanced-style'
      }`}
      dir="rtl"
    >
      <Head title={t('weekly_report.page_title')} />
      
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              @page {
                size: A4;
                margin: 1.5cm;
              }
              body {
                font-size: 11px;
                line-height: 1.5;
              }
              .print\\:hidden {
                display: none !important;
              }
              .official-document-style {
                font-family: 'Arial', 'Tahoma', sans-serif;
              }
              .official-document-style .document-header {
                border: 2px solid #000;
                padding: 15px;
                margin-bottom: 20px;
                background: #f9f9f9;
              }
              .official-document-style .document-title {
                text-align: center;
                font-size: 18px;
                font-weight: bold;
                margin: 10px 0;
                border-bottom: 2px solid #000;
                padding-bottom: 10px;
              }
            }
            .official-document-style .document-header {
              border: 2px solid #000;
              padding: 20px;
              margin-bottom: 20px;
              background: linear-gradient(to bottom, #f9f9f9, #ffffff);
              position: relative;
            }
            .official-document-style .document-emblems {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 15px;
            }
            .official-document-style .emblem-placeholder {
              width: 80px;
              height: 80px;
              border: 2px solid #000;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #fff;
              font-size: 10px;
              text-align: center;
            }
            .official-document-style .document-org-info {
              flex: 1;
              text-align: center;
              font-size: 14px;
              font-weight: bold;
              line-height: 1.8;
            }
            .official-document-style .document-title-box {
              background: #ffffcc;
              border: 2px dotted #000;
              padding: 15px;
              text-align: center;
              margin: 15px 0;
              font-size: 16px;
              font-weight: bold;
            }
            .official-document-style .date-info {
              display: flex;
              justify-content: space-between;
              margin-top: 10px;
              font-size: 12px;
            }
            .enhanced-style {
              font-family: 'Inter', 'Arial', sans-serif;
            }
            .enhanced-style .document-header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 10px;
              margin-bottom: 30px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .section-card {
              background: white;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 20px;
              margin-bottom: 20px;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }
            .print\\:page-break-inside-avoid {
              page-break-inside: avoid;
            }
          `,
        }}
      />

      {/* Print Controls */}
      <div className="mb-6 print:hidden flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button onClick={handleBack} variant="outline" size="lg" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t('weekly_report.back_button')}
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm">{t('weekly_report.style_toggle.official')}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOfficialStyle(!isOfficialStyle)}
              className="flex items-center gap-2"
            >
              {isOfficialStyle ? (
                <ToggleRight className="h-4 w-4" />
              ) : (
                <ToggleLeft className="h-4 w-4" />
              )}
            </Button>
            <span className="text-sm">{t('weekly_report.style_toggle.enhanced')}</span>
          </div>
        </div>

        <Button
          onClick={handlePrint}
          size="lg"
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
        >
          <Printer className="h-4 w-4" />
          {t('weekly_report.print_button')}
        </Button>
      </div>

      {/* Document Header */}
      <div className={`document-header print:page-break-inside-avoid ${isOfficialStyle ? 'official' : 'enhanced'}`}>
        {isOfficialStyle ? (
          <>
            <div className="document-emblems">
              <div className="emblem-placeholder">نشان</div>
              <div className="document-org-info">
                <div>{t('weekly_report.official_header')}</div>
                <div>{t('weekly_report.official_subheader')}</div>
                <div>{t('weekly_report.official_directorate')}</div>
                <div>{t('weekly_report.official_center')}</div>
              </div>
              <div className="emblem-placeholder">نشان</div>
            </div>
            <div className="date-info">
              <div>
                <span>{t('weekly_report.date_range.from')}</span> {formatPersianDateOnly(dateRange.current_week_start)}
                <span> {t('weekly_report.date_range.to')}</span> {formatPersianDateOnly(dateRange.current_week_end)}
              </div>
              <div>شماره: ()</div>
            </div>
            <div className="document-title-box">
              {t('weekly_report.header_title')}
            </div>
          </>
        ) : (
          <div>
            <h1 className="text-3xl font-bold mb-2">{t('weekly_report.header_title')}</h1>
            <p className="text-lg opacity-90">{nationalInsightCenterInfo.name}</p>
            <div className="mt-4 flex gap-6 text-sm">
              <div>
                <span className="font-semibold">{t('weekly_report.date_range.current_week')}:</span>{' '}
                {formatPersianDateOnly(dateRange.current_week_start)} -{' '}
                {formatPersianDateOnly(dateRange.current_week_end)}
              </div>
              <div>
                <span className="font-semibold">{t('weekly_report.date_range.previous_week')}:</span>{' '}
                {formatPersianDateOnly(dateRange.previous_week_start)} -{' '}
                {formatPersianDateOnly(dateRange.previous_week_end)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overview Section */}
      <div className="section-card print:page-break-inside-avoid">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {t('weekly_report.sections.overview')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">{t('weekly_report.labels.current_week')}</div>
            <div className="text-2xl font-bold text-blue-700">{currentWeekData.total_items}</div>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">{t('weekly_report.labels.previous_week')}</div>
            <div className="text-2xl font-bold text-yellow-700">{previousWeekData.total_items}</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">{t('weekly_report.tables.change')}</div>
            <div className={`text-2xl font-bold ${percentageChange >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              {comparisons.total_items.change > 0 ? '+' : ''}
              {comparisons.total_items.change} ({changeText})
            </div>
          </div>
        </div>
      </div>

      {/* Overall Incident Comparison Chart */}
      <div className="section-card print:page-break-inside-avoid">
        <h2 className="text-xl font-bold mb-4">{t('weekly_report.charts.overall_incidents')}</h2>
        <IncidentComparisonChart
          data={overallIncidentData}
          containerId="overall-incidents-chart"
          height={250}
        />
        <div className="mt-4 text-center text-sm text-gray-600">
          {changeText}
        </div>
      </div>

      {/* Category Comparison Chart */}
      {categoryComparisonData.length > 0 && (
        <div className="section-card print:page-break-inside-avoid">
          <h2 className="text-xl font-bold mb-4">{t('weekly_report.statistics.by_category')}</h2>
          <IncidentComparisonChart
            data={categoryComparisonData.slice(0, 10)}
            containerId="category-comparison-chart"
            height={400}
          />
        </div>
      )}

      {/* Detailed Breakdown Table */}
      <div className="section-card print:page-break-inside-avoid">
        <h2 className="text-xl font-bold mb-4">{t('weekly_report.sections.detailed_breakdown')}</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 text-right">{t('weekly_report.tables.category')}</th>
                <th className="border border-gray-300 p-3 text-center">{t('weekly_report.tables.current_week')}</th>
                <th className="border border-gray-300 p-3 text-center">{t('weekly_report.tables.previous_week')}</th>
                <th className="border border-gray-300 p-3 text-center">{t('weekly_report.tables.change')}</th>
                <th className="border border-gray-300 p-3 text-center">{t('weekly_report.tables.percentage')}</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(comparisons.categories).map((cat, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-300 p-3">{cat.name}</td>
                  <td className="border border-gray-300 p-3 text-center">{cat.current}</td>
                  <td className="border border-gray-300 p-3 text-center">{cat.previous}</td>
                  <td
                    className={`border border-gray-300 p-3 text-center ${
                      cat.change >= 0 ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {cat.change > 0 ? '+' : ''}
                    {cat.change}
                  </td>
                  <td
                    className={`border border-gray-300 p-3 text-center ${
                      cat.percentage_change >= 0 ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {cat.percentage_change > 0 ? '+' : ''}
                    {cat.percentage_change.toFixed(1)}%
                  </td>
                </tr>
              ))}
              {Object.values(comparisons.categories).length === 0 && (
                <tr>
                  <td colSpan={5} className="border border-gray-300 p-6 text-center text-gray-500">
                    {t('weekly_report.tables.no_data')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-300 print:mt-12 print:page-break-inside-avoid">
        <div className="text-center text-sm text-gray-600 print:text-gray-800">
          <p className="flex items-center justify-center gap-2">
            <Calendar className="h-4 w-4" />
            {t('weekly_report.footer.generated_on')}: {formatPersianDateTime(new Date().toISOString())}
          </p>
        </div>
      </div>
    </div>
  );
}

