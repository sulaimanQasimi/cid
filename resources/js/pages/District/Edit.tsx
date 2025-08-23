import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, FileText, BarChart3, Pencil, X, MapPin, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';
import { usePermissions } from '@/hooks/use-permissions';
import { CanUpdate } from '@/components/ui/permission-guard';
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
        {/* Modern Header with Glassmorphism */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-purple-600 via-indigo-600 to-blue-600 p-8 lg:p-12 text-white shadow-2xl mb-8 group">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="absolute top-0 left-0 w-80 h-80 bg-white/10 rounded-full -translate-y-40 -translate-x-40 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 translate-x-32 blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full -translate-x-16 -translate-y-16 blur-xl group-hover:scale-150 transition-transform duration-500"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8">
            <div className="flex items-center gap-8">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => window.history.back()}
                className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105 group/btn"
              >
                <div className="p-1 bg-white/20 rounded-lg group-hover/btn:scale-110 transition-transform duration-300">
                  <ArrowRight className="h-5 w-5" />
                </div>
                {t('common.back')}
              </Button>

              <div className="p-6 bg-white/20 backdrop-blur-md rounded-3xl border border-white/30 shadow-2xl group-hover:scale-105 transition-transform duration-300">
                <MapPin className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl tracking-tight">{t('districts.edit.title', { name: district.name })}</h2>
                <div className="text-white/90 flex items-center gap-3 text-xl font-medium">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  {t('districts.edit.description')}
                </div>
              </div>
            </div>
          </div>
        </div>

        <CanUpdate model="district">
          <Card className="shadow-2xl overflow-hidden bg-gradient-to-bl from-white to-purple-50/30 border-0 rounded-3xl">
            <CardHeader className="bg-gradient-to-l from-purple-500 to-purple-600 text-white py-6">
              <CardTitle className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
                  <Pencil className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{t('districts.edit.form_title')}</div>
                  <div className="text-purple-100 text-sm font-medium">{t('districts.edit.form_description')}</div>
                </div>
              </CardTitle>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="p-8 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-lg font-semibold text-purple-900">
                      {t('districts.form.name_label')} *
                    </Label>
                    <Input
                      id="name"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      placeholder={t('districts.form.name_placeholder')}
                      required
                      className="h-12 text-lg border-purple-200 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 to-white rounded-xl shadow-lg"
                    />
                    {errors.name && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <X className="h-4 w-4" />
                        {errors.name}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="code" className="text-lg font-semibold text-purple-900">
                      {t('districts.form.code_label')} *
                    </Label>
                    <Input
                      id="code"
                      value={data.code}
                      onChange={(e) => setData('code', e.target.value)}
                      placeholder={t('districts.form.code_placeholder')}
                      required
                      className="h-12 text-lg border-purple-200 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 to-white rounded-xl shadow-lg"
                    />
                    {errors.code && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <X className="h-4 w-4" />
                        {errors.code}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="province_id" className="text-lg font-semibold text-purple-900">
                    {t('districts.form.province_label')} *
                  </Label>
                  <Select
                    value={data.province_id.toString()}
                    onValueChange={(value) => setData('province_id', value)}
                    required
                  >
                    <SelectTrigger className="h-12 text-lg border-purple-200 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 to-white rounded-xl shadow-lg">
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
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <X className="h-4 w-4" />
                      {errors.province_id}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="description" className="text-lg font-semibold text-purple-900">
                    {t('districts.form.description_label')}
                  </Label>
                  <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder={t('districts.form.description_placeholder')}
                    rows={4}
                    className="text-lg border-purple-200 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 to-white rounded-xl shadow-lg resize-none"
                  />
                  {errors.description && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <X className="h-4 w-4" />
                      {errors.description}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="status" className="text-lg font-semibold text-purple-900">
                    {t('districts.form.status_label')} *
                  </Label>
                  <Select
                    value={data.status}
                    onValueChange={(value) => setData('status', value)}
                    required
                  >
                    <SelectTrigger className="h-12 text-lg border-purple-200 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 to-white rounded-xl shadow-lg">
                      <SelectValue placeholder={t('districts.form.status_placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{t('districts.form.status_active')}</SelectItem>
                      <SelectItem value="inactive">{t('districts.form.status_inactive')}</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <X className="h-4 w-4" />
                      {errors.status}
                    </div>
                  )}
                </div>
              </CardContent>

              <div className="px-8 py-6 bg-gradient-to-l from-purple-50 to-white border-t border-purple-200">
                <div className="flex items-center justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.history.back()}
                    className="h-12 px-8 text-lg font-semibold border-purple-300 text-purple-700 hover:bg-purple-100 hover:border-purple-400 rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={processing}
                    className="h-12 px-8 bg-gradient-to-l from-purple-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg font-semibold"
                  >
                    {processing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
            </form>
          </Card>
        </CanUpdate>
      </div>
    </AppLayout>
  );
}
