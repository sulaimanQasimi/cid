import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, CheckCircle, User, Calendar, Building2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';
import { formatPersianDateOnly } from '@/lib/utils/date';

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

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('info.page_title'),
            href: route('national-insight-center-infos.index'),
        },
        {
            title: t('national_insight_center_info.page_title'),
            href: route('national-insight-center-infos.index'),
        },
        {
            title: nationalInsightCenterInfo.name,
            href: route('national-insight-center-infos.show', { national_insight_center_info: nationalInsightCenterInfo.id }),
        },
        {
            title: t('national_insight_center_info.print.title'),
            href: '#',
        },
    ];

    const handlePrint = () => {
        window.print();
    };

    const handleBack = () => {
        window.history.back();
    };

    return (
        <>
            <Head title={t('national_insight_center_info.print.title', { name: nationalInsightCenterInfo.name })} />
            <h1 className="text-2xl font-bold text-black  text-center">{t('national_insight_center_info.print.header_title')}</h1>
            <h2 className="text-xl font-semibold text-black  text-center pt-2">{nationalInsightCenterInfo.name}</h2>

            <table className="w-full mt-4">
                <tr className="text-sm border-b border-gray-900" >
                    <th className="text-left">{t('national_insight_center_info.print.code')}:</th>
                    <td>{nationalInsightCenterInfo.code}</td>
                    <th className="text-left">{t('national_insight_center_info.print.status')}:</th>
                    <td>{nationalInsightCenterInfo.confirmed ? t('national_insight_center_info.confirmed') : t('national_insight_center_info.pending')}</td>
                    <th className="text-left">{t('national_insight_center_info.print.created_at')}:</th>
                    <td>{formatPersianDateOnly(nationalInsightCenterInfo.created_at)}</td>
                    <th className="text-left">{t('national_insight_center_info.print.created_by')}:</th>
                    <td>{nationalInsightCenterInfo.creator?.name}</td>
                    <th className="text-left">{t('national_insight_center_info.print.confirmed_by')}:</th>
                    <td>{nationalInsightCenterInfo.confirmer?.name}</td>
                    <th className="text-left">{t('national_insight_center_info.print.confirmed_at')}:</th>
                    <td>{formatPersianDateOnly(nationalInsightCenterInfo.confirmed_at ?? '')}</td>
                </tr>
                <tr className="text-sm  pt-2 py-6" >
                    <th className="text-left">{t('national_insight_center_info.print.info.department')}:</th>
                    <td>{nationalInsightCenterInfo.creator?.department?.name}</td>
                </tr>
            </table>
            <hr className="my-4 border-gray-900" />
            {infos.map((info) => (
                <div key={info.id} className="mt-4">

                    <div className="pt-4 flex mr-2 my-6">
                        <div className="text-left">{t('national_insight_center_info.print.info.title')}:</div>
                        <div >{info.title}</div>
                    </div>

                    <table className="w-full">
                        <tr>
                            <th className="text-left">{t('national_insight_center_info.print.info.info_category')}:</th>
                            <td>{info.info_category?.name}</td>
                            <th className="text-left">{t('national_insight_center_info.print.info.department')}:</th>
                            <td>{info.department?.name}</td>
                            <th className="text-left">{t('national_insight_center_info.print.info.creator')}:</th>
                            <td>{info.creator?.name}</td>
                            <th className="text-left">{t('national_insight_center_info.print.info.confirmed')}:</th>
                            <td>{info.confirmed ? t('national_insight_center_info.print.info.confirmed') : t('national_insight_center_info.print.info.pending')}</td>
                            <th className="text-left">{t('national_insight_center_info.print.info.created_at')}:</th>
                            <td>{formatPersianDateOnly(info.created_at)}</td>
                        </tr>

                    </table>

                    <p className="text-sm p-4 text-justify mr-2">{info.description}</p>

                </div>
            ))}


        </>
    );
}
