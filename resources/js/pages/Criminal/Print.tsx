import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { UserRound } from 'lucide-react';

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

interface Props {
  criminal: Criminal;
}

export default function CriminalPrint({ criminal }: Props) {
  useEffect(() => {
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

  return (
    <>
      <Head title={`Print: ${criminal.name}`} />

      {/* Print Button (visible only on screen) */}
      <div className="screen-only fixed top-4 right-4 z-50 p-4 bg-white shadow-md rounded-md">
        <button
          onClick={() => window.print()}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
        >
          Print Document
        </button>
      </div>

      <div className="print-container max-w-4xl mx-auto my-8 p-8 bg-white shadow-sm print:shadow-none print:p-0 print:m-0">
        {/* Page Header */}
        <div className="text-center mb-6 font-bold text-xl border-b pb-2">
          <h1 className="text-right">د مجرمينو د تحقيق راپور</h1>
        </div>

        {/* Main Content */}
        <div className="flex flex-col">
          {/* Top Row with Personal Info Headers */}
          <div className="grid grid-cols-5 gap-4 mb-4 text-right">
            <div className="border-b pb-2">
              <span className="font-bold text-neutral-700">د مجرم پېژندنه: نوم</span>
              <div className="mt-1 font-semibold">{criminal.name || ''}</div>
            </div>
            <div className="border-b pb-2">
              <span className="font-bold text-neutral-700">د پلار نوم:</span>
              <div className="mt-1">{criminal.father_name || ''}</div>
            </div>
            <div className="border-b pb-2">
              <span className="font-bold text-neutral-700">د نيکه نوم:</span>
              <div className="mt-1">{criminal.grandfather_name || ''}</div>
            </div>
            <div className="border-b pb-2">
              <span className="font-bold text-neutral-700">د تذکرې شماره:</span>
              <div className="mt-1">{criminal.id_card_number || ''}</div>
            </div>
            <div className="border-b pb-2">
              <span className="font-bold text-neutral-700">د تليفون شماره:</span>
              <div className="mt-1">{criminal.phone_number || ''}</div>
            </div>
          </div>

          {/* Second Row - Original Residence */}
          <div className="grid grid-cols-1 gap-4 mb-4 text-right">
            <div className="border-b pb-2">
              <span className="font-bold text-neutral-700">اصلي سكونت: ولایت، ولسوالى، كلى</span>
              <div className="mt-1">{criminal.original_residence || ''}</div>
            </div>
          </div>

          {/* Third Row - Current Residence */}
          <div className="grid grid-cols-1 gap-4 mb-4 text-right">
            <div className="border-b pb-2">
              <span className="font-bold text-neutral-700">فعلي سكونت: ولایت، ولسوالى، كلى</span>
              <div className="mt-1">{criminal.current_residence || ''}</div>
            </div>
          </div>

          {/* Fourth Row - Crime Type and Locations */}
          <div className="grid grid-cols-3 gap-4 mb-6 text-right">
            <div className="border-b pb-2">
              <span className="font-bold text-neutral-700">د نيولو نېټه:</span>
              <div className="mt-1">{formatDate(criminal.arrest_date)}</div>
            </div>
            <div className="border-b pb-2">
              <span className="font-bold text-neutral-700">د نيولو ځاى:</span>
              <div className="mt-1">{criminal.arrest_location || ''}</div>
            </div>
            <div className="border-b pb-2">
              <span className="font-bold text-neutral-700">د جرم نوعيت:</span>
              <div className="mt-1">{criminal.crime_type || ''}</div>
            </div>
          </div>

          {/* Photo Box Section */}
          <div className="grid grid-cols-10 gap-6 my-8">
            {/* Left side - Photo */}
            <div className="col-span-3 border-2 border-black h-60 flex items-center justify-center overflow-hidden">
              {criminal.photo ? (
                <img
                  src={`/storage/${criminal.photo}`}
                  alt={criminal.name}
                  className="max-h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full w-full">
                  <UserRound className="h-16 w-16 text-neutral-300 mb-2" />
                  <div className="text-center text-xl font-bold text-neutral-500">عکس</div>
                </div>
              )}
            </div>

            {/* Right side - Investigation details */}
            <div className="col-span-7 flex flex-col">
              <div className="text-right mb-2">
                <span className="font-bold text-neutral-700">د تحقيق موضوع او لنډيز:</span>
              </div>

              <div className="border-2 border-black rounded-md p-6 flex-grow flex flex-col min-h-[300px]">
                <div className="text-right mb-2 flex justify-between">
                  <span className="font-bold text-neutral-700">د تحقيق متن:</span>
                  <span className="font-bold text-neutral-700">د ثبت شماره: <span className="font-normal">{criminal.number || '............'}</span></span>
                </div>
                <div className="text-center my-4">
                  <span className="font-bold text-xl">بسم الله الرحمن الرحيم</span>
                </div>
                <div className="text-right mb-4">
                  <span className="font-bold text-neutral-700">نېټه: {formatDate(criminal.arrest_date) || '   /   /   '}</span>
                </div>

                {/* Content Area for Investigation */}
                <div className="flex-grow my-4">
                  {criminal.final_verdict && (
                    <div className="text-right mb-4">
                      <p className="whitespace-pre-wrap text-neutral-800">{criminal.final_verdict}</p>
                    </div>
                  )}

                  {criminal.notes && (
                    <div className="text-right mt-4">
                      <p className="whitespace-pre-wrap text-neutral-800">{criminal.notes}</p>
                    </div>
                  )}

                  {!criminal.final_verdict && !criminal.notes && (
                    <div className="h-32"></div> /* Empty space for handwritten notes */
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div className="grid grid-cols-2 gap-8 mt-8">
            <div className="border-t-2 border-black pt-2 text-center">
              <span className="font-bold text-neutral-700">د تحقيق كوونكي كس نوم:</span>
              <span className="mx-2">{criminal.creator?.name || ''}</span>
            </div>
            <div className="border-t-2 border-black pt-2 text-center">
              <span className="font-bold text-neutral-700">د تحقيق د مدير امضاء</span>
              <div className="h-10"></div> {/* Space for signature */}
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
          }
        }

        /* Print styles */
        @media print {
          @page {
            size: A4;
            margin: 1cm;
          }

          body {
            font-family: 'Traditional Arabic', 'Calibri', 'Arial', sans-serif;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
            background: none;
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
      `}</style>
    </>
  );
}
