import FooterButtons from '@/components/template/FooterButtons';
import Header from '@/components/template/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { useTranslation } from '@/lib/i18n/translate';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { AlertTriangle, BookText, Building2, FileText, Hash } from 'lucide-react';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Departments',
        href: route('departments.index'),
    },
    {
        title: 'Create',
        href: route('departments.create'),
    },
];

interface Props {
    auth: {
        permissions: string[];
    };
}

export default function DepartmentCreate({ auth }: Props) {
    const { t } = useTranslation();

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        code: '',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('departments.store'), {
            onSuccess: () => {
                // Redirect happens automatically from the controller
            },
        });
    };

    const handleFormSubmit = () => {
        post(route('departments.store'), {
            onSuccess: () => {
                // Redirect happens automatically from the controller
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('departments.create.page_title')} />
            <div className="container px-0 py-6">
                {/* Header Component */}
                <Header
                    title={t('departments.create.title')}
                    description={t('departments.create.description')}
                    icon={<Building2 className="h-6 w-6 text-white" />}
                    model="department"
                    routeName="departments.index"
                    buttonText={t('departments.create.back_to_list')}
                    theme="blue"
                />

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-8">
                        {/* Main Form Card */}
                        <Card className="overflow-hidden border-none bg-gradient-to-bl from-white to-blue-50/30 shadow-xl dark:from-gray-800 dark:to-gray-900">
                            <CardHeader className="border-b bg-gradient-to-l from-blue-500 to-blue-600 pb-4 text-white dark:from-blue-600 dark:to-blue-700">
                                <CardTitle className="flex items-center gap-3 text-lg">
                                    <div className="rounded-lg bg-white/20 p-2">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    {t('departments.create.form.title')}
                                </CardTitle>
                                <CardDescription className="text-blue-100">{t('departments.create.form.description')}</CardDescription>
                            </CardHeader>
                            <CardContent className="bg-white p-6 dark:bg-gray-800">
                                <div className="space-y-6">
                                    {/* Department Name */}
                                    <div className="space-y-3">
                                        <Label
                                            htmlFor="name"
                                            className="flex items-center gap-2 text-right text-base font-medium text-blue-700 dark:text-blue-300"
                                            dir="rtl"
                                        >
                                            <span className="text-red-500">*</span>
                                            {t('departments.create.fields.name')}
                                            <Building2 className="h-4 w-4" />
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                required
                                                placeholder={t('departments.create.placeholders.name')}
                                                className="h-12 border-blue-200 bg-gradient-to-l from-blue-50 to-white text-right text-gray-900 focus:border-blue-500 focus:ring-blue-500/20 dark:border-gray-600 dark:from-gray-700 dark:to-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
                                            />
                                        </div>
                                        {errors.name && (
                                            <p className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2 text-right text-sm font-medium text-red-500 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                                                <AlertTriangle className="h-4 w-4" />
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Department Code */}
                                    <div className="space-y-3">
                                        <Label
                                            htmlFor="code"
                                            className="flex items-center gap-2 text-right font-medium text-blue-700 dark:text-blue-300"
                                            dir="rtl"
                                        >
                                            <span className="text-red-500">*</span>
                                            {t('departments.create.fields.code')}
                                            <Hash className="h-4 w-4" />
                                        </Label>
                                        <Input
                                            id="code"
                                            value={data.code}
                                            onChange={(e) => setData('code', e.target.value)}
                                            required
                                            placeholder={t('departments.create.placeholders.code')}
                                            className="h-12 border-blue-200 bg-gradient-to-l from-blue-50 to-white text-right text-gray-900 focus:border-blue-500 focus:ring-blue-500/20 dark:border-gray-600 dark:from-gray-700 dark:to-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
                                        />
                                        {errors.code && (
                                            <p className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2 text-right text-sm font-medium text-red-500 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                                                <AlertTriangle className="h-4 w-4" />
                                                {errors.code}
                                            </p>
                                        )}
                                    </div>

                                    {/* Department Description */}
                                    <div className="space-y-3">
                                        <Label
                                            htmlFor="description"
                                            className="flex items-center gap-2 text-right font-medium text-blue-700 dark:text-blue-300"
                                            dir="rtl"
                                        >
                                            {t('departments.create.fields.description')}
                                            <BookText className="h-4 w-4" />
                                        </Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            rows={6}
                                            placeholder={t('departments.create.placeholders.description')}
                                            className="min-h-[180px] resize-none border-blue-200 bg-gradient-to-l from-blue-50 to-white text-right text-gray-900 focus:border-blue-500 focus:ring-blue-500/20 dark:border-gray-600 dark:from-gray-700 dark:to-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
                                        />
                                        {errors.description && (
                                            <p className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2 text-right text-sm font-medium text-red-500 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                                                <AlertTriangle className="h-4 w-4" />
                                                {errors.description}
                                            </p>
                                        )}

                                        <p className="mt-2 text-right text-xs text-neutral-500 dark:text-gray-400">
                                            {t('departments.create.description_helper')}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>

                            <FooterButtons
                                onCancel={() => reset()}
                                onSubmit={handleFormSubmit}
                                processing={processing}
                                cancelText={t('departments.create.reset')}
                                submitText={t('departments.create.save')}
                                savingText={t('departments.create.saving')}
                            />
                        </Card>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
