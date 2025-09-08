import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Camera, Calendar, UserRound, FileText, BookText, Shield, Users, MapPin, Phone, IdCard, Home, Building2, Clock, Gavel, FileCheck, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n/translate';
import { formatPersianDate } from '@/lib/utils/date';
import Header from '@/components/template/header';


const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Criminal Records',
    href: route('criminals.index'),
  },
  {
    title: 'Create',
    href: route('criminals.create'),
  },
];

interface Department {
  id: number;
  name: string;
  code: string;
}

interface Props {
  departments?: Department[];
  auth: {
    permissions: string[];
  };
}

export default function CriminalCreate({ departments = [], auth }: Props) {
  const { t } = useTranslation();
  // Content tabs state
  const [activeTab, setActiveTab] = useState<string>('other');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [persianDateDisplay, setPersianDateDisplay] = useState<string>('');

  const { data, setData, post, processing, errors, reset } = useForm({
    photo: null as File | null,
    number: '',
    name: '',
    father_name: '',
    grandfather_name: '',
    id_card_number: '',
    phone_number: '',
    original_residence: '',
    current_residence: '',
    crime_type: '',
    arrest_location: '',
    arrested_by: '',
    arrest_date: '',
    referred_to: '',
    final_verdict: '',
    notes: '',
    department_id: 'none',
  });

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Handle photo change
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setData('photo', file);

      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle date change and show Persian format
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const gregorianDate = e.target.value;
    setData('arrest_date', gregorianDate);

    if (gregorianDate) {
      // Convert to Persian date for display
      const persianDate = formatPersianDate(gregorianDate);
      setPersianDateDisplay(persianDate);
    } else {
      setPersianDateDisplay('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('criminals.store'), {
      forceFormData: true,
      onSuccess: () => {
        // Redirect happens automatically from the controller
      }
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('criminal.create.page_title')} />
      <div className="container px-0 py-6">
        {/* Header with gradient background */}

        <Header
          title={t('criminal.create.title')}
          description={t('criminal.create.description')}
          icon={<Shield className="h-6 w-6 text-white" />}
          model="criminal"
          routeName={route('criminals.create')}
          theme="orange"
          showButton={false}
          buttonText={t('criminal.create.back_to_list')}
          backRouteName={route('criminals.index')}
          backButtonText={t('common.back_to_list')}
        />


        <form onSubmit={handleSubmit} >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Photo Upload Card */}
            <div className="lg:col-span-1">
              <Header
                title={t('criminal.create.photo.title')}
                description={t('criminal.create.photo.description')}
                icon={<Camera className="h-6 w-6 text-white" />}
                model="criminal"
                routeName="criminals.create"
                buttonText={t('criminal.create.photo.title')}
                theme="red"
                showButton={false}
              />
              <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-bl from-white dark:from-gray-800 to-red-50/30 dark:to-red-900/20">
              <CardContent className="p-6 space-y-6">
                <div className="flex flex-col items-center justify-center">
                  <div className={cn(
                    "relative mb-6 h-56 w-56 overflow-hidden rounded-2xl border-2 border-dashed",
                    "bg-gradient-to-bl from-red-50 dark:from-red-900/20 to-red-100 dark:to-red-800/30 text-center transition-all duration-300 hover:border-red-400/50 dark:hover:border-red-500/50 hover:shadow-xl",
                    "flex items-center justify-center group",
                    photoPreview ? "border-red-400/50 dark:border-red-500/50 shadow-lg" : "border-red-200 dark:border-red-700"
                  )}>
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt={t('criminal.create.photo.preview_alt')}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center p-6">
                        <div className="p-4 bg-gradient-to-br from-red-100 dark:from-red-800 to-red-200 dark:to-red-700 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300">
                          <Camera className="h-12 w-12 text-red-600 dark:text-red-400" />
                        </div>
                        <p className="text-sm text-red-700 dark:text-red-300 font-medium">{t('criminal.create.photo.no_photo')}</p>
                        <p className="text-xs text-red-500 dark:text-red-400 dark:text-red-400 mt-1">{t('criminal.create.photo.hint')}</p>
                      </div>
                    )}
                  </div>
                  <Label
                    htmlFor="photo"
                    className={cn(
                      "cursor-pointer rounded-full px-6 py-3 text-sm font-medium transition-all duration-300",
                      "bg-gradient-to-l from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl hover:scale-105"
                    )}
                  >
                    {photoPreview ? t('criminal.create.photo.change') : t('criminal.create.photo.upload')}
                  </Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="sr-only"
                  />
                  {errors.photo && <p className="mt-3 text-sm text-red-500 dark:text-red-400 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-200 dark:border-red-700">{errors.photo}</p>}

                  <div className="mt-6 text-center max-w-xs">
                    <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-700">
                      {t('criminal.create.photo.helper_text')}
                    </p>
                  </div>
                </div>
              </CardContent>
              </Card>
            </div>

            {/* Main Form Card */}
            <div className="lg:col-span-2">
              <Header
                title={t('criminal.create.form.title')}
                description={t('criminal.create.form.description')}
                icon={<FileText className="h-6 w-6 text-white" />}
                model="criminal"
                routeName="criminals.create"
                buttonText={t('criminal.create.form.title')}
                theme="orange"
                showButton={false}
              />
              <Card className="border-none shadow-xl overflow-hidden bg-gradient-to-bl from-white dark:from-gray-800 to-orange-50/30 dark:to-orange-900/20">
              <CardContent className="p-6">
                <Tabs defaultValue="other" value={activeTab} onValueChange={handleTabChange} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6 rounded-xl p-1 bg-gradient-to-l from-orange-100 dark:from-orange-900/30 to-orange-200 dark:to-orange-800/30 shadow-lg">
                    <TabsTrigger
                      value="other"
                      className={cn(
                        "data-[state=active]:bg-gradient-to-l data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg flex items-center gap-2",
                        "transition-all duration-300 rounded-lg"
                      )}
                    >
                      <BookText className="h-4 w-4" />
                      <span>{t('criminal.create.tabs.other')}</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="crime"
                      className={cn(
                        "data-[state=active]:bg-gradient-to-l data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg flex items-center gap-2",
                        "transition-all duration-300 rounded-lg"
                      )}
                    >
                      <FileText className="h-4 w-4" />
                      <span>{t('criminal.create.tabs.crime')}</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="personal"
                      className={cn(
                        "data-[state=active]:bg-gradient-to-l data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg flex items-center gap-2",
                        "transition-all duration-300 rounded-lg"
                      )}
                    >
                      <UserRound className="h-4 w-4" />
                      <span>{t('criminal.create.tabs.personal')}</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Personal Details Tab */}
                  <TabsContent value="personal" className="space-y-6 pt-2">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-base font-medium flex items-center gap-2 text-orange-700 dark:text-orange-300 dark:text-orange-300 text-right" dir="rtl">
                        <Users className="h-4 w-4" />
                        {t('criminal.create.fields.full_name')}
                        <span className="text-red-500 dark:text-red-400">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="name"
                          value={data.name}
                          onChange={(e) => setData('name', e.target.value)}
                          required
                          placeholder={t('criminal.create.placeholders.full_name')}
                          className="h-12 border-orange-200 dark:border-orange-700 dark:border-orange-700 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-orange-500/20 dark:focus:ring-orange-400/20 bg-gradient-to-l from-orange-50 dark:from-orange-900/20 to-white dark:to-gray-800 text-right"
                        />
                      </div>
                      {errors.name && <p className="text-sm text-red-500 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-200 dark:border-red-700 flex items-center gap-2 text-right">
                        <AlertTriangle className="h-4 w-4" />
                        {errors.name}
                      </p>}
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label htmlFor="father_name" className="font-medium flex items-center gap-2 text-orange-700 dark:text-orange-300 text-right" dir="rtl">
                          <Users className="h-4 w-4" />
                          {t('criminal.create.fields.father_name')}
                        </Label>
                        <Input
                          id="father_name"
                          value={data.father_name}
                          onChange={(e) => setData('father_name', e.target.value)}
                          placeholder={t('criminal.create.placeholders.father_name')}
                          className="h-12 border-orange-200 dark:border-orange-700 dark:border-orange-700 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-orange-500/20 dark:focus:ring-orange-400/20 bg-gradient-to-l from-orange-50 dark:from-orange-900/20 to-white dark:to-gray-800 text-right"
                        />
                        {errors.father_name && <p className="text-sm text-red-500 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-200 dark:border-red-700 flex items-center gap-2 text-right">
                          <AlertTriangle className="h-4 w-4" />
                          {errors.father_name}
                        </p>}
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="grandfather_name" className="font-medium flex items-center gap-2 text-orange-700 dark:text-orange-300 text-right" dir="rtl">
                          <Users className="h-4 w-4" />
                          {t('criminal.create.fields.grandfather_name')}
                        </Label>
                        <Input
                          id="grandfather_name"
                          value={data.grandfather_name}
                          onChange={(e) => setData('grandfather_name', e.target.value)}
                          placeholder={t('criminal.create.placeholders.grandfather_name')}
                          className="h-12 border-orange-200 dark:border-orange-700 dark:border-orange-700 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-orange-500/20 dark:focus:ring-orange-400/20 bg-gradient-to-l from-orange-50 dark:from-orange-900/20 to-white dark:to-gray-800 text-right"
                        />
                        {errors.grandfather_name && <p className="text-sm text-red-500 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-200 dark:border-red-700 flex items-center gap-2 text-right">
                          <AlertTriangle className="h-4 w-4" />
                          {errors.grandfather_name}
                        </p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label htmlFor="id_card_number" className="font-medium flex items-center gap-2 text-orange-700 dark:text-orange-300 text-right" dir="rtl">
                          <IdCard className="h-4 w-4" />
                          {t('criminal.create.fields.id_card_number')}
                        </Label>
                        <Input
                          id="id_card_number"
                          value={data.id_card_number}
                          onChange={(e) => setData('id_card_number', e.target.value)}
                          placeholder={t('criminal.create.placeholders.id_card_number')}
                          className="h-12 border-orange-200 dark:border-orange-700 dark:border-orange-700 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-orange-500/20 dark:focus:ring-orange-400/20 bg-gradient-to-l from-orange-50 dark:from-orange-900/20 to-white dark:to-gray-800 text-right"
                        />
                        {errors.id_card_number && <p className="text-sm text-red-500 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-200 dark:border-red-700 flex items-center gap-2 text-right">
                          <AlertTriangle className="h-4 w-4" />
                          {errors.id_card_number}
                        </p>}
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="phone_number" className="font-medium flex items-center gap-2 text-orange-700 dark:text-orange-300 text-right" dir="rtl">
                          <Phone className="h-4 w-4" />
                          {t('criminal.create.fields.phone_number')}
                        </Label>
                        <Input
                          id="phone_number"
                          value={data.phone_number}
                          onChange={(e) => setData('phone_number', e.target.value)}
                          placeholder={t('criminal.create.placeholders.phone_number')}
                          className="h-12 border-orange-200 dark:border-orange-700 dark:border-orange-700 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-orange-500/20 dark:focus:ring-orange-400/20 bg-gradient-to-l from-orange-50 dark:from-orange-900/20 to-white dark:to-gray-800 text-right"
                        />
                        {errors.phone_number && <p className="text-sm text-red-500 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-200 dark:border-red-700 flex items-center gap-2 text-right">
                          <AlertTriangle className="h-4 w-4" />
                          {errors.phone_number}
                        </p>}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="original_residence" className="font-medium flex items-center gap-2 text-orange-700 dark:text-orange-300 text-right" dir="rtl">
                        <Home className="h-4 w-4" />
                        {t('criminal.create.fields.original_residence')}
                      </Label>
                      <Textarea
                        id="original_residence"
                        value={data.original_residence}
                        onChange={(e) => setData('original_residence', e.target.value)}
                        rows={2}
                        placeholder={t('criminal.create.placeholders.original_residence')}
                        className="min-h-[80px] resize-none border-orange-200 dark:border-orange-700 dark:border-orange-700 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-orange-500/20 dark:focus:ring-orange-400/20 bg-gradient-to-l from-orange-50 dark:from-orange-900/20 to-white dark:to-gray-800 text-right"
                      />
                      {errors.original_residence && <p className="text-sm text-red-500 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-200 dark:border-red-700 flex items-center gap-2 text-right">
                        <AlertTriangle className="h-4 w-4" />
                        {errors.original_residence}
                      </p>}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="current_residence" className="font-medium flex items-center gap-2 text-orange-700 dark:text-orange-300 text-right" dir="rtl">
                        <MapPin className="h-4 w-4" />
                        {t('criminal.create.fields.current_residence')}
                      </Label>
                      <Textarea
                        id="current_residence"
                        value={data.current_residence}
                        onChange={(e) => setData('current_residence', e.target.value)}
                        rows={2}
                        placeholder={t('criminal.create.placeholders.current_residence')}
                        className="min-h-[80px] resize-none border-orange-200 dark:border-orange-700 dark:border-orange-700 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-orange-500/20 dark:focus:ring-orange-400/20 bg-gradient-to-l from-orange-50 dark:from-orange-900/20 to-white dark:to-gray-800 text-right"
                      />
                      {errors.current_residence && <p className="text-sm text-red-500 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-200 dark:border-red-700 flex items-center gap-2 text-right">
                        <AlertTriangle className="h-4 w-4" />
                        {errors.current_residence}
                      </p>}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="department_id" className="font-medium flex items-center gap-2 text-orange-700 dark:text-orange-300 text-right" dir="rtl">
                        <Building2 className="h-4 w-4" />
                        {t('criminal.create.fields.department')}
                      </Label>
                      <Select
                        value={data.department_id}
                        onValueChange={(value) => setData('department_id', value)}
                      >
                        <SelectTrigger id="department_id" className="h-12 border-orange-200 dark:border-orange-700 dark:border-orange-700 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-orange-500/20 dark:focus:ring-orange-400/20 bg-gradient-to-l from-orange-50 dark:from-orange-900/20 to-white dark:to-gray-800 text-right">
                          <SelectValue placeholder={t('criminal.create.placeholders.department')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">{t('criminal.create.none')}</SelectItem>
                          {departments.length > 0 ? (
                            departments.map((department) => (
                              <SelectItem key={department.id} value={department.id.toString()}>
                                {department.name}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="p-2 text-sm text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 rounded-lg">{t('criminal.create.no_departments')}</div>
                          )}
                        </SelectContent>
                      </Select>
                      {errors.department_id && <p className="text-sm text-red-500 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-200 dark:border-red-700 flex items-center gap-2 text-right">
                        <AlertTriangle className="h-4 w-4" />
                        {errors.department_id}
                      </p>}
                    </div>
                  </TabsContent>

                  {/* Crime Details Tab */}
                  <TabsContent value="crime" className="space-y-6 pt-2">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label htmlFor="number" className="font-medium flex items-center gap-2 text-orange-700 dark:text-orange-300 text-right" dir="rtl">
                          <FileText className="h-4 w-4" />
                          {t('criminal.create.fields.record_number')}
                        </Label>
                        <Input
                          id="number"
                          value={data.number}
                          onChange={(e) => setData('number', e.target.value)}
                          placeholder={t('criminal.create.placeholders.record_number')}
                          className="h-11 text-right"
                        />
                        {errors.number && <p className="text-sm text-red-500 dark:text-red-400 font-medium text-right">{errors.number}</p>}
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="crime_type" className="font-medium flex items-center gap-2 text-orange-700 dark:text-orange-300 text-right" dir="rtl">
                          <Gavel className="h-4 w-4" />
                          {t('criminal.create.fields.crime_type')}
                        </Label>
                        <Input
                          id="crime_type"
                          value={data.crime_type}
                          onChange={(e) => setData('crime_type', e.target.value)}
                          placeholder={t('criminal.create.placeholders.crime_type')}
                          className="h-11 text-right"
                        />
                        {errors.crime_type && <p className="text-sm text-red-500 dark:text-red-400 font-medium text-right">{errors.crime_type}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label htmlFor="arrest_date" className="font-medium flex items-center gap-2 text-orange-700 dark:text-orange-300 text-right" dir="rtl">
                          <Calendar className="h-4 w-4" />
                          {t('criminal.create.fields.arrest_date')}
                        </Label>
                        <div className="relative">
                          <Input
                            id="arrest_date"
                            type="date"
                            value={data.arrest_date}
                            onChange={handleDateChange}
                            className="h-11 border-orange-200 dark:border-orange-700 dark:border-orange-700 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-orange-500/20 dark:focus:ring-orange-400/20 bg-gradient-to-l from-orange-50 dark:from-orange-900/20 to-white dark:to-gray-800 text-right"
                          />
                          {persianDateDisplay && (
                            <div className="mt-2 p-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-md text-right">
                              <span className="text-sm text-orange-700 dark:text-orange-300 font-medium">
                                {t('criminal.create.persian_date_label')}: {persianDateDisplay}
                              </span>
                            </div>
                          )}
                        </div>
                        {errors.arrest_date && <p className="text-sm text-red-500 dark:text-red-400 font-medium text-right">{errors.arrest_date}</p>}
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="arrest_location" className="font-medium flex items-center gap-2 text-orange-700 dark:text-orange-300 text-right" dir="rtl">
                          <MapPin className="h-4 w-4" />
                          {t('criminal.create.fields.arrest_location')}
                        </Label>
                        <Input
                          id="arrest_location"
                          value={data.arrest_location}
                          onChange={(e) => setData('arrest_location', e.target.value)}
                          placeholder={t('criminal.create.placeholders.arrest_location')}
                          className="h-11 text-right"
                        />
                        {errors.arrest_location && <p className="text-sm text-red-500 dark:text-red-400 font-medium text-right">{errors.arrest_location}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label htmlFor="arrested_by" className="font-medium flex items-center gap-2 text-orange-700 dark:text-orange-300 text-right" dir="rtl">
                          <Shield className="h-4 w-4" />
                          {t('criminal.create.fields.arrested_by')}
                        </Label>
                        <Input
                          id="arrested_by"
                          value={data.arrested_by}
                          onChange={(e) => setData('arrested_by', e.target.value)}
                          placeholder={t('criminal.create.placeholders.arrested_by')}
                          className="h-11 text-right"
                        />
                        {errors.arrested_by && <p className="text-sm text-red-500 dark:text-red-400 font-medium text-right">{errors.arrested_by}</p>}
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="referred_to" className="font-medium flex items-center gap-2 text-orange-700 dark:text-orange-300 text-right" dir="rtl">
                          <Building2 className="h-4 w-4" />
                          {t('criminal.create.fields.referred_to')}
                        </Label>
                        <Input
                          id="referred_to"
                          value={data.referred_to}
                          onChange={(e) => setData('referred_to', e.target.value)}
                          placeholder={t('criminal.create.placeholders.referred_to')}
                          className="h-11 text-right"
                        />
                        {errors.referred_to && <p className="text-sm text-red-500 dark:text-red-400 font-medium text-right">{errors.referred_to}</p>}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="final_verdict" className="font-medium flex items-center gap-2 text-orange-700 dark:text-orange-300 text-right" dir="rtl">
                        <FileCheck className="h-4 w-4" />
                        {t('criminal.create.fields.final_verdict')}
                      </Label>
                      <Textarea
                        id="final_verdict"
                        value={data.final_verdict}
                        onChange={(e) => setData('final_verdict', e.target.value)}
                        rows={3}
                        placeholder={t('criminal.create.placeholders.final_verdict')}
                        className="min-h-[120px] resize-none text-right "
                      />
                      {errors.final_verdict && <p className="text-sm text-red-500 dark:text-red-400 font-medium text-right">{errors.final_verdict}</p>}
                    </div>
                  </TabsContent>

                  {/* Other Information Tab */}
                  <TabsContent value="other" className="space-y-6 pt-2">
                    <div className="space-y-3">
                      <Label htmlFor="notes" className="font-medium flex items-center gap-2 text-orange-700 dark:text-orange-300 text-right" dir="rtl">
                        <BookText className="h-4 w-4" />
                        {t('criminal.create.fields.notes')}
                      </Label>
                      <Textarea
                        id="notes"
                        value={data.notes}
                        onChange={(e) => setData('notes', e.target.value)}
                        rows={8}
                        placeholder={t('criminal.create.placeholders.notes')}
                        className="min-h-[240px] text-right dark:bg-gray-700"
                      />
                      {errors.notes && <p className="text-sm text-red-500 dark:text-red-400 font-medium text-right">{errors.notes}</p>}

                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 text-right">
                        {t('criminal.create.notes_helper')}
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>

              <CardFooter className="flex justify-between border-t px-6 py-5 bg-gradient-to-l from-orange-50 dark:from-orange-900/20 to-orange-100 dark:to-orange-800/30">
                <Button
                  variant="outline"
                  onClick={() => reset()}
                  type="button"
                  disabled={processing}
                  className="mr-2 border-orange-300 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 hover:bg-orange-100 hover:border-orange-400 shadow-lg"
                >
                  {t('criminal.create.reset')}
                </Button>
                <Button
                  type="submit"
                  disabled={processing}
                  className="ml-2 px-8 font-medium bg-gradient-to-l from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {processing ? t('criminal.create.saving') : t('criminal.create.save')}
                </Button>
              </CardFooter>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
