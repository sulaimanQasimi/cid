import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, User, Calendar, CheckCircle, Clock, Building2, Tag, FileCheck, Info, Printer, Settings, X, Layout, Palette, Type, TabletSmartphone } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';
import { formatPersianDateOnly, formatPersianDateTime } from '@/lib/utils/date';
import { format } from 'date-fns';
import QRCode from 'qrcode';

interface Info {
  id: number;
  name: string;
  code: string;
  description: string;
  confirmed: boolean;
  confirmed_at: string | null;
  created_at: string;
  updated_at: string;
  info_type: {
    id: number;
    name: string;
  };
  info_category: {
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
  confirmer?: {
    id: number;
    name: string;
  };
  province?: {
    id: number;
    name: string;
  };
  district?: {
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

interface PrintSettings {
  headerColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
  fontSize: number;
  showLogo: boolean;
  showFooter: boolean;
  showDate: boolean;
  pageSize: 'a4' | 'letter' | 'legal';
  orientation: 'portrait' | 'landscape';
  margins: 'normal' | 'narrow' | 'wide';
  dateFormat: 'gregorian' | 'hijri' | 'persian';
  labels: {
    reportTitle: string;
    name: string;
    code: string;
    category: string;
    creator: string;
    status: string;
    confirmedBy: string;
    confirmedAt: string;
    department: string;
    province: string;
    district: string;
    infoType: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    generatedOn: string;
  };
}

interface Props {
  infoType: InfoType;
  infos: Info[];
  statCategories: StatCategory[];
}

export default function PrintInfoType({ infoType, infos, statCategories }: Props) {
  const { t } = useTranslation();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [printSettings, setPrintSettings] = useState<PrintSettings>({
    headerColor: '#1f2937',
    textColor: '#374151',
    accentColor: '#3b82f6',
    fontFamily: 'Amiri, Traditional Arabic, Arial, sans-serif',
    fontSize: 12,
    showLogo: true,
    showFooter: true,
    showDate: true,
    pageSize: 'a4',
    orientation: 'portrait',
    margins: 'normal',
    dateFormat: 'gregorian',
    labels: {
      reportTitle: 'د معلوماتو ډول راپور',
      name: 'نوم:',
      code: 'کوډ:',
      category: 'کټه ګوري:',
      creator: 'جوړونکی:',
      status: 'حالت:',
      confirmedBy: 'تاییدونکی:',
      confirmedAt: 'د تایید نېټه:',
      department: 'څانګه:',
      province: 'ولایت:',
      district: 'ولسوالی:',
      infoType: 'د معلوماتو ډول:',
      description: 'تفصیل:',
      createdAt: 'د جوړیدو نېټه:',
      updatedAt: 'د تازه کیدو نېټه:',
      generatedOn: 'د تولید نېټه:'
    }
  });

  // Add state for active tab in the settings modal
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'layout' | 'labels' | 'date_format'>('colors');

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const qrData = infoType.name || infoType.id.toString();
        const dataUrl = await QRCode.toDataURL(qrData, {
          width: 120,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrCodeDataUrl(dataUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQRCode();

    // Create dynamic style element
    let styleElement = document.getElementById('dynamic-print-styles');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'dynamic-print-styles';
      document.head.appendChild(styleElement);
    }
    updateDynamicStyles(styleElement, printSettings);

    // Auto-print when the component is mounted
    setTimeout(() => {
      window.print();
    }, 1000);

    // Cleanup
    return () => {
      const styleEl = document.getElementById('dynamic-print-styles');
      if (styleEl) {
        styleEl.remove();
      }
    };
  }, []);

  // Date conversion utility functions
  const gregorianToHijri = (date: Date): string => {
    // Simple approximation for Hijri conversion
    const hijriYear = Math.floor((date.getFullYear() - 622) * 0.970224);
    const hijriMonth = Math.floor((date.getMonth() + 1) * 0.970224);
    const hijriDay = Math.floor(date.getDate() * 0.970224);
    
    return `${hijriYear}/${hijriMonth.toString().padStart(2, '0')}/${hijriDay.toString().padStart(2, '0')}`;
  };

  const gregorianToPersian = (date: Date): string => {
    // Simple approximation for Persian conversion
    const persianYear = date.getFullYear() - 621;
    const persianMonth = date.getMonth() + 1;
    const persianDay = date.getDate();
    
    return `${persianYear}/${persianMonth.toString().padStart(2, '0')}/${persianDay.toString().padStart(2, '0')}`;
  };

  // Format the date based on selected calendar system
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      
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
      return '';
    }
  };

  const handleSettingsChange = (name: keyof PrintSettings, value: any) => {
    setPrintSettings(prev => ({
      ...prev,
      [name]: value
    }));

    // Force a re-render of the style tag when settings change
    const styleElement = document.getElementById('dynamic-print-styles');
    if (styleElement) {
      const newSettings = {
        ...printSettings,
        [name]: value
      };
      updateDynamicStyles(styleElement, newSettings);
    }
  };

  // Add a function to update dynamic styles
  const updateDynamicStyles = (element: HTMLElement, settings: PrintSettings) => {
    const cssText = `
      @page {
        size: ${settings.pageSize} ${settings.orientation};
        margin: ${getMargins(settings.margins)};
      }
      @media print {
        body {
          font-family: ${settings.fontFamily};
          print-color-adjust: exact;
          -webkit-print-color-adjust: exact;
          background: none;
          font-size: ${settings.fontSize}px;
          color: ${settings.textColor};
        }

        /* Custom background colors for printing */
        .print-template .header-bg {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          background-color: ${settings.headerColor} !important;
          color: white !important;
        }

        /* CSS for primary and accent colors to work in print */
        .text-primary, h1, h2, h3, .font-bold.text-primary {
          color: ${settings.accentColor} !important;
        }

        .border-primary, .border-primary\\/20 {
          border-color: ${settings.accentColor} !important;
        }

        .bg-primary {
          background-color: ${settings.accentColor} !important;
        }
      }
    `;
    element.innerHTML = cssText;
  };

  // Modified getMargins to accept a margin setting parameter
  const getMargins = (margin = printSettings.margins) => {
    switch (margin) {
      case 'narrow':
        return '0.5cm';
      case 'wide':
        return '2cm';
      default:
        return '1cm';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="print:max-w-none print:p-0 print:m-0" style={{ fontFamily: 'Arial, sans-serif' }}>
      <Head title={t('info_types.print.title', { name: infoType.name || 'Info Type' })} />
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            @page {
              size: A4;
              margin: 1cm;
            }
            body {
              font-size: 12px;
              line-height: 1.4;
            }
            .print\\:text-xs {
              font-size: 10px !important;
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
          }
        `
      }} />
      
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
            {t('info_types.print.back_button')}
          </Button>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowSettingsModal(true)}
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              {t('info_types.print.settings_button')}
            </Button>
            <Button
              onClick={handlePrint}
              size="lg"
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
            >
              <Printer className="h-4 w-4" />
              {t('info_types.print.print_button')}
            </Button>
          </div>
        </div>
      </div>

      <div className="print:page-break-inside-avoid relative">
        <h1 className="text-2xl font-bold text-black text-center mb-2">{t('info_types.print.header_title')}</h1>
        <h2 className="text-xl font-semibold text-black text-center pt-2 mb-4">{infoType.name || 'Info Type'}</h2>
        
        {qrCodeDataUrl && (
          <div className="absolute top-0 right-0 print:top-0 print:right-0">
            <div className="text-center">
              <img 
                src={qrCodeDataUrl} 
                alt="QR Code" 
                className="w-24 h-24 print:w-20 print:h-20 border border-gray-300 print:border-gray-600"
              />
              <p className="text-xs text-gray-600 print:text-gray-800 mt-1">
                {infoType.name || infoType.id}
              </p>
            </div>
          </div>
        )}
      </div>

      <table className="w-full mt-4 print:text-xs" style={{ borderCollapse: 'collapse' }}>
        <tr className="text-sm border-b border-gray-900 print:border-gray-800">
          <th className="text-left pr-2 font-semibold flex items-center gap-1">
            <Tag className="h-3 w-3" />
            {t('info_types.print.name_label')}:
          </th>
          <td className="pr-4">{infoType.name || 'Info Type'}</td>
          <th className="text-left pr-2 font-semibold flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {t('info_types.print.created_at_label')}:
          </th>
          <td className="pr-4">{formatPersianDateOnly(infoType.created_at)}</td>
        </tr>
        <tr className="text-sm border-b border-gray-900 print:border-gray-800">
          <th className="text-left pr-2 font-semibold flex items-center gap-1">
            <User className="h-3 w-3" />
            {t('info_types.print.created_by_label')}:
          </th>
          <td className="pr-4">{infoType.creator?.name || '-'}</td>
          <th className="text-left pr-2 font-semibold flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {t('info_types.print.updated_at_label')}:
          </th>
          <td className="pr-4">{formatPersianDateOnly(infoType.updated_at)}</td>
        </tr>
        <tr className="text-sm pt-2 py-2">
          <th className="text-left pr-2 font-semibold flex items-center gap-1">
            <Info className="h-3 w-3" />
            {t('info_types.print.description_label')}:
          </th>
          <td colSpan={3}>{infoType.description || t('info_types.print.no_description')}</td>
        </tr>
      </table>
      <hr className="my-4 border-gray-900 print:border-gray-800" />

      {infos.map((info, index) => (
        <div key={info.id} className="mt-4 print:page-break-inside-avoid">
          <div className="pt-4 mb-2">
            <h3 className="text-lg font-semibold text-black mb-2">
              {index + 1}. {info.name || 'Untitled'}
            </h3>
          </div>

          <table className="w-full print:text-xs" style={{ borderCollapse: 'collapse' }}>
            <tr className="border-b border-gray-300 print:border-gray-600">
              <th className="text-left pr-2 font-semibold py-1 flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {t('info_types.print.code_label')}:
              </th>
              <td className="pr-4 py-1">{info.code || '-'}</td>
              <th className="text-left pr-2 font-semibold py-1 flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {t('info_types.print.category_label')}:
              </th>
              <td className="pr-4 py-1">{info.info_category?.name || '-'}</td>
              <th className="text-left pr-2 font-semibold py-1 flex items-center gap-1">
                <User className="h-3 w-3" />
                {t('info_types.print.creator_label')}:
              </th>
              <td className="pr-4 py-1">{info.creator?.name || '-'}</td>
            </tr>
            <tr className="border-b border-gray-300 print:border-gray-600">
              <th className="text-left pr-2 font-semibold py-1 flex items-center gap-1">
                {info.confirmed ? <CheckCircle className="h-3 w-3 text-green-600" /> : <Clock className="h-3 w-3 text-yellow-600" />}
                {t('info_types.print.status_label')}:
              </th>
              <td className="pr-4 py-1">{info.confirmed ? t('info_types.print.confirmed') : t('info_types.print.pending')}</td>
              <th className="text-left pr-2 font-semibold py-1 flex items-center gap-1">
                <FileCheck className="h-3 w-3" />
                {t('info_types.print.confirmed_by_label')}:
              </th>
              <td className="pr-4 py-1">{info.confirmer?.name || '-'}</td>
              <th className="text-left pr-2 font-semibold py-1 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {t('info_types.print.confirmed_at_label')}:
              </th>
              <td className="pr-4 py-1">{info.confirmed_at ? formatPersianDateOnly(info.confirmed_at) : '-'}</td>
            </tr>
            <tr className="border-b border-gray-300 print:border-gray-600">
              <th className="text-left pr-2 font-semibold py-1 flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {t('info_types.print.department_label')}:
              </th>
              <td className="pr-4 py-1">{info.department?.name || '-'}</td>
              <th className="text-left pr-2 font-semibold py-1 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {t('info_types.print.created_at_label')}:
              </th>
              <td className="pr-4 py-1">{formatPersianDateOnly(info.created_at)}</td>
              <th className="text-left pr-2 font-semibold py-1 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {t('info_types.print.updated_at_label')}:
              </th>
              <td className="pr-4 py-1">{formatPersianDateOnly(info.updated_at)}</td>
            </tr>
            {(info.province || info.district) && (
              <tr className="border-b border-gray-300 print:border-gray-600">
                <th className="text-left pr-2 font-semibold py-1 flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {t('info_types.print.province_label')}:
                </th>
                <td className="pr-4 py-1">{info.province?.name || '-'}</td>
                <th className="text-left pr-2 font-semibold py-1 flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {t('info_types.print.district_label')}:
                </th>
                <td className="pr-4 py-1">{info.district?.name || '-'}</td>
                <th className="text-left pr-2 font-semibold py-1 flex items-center gap-1">
                  <FileCheck className="h-3 w-3" />
                  {t('info_types.print.info_type_label')}:
                </th>
                <td className="pr-4 py-1">{info.info_type?.name || '-'}</td>
              </tr>
            )}
          </table>

          {info.description && (
            <div className="mt-3 p-3 bg-gray-50 print:bg-white print:border print:border-gray-300 rounded">
              <h4 className="font-semibold text-black mb-2 flex items-center gap-2">
                <Info className="h-4 w-4" />
                {t('info_types.print.description_label')}:
              </h4>
              <p className="text-sm text-justify leading-relaxed">{info.description}</p>
            </div>
          )}

          {index < infos.length - 1 && <hr className="my-4 border-gray-300 print:border-gray-600" />}
        </div>
      ))}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-300 print:border-gray-600 print:mt-12">
        <div className="text-center text-sm text-gray-600 print:text-gray-800">
          <p className="flex items-center justify-center gap-2">
            <Calendar className="h-4 w-4" />
            {t('info_types.print.generated_on')}: {formatDate(new Date().toISOString())}
          </p>
        </div>
      </div>

      {/* Print Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                {t('info_types.print.settings.title')}
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
                  onClick={() => setActiveTab('colors')}
                  className={`px-4 py-2 border-b-2 font-medium text-sm ${activeTab === 'colors'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  <div className="flex items-center">
                    <Palette className="mr-2 h-4 w-4" />
                    {t('info_types.print.settings.tabs.colors')}
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('typography')}
                  className={`px-4 py-2 border-b-2 font-medium text-sm ${activeTab === 'typography'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  <div className="flex items-center">
                    <Type className="mr-2 h-4 w-4" />
                    {t('info_types.print.settings.tabs.typography')}
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('layout')}
                  className={`px-4 py-2 border-b-2 font-medium text-sm ${activeTab === 'layout'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  <div className="flex items-center">
                    <Layout className="mr-2 h-4 w-4" />
                    {t('info_types.print.settings.tabs.layout')}
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('labels')}
                  className={`px-4 py-2 border-b-2 font-medium text-sm ${activeTab === 'labels'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  <div className="flex items-center">
                    <Tag className="mr-2 h-4 w-4" />
                    {t('info_types.print.settings.tabs.labels')}
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('date_format')}
                  className={`px-4 py-2 border-b-2 font-medium text-sm ${activeTab === 'date_format'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  <div className="flex items-center">
                    <TabletSmartphone className="mr-2 h-4 w-4" />
                    {t('info_types.print.settings.tabs.date_format')}
                  </div>
                </button>
              </div>

              {/* Colors Tab */}
              {activeTab === 'colors' && (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Palette className="mr-2 h-5 w-5 text-primary" />
                    <h3 className="text-md font-medium">{t('info_types.print.settings.colors.title')}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('info_types.print.settings.colors.header')}
                      </label>
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          <input
                            type="color"
                            id="headerColorPicker"
                            value={printSettings.headerColor}
                            onChange={(e) => handleSettingsChange('headerColor', e.target.value)}
                            className="sr-only"
                          />
                          <label
                            htmlFor="headerColorPicker"
                            className="block h-10 w-10 rounded border border-gray-300 cursor-pointer"
                            style={{ backgroundColor: printSettings.headerColor }}
                          />
                        </div>
                        <input
                          type="text"
                          value={printSettings.headerColor}
                          onChange={(e) => handleSettingsChange('headerColor', e.target.value)}
                          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('info_types.print.settings.colors.text')}
                      </label>
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          <input
                            type="color"
                            id="textColorPicker"
                            value={printSettings.textColor}
                            onChange={(e) => handleSettingsChange('textColor', e.target.value)}
                            className="sr-only"
                          />
                          <label
                            htmlFor="textColorPicker"
                            className="block h-10 w-10 rounded border border-gray-300 cursor-pointer"
                            style={{ backgroundColor: printSettings.textColor }}
                          />
                        </div>
                        <input
                          type="text"
                          value={printSettings.textColor}
                          onChange={(e) => handleSettingsChange('textColor', e.target.value)}
                          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('info_types.print.settings.colors.accent')}
                      </label>
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          <input
                            type="color"
                            id="accentColorPicker"
                            value={printSettings.accentColor}
                            onChange={(e) => handleSettingsChange('accentColor', e.target.value)}
                            className="sr-only"
                          />
                          <label
                            htmlFor="accentColorPicker"
                            className="block h-10 w-10 rounded border border-gray-300 cursor-pointer"
                            style={{ backgroundColor: printSettings.accentColor }}
                          />
                        </div>
                        <input
                          type="text"
                          value={printSettings.accentColor}
                          onChange={(e) => handleSettingsChange('accentColor', e.target.value)}
                          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Date Format Tab */}
              {activeTab === 'date_format' && (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <TabletSmartphone className="mr-2 h-5 w-5 text-primary" />
                    <h3 className="text-md font-medium">{t('info_types.print.settings.date_format.title')}</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('info_types.print.settings.date_format.title')}
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
                          <span className="text-sm">{t('info_types.print.settings.date_format.gregorian')}</span>
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
                          <span className="text-sm">{t('info_types.print.settings.date_format.hijri')}</span>
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
                          <span className="text-sm">{t('info_types.print.settings.date_format.persian')}</span>
                        </label>
                      </div>
                    </div>

                    {/* Preview of current date format */}
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <h4 className="font-medium text-gray-700 mb-2">نمونه تاریخ:</h4>
                      <div className="text-sm text-gray-600">
                        {formatDate(new Date().toISOString())}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t px-4 py-3 flex justify-end space-x-3">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 bg-primary border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {t('common.save')}
              </button>
              <button
                onClick={() => {
                  setShowSettingsModal(false);
                  setTimeout(() => window.print(), 300);
                }}
                className="px-4 py-2 bg-primary border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {t('info_types.print.settings.apply_and_print')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

