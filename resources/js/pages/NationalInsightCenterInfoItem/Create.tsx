import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, X, AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';
import { usePermissions } from '@/hooks/use-permissions';
import { CanCreate } from '@/components/ui/permission-guard';
import Header from '@/components/template/header';
import FooterButtons from '@/components/template/FooterButtons';
import PersianDatePicker from '@/components/ui/PersianDatePicker';

interface NationalInsightCenterInfo {
  id: number;
  name: string;
  code: string;
  description: string | null;
}

interface InfoCategory {
  id: number;
  name: string;
    label: string;
  color: string;
}

interface Province {
  id: number;
  name: string;
  label: string;
  color: string;
  districts: District[];
}

interface District {
  id: number;
  name: string;
  label: string;
  color: string;
}

interface CreateProps {
  nationalInsightCenterInfos: NationalInsightCenterInfo[];
  infoCategories: InfoCategory[];
  provinces: Province[];
  districts: District[];
  nationalInsightCenterInfoId?: number;
}

export default function Create({ nationalInsightCenterInfos, infoCategories, provinces, nationalInsightCenterInfoId }: CreateProps) {
  const { t } = useTranslation();
  const { canCreate } = usePermissions();

  const { data, setData, post, processing, errors, reset } = useForm({
    national_insight_center_info_id: nationalInsightCenterInfoId || '',
    title: '',
    registration_number: '',
    info_category_id: null as number | null,
    province_id: null as number | null,
    district_id: null as number | null,
    description: '',
    date: '',
  });

  // Get districts for the selected province
  const selectedProvince = provinces.find(p => p.id === data.province_id);
  const availableDistricts = selectedProvince?.districts || [];

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('national_insight_center_info.page_title'),
      href: route('national-insight-center-infos.index'),
    },
    {
      title: t('national_insight_center_info_item.create.title'),
      href: '#',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('national-insight-center-info-items.store'));
  };

  const handleCancel = () => {
    if (nationalInsightCenterInfoId) {
      window.history.back();
    } else {
      window.location.href = route('national-insight-center-infos.index');
    }
  };

  const handleProvinceChange = (value: string) => {
    setData('province_id', value ? parseInt(value) : null);
    // Reset district when province changes
    setData('district_id', null);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('national_insight_center_info_item.create.title')} />

      <div className="container px-0 py-6">
        <Header
          title={t('national_insight_center_info_item.create.title')}
          description={t('national_insight_center_info_item.create.description')}
          icon={<AlertTriangle className="h-6 w-6 text-white" />}
          model="national_insight_center_info_item"
          routeName="national-insight-center-info-items.create"
          buttonText={t('national_insight_center_info_item.create.save_button')}
          theme="purple"
          buttonSize="lg"
          showBackButton={true}
          backRouteName={nationalInsightCenterInfoId ? () => route('national-insight-center-infos.show', { national_insight_center_info: nationalInsightCenterInfoId }) : 'national-insight-center-infos.index'}
               backButtonText={t('national_insight_center_info_item.create.back_button')}
          showButton={false}
          actionButtons={
            <Button asChild variant="outline" size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105">
              <Link href={nationalInsightCenterInfoId ? route('national-insight-center-infos.show', { national_insight_center_info: nationalInsightCenterInfoId }) : route('national-insight-center-infos.index')} className="flex items-center gap-3">
                <ArrowLeft className="h-5 w-5" />
                {t('national_insight_center_info_item.create.back_button')}
              </Link>
            </Button>
          }
        />

        <CanCreate model="national_insight_center_info_item">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-8">
              <Card className="shadow-2xl bg-gradient-to-bl from-white dark:from-gray-800 to-purple-50/30 dark:to-purple-900/20 border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
                  <CardTitle className="text-xl font-bold flex items-center gap-3">
                    <AlertTriangle className="h-6 w-6" />
                    {t('national_insight_center_info_item.create.basic_info')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="national_insight_center_info_id" className="text-base font-medium flex items-center gap-2 text-purple-700 dark:text-purple-300 text-right" dir="rtl">
                        {t('national_insight_center_info_item.create.national_insight_center_info')} *
                      </Label>
                      <Select
                        value={data.national_insight_center_info_id.toString()}
                        onValueChange={(value) => setData('national_insight_center_info_id', parseInt(value))}
                      >
                        <SelectTrigger id="national_insight_center_info_id" className="h-12 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 text-right">
                          <SelectValue placeholder={t('national_insight_center_info_item.create.select_national_insight_center_info')} />
                        </SelectTrigger>
                        <SelectContent>
                          {nationalInsightCenterInfos.map((info) => (
                            <SelectItem key={info.id} value={info.id.toString()}>
                              {info.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.national_insight_center_info_id && (
                        <p className="text-red-500 text-sm">{errors.national_insight_center_info_id}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-base font-medium flex items-center gap-2 text-purple-700 dark:text-purple-300 text-right" dir="rtl">
                        {t('national_insight_center_info_item.create.title')} *
                      </Label>
                      <Input
                        id="title"
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className="h-12 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 text-right"
                        placeholder={t('national_insight_center_info_item.create.title_placeholder')}
                        dir="rtl"
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm">{errors.title}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="registration_number" className="text-base font-medium flex items-center gap-2 text-purple-700 dark:text-purple-300 text-right" dir="rtl">
                        {t('national_insight_center_info_item.create.registration_number')} *
                      </Label>
                      <Input
                        id="registration_number"
                        type="text"
                        value={data.registration_number}
                        onChange={(e) => setData('registration_number', e.target.value)}
                        className="h-12 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 text-right"
                        placeholder={t('national_insight_center_info_item.create.registration_number_placeholder')}
                        dir="rtl"
                      />
                      {errors.registration_number && (
                        <p className="text-red-500 text-sm">{errors.registration_number}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="info_category_id" className="text-base font-medium flex items-center gap-2 text-purple-700 dark:text-purple-300 text-right" dir="rtl">
                        {t('national_insight_center_info_item.create.info_category')}
                      </Label>
                      <Select
                        value={data.info_category_id?.toString() || ''}
                        onValueChange={(value) => setData('info_category_id', value ? parseInt(value) : null)}
                      >
                        <SelectTrigger id="info_category_id" className="h-12 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 text-right">
                          <SelectValue placeholder={t('national_insight_center_info_item.create.select_info_category')} />
                        </SelectTrigger>
                        <SelectContent>
                          {infoCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              <div className="flex items-center">
                                <div
                                  className="mr-2 h-3 w-3 rounded-full"
                                  style={{ backgroundColor: category.color }}
                                ></div>
                                {category.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.info_category_id && (
                        <p className="text-red-500 text-sm">{errors.info_category_id}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="province_id" className="text-base font-medium flex items-center gap-2 text-purple-700 dark:text-purple-300 text-right" dir="rtl">
                        {t('national_insight_center_info_item.create.province')}
                      </Label>
                      <Select
                        value={data.province_id?.toString() || ''}
                        onValueChange={handleProvinceChange}
                      >
                        <SelectTrigger id="province_id" className="h-12 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 text-right">
                          <SelectValue placeholder={t('national_insight_center_info_item.create.select_province')} />
                        </SelectTrigger>
                        <SelectContent>
                          {provinces.map((province) => (
                            <SelectItem key={province.id} value={province.id.toString()}>
                              <div className="flex items-center">
                                <div
                                  className="mr-2 h-3 w-3 rounded-full"
                                  style={{ backgroundColor: province.color }}
                                ></div>
                                {province.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.province_id && (
                        <p className="text-red-500 text-sm">{errors.province_id}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="district_id" className="text-base font-medium flex items-center gap-2 text-purple-700 dark:text-purple-300 text-right" dir="rtl">
                        {t('national_insight_center_info_item.create.district')}
                      </Label>
                      <Select
                        value={data.district_id?.toString() || ''}
                        onValueChange={(value) => setData('district_id', value ? parseInt(value) : null)}
                        disabled={!data.province_id}
                      >
                        <SelectTrigger id="district_id" className="h-12 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 text-right disabled:opacity-50 disabled:cursor-not-allowed">
                          <SelectValue placeholder={
                            !data.province_id 
                              ? t('national_insight_center_info_item.create.select_province_first')
                              : t('national_insight_center_info_item.create.select_district')
                          } />
                        </SelectTrigger>
                        <SelectContent>
                          {availableDistricts.map((district) => (
                            <SelectItem key={district.id} value={district.id.toString()}>
                              <div className="flex items-center">
                                <div
                                  className="mr-2 h-3 w-3 rounded-full"
                                  style={{ backgroundColor: district.color }}
                                ></div>
                                {district.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.district_id && (
                        <p className="text-red-500 text-sm">{errors.district_id}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <PersianDatePicker
                        id="date"
                        label={t('national_insight_center_info_item.create.date')}
                        value={data.date}
                        onChange={(value) => setData('date', value)}
                        error={errors.date}
                        className="w-full h-12 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 text-right"
                      />
                      {errors.date && (
                        <p className="text-red-500 text-sm">{errors.date}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-base font-medium flex items-center gap-2 text-purple-700 dark:text-purple-300 text-right" dir="rtl">
                      {t('national_insight_center_info_item.create.description')}
                    </Label>
                    <Textarea
                      id="description"
                      value={data.description}
                      onChange={(e) => setData('description', e.target.value)}
                      className="min-h-[120px] border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 text-right resize-none"
                      placeholder={t('national_insight_center_info_item.create.description_placeholder')}
                      dir="rtl"
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm">{errors.description}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Form Actions */}
              <FooterButtons
                onCancel={handleCancel}
                onSubmit={() => {}}
                processing={processing}
                cancelText={t('national_insight_center_info_item.create.cancel_button')}
                submitText={t('national_insight_center_info_item.create.save_button')}
                savingText={t('national_insight_center_info_item.create.saving_button')}
              />
            </div>
          </form>
        </CanCreate>
      </div>
    </AppLayout>
  );
}
