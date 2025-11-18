import React from 'react';
import { Head } from '@inertiajs/react';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n/translate';

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

interface SubItem {
    id: number;
    national_insight_center_info_id: number;
    title: string;
    registration_number: string | null;
    info_category_id: number;
    department_id: number | null;
    province_id: number | null;
    district_id: number | null;
    description: string | null;
    date: string;
    created_by: number | null;
    confirmed: boolean;
    confirmed_by: number | null;
    created_at: string;
    updated_at: string;
    province_name: string | null;
    district_name: string | null;
    department_name: string | null;
}

interface Props {
    sub_items?: SubItem[];
    statSums?: StatSum[];
    dateFrom?: string | null;
    dateTo?: string | null;
}

export default function PrintDates({ sub_items = [], statSums = [], dateFrom, dateTo }: Props) {
    const { t } = useTranslation();

    // Group statSums by category_name
    const categories = React.useMemo(() => {
        return statSums.reduce((acc, item) => {
            const categoryName = item.category_name || 'بدون دسته‌بندی';
            if (!acc[categoryName]) {
                acc[categoryName] = [];
            }
            acc[categoryName].push(item);
            return acc;
        }, {} as Record<string, StatSum[]>);
    }, [statSums]);

    const handlePrint = () => {
        window.print();
    };

    const handleBack = () => {
        window.history.back();
    };

    return (
        <div className="print:max-w-none print:p-0 print:m-0" style={{ fontFamily: 'Arial, sans-serif' }}>
            <Head title={t('national_insight_center_info.print_dates.page_title') || 'گزارش مرکز ملی بصیرت - بر اساس تاریخ'} />
            <style dangerouslySetInnerHTML={{
                __html: `
                    @media print {
                        @page {
                            size: A4 landscape;
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
                        {t('national_insight_center_info.print.back_button') || 'بازگشت'}
                    </Button>
                    <Button
                        onClick={handlePrint}
                        size="lg"
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
                    >
                        <FileText className="h-4 w-4" />
                        {t('national_insight_center_info.print.print_button') || 'چاپ'}
                    </Button>
                </div>
            </div>

            <div className="print:page-break-inside-avoid relative">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-black mb-2">
                        گزارش مرکز ملی بصیرت
                    </h1>
                    <div className="text-base font-medium text-gray-700">
                        {dateFrom && dateTo ? (
                            <>گزارش بر اساس از تاریخ {dateFrom} تا {dateTo}</>
                        ) : dateFrom ? (
                            <>گزارش بر اساس از تاریخ {dateFrom}</>
                        ) : dateTo ? (
                            <>گزارش بر اساس تا تاریخ {dateTo}</>
                        ) : (
                            <>گزارش کامل</>
                        )}
                    </div>
                </div>

                {/* Statistics Table */}
                {Object.keys(categories).length > 0 && (
                    <div className="mb-8">
                        <table className="w-full border-collapse border-2 border-gray-900 print:border-gray-800">
                            <thead>
                                <tr>
                                    {Object.entries(categories).map(([key, category]) => (
                                        <th
                                            key={key}
                                            colSpan={category.length}
                                            className="border-2 border-gray-900 bg-gray-900 px-4 py-3 text-center font-bold text-white"
                                        >
                                            {key}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {Object.values(categories).flat().map((item, index) => (
                                        <td
                                            key={index}
                                            className="border-2 border-gray-900 px-4 py-3 text-center text-gray-900"
                                        >
                                            {item.item_name}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    {Object.values(categories).flat().map((item, index) => (
                                        <td
                                            key={index}
                                            className="border-2 border-gray-900 px-4 py-3 text-center text-gray-900"
                                        >
                                            {item.total_integer_value ?? 0}
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Sub Items Table */}
                <div className="mb-8">
                    <table className="min-w-full border-collapse border-2 border-gray-900 bg-white print:border-gray-800">
                        <thead>
                            <tr className="bg-gray-900 text-white">
                                <th className="border-2 border-gray-900 px-6 py-3 text-center">اداره</th>
                                <th className="border-2 border-gray-900 px-6 py-3 text-center">ولایت</th>
                                <th className="border-2 border-gray-900 px-6 py-3 text-center">ولسوالی</th>
                                <th className="w-1/3 border-2 border-gray-900 px-6 py-3 text-center">توضیحات</th>
                                <th className="border-2 border-gray-900 px-6 py-3 text-center">تاریخ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sub_items.length > 0 ? (
                                sub_items.map((item) => (
                                    <tr key={item.id} className="transition hover:bg-gray-100">
                                        <td className="border-2 border-gray-900 px-4 py-2 text-center">
                                            {item.department_name || '-'}
                                        </td>
                                        <td className="border-2 border-gray-900 px-4 py-2 text-center">
                                            {item.province_name || '-'}
                                        </td>
                                        <td className="border-2 border-gray-900 px-4 py-2 text-center">
                                            {item.district_name || '-'}
                                        </td>
                                        <td className="border-2 border-gray-900 px-4 py-3 text-lg text-gray-900 break-words whitespace-normal text-justify">
                                            {item.description || '-'}
                                        </td>
                                        <td className="border-2 border-gray-900 px-4 py-2 text-center">
                                            {item.date}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="border-2 border-gray-900 px-4 py-6 text-center text-gray-500"
                                    >
                                        هیچ موردی یافت نشد
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

