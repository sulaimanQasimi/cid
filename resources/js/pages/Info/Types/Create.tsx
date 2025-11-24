import FooterButtons from '@/components/template/FooterButtons';
import Header from '@/components/template/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CanCreate } from '@/components/ui/permission-guard';
import { Textarea } from '@/components/ui/textarea';
import { usePermissions } from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { useTranslation } from '@/lib/i18n/translate';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, BarChart3, FileText, X } from 'lucide-react';
import React, { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface CreateProps {
    users: User[];
}

type InfoTypeFormData = {
    name: string;
    code?: string;
    description?: string;
    access_users?: number[];
};

export default function InfoTypesCreate({ users }: CreateProps) {
    const { t } = useTranslation();
    const { canCreate } = usePermissions();

    const { data, setData, post, processing, errors } = useForm<InfoTypeFormData>({
        name: '',
        code: '',
        description: '',
        access_users: [] as number[],
    });

    // Access control state
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [userSearchTerm, setUserSearchTerm] = useState<string>('');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('info.page_title'),
            href: route('info-types.index'),
        },
        {
            title: t('info_types.page_title'),
            href: route('info-types.index'),
        },
        {
            title: t('info_types.create.page_title'),
            href: '#',
        },
    ];

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) {
            e.preventDefault();
        }
        // Submit the form
        post(route('info-types.store'));
    };

    // Access control functions
    const handleUserSelect = (userId: number) => {
        if (!selectedUsers.includes(userId)) {
            setSelectedUsers((prev) => [...prev, userId]);
            setData('access_users', [...selectedUsers, userId]);
        }
    };

    const handleUserRemove = (userId: number) => {
        const newSelectedUsers = selectedUsers.filter((id) => id !== userId);
        setSelectedUsers(newSelectedUsers);
        setData('access_users', newSelectedUsers);
    };

    // Filter users based on search term
    const filteredUsers = users.filter(
        (user) => user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) || user.email.toLowerCase().includes(userSearchTerm.toLowerCase()),
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('info_types.create.page_title')} />

            <div className="container px-0 py-6">
                <Header
                    title={t('info_types.create.page_title')}
                    description={t('info_types.create.page_description')}
                    icon={<FileText className="h-6 w-6 text-white" />}
                    model="info_type"
                    routeName="info-types.create"
                    buttonText={t('info_types.create.save_button')}
                    theme="purple"
                    buttonSize="lg"
                    showBackButton={true}
                    backRouteName="info-types.index"
                    backButtonText={t('info_types.create.back_button')}
                    showButton={false}
                    actionButtons={
                        <>
                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="rounded-2xl border-white/30 bg-white/20 px-6 py-3 text-lg font-semibold text-white shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/30"
                            >
                                <Link href={route('info-types.index')} className="flex items-center gap-3">
                                    {t('info_types.create.back_button')}
                                     <ArrowLeft className="h-5 w-5" />
                                </Link>
                            </Button>
                        </>
                    }
                />

                {/* Create Form Card */}
                <CanCreate model="info_type">
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-8">
                            <Card className="overflow-hidden border-0 bg-gradient-to-bl from-white to-purple-50/30 shadow-2xl dark:from-gray-800 dark:to-purple-900/20">
                                <CardContent className="space-y-8 p-8">
                                    {/* Code Field */}
                                    <div className="space-y-4">
                                        <Label
                                            htmlFor="code"
                                            className="flex items-center gap-2 text-lg font-semibold text-purple-800 dark:text-purple-200"
                                        >
                                            <BarChart3 className="h-4 w-4" />
                                            {t('info_types.create.code_label')}
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="code"
                                                value={data.code}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('code', e.target.value)}
                                                className="h-12 rounded-xl border-purple-200 bg-gradient-to-l from-purple-50 to-white text-lg shadow-lg focus:border-purple-500 focus:ring-purple-500/20 dark:border-purple-700 dark:from-purple-900/30 dark:to-gray-800"
                                                placeholder={t('info_types.create.code_placeholder')}
                                            />
                                            {errors.code && (
                                                <div className="mt-2 flex items-center gap-2 text-red-600">
                                                    <X className="h-4 w-4" />
                                                    <p className="text-sm font-medium">{errors.code}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Name Field */}
                                    <div className="space-y-4">
                                        <Label
                                            htmlFor="name"
                                            className="flex items-center gap-2 text-lg font-semibold text-purple-800 dark:text-purple-200"
                                        >
                                            <FileText className="h-4 w-4" />
                                            {t('info_types.create.name_label')} *
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="name"
                                                value={data.name}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('name', e.target.value)}
                                                required
                                                className="h-12 rounded-xl border-purple-200 bg-gradient-to-l from-purple-50 to-white text-lg shadow-lg focus:border-purple-500 focus:ring-purple-500/20 dark:border-purple-700 dark:from-purple-900/30 dark:to-gray-800"
                                                placeholder={t('info_types.create.name_placeholder')}
                                            />
                                            {errors.name && (
                                                <div className="mt-2 flex items-center gap-2 text-red-600">
                                                    <X className="h-4 w-4" />
                                                    <p className="text-sm font-medium">{errors.name}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Description Field */}
                                    <div className="space-y-4">
                                        <Label
                                            htmlFor="description"
                                            className="flex items-center gap-2 text-lg font-semibold text-purple-800 dark:text-purple-200"
                                        >
                                            <FileText className="h-4 w-4" />
                                            {t('info_types.create.description_label')}
                                        </Label>
                                        <div className="relative">
                                            <Textarea
                                                id="description"
                                                value={data.description}
                                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                                                rows={4}
                                                className="resize-none border-purple-200 bg-gradient-to-l from-purple-50 to-white text-lg shadow-lg focus:border-purple-500 focus:ring-purple-500/20 dark:border-purple-700 dark:from-purple-900/30 dark:to-gray-800"
                                                placeholder={t('info_types.create.description_placeholder')}
                                            />
                                            {errors.description && (
                                                <div className="mt-2 flex items-center gap-2 text-red-600">
                                                    <X className="h-4 w-4" />
                                                    <p className="text-sm font-medium">{errors.description}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Form Actions */}
                            <FooterButtons
                                onCancel={() => window.history.back()}
                                onSubmit={handleSubmit}
                                processing={processing}
                                cancelText={t('info_types.create.cancel_button')}
                                submitText={t('info_types.create.save_button')}
                                savingText={t('info_types.create.saving_button')}
                            />
                        </div>
                    </form>
                </CanCreate>
            </div>
        </AppLayout>
    );
}
