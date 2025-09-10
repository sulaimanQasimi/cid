import React from 'react';
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
import { CanUpdate } from '@/components/ui/permission-guard';
import Header from '@/components/template/header';
import FooterButtons from '@/components/template/FooterButtons';

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
}

interface District {
  id: number;
  name: string;
  label: string;
  color: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface NationalInsightCenterInfoItem {
  id: number;
  title: string;
  registration_number: string;
  description: string | null;
  date: string | null;
  confirmed: boolean;
  created_at: string;
  updated_at: string;
  nationalInsightCenterInfo: NationalInsightCenterInfo;
  infoCategory: InfoCategory | null;
  province: Province | null;
  district: District | null;
  creator: User | null;
}

interface EditProps {
  item: NationalInsightCenterInfoItem;
  nationalInsightCenterInfos: NationalInsightCenterInfo[];
  infoCategories: InfoCategory[];
  provinces: Province[];
  districts: District[];
}

export default function Edit({ item, nationalInsightCenterInfos, infoCategories, provinces, districts }: EditProps) {
  const { t } = useTranslation();
  const { canUpdate } = usePermissions();

  const { data, setData, put, processing, errors } = useForm({
    national_insight_center_info_id: item.national_insight_center_info_id,
    title: item.title,
    registration_number: item.registration_number,
    info_category_id: item.info_category_id || '',
    province_id: item.province_id || '',
    district_id: item.district_id || '',
    description: item.description || '',
    date: item.date || '',
  });

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('national_insight_center_info.page_title'),
      href: route('national-insight-center-infos.index'),
    },
    {
      title: item.nationalInsightCenterInfo.name,
      href: route('national-insight-center-infos.show', item.nationalInsightCenterInfo.id),
    },
    {
      title: t('national_insight_center_info_item.edit.title', { name: item.title }),
      href: '#',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('national-insight-center-info-items.update', item.id));
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('national_insight_center_info_item.edit.title', { name: item.title })} />

      <div className="container px-0 py-6">
        <Header
          title={t('national_insight_center_info_item.edit.title', { name: item.title })}
          description={t('national_insight_center_info_item.edit.description')}
          icon={<AlertTriangle className="h-6 w-6 text-white" />}
          model="national_insight_center_info_item"
          routeName="national-insight-center-info-items.edit"
          buttonText={t('national_insight_center_info_item.edit.save_button')}
          theme="purple"
          buttonSize="lg"
          showBackButton={true}
          backRouteName="national-insight-center-info-items.show"
          backRouteParams={{ item: item.id }}
          backButtonText={t('national_insight_center_info_item.edit.back_button')}
          showButton={false}
          actionButtons={
            <Button asChild variant="outline" size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105">
              <Link href={route('national-insight-center-info-items.show', item.id)} className="flex items-center gap-3">
                <ArrowLeft className="h-5 w-5" />
                {t('national_insight_center_info_item.edit.back_button')}
              </Link>
            </Button>
          }
        />

        <CanUpdate model="national_insight_center_info_item">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-8">
              <Card className="shadow-2xl bg-gradient-to-bl from-white dark:from-gray-800 to-purple-50/30 dark:to-purple-900/20 border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
                  <CardTitle className="text-xl font-bold flex items-center gap-3">
                    <AlertTriangle className="h-6 w-6" />
                    {t('national_insight_center_info_item.edit.basic_info')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="national_insight_center_info_id" className="text-base font-medium flex items-center gap-2 text-purple-700 dark:text-purple-300 text-right" dir="rtl">
                        {t('national_insight_center_info_item.edit.national_insight_center_info')} *
                      </Label>
                      <Select
                        value={data.national_insight_center_info_id.toString()}
                        onValueChange={(value) => setData('national_insight_center_info_id', parseInt(value))}
                      >
                        <SelectTrigger id="national_insight_center_info_id" className="h-12 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 text-right">
                          <SelectValue placeholder={t('national_insight_center_info_item.edit.select_national_insight_center_info')} />
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
                        {t('national_insight_center_info_item.edit.title')} *
                      </Label>
                      <Input
                        id="title"
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className="h-12 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 text-right"
                        placeholder={t('national_insight_center_info_item.edit.title_placeholder')}
                        dir="rtl"
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm">{errors.title}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="registration_number" className="text-base font-medium flex items-center gap-2 text-purple-700 dark:text-purple-300 text-right" dir="rtl">
                        {t('national_insight_center_info_item.edit.registration_number')} *
                      </Label>
                      <Input
                        id="registration_number"
                        type="text"
                        value={data.registration_number}
                        onChange={(e) => setData('registration_number', e.target.value)}
                        className="h-12 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 text-right"
                        placeholder={t('national_insight_center_info_item.edit.registration_number_placeholder')}
                        dir="rtl"
                      />
                      {errors.registration_number && (
                        <p className="text-red-500 text-sm">{errors.registration_number}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="info_category_id" className="text-base font-medium flex items-center gap-2 text-purple-700 dark:text-purple-300 text-right" dir="rtl">
                        {t('national_insight_center_info_item.edit.info_category')}
                      </Label>
                      <Select
                        value={data.info_category_id.toString()}
                        onValueChange={(value) => setData('info_category_id', value ? parseInt(value) : '')}
                      >
                        <SelectTrigger id="info_category_id" className="h-12 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 text-right">
                          <SelectValue placeholder={t('national_insight_center_info_item.edit.select_info_category')} />
                        </SelectTrigger>
                        <SelectContent>
                          {infoCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              <div className="flex items-center">
                                <div
                                  className="mr-2 h-3 w-3 rounded-full"
                                  style={{ backgroundColor: category.color }}
                                ></div>
                                {category.label}
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
                        {t('national_insight_center_info_item.edit.province')}
                      </Label>
                      <Select
                        value={data.province_id.toString()}
                        onValueChange={(value) => setData('province_id', value ? parseInt(value) : '')}
                      >
                        <SelectTrigger id="province_id" className="h-12 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 text-right">
                          <SelectValue placeholder={t('national_insight_center_info_item.edit.select_province')} />
                        </SelectTrigger>
                        <SelectContent>
                          {provinces.map((province) => (
                            <SelectItem key={province.id} value={province.id.toString()}>
                              <div className="flex items-center">
                                <div
                                  className="mr-2 h-3 w-3 rounded-full"
                                  style={{ backgroundColor: province.color }}
                                ></div>
                                {province.label}
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
                        {t('national_insight_center_info_item.edit.district')}
                      </Label>
                      <Select
                        value={data.district_id.toString()}
                        onValueChange={(value) => setData('district_id', value ? parseInt(value) : '')}
                      >
                        <SelectTrigger id="district_id" className="h-12 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 text-right">
                          <SelectValue placeholder={t('national_insight_center_info_item.edit.select_district')} />
                        </SelectTrigger>
                        <SelectContent>
                          {districts.map((district) => (
                            <SelectItem key={district.id} value={district.id.toString()}>
                              <div className="flex items-center">
                                <div
                                  className="mr-2 h-3 w-3 rounded-full"
                                  style={{ backgroundColor: district.color }}
                                ></div>
                                {district.label}
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
                      <Label htmlFor="date" className="text-base font-medium flex items-center gap-2 text-purple-700 dark:text-purple-300 text-right" dir="rtl">
                        {t('national_insight_center_info_item.edit.date')}
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={data.date}
                        onChange={(e) => setData('date', e.target.value)}
                        className="h-12 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 text-right"
                        dir="rtl"
                      />
                      {errors.date && (
                        <p className="text-red-500 text-sm">{errors.date}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-base font-medium flex items-center gap-2 text-purple-700 dark:text-purple-300 text-right" dir="rtl">
                      {t('national_insight_center_info_item.edit.description')}
                    </Label>
                    <Textarea
                      id="description"
                      value={data.description}
                      onChange={(e) => setData('description', e.target.value)}
                      className="min-h-[120px] border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 text-right resize-none"
                      placeholder={t('national_insight_center_info_item.edit.description_placeholder')}
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
                cancelText={t('national_insight_center_info_item.edit.cancel_button')}
                submitText={t('national_insight_center_info_item.edit.save_button')}
                savingText={t('national_insight_center_info_item.edit.saving_button')}
              />
            </div>
          </form>
        </CanUpdate>
      </div>
    </AppLayout>
  );
}
