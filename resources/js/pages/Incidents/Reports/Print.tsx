import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, AlertTriangle, Calendar, Shield, User, MapPin, Clock, Users, Gavel, FileCheck, BookText, Building2, Lock, Tag, Info } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';
import { formatPersianDateOnly, formatPersianDateTime } from '@/lib/utils/date';
import QRCode from 'qrcode';


interface BarcodeData {
  report_number: string;
  report_id: number;
  date: string;
  security_level: string;
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
  }, [report.report_number, report.id]);

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
    <div className="print:max-w-none print:p-0 print:m-0" style={{ fontFamily: 'Arial, sans-serif' }}>
      <Head title={t('incident_reports.print.page_title', { number: report.report_number })} />
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
            {t('incident_reports.print.back_button')}
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
          <td className="pr-4">{formatPersianDateOnly(report.report_date)}</td>
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
                  <td className="pr-4 py-1">{formatPersianDateOnly(incident.incident_date)}</td>
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
      <div className="mt-8 pt-4 border-t border-gray-300 print:border-gray-600 print:mt-12">
        <div className="text-center text-sm text-gray-600 print:text-gray-800">
          <p className="flex items-center justify-center gap-2">
            <Calendar className="h-4 w-4" />
            {t('incident_reports.print.generated_on')}: {formatPersianDateTime(new Date().toISOString())}
          </p>
        </div>
      </div>
    </div>
  );
}
