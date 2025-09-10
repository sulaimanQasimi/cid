import Header from '@/components/template/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CanUpdate } from '@/components/ui/permission-guard';
import { Textarea } from '@/components/ui/textarea';
import { usePermissions } from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { useTranslation } from '@/lib/i18n/translate';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FileText, Save, X } from 'lucide-react';
import React from 'react';

interface InfoCategory {
    id: number;
    name: string;
    code: string | null;
    description: string | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    infoCategory: InfoCategory;
}

export default function InfoCategoryEdit({ infoCategory }: Props) {
    const { canUpdate } = usePermissions();
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('info.page_title'),
            href: route('info-types.index'),
        },
        {
            title: t('info_categories.page_title'),
            href: route('info-categories.index'),
        },
        {
            title: t('info_categories.edit.title', { name: infoCategory.name }),
            href: '#',
        },
    ];

    const { data, setData, patch, processing, errors } = useForm({
        name: infoCategory.name || '',
        code: infoCategory.code || '',
        description: infoCategory.description || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('info-categories.update', infoCategory.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('info_categories.edit.title', { name: infoCategory.name })} />

            <div className="container px-0 py-6">
                {/* Standard Header Component */}
                <Header
                    title={t('info_categories.edit.title', { name: infoCategory.name })}
                    description={t('info_categories.edit.description')}
                    icon={<FileText className="h-6 w-6" />}
                    model="info_category"
                    routeName={() => route('info-categories.index')}
                    buttonText={t('common.back')}
                    theme="purple"
                    buttonSize="lg"
                    showBackButton={true}
                    backRouteName={() => route('info-categories.index')}
                    backButtonText={t('common.back_to_list')}
                    showButton={false}
                />

                <CanUpdate model="info_category">
                    <Card className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-6 p-6">
                                <div className="space-y-3">
                                    <Label htmlFor="name" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {t('info_categories.form.name_label')} *
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('name', e.target.value)}
                                        required
                                        placeholder={t('info_categories.form.name_placeholder')}
                                        className="h-12 rounded-lg border-gray-300 bg-white text-lg text-gray-900 focus:border-purple-500 focus:ring-purple-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                    />
                                    {errors.name && (
                                        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                            <X className="h-4 w-4" />
                                            {errors.name}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="code" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {t('info_categories.form.code_label')}
                                    </Label>
                                    <Input
                                        id="code"
                                        value={data.code}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('code', e.target.value)}
                                        placeholder={t('info_categories.form.code_placeholder')}
                                        className="h-12 rounded-lg border-gray-300 bg-white text-lg text-gray-900 focus:border-purple-500 focus:ring-purple-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                    />
                                    {errors.code && (
                                        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                            <X className="h-4 w-4" />
                                            {errors.code}
                                        </div>
                                    )}
                                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">{t('info_categories.form.code_help')}</p>
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="description" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {t('info_categories.form.description_label')}
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                                        rows={4}
                                        placeholder={t('info_categories.form.description_placeholder')}
                                        className="resize-none rounded-lg border-gray-300 bg-white text-lg text-gray-900 focus:border-purple-500 focus:ring-purple-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                    />
                                    {errors.description && (
                                        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                            <X className="h-4 w-4" />
                                            {errors.description}
                                        </div>
                                    )}
                                </div>
                            </CardContent>

                            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-600 dark:bg-gray-700">
                                <div className="flex items-center justify-end gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                        className="h-10 rounded-lg bg-gray-900 border-gray-300 px-6 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-400 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                    >
                                        {t('common.cancel')}
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="h-10 rounded-lg bg-purple-600 px-6 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-purple-700 hover:shadow-md"
                                    >
                                        {processing ? (
                                            <div className="flex items-center gap-2">
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                                {t('common.saving')}
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Save className="h-4 w-4" />
                                                {t('common.save')}
                                            </div>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Card>
                </CanUpdate>
            </div>
        </AppLayout>
    );
}
