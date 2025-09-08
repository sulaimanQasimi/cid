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
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n/translate';
import Header from '@/components/template/header';

interface Criminal {
  id: number;
  photo: string | null;
  number: string | null;
  name: string;
  father_name: string | null;
  grandfather_name: string | null;
  id_card_number: string | null;
  phone_number: string | null;
  original_residence: string | null;
  current_residence: string | null;
  crime_type: string | null;
  arrest_location: string | null;
  arrested_by: string | null;
  arrest_date: string | null;
  referred_to: string | null;
  final_verdict: string | null;
  notes: string | null;
  department_id: number | null;
  created_by: number;
  created_at: string;
  updated_at: string;
  department?: {
    id: number;
    name: string;
    code: string;
  } | null;
  creator?: {
    id: number;
    name: string;
  };
}

interface Department {
  id: number;
  name: string;
  code: string;
}

interface Props {
  criminal: Criminal;
  departments: Department[];
  auth: {
    permissions: string[];
  };
}

export default function CriminalEdit({ criminal, departments = [], auth }: Props) {
  const { t } = useTranslation();
  // Content tabs state
  const [activeTab, setActiveTab] = useState<string>('other');
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    criminal.photo ? `/storage/${criminal.photo}` : null
  );

  const { data, setData, post, processing, errors } = useForm({
    _method: 'PUT', // For method spoofing in Laravel
    photo: null as File | null,
    number: criminal.number || '',
    name: criminal.name || '',
    father_name: criminal.father_name || '',
    grandfather_name: criminal.grandfather_name || '',
    id_card_number: criminal.id_card_number || '',
    phone_number: criminal.phone_number || '',
    original_residence: criminal.original_residence || '',
    current_residence: criminal.current_residence || '',
    crime_type: criminal.crime_type || '',
    arrest_location: criminal.arrest_location || '',
    arrested_by: criminal.arrested_by || '',
    arrest_date: criminal.arrest_date || '',
    referred_to: criminal.referred_to || '',
    final_verdict: criminal.final_verdict || '',
    notes: criminal.notes || '',
    department_id: criminal.department_id ? criminal.department_id.toString() : 'none',
  });

  // Generate breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('criminal.page_title'),
      href: route('criminals.index'),
    },
    {
      title: criminal.name,
      href: route('criminals.show', criminal.id),
    },
    {
      title: t('criminal.edit.breadcrumb'),
      href: route('criminals.edit', criminal.id),
    },
  ];

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('criminals.update', criminal.id), {
      forceFormData: true,
      onSuccess: () => {
        // Redirect happens automatically from the controller
      }
    });
  };

  const formattedCreatedAt = criminal.created_at
    ? format(new Date(criminal.created_at), 'MMM d, yyyy')
    : 'N/A';

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('criminal.edit.page_title', { name: criminal.name })} />
      <div className="container px-0 py-6">
        {/* Modern Header with Glassmorphism */}
        <Header
          title={t('criminal.edit.title')}
          description={t('criminal.edit.description')}
          icon={<Shield className="h-6 w-6 text-white" />}
          model="criminal"
          routeName={route('criminals.show', criminal.id)}
          theme="orange"
          buttonText={(t('common.edit'))}
          showBackButton={true}
          backRouteName={() => route('criminals.index')}
          backButtonText={t('common.back_to_list')}
          showButton={true}
          actionButtons={
              <>  </>
          }
        />

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Photo Upload Card */}
            <Card className="lg:col-span-1 overflow-hidden border-none shadow-xl bg-gradient-to-bl from-white to-red-50/30">
              <CardHeader className="bg-gradient-to-l from-red-500 to-red-600 text-white border-b pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Camera className="h-5 w-5" />
                  </div>
                  {t('criminal.edit.photo.title')}
                </CardTitle>
                <CardDescription className="text-red-100">
                  {t('criminal.edit.photo.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex flex-col items-center justify-center">
                  <div className={cn(
                    "relative mb-6 h-56 w-56 overflow-hidden rounded-2xl border-2 border-dashed",
                    "bg-gradient-to-bl from-red-50 to-red-100 text-center transition-all duration-300 hover:border-red-400/50 hover:shadow-xl",
                    "flex items-center justify-center group",
                    photoPreview ? "border-red-400/50 shadow-lg" : "border-red-200"
                  )}>
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt={t('criminal.edit.photo.preview_alt')}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center p-6">
                        <div className="p-4 bg-gradient-to-br from-red-100 to-red-200 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300">
                          <Camera className="h-12 w-12 text-red-600" />
                        </div>
                        <p className="text-sm text-red-700 font-medium">{t('criminal.edit.photo.no_photo')}</p>
                        <p className="text-xs text-red-500 mt-1">{t('criminal.edit.photo.click_to_upload')}</p>
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
                    {photoPreview ? t('criminal.edit.photo.change_button') : t('criminal.edit.photo.upload')}
                  </Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="sr-only"
                  />
                  {errors.photo && <p className="mt-3 text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    {errors.photo}
                  </p>}

                  <div className="mt-6 text-center max-w-xs">
                    <p className="text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                      {t('criminal.create.photo.helper_text')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Form Card */}
            <Card className="lg:col-span-2 border-none shadow-xl overflow-hidden bg-gradient-to-bl from-white to-orange-50/30">
              <CardHeader className="bg-gradient-to-l from-orange-500 to-orange-600 text-white border-b pb-4">
                <CardTitle className="text-lg flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <FileText className="h-5 w-5" />
                  </div>
                  {t('criminal.edit.form.title')}
                </CardTitle>
                <CardDescription className="text-orange-100">
                  {t('criminal.edit.form.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs defaultValue="other" value={activeTab} onValueChange={handleTabChange} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6 rounded-xl p-1 bg-gradient-to-l from-orange-100 to-orange-200 shadow-lg">
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
                      <Label htmlFor="name" className="text-base font-medium flex items-center gap-2 text-orange-700 text-right" dir="rtl">
                        <span className="text-red-500">*</span>
                        {t('criminal.create.fields.full_name')}
                        <Users className="h-4 w-4" />
                      </Label>
                      <div className="relative">
                        <Input
                          id="name"
                          value={data.name}
                          onChange={(e) => setData('name', e.target.value)}
                          required
                          placeholder={t('criminal.create.placeholders.full_name')}
                          className="h-12 border-orange-200 focus:border-orange-500 focus:ring-orange-500/20 bg-gradient-to-l from-orange-50 to-white text-right"
                        />
                      </div>
                      {errors.name && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                        <AlertTriangle className="h-4 w-4" />
                        {errors.name}
                      </p>}
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label htmlFor="father_name" className="font-medium flex items-center gap-2 text-orange-700 text-right" dir="rtl">
                          {t('criminal.create.fields.father_name')}
                          <Users className="h-4 w-4" />
                        </Label>
                        <Input
                          id="father_name"
                          value={data.father_name}
                          onChange={(e) => setData('father_name', e.target.value)}
                          placeholder={t('criminal.create.placeholders.father_name')}
                          className="h-12 border-orange-200 focus:border-orange-500 focus:ring-orange-500/20 bg-gradient-to-l from-orange-50 to-white text-right"
                        />
                        {errors.father_name && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                          <AlertTriangle className="h-4 w-4" />
                          {errors.father_name}
                        </p>}
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="grandfather_name" className="font-medium flex items-center gap-2 text-orange-700 text-right" dir="rtl">
                          {t('criminal.create.fields.grandfather_name')}
                          <Users className="h-4 w-4" />
                        </Label>
                        <Input
                          id="grandfather_name"
                          value={data.grandfather_name}
                          onChange={(e) => setData('grandfather_name', e.target.value)}
                          placeholder={t('criminal.create.placeholders.grandfather_name')}
                          className="h-12 border-orange-200 focus:border-orange-500 focus:ring-orange-500/20 bg-gradient-to-l from-orange-50 to-white text-right"
                        />
                        {errors.grandfather_name && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                          <AlertTriangle className="h-4 w-4" />
                          {errors.grandfather_name}
                        </p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label htmlFor="id_card_number" className="font-medium flex items-center gap-2 text-orange-700 text-right" dir="rtl">
                          {t('criminal.create.fields.id_card_number')}
                          <IdCard className="h-4 w-4" />
                        </Label>
                        <Input
                          id="id_card_number"
                          value={data.id_card_number}
                          onChange={(e) => setData('id_card_number', e.target.value)}
                          placeholder={t('criminal.create.placeholders.id_card_number')}
                          className="h-12 border-orange-200 focus:border-orange-500 focus:ring-orange-500/20 bg-gradient-to-l from-orange-50 to-white text-right"
                        />
                        {errors.id_card_number && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                          <AlertTriangle className="h-4 w-4" />
                          {errors.id_card_number}
                        </p>}
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="phone_number" className="font-medium flex items-center gap-2 text-orange-700 text-right" dir="rtl">
                          {t('criminal.create.fields.phone_number')}
                          <Phone className="h-4 w-4" />
                        </Label>
                        <Input
                          id="phone_number"
                          value={data.phone_number}
                          onChange={(e) => setData('phone_number', e.target.value)}
                          placeholder={t('criminal.create.placeholders.phone_number')}
                          className="h-12 border-orange-200 focus:border-orange-500 focus:ring-orange-500/20 bg-gradient-to-l from-orange-50 to-white text-right"
                        />
                        {errors.phone_number && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                          <AlertTriangle className="h-4 w-4" />
                          {errors.phone_number}
                        </p>}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="original_residence" className="font-medium flex items-center gap-2 text-orange-700 text-right" dir="rtl">
                        {t('criminal.create.fields.original_residence')}
                        <Home className="h-4 w-4" />
                      </Label>
                      <Textarea
                        id="original_residence"
                        value={data.original_residence}
                        onChange={(e) => setData('original_residence', e.target.value)}
                        rows={2}
                        placeholder={t('criminal.create.placeholders.original_residence')}
                        className="min-h-[80px] resize-none border-orange-200 focus:border-orange-500 focus:ring-orange-500/20 bg-gradient-to-l from-orange-50 to-white text-right"
                      />
                      {errors.original_residence && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                        <AlertTriangle className="h-4 w-4" />
                        {errors.original_residence}
                      </p>}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="current_residence" className="font-medium flex items-center gap-2 text-orange-700 text-right" dir="rtl">
                        {t('criminal.create.fields.current_residence')}
                        <MapPin className="h-4 w-4" />
                      </Label>
                      <Textarea
                        id="current_residence"
                        value={data.current_residence}
                        onChange={(e) => setData('current_residence', e.target.value)}
                        rows={2}
                        placeholder={t('criminal.create.placeholders.current_residence')}
                        className="min-h-[80px] resize-none border-orange-200 focus:border-orange-500 focus:ring-orange-500/20 bg-gradient-to-l from-orange-50 to-white text-right"
                      />
                      {errors.current_residence && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                        <AlertTriangle className="h-4 w-4" />
                        {errors.current_residence}
                      </p>}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="department_id" className="font-medium flex items-center gap-2 text-orange-700 text-right" dir="rtl">
                        {t('criminal.create.fields.department')}
                        <Building2 className="h-4 w-4" />
                      </Label>
                      <Select
                        value={data.department_id}
                        onValueChange={(value) => setData('department_id', value)}
                      >
                        <SelectTrigger id="department_id" className="h-12 border-orange-200 focus:border-orange-500 focus:ring-orange-500/20 bg-gradient-to-l from-orange-50 to-white text-right">
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
                            <div className="p-2 text-sm text-orange-500 bg-orange-50 rounded-lg">{t('criminal.create.no_departments')}</div>
                          )}
                        </SelectContent>
                      </Select>
                      {errors.department_id && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                        <AlertTriangle className="h-4 w-4" />
                        {errors.department_id}
                      </p>}
                    </div>
                  </TabsContent>

                  {/* Crime Details Tab */}
                  <TabsContent value="crime" className="space-y-6 pt-2">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label htmlFor="number" className="font-medium flex items-center gap-2 text-orange-700 text-right" dir="rtl">
                          {t('criminal.create.fields.record_number')}
                          <FileText className="h-4 w-4" />
                        </Label>
                        <Input
                          id="number"
                          value={data.number}
                          onChange={(e) => setData('number', e.target.value)}
                          placeholder={t('criminal.create.placeholders.record_number')}
                          className="h-11 text-right"
                        />
                        {errors.number && <p className="text-sm text-red-500 font-medium text-right">{errors.number}</p>}
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="crime_type" className="font-medium flex items-center gap-2 text-orange-700 text-right" dir="rtl">
                          {t('criminal.create.fields.crime_type')}
                          <Gavel className="h-4 w-4" />
                        </Label>
                        <Input
                          id="crime_type"
                          value={data.crime_type}
                          onChange={(e) => setData('crime_type', e.target.value)}
                          placeholder={t('criminal.create.placeholders.crime_type')}
                          className="h-11 text-right"
                        />
                        {errors.crime_type && <p className="text-sm text-red-500 font-medium text-right">{errors.crime_type}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label htmlFor="arrest_date" className="font-medium flex items-center gap-2 text-orange-700 text-right" dir="rtl">
                          {t('criminal.create.fields.arrest_date')}
                          <Calendar className="h-4 w-4" />
                        </Label>
                        <div className="relative">
                          <Input
                            id="arrest_date"
                            type="date"
                            value={data.arrest_date}
                            onChange={(e) => setData('arrest_date', e.target.value)}
                            className="h-11 text-right"
                          />
                          <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                        </div>
                        {errors.arrest_date && <p className="text-sm text-red-500 font-medium text-right">{errors.arrest_date}</p>}
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="arrest_location" className="font-medium flex items-center gap-2 text-orange-700 text-right" dir="rtl">
                          {t('criminal.create.fields.arrest_location')}
                          <MapPin className="h-4 w-4" />
                        </Label>
                        <Input
                          id="arrest_location"
                          value={data.arrest_location}
                          onChange={(e) => setData('arrest_location', e.target.value)}
                          placeholder={t('criminal.create.placeholders.arrest_location')}
                          className="h-11 text-right"
                        />
                        {errors.arrest_location && <p className="text-sm text-red-500 font-medium text-right">{errors.arrest_location}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label htmlFor="arrested_by" className="font-medium flex items-center gap-2 text-orange-700 text-right" dir="rtl">
                          {t('criminal.create.fields.arrested_by')}
                          <Shield className="h-4 w-4" />
                        </Label>
                        <Input
                          id="arrested_by"
                          value={data.arrested_by}
                          onChange={(e) => setData('arrested_by', e.target.value)}
                          placeholder={t('criminal.create.placeholders.arrested_by')}
                          className="h-11 text-right"
                        />
                        {errors.arrested_by && <p className="text-sm text-red-500 font-medium text-right">{errors.arrested_by}</p>}
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="referred_to" className="font-medium flex items-center gap-2 text-orange-700 text-right" dir="rtl">
                          {t('criminal.create.fields.referred_to')}
                          <Building2 className="h-4 w-4" />
                        </Label>
                        <Input
                          id="referred_to"
                          value={data.referred_to}
                          onChange={(e) => setData('referred_to', e.target.value)}
                          placeholder={t('criminal.create.placeholders.referred_to')}
                          className="h-11 text-right"
                        />
                        {errors.referred_to && <p className="text-sm text-red-500 font-medium text-right">{errors.referred_to}</p>}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="final_verdict" className="font-medium flex items-center gap-2 text-orange-700 text-right" dir="rtl">
                        {t('criminal.create.fields.final_verdict')}
                        <FileCheck className="h-4 w-4" />
                      </Label>
                      <Textarea
                        id="final_verdict"
                        value={data.final_verdict}
                        onChange={(e) => setData('final_verdict', e.target.value)}
                        rows={3}
                        placeholder={t('criminal.create.placeholders.final_verdict')}
                        className="min-h-[120px] resize-none text-right"
                      />
                      {errors.final_verdict && <p className="text-sm text-red-500 font-medium text-right">{errors.final_verdict}</p>}
                    </div>
                  </TabsContent>

                  {/* Other Information Tab */}
                  <TabsContent value="other" className="space-y-6 pt-2">
                    <div className="space-y-3">
                      <Label htmlFor="notes" className="font-medium flex items-center gap-2 text-orange-700 text-right" dir="rtl">
                        {t('criminal.create.fields.notes')}
                        <BookText className="h-4 w-4" />
                      </Label>
                      <Textarea
                        id="notes"
                        value={data.notes}
                        onChange={(e) => setData('notes', e.target.value)}
                        rows={8}
                        placeholder={t('criminal.create.placeholders.notes')}
                        className="min-h-[240px] text-right"
                      />
                      {errors.notes && <p className="text-sm text-red-500 font-medium text-right">{errors.notes}</p>}

                      <p className="text-xs text-neutral-500 mt-2 text-right">
                        {t('criminal.create.notes_helper')}
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>

              <CardFooter className="flex justify-between border-t px-6 py-5 bg-gradient-to-l from-orange-50 to-orange-100">
                <Button
                  variant="outline"
                  onClick={() => window.location.href = route('criminals.show', criminal.id)}
                  type="button"
                  disabled={processing}
                  className="rounded-full border-orange-300 text-orange-700 hover:bg-orange-100 hover:border-orange-400 shadow-lg"
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  type="submit"
                  disabled={processing}
                  className="rounded-full px-8 font-medium bg-gradient-to-l from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {processing ? t('criminal.edit.saving') : t('criminal.edit.update')}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
