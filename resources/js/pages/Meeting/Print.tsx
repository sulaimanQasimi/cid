import React from 'react';
import { Head } from '@inertiajs/react';
import { useTranslation } from '@/lib/i18n/translate';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer } from 'lucide-react';
import PersianDateDisplay from '@/components/ui/PersianDateDisplay';

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

interface MeetingPrintProps {
  meeting: Meeting;
}

export default function Print({ meeting }: MeetingPrintProps) {
  const { t } = useTranslation();

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    window.history.back();
  };


  return (
    <div className="print:m-0 print:max-w-none print:p-0" style={{ fontFamily: 'Amiri, serif', direction: 'rtl' }}>
      <Head title={t('meeting.print.title') || 'د مجلس راپور'} />
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
          
          @media print {
              @page {
                  size: A4 portrait;
                  margin: 2cm 2.5cm;
              }
              body {
                  font-size: 12px;
                  line-height: 1.8;
                  font-family: 'Amiri', serif !important;
                  direction: rtl;
              }
              * {
                  font-family: 'Amiri', serif !important;
              }
              .print\\:hidden {
                  display: none !important;
              }
              .print\\:border-gray-800 {
                  border-color: #1f2937 !important;
              }
              .print\\:page-break-inside-avoid {
                  page-break-inside: avoid;
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
            {t('common.back') || 'Back'}
          </Button>
          <Button onClick={handlePrint} size="lg" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700">
            <Printer className="h-4 w-4" />
            {t('common.print') || 'Print'}
          </Button>
        </div>
      </div>

      <div className="print:page-break-inside-avoid relative mx-auto max-w-4xl px-4">
        {/* Header Section */}
        <div className="mb-8 border-b-2 border-gray-300 pb-6 print:border-gray-800">
          <div className="relative mb-6 flex items-start justify-between">
            {/* Left Logo/Seal */}
            <div className="flex-shrink-0">
              <div className="h-24 w-24 rounded-full border-4 border-gray-800 print:border-gray-800 flex items-center justify-center bg-white">
                <div className="text-center text-xs font-bold">
                  <div className="mb-1">د افغانستان</div>
                  <div>اسلامی امارت</div>
                </div>
              </div>
            </div>

            {/* Center Title */}
            <div className="flex-1 text-center">
              <h1 className="mb-2 text-2xl font-bold text-gray-900 print:text-xl">
                {t('meeting.print.government_name') || 'د افغانستان اسلامی امارت'}
              </h1>
              <h2 className="mb-1 text-xl font-semibold text-gray-800 print:text-lg">
                {t('meeting.print.ministry_name') || 'د ملي دفاع وزارت'}
              </h2>
              <h3 className="mb-1 text-lg font-medium text-gray-700 print:text-base">
                {t('meeting.print.directorate_name') || 'د استخباراتو معینیت'}
              </h3>
              <h4 className="text-base font-medium text-gray-600 print:text-sm">
                {t('meeting.print.office_management') || 'د دفتر مدیریت'}
              </h4>
            </div>

            {/* Right Meeting Number */}
            <div className="flex-shrink-0 text-left">
              <div className="text-lg font-bold text-gray-900 print:text-base">
                {t('meeting.print.meeting_number') || 'مجلس گڼه'}: {meeting.id}
              </div>
              {meeting.created_at && (
                <div className="mt-2 text-sm text-gray-700 print:text-xs">
                  {t('meeting.print.date') || 'نېټه'}: <PersianDateDisplay date={meeting.created_at} /> {t('meeting.print.hijri') || 'هـ ق'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-8">
          {/* Topic Title */}
          <div className="mb-6">
            <h2 className="mb-4 text-xl font-bold text-gray-900 print:text-lg border-b border-gray-300 print:border-gray-800 pb-2">
              {t('meeting.print.topic') || 'ومری موضوع'}
            </h2>
            <p className="text-lg font-semibold text-gray-800 print:text-base mb-4 leading-relaxed">
              {meeting.title}
            </p>
          </div>

          {/* Description */}
          {meeting.description && (
            <div className="mb-6">
              <p className="text-base text-gray-700 print:text-sm leading-relaxed whitespace-pre-wrap">
                {meeting.description}
              </p>
            </div>
          )}

          {/* Meeting Details */}
          <div className="mb-6 space-y-4">
            {meeting.start_date && meeting.end_date && (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800 print:text-sm">
                  {t('meeting.print.date_range') || 'د نیټو سلسله'}:
                </span>
                <span className="text-gray-700 print:text-sm">
                  <PersianDateDisplay date={meeting.start_date} /> - <PersianDateDisplay date={meeting.end_date} />
                </span>
              </div>
            )}

            {meeting.meeting_code && (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800 print:text-sm">
                  {t('meeting.print.meeting_code') || 'د مجلس کوډ'}:
                </span>
                <span className="font-mono text-gray-700 print:text-sm">{meeting.meeting_code}</span>
              </div>
            )}

            {meeting.status && (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800 print:text-sm">
                  {t('meeting.print.status') || 'حالت'}:
                </span>
                <span className="text-gray-700 print:text-sm">
                  {t(`meeting.status.${meeting.status}`) || meeting.status}
                </span>
              </div>
            )}

            {meeting.creator && (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800 print:text-sm">
                  {t('meeting.print.created_by') || 'جوړونکی'}:
                </span>
                <span className="text-gray-700 print:text-sm">{meeting.creator.name}</span>
              </div>
            )}
          </div>

          {/* Members Section */}
          {meeting.members && meeting.members.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 text-lg font-bold text-gray-900 print:text-base border-b border-gray-300 print:border-gray-800 pb-2">
                {t('meeting.print.members') || 'د مجلس غړي'}
              </h3>
              <div className="space-y-2">
                {meeting.members.map((member, index) => (
                  <div key={index} className="flex items-start gap-2 text-base text-gray-700 print:text-sm">
                    <span className="font-semibold">{index + 1}.</span>
                    <span>{member}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resolution Section */}
          <div className="mt-8">
            <h3 className="mb-4 text-lg font-bold text-gray-900 print:text-base border-b border-gray-300 print:border-gray-800 pb-2">
              {t('meeting.print.resolution') || 'د مجلس پرېکړه'}
            </h3>
            <div className="space-y-3 text-base text-gray-700 print:text-sm leading-relaxed">
              <p>
                {t('meeting.print.resolution_text') || 'د یادو موضوعاتو په اړه د مجلس پرېکړه د پورتنیو شرایطو سره سم ترسره کړئ.'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 border-t-2 border-gray-300 print:border-gray-800 pt-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600 print:text-xs">
              {t('meeting.print.duration') || 'د ترسره کیدو موده'}: <span className="font-semibold">{t('meeting.print.urgent') || 'عاجل'}</span>
            </div>
            <div className="text-sm text-gray-600 print:text-xs">
              {t('meeting.print.printed_at') || 'چاپ شوی'}: <PersianDateDisplay date={new Date().toISOString().split('T')[0]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
