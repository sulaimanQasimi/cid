import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/page-header';
import { ArrowRight, Save, Shield, FileText, AlertTriangle, MapPin, Calendar, Users, Building2, Clock, AlertCircle, Home, Gavel, FileCheck, BookText } from 'lucide-react';
import { FormEventHandler } from 'react';
import InputError from '@/components/input-error';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/lib/i18n/translate';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface EditIncidentProps {
  incident: {
    id: number;
    title: string;
    description: string;
    incident_date: string;
    incident_time: string | null;
    district_id: number;
    incident_category_id: number;
    incident_report_id: number | null;
    location: string | null;
    coordinates: string | null;
    casualties: number;
    injuries: number;
    incident_type: string;
    status: string;
  };
  districts: Array<{
    id: number;
    name: string;
    province: {
      id: number;
      name: string;
    };
  }>;
  categories: Array<{
    id: number;
    name: string;
    color: string;
  }>;
  reports: Array<{
    id: number;
    report_number: string;
    report_date: string;
  }>;
}

export default function Edit({ incident, districts, categories, reports }: EditIncidentProps) {
  const { t } = useTranslation();
  
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Incidents',
      href: route('incidents.index'),
    },
    {
      title: incident.title,
      href: route('incidents.show', incident.id),
    },
    {
      title: 'Edit',
      href: route('incidents.edit', incident.id),
    },
  ];
  const { data, setData, put, processing, errors } = useForm({
    title: incident.title || '',
    description: incident.description || '',
    incident_date: incident.incident_date || new Date().toISOString().split('T')[0],
    incident_time: incident.incident_time || '',
    district_id: incident.district_id?.toString() || '',
    incident_category_id: incident.incident_category_id?.toString() || '',
    incident_report_id: incident.incident_report_id?.toString() || 'none',
    location: incident.location || '',
    coordinates: incident.coordinates || '',
    casualties: incident.casualties?.toString() || '0',
    injuries: incident.injuries?.toString() || '0',
    incident_type: incident.incident_type || '',
    status: incident.status || 'reported',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    if (data.incident_report_id === 'none') {
      setData('incident_report_id', '');
    }

    put(route('incidents.update', incident.id));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('incidents.edit_title', { name: incident.title })} />
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
                <h2 className="text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">{t('incidents.edit_title', { name: incident.title })}</h2>
                <p className="text-white/90 flex items-center gap-2 mt-2 text-lg">
                  <AlertTriangle className="h-5 w-5" />
                  {t('incidents.edit_description')}
                </p>
              </div>
            </div>
            
            <Button asChild className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 rounded-full shadow-lg">
              <Link href={route('incidents.show', incident.id)}>
                <ArrowRight className="ml-2 h-4 w-4" />
                {t('incidents.back_to_incident')}
              </Link>
            </Button>
          </div>
        </div>

        <form onSubmit={submit}>
        <Card className="border-none shadow-xl overflow-hidden bg-gradient-to-bl from-white to-blue-50/30">
          <CardHeader className="bg-gradient-to-l from-blue-500 to-blue-600 text-white border-b pb-4">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 bg-white/20 rounded-lg">
                <FileText className="h-5 w-5" />
              </div>
              {t('incidents.basic_info')}
            </CardTitle>
            <CardDescription className="text-blue-100">
              {t('incidents.basic_info_description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <Label htmlFor="title" className="text-base font-medium flex items-center gap-2 text-blue-700 text-right" dir="rtl">
                  <span className="text-red-500">*</span>
                  {t('incidents.form.title')}
                  <FileText className="h-4 w-4" />
                </Label>
                <Input
                  id="title"
                  value={data.title}
                  onChange={e => setData('title', e.target.value)}
                  placeholder={t('incidents.form.title_placeholder')}
                  required
                  className="h-12 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gradient-to-l from-blue-50 to-white text-right"
                />
                {errors.title && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                  <AlertTriangle className="h-4 w-4" />
                  {errors.title}
                </p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="incident_type" className="text-base font-medium flex items-center gap-2 text-blue-700 text-right" dir="rtl">
                  <span className="text-red-500">*</span>
                  {t('incidents.form.type')}
                  <AlertCircle className="h-4 w-4" />
                </Label>
                <Input
                  id="incident_type"
                  value={data.incident_type}
                  onChange={e => setData('incident_type', e.target.value)}
                  placeholder={t('incidents.form.type_placeholder')}
                  required
                  className="h-12 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gradient-to-l from-blue-50 to-white text-right"
                />
                {errors.incident_type && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                  <AlertTriangle className="h-4 w-4" />
                  {errors.incident_type}
                </p>}
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="description" className="text-base font-medium flex items-center gap-2 text-blue-700 text-right" dir="rtl">
                <span className="text-red-500">*</span>
                {t('incidents.form.description')}
                <BookText className="h-4 w-4" />
              </Label>
              <Textarea
                id="description"
                value={data.description}
                onChange={e => setData('description', e.target.value)}
                placeholder={t('incidents.form.description_placeholder')}
                rows={5}
                required
                className="min-h-[120px] resize-none border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gradient-to-l from-blue-50 to-white text-right"
              />
              {errors.description && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                <AlertTriangle className="h-4 w-4" />
                {errors.description}
              </p>}
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <Label htmlFor="incident_date" className="text-base font-medium flex items-center gap-2 text-blue-700 text-right" dir="rtl">
                  <span className="text-red-500">*</span>
                  {t('incidents.form.date')}
                  <Calendar className="h-4 w-4" />
                </Label>
                <div className="relative">
                  <Input
                    id="incident_date"
                    type="date"
                    value={data.incident_date}
                    onChange={e => setData('incident_date', e.target.value)}
                    required
                    className="h-12 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gradient-to-l from-blue-50 to-white text-right"
                  />
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-400 pointer-events-none" />
                </div>
                {errors.incident_date && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                  <AlertTriangle className="h-4 w-4" />
                  {errors.incident_date}
                </p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="incident_time" className="text-base font-medium flex items-center gap-2 text-blue-700 text-right" dir="rtl">
                  {t('incidents.form.time')}
                  <Clock className="h-4 w-4" />
                </Label>
                <div className="relative">
                  <Input
                    id="incident_time"
                    type="time"
                    value={data.incident_time}
                    onChange={e => setData('incident_time', e.target.value)}
                    className="h-12 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gradient-to-l from-blue-50 to-white text-right"
                  />
                  <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-400 pointer-events-none" />
                </div>
                {errors.incident_time && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                  <AlertTriangle className="h-4 w-4" />
                  {errors.incident_time}
                </p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl overflow-hidden bg-gradient-to-bl from-white to-blue-50/30">
          <CardHeader className="bg-gradient-to-l from-blue-500 to-blue-600 text-white border-b pb-4">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 bg-white/20 rounded-lg">
                <MapPin className="h-5 w-5" />
              </div>
              {t('incidents.location_classification')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <Label htmlFor="district_id" className="text-base font-medium flex items-center gap-2 text-blue-700 text-right" dir="rtl">
                  <span className="text-red-500">*</span>
                  {t('incidents.form.district')}
                  <Building2 className="h-4 w-4" />
                </Label>
                <Select
                  value={data.district_id}
                  onValueChange={value => setData('district_id', value)}
                  required
                >
                  <SelectTrigger className="h-12 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gradient-to-l from-blue-50 to-white text-right">
                    <SelectValue placeholder={t('incidents.form.select_district')} />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map(district => (
                      <SelectItem key={district.id} value={district.id.toString()}>
                        {district.name} ({district.province?.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.district_id && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                  <AlertTriangle className="h-4 w-4" />
                  {errors.district_id}
                </p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="incident_category_id" className="text-base font-medium flex items-center gap-2 text-blue-700 text-right" dir="rtl">
                  <span className="text-red-500">*</span>
                  {t('incidents.form.category')}
                  <AlertCircle className="h-4 w-4" />
                </Label>
                <Select
                  value={data.incident_category_id}
                  onValueChange={value => setData('incident_category_id', value)}
                  required
                >
                  <SelectTrigger className="h-12 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gradient-to-l from-blue-50 to-white text-right">
                    <SelectValue placeholder={t('incidents.form.select_category')} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.incident_category_id && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                  <AlertTriangle className="h-4 w-4" />
                  {errors.incident_category_id}
                </p>}
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="location" className="text-base font-medium flex items-center gap-2 text-blue-700 text-right" dir="rtl">
                {t('incidents.form.location')}
                <MapPin className="h-4 w-4" />
              </Label>
              <Input
                id="location"
                value={data.location}
                onChange={e => setData('location', e.target.value)}
                placeholder={t('incidents.form.location_placeholder')}
                className="h-12 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gradient-to-l from-blue-50 to-white text-right"
              />
              {errors.location && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                <AlertTriangle className="h-4 w-4" />
                {errors.location}
              </p>}
            </div>

            <div className="space-y-3">
              <Label htmlFor="coordinates" className="text-base font-medium flex items-center gap-2 text-blue-700 text-right" dir="rtl">
                {t('incidents.form.coordinates')}
                <MapPin className="h-4 w-4" />
              </Label>
              <Input
                id="coordinates"
                value={data.coordinates}
                onChange={e => setData('coordinates', e.target.value)}
                placeholder={t('incidents.form.coordinates_placeholder')}
                className="h-12 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gradient-to-l from-blue-50 to-white text-right"
              />
              {errors.coordinates && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                <AlertTriangle className="h-4 w-4" />
                {errors.coordinates}
              </p>}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl overflow-hidden bg-gradient-to-bl from-white to-blue-50/30">
          <CardHeader className="bg-gradient-to-l from-blue-500 to-blue-600 text-white border-b pb-4">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 bg-white/20 rounded-lg">
                <AlertCircle className="h-5 w-5" />
              </div>
              {t('incidents.impact_status')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <Label htmlFor="casualties" className="text-base font-medium flex items-center gap-2 text-blue-700 text-right" dir="rtl">
                  {t('incidents.form.casualties')}
                  <AlertTriangle className="h-4 w-4" />
                </Label>
                <Input
                  id="casualties"
                  type="number"
                  min="0"
                  value={data.casualties}
                  onChange={e => setData('casualties', e.target.value)}
                  className="h-12 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gradient-to-l from-blue-50 to-white text-right"
                />
                {errors.casualties && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                  <AlertTriangle className="h-4 w-4" />
                  {errors.casualties}
                </p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="injuries" className="text-base font-medium flex items-center gap-2 text-blue-700 text-right" dir="rtl">
                  {t('incidents.form.injuries')}
                  <AlertTriangle className="h-4 w-4" />
                </Label>
                <Input
                  id="injuries"
                  type="number"
                  min="0"
                  value={data.injuries}
                  onChange={e => setData('injuries', e.target.value)}
                  className="h-12 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gradient-to-l from-blue-50 to-white text-right"
                />
                {errors.injuries && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                  <AlertTriangle className="h-4 w-4" />
                  {errors.injuries}
                </p>}
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="status" className="text-base font-medium flex items-center gap-2 text-blue-700 text-right" dir="rtl">
                <span className="text-red-500">*</span>
                {t('incidents.form.status')}
                <FileCheck className="h-4 w-4" />
              </Label>
              <Select
                value={data.status}
                onValueChange={value => setData('status', value)}
                required
              >
                <SelectTrigger className="h-12 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gradient-to-l from-blue-50 to-white text-right">
                  <SelectValue placeholder={t('incidents.form.select_status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reported">{t('incidents.status.reported')}</SelectItem>
                  <SelectItem value="investigating">{t('incidents.status.investigating')}</SelectItem>
                  <SelectItem value="resolved">{t('incidents.status.resolved')}</SelectItem>
                  <SelectItem value="closed">{t('incidents.status.closed')}</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                <AlertTriangle className="h-4 w-4" />
                {errors.status}
              </p>}
            </div>

            <Separator className="my-6" />

            <div className="space-y-3">
              <Label htmlFor="incident_report_id" className="text-base font-medium flex items-center gap-2 text-blue-700 text-right" dir="rtl">
                {t('incidents.form.assign_report')}
                <FileText className="h-4 w-4" />
              </Label>
              <Select
                value={data.incident_report_id}
                onValueChange={value => setData('incident_report_id', value)}
              >
                <SelectTrigger className="h-12 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gradient-to-l from-blue-50 to-white text-right">
                  <SelectValue placeholder={t('incidents.form.select_report_optional')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t('incidents.none')}</SelectItem>
                  {reports.map(report => (
                    <SelectItem key={report.id} value={report.id.toString()}>
                      {report.report_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.incident_report_id && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                <AlertTriangle className="h-4 w-4" />
                {errors.incident_report_id}
              </p>}
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t px-6 py-5 bg-gradient-to-l from-blue-50 to-blue-100">
            <Button
              variant="outline"
              asChild
              className="rounded-full border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400 shadow-lg"
            >
              <Link href={route('incidents.show', incident.id)}>
                {t('common.cancel')}
              </Link>
            </Button>
            <Button
              type="submit"
              disabled={processing}
              className="rounded-full px-8 font-medium bg-gradient-to-l from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Save className="mr-2 h-4 w-4" />
              {processing ? t('incidents.updating') : t('incidents.update_incident')}
            </Button>
          </CardFooter>
        </Card>
      </form>
      </div>
    </AppLayout>
  );
}
