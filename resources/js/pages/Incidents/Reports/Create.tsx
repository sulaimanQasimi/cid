import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader } from '@/components/page-header';
import { ArrowRight, PlusCircle, Shield, FileText, BookText, AlertTriangle, Calendar, Clock, Users, Building2, MapPin, Phone, IdCard, Home, Gavel, FileCheck, ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import InputError from '@/components/input-error';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState } from 'react';
import TreeViewStatSelector from '@/components/reports/TreeViewStatSelector';
import { useTranslation } from '@/lib/i18n/translate';
import { cn } from '@/lib/utils';

interface StatCategory {
  id: number;
  name: string;
  label: string;
  color: string;
  status: string;
}

interface StatCategoryItem {
  id: number;
  name: string;
  label: string;
  color: string | null;
  parent_id: number | null;
  category: {
    id: number;
    name: string;
    label: string;
    color: string;
  };
}

interface CreateProps {
  securityLevels: string[];
  statItems: StatCategoryItem[];
  statCategories: StatCategory[];
}

type ReportFormData = {
  report_date: string;
  security_level: string;
  details: string;
  report_number?: string;
  action_taken?: string;
  recommendation?: string;
  report_status: string;
  source?: string;
  stats?: Array<{
    stat_category_item_id: number;
    value: string;
    notes?: string;
  }>;
};

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Incident Reports',
    href: route('incident-reports.index'),
  },
  {
    title: 'Create',
    href: route('incident-reports.create'),
  },
];

export default function Create({ securityLevels, statItems, statCategories }: CreateProps) {
  const { t } = useTranslation();
  const { data, setData, post, processing, errors } = useForm<ReportFormData>({
    report_date: new Date().toISOString().split('T')[0],
    security_level: 'normal',
    details: '',
    report_status: 'submitted',
    report_number: '',
    action_taken: '',
    recommendation: '',
    source: '',
  });

  // State for managing statistical data
  const [statsData, setStatsData] = useState<{
    [key: number]: { value: string; notes: string | null };
  }>({});

  // Add state for category filter
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Prepare stats data for submission
    const stats = Object.entries(statsData)
      .filter(([_, { value }]) => value.trim() !== '')
      .map(([itemId, { value, notes }]) => ({
        stat_category_item_id: parseInt(itemId),
        value,
        notes: notes || undefined,
      }));

    // Add stats to form data
    if (stats.length > 0) {
      setData('stats', stats);
    }

    // Submit the form
    post(route('incident-reports.store'));
  }

  // Group stat items by category for the dropdown filter
  const categoriesForFilter = statCategories.map(category => ({
    id: category.id,
    label: category.label,
    color: category.color
  }));

  // Filter stat items by category if one is selected
  const filteredStatItems = selectedCategory
    ? statItems.filter(item => item.category.id === selectedCategory)
    : statItems;

  // Handle stat input change
  function handleStatChange(itemId: number, value: string) {
    setStatsData(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId] || { notes: null }, value }
    }));
  }

  // Handle stat notes change
  function handleNotesChange(itemId: number, notes: string) {
    setStatsData(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId] || { value: '' }, notes: notes || null }
    }));
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('incident_reports.create.page_title')} />
      <div className="container px-0 py-6">
        {/* Header with gradient background */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-green-600 via-emerald-600 to-teal-600 p-8 text-white shadow-2xl mb-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 -translate-x-32"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 translate-x-24"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">{t('incident_reports.create.page_title')}</h2>
                <p className="text-white/90 flex items-center gap-2 mt-2 text-lg">
                  <AlertTriangle className="h-5 w-5" />
                  {t('incident_reports.create.page_description')}
                </p>
              </div>
            </div>
            
            <Button asChild className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 rounded-full shadow-lg">
              <Link href={route('incident-reports.index')}>
                <ArrowRight className="ml-2 h-4 w-4" />
                {t('common.back')}
              </Link>
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8">
            <Card className="border-none shadow-xl overflow-hidden bg-gradient-to-bl from-white to-green-50/30">
              <CardHeader className="bg-gradient-to-l from-green-500 to-green-600 text-white border-b pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <FileText className="h-5 w-5" />
                  </div>
                  {t('incident_reports.form.info_title')}
                </CardTitle>
                <CardDescription className="text-green-100">
                  {t('incident_reports.form.info_description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="report_number" className="text-base font-medium flex items-center gap-2 text-green-700 text-right" dir="rtl">
                      {t('incident_reports.form.report_number_label')}
                      <FileText className="h-4 w-4" />
                    </Label>
                    <Input
                      id="report_number"
                      value={data.report_number}
                      onChange={(e) => setData('report_number', e.target.value)}
                      placeholder={t('incident_reports.form.report_number_placeholder')}
                      className="h-12 border-green-200 focus:border-green-500 focus:ring-green-500/20 bg-gradient-to-l from-green-50 to-white text-right"
                    />
                    {errors.report_number && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.report_number}
                    </p>}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="report_date" className="text-base font-medium flex items-center gap-2 text-green-700 text-right" dir="rtl">
                      <span className="text-red-500">*</span>
                      {t('incident_reports.form.report_date')}
                      <Calendar className="h-4 w-4" />
                    </Label>
                    <div className="relative">
                      <Input
                        id="report_date"
                        type="date"
                        value={data.report_date}
                        onChange={(e) => setData('report_date', e.target.value)}
                        required
                        className="h-12 border-green-200 focus:border-green-500 focus:ring-green-500/20 bg-gradient-to-l from-green-50 to-white text-right"
                      />
                      <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-400 pointer-events-none" />
                    </div>
                    {errors.report_date && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.report_date}
                    </p>}
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="security_level" className="text-base font-medium flex items-center gap-2 text-green-700 text-right" dir="rtl">
                      {t('incident_reports.form.security_level')}
                      <Shield className="h-4 w-4" />
                    </Label>
                    <Select
                      value={data.security_level}
                      onValueChange={(value) => setData('security_level', value)}
                    >
                      <SelectTrigger id="security_level" className="h-12 border-green-200 focus:border-green-500 focus:ring-green-500/20 bg-gradient-to-l from-green-50 to-white text-right">
                        <SelectValue placeholder={t('incident_reports.form.security_level_placeholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">{t('incident_reports.level.normal')}</SelectItem>
                        <SelectItem value="restricted">{t('incident_reports.level.restricted')}</SelectItem>
                        <SelectItem value="classified">{t('incident_reports.level.classified')}</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.security_level && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.security_level}
                    </p>}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="source" className="text-base font-medium flex items-center gap-2 text-green-700 text-right" dir="rtl">
                      {t('incident_reports.form.source_label')}
                      <Users className="h-4 w-4" />
                    </Label>
                    <Input
                      id="source"
                      value={data.source}
                      onChange={(e) => setData('source', e.target.value)}
                      placeholder={t('incident_reports.form.source_placeholder')}
                      className="h-12 border-green-200 focus:border-green-500 focus:ring-green-500/20 bg-gradient-to-l from-green-50 to-white text-right"
                    />
                    {errors.source && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.source}
                    </p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl overflow-hidden bg-gradient-to-bl from-white to-green-50/30">
              <CardHeader className="bg-gradient-to-l from-green-500 to-green-600 text-white border-b pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <BookText className="h-5 w-5" />
                  </div>
                  {t('incident_reports.details.title')}
                </CardTitle>
                <CardDescription className="text-green-100">
                  {t('incident_reports.details.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="details" className="text-base font-medium flex items-center gap-2 text-green-700 text-right" dir="rtl">
                    <span className="text-red-500">*</span>
                    {t('incident_reports.details.details_label')}
                    <FileText className="h-4 w-4" />
                  </Label>
                  <Textarea
                    id="details"
                    rows={5}
                    value={data.details}
                    onChange={(e) => setData('details', e.target.value)}
                    placeholder={t('incident_reports.details.details_placeholder')}
                    required
                    className="min-h-[120px] resize-none border-green-200 focus:border-green-500 focus:ring-green-500/20 bg-gradient-to-l from-green-50 to-white text-right"
                  />
                  {errors.details && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                    <AlertTriangle className="h-4 w-4" />
                    {errors.details}
                  </p>}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="action_taken" className="text-base font-medium flex items-center gap-2 text-green-700 text-right" dir="rtl">
                    {t('incident_reports.details.action_taken_label')}
                    <Gavel className="h-4 w-4" />
                  </Label>
                  <Textarea
                    id="action_taken"
                    rows={3}
                    value={data.action_taken}
                    onChange={(e) => setData('action_taken', e.target.value)}
                    placeholder={t('incident_reports.details.action_taken_placeholder')}
                    className="min-h-[80px] resize-none border-green-200 focus:border-green-500 focus:ring-green-500/20 bg-gradient-to-l from-green-50 to-white text-right"
                  />
                  {errors.action_taken && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                    <AlertTriangle className="h-4 w-4" />
                    {errors.action_taken}
                  </p>}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="recommendation" className="text-base font-medium flex items-center gap-2 text-green-700 text-right" dir="rtl">
                    {t('incident_reports.details.recommendation_label')}
                    <FileCheck className="h-4 w-4" />
                  </Label>
                  <Textarea
                    id="recommendation"
                    rows={3}
                    value={data.recommendation}
                    onChange={(e) => setData('recommendation', e.target.value)}
                    placeholder={t('incident_reports.details.recommendation_placeholder')}
                    className="min-h-[80px] resize-none border-green-200 focus:border-green-500 focus:ring-green-500/20 bg-gradient-to-l from-green-50 to-white text-right"
                  />
                  {errors.recommendation && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                    <AlertTriangle className="h-4 w-4" />
                    {errors.recommendation}
                  </p>}
                </div>

                <input type="hidden" name="report_status" value="submitted" />
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl overflow-hidden bg-gradient-to-bl from-white to-green-50/30">
              <CardHeader className="bg-gradient-to-l from-green-500 to-green-600 text-white border-b pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  {t('incident_reports.stats.title')}
                </CardTitle>
                <CardDescription className="text-green-100">
                  {t('incident_reports.stats.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="mb-6">
                  <Label htmlFor="category-filter" className="text-base font-medium flex items-center gap-2 text-green-700 text-right" dir="rtl">
                    {t('incident_reports.stats.filter_by_category')}
                    <Building2 className="h-4 w-4" />
                  </Label>
                  <Select
                    value={selectedCategory?.toString() || 'all'}
                    onValueChange={(value) => setSelectedCategory(value !== 'all' ? parseInt(value) : null)}
                  >
                    <SelectTrigger id="category-filter" className="h-12 border-green-200 focus:border-green-500 focus:ring-green-500/20 bg-gradient-to-l from-green-50 to-white text-right">
                      <SelectValue placeholder={t('incidents.filters.all_categories')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('incidents.filters.all_categories')}</SelectItem>
                      {categoriesForFilter.map((category) => (
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
                </div>

                <TreeViewStatSelector
                  items={filteredStatItems}
                  statsData={statsData}
                  onValueChange={handleStatChange}
                  onNotesChange={handleNotesChange}
                />
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl overflow-hidden bg-gradient-to-bl from-white to-green-50/30">
              <CardFooter className="flex justify-between border-t px-6 py-5 bg-gradient-to-l from-green-50 to-green-100">
                <Button
                  variant="outline"
                  asChild
                  className="rounded-full border-green-300 text-green-700 hover:bg-green-100 hover:border-green-400 shadow-lg"
                >
                  <Link href={route('incident-reports.index')}>
                    {t('common.cancel')}
                  </Link>
                </Button>
                <Button
                  type="submit"
                  disabled={processing}
                  className="rounded-full px-8 font-medium bg-gradient-to-l from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {processing ? t('incident_reports.actions.submitting') : t('incident_reports.actions.create')}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
