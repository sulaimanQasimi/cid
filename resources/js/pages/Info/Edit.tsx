import React, { useState, lazy, Suspense, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type InfoType, type InfoCategory, type Info, type User } from '@/types/info';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, Shield, FileText, BookText, AlertTriangle, Calendar, Clock, Users, Building2, MapPin, Phone, IdCard, Home, Gavel, FileCheck } from 'lucide-react';

// Import the LocationSelector component directly to avoid issues with lazy loading
import LocationSelector from '@/components/LocationSelector';
import { useTranslation } from '@/lib/i18n/translate';
import { cn } from '@/lib/utils';
import { usePermissions } from '@/hooks/use-permissions';
import { CanConfirm } from '@/components/ui/permission-guard';

interface Department {
  id: number;
  name: string;
  code: string;
}

interface Props {
  info: Info & {
    infoType?: InfoType;
    infoCategory?: InfoCategory;
    department?: Department | null;
    user?: User;
    creator?: User;
    confirmer?: User;
  };
  infoTypes?: InfoType[];
  infoCategories?: InfoCategory[];
  departments?: Department[];
}

export default function InfoEdit({ info, infoTypes = [], infoCategories = [], departments = [] }: Props) {
  const { t } = useTranslation();
  const { canConfirm } = usePermissions();
  
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('info_types.page_title'),
      href: route('info-types.index'),
    },
    {
      title: t('info.edit.breadcrumb'),
      href: '#',
    },
  ];
  
  // Content tabs state
  const [activeTab, setActiveTab] = useState<string>('basic');

  // Flag to track map mounting
  const [isMapTabMounted, setIsMapTabMounted] = useState(false);

  // Extract the location from info.value if it exists
  const extractLocation = () => {
    if (info.value && typeof info.value === 'object' && info.value.location) {
      return info.value.location as { lat: number, lng: number, province?: string } | null;
    }
    return null;
  };

  // Location data state
  const [location, setLocation] = useState<{ lat: number, lng: number, province?: string } | null>(extractLocation());

  const { data, setData, put, processing, errors } = useForm({
    name: info.name || '',
    code: info.code || '',
    description: info.description || '',
    info_type_id: info.info_type_id ? info.info_type_id.toString() : '',
    info_category_id: info.info_category_id ? info.info_category_id.toString() : '',
    department_id: info.department?.id ? info.department.id.toString() : 'none',
    value: {
      content: info.value && typeof info.value === 'object' && info.value.content ? info.value.content : '',
      location: extractLocation()
    },
    confirmed: info.confirmed || false,
  });

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'location') {
      setIsMapTabMounted(true);
    }
  };

  // Handle location change
  const handleLocationChange = (newLocation: { lat: number, lng: number, province: string } | null) => {
    setLocation(newLocation);
    setData('value', {
      ...data.value,
      location: newLocation
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('infos.update', info.id), {
      onSuccess: () => {
        // Redirect happens automatically from the controller
      }
    });
  };

  // Load map component when needed
  useEffect(() => {
    if (activeTab === 'location' || (info.value && typeof info.value === 'object' && info.value.location)) {
      setIsMapTabMounted(true);
    }
  }, [activeTab, info.value]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('info.edit.page_title', { name: info.name || 'Info Record' })} />
      <div className="container px-0 py-6">
        {/* Header with gradient background */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-2xl mb-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 -translate-x-32"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 translate-x-24"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">{t('info.edit.title')}</h2>
                <div className="text-white/90 flex items-center gap-2 mt-2 text-lg">
                  <AlertTriangle className="h-5 w-5" />
                  {t('info.edit.description')}
                </div>
              </div>
            </div>
            
            <Button variant="outline" asChild className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 rounded-full shadow-lg">
              <Link href={route('info-types.index')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('info.edit.back_to_list')}
              </Link>
            </Button>
          </div>
        </div>

        {/* Warning Alert for Confirmed Info */}
        {info.confirmed && (
          <div className="mb-6">
            <Card className="border-orange-200 bg-gradient-to-l from-orange-50 to-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-orange-800">{t('info.edit.confirmed_warning.title')}</h3>
                    <p className="text-orange-700">{t('info.edit.confirmed_warning.description')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Card className="border-none shadow-xl overflow-hidden bg-gradient-to-bl from-white to-blue-50/30">
            <CardHeader className="bg-gradient-to-l from-blue-500 to-blue-600 text-white border-b pb-4">
              <CardTitle className="text-lg flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <FileText className="h-5 w-5" />
                </div>
                {t('info.edit.form.title')}
              </CardTitle>
              <CardDescription className="text-blue-100">
                {t('info.edit.form.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="info_type_id">{t('info.edit.fields.type')} <span className="text-red-500">{t('common.required_field')}</span></Label>
                    <Select
                      value={data.info_type_id}
                      onValueChange={(value) => setData('info_type_id', value)}
                      required
                    >
                      <SelectTrigger id="info_type_id">
                        <SelectValue placeholder={t('info.edit.placeholders.select_type')} />
                      </SelectTrigger>
                      <SelectContent>
                        {infoTypes.length > 0 ? (
                          infoTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id.toString()}>
                              {type.name}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-sm text-gray-500">{t('info.edit.no_types_available')}</div>
                        )}
                      </SelectContent>
                    </Select>
                    {errors.info_type_id && <p className="text-sm text-red-500">{errors.info_type_id}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="info_category_id">{t('info.edit.fields.category')} <span className="text-red-500">{t('common.required_field')}</span></Label>
                    <Select
                      value={data.info_category_id}
                      onValueChange={(value) => setData('info_category_id', value)}
                      required
                    >
                      <SelectTrigger id="info_category_id">
                        <SelectValue placeholder={t('info.edit.placeholders.select_category')} />
                      </SelectTrigger>
                      <SelectContent>
                        {infoCategories.length > 0 ? (
                          infoCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-sm text-gray-500">{t('info.edit.no_categories_available')}</div>
                        )}
                      </SelectContent>
                    </Select>
                    {errors.info_category_id && <p className="text-sm text-red-500">{errors.info_category_id}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department_id">{t('info.edit.fields.department')}</Label>
                    <Select
                      value={data.department_id}
                      onValueChange={(value) => setData('department_id', value)}
                    >
                      <SelectTrigger id="department_id">
                        <SelectValue placeholder={t('info.edit.placeholders.select_department')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">{t('common.none')}</SelectItem>
                        {departments.length > 0 ? (
                          departments.map((department) => (
                            <SelectItem key={department.id} value={department.id.toString()}>
                              {department.name}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-sm text-gray-500">{t('info.edit.no_departments_available')}</div>
                        )}
                      </SelectContent>
                    </Select>
                    {errors.department_id && <p className="text-sm text-red-500">{errors.department_id}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">{t('info.edit.fields.name')}</Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">{t('info.edit.fields.code')}</Label>
                  <Input
                    id="code"
                    value={data.code}
                    onChange={(e) => setData('code', e.target.value)}
                    placeholder={t('info.edit.placeholders.code')}
                  />
                  {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                  <p className="text-sm text-gray-500">{t('info.edit.code_helper')}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">{t('info.edit.fields.description')}</Label>
                  <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    rows={3}
                  />
                  {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                </div>

                {/* Content section with tabs */}
                <div className="space-y-2">
                  <Label>{t('info.edit.fields.content')}</Label>

                  <Tabs defaultValue="basic" value={activeTab} onValueChange={handleTabChange}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="basic">{t('info.edit.content_tabs.basic')}</TabsTrigger>
                      <TabsTrigger value="location" className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {t('info.edit.content_tabs.location')}
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="pt-4">
                      <Textarea
                        id="content"
                        value={data.value.content}
                        onChange={(e) => setData('value', { ...data.value, content: e.target.value })}
                        rows={5}
                        placeholder={t('info.edit.placeholders.content')}
                      />
                    </TabsContent>

                    <TabsContent value="location" className="pt-4">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">{t('info.edit.location_description')}</p>
                        {isMapTabMounted && (
                          <LocationSelector
                            value={location}
                            onChange={handleLocationChange}
                          />
                        )}
                        {!isMapTabMounted && (
                          <div className="h-[400px] flex items-center justify-center bg-gray-100 rounded-md">
                            {t('info.edit.loading_map')}
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>

                  {errors.value && <p className="text-sm text-red-500">{errors.value}</p>}
                </div>

                <CanConfirm model="info">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="confirmed"
                        checked={data.confirmed}
                        onChange={(e) => setData('confirmed', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <Label htmlFor="confirmed">{t('info.edit.fields.confirmed')}</Label>
                    </div>
                    {errors.confirmed && <p className="text-sm text-red-500">{errors.confirmed}</p>}
                  </div>
                </CanConfirm>
              </CardContent>

              <CardFooter className="flex justify-between border-t px-6 py-5 bg-gradient-to-l from-blue-50 to-blue-100">
                <Button
                  variant="outline"
                  onClick={() => window.history.back()}
                  type="button"
                  disabled={processing}
                  className="rounded-full border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400 shadow-lg"
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  type="submit"
                  disabled={processing}
                  className="rounded-full px-8 font-medium bg-gradient-to-l from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {processing ? t('info.edit.saving') : t('info.edit.save_changes')}
                </Button>
              </CardFooter>
            </Card>
          </form>
      </div>
    </AppLayout>
  );
}
