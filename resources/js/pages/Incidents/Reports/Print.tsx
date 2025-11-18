import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, AlertTriangle, Calendar, Shield, User, MapPin, Clock, Users, Gavel, FileCheck, BookText, Building2, Lock, Tag, Info, Settings, X, Palette, Type, Layout, TabletSmartphone, Printer } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';
import { formatPersianDateOnly, formatPersianDateTime } from '@/lib/utils/date';
import QRCode from 'qrcode';
import { format } from 'date-fns';


interface BarcodeData {
  report_number: string;
  report_id: number;
  date: string;
  security_level: string;
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
}

interface PrintProps {
  report: {
    id: number;
    report_number: string;
    report_date: string;
    report_status: string;
    security_level: string;
    details: string;
    action_taken?: string;
    recommendation?: string;
    source?: string;
    submitted_by: number;
    approved_by?: number;
    created_at: string;
    updated_at: string;
    submitter?: {
      id: number;
      name: string;
    };
    approver?: {
      id: number;
      name: string;
    };
  };
  incidents: Array<{
    id: number;
    title: string;
    incident_date: string;
    description: string;
    severity: string;
    status: string;
    location?: string;
    district?: {
      id: number;
      name: string;
    };
    category?: {
      id: number;
      name: string;
      color: string;
    };
    reporter?: {
      id: number;
      name: string;
    };
  }>;
  barcodeData: BarcodeData;
  isAdmin: boolean;
}

export default function Print({ report, incidents, barcodeData, isAdmin }: PrintProps) {
  const { t } = useTranslation();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'layout' | 'date_format'>('colors');
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
    dateFormat: 'persian',
  });

  // Update dynamic styles function
  const updateDynamicStyles = (element: HTMLElement, settings: PrintSettings) => {
    const getMargins = (margin: string) => {
      switch (margin) {
        case 'narrow':
          return '0.5cm';
        case 'wide':
          return '2cm';
        default:
          return '1cm';
      }
    };

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
        .print-header-bg {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          background-color: ${settings.headerColor} !important;
          color: white !important;
        }
        .text-accent, h1, h2, h3, .font-bold.text-accent {
          color: ${settings.accentColor} !important;
        }
        .border-accent {
          border-color: ${settings.accentColor} !important;
        }
        .bg-accent {
          background-color: ${settings.accentColor} !important;
        }
      }
    `;
    element.innerHTML = cssText;
  };

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const qrData = report.report_number || report.id.toString();
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

    return () => {
      const styleEl = document.getElementById('dynamic-print-styles');
      if (styleEl) {
        styleEl.remove();
      }
    };
  }, [report.report_number, report.id, printSettings]);

  // Date conversion utility functions
  const gregorianToHijri = (date: Date): string => {
    const hijriYear = Math.floor((date.getFullYear() - 622) * 0.970224);
    const hijriMonth = Math.floor((date.getMonth() + 1) * 0.970224);
    const hijriDay = Math.floor(date.getDate() * 0.970224);
    return `${hijriYear}/${hijriMonth.toString().padStart(2, '0')}/${hijriDay.toString().padStart(2, '0')}`;
  };

  const gregorianToPersian = (date: Date): string => {
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
    setPrintSettings(prev => {
      const newSettings = {
        ...prev,
        [name]: value
      };
      
      const styleElement = document.getElementById('dynamic-print-styles');
      if (styleElement) {
        updateDynamicStyles(styleElement, newSettings);
      }
      
      return newSettings;
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    window.history.back();
  };


  // If not admin, show access denied
  if (!isAdmin) {
    return (
      <div className="print:max-w-none print:p-0 print:m-0" style={{ fontFamily: 'Arial, sans-serif' }}>
        <Head title={t('incident_reports.print.access_denied')} />
        <div className="min-h-screen bg-white p-8 flex items-center justify-center" dir="rtl">
          <div className="border border-red-200 shadow-sm max-w-md">
            <div className="bg-red-50 border-b border-red-200 p-4">
              <h1 className="flex items-center gap-3 text-lg text-red-900">
                <Lock className="h-5 w-5" />
                {t('incident_reports.print.access_denied')}
              </h1>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">{t('incident_reports.print.admin_only')}</p>
              <Button onClick={handleBack} variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('common.back')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head title={t('incident_reports.print.page_title', { number: report.report_number })} />
      
      {/* Dynamic styles - this will be managed by JavaScript */}
      <style id="dynamic-print-styles"></style>

      {/* Print Settings Modal */}
      {showSettingsModal && (
        <div className="screen-only fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                {t('incident_reports.print.settings.title') || 'تنظیمات چاپ'}
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
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  <div className="flex items-center">
                    <Palette className="mr-2 h-4 w-4" />
                    {t('incident_reports.print.settings.tabs.colors') || 'رنگ‌ها'}
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('typography')}
                  className={`px-4 py-2 border-b-2 font-medium text-sm ${activeTab === 'typography'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  <div className="flex items-center">
                    <Type className="mr-2 h-4 w-4" />
                    {t('incident_reports.print.settings.tabs.typography') || 'تایپوگرافی'}
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('layout')}
                  className={`px-4 py-2 border-b-2 font-medium text-sm ${activeTab === 'layout'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  <div className="flex items-center">
                    <Layout className="mr-2 h-4 w-4" />
                    {t('incident_reports.print.settings.tabs.layout') || 'چیدمان'}
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('date_format')}
                  className={`px-4 py-2 border-b-2 font-medium text-sm ${activeTab === 'date_format'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  <div className="flex items-center">
                    <TabletSmartphone className="mr-2 h-4 w-4" />
                    {t('incident_reports.print.settings.tabs.date_format') || 'فرمت تاریخ'}
                  </div>
                </button>
              </div>

              {/* Colors Tab */}
              {activeTab === 'colors' && (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Palette className="mr-2 h-5 w-5 text-blue-600" />
                    <h3 className="text-md font-medium">{t('incident_reports.print.settings.colors.title') || 'رنگ‌ها'}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('incident_reports.print.settings.colors.header') || 'رنگ هدر'}
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
                        {t('incident_reports.print.settings.colors.text') || 'رنگ متن'}
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
                        {t('incident_reports.print.settings.colors.accent') || 'رنگ تاکید'}
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

              {/* Typography Tab */}
              {activeTab === 'typography' && (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Type className="mr-2 h-5 w-5 text-blue-600" />
                    <h3 className="text-md font-medium">{t('incident_reports.print.settings.typography.title') || 'تایپوگرافی'}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('incident_reports.print.settings.typography.font_family') || 'فونت'}
                      </label>
                      <select
                        value={printSettings.fontFamily}
                        onChange={(e) => handleSettingsChange('fontFamily', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      >
                        <option value="Amiri, Traditional Arabic, Arial, sans-serif">Amiri (پیش‌فرض)</option>
                        <option value="Traditional Arabic, Arial, sans-serif">Traditional Arabic</option>
                        <option value="Arial, sans-serif">Arial</option>
                        <option value="Calibri, sans-serif">Calibri</option>
                        <option value="Tahoma, sans-serif">Tahoma</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('incident_reports.print.settings.typography.font_size') || 'اندازه فونت'}
                      </label>
                      <div className="flex items-center">
                        <input
                          type="range"
                          min="10"
                          max="16"
                          value={printSettings.fontSize}
                          onChange={(e) => handleSettingsChange('fontSize', parseInt(e.target.value))}
                          className="flex-1"
                        />
                        <span className="ml-2 text-sm w-10 text-center">
                          {printSettings.fontSize}pt
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Layout Tab */}
              {activeTab === 'layout' && (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Layout className="mr-2 h-5 w-5 text-blue-600" />
                    <h3 className="text-md font-medium">{t('incident_reports.print.settings.layout.title') || 'چیدمان'}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('incident_reports.print.settings.layout.page_size') || 'اندازه صفحه'}
                      </label>
                      <select
                        value={printSettings.pageSize}
                        onChange={(e) => handleSettingsChange('pageSize', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      >
                        <option value="a4">A4</option>
                        <option value="letter">Letter</option>
                        <option value="legal">Legal</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('incident_reports.print.settings.layout.orientation') || 'جهت صفحه'}
                      </label>
                      <select
                        value={printSettings.orientation}
                        onChange={(e) => handleSettingsChange('orientation', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      >
                        <option value="portrait">عمودی</option>
                        <option value="landscape">افقی</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('incident_reports.print.settings.layout.margins') || 'حاشیه'}
                      </label>
                      <select
                        value={printSettings.margins}
                        onChange={(e) => handleSettingsChange('margins', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      >
                        <option value="normal">عادی</option>
                        <option value="narrow">باریک</option>
                        <option value="wide">پهن</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={printSettings.showLogo}
                        onChange={(e) => handleSettingsChange('showLogo', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm">{t('incident_reports.print.settings.layout.show_logo') || 'نمایش لوگو'}</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={printSettings.showFooter}
                        onChange={(e) => handleSettingsChange('showFooter', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm">{t('incident_reports.print.settings.layout.show_footer') || 'نمایش پاورقی'}</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={printSettings.showDate}
                        onChange={(e) => handleSettingsChange('showDate', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm">{t('incident_reports.print.settings.layout.show_date') || 'نمایش تاریخ'}</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Date Format Tab */}
              {activeTab === 'date_format' && (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <TabletSmartphone className="mr-2 h-5 w-5 text-blue-600" />
                    <h3 className="text-md font-medium">{t('incident_reports.print.settings.date_format.title') || 'فرمت تاریخ'}</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('incident_reports.print.settings.date_format.title') || 'فرمت تاریخ'}
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
                          <span className="text-sm">{t('incident_reports.print.settings.date_format.gregorian') || 'میلادی'}</span>
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
                          <span className="text-sm">{t('incident_reports.print.settings.date_format.hijri') || 'هجری قمری'}</span>
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
                          <span className="text-sm">{t('incident_reports.print.settings.date_format.persian') || 'هجری شمسی'}</span>
                        </label>
                      </div>
                    </div>
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
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {t('common.cancel') || 'لغو'}
              </button>
              <button
                onClick={() => {
                  setShowSettingsModal(false);
                  setTimeout(() => window.print(), 300);
                }}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {t('incident_reports.print.settings.apply_and_print') || 'اعمال و چاپ'}
              </button>
            </div>
          </div>
        </div>
      )}

    <div className="print:max-w-none print:p-0 print:m-0" style={{ fontFamily: printSettings.fontFamily, color: printSettings.textColor, fontSize: `${printSettings.fontSize}px` }}>
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
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
            .screen-only {
              display: none !important;
            }
          }
          @media screen {
            .screen-only {
              display: block;
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
            {t('incident_reports.print.back_button')}
          </Button>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowSettingsModal(true)}
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              {t('incident_reports.print.settings_button') || 'تنظیمات چاپ'}
            </Button>
            <Button
              onClick={handlePrint}
              size="lg"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <FileText className="h-4 w-4" />
              {t('incident_reports.print.print_button')}
            </Button>
          </div>
        </div>
      </div>

      <div className="print:page-break-inside-avoid relative">
        <h1 className="text-2xl font-bold text-black text-center mb-2">{t('incident_reports.print.title')}</h1>
        <h2 className="text-xl font-semibold text-black text-center pt-2 mb-4">{t('incident_reports.print.subtitle')}</h2>
        
        {qrCodeDataUrl && (
          <div className="absolute top-0 right-0 print:top-0 print:right-0">
            <div className="text-center">
              <img 
                src={qrCodeDataUrl} 
                alt="QR Code" 
                className="w-24 h-24 print:w-20 print:h-20 border border-gray-300 print:border-gray-600"
              />
              <p className="text-xs text-gray-600 print:text-gray-800 mt-1">
                {report.report_number}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Report Information Table */}
      <table className="w-full mt-4 print:text-xs" style={{ borderCollapse: 'collapse' }}>
        <tr className="text-sm border-b border-gray-900 print:border-gray-800">
          <th className="text-left pr-2 font-semibold flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {t('incident_reports.show.report_number')}:
          </th>
          <td className="pr-4">{report.report_number}</td>
          <th className="text-left pr-2 font-semibold flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {t('incident_reports.show.report_date_label')}:
          </th>
          <td className="pr-4">{printSettings.dateFormat === 'persian' ? formatPersianDateOnly(report.report_date) : formatDate(report.report_date)}</td>
        </tr>
        <tr className="text-sm border-b border-gray-900 print:border-gray-800">
          <th className="text-left pr-2 font-semibold flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {t('incident_reports.show.status')}:
          </th>
          <td className="pr-4">{t(`incident_reports.status.${report.report_status}`)}</td>
          <th className="text-left pr-2 font-semibold flex items-center gap-1">
            <Shield className="h-3 w-3" />
            {t('incident_reports.show.security_level')}:
          </th>
          <td className="pr-4">{t(`incident_reports.level.${report.security_level}`)}</td>
        </tr>
        <tr className="text-sm border-b border-gray-900 print:border-gray-800">
          <th className="text-left pr-2 font-semibold flex items-center gap-1">
            <User className="h-3 w-3" />
            {t('incident_reports.show.submitted_by')}:
          </th>
          <td className="pr-4">{report.submitter?.name || t('incidents.unknown')}</td>
          <th className="text-left pr-2 font-semibold flex items-center gap-1">
            <User className="h-3 w-3" />
            {t('incident_reports.show.approved_by')}:
          </th>
          <td className="pr-4">{report.approver?.name || t('incident_reports.print.pending_approval')}</td>
        </tr>
        {report.source && (
          <tr className="text-sm pt-2 py-2">
            <th className="text-left pr-2 font-semibold flex items-center gap-1">
              <Users className="h-3 w-3" />
              {t('incident_reports.show.source_label')}:
            </th>
            <td colSpan={3}>{report.source}</td>
          </tr>
        )}
      </table>
      <hr className="my-4 border-gray-900 print:border-gray-800" />

      {/* Report Details */}
      <div className="mt-4 print:page-break-inside-avoid">
        <h3 className="text-lg font-semibold text-black mb-2 flex items-center gap-2">
          <BookText className="h-4 w-4" />
          {t('incident_reports.details.title')}
        </h3>

        <div className="mt-3 p-3 bg-gray-50 print:bg-white print:border print:border-gray-300 rounded">
          <h4 className="font-semibold text-black mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {t('incident_reports.details.details_label')}:
          </h4>
          <p className="text-sm text-justify leading-relaxed">{report.details}</p>
        </div>

        {report.action_taken && (
          <div className="mt-3 p-3 bg-gray-50 print:bg-white print:border print:border-gray-300 rounded">
            <h4 className="font-semibold text-black mb-2 flex items-center gap-2">
              <Gavel className="h-4 w-4" />
              {t('incident_reports.details.action_taken_label')}:
            </h4>
            <p className="text-sm text-justify leading-relaxed">{report.action_taken}</p>
          </div>
        )}

        {report.recommendation && (
          <div className="mt-3 p-3 bg-gray-50 print:bg-white print:border print:border-gray-300 rounded">
            <h4 className="font-semibold text-black mb-2 flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              {t('incident_reports.details.recommendation_label')}:
            </h4>
            <p className="text-sm text-justify leading-relaxed">{report.recommendation}</p>
          </div>
        )}
      </div>

      <hr className="my-4 border-gray-300 print:border-gray-600" />

      {/* Incidents Section */}
      <div className="mt-4 print:page-break-inside-avoid">
        <h3 className="text-lg font-semibold text-black mb-2 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          {t('incidents.page_title')} ({incidents.length})
        </h3>

        {incidents.length === 0 ? (
          <div className="text-center py-4">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 text-sm">{t('incidents.no_incidents')}</p>
          </div>
        ) : (
          incidents.map((incident, index) => (
            <div key={incident.id} className="mt-4 print:page-break-inside-avoid">
              <div className="pt-4 mb-2">
                <h4 className="text-lg font-semibold text-black mb-2">
                  {index + 1}. {incident.title}
                </h4>
              </div>

              <table className="w-full print:text-xs" style={{ borderCollapse: 'collapse' }}>
                <tr className="border-b border-gray-300 print:border-gray-600">
                  <th className="text-left pr-2 font-semibold py-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {t('incidents.incident_date')}:
                  </th>
                  <td className="pr-4 py-1">{printSettings.dateFormat === 'persian' ? formatPersianDateOnly(incident.incident_date) : formatDate(incident.incident_date)}</td>
                  <th className="text-left pr-2 font-semibold py-1 flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {t('incidents.severity')}:
                  </th>
                  <td className="pr-4 py-1">{incident.severity}</td>
                  <th className="text-left pr-2 font-semibold py-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {t('incidents.status')}:
                  </th>
                  <td className="pr-4 py-1">{t(`incidents.status.${incident.status}`)}</td>
                </tr>
                <tr className="border-b border-gray-300 print:border-gray-600">
                  {incident.location && (
                    <>
                      <th className="text-left pr-2 font-semibold py-1 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {t('incidents.location')}:
                      </th>
                      <td className="pr-4 py-1">{incident.location}</td>
                    </>
                  )}
                  {incident.district && (
                    <>
                      <th className="text-left pr-2 font-semibold py-1 flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {t('incidents.district')}:
                      </th>
                      <td className="pr-4 py-1">{incident.district.name}</td>
                    </>
                  )}
                  {incident.category && (
                    <>
                      <th className="text-left pr-2 font-semibold py-1 flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {t('incidents.category')}:
                      </th>
                      <td className="pr-4 py-1">{incident.category.name}</td>
                    </>
                  )}
                </tr>
              </table>

              <div className="mt-3 p-3 bg-gray-50 print:bg-white print:border print:border-gray-300 rounded">
                <h4 className="font-semibold text-black mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  {t('incidents.description')}:
                </h4>
                <p className="text-sm text-justify leading-relaxed">{incident.description}</p>
              </div>

              {index < incidents.length - 1 && <hr className="my-4 border-gray-300 print:border-gray-600" />}
            </div>
          ))
        )}
      </div>


      {/* Footer */}
      {printSettings.showFooter && (
        <div className="mt-8 pt-4 border-t border-gray-300 print:border-gray-600 print:mt-12">
          <div className="text-center text-sm text-gray-600 print:text-gray-800">
            {printSettings.showDate && (
              <p className="flex items-center justify-center gap-2">
                <Calendar className="h-4 w-4" />
                {t('incident_reports.print.generated_on')}: {printSettings.dateFormat === 'persian' ? formatPersianDateTime(new Date().toISOString()) : formatDate(new Date().toISOString())}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
    </>
  );
}
