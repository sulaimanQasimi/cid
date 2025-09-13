import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';
import { formatPersianDateOnly, formatPersianDateTime } from '@/lib/utils/date';
import QRCode from 'qrcode';

interface NationalInsightCenterInfo {
    id: number;
    name: string;
    code: string | null;
    description: string | null;
    confirmed: boolean;
    confirmed_at: string | null;
    created_at: string;
    updated_at: string;
    creator?: {
        id: number;
        name: string;
        department?: {
            id: number;
            name: string;
        };
    };
    confirmer?: {
        id: number;
        name: string;
    };
    infoStats?: Array<{
        id: number;
        string_value: string;
        notes: string | null;
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
    }>;
}

interface InfoItem {
    id: number;
    title: string;
    registration_number: string | null;
    description: string | null;
    date: string;
    confirmed: boolean;
    created_at: string;
    info_category?: {
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
}

interface Props {
    nationalInsightCenterInfo: NationalInsightCenterInfo;
    infos: InfoItem[];
}

export default function NationalInsightCenterInfoPrint({
    nationalInsightCenterInfo,
    infos
}: Props) {
    const { t } = useTranslation();
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

    useEffect(() => {
        const generateQRCode = async () => {
            try {
                const qrData = nationalInsightCenterInfo.code || nationalInsightCenterInfo.id.toString();
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
    }, [nationalInsightCenterInfo.code, nationalInsightCenterInfo.id]);

    const handlePrint = () => {
        window.print();
    };

    const handleBack = () => {
        window.history.back();
    };

    return (
        <div className="print:max-w-none print:p-0 print:m-0" style={{ fontFamily: 'Arial, sans-serif' }}>
            <Head title={t('national_insight_center_info.print.title', { name: nationalInsightCenterInfo.name })} />
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
                        {t('national_insight_center_info.print.back_button')}
                    </Button>
                    <Button
                        onClick={handlePrint}
                        size="lg"
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
                    >
                        <FileText className="h-4 w-4" />
                        {t('national_insight_center_info.print.print_button')}
                    </Button>
                </div>
            </div>
            <div className="print:page-break-inside-avoid relative">
                <h1 className="text-2xl font-bold text-black text-center mb-2">{t('national_insight_center_info.print.header_title')}</h1>
                <h2 className="text-xl font-semibold text-black text-center pt-2 mb-4">{nationalInsightCenterInfo.name}</h2>
                
                {qrCodeDataUrl && (
                    <div className="absolute top-0 right-0 print:top-0 print:right-0">
                        <div className="text-center">
                            <img 
                                src={qrCodeDataUrl} 
                                alt="QR Code" 
                                className="w-24 h-24 print:w-20 print:h-20 border border-gray-300 print:border-gray-600"
                            />
                            <p className="text-xs text-gray-600 print:text-gray-800 mt-1">
                                {nationalInsightCenterInfo.code || nationalInsightCenterInfo.id}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <table className="w-full mt-4 print:text-xs" style={{ borderCollapse: 'collapse' }}>
                <tr className="text-sm border-b border-gray-900 print:border-gray-800">
                    <th className="text-left pr-2 font-semibold">{t('national_insight_center_info.print.code')}:</th>
                    <td className="pr-4">{nationalInsightCenterInfo.code}</td>
                    <th className="text-left pr-2 font-semibold">{t('national_insight_center_info.print.status')}:</th>
                    <td className="pr-4">{nationalInsightCenterInfo.confirmed ? t('national_insight_center_info.confirmed') : t('national_insight_center_info.pending')}</td>
                    <th className="text-left pr-2 font-semibold">{t('national_insight_center_info.print.created_at')}:</th>
                    <td className="pr-4">{formatPersianDateOnly(nationalInsightCenterInfo.created_at)}</td>
                </tr>
                <tr className="text-sm border-b border-gray-900 print:border-gray-800">
                    <th className="text-left pr-2 font-semibold">{t('national_insight_center_info.print.created_by')}:</th>
                    <td className="pr-4">{nationalInsightCenterInfo.creator?.name}</td>
                    <th className="text-left pr-2 font-semibold">{t('national_insight_center_info.print.confirmed_by')}:</th>
                    <td className="pr-4">{nationalInsightCenterInfo.confirmer?.name || '-'}</td>
                    <th className="text-left pr-2 font-semibold">{t('national_insight_center_info.print.confirmed_at')}:</th>
                    <td className="pr-4">{nationalInsightCenterInfo.confirmed_at ? formatPersianDateOnly(nationalInsightCenterInfo.confirmed_at) : '-'}</td>
                </tr>
                <tr className="text-sm pt-2 py-2">
                    <th className="text-left pr-2 font-semibold">{t('national_insight_center_info.print.info.department')}:</th>
                    <td colSpan={5}>{nationalInsightCenterInfo.creator?.department?.name || '-'}</td>
                </tr>
            </table>
            <hr className="my-4 border-gray-900 print:border-gray-800" />
            {infos.map((info, index) => (
                <div key={info.id} className="mt-4 print:page-break-inside-avoid">
                    <div className="pt-4 mb-2">
                        <h3 className="text-lg font-semibold text-black mb-2">
                            {index + 1}. {info.title}
                        </h3>
                    </div>

                    <table className="w-full print:text-xs" style={{ borderCollapse: 'collapse' }}>
                        <tr className="border-b border-gray-300 print:border-gray-600">
                            <th className="text-left pr-2 font-semibold py-1">{t('national_insight_center_info.print.info.info_category')}:</th>
                            <td className="pr-4 py-1">{info.info_category?.name || '-'}</td>
                            <th className="text-left pr-2 font-semibold py-1">{t('national_insight_center_info.print.info.department')}:</th>
                            <td className="pr-4 py-1">{info.department?.name || '-'}</td>
                            <th className="text-left pr-2 font-semibold py-1">{t('national_insight_center_info.print.info.creator')}:</th>
                            <td className="pr-4 py-1">{info.creator?.name || '-'}</td>
                        </tr>
                        <tr className="border-b border-gray-300 print:border-gray-600">
                            <th className="text-left pr-2 font-semibold py-1">{t('national_insight_center_info.print.info.confirmed')}:</th>
                            <td className="pr-4 py-1">{info.confirmed ? t('national_insight_center_info.print.info.confirmed') : t('national_insight_center_info.print.info.pending')}</td>
                            <th className="text-left pr-2 font-semibold py-1">{t('national_insight_center_info.print.info.created_at')}:</th>
                            <td className="pr-4 py-1">{formatPersianDateOnly(info.created_at)}</td>
                            <th className="text-left pr-2 font-semibold py-1">{t('national_insight_center_info.print.registration_number')}:</th>
                            <td className="pr-4 py-1">{info.registration_number || '-'}</td>
                        </tr>
                    </table>

                    {info.description && (
                        <div className="mt-3 p-3 bg-gray-50 print:bg-white print:border print:border-gray-300 rounded">
                            <h4 className="font-semibold text-black mb-2">{t('national_insight_center_info.print.description')}:</h4>
                            <p className="text-sm text-justify leading-relaxed">{info.description}</p>
                        </div>
                    )}

                    {index < infos.length - 1 && <hr className="my-4 border-gray-300 print:border-gray-600" />}
                </div>
            ))}

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-gray-300 print:border-gray-600 print:mt-12">
                <div className="text-center text-sm text-gray-600 print:text-gray-800">
                    <p>{t('national_insight_center_info.print.footer.generated_on')}: {formatPersianDateTime(new Date().toISOString())}</p>
                </div>
            </div>

        </div>
    );
}
