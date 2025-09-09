import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, FileText, BarChart3, Save, X } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';
import { usePermissions } from '@/hooks/use-permissions';
import { CanCreate } from '@/components/ui/permission-guard';
import Header from '@/components/template/header';
import FooterButtons from '@/components/template/FooterButtons';

export default function InfoCategoriesCreate() {
  const { canCreate } = usePermissions();
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
      title: t('info_categories.create.title'),
      href: '#',
    },
  ];

  const { data, setData, post, processing, errors } = useForm({
    name: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('info-categories.store'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('info_categories.create.title')} />
      
      <div className="container px-0 py-6">
        <Header
          title={t('info_categories.create.title')}
          description={t('info_categories.create.description')}
          icon={<FileText className="h-6 w-6 text-white" />}
          model="info_category"
          routeName="info-categories.create"
          buttonText={t('common.save')}
          theme="purple"
          buttonSize="lg"
          showBackButton={true}
          backRouteName="info-categories.index"
          backButtonText={t('common.back')}
        />

        <CanCreate model="info_category">
          <Card className="shadow-2xl overflow-hidden bg-gradient-to-bl from-white dark:from-gray-800 to-purple-50/30 dark:to-purple-900/20 border-0">
            <form onSubmit={handleSubmit}>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-lg font-semibold text-purple-900 dark:text-purple-200">
                    {t('info_categories.form.name_label')} *
                  </Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('name', e.target.value)}
                    required
                    placeholder={t('info_categories.form.name_placeholder')}
                    className="h-12 text-lg border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 rounded-xl shadow-lg"
                  />
                  {errors.name && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <X className="h-4 w-4" />
                      {errors.name}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="description" className="text-lg font-semibold text-purple-900 dark:text-purple-200">
                    {t('info_categories.form.description_label')}
                  </Label>
                  <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                    rows={4}
                    placeholder={t('info_categories.form.description_placeholder')}
                    className="text-lg border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 rounded-xl shadow-lg resize-none"
                  />
                  {errors.description && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <X className="h-4 w-4" />
                      {errors.description}
                    </div>
                  )}
                </div>
              </CardContent>

              <FooterButtons
                onCancel={() => window.history.back()}
                onSubmit={() => {}}
                processing={processing}
                cancelText={t('common.cancel')}
                submitText={t('common.save')}
                savingText={t('common.saving')}
              />
            </form>
          </Card>
        </CanCreate>
      </div>
    </AppLayout>
  );
}
