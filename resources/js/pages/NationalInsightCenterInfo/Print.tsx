import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import LogoHeader from '@/components/ui/logoheader';
import { ArrowLeft, FileText, User, Calendar, CheckCircle, Clock, Building2, Tag, FileCheck, BarChart3, Info } from 'lucide-react';
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
    item_stats?: Array<{
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
                <LogoHeader title={nationalInsightCenterInfo.name} />
                
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
                    <th className="text-left pr-2 font-semibold flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {t('national_insight_center_info.print.code')}:
                    </th>
                    <td className="pr-4">{nationalInsightCenterInfo.code}</td>
                    <th className="text-left pr-2 font-semibold flex items-center gap-1">
                        {nationalInsightCenterInfo.confirmed ? <CheckCircle className="h-3 w-3 text-green-600" /> : <Clock className="h-3 w-3 text-yellow-600" />}
                        {t('national_insight_center_info.print.status')}:
                    </th>
                    <td className="pr-4">{nationalInsightCenterInfo.confirmed ? t('national_insight_center_info.confirmed') : t('national_insight_center_info.pending')}</td>
                    <th className="text-left pr-2 font-semibold flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {t('national_insight_center_info.print.created_at')}:
                    </th>
                    <td className="pr-4">{formatPersianDateOnly(nationalInsightCenterInfo.created_at)}</td>
                </tr>
                <tr className="text-sm border-b border-gray-900 print:border-gray-800">
                    <th className="text-left pr-2 font-semibold flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {t('national_insight_center_info.print.created_by')}:
                    </th>
                    <td className="pr-4">{nationalInsightCenterInfo.creator?.name}</td>
                    <th className="text-left pr-2 font-semibold flex items-center gap-1">
                        <FileCheck className="h-3 w-3" />
                        {t('national_insight_center_info.print.confirmed_by')}:
                    </th>
                    <td className="pr-4">{nationalInsightCenterInfo.confirmer?.name || '-'}</td>
                    <th className="text-left pr-2 font-semibold flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {t('national_insight_center_info.print.confirmed_at')}:
                    </th>
                    <td className="pr-4">{nationalInsightCenterInfo.confirmed_at ? formatPersianDateOnly(nationalInsightCenterInfo.confirmed_at) : '-'}</td>
                </tr>
                <tr className="text-sm pt-2 py-2">
                    <th className="text-left pr-2 font-semibold flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {t('national_insight_center_info.print.info.department')}:
                    </th>
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
                            <th className="text-left pr-2 font-semibold py-1 flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                {t('national_insight_center_info.print.info.info_category')}:
                            </th>
                            <td className="pr-4 py-1">{info.info_category?.name || '-'}</td>
                            <th className="text-left pr-2 font-semibold py-1 flex items-center gap-1">
                                <Building2 className="h-3 w-3" />
                                {t('national_insight_center_info.print.info.department')}:
                            </th>
                            <td className="pr-4 py-1">{info.department?.name || '-'}</td>
                            <th className="text-left pr-2 font-semibold py-1 flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {t('national_insight_center_info.print.info.creator')}:
                            </th>
                            <td className="pr-4 py-1">{info.creator?.name || '-'}</td>
                        </tr>
                        <tr className="border-b border-gray-300 print:border-gray-600">
                            <th className="text-left pr-2 font-semibold py-1 flex items-center gap-1">
                                {info.confirmed ? <CheckCircle className="h-3 w-3 text-green-600" /> : <Clock className="h-3 w-3 text-yellow-600" />}
                                {t('national_insight_center_info.print.info.confirmed')}:
                            </th>
                            <td className="pr-4 py-1">{info.confirmed ? t('national_insight_center_info.print.info.confirmed') : t('national_insight_center_info.print.info.pending')}</td>
                            <th className="text-left pr-2 font-semibold py-1 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {t('national_insight_center_info.print.info.created_at')}:
                            </th>
                            <td className="pr-4 py-1">{formatPersianDateOnly(info.created_at)}</td>
                            <th className="text-left pr-2 font-semibold py-1 flex items-center gap-1">
                                <FileCheck className="h-3 w-3" />
                                {t('national_insight_center_info.print.registration_number')}:
                            </th>
                            <td className="pr-4 py-1">{info.registration_number || '-'}</td>
                        </tr>
                    </table>

                    {info.description && (
                        <div className="mt-3 p-3 bg-gray-50 print:bg-white print:border print:border-gray-300 rounded">
                            <h4 className="font-semibold text-black mb-2 flex items-center gap-2">
                                <Info className="h-4 w-4" />
                                {t('national_insight_center_info.print.description')}:
                            </h4>
                            <p className="text-sm text-justify leading-relaxed">{info.description}</p>
                        </div>
                    )}


                    {info.item_stats && info.item_stats.length > 0 && (
                        <div className="mt-4">
                            <h4 className="font-semibold text-black mb-2 flex items-center gap-2">
                                <BarChart3 className="h-4 w-4" />
                                {t('national_insight_center_info.print.statistics')}:
                            </h4>
                            <table className="w-full print:text-xs border border-gray-300 print:border-gray-600" style={{ borderCollapse: 'collapse' }}>
                                {/* Group stats by category */}
                                {(() => {
                                    const groupedStats = info.item_stats.reduce((acc, stat) => {
                                        const categoryId = stat.stat_category_item.category.id;
                                        if (!acc[categoryId]) {
                                            acc[categoryId] = {
                                                category: stat.stat_category_item.category,
                                                items: []
                                            };
                                        }
                                        acc[categoryId].items.push(stat);
                                        return acc;
                                    }, {} as Record<number, { category: any; items: any[] }>);

                                    const categoryEntries = Object.entries(groupedStats);
                                    
                                    return (
                                        <>
                                            {/* First Row: All Categories */}
                                            <tr className="border-b border-gray-300 print:border-gray-600">
                                                {categoryEntries.map(([categoryId, categoryData]) => (
                                                    <td 
                                                        key={categoryId}
                                                        colSpan={categoryData.items.length} 
                                                        className="font-bold text-center py-2 border-r border-gray-300 print:border-gray-600"
                                                        style={{ backgroundColor: categoryData.category.color + '20' }}
                                                    >
                                                        {categoryData.category.label}
                                                    </td>
                                                ))}
                                            </tr>
                                            
                                            {/* Second Row: Item Labels */}
                                            <tr className="border-b border-gray-300 print:border-gray-600">
                                                {categoryEntries.map(([categoryId, categoryData]) => (
                                                    <React.Fragment key={categoryId}>
                                                        {categoryData.items.map((stat) => (
                                                            <th 
                                                                key={stat.id}
                                                                className="text-center py-1 font-semibold border-r border-gray-300 print:border-gray-600"
                                                            >
                                                                {stat.stat_category_item.label}
                                                            </th>
                                                        ))}
                                                    </React.Fragment>
                                                ))}
                                            </tr>
                                            
                                            {/* Third Row: Values */}
                                            <tr className="border-b border-gray-300 print:border-gray-600">
                                                {categoryEntries.map(([categoryId, categoryData]) => (
                                                    <React.Fragment key={categoryId}>
                                                        {categoryData.items.map((stat) => (
                                                            <td 
                                                                key={stat.id}
                                                                className="text-center py-1 border-r border-gray-300 print:border-gray-600"
                                                            >
                                                                {stat.string_value}
                                                            </td>
                                                        ))}
                                                    </React.Fragment>
                                                ))}
                                            </tr>
                                            
                                            {/* Notes Row (if any) */}
                                            {info.item_stats.some(stat => stat.notes) && (
                                                <tr className="border-b border-gray-300 print:border-gray-600">
                                                    {categoryEntries.map(([categoryId, categoryData]) => (
                                                        <React.Fragment key={categoryId}>
                                                            {categoryData.items.map((stat) => (
                                                                <td 
                                                                    key={`notes-${stat.id}`}
                                                                    className="text-center py-1 text-xs border-r border-gray-300 print:border-gray-600"
                                                                >
                                                                    {stat.notes || ''}
                                                                </td>
                                                            ))}
                                                        </React.Fragment>
                                                    ))}
                                                </tr>
                                            )}
                                        </>
                                    );
                                })()}
                            </table>
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
                        {t('national_insight_center_info.print.footer.generated_on')}: {formatPersianDateTime(new Date().toISOString())}
                    </p>
                </div>
            </div>

        </div>
    );
}
