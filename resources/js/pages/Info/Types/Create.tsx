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

export default function InfoTypesCreate() {
  const { t } = useTranslation();
  const { canCreate } = usePermissions();
  
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    description: '',
  });

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('info.page_title'),
      href: route('infos.index'),
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
    post(route('info-types.store'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('info_types.create.page_title')} />
      
      <div className="container px-0 py-6">
        {/* Modern Header with Glassmorphism */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-purple-600 via-indigo-600 to-blue-600 p-8 lg:p-12 text-white shadow-2xl mb-8 group">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="absolute top-0 left-0 w-80 h-80 bg-white/10 rounded-full -translate-y-40 -translate-x-40 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 translate-x-32 blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full -translate-x-16 -translate-y-16 blur-xl group-hover:scale-150 transition-transform duration-500"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8">
            <div className="flex items-center gap-8">
              <div className="p-6 bg-white/20 backdrop-blur-md rounded-3xl border border-white/30 shadow-2xl group-hover:scale-105 transition-transform duration-300">
                <FileText className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl tracking-tight">{t('info_types.create.page_title')}</h2>
                <div className="text-white/90 flex items-center gap-3 text-xl font-medium">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  {t('info_types.create.page_description')}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button asChild variant="outline" size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105">
                <a href={route('info-types.index')} className="flex items-center gap-3">
                  <ArrowLeft className="h-5 w-5" />
                  {t('info_types.create.back_button')}
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Create Form Card */}
        <CanCreate model="info_type">
          <Card className="shadow-2xl bg-gradient-to-bl from-white to-purple-50/30 border-0 rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-l from-purple-500 to-purple-600 text-white py-6">
              <CardTitle className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
                  <Save className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{t('info_types.create.form_title')}</div>
                  <div className="text-purple-100 text-sm font-medium">{t('info_types.create.form_description')}</div>
                </div>
              </CardTitle>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="p-8 space-y-8">
                {/* Name Field */}
                <div className="space-y-4">
                  <Label htmlFor="name" className="text-lg font-semibold text-purple-800">
                    {t('info_types.create.name_label')} *
                  </Label>
                  <div className="relative">
                    <Input
                      id="name"
                      value={data.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('name', e.target.value)}
                      required
                      className="h-12 text-lg border-purple-200 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 to-white rounded-xl shadow-lg"
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
                  <Label htmlFor="description" className="text-lg font-semibold text-purple-800">
                    {t('info_types.create.description_label')}
                  </Label>
                  <div className="relative">
                    <Textarea
                      id="description"
                      value={data.description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                      rows={4}
                      className="text-lg border-purple-200 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 to-white rounded-xl shadow-lg resize-none"
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

              {/* Form Actions */}
              <div className="px-8 py-6 bg-gradient-to-l from-purple-50 to-white border-t border-purple-200 flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                  className="h-12 px-6 shadow-lg border-purple-300 text-purple-700 hover:bg-purple-100 hover:border-purple-400 rounded-xl transition-all duration-300 hover:scale-105 text-lg font-semibold"
                >
                  {t('info_types.create.cancel_button')}
                </Button>
                <Button 
                  type="submit" 
                  disabled={processing}
                  className="h-12 px-8 bg-gradient-to-l from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 shadow-2xl rounded-xl transition-all duration-300 hover:scale-105 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {t('info_types.create.saving_button')}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="h-5 w-5" />
                      {t('info_types.create.save_button')}
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </CanCreate>
      </div>
    </AppLayout>
  );
}
