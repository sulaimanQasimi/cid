import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader } from '@/components/page-header';
import { ArrowRight, PlusCircle, Save, Trash2, Shield, FileText, BookText, AlertTriangle, Calendar, Clock, Users, Building2, MapPin, Phone, IdCard, Home, Gavel, FileCheck } from 'lucide-react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import InputError from '@/components/input-error';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import axios from 'axios';
import TreeViewStatSelector from '@/components/reports/TreeViewStatSelector';
import { useTranslation } from '@/lib/i18n/translate';
import { format } from 'date-fns';
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
  children_count: number;
  category: {
    id: number;
    name: string;
    label: string;
    color: string;
  };
}

interface ReportStat {
  id: number;
  incident_report_id: number;
  stat_category_item_id: number;
  integer_value: number | null;
  string_value: string | null;
  notes: string | null;
  stat_category_item: StatCategoryItem;
}

interface EditProps {
  report: {
    id: number;
    report_number: string;
    report_date: string;
    report_status: string;
    security_level: string;
    details: string;
    action_taken?: string;
    recommendation?: string;
    source?: string;
    submitted_by: number;
    approved_by?: number;
    created_at: string;
    updated_at: string;
  };
  statItems: StatCategoryItem[];
  reportStats: ReportStat[];
  statCategories: StatCategory[];
}

export default function Edit({ report, statItems, reportStats, statCategories }: EditProps) {
  const { t } = useTranslation();
  const { data, setData, put, processing, errors } = useForm({
    report_number: report.report_number,
    report_date: report.report_date,
    security_level: report.security_level,
    details: report.details,
    action_taken: report.action_taken || '',
    recommendation: report.recommendation || '',
    report_status: report.report_status,
    source: report.source || '',
  });

  const [statsData, setStatsData] = useState<{
    [key: number]: { value: string; notes: string | null };
  }>(() => {
    const initialStats: { [key: number]: { value: string; notes: string | null } } = {};
    reportStats.forEach((stat) => {
      initialStats[stat.stat_category_item_id] = {
        value: stat.integer_value !== null ? String(stat.integer_value) : (stat.string_value || ''),
        notes: stat.notes
      };
    });
    return initialStats;
  });

  const [statToDelete, setStatToDelete] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Generate breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('incident_reports.page_title'),
      href: route('incident-reports.index'),
    },
    {
      title: report.report_number,
      href: route('incident-reports.show', report.id),
    },
    {
      title: t('incident_reports.edit.breadcrumb'),
      href: route('incident-reports.edit', report.id),
    },
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Prepare stats data for batch update
    const statsForUpdate = Object.entries(statsData).map(([itemId, { value, notes }]) => ({
      stat_category_item_id: parseInt(itemId),
      value,
      notes
    }));

    // First update the report itself
    put(route('incident-reports.update', report.id), {
      onSuccess: () => {
        // After successful update of the report, update the stats
        if (statsForUpdate.length > 0) {
          // Use axios to submit the stats data
          axios.post(route('incident-reports.stats.batch-update', report.id), {
            stats: statsForUpdate
          }, {
            headers: {
              'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }).then(() => {
            // Redirect to show page after both updates are complete
            window.location.href = route('incident-reports.show', report.id);
          }).catch((error: unknown) => {
            console.error('Error updating stats:', error);
          });
        } else {
          // If no stats to update, just redirect to show page
          window.location.href = route('incident-reports.show', report.id);
        }
      }
    });
  }

  // Filter stat items by category if one is selected
  const filteredStatItems = selectedCategory
    ? statItems.filter(item => item.category.id === selectedCategory)
    : statItems;

  // Group stat categories for the dropdown filter
  const categoriesForFilter = statCategories.map(category => ({
    id: category.id,
    label: category.label,
    color: category.color
  }));

  // Handle stat input change - even empty values should be tracked to potentially clear existing values
  function handleStatChange(itemId: number, value: string) {
    setStatsData(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId] || { notes: null }, value }
    }));
  }

  // Handle stat notes change - always track the notes even if empty
  function handleNotesChange(itemId: number, notes: string) {
    setStatsData(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId] || { value: '' }, notes: notes || null }
    }));
  }

  // Delete a stat
  function deleteStat(itemId: number) {
    // Find the existing stat
    const existingStat = reportStats.find(s => s.stat_category_item_id === itemId);

    if (existingStat) {
      // If it exists in the database, send a delete request
      fetch(route('report-stats.destroy', existingStat.id), {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        }
      }).then(() => {
        // Remove from local state
        const newStatsData = { ...statsData };
        delete newStatsData[itemId];
        setStatsData(newStatsData);
      });
    } else {
      // If it's only in local state, just remove it
      const newStatsData = { ...statsData };
      delete newStatsData[itemId];
      setStatsData(newStatsData);
    }

    setStatToDelete(null);
  }

  const formattedCreatedAt = report.created_at
    ? format(new Date(report.created_at), 'MMM d, yyyy')
    : 'N/A';

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('incident_reports.edit.page_title', { number: report.report_number })} />
      <div className="container px-0 py-6">
        {/* Modern Header with Glassmorphism */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-teal-600 via-emerald-600 to-green-600 p-8 lg:p-12 text-white shadow-2xl mb-8 group">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="absolute top-0 left-0 w-80 h-80 bg-white/10 rounded-full -translate-y-40 -translate-x-40 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 translate-x-32 blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full -translate-x-16 -translate-y-16 blur-xl group-hover:scale-150 transition-transform duration-500"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8">
            <div className="flex items-center gap-8">
              <div className="p-6 bg-white/20 backdrop-blur-md rounded-3xl border border-white/30 shadow-2xl group-hover:scale-105 transition-transform duration-300">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl tracking-tight">{t('incident_reports.edit.title')}</h2>
                <p className="text-white/90 flex items-center gap-3 text-xl font-medium">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Clock className="h-6 w-6" />
                  </div>
                  {t('incident_reports.edit.created_on', { date: formattedCreatedAt })}
                </p>
              </div>
            </div>
            
            <Link href={route('incident-reports.show', report.id)} className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 rounded-2xl shadow-2xl px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 group/btn">
              <div className="flex items-center gap-3">
                <div className="p-1 bg-white/20 rounded-lg group-hover/btn:scale-110 transition-transform duration-300">
                  <ArrowRight className="h-5 w-5" />
                </div>
                {t('incident_reports.edit.back_button')}
              </div>
            </Link>
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
                      {t('incident_reports.form.report_number')}
                      <FileText className="h-4 w-4" />
                    </Label>
                    <Input
                      id="report_number"
                      value={data.report_number}
                      onChange={(e) => setData('report_number', e.target.value)}
                      disabled
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
                    <Label htmlFor="report_status" className="text-base font-medium flex items-center gap-2 text-green-700 text-right" dir="rtl">
                      {t('incident_reports.form.status')}
                      <Clock className="h-4 w-4" />
                    </Label>
                    <Select
                      value={data.report_status}
                      onValueChange={(value) => setData('report_status', value)}
                    >
                      <SelectTrigger id="report_status" className="h-12 border-green-200 focus:border-green-500 focus:ring-green-500/20 bg-gradient-to-l from-green-50 to-white text-right">
                        <SelectValue placeholder={t('incident_reports.form.status_placeholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="submitted">{t('incident_reports.status.submitted')}</SelectItem>
                        <SelectItem value="reviewed">{t('incident_reports.status.reviewed')}</SelectItem>
                        <SelectItem value="approved">{t('incident_reports.status.approved')}</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.report_status && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.report_status}
                    </p>}
                  </div>
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
                  {t('incident_reports.details.edit_description')}
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
                {/* Category filter dropdown */}
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

                {/* Tree View Stat Selector */}
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
                  type="button"
                  className="rounded-full border-green-300 text-green-700 hover:bg-green-100 hover:border-green-400 shadow-lg"
                >
                  <Link href={route('incident-reports.show', report.id)}>
                    {t('common.cancel')}
                  </Link>
                </Button>
                <Button 
                  type="submit" 
                  disabled={processing}
                  className="rounded-full px-8 font-medium bg-gradient-to-l from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {processing ? t('incident_reports.actions.saving') : t('incident_reports.actions.save_changes')}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
