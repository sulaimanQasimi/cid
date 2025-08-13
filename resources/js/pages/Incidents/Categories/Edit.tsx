import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader } from '@/components/page-header';
import { ArrowLeft, Save, Shield, FileText, BookText, AlertTriangle, Palette, BarChart3, CheckCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import InputError from '@/components/input-error';
import { FormEventHandler } from 'react';
import { useTranslation } from '@/lib/i18n/translate';
import { cn } from '@/lib/utils';

// Define color options for the color picker
const colorOptions = [
  '#4f46e5', // Indigo
  '#3b82f6', // Blue
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#84cc16', // Lime
  '#eab308', // Yellow
  '#f97316', // Orange
  '#ef4444', // Red
  '#ec4899', // Pink
  '#8b5cf6', // Purple
  '#a3a3a3', // Gray
];

interface CategoryProps {
  category: {
    id: number;
    name: string;
    code: string | null;
    description: string | null;
    color: string | null;
    severity_level: number;
    status: string;
  };
}

export default function Edit({ category }: CategoryProps) {
  const { t } = useTranslation();
  
  // Generate breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('incident_categories.page_title'),
      href: route('incident-categories.index'),
    },
    {
      title: category.name,
      href: route('incident-categories.edit', category.id),
    },
    {
      title: t('incident_categories.edit'),
      href: route('incident-categories.edit', category.id),
    },
  ];

  // Initialize form with useForm hook and existing category data
  const { data, setData, put, processing, errors } = useForm({
    name: category.name,
    code: category.code || '',
    description: category.description || '',
    color: category.color || '#3b82f6', // Default to blue if null
    severity_level: category.severity_level.toString(),
    status: category.status,
  });

  // Handle form submission
  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    put(route('incident-categories.update', category.id));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('incident_categories.edit_title', { name: category.name })} />
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
                <h2 className="text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">{t('incident_categories.edit_header', { name: category.name })}</h2>
                <p className="text-white/90 flex items-center gap-2 mt-2 text-lg">
                  <AlertTriangle className="h-5 w-5" />
                  {t('incident_categories.edit_description')}
                </p>
              </div>
            </div>
            
            <Button variant="outline" asChild className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 rounded-full shadow-lg">
              <Link href={route('incident-categories.index')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('incident_categories.back_to_list')}
              </Link>
            </Button>
          </div>
        </div>

        <form onSubmit={submit}>
          <Card className="border-none shadow-xl overflow-hidden bg-gradient-to-bl from-white to-blue-50/30">
            <CardHeader className="bg-gradient-to-l from-blue-500 to-blue-600 text-white border-b pb-4">
              <CardTitle className="text-lg flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <FileText className="h-5 w-5" />
                </div>
                {t('incident_categories.info_title')}
              </CardTitle>
              <CardDescription className="text-blue-100">
                {t('incident_categories.info_description_edit')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-base font-medium flex items-center gap-2 text-blue-700 text-right" dir="rtl">
                    <span className="text-red-500">*</span>
                    {t('incident_categories.form.name')}
                    <FileText className="h-4 w-4" />
                  </Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    placeholder={t('incident_categories.form.name_placeholder')}
                    required
                    className="h-12 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gradient-to-l from-blue-50 to-white text-right"
                  />
                  {errors.name && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                    <AlertTriangle className="h-4 w-4" />
                    {errors.name}
                  </p>}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="code" className="font-medium flex items-center gap-2 text-blue-700 text-right" dir="rtl">
                    {t('incident_categories.form.code')}
                    <BookText className="h-4 w-4" />
                  </Label>
                  <Input
                    id="code"
                    value={data.code}
                    onChange={e => setData('code', e.target.value)}
                    placeholder={t('incident_categories.form.code_placeholder')}
                    className="h-12 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gradient-to-l from-blue-50 to-white text-right"
                  />
                  {errors.code && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                    <AlertTriangle className="h-4 w-4" />
                    {errors.code}
                  </p>}
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="description" className="font-medium flex items-center gap-2 text-blue-700 text-right" dir="rtl">
                  {t('incident_categories.form.description')}
                  <BookText className="h-4 w-4" />
                </Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={e => setData('description', e.target.value)}
                  placeholder={t('incident_categories.form.description_placeholder')}
                  rows={3}
                  className="min-h-[80px] resize-none border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gradient-to-l from-blue-50 to-white text-right"
                />
                {errors.description && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                  <AlertTriangle className="h-4 w-4" />
                  {errors.description}
                </p>}
              </div>

              <div className="grid gap-6 sm:grid-cols-3">
                <div className="space-y-3">
                  <Label htmlFor="color" className="font-medium flex items-center gap-2 text-blue-700 text-right" dir="rtl">
                    {t('incident_categories.form.color')}
                    <Palette className="h-4 w-4" />
                  </Label>
                  <div className="flex items-center space-x-2">
                    <div
                      className="h-8 w-8 rounded-full border-2 border-blue-200"
                      style={{ backgroundColor: data.color || '#e2e8f0' }}
                    ></div>
                    <Input
                      id="color"
                      value={data.color}
                      onChange={e => setData('color', e.target.value)}
                      placeholder={t('incident_categories.form.color_placeholder')}
                      className="h-12 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gradient-to-l from-blue-50 to-white text-right"
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`h-6 w-6 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
                          data.color === color ? 'ring-2 ring-blue-500 ring-offset-2' : 'border-blue-200'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setData('color', color)}
                      />
                    ))}
                  </div>
                  {errors.color && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                    <AlertTriangle className="h-4 w-4" />
                    {errors.color}
                  </p>}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="severity_level" className="font-medium flex items-center gap-2 text-blue-700 text-right" dir="rtl">
                    <span className="text-red-500">*</span>
                    {t('incident_categories.form.severity_level')}
                    <BarChart3 className="h-4 w-4" />
                  </Label>
                  <Select
                    value={data.severity_level}
                    onValueChange={(value) => setData('severity_level', value)}
                    required
                  >
                    <SelectTrigger id="severity_level" className="h-12 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gradient-to-l from-blue-50 to-white text-right">
                      <SelectValue placeholder={t('incident_categories.form.severity_placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">{t('incident_categories.form.severity.level1')}</SelectItem>
                      <SelectItem value="2">{t('incident_categories.form.severity.level2')}</SelectItem>
                      <SelectItem value="3">{t('incident_categories.form.severity.level3')}</SelectItem>
                      <SelectItem value="4">{t('incident_categories.form.severity.level4')}</SelectItem>
                      <SelectItem value="5">{t('incident_categories.form.severity.level5')}</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.severity_level && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                    <AlertTriangle className="h-4 w-4" />
                    {errors.severity_level}
                  </p>}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="status" className="font-medium flex items-center gap-2 text-blue-700 text-right" dir="rtl">
                    <span className="text-red-500">*</span>
                    {t('incident_categories.form.status')}
                    <CheckCircle className="h-4 w-4" />
                  </Label>
                  <Select
                    value={data.status}
                    onValueChange={(value) => setData('status', value)}
                    required
                  >
                    <SelectTrigger id="status" className="h-12 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gradient-to-l from-blue-50 to-white text-right">
                      <SelectValue placeholder={t('incident_categories.form.status_placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{t('incident_categories.form.status.active')}</SelectItem>
                      <SelectItem value="inactive">{t('incident_categories.form.status.inactive')}</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                    <AlertTriangle className="h-4 w-4" />
                    {errors.status}
                  </p>}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between border-t px-6 py-5 bg-gradient-to-l from-blue-50 to-blue-100">
              <Button
                variant="outline"
                asChild
                className="rounded-full border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400 shadow-lg"
              >
                <Link href={route('incident-categories.index')}>{t('common.cancel')}</Link>
              </Button>
              <Button
                type="submit"
                disabled={processing}
                className="rounded-full px-8 font-medium bg-gradient-to-l from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Save className="mr-2 h-4 w-4" />
                {processing ? t('incident_categories.actions.saving') : t('incident_categories.actions.save_changes')}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </AppLayout>
  );
}
