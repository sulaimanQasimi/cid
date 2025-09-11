import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, FileText, BarChart3, Pencil, X, MapPin, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';
import { usePermissions } from '@/hooks/use-permissions';
import { CanUpdate } from '@/components/ui/permission-guard';
import Header from '@/components/template/header';
import FooterButtons from '@/components/template/FooterButtons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProvinceData {
  id: number;
  name: string;
}

interface DistrictData {
  id: number;
  name: string;
  code: string;
  description: string | null;
  province_id: number;
  status: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface EditProps {
  district: DistrictData;
  provinces: ProvinceData[];
}

export default function Edit({ district, provinces }: EditProps) {
  const { canUpdate } = usePermissions();
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
      title: district.name,
      href: route('districts.show', district.id),
    },
    {
      title: t('districts.edit.title', { name: district.name }),
      href: '#',
    },
  ];

  const { data, setData, put, processing, errors } = useForm({
    name: district.name || '',
    code: district.code || '',
    description: district.description || '',
    province_id: district.province_id.toString() || '',
    status: district.status || 'active',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('districts.update', district.id));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('districts.edit.title', { name: district.name })} />

      <div className="container px-0 py-6">
        {/* Custom Header Component */}
        <Header
          title={t('districts.edit.title', { name: district.name })}
          description={t('districts.edit.description')}
          icon={<MapPin className="h-6 w-6" />}
          model="district"
          routeName={() => ''}
          buttonText=""
          theme="purple"
          showButton={false}
          showBackButton={true}
          backRouteName={() => route('districts.show', district.id)}
          backButtonText={t('common.back')}
        />

        <CanUpdate model="district">
          <Card className="shadow-2xl overflow-hidden bg-gradient-to-bl from-white to-purple-50/30 dark:from-gray-800 dark:to-purple-900/20 border-0 ">

            <form id="district-edit-form" onSubmit={handleSubmit}>
              <CardContent className="p-8 space-y-6">
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
                      className="h-12 text-lg border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20 dark:focus:border-purple-400 dark:focus:ring-purple-400/20 bg-gradient-to-l from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800  shadow-lg"
                    />
                    {errors.name && (
                      <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
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
                      className="h-12 text-lg border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20 dark:focus:border-purple-400 dark:focus:ring-purple-400/20 bg-gradient-to-l from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800  shadow-lg"
                    />
                    {errors.code && (
                      <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
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
                  <Select
                    value={data.province_id.toString()}
                    onValueChange={(value) => setData('province_id', value)}
                    required
                  >
                    <SelectTrigger className="h-12 text-lg border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20 dark:focus:border-purple-400 dark:focus:ring-purple-400/20 bg-gradient-to-l from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800  shadow-lg">
                      <SelectValue placeholder={t('districts.form.province_placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map(province => (
                        <SelectItem key={province.id} value={province.id.toString()}>
                          {province.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.province_id && (
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
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
                    className="text-lg border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20 dark:focus:border-purple-400 dark:focus:ring-purple-400/20 bg-gradient-to-l from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800  shadow-lg resize-none"
                  />
                  {errors.description && (
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                      <X className="h-4 w-4" />
                      {errors.description}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="status" className="text-lg font-semibold text-purple-900 dark:text-purple-200">
                    {t('districts.form.status_label')} *
                  </Label>
                  <Select
                    value={data.status}
                    onValueChange={(value) => setData('status', value)}
                    required
                  >
                    <SelectTrigger className="h-12 text-lg border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20 dark:focus:border-purple-400 dark:focus:ring-purple-400/20 bg-gradient-to-l from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800 rounded-xl shadow-lg">
                      <SelectValue placeholder={t('districts.form.status_placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{t('districts.form.status_active')}</SelectItem>
                      <SelectItem value="inactive">{t('districts.form.status_inactive')}</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && (
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                      <X className="h-4 w-4" />
                      {errors.status}
                    </div>
                  )}
                </div>
              </CardContent>

              <div className="px-8 py-6 bg-gradient-to-l from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800">
                <FooterButtons
                  onCancel={() => window.history.back()}
                  onSubmit={() => {
                    const form = document.getElementById('district-edit-form') as HTMLFormElement;
                    if (form) {
                      form.requestSubmit();
                    }
                  }}
                  processing={processing}
                  cancelText={t('common.cancel')}
                  submitText={t('common.save')}
                  savingText={t('common.saving')}
                />
              </div>
            </form>
          </Card>
        </CanUpdate>
      </div>
    </AppLayout>
  );
}
