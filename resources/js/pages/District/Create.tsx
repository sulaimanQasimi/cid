import Header from '@/components/template/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CanCreate } from '@/components/ui/permission-guard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { usePermissions } from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { useTranslation } from '@/lib/i18n/translate';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FileText, MapPin, Save, X } from 'lucide-react';
import React from 'react';

interface ProvinceData {
    id: number;
    name: string;
}

interface CreateProps {
    provinces: ProvinceData[];
}

export default function Create({ provinces }: CreateProps) {
    const { canCreate } = usePermissions();
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('dashboard.page_title'),
            href: route('dashboard'),
        },
        {
            title: t('districts.page_title'),
            href: route('districts.index'),
        },
        {
            title: t('districts.create.title'),
            href: '#',
        },
    ];

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        code: '',
        description: '',
        province_id: '',
        status: 'active',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('districts.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('districts.create.title')} />

            <div className="container px-0 py-6">
                {/* Custom Header Component */}
                <Header
                    title={t('districts.create.title')}
                    description={t('districts.create.description')}
                    icon={<MapPin className="h-6 w-6" />}
                    model="district"
                    routeName={() => ''}
                    buttonText=""
                    theme="purple"
                    showButton={false}
                    showBackButton={true}
                    backRouteName={() => route('districts.index')}
                    backButtonText={t('common.back')}
                />

                <CanCreate model="district">
                    <Card className="shadow-lg">
                        <CardContent className="p-0">
                            <div className="bg-gradient-to-l from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 text-white p-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold">{t('districts.create.form_title')}</h3>
                                        <p className="text-purple-100 text-sm">{t('districts.create.form_description')}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <form id="district-form" onSubmit={handleSubmit}>
                            <CardContent className="space-y-6 p-8">
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="space-y-3">
                                        <Label htmlFor="name" className="text-lg font-semibold text-purple-900 dark:text-purple-200">
                                            {t('districts.form.name_label')} *
                                        </Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder={t('districts.form.name_placeholder')}
                                            required
                                            className="h-12 rounded-xl border-purple-200 dark:border-purple-700 bg-gradient-to-l from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800 text-lg shadow-lg focus:border-purple-500 focus:ring-purple-500/20 dark:focus:border-purple-400 dark:focus:ring-purple-400/20"
                                        />
                                        {errors.name && (
                                            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                                <X className="h-4 w-4" />
                                                {errors.name}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="code" className="text-lg font-semibold text-purple-900 dark:text-purple-200">
                                            {t('districts.form.code_label')} *
                                        </Label>
                                        <Input
                                            id="code"
                                            value={data.code}
                                            onChange={(e) => setData('code', e.target.value)}
                                            placeholder={t('districts.form.code_placeholder')}
                                            required
                                            className="h-12 rounded-xl border-purple-200 dark:border-purple-700 bg-gradient-to-l from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800 text-lg shadow-lg focus:border-purple-500 focus:ring-purple-500/20 dark:focus:border-purple-400 dark:focus:ring-purple-400/20"
                                        />
                                        {errors.code && (
                                            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                                <X className="h-4 w-4" />
                                                {errors.code}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="province_id" className="text-lg font-semibold text-purple-900 dark:text-purple-200">
                                        {t('districts.form.province_label')} *
                                    </Label>
                                    <Select value={data.province_id} onValueChange={(value) => setData('province_id', value)} required>
                                        <SelectTrigger className="h-12 rounded-xl border-purple-200 dark:border-purple-700 bg-gradient-to-l from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800 text-lg shadow-lg focus:border-purple-500 focus:ring-purple-500/20 dark:focus:border-purple-400 dark:focus:ring-purple-400/20">
                                            <SelectValue placeholder={t('districts.form.province_placeholder')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {provinces.map((province) => (
                                                <SelectItem key={province.id} value={province.id.toString()}>
                                                    {province.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.province_id && (
                                        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                            <X className="h-4 w-4" />
                                            {errors.province_id}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="description" className="text-lg font-semibold text-purple-900 dark:text-purple-200">
                                        {t('districts.form.description_label')}
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder={t('districts.form.description_placeholder')}
                                        rows={4}
                                        className="resize-none rounded-xl border-purple-200 dark:border-purple-700 bg-gradient-to-l from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800 text-lg shadow-lg focus:border-purple-500 focus:ring-purple-500/20 dark:focus:border-purple-400 dark:focus:ring-purple-400/20"
                                    />
                                    {errors.description && (
                                        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                            <X className="h-4 w-4" />
                                            {errors.description}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="status" className="text-lg font-semibold text-purple-900 dark:text-purple-200">
                                        {t('districts.form.status_label')} *
                                    </Label>
                                    <Select value={data.status} onValueChange={(value) => setData('status', value)} required>
                                        <SelectTrigger className="h-12 rounded-xl border-purple-200 dark:border-purple-700 bg-gradient-to-l from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800 text-lg shadow-lg focus:border-purple-500 focus:ring-purple-500/20 dark:focus:border-purple-400 dark:focus:ring-purple-400/20">
                                            <SelectValue placeholder={t('districts.form.status_placeholder')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">{t('districts.form.status_active')}</SelectItem>
                                            <SelectItem value="inactive">{t('districts.form.status_inactive')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && (
                                        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                            <X className="h-4 w-4" />
                                            {errors.status}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </form>
                        
                        {/* Footer Buttons */}
                        <div className="border-t border-purple-200 dark:border-purple-700 bg-gradient-to-l from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800 px-8 py-6">
                            <div className="flex items-center justify-end gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                    className="h-12 rounded-xl border-purple-300 dark:border-purple-600 px-8 text-lg font-semibold text-purple-700 dark:text-purple-300 transition-all duration-300 hover:scale-105 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-100 dark:hover:bg-purple-800/30"
                                >
                                    {t('common.cancel')}
                                </Button>
                                <Button
                                    type="submit"
                                    form="district-form"
                                    disabled={processing}
                                    className="h-12 rounded-xl bg-gradient-to-l from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 px-8 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl dark:hover:shadow-purple-500/25"
                                >
                                    {processing ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                            {t('common.saving')}
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Save className="h-5 w-5" />
                                            {t('common.save')}
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </CanCreate>
            </div>
        </AppLayout>
    );
}
