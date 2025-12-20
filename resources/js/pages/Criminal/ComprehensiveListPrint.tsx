import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Settings, X, TabletSmartphone, Tag, User } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';
import { formatPersianDateOnly } from '@/lib/utils/date';
import { format } from 'date-fns';
import moment from 'moment-jalaali';

interface Criminal {
  id: number;
  photo: string | null;
  number: string | null;
  name: string;
  father_name: string | null;
  grandfather_name: string | null;
  id_card_number: string | null;
  phone_number: string | null;
  original_residence: string | null;
  current_residence: string | null;
  crime_type: string | null;
  arrest_location: string | null;
  arrested_by: string | null;
  arrest_date: string | null;
  referred_to: string | null;
  final_verdict: string | null;
  notes: string | null;
  department_id: number | null;
  created_by: number;
  created_at: string;
  updated_at: string;
  department?: {
    id: number;
    name: string;
    code: string;
  } | null;
  creator?: {
    id: number;
    name: string;
  };
}

interface PrintSettings {
  governmentName: string;
  ministryName: string;
  reportTitle: string;
  dateFormat: 'gregorian' | 'hijri' | 'persian';
}

interface Props {
  criminals: Criminal[];
  filters: {
    search: string;
    sort: string;
    direction: string;
    department_id?: number | string;
  };
}

export default function ComprehensiveListPrint({ criminals, filters }: Props) {
  const { t } = useTranslation();
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'labels' | 'date_format'>('labels');
  const [printSettings, setPrintSettings] = useState<PrintSettings>({
    governmentName: 'امارت اسلامی افغانستان',
    ministryName: 'وزارت دفاع',
    reportTitle: 'فهرست مجرمین',
    dateFormat: 'persian',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleSettingsChange = (key: keyof PrintSettings, value: string) => {
    setPrintSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Date conversion utility functions
  const gregorianToHijri = (date: Date): string => {
    try {
      const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      
      const parts = formatter.formatToParts(date);
      const year = parts.find((part) => part.type === 'year')?.value || '';
      const month = parts.find((part) => part.type === 'month')?.value || '';
      const day = parts.find((part) => part.type === 'day')?.value || '';
      
      return `${year}/${month.padStart(2, '0')}/${day.padStart(2, '0')}`;
    } catch (error) {
      console.error('Error converting to Hijri:', error);
      const hijriYear = Math.floor((date.getFullYear() - 622) * 0.970224);
      const hijriMonth = Math.floor((date.getMonth() + 1) * 0.970224);
      const hijriDay = Math.floor(date.getDate() * 0.970224);
      return `${hijriYear}/${hijriMonth.toString().padStart(2, '0')}/${hijriDay.toString().padStart(2, '0')}`;
    }
  };

  const gregorianToPersian = (date: Date): string => {
    return formatPersianDateOnly(date.toISOString());
  };

  const parsePersianDate = (dateString: string): Date | null => {
    if (!dateString) return null;
    
    try {
      if (dateString.includes('/')) {
        const persianMoment = moment(dateString, 'jYYYY/jMM/jDD');
        if (persianMoment.isValid()) {
          return persianMoment.toDate();
        }
      }
      
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date;
      }
      
      return null;
    } catch (e) {
      console.error('Error parsing date:', e);
      return null;
    }
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '-';
    
    try {
      const date = parsePersianDate(dateString);
      
      if (!date) {
        return dateString;
      }
      
      switch (printSettings.dateFormat) {
        case 'hijri':
          return gregorianToHijri(date);
        case 'persian':
          return gregorianToPersian(date);
        case 'gregorian':
        default:
          return format(date, 'yyyy/MM/dd');
      }
    } catch (e) {
      console.error('Error formatting date:', e);
      return dateString;
    }
  };

  return (
    <div className="print:m-0 print:max-w-none print:p-0" style={{ fontFamily: 'Amiri, serif' }}>
      <Head title={t('criminal.comprehensive_list.print.title') || 'فهرست مجرمین'} />
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
          
          @media print {
              @page {
                  size: A4 landscape;
                  margin: 2.5cm;
              }
              body {
                  font-size: 11px;
                  line-height: 1.5;
                  font-family: 'Amiri', serif !important;
              }
              * {
                  font-family: 'Amiri', serif !important;
              }
              .print\\:text-xs {
                  font-size: 9px !important;
              }
              .print\\:border-gray-800 {
                  border-color: #1f2937 !important;
              }
              .print\\:border-gray-600 {
                  border-color: #4b5563 !important;
              }
              .print\\:hidden {
                  display: none !important;
              }
              table {
                  page-break-inside: auto;
              }
              tr {
                  page-break-inside: avoid;
                  page-break-after: auto;
              }
          }
      `,
        }}
      />

      {/* Print Controls */}
      <div className="mb-6 print:hidden">
        <div className="flex items-center justify-between">
          <Button onClick={handleBack} variant="outline" size="lg" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t('criminal.comprehensive_list.print.back_button') || 'بازگشت'}
          </Button>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowSettingsModal(true)}
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              {t('criminal.comprehensive_list.print.settings_button') || 'تنظیمات چاپ'}
            </Button>
            <Button onClick={handlePrint} size="lg" className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700">
              <FileText className="h-4 w-4" />
              {t('criminal.comprehensive_list.print.print_button') || 'چاپ'}
            </Button>
          </div>
        </div>
      </div>

      <div className="print:page-break-inside-avoid relative mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-10 border-b-2 border-gray-300 pb-6 text-center print:border-gray-800">
          <div className="relative mb-4 flex items-center justify-between">
            <div className="flex-shrink-0">
              <img
                src="/images/logos/logo 1.png"
                alt="logo"
                className="h-20 w-20 object-contain print:h-16 print:w-16"
              />
            </div>
            <div className="flex-1">
              <h1 className="mb-1 text-3xl font-bold text-gray-900 print:text-2xl">
                {printSettings.governmentName}
              </h1>
              <h2 className="mb-1 text-2xl font-semibold text-gray-800 print:text-xl">{printSettings.ministryName}</h2>
              <h3 className="text-xl font-medium text-gray-700 print:text-lg">{printSettings.reportTitle}</h3>
            </div>
            <div className="flex-shrink-0">
              <img
                src="/images/logos/logo 2.png"
                alt="logo"
                className="h-20 w-20 object-contain print:h-16 print:w-16"
              />
            </div>
          </div>
          <div className="mt-4 rounded-lg bg-gray-100 px-4 py-2 text-base font-medium text-gray-800 print:bg-gray-200 print:text-sm">
            {t('criminal.comprehensive_list.print.date') || 'تاریخ'}: {formatDate(new Date().toISOString())}
            {criminals.length > 0 && (
              <> | {t('criminal.comprehensive_list.print.total') || 'تعداد کل'}: {criminals.length}</>
            )}
          </div>
        </div>

        {/* Criminals Table */}
        <div className="mb-8">
          <div className="overflow-hidden rounded-lg border border-gray-300 print:border-gray-800">
            <table className="min-w-full border-collapse bg-white">
              <thead>
                <tr className="bg-gradient-to-b from-gray-700 to-gray-800 text-white print:bg-gray-900">
                  <th className="border border-gray-400 px-3 py-2 text-center text-xs font-bold print:border-gray-800">
                    #
                  </th>
                  <th className="border border-gray-400 px-3 py-2 text-center text-xs font-bold print:border-gray-800">
                    {t('criminal.comprehensive_list.table.photo') || 'عکس'}
                  </th>
                  <th className="border border-gray-400 px-3 py-2 text-center text-xs font-bold print:border-gray-800">
                    {t('criminal.comprehensive_list.table.name') || 'نوم'}
                  </th>
                  <th className="border border-gray-400 px-3 py-2 text-center text-xs font-bold print:border-gray-800">
                    {t('criminal.comprehensive_list.table.father_name') || 'د پلار نوم'}
                  </th>
                  <th className="border border-gray-400 px-3 py-2 text-center text-xs font-bold print:border-gray-800">
                    {t('criminal.comprehensive_list.table.id_card_number') || 'د تذکره شمېره'}
                  </th>
                  <th className="border border-gray-400 px-3 py-2 text-center text-xs font-bold print:border-gray-800">
                    {t('criminal.comprehensive_list.table.original_residence') || 'سکونت اصلی'}
                  </th>
                  <th className="border border-gray-400 px-3 py-2 text-center text-xs font-bold print:border-gray-800">
                    {t('criminal.comprehensive_list.table.current_residence') || 'سکونت فعلی'}
                  </th>
                  <th className="border border-gray-400 px-3 py-2 text-center text-xs font-bold print:border-gray-800">
                    {t('criminal.comprehensive_list.table.notes') || 'ملاحظات'}
                  </th>
                  <th className="border border-gray-400 px-3 py-2 text-center text-xs font-bold print:border-gray-800">
                    {t('criminal.comprehensive_list.table.phone_number') || 'د تلیفون شمېره'}
                  </th>
                  <th className="border border-gray-400 px-3 py-2 text-center text-xs font-bold print:border-gray-800">
                    {t('criminal.comprehensive_list.table.crime_type') || 'د جرم ډول'}
                  </th>
                  <th className="border border-gray-400 px-3 py-2 text-center text-xs font-bold print:border-gray-800">
                    {t('criminal.comprehensive_list.table.department') || 'څانګه'}
                  </th>
                  <th className="border border-gray-400 px-3 py-2 text-center text-xs font-bold print:border-gray-800">
                    {t('criminal.comprehensive_list.table.arrest_date') || 'د نیول کېدو نېټه'}
                  </th>
                  <th className="border border-gray-400 px-3 py-2 text-center text-xs font-bold print:border-gray-800">
                    {t('criminal.comprehensive_list.table.arrest_location') || 'د نیول کېدو ځای'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {criminals.length > 0 ? (
                  criminals.map((criminal, index) => (
                    <tr
                      key={criminal.id}
                      className={`transition-colors ${
                        index % 2 === 0
                          ? 'bg-white print:bg-white'
                          : 'bg-gray-50 print:bg-gray-100'
                      } hover:bg-gray-100 print:hover:bg-inherit`}
                    >
                      <td className="border border-gray-300 px-3 py-2 text-center text-xs text-gray-900 print:border-gray-800">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center print:border-gray-800">
                        {criminal.photo ? (
                          <img
                            src={`/storage/${criminal.photo}`}
                            alt={criminal.name}
                            className="mx-auto h-12 w-12 rounded object-cover print:h-10 print:w-10"
                          />
                        ) : (
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded bg-gray-200 print:h-10 print:w-10">
                            <User className="h-6 w-6 text-gray-400 print:h-5 print:w-5" />
                          </div>
                        )}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center text-xs text-gray-900 print:border-gray-800">
                        {criminal.name}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center text-xs text-gray-900 print:border-gray-800">
                        {criminal.father_name || '-'}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center text-xs text-gray-900 print:border-gray-800" dir="ltr">
                        {criminal.id_card_number || '-'}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center text-xs text-gray-900 print:border-gray-800">
                        {criminal.original_residence || '-'}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center text-xs text-gray-900 print:border-gray-800">
                        {criminal.current_residence || '-'}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-justify text-xs leading-relaxed text-gray-900 break-words whitespace-normal print:border-gray-800">
                        {criminal.notes || '-'}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center text-xs text-gray-900 print:border-gray-800" dir="ltr">
                        {criminal.phone_number || '-'}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center text-xs text-gray-900 print:border-gray-800">
                        {criminal.crime_type || '-'}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center text-xs text-gray-900 print:border-gray-800">
                        {criminal.department?.name || '-'}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-900 print:border-gray-800">
                        {formatDate(criminal.arrest_date)}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-justify text-xs leading-relaxed text-gray-900 break-words whitespace-normal print:border-gray-800">
                        {criminal.arrest_location || '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={13}
                      className="border border-gray-300 px-4 py-8 text-center text-sm text-gray-500 print:border-gray-800"
                    >
                      {t('criminal.comprehensive_list.no_records') || 'هیچ موردی یافت نشد'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Print Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                {t('criminal.comprehensive_list.print.settings_title') || 'تنظیمات چاپ'}
              </h2>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Tabs for settings categories */}
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('labels')}
                  className={`px-4 py-2 border-b-2 font-medium text-sm ${
                    activeTab === 'labels'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <Tag className="mr-2 h-4 w-4" />
                    {t('criminal.comprehensive_list.print.settings.tabs.labels') || 'عنوان‌ها'}
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('date_format')}
                  className={`px-4 py-2 border-b-2 font-medium text-sm ${
                    activeTab === 'date_format'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <TabletSmartphone className="mr-2 h-4 w-4" />
                    {t('criminal.comprehensive_list.print.settings.tabs.date_format') || 'فرمت تاریخ'}
                  </div>
                </button>
              </div>

              {/* Labels Tab */}
              {activeTab === 'labels' && (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Tag className="mr-2 h-5 w-5 text-primary" />
                    <h3 className="text-md font-medium">
                      {t('criminal.comprehensive_list.print.settings_labels_title') || 'عنوان‌ها'}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('criminal.comprehensive_list.print.settings_government_name') || 'نام دولت:'}
                      </label>
                      <input
                        type="text"
                        value={printSettings.governmentName}
                        onChange={(e) => handleSettingsChange('governmentName', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        placeholder="امارت اسلامی افغانستان"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('criminal.comprehensive_list.print.settings_ministry_name') || 'نام وزارت:'}
                      </label>
                      <input
                        type="text"
                        value={printSettings.ministryName}
                        onChange={(e) => handleSettingsChange('ministryName', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        placeholder="وزارت دفاع"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('criminal.comprehensive_list.print.settings_report_title') || 'عنوان گزارش:'}
                      </label>
                      <input
                        type="text"
                        value={printSettings.reportTitle}
                        onChange={(e) => handleSettingsChange('reportTitle', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        placeholder="فهرست مجرمین"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Date Format Tab */}
              {activeTab === 'date_format' && (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <TabletSmartphone className="mr-2 h-5 w-5 text-primary" />
                    <h3 className="text-md font-medium">
                      {t('criminal.comprehensive_list.print.settings.date_format.title') || 'فرمت تاریخ'}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('criminal.comprehensive_list.print.settings.date_format.title') || 'فرمت تاریخ'}
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="dateFormat"
                            value="gregorian"
                            checked={printSettings.dateFormat === 'gregorian'}
                            onChange={(e) => handleSettingsChange('dateFormat', e.target.value)}
                            className="mr-2"
                          />
                          <span className="text-sm">
                            {t('criminal.comprehensive_list.print.settings.date_format.gregorian') || 'میلادی (Gregorian)'}
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="dateFormat"
                            value="hijri"
                            checked={printSettings.dateFormat === 'hijri'}
                            onChange={(e) => handleSettingsChange('dateFormat', e.target.value)}
                            className="mr-2"
                          />
                          <span className="text-sm">
                            {t('criminal.comprehensive_list.print.settings.date_format.hijri') || 'هجری (Hijri)'}
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="dateFormat"
                            value="persian"
                            checked={printSettings.dateFormat === 'persian'}
                            onChange={(e) => handleSettingsChange('dateFormat', e.target.value)}
                            className="mr-2"
                          />
                          <span className="text-sm">
                            {t('criminal.comprehensive_list.print.settings.date_format.persian') || 'شمسی (Persian)'}
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4 bg-gray-50">
                      <h4 className="font-medium text-gray-700 mb-2">
                        {t('criminal.comprehensive_list.print.settings.date_format.preview') || 'نمونه تاریخ:'}
                      </h4>
                      <div className="text-sm text-gray-600">
                        {formatDate(new Date().toISOString())}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Preview */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="text-md font-medium mb-3">
                  {t('criminal.comprehensive_list.print.settings_preview') || 'پیش‌نمایش'}
                </h3>
                <div className="border rounded overflow-hidden bg-white p-4">
                  <div className="text-center">
                    <h1 className="mb-1 text-2xl font-bold text-gray-900">
                      {printSettings.governmentName}
                    </h1>
                    <h2 className="mb-1 text-xl font-semibold text-gray-800">{printSettings.ministryName}</h2>
                    <h3 className="text-lg font-medium text-gray-700">{printSettings.reportTitle}</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t px-4 py-3 flex justify-end space-x-3">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {t('common.cancel') || 'لغو'}
              </button>
              <button
                onClick={() => {
                  setShowSettingsModal(false);
                }}
                className="px-4 py-2 bg-primary border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {t('common.save') || 'ذخیره'}
              </button>
              <button
                onClick={() => {
                  setShowSettingsModal(false);
                  setTimeout(() => window.print(), 300);
                }}
                className="px-4 py-2 bg-purple-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                {t('criminal.comprehensive_list.print.apply_and_print') || 'ذخیره و چاپ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

