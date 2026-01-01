import React, { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { useTranslation } from '@/lib/i18n/translate';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer, Settings, FileText, X, Palette, Type, Layout, Tag, Calendar } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Meeting {
  id: number;
  title: string;
  description: string;
  meeting_code: string;
  start_date: string | null;
  end_date: string | null;
  scheduled_at: string | null;
  duration_minutes: number | null;
  status: string;
  members: string[];
  is_recurring: boolean;
  offline_enabled: boolean;
  created_by: number;
  created_at: string;
  creator: User | null;
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
  governmentName: string;
  ministryName: string;
  labels: {
    reportTitle: string;
    reportSubtitle: string|null;
    topic: string;
    description: string;
    dateRange: string;
    meetingCode: string;
    status: string;
    members: string;
    resolution: string;
    createdBy: string;
  };
}

interface MeetingPrintProps {
  meetings: Meeting[];
  filters?: {
    start_date?: string | null;
    end_date?: string | null;
  };  
  printMode?: boolean;
}

export default function Print({ meetings, filters }: MeetingPrintProps) {
  const { t } = useTranslation();
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
    governmentName: 'امارت اسلامی افغانستان',
    ministryName: 'وزارت دفاع',
    labels: {
      reportTitle: 'د استخباراتو معنیت',
      reportSubtitle: 'د دفتر مدیریت',
      topic: 'ومری موضوع',
      description: 'تفصیلات',
      dateRange: 'د نیټو سلسله',
      meetingCode: 'د مجلس کوډ',
      status: 'حالت',
      members: 'د مجلس غړي',
      resolution: 'د مجلس پرېکړه',
      createdBy: 'جوړونکی',
    }
  });

  // Add state for active tab in the settings modal
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'layout' | 'labels'>('colors');

  useEffect(() => {
    // Create dynamic style element
    let styleElement = document.getElementById('dynamic-print-styles');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'dynamic-print-styles';
      document.head.appendChild(styleElement);
    }
    updateDynamicStyles(styleElement, printSettings);

    // Cleanup
    return () => {
      const styleEl = document.getElementById('dynamic-print-styles');
      if (styleEl) {
        styleEl.remove();
      }
    };
  }, [printSettings]);


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
    router.get(route('meetings.index'), {}, { preserveState: false });
  };


  return (
    <>
      <Head title={t('meeting.print.title') || 'د مجلس راپور'} />

      {/* Dynamic styles - this will be managed by JavaScript */}
      <style id="dynamic-print-styles"></style>

      {/* Print Settings Modal */}
      {showSettingsModal && (
        <div className="screen-only fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                {t('meeting.print.settings.title') || 'Print Settings'}
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
                    {t('meeting.print.settings.tabs.colors') || 'Colors'}
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
                    {t('meeting.print.settings.tabs.typography') || 'Typography'}
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
                    {t('meeting.print.settings.tabs.layout') || 'Layout'}
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
                    {t('meeting.print.settings.tabs.labels') || 'Labels'}
                  </div>
                </button>
              </div>

              {/* Colors Tab */}
              {activeTab === 'colors' && (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Palette className="mr-2 h-5 w-5 text-primary" />
                    <h3 className="text-md font-medium">{t('meeting.print.settings.colors.title') || 'Colors'}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('meeting.print.settings.colors.header') || 'Header Color'}
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
                        {t('meeting.print.settings.colors.text') || 'Text Color'}
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
                        {t('meeting.print.settings.colors.accent') || 'Accent Color'}
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
                    <Type className="mr-2 h-5 w-5 text-primary" />
                    <h3 className="text-md font-medium">{t('meeting.print.settings.typography.title') || 'Typography'}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('meeting.print.settings.typography.font_family') || 'Font Family'}
                      </label>
                      <select
                        value={printSettings.fontFamily}
                        onChange={(e) => handleSettingsChange('fontFamily', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      >
                        <option value="Amiri, Traditional Arabic, Arial, sans-serif">Amiri (Default)</option>
                        <option value="Traditional Arabic, Arial, sans-serif">Traditional Arabic</option>
                        <option value="Arial, sans-serif">Arial</option>
                        <option value="Calibri, sans-serif">Calibri</option>
                        <option value="Tahoma, sans-serif">Tahoma</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('meeting.print.settings.typography.font_size') || 'Font Size'}
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
                    <Layout className="mr-2 h-5 w-5 text-primary" />
                    <h3 className="text-md font-medium">{t('meeting.print.settings.layout.title') || 'Layout'}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('meeting.print.settings.layout.page_size') || 'Page Size'}
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
                        {t('meeting.print.settings.layout.orientation') || 'Orientation'}
                      </label>
                      <select
                        value={printSettings.orientation}
                        onChange={(e) => handleSettingsChange('orientation', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      >
                        <option value="portrait">Portrait</option>
                        <option value="landscape">Landscape</option>
                      </select>
            </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('meeting.print.settings.layout.margins') || 'Margins'}
                      </label>
                      <select
                        value={printSettings.margins}
                        onChange={(e) => handleSettingsChange('margins', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      >
                        <option value="normal">Normal</option>
                        <option value="narrow">Narrow</option>
                        <option value="wide">Wide</option>
                      </select>
                    </div>
              </div>
                </div>
              )}

              {/* Labels Tab */}
              {activeTab === 'labels' && (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Tag className="mr-2 h-5 w-5 text-primary" />
                    <h3 className="text-md font-medium">{t('criminal.print.settings.labels.title') || 'Labels'}</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <h4 className="font-medium text-gray-700 mb-2">{t('meeting.print.settings.labels.report_header') || 'Report Header'}</h4>
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('meeting.print.settings.labels.government_name') || 'Government Name'}
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
                            {t('meeting.print.settings.labels.ministry_name') || 'Ministry Name'}
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
                            {t('meeting.print.settings.labels.report_title') || 'Report Title'}
                          </label>
                          <input
                            type="text"
                            value={printSettings.labels.reportTitle}
                            onChange={(e) => handleSettingsChange('labels', { ...printSettings.labels, reportTitle: e.target.value })}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('meeting.print.settings.labels.report_subtitle') || 'Report Subtitle'}
                          </label>
                          <input
                            type="text"
                            value={printSettings.labels.reportSubtitle || ''}
                            onChange={(e) => handleSettingsChange('labels', { ...printSettings.labels, reportSubtitle: e.target.value })}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            placeholder="د دفتر مدیریت"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4 bg-gray-50">
                      <h4 className="font-medium text-gray-700 mb-2">{t('meeting.print.settings.labels.meeting_information') || 'Meeting Information'}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('meeting.print.settings.labels.topic') || 'Topic'}
                          </label>
                          <input
                            type="text"
                            value={printSettings.labels.topic}
                            onChange={(e) => handleSettingsChange('labels', { ...printSettings.labels, topic: e.target.value })}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('meeting.print.settings.labels.date_range') || 'Date Range'}
                          </label>
                          <input
                            type="text"
                            value={printSettings.labels.dateRange}
                            onChange={(e) => handleSettingsChange('labels', { ...printSettings.labels, dateRange: e.target.value })}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('meeting.print.settings.labels.meeting_code') || 'Meeting Code'}
                          </label>
                          <input
                            type="text"
                            value={printSettings.labels.meetingCode}
                            onChange={(e) => handleSettingsChange('labels', { ...printSettings.labels, meetingCode: e.target.value })}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('meeting.print.settings.labels.members') || 'Members'}
                          </label>
                          <input
                            type="text"
                            value={printSettings.labels.members}
                            onChange={(e) => handleSettingsChange('labels', { ...printSettings.labels, members: e.target.value })}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          />
                        </div>
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
                {t('common.cancel') || 'Cancel'}
              </button>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 bg-primary border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {t('common.save') || 'Save'}
              </button>
              <button
                onClick={() => {
                  setShowSettingsModal(false);
                  setTimeout(() => window.print(), 300);
                }}
                className="px-4 py-2 bg-primary border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {t('meeting.print.settings.apply_and_print') || 'Apply & Print'}
              </button>
            </div>
          </div>
              </div>
            )}

      {/* Print Buttons (visible only on screen) */}
      <div className="screen-only fixed top-4 right-4 z-50 p-4 bg-white shadow-lg rounded-lg">
        <div className="flex space-x-2">
          <button
            onClick={() => setShowSettingsModal(true)}
            className="bg-white text-gray-700 border border-gray-300 px-6 py-2 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Settings size={18} />
            <span>{t('reports.view.format') || 'Format'}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Printer size={18} />
            <span>{t('reports.view.print') || 'Print'}</span>
          </button>
        </div>
      </div>

      <div className="print:m-0 print:max-w-none print:p-0" style={{ fontFamily: printSettings.fontFamily, direction: 'rtl', color: printSettings.textColor, fontSize: `${printSettings.fontSize}px` }}>
        <div className="print:page-break-inside-avoid relative mx-auto max-w-7xl px-4">
          {/* Header - Only once for entire page */}
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
                <h2 className="mb-1 text-2xl font-semibold text-gray-800 print:text-xl">
                  {printSettings.ministryName}
                </h2>
                <h3 className="text-xl font-medium text-gray-700 print:text-lg">
                  {printSettings.labels.reportTitle}
                </h3>
                {printSettings.labels.reportSubtitle && (
                  <h4 className="text-lg font-medium text-gray-600 print:text-base">
                    {printSettings.labels.reportSubtitle}
                  </h4>
                )}
              </div>
              <div className="flex-shrink-0">
                <img
                  src="/images/logos/logo 2.png"
                  alt="logo"
                  className="h-20 w-20 object-contain print:h-16 print:w-16"
                />
              </div>
            </div>
            {filters?.start_date && filters?.end_date && (
              <div className="mt-4 rounded-lg bg-gray-100 px-4 py-2 text-base font-medium text-gray-800 print:bg-gray-200 print:text-sm">
                {t('meeting.print.date_range') || 'د نیټو سلسله'}: {filters.start_date} - {filters.end_date}
              </div>
            )}
          </div>
        </div>

        {/* Date Range Info */}
        {filters?.start_date && filters?.end_date && (
          <div className="mb-4 print:hidden text-center text-sm text-gray-600 dark:text-gray-400">
            {t('meeting.print.date_range') || 'د نیټو سلسله'}: {filters.start_date} - {filters.end_date}
          </div>
        )}

        {/* Meetings Table */}
        <div className="mb-8">
          <div className="overflow-hidden border border-gray-300 print:border-gray-800">
            <table className="min-w-full border-collapse bg-white" style={{ tableLayout: 'auto' }}>
              <thead>
                <tr className="bg-gray-100 print:bg-gray-200">
                  <th className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-gray-900 print:border-gray-800 whitespace-normal">
                    #
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-gray-900 print:border-gray-800 whitespace-normal">
                    {t('meeting.print.topic') || 'ومری موضوع'}
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-gray-900 print:border-gray-800 whitespace-normal">
                    {t('meeting.print.meeting_code') || 'د مجلس کوډ'}
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-gray-900 print:border-gray-800 whitespace-normal">
                    {t('meeting.print.date_range') || 'د نیټو سلسله'}
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-gray-900 print:border-gray-800 whitespace-normal">
                    {t('meeting.print.status') || 'حالت'}
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-gray-900 print:border-gray-800 whitespace-normal">
                    {t('meeting.print.created_by') || 'جوړونکی'}
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-gray-900 print:border-gray-800 whitespace-normal">
                    {t('meeting.print.members') || 'د مجلس غړي'}
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-gray-900 print:border-gray-800 whitespace-normal">
                    {t('meeting.print.description') || 'تفصیلات'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {meetings && meetings.length > 0 ? (
                  meetings.map((meeting, index) => (
                    <tr
                      key={meeting.id}
                      className={index % 2 === 0 ? 'bg-white print:bg-white' : 'bg-gray-50 print:bg-gray-100'}
                    >
                      <td className="border border-gray-300 px-3 py-2 text-center text-sm text-gray-900 print:border-gray-800 whitespace-normal break-words">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center text-sm text-gray-900 print:border-gray-800 whitespace-normal break-words">
                        {meeting.title}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center text-sm text-gray-900 print:border-gray-800 whitespace-normal break-words">
                        <span className="font-mono">{meeting.meeting_code || '-'}</span>
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center text-sm text-gray-900 print:border-gray-800 whitespace-normal break-words">
                        {meeting.start_date && meeting.end_date ? (
                          <>
                            {meeting.start_date} - {meeting.end_date}
                          </>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center text-sm text-gray-900 print:border-gray-800 whitespace-normal break-words">
                        {t(`meeting.status.${meeting.status}`) || meeting.status}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center text-sm text-gray-900 print:border-gray-800 whitespace-normal break-words">
                        {meeting.creator?.name || '-'}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center text-sm text-gray-900 print:border-gray-800 whitespace-normal break-words">
                        {meeting.members && meeting.members.length > 0 ? (
                          <div className="text-right">
                            {meeting.members.map((member, memberIndex) => (
                              <div key={memberIndex} className="text-xs">
                                {memberIndex + 1}. {member}
                              </div>
                            ))}
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-justify text-sm text-gray-900 print:border-gray-800 whitespace-normal break-words">
                        {meeting.description || '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="border border-gray-300 px-3 py-8 text-center text-sm text-gray-500 print:border-gray-800"
                    >
                      {t('meeting.print.no_meetings') || 'No meetings found in the selected date range.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-300 print:border-gray-600 print:mt-12">
          <div className="text-center text-sm text-gray-600 print:text-gray-800">
            <p className="flex items-center justify-center gap-2">
              <Calendar className="h-4 w-4" />
              {t('meeting.print.footer.generated_on') || 'Generated on'}: {new Date().toLocaleDateString('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit', calendar: 'persian' })}
            </p>
          </div>
        </div>
      </div>

      {/* Print-only styles */}
      <style>
        {`
        /* Screen-only styles */
        @media screen {
          .screen-only {
            display: block;
          }
        }

        @media print {
          /* Hide screen-only elements when printing */
          .screen-only {
            display: none !important;
          }

          /* Hide page elements */
          nav, header, footer, button {
            display: none !important;
          }
        }

        /* RTL styles */
        body {
          direction: rtl;
        }
        `}
      </style>
    </>
  );
}
