import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, FileText, BarChart3, X } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';
import { usePermissions } from '@/hooks/use-permissions';
import { CanCreate } from '@/components/ui/permission-guard';
import { useState } from 'react';
import Header from '@/components/template/header';
import FooterButtons from '@/components/template/FooterButtons';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit the form
    post(route('info-types.store'));
  };

  // Access control functions
  const handleUserSelect = (userId: number) => {
    if (!selectedUsers.includes(userId)) {
      setSelectedUsers(prev => [...prev, userId]);
      setData('access_users', [...selectedUsers, userId]);
    }
  };

  const handleUserRemove = (userId: number) => {
    const newSelectedUsers = selectedUsers.filter(id => id !== userId);
    setSelectedUsers(newSelectedUsers);
    setData('access_users', newSelectedUsers);
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
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
              <Button asChild variant="outline" size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105">
                <Link href={route('info-types.index')} className="flex items-center gap-3">
                  <ArrowLeft className="h-5 w-5" />
                  {t('info_types.create.back_button')}
                </Link>
              </Button>
            </>
          }
        />

        {/* Create Form Card */}
        <CanCreate model="info_type">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-8">
              <Card className="shadow-2xl bg-gradient-to-bl from-white dark:from-gray-800 to-purple-50/30 dark:to-purple-900/20 border-0 overflow-hidden">

                <CardContent className="p-8 space-y-8">
                  {/* Name Field */}
                  <div className="space-y-4">
                    <Label htmlFor="name" className="text-lg font-semibold text-purple-800 dark:text-purple-200 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {t('info_types.create.name_label')} *
                    </Label>
                    <div className="relative">
                      <Input
                        id="name"
                        value={data.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('name', e.target.value)}
                        required
                        className="h-12 text-lg border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 rounded-xl shadow-lg"
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

                      {/* Code Field */}
                      <div className="space-y-4">
                        <Label htmlFor="code" className="text-lg font-semibold text-purple-800 dark:text-purple-200 flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          {t('info_types.create.code_label')}
                        </Label>
                        <div className="relative">
                          <Input
                            id="code"
                            value={data.code}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('code', e.target.value)}
                            className="h-12 text-lg border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 rounded-xl shadow-lg"
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

                  {/* Description Field */}
                  <div className="space-y-4">
                    <Label htmlFor="description" className="text-lg font-semibold text-purple-800 dark:text-purple-200 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {t('info_types.create.description_label')}
                    </Label>
                    <div className="relative">
                      <Textarea
                        id="description"
                        value={data.description}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                        rows={4}
                        className="text-lg border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 shadow-lg resize-none"
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
