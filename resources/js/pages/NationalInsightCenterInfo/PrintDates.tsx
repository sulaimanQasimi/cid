import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n/translate';
import { formatPersianDateOnly } from '@/lib/utils/date';
import { Head } from '@inertiajs/react';
import { ArrowLeft, FileText } from 'lucide-react';
import React from 'react';

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

    const handlePrint = () => {
        window.print();
    };

    const handleBack = () => {
        window.history.back();
    };

    return (
        <div className="print:m-0 print:max-w-none print:p-0" style={{ fontFamily: 'Amiri, serif' }}>
            <Head title={t('national_insight_center_info.print_dates.page_title') || 'گزارش مرکز ملی بصیرت - بر اساس تاریخ'} />
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
                    <Button onClick={handlePrint} size="lg" className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700">
                        <FileText className="h-4 w-4" />
                        {t('national_insight_center_info.print.print_button') || 'چاپ'}
                    </Button>
                </div>
            </div>

            <div className="print:page-break-inside-avoid relative mx-auto max-w-7xl px-4">
                {/* Header */}
                <div className="mb-10 border-b-2 border-gray-300 pb-6 text-center print:border-gray-800">
                    <div className="relative mb-4 flex items-center justify-between">
                        <div className="flex-shrink-0">
                            <img
                                src="/images/logos/logo 2.png"
                                alt="logo"
                                className="h-20 w-20 object-contain print:h-16 print:w-16"
                            />
                        </div>
                        <div className="flex-1">
                            <h1 className="mb-1 text-3xl font-bold text-gray-900 print:text-2xl">
                                امارت اسلامی افغانستان
                            </h1>
                            <h2 className="mb-1 text-2xl font-semibold text-gray-800 print:text-xl">وزارت دفاع</h2>
                            <h3 className="text-xl font-medium text-gray-700 print:text-lg">گزارش مرکز ملی بصیرت</h3>
                        </div>
                        <div className="flex-shrink-0">
                            <img
                                src="/images/logos/logo 1.png"
                                alt="logo"
                                className="h-20 w-20 object-contain print:h-16 print:w-16"
                            />
                        </div>
                    </div>
                    <div className="mt-4 rounded-lg bg-gray-100 px-4 py-2 text-base font-medium text-gray-800 print:bg-gray-200 print:text-sm">
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
                    <div className="mb-8 flex justify-start">
                        <table className="border-collapse border-2 border-gray-900 print:border-gray-800">
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
                                    {Object.values(categories)
                                        .flat()
                                        .map((item, index) => (
                                            <td key={index} className="h-22 rotate-90 border-2 border-gray-900 py-3 text-center text-gray-900">
                                                {item.item_name}
                                            </td>
                                        ))}
                                </tr>
                                <tr>
                                    {Object.values(categories)
                                        .flat()
                                        .map((item, index) => (
                                            <td key={index} className="border-2 border-gray-900 py-3 text-center text-gray-900">
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
                    <h2 className="mb-4 text-xl font-bold text-gray-900 print:text-lg">جزئیات موارد</h2>
                    <div className="overflow-hidden rounded-lg border border-gray-300 shadow-md print:border-gray-800 print:shadow-none">
                        <table className="min-w-full border-collapse bg-white">
                            <thead>
                                <tr className="bg-gradient-to-b from-gray-700 to-gray-800 text-white print:bg-gray-900">
                                    <th className="border border-gray-400 px-4 py-3 text-center text-sm font-bold print:border-gray-800">
                                        اداره
                                    </th>
                                    <th className="border border-gray-400 px-4 py-3 text-center text-sm font-bold print:border-gray-800">
                                        ولایت
                                    </th>
                                    <th className="border border-gray-400 px-4 py-3 text-center text-sm font-bold print:border-gray-800">
                                        ولسوالی
                                    </th>
                                    <th className="w-1/3 border border-gray-400 px-4 py-3 text-center text-sm font-bold print:border-gray-800">
                                        توضیحات
                                    </th>
                                    <th className="border border-gray-400 px-4 py-3 text-center text-sm font-bold print:border-gray-800">
                                        تاریخ
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sub_items.length > 0 ? (
                                    sub_items.map((item, index) => (
                                        <tr
                                            key={item.id}
                                            className={`transition-colors ${
                                                index % 2 === 0
                                                    ? 'bg-white print:bg-white'
                                                    : 'bg-gray-50 print:bg-gray-100'
                                            } hover:bg-gray-100 print:hover:bg-inherit`}
                                        >
                                            <td className="border border-gray-300 px-4 py-2 text-center text-sm text-gray-900 print:border-gray-800">
                                                {item.department_name || '-'}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2 text-center text-sm text-gray-900 print:border-gray-800">
                                                {item.province_name || '-'}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2 text-center text-sm text-gray-900 print:border-gray-800">
                                                {item.district_name || '-'}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2 text-justify text-sm leading-relaxed text-gray-900 break-words whitespace-normal print:border-gray-800">
                                                {item.description || '-'}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-900 print:border-gray-800">
                                                {item.date ? formatPersianDateOnly(item.date) : '-'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="border border-gray-300 px-4 py-8 text-center text-sm text-gray-500 print:border-gray-800"
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
        </div>
    );
}
