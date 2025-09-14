import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, User, Calendar, CheckCircle, Clock, Building2, Tag, FileCheck, Info } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';
import { formatPersianDateOnly, formatPersianDateTime } from '@/lib/utils/date';
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

interface Props {
  infoType: InfoType;
  infos: Info[];
  statCategories: StatCategory[];
}

export default function PrintInfoType({ infoType, infos, statCategories }: Props) {
  const { t } = useTranslation();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

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
  }, [infoType.name, infoType.id]);

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
          <Button
            onClick={handlePrint}
            size="lg"
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
          >
            <FileText className="h-4 w-4" />
            {t('info_types.print.print_button')}
          </Button>
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
            {t('info_types.print.generated_on')}: {formatPersianDateTime(new Date().toISOString())}
          </p>
        </div>
      </div>

    </div>
  );
}

