import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { UserRound, Printer, FileText } from 'lucide-react';
import { router } from '@inertiajs/react';
import axios from 'axios';

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

interface Props {
  criminal: Criminal;
}

export default function CriminalPrint({ criminal }: Props) {
  useEffect(() => {
    // Create a report record when the component is mounted
    if (!criminal.report) {
      createReport();
    }

    // Auto-print when the component is mounted
    setTimeout(() => {
      window.print();
    }, 1000);
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
          criminal.report = response.data.report;
        }
      })
      .catch(error => {
        console.error('Error creating report:', error);
      });
  };

  // The report code to display
  const reportCode = criminal.report?.code || '------';

  return (
    <>
      <Head title={`Print: ${criminal.name}`} />

      {/* Print Button (visible only on screen) */}
      <div className="screen-only fixed top-4 right-4 z-50 p-4 bg-white shadow-lg rounded-lg">
        <button
          onClick={() => window.print()}
          className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Printer size={18} />
          <span>Print Document</span>
        </button>
      </div>

      <div className="print-container max-w-4xl mx-auto my-4 p-6 bg-white shadow-md print:shadow-none print:p-0 print:m-0 rounded-lg border border-gray-200">
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
          <div className="mb-2 border-b border-primary/20 pb-2">
            <div className="flex justify-between items-center">
              <div className="w-24 text-center">
                {criminal.department?.code && (
                  <div className="text-xs font-semibold text-neutral-500 border border-primary/20 rounded-md py-1 px-2">
                    {criminal.department.code}
                  </div>
                )}
              </div>
              <h1 className="text-2xl font-bold text-primary">د مجرمينو د تحقيق راپور</h1>
              <div className="w-24 text-center">
                <div className="text-xs font-semibold text-neutral-500 border border-primary/20 rounded-md py-1 px-2">
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

      {/* Print-only styles */}
      <style>{`
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

        /* Print styles */
        @media print {
          @page {
            size: A4;
            margin: 0.8cm;
          }

          body {
            font-family: 'Amiri', 'Traditional Arabic', 'Calibri', 'Arial', sans-serif;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
            background: none;
            font-size: 12px;
          }

          .print-container {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            background: none;
          }

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
          font-family: 'Amiri', 'Traditional Arabic', 'Arial', sans-serif;
          position: relative;
        }

        /* Corner decorations */
        .corner-decoration {
          position: absolute;
          width: 20px;
          height: 20px;
          z-index: 1;
        }

        .corner-decoration.top-left {
          top: 10px;
          left: 10px;
          border-top: 2px solid var(--primary-color, #3b82f6);
          border-left: 2px solid var(--primary-color, #3b82f6);
        }

        .corner-decoration.top-right {
          top: 10px;
          right: 10px;
          border-top: 2px solid var(--primary-color, #3b82f6);
          border-right: 2px solid var(--primary-color, #3b82f6);
        }

        .corner-decoration.bottom-left {
          bottom: 10px;
          left: 10px;
          border-bottom: 2px solid var(--primary-color, #3b82f6);
          border-left: 2px solid var(--primary-color, #3b82f6);
        }

        .corner-decoration.bottom-right {
          bottom: 10px;
          right: 10px;
          border-bottom: 2px solid var(--primary-color, #3b82f6);
          border-right: 2px solid var(--primary-color, #3b82f6);
        }

        /* Photo frame corners */
        .photo-frame-corner {
          position: absolute;
          width: 8px;
          height: 8px;
        }

        .photo-frame-corner.top-left {
          top: -2px;
          left: -2px;
          border-top: 2px solid var(--primary-color, #3b82f6);
          border-left: 2px solid var(--primary-color, #3b82f6);
        }

        .photo-frame-corner.top-right {
          top: -2px;
          right: -2px;
          border-top: 2px solid var(--primary-color, #3b82f6);
          border-right: 2px solid var(--primary-color, #3b82f6);
        }

        .photo-frame-corner.bottom-left {
          bottom: -2px;
          left: -2px;
          border-bottom: 2px solid var(--primary-color, #3b82f6);
          border-left: 2px solid var(--primary-color, #3b82f6);
        }

        .photo-frame-corner.bottom-right {
          bottom: -2px;
          right: -2px;
          border-bottom: 2px solid var(--primary-color, #3b82f6);
          border-right: 2px solid var(--primary-color, #3b82f6);
        }

        /* Investigation corners */
        .investigation-corner {
          position: absolute;
          width: 10px;
          height: 10px;
        }

        .investigation-corner.top-left {
          top: -2px;
          left: -2px;
          border-top: 2px solid var(--primary-color, #3b82f6);
          border-left: 2px solid var(--primary-color, #3b82f6);
        }

        .investigation-corner.top-right {
          top: -2px;
          right: -2px;
          border-top: 2px solid var(--primary-color, #3b82f6);
          border-right: 2px solid var(--primary-color, #3b82f6);
        }

        .investigation-corner.bottom-left {
          bottom: -2px;
          left: -2px;
          border-bottom: 2px solid var(--primary-color, #3b82f6);
          border-left: 2px solid var(--primary-color, #3b82f6);
        }

        .investigation-corner.bottom-right {
          bottom: -2px;
          right: -2px;
          border-bottom: 2px solid var(--primary-color, #3b82f6);
          border-right: 2px solid var(--primary-color, #3b82f6);
        }

        /* Enhanced compact info cells */
        .info-cell-compact {
          border-bottom: 1px solid rgba(59, 130, 246, 0.2);
          padding-bottom: 0.4rem;
          transition: all 0.2s ease;
        }

        .info-cell-compact:hover {
          border-color: var(--primary-color, #3b82f6);
          background-color: rgba(59, 130, 246, 0.03);
        }

        .info-cell-highlight-compact {
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-bottom: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 0.375rem;
          padding: 0.4rem;
          background-color: rgba(59, 130, 246, 0.05);
          transition: all 0.2s ease;
        }

        .info-cell-highlight-compact:hover {
          border-color: var(--primary-color, #3b82f6);
          background-color: rgba(59, 130, 246, 0.08);
        }

        /* Footer cells */
        .footer-cell-compact {
          border-top: 1px solid rgba(59, 130, 246, 0.3);
          padding-top: 0.4rem;
          text-align: center;
        }
      `}</style>
    </>
  );
}
