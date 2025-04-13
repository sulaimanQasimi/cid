import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { UserRound, Printer, FileText, Palette, Type, Settings, X, Layout } from 'lucide-react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';

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
  report?: {
    id: number;
    code: string;
    properties: any;
    created_at: string;
  } | null;
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
}

interface Props {
  criminal: Criminal;
}

export default function CriminalPrint({ criminal }: Props) {
  // State to track the report code
  const [reportCode, setReportCode] = useState<string>('------');
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
    margins: 'normal'
  });

  useEffect(() => {
    // Create a report record immediately when the component is mounted
    createReport();

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

  // Format the date (handling null)
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'yyyy/MM/dd');
    } catch (e) {
      return '';
    }
  };

  // Create a report for this criminal
  const createReport = () => {
    const reportData = {
      reportable_type: 'App\\Models\\Criminal',
      reportable_id: criminal.id,
      user_id: criminal.created_by,
      properties: {
        date: new Date().toISOString(),
        criminal_data: {
          name: criminal.name,
          father_name: criminal.father_name,
          grandfather_name: criminal.grandfather_name,
          id_card_number: criminal.id_card_number,
          phone_number: criminal.phone_number,
          original_residence: criminal.original_residence,
          current_residence: criminal.current_residence,
          crime_type: criminal.crime_type,
          arrest_location: criminal.arrest_location,
          arrest_date: criminal.arrest_date,
          final_verdict: criminal.final_verdict,
          notes: criminal.notes,
        }
      }
    };

    // Use POST method directly with axios
    axios.post('/reports', reportData)
      .then(response => {
        if (response.data && response.data.report) {
          // Update local state instead of reloading the page
          setReportCode(response.data.report.code);
        }
      })
      .catch(error => {
        console.error('Error creating report:', error);
      });
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

      /* Corner decorations */
      .corner-decoration.top-left {
        border-top: 2px solid ${settings.accentColor};
        border-left: 2px solid ${settings.accentColor};
      }

      .corner-decoration.top-right {
        border-top: 2px solid ${settings.accentColor};
        border-right: 2px solid ${settings.accentColor};
      }

      .corner-decoration.bottom-left {
        border-bottom: 2px solid ${settings.accentColor};
        border-left: 2px solid ${settings.accentColor};
      }

      .corner-decoration.bottom-right {
        border-bottom: 2px solid ${settings.accentColor};
        border-right: 2px solid ${settings.accentColor};
      }

      /* Photo frame corners */
      .photo-frame-corner.top-left {
        border-top: 2px solid ${settings.accentColor};
        border-left: 2px solid ${settings.accentColor};
      }

      .photo-frame-corner.top-right {
        border-top: 2px solid ${settings.accentColor};
        border-right: 2px solid ${settings.accentColor};
      }

      .photo-frame-corner.bottom-left {
        border-bottom: 2px solid ${settings.accentColor};
        border-left: 2px solid ${settings.accentColor};
      }

      .photo-frame-corner.bottom-right {
        border-bottom: 2px solid ${settings.accentColor};
        border-right: 2px solid ${settings.accentColor};
      }

      /* Investigation corners */
      .investigation-corner.top-left {
        border-top: 2px solid ${settings.accentColor};
        border-left: 2px solid ${settings.accentColor};
      }

      .investigation-corner.top-right {
        border-top: 2px solid ${settings.accentColor};
        border-right: 2px solid ${settings.accentColor};
      }

      .investigation-corner.bottom-left {
        border-bottom: 2px solid ${settings.accentColor};
        border-left: 2px solid ${settings.accentColor};
      }

      .investigation-corner.bottom-right {
        border-bottom: 2px solid ${settings.accentColor};
        border-right: 2px solid ${settings.accentColor};
      }

      /* Enhanced compact info cells */
      .info-cell-compact {
        border-bottom: 1px solid ${settings.accentColor}30;
      }

      .info-cell-compact:hover {
        border-color: ${settings.accentColor};
        background-color: ${settings.accentColor}05;
      }

      .info-cell-highlight-compact {
        border: 1px solid ${settings.accentColor}20;
        border-bottom: 1px solid ${settings.accentColor}30;
        background-color: ${settings.accentColor}05;
      }

      .info-cell-highlight-compact:hover {
        border-color: ${settings.accentColor};
        background-color: ${settings.accentColor}08;
      }

      /* Footer cells */
      .footer-cell-compact {
        border-top: 1px solid ${settings.accentColor}30;
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

  return (
    <>
      <Head title={`Print: ${criminal.name}`} />

      {/* Dynamic styles - this will be managed by JavaScript */}
      <style id="dynamic-print-styles"></style>

      {/* Print Settings Modal */}
      {showSettingsModal && (
        <div className="screen-only fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Print Settings
              </h2>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Colors Section */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <Palette className="mr-2 h-5 w-5 text-primary" />
                  <h3 className="text-md font-medium">Colors</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Header Color
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
                      Text Color
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
                      Accent Color
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

              {/* Typography Section */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <Type className="mr-2 h-5 w-5 text-primary" />
                  <h3 className="text-md font-medium">Typography</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Font Family
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
                      Font Size
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

              {/* Layout Section */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <Layout className="mr-2 h-5 w-5 text-primary" />
                  <h3 className="text-md font-medium">Layout</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Page Size
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
                      Orientation
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
                      Margins
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
            </div>

            <div className="border-t px-4 py-3 flex justify-end space-x-3">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 bg-primary border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Apply
              </button>
              <button
                onClick={() => {
                  setShowSettingsModal(false);
                  setTimeout(() => window.print(), 300);
                }}
                className="px-4 py-2 bg-primary border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Apply & Print
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
            <span>Format</span>
          </button>
          <button
            onClick={() => window.print()}
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Printer size={18} />
            <span>Print Document</span>
          </button>
        </div>
      </div>

      <div
        className="print-container max-w-4xl mx-auto my-4 p-6 bg-white shadow-md print:shadow-none print:p-0 print:m-0 rounded-lg border border-gray-200"
        style={{
          color: printSettings.textColor,
          fontFamily: printSettings.fontFamily,
          fontSize: `${printSettings.fontSize}px`,
        }}
      >
        {/* Decorative background pattern - only visible on screen */}
        <div className="screen-only absolute inset-0 overflow-hidden opacity-5 pointer-events-none z-0">
          <div className="pattern-bg"></div>
        </div>

        {/* Corner decorations */}
        <div className="corner-decoration top-left"></div>
        <div className="corner-decoration top-right"></div>
        <div className="corner-decoration bottom-left"></div>
        <div className="corner-decoration bottom-right"></div>

        {/* Page Header */}
        <div className="text-center mb-4 relative z-10">
          <div className="mb-2 border-b pb-2" style={{ borderColor: `${printSettings.accentColor}20` }}>
            <div className="flex justify-between items-center">
              <div className="w-24 text-center">
                {criminal.department?.code && (
                  <div className="text-xs font-semibold text-neutral-500 border rounded-md py-1 px-2"
                       style={{ borderColor: `${printSettings.accentColor}20` }}>
                    {criminal.department.code}
                  </div>
                )}
              </div>
              <h1 className="text-2xl font-bold" style={{ color: printSettings.accentColor }}>د مجرمينو د تحقيق راپور</h1>
              <div className="w-24 text-center">
                <div className="text-xs font-semibold text-neutral-500 border rounded-md py-1 px-2"
                     style={{ borderColor: `${printSettings.accentColor}20` }}>
                  {formatDate(criminal.created_at)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col relative z-10">
          {/* Top Row with Photo and Personal Info */}
          <div className="flex flex-row mb-4">
            {/* Right side - Personal Details */}
            <div className="w-3/4 pl-4">
              {/* Personal Info Headers */}
              <div className="grid grid-cols-4 gap-2 mb-3 text-right">
                <div className="info-cell-compact">
                  <span className="font-bold text-neutral-700 block mb-1 text-sm">د مجرم پېژندنه: نوم</span>
                  <div className="font-semibold">{criminal.name || ''}</div>
                </div>
                <div className="info-cell-compact">
                  <span className="font-bold text-neutral-700 block mb-1 text-sm">د پلار نوم:</span>
                  <div>{criminal.father_name || ''}</div>
                </div>
                <div className="info-cell-compact">
                  <span className="font-bold text-neutral-700 block mb-1 text-sm">د نيکه نوم:</span>
                  <div>{criminal.grandfather_name || ''}</div>
                </div>
                <div className="info-cell-compact">
                  <span className="font-bold text-neutral-700 block mb-1 text-sm">د تذکرې شماره:</span>
                  <div className="font-mono">{criminal.id_card_number || ''}</div>
                </div>
              </div>

              {/* Phone Number */}
              <div className="grid grid-cols-1 gap-2 mb-3 text-right">
                <div className="info-cell-compact">
                  <span className="font-bold text-neutral-700 block mb-1 text-sm">د تليفون شماره:</span>
                  <div className="font-mono">{criminal.phone_number || ''}</div>
                </div>
              </div>
            </div>

            {/* Right side - Photo */}
            <div className="w-1/4 pl-2">
              <div className="border-2 border-gray-300 rounded-lg h-40 flex items-center justify-center overflow-hidden bg-gray-50 shadow-inner relative">
                {criminal.photo ? (
                  <img
                    src={`/storage/${criminal.photo}`}
                    alt={criminal.name}
                    className="max-h-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full w-full">
                    <UserRound className="h-16 w-16 text-neutral-300 mb-1" />
                    <div className="text-center text-base font-bold text-neutral-400">عکس</div>
                  </div>
                )}
                <div className="photo-frame-corner top-left"></div>
                <div className="photo-frame-corner top-right"></div>
                <div className="photo-frame-corner bottom-left"></div>
                <div className="photo-frame-corner bottom-right"></div>
              </div>

              <div className="mt-2 text-center">
                <div className="text-xs font-semibold text-neutral-700 bg-gray-100 py-1 px-2 rounded-full inline-flex items-center">
                  <FileText size={12} className="mr-1" />
                  <span>شمارهٔ ثبت: {reportCode}</span>
                </div>
              </div>

              {/* QR Code for Report */}
              <div className="mt-2 flex justify-center">
                <div className="bg-white p-1 border border-gray-200 rounded-md shadow-sm">
                  <QRCodeSVG
                    value={reportCode !== '------' ? `https://cid.test/reports/${reportCode}` : ''}
                    size={80}
                    bgColor={"#ffffff"}
                    fgColor={"#000000"}
                    level={"L"}
                    includeMargin={false}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Second Row - Original Residence */}
          <div className="grid grid-cols-1 gap-2 mb-3 text-right">
            <div className="info-cell-compact">
              <span className="font-bold text-neutral-700 block mb-1 text-sm">اصلي سكونت: ولایت، ولسوالى، كلى</span>
              <div>{criminal.original_residence || ''}</div>
            </div>
          </div>

          {/* Third Row - Current Residence */}
          <div className="grid grid-cols-1 gap-2 mb-3 text-right">
            <div className="info-cell-compact">
              <span className="font-bold text-neutral-700 block mb-1 text-sm">فعلي سكونت: ولایت، ولسوالى، كلى</span>
              <div>{criminal.current_residence || ''}</div>
            </div>
          </div>

          {/* Fourth Row - Crime Type and Locations */}
          <div className="grid grid-cols-3 gap-3 mb-4 text-right">
            <div className="info-cell-highlight-compact">
              <span className="font-bold text-neutral-700 block mb-1 text-sm">د نيولو نېټه:</span>
              <div>{formatDate(criminal.arrest_date)}</div>
            </div>
            <div className="info-cell-highlight-compact">
              <span className="font-bold text-neutral-700 block mb-1 text-sm">د نيولو ځاى:</span>
              <div>{criminal.arrest_location || ''}</div>
            </div>
            <div className="info-cell-highlight-compact">
              <span className="font-bold text-neutral-700 block mb-1 text-sm">د جرم نوعيت:</span>
              <div>{criminal.crime_type || ''}</div>
            </div>
          </div>

          {/* Investigation Section */}
          <div className="mb-4">
            <div className="text-right mb-2 flex items-center gap-2 justify-end">
              <span className="font-bold text-base text-primary">د تحقيق موضوع او لنډيز:</span>
              <div className="w-1/4 h-px bg-primary/30"></div>
            </div>

            <div className="border-2 border-gray-300 rounded-lg p-4 flex-grow flex flex-col min-h-[250px] bg-white shadow relative">
              <div className="investigation-corner top-left"></div>
              <div className="investigation-corner top-right"></div>
              <div className="investigation-corner bottom-left"></div>
              <div className="investigation-corner bottom-right"></div>

              <div className="text-center mb-3">
                <span className="font-bold text-xl text-primary">بسم الله الرحمن الرحيم</span>
              </div>

              <div className="text-right mb-3">
                <span className="font-bold text-neutral-700 text-sm">نېټه: {formatDate(criminal.arrest_date) || '   /   /   '}</span>
              </div>

              {/* Content Area for Investigation */}
              <div className="flex-grow">
                {criminal.final_verdict && (
                  <div className="text-right mb-3">
                    <h3 className="font-bold text-base mb-1 text-primary">نهايي حكم</h3>
                    <p className="whitespace-pre-wrap text-neutral-800 leading-normal text-sm">{criminal.final_verdict}</p>
                  </div>
                )}

                {criminal.notes && (
                  <div className="text-right mt-3">
                    <h3 className="font-bold text-base mb-1 text-primary">يادداشتونه</h3>
                    <p className="whitespace-pre-wrap text-neutral-800 leading-normal text-sm">{criminal.notes}</p>
                  </div>
                )}

                {!criminal.final_verdict && !criminal.notes && (
                  <div className="h-28 border-dashed border-2 border-gray-200 rounded-lg p-2 flex items-center justify-center text-gray-400">
                    <p className="text-sm">د معلوماتو لپاره ځای</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="footer-cell-compact">
              <span className="font-bold text-neutral-700 block mb-1 text-sm">د تحقيق كوونكي كس نوم:</span>
              <span>{criminal.creator?.name || ''}</span>
            </div>
            <div className="footer-cell-compact">
              <span className="font-bold text-neutral-700 block mb-1 text-sm">د تحقيق د مدير امضاء</span>
              <div className="h-10 border-dashed border-2 border-gray-200 rounded-lg mt-1 flex items-center justify-center text-gray-400 text-xs">
                د امضاء ځای
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print-only styles - just keep the basic styles that don't change with settings */}
      <style>
        {`
        /* Screen-only styles */
        @media screen {
          .print-container {
            border: 1px solid #e5e7eb;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            position: relative;
            overflow: hidden;
          }

          .pattern-bg {
            background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000000' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
            position: absolute;
            width: 200%;
            height: 200%;
            top: -50%;
            left: -50%;
            transform: rotate(30deg);
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

        /* Custom styles for better typography */
        .print-container {
          position: relative;
        }

        /* Corner decorations */
        .corner-decoration {
          position: absolute;
          width: 20px;
          height: 20px;
          z-index: 1;
        }

        /* Photo frame corners */
        .photo-frame-corner {
          position: absolute;
          width: 8px;
          height: 8px;
        }

        /* Investigation corners */
        .investigation-corner {
          position: absolute;
          width: 10px;
          height: 10px;
        }
        `}
      </style>
    </>
  );
}
