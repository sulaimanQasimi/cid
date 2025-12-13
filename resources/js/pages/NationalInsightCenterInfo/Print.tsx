import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, User, Calendar, CheckCircle, Clock, Building2, Tag, FileCheck, BarChart3, Info, Settings, X, TabletSmartphone } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';
import { formatPersianDateOnly } from '@/lib/utils/date';
import { format } from 'date-fns';
import moment from 'moment-jalaali';

interface NationalInsightCenterInfo {
    id: number;
    name: string;
    code: string | null;
    description: string | null;
    date: string | null;
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

interface StatSum {
    stat_category_item_id: number;
    stat_category_id: number;
    parent_id: number | null;
    item_name: string;
    item_label: string;
    item_color: string | null;
    item_status: string;
    item_order: number;
    category_id: number;
    category_name: string;
    category_label: string;
    category_color: string | null;
    category_status: string;
    total_integer_value: number;
}

interface PrintSettings {
    governmentName: string;
    ministryName: string;
    reportTitle: string;
    dateFormat: 'gregorian' | 'hijri' | 'persian';
}

interface Props {
    nationalInsightCenterInfo: NationalInsightCenterInfo;
    infos: InfoItem[];
    statSums?: StatSum[];
}

export default function NationalInsightCenterInfoPrint({
    nationalInsightCenterInfo,
    infos,
    statSums = []
}: Props) {
    const { t } = useTranslation();
    const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<'labels' | 'date_format'>('labels');
    const [printSettings, setPrintSettings] = useState<PrintSettings>({
        governmentName: 'امارت اسلامی افغانستان',
        ministryName: 'وزارت دفاع',
        reportTitle: 'گزارش مرکز ملی بصیرت',
        dateFormat: 'persian',
    });

    // Group statSums by category_name
    const categories = React.useMemo(() => {
        return statSums.reduce(
            (acc, item) => {
                const categoryName = item.category_name || 'بدون دسته‌بندی';
                if (!acc[categoryName]) {
                    acc[categoryName] = [];
                }
                acc[categoryName].push(item);
                return acc;
            },
            {} as Record<string, StatSum[]>,
        );
    }, [statSums]);

    // Split categories into chunks of max 20 columns
    const categoryChunks = React.useMemo(() => {
        const allItems = Object.values(categories).flat();
        const maxColumns = 20;
        const chunks: Array<Record<string, StatSum[]>> = [];
        let currentChunk: Record<string, StatSum[]> = {};
        let currentColumnCount = 0;

        Object.entries(categories).forEach(([categoryName, items]) => {
            // If adding this category would exceed the limit, start a new chunk
            if (currentColumnCount + items.length > maxColumns && currentColumnCount > 0) {
                chunks.push(currentChunk);
                currentChunk = {};
                currentColumnCount = 0;
            }

            // If a single category is larger than maxColumns, split it
            if (items.length > maxColumns) {
                // First, save current chunk if it has items
                if (currentColumnCount > 0) {
                    chunks.push(currentChunk);
                    currentChunk = {};
                    currentColumnCount = 0;
                }
                // Split the large category into multiple chunks
                for (let i = 0; i < items.length; i += maxColumns) {
                    const chunkItems = items.slice(i, i + maxColumns);
                    chunks.push({ [categoryName]: chunkItems });
                }
            } else {
                currentChunk[categoryName] = items;
                currentColumnCount += items.length;
            }
        });

        // Add the last chunk if it has items
        if (currentColumnCount > 0) {
            chunks.push(currentChunk);
        }

        return chunks;
    }, [categories]);

    const handlePrint = () => {
        window.print();
    };

    const handleBack = () => {
        window.history.back();
    };

    const handleSettingsChange = (key: keyof PrintSettings, value: string) => {
        setPrintSettings((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    // Date conversion utility functions
    const gregorianToHijri = (date: Date): string => {
        try {
            // Use Intl API with Islamic calendar for accurate Hijri conversion
            const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            });
            
            const parts = formatter.formatToParts(date);
            const year = parts.find((part) => part.type === 'year')?.value || '';
            const month = parts.find((part) => part.type === 'month')?.value || '';
            const day = parts.find((part) => part.type === 'day')?.value || '';
            
            return `${year}/${month.padStart(2, '0')}/${day.padStart(2, '0')}`;
        } catch (error) {
            console.error('Error converting to Hijri:', error);
            // Fallback to simple approximation if Intl API fails
            const hijriYear = Math.floor((date.getFullYear() - 622) * 0.970224);
            const hijriMonth = Math.floor((date.getMonth() + 1) * 0.970224);
            const hijriDay = Math.floor(date.getDate() * 0.970224);
            return `${hijriYear}/${hijriMonth.toString().padStart(2, '0')}/${hijriDay.toString().padStart(2, '0')}`;
        }
    };

    const gregorianToPersian = (date: Date): string => {
        // Use the existing formatPersianDateOnly function for accurate Persian conversion
        return formatPersianDateOnly(date.toISOString());
    };

    // Parse Persian date string and convert to Date object
    const parsePersianDate = (dateString: string): Date | null => {
        if (!dateString) return null;
        
        try {
            // Check if it's a Persian date format (YYYY/MM/DD or YYYY/M/D)
            if (dateString.includes('/')) {
                // Try to parse as Persian date using moment-jalaali
                const persianMoment = moment(dateString, 'jYYYY/jMM/jDD');
                if (persianMoment.isValid()) {
                    // Convert Persian date to Gregorian Date object
                    return persianMoment.toDate();
                }
            }
            
            // Try to parse as ISO date or standard date
            const date = new Date(dateString);
            if (!isNaN(date.getTime())) {
                return date;
            }
            
            return null;
        } catch (e) {
            console.error('Error parsing date:', e);
            return null;
        }
    };

    // Format the date based on selected calendar system
    const formatDate = (dateString: string | null): string => {
        if (!dateString) return '-';
        
        try {
            // First, parse the date (handles Persian date strings)
            const date = parsePersianDate(dateString);
            
            if (!date) {
                // If parsing fails, return the original string
                return dateString;
            }
            
            // Now format according to selected calendar
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
            console.error('Error formatting date:', e);
            return dateString;
        }
    };

    return (
        <div className="print:m-0 print:max-w-none print:p-0" style={{ fontFamily: 'Amiri, serif' }}>
            <Head title={t('national_insight_center_info.print.title', { name: nationalInsightCenterInfo.name })} />
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                    @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
                    
                    @media print {
                        @page {
                            size: A4 landscape;
                            margin: 2.5cm;
                        }
                        body {
                            font-size: 11px;
                            line-height: 1.5;
                            font-family: 'Amiri', serif !important;
                        }
                        * {
                            font-family: 'Amiri', serif !important;
                        }
                        .print\\:text-xs {
                            font-size: 9px !important;
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
                        table {
                            page-break-inside: auto;
                        }
                        tr {
                            page-break-inside: avoid;
                            page-break-after: auto;
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
                        {t('national_insight_center_info.print.back_button') || 'بازگشت'}
                    </Button>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() => setShowSettingsModal(true)}
                            variant="outline"
                            size="lg"
                            className="flex items-center gap-2"
                        >
                            <Settings className="h-4 w-4" />
                            {t('national_insight_center_info.print_dates.settings_button') || 'تنظیمات چاپ'}
                        </Button>
                        <Button onClick={handlePrint} size="lg" className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700">
                            <FileText className="h-4 w-4" />
                            {t('national_insight_center_info.print.print_button') || 'چاپ'}
                        </Button>
                    </div>
                </div>
            </div>
            <div className="print:page-break-inside-avoid relative mx-auto max-w-7xl px-4">
                {/* Header */}
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
                            <h2 className="mb-1 text-2xl font-semibold text-gray-800 print:text-xl">{printSettings.ministryName}</h2>
                            <h3 className="text-xl font-medium text-gray-700 print:text-lg">{printSettings.reportTitle}</h3>
                        </div>
                        <div className="flex-shrink-0">
                            <img
                                src="/images/logos/logo 2.png"
                                alt="logo"
                                className="h-20 w-20 object-contain print:h-16 print:w-16"
                            />
                        </div>
                    </div>
                    <div className="mt-4 rounded-lg bg-gray-100 px-4 py-2 text-base font-medium text-gray-800 print:bg-gray-200 print:text-sm">
                        {nationalInsightCenterInfo.name}
                        {nationalInsightCenterInfo.date && (
                            <> - {formatDate(nationalInsightCenterInfo.date)}</>
                        )}
                    </div>
                </div>
                {/* Info Details Table */}
                <div className="mb-8">
                    <div className="overflow-hidden rounded-lg border border-gray-300 print:border-gray-800">
                        <table className="min-w-full border-collapse bg-white print:text-xs">
                            <tbody>
                                <tr className="bg-white print:bg-white border-b border-gray-300 print:border-gray-600">
                                    <th className="border border-gray-300 px-4 py-2 text-right text-sm font-semibold text-gray-900 print:border-gray-800 bg-gray-50 print:bg-gray-100">
                                        <div className="flex items-center justify-end gap-2">
                                            <Tag className="h-3 w-3" />
                                            {t('national_insight_center_info.print.code') || 'شماره ثبت'}:
                                        </div>
                                    </th>
                                    <td className="border border-gray-300 px-4 py-2 text-center text-sm text-gray-900 print:border-gray-800">
                                        {nationalInsightCenterInfo.code || '-'}
                                    </td>
                                    <th className="border border-gray-300 px-4 py-2 text-right text-sm font-semibold text-gray-900 print:border-gray-800 bg-gray-50 print:bg-gray-100">
                                        <div className="flex items-center justify-end gap-2">
                                            {nationalInsightCenterInfo.confirmed ? <CheckCircle className="h-3 w-3 text-green-600" /> : <Clock className="h-3 w-3 text-yellow-600" />}
                                            {t('national_insight_center_info.print.status') || 'وضعیت'}:
                                        </div>
                                    </th>
                                    <td className="border border-gray-300 px-4 py-2 text-center text-sm text-gray-900 print:border-gray-800">
                                        {nationalInsightCenterInfo.confirmed ? t('national_insight_center_info.confirmed') || 'تایید شده' : t('national_insight_center_info.pending') || 'در انتظار'}
                                    </td>
                                    <th className="border border-gray-300 px-4 py-2 text-right text-sm font-semibold text-gray-900 print:border-gray-800 bg-gray-50 print:bg-gray-100">
                                        <div className="flex items-center justify-end gap-2">
                                            <Calendar className="h-3 w-3" />
                                            {t('national_insight_center_info.print.created_at') || 'تاریخ ایجاد'}:
                                        </div>
                                    </th>
                                    <td className="border border-gray-300 px-4 py-2 text-center text-sm text-gray-900 print:border-gray-800">
                                        {formatDate(nationalInsightCenterInfo.created_at)}
                                    </td>
                                </tr>
                                <tr className="bg-gray-50 print:bg-gray-100 border-b border-gray-300 print:border-gray-600">
                                    <th className="border border-gray-300 px-4 py-2 text-right text-sm font-semibold text-gray-900 print:border-gray-800 bg-gray-50 print:bg-gray-100">
                                        <div className="flex items-center justify-end gap-2">
                                            <User className="h-3 w-3" />
                                            {t('national_insight_center_info.print.created_by') || 'ایجاد شده توسط'}:
                                        </div>
                                    </th>
                                    <td className="border border-gray-300 px-4 py-2 text-center text-sm text-gray-900 print:border-gray-800">
                                        {nationalInsightCenterInfo.creator?.name || '-'}
                                    </td>
                                    <th className="border border-gray-300 px-4 py-2 text-right text-sm font-semibold text-gray-900 print:border-gray-800 bg-gray-50 print:bg-gray-100">
                                        <div className="flex items-center justify-end gap-2">
                                            <FileCheck className="h-3 w-3" />
                                            {t('national_insight_center_info.print.confirmed_by') || 'تأیید شده توسط'}:
                                        </div>
                                    </th>
                                    <td className="border border-gray-300 px-4 py-2 text-center text-sm text-gray-900 print:border-gray-800">
                                        {nationalInsightCenterInfo.confirmer?.name || '-'}
                                    </td>
                                    <th className="border border-gray-300 px-4 py-2 text-right text-sm font-semibold text-gray-900 print:border-gray-800 bg-gray-50 print:bg-gray-100">
                                        <div className="flex items-center justify-end gap-2">
                                            <Calendar className="h-3 w-3" />
                                            {t('national_insight_center_info.print.confirmed_at') || 'تاریخ تأیید'}:
                                        </div>
                                    </th>
                                    <td className="border border-gray-300 px-4 py-2 text-center text-sm text-gray-900 print:border-gray-800">
                                        {nationalInsightCenterInfo.confirmed_at ? formatDate(nationalInsightCenterInfo.confirmed_at) : '-'}
                                    </td>
                                </tr>
                                <tr className="bg-white print:bg-white">
                                    <th className="border border-gray-300 px-4 py-2 text-right text-sm font-semibold text-gray-900 print:border-gray-800 bg-gray-50 print:bg-gray-100">
                                        <div className="flex items-center justify-end gap-2">
                                            <Building2 className="h-3 w-3" />
                                            {t('national_insight_center_info.print.info.department') || 'بخش'}:
                                        </div>
                                    </th>
                                    <td colSpan={5} className="border border-gray-300 px-4 py-2 text-center text-sm text-gray-900 print:border-gray-800">
                                        {nationalInsightCenterInfo.creator?.department?.name || '-'}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Statistics Table */}
                {categoryChunks.length > 0 && (
                    <div className="mb-8 space-y-4">
                        {categoryChunks.map((chunk, chunkIndex) => (
                            <div key={chunkIndex} className="flex justify-start">
                                <div className="overflow-hidden rounded-lg border border-gray-300 print:border-gray-800">
                                    <table className="w-fit border-collapse bg-white">
                                        <thead>
                                            <tr className="bg-gradient-to-b from-gray-700 to-gray-800 text-white print:bg-gray-900">
                                                {Object.entries(chunk).map(([key, category]) => (
                                                    <th
                                                        key={key}
                                                        colSpan={category.length}
                                                        className="border border-gray-400 px-2 py-2 text-center text-xs font-bold print:border-gray-800"
                                                    >
                                                        {key}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="bg-white print:bg-white">
                                                {Object.values(chunk)
                                                    .flat()
                                                    .map((item, index) => (
                                                        <td
                                                            key={index}
                                                            className="h-20 rotate-90 border border-gray-300 px-2 py-1 text-center text-xs text-gray-900 print:border-gray-800"
                                                        >
                                                            {item.item_name}
                                                        </td>
                                                    ))}
                                            </tr>
                                            <tr className="bg-gray-50 print:bg-gray-100">
                                                {Object.values(chunk)
                                                    .flat()
                                                    .map((item, index) => (
                                                        <td
                                                            key={index}
                                                            className="border border-gray-300 px-2 py-1 text-center text-xs font-medium text-gray-900 print:border-gray-800"
                                                        >
                                                            {item.total_integer_value ?? 0}
                                                        </td>
                                                    ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Info Items Table */}
                <div className="mb-8">
                    <div className="overflow-hidden rounded-lg border border-gray-300 print:border-gray-800">
                        <table className="min-w-full border-collapse bg-white">
                            <thead>
                                <tr className="bg-gradient-to-b from-gray-700 to-gray-800 text-white print:bg-gray-900">
                                    <th className="border border-gray-400 px-4 py-3 text-center text-sm font-bold print:border-gray-800">
                                        #
                                    </th>
                                    <th className="border border-gray-400 px-4 py-3 text-center text-sm font-bold print:border-gray-800">
                                        {t('national_insight_center_info.print.info.title') || 'عنوان'}
                                    </th>
                                    <th className="border border-gray-400 px-4 py-3 text-center text-sm font-bold print:border-gray-800">
                                        {t('national_insight_center_info.print.info.info_category') || 'دسته‌بندی'}
                                    </th>
                                    <th className="border border-gray-400 px-4 py-3 text-center text-sm font-bold print:border-gray-800">
                                        {t('national_insight_center_info.print.info.department') || 'اداره'}
                                    </th>
                                    <th className="border border-gray-400 px-4 py-3 text-center text-sm font-bold print:border-gray-800">
                                        {t('national_insight_center_info.print.registration_number') || 'شماره ثبت'}
                                    </th>
                                    <th className="w-1/3 border border-gray-400 px-4 py-3 text-center text-sm font-bold print:border-gray-800">
                                        {t('national_insight_center_info.print.description') || 'توضیحات'}
                                    </th>
                                    <th className="border border-gray-400 px-4 py-3 text-center text-sm font-bold print:border-gray-800">
                                        {t('national_insight_center_info.print.info.created_at') || 'تاریخ'}
                                    </th>
                                    <th className="border border-gray-400 px-4 py-3 text-center text-sm font-bold print:border-gray-800">
                                        {t('national_insight_center_info.print.status') || 'وضعیت'}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {infos.length > 0 ? (
                                    infos.map((info, index) => (
                                        <tr
                                            key={info.id}
                                            className={`transition-colors ${
                                                index % 2 === 0
                                                    ? 'bg-white print:bg-white'
                                                    : 'bg-gray-50 print:bg-gray-100'
                                            } hover:bg-gray-100 print:hover:bg-inherit`}
                                        >
                                            <td className="border border-gray-300 px-4 py-2 text-center text-sm text-gray-900 print:border-gray-800">
                                                {index + 1}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2 text-center text-sm text-gray-900 print:border-gray-800">
                                                {info.title}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2 text-center text-sm text-gray-900 print:border-gray-800">
                                                {info.info_category?.name || '-'}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2 text-center text-sm text-gray-900 print:border-gray-800">
                                                {info.department?.name || '-'}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2 text-center text-sm text-gray-900 print:border-gray-800">
                                                {info.registration_number || '-'}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2 text-justify text-sm leading-relaxed text-gray-900 break-words whitespace-normal print:border-gray-800">
                                                {info.description || '-'}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-900 print:border-gray-800">
                                                {formatDate(info.created_at)}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2 text-center text-sm text-gray-900 print:border-gray-800">
                                                {info.confirmed ? (
                                                    <span className="inline-flex items-center gap-1">
                                                        <CheckCircle className="h-3 w-3 text-green-600" />
                                                        {t('national_insight_center_info.confirmed') || 'تایید شده'}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1">
                                                        <Clock className="h-3 w-3 text-yellow-600" />
                                                        {t('national_insight_center_info.pending') || 'در انتظار'}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="border border-gray-300 px-4 py-8 text-center text-sm text-gray-500 print:border-gray-800"
                                        >
                                            {t('national_insight_center_info.print.no_items') || 'هیچ موردی یافت نشد'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-gray-300 print:border-gray-600 print:mt-12">
                <div className="text-center text-sm text-gray-600 print:text-gray-800">
                    <p className="flex items-center justify-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {t('national_insight_center_info.print.footer.generated_on')}: {formatDate(new Date().toISOString())}
                    </p>
                </div>
            </div>

            {/* Print Settings Modal */}
            {showSettingsModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-lg font-semibold flex items-center">
                                <FileText className="mr-2 h-5 w-5" />
                                {t('national_insight_center_info.print_dates.settings_title') || 'تنظیمات چاپ'}
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
                                    onClick={() => setActiveTab('labels')}
                                    className={`px-4 py-2 border-b-2 font-medium text-sm ${
                                        activeTab === 'labels'
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center">
                                        <Tag className="mr-2 h-4 w-4" />
                                        {t('national_insight_center_info.print_dates.settings.tabs.labels') || 'عنوان‌ها'}
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('date_format')}
                                    className={`px-4 py-2 border-b-2 font-medium text-sm ${
                                        activeTab === 'date_format'
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center">
                                        <TabletSmartphone className="mr-2 h-4 w-4" />
                                        {t('national_insight_center_info.print_dates.settings.tabs.date_format') || 'فرمت تاریخ'}
                                    </div>
                                </button>
                            </div>

                            {/* Labels Tab */}
                            {activeTab === 'labels' && (
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <Tag className="mr-2 h-5 w-5 text-primary" />
                                        <h3 className="text-md font-medium">
                                            {t('national_insight_center_info.print_dates.settings_labels_title') || 'عنوان‌ها'}
                                        </h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {t('national_insight_center_info.print_dates.settings_government_name') || 'نام دولت:'}
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
                                                {t('national_insight_center_info.print_dates.settings_ministry_name') || 'نام وزارت:'}
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
                                                {t('national_insight_center_info.print_dates.settings_report_title') || 'عنوان گزارش:'}
                                            </label>
                                            <input
                                                type="text"
                                                value={printSettings.reportTitle}
                                                onChange={(e) => handleSettingsChange('reportTitle', e.target.value)}
                                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                                placeholder="گزارش مرکز ملی بصیرت"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Date Format Tab */}
                            {activeTab === 'date_format' && (
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <TabletSmartphone className="mr-2 h-5 w-5 text-primary" />
                                        <h3 className="text-md font-medium">
                                            {t('national_insight_center_info.print_dates.settings.date_format.title') || 'فرمت تاریخ'}
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                {t('national_insight_center_info.print_dates.settings.date_format.title') || 'فرمت تاریخ'}
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
                                                    <span className="text-sm">
                                                        {t('national_insight_center_info.print_dates.settings.date_format.gregorian') || 'میلادی (Gregorian)'}
                                                    </span>
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
                                                    <span className="text-sm">
                                                        {t('national_insight_center_info.print_dates.settings.date_format.hijri') || 'هجری (Hijri)'}
                                                    </span>
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
                                                    <span className="text-sm">
                                                        {t('national_insight_center_info.print_dates.settings.date_format.persian') || 'شمسی (Persian)'}
                                                    </span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Preview of current date format */}
                                        <div className="border rounded-lg p-4 bg-gray-50">
                                            <h4 className="font-medium text-gray-700 mb-2">
                                                {t('national_insight_center_info.print_dates.settings.date_format.preview') || 'نمونه تاریخ:'}
                                            </h4>
                                            <div className="text-sm text-gray-600">
                                                {formatDate(new Date().toISOString())}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Preview */}
                            <div className="border rounded-lg p-4 bg-gray-50">
                                <h3 className="text-md font-medium mb-3">
                                    {t('national_insight_center_info.print_dates.settings_preview') || 'پیش‌نمایش'}
                                </h3>
                                <div className="border rounded overflow-hidden bg-white p-4">
                                    <div className="text-center">
                                        <h1 className="mb-1 text-2xl font-bold text-gray-900">
                                            {printSettings.governmentName}
                                        </h1>
                                        <h2 className="mb-1 text-xl font-semibold text-gray-800">{printSettings.ministryName}</h2>
                                        <h3 className="text-lg font-medium text-gray-700">{printSettings.reportTitle}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t px-4 py-3 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowSettingsModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                {t('common.cancel') || 'لغو'}
                            </button>
                            <button
                                onClick={() => {
                                    setShowSettingsModal(false);
                                }}
                                className="px-4 py-2 bg-primary border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                {t('common.save') || 'ذخیره'}
                            </button>
                            <button
                                onClick={() => {
                                    setShowSettingsModal(false);
                                    setTimeout(() => window.print(), 300);
                                }}
                                className="px-4 py-2 bg-purple-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                            >
                                {t('national_insight_center_info.print_dates.apply_and_print') || 'ذخیره و چاپ'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
