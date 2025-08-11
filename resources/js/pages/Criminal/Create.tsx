import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
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
  const [activeTab, setActiveTab] = useState<string>('personal');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

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
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-red-600 via-orange-600 to-amber-600 p-8 text-white shadow-2xl mb-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 -translate-x-32"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 translate-x-24"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">{t('criminal.create.title')}</h2>
                <p className="text-white/90 flex items-center gap-2 mt-2 text-lg">
                  <AlertTriangle className="h-5 w-5" />
                  {t('criminal.create.description')}
                </p>
              </div>
            </div>
            
            <Button variant="outline" size="sm" asChild className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 rounded-full shadow-lg">
              <a href={route('criminals.index')}>
                <ArrowRight className="ml-2 h-4 w-4" />
                {t('criminal.create.back_to_list')}
              </a>
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Photo Upload Card */}
            <Card className="lg:col-span-1 overflow-hidden border-none shadow-md">
              <CardHeader className="bg-neutral-50 dark:bg-neutral-900 border-b pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Camera className="h-5 w-5 text-neutral-500" />
                  {t('criminal.create.photo.title')}
                </CardTitle>
                <CardDescription>
                  {t('criminal.create.photo.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex flex-col items-center justify-center">
                  <div className={cn(
                    "relative mb-6 h-56 w-56 overflow-hidden rounded-xl border-2 border-dashed",
                    "bg-neutral-50 text-center transition-all duration-200 hover:border-primary/50",
                    "flex items-center justify-center",
                    photoPreview ? "border-primary/30" : "border-neutral-200"
                  )}>
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt={t('criminal.create.photo.preview_alt')}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center p-6">
                        <Camera className="mb-3 h-12 w-12 text-neutral-400" />
                        <p className="text-sm text-neutral-500 font-medium">{t('criminal.create.photo.no_photo')}</p>
                        <p className="text-xs text-neutral-400 mt-1">{t('criminal.create.photo.hint')}</p>
                      </div>
                    )}
                  </div>
                  <Label
                    htmlFor="photo"
                    className={cn(
                      "cursor-pointer rounded-full px-5 py-2.5 text-sm font-medium transition-colors",
                      "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
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
                  {errors.photo && <p className="mt-3 text-sm text-red-500 font-medium">{errors.photo}</p>}

                  <div className="mt-6 text-center max-w-xs">
                    <p className="text-xs text-neutral-500">
                      {t('criminal.create.photo.helper_text')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Form Card */}
            <Card className="lg:col-span-2 border-none shadow-md overflow-hidden">
              <CardHeader className="bg-neutral-50 dark:bg-neutral-900 border-b pb-4">
                <CardTitle className="text-lg">{t('criminal.create.form.title')}</CardTitle>
                <CardDescription>
                  {t('criminal.create.form.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs defaultValue="personal" value={activeTab} onValueChange={handleTabChange} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6 rounded-lg p-1 bg-neutral-100 dark:bg-neutral-800">
                    <TabsTrigger
                      value="personal"
                      className={cn(
                        "data-[state=active]:shadow-sm flex items-center gap-2",
                        "transition-all duration-200"
                      )}
                    >
                      <UserRound className="h-4 w-4" />
                      <span>{t('criminal.create.tabs.personal')}</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="crime"
                      className={cn(
                        "data-[state=active]:shadow-sm flex items-center gap-2",
                        "transition-all duration-200"
                      )}
                    >
                      <FileText className="h-4 w-4" />
                      <span>{t('criminal.create.tabs.crime')}</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="other"
                      className={cn(
                        "data-[state=active]:shadow-sm flex items-center gap-2",
                        "transition-all duration-200"
                      )}
                    >
                      <BookText className="h-4 w-4" />
                      <span>{t('criminal.create.tabs.other')}</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Personal Details Tab */}
                  <TabsContent value="personal" className="space-y-6 pt-2">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-base font-medium">
                        {t('criminal.create.fields.full_name')} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        placeholder={t('criminal.create.placeholders.full_name')}
                        className="h-11"
                      />
                      {errors.name && <p className="text-sm text-red-500 font-medium">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label htmlFor="father_name" className="font-medium">{t('criminal.create.fields.father_name')}</Label>
                        <Input
                          id="father_name"
                          value={data.father_name}
                          onChange={(e) => setData('father_name', e.target.value)}
                          placeholder={t('criminal.create.placeholders.father_name')}
                          className="h-11"
                        />
                        {errors.father_name && <p className="text-sm text-red-500 font-medium">{errors.father_name}</p>}
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="grandfather_name" className="font-medium">{t('criminal.create.fields.grandfather_name')}</Label>
                        <Input
                          id="grandfather_name"
                          value={data.grandfather_name}
                          onChange={(e) => setData('grandfather_name', e.target.value)}
                          placeholder={t('criminal.create.placeholders.grandfather_name')}
                          className="h-11"
                        />
                        {errors.grandfather_name && <p className="text-sm text-red-500 font-medium">{errors.grandfather_name}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label htmlFor="id_card_number" className="font-medium">{t('criminal.create.fields.id_card_number')}</Label>
                        <Input
                          id="id_card_number"
                          value={data.id_card_number}
                          onChange={(e) => setData('id_card_number', e.target.value)}
                          placeholder={t('criminal.create.placeholders.id_card_number')}
                          className="h-11"
                        />
                        {errors.id_card_number && <p className="text-sm text-red-500 font-medium">{errors.id_card_number}</p>}
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="phone_number" className="font-medium">{t('criminal.create.fields.phone_number')}</Label>
                        <Input
                          id="phone_number"
                          value={data.phone_number}
                          onChange={(e) => setData('phone_number', e.target.value)}
                          placeholder={t('criminal.create.placeholders.phone_number')}
                          className="h-11"
                        />
                        {errors.phone_number && <p className="text-sm text-red-500 font-medium">{errors.phone_number}</p>}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="original_residence" className="font-medium">{t('criminal.create.fields.original_residence')}</Label>
                      <Textarea
                        id="original_residence"
                        value={data.original_residence}
                        onChange={(e) => setData('original_residence', e.target.value)}
                        rows={2}
                        placeholder={t('criminal.create.placeholders.original_residence')}
                        className="min-h-[80px] resize-none"
                      />
                      {errors.original_residence && <p className="text-sm text-red-500 font-medium">{errors.original_residence}</p>}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="current_residence" className="font-medium">{t('criminal.create.fields.current_residence')}</Label>
                      <Textarea
                        id="current_residence"
                        value={data.current_residence}
                        onChange={(e) => setData('current_residence', e.target.value)}
                        rows={2}
                        placeholder={t('criminal.create.placeholders.current_residence')}
                        className="min-h-[80px] resize-none"
                      />
                      {errors.current_residence && <p className="text-sm text-red-500 font-medium">{errors.current_residence}</p>}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="department_id" className="font-medium">{t('criminal.create.fields.department')}</Label>
                      <Select
                        value={data.department_id}
                        onValueChange={(value) => setData('department_id', value)}
                      >
                        <SelectTrigger id="department_id" className="h-11">
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
                            <div className="p-2 text-sm text-neutral-500">{t('criminal.create.no_departments')}</div>
                          )}
                        </SelectContent>
                      </Select>
                      {errors.department_id && <p className="text-sm text-red-500 font-medium">{errors.department_id}</p>}
                    </div>
                  </TabsContent>

                  {/* Crime Details Tab */}
                  <TabsContent value="crime" className="space-y-6 pt-2">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label htmlFor="number" className="font-medium">{t('criminal.create.fields.record_number')}</Label>
                        <Input
                          id="number"
                          value={data.number}
                          onChange={(e) => setData('number', e.target.value)}
                          placeholder={t('criminal.create.placeholders.record_number')}
                          className="h-11"
                        />
                        {errors.number && <p className="text-sm text-red-500 font-medium">{errors.number}</p>}
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="crime_type" className="font-medium">{t('criminal.create.fields.crime_type')}</Label>
                        <Input
                          id="crime_type"
                          value={data.crime_type}
                          onChange={(e) => setData('crime_type', e.target.value)}
                          placeholder={t('criminal.create.placeholders.crime_type')}
                          className="h-11"
                        />
                        {errors.crime_type && <p className="text-sm text-red-500 font-medium">{errors.crime_type}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label htmlFor="arrest_date" className="font-medium">{t('criminal.create.fields.arrest_date')}</Label>
                        <div className="relative">
                          <Input
                            id="arrest_date"
                            type="date"
                            value={data.arrest_date}
                            onChange={(e) => setData('arrest_date', e.target.value)}
                            className="h-11"
                          />
                          <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                        </div>
                        {errors.arrest_date && <p className="text-sm text-red-500 font-medium">{errors.arrest_date}</p>}
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="arrest_location" className="font-medium">{t('criminal.create.fields.arrest_location')}</Label>
                        <Input
                          id="arrest_location"
                          value={data.arrest_location}
                          onChange={(e) => setData('arrest_location', e.target.value)}
                          placeholder={t('criminal.create.placeholders.arrest_location')}
                          className="h-11"
                        />
                        {errors.arrest_location && <p className="text-sm text-red-500 font-medium">{errors.arrest_location}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label htmlFor="arrested_by" className="font-medium">{t('criminal.create.fields.arrested_by')}</Label>
                        <Input
                          id="arrested_by"
                          value={data.arrested_by}
                          onChange={(e) => setData('arrested_by', e.target.value)}
                          placeholder={t('criminal.create.placeholders.arrested_by')}
                          className="h-11"
                        />
                        {errors.arrested_by && <p className="text-sm text-red-500 font-medium">{errors.arrested_by}</p>}
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="referred_to" className="font-medium">{t('criminal.create.fields.referred_to')}</Label>
                        <Input
                          id="referred_to"
                          value={data.referred_to}
                          onChange={(e) => setData('referred_to', e.target.value)}
                          placeholder={t('criminal.create.placeholders.referred_to')}
                          className="h-11"
                        />
                        {errors.referred_to && <p className="text-sm text-red-500 font-medium">{errors.referred_to}</p>}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="final_verdict" className="font-medium">{t('criminal.create.fields.final_verdict')}</Label>
                      <Textarea
                        id="final_verdict"
                        value={data.final_verdict}
                        onChange={(e) => setData('final_verdict', e.target.value)}
                        rows={3}
                        placeholder={t('criminal.create.placeholders.final_verdict')}
                        className="min-h-[120px] resize-none"
                      />
                      {errors.final_verdict && <p className="text-sm text-red-500 font-medium">{errors.final_verdict}</p>}
                    </div>
                  </TabsContent>

                  {/* Other Information Tab */}
                  <TabsContent value="other" className="space-y-6 pt-2">
                    <div className="space-y-3">
                      <Label htmlFor="notes" className="font-medium">{t('criminal.create.fields.notes')}</Label>
                      <Textarea
                        id="notes"
                        value={data.notes}
                        onChange={(e) => setData('notes', e.target.value)}
                        rows={8}
                        placeholder={t('criminal.create.placeholders.notes')}
                        className="min-h-[240px]"
                      />
                      {errors.notes && <p className="text-sm text-red-500 font-medium">{errors.notes}</p>}

                      <p className="text-xs text-neutral-500 mt-2">
                        {t('criminal.create.notes_helper')}
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>

              <CardFooter className="flex justify-between border-t px-6 py-5 bg-neutral-50 dark:bg-neutral-900">
                <Button
                  variant="outline"
                  onClick={() => reset()}
                  type="button"
                  disabled={processing}
                  className="rounded-full"
                >
                  {t('criminal.create.reset')}
                </Button>
                <Button
                  type="submit"
                  disabled={processing}
                  className="rounded-full px-8 font-medium"
                >
                  {processing ? t('criminal.create.saving') : t('criminal.create.save')}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
