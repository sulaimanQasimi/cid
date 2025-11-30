import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, FileText, AlertTriangle, Calendar, Clock, Users, Gavel, FileCheck } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useTranslation } from '@/lib/i18n/translate';
import Header from '@/components/template/header';
import FooterButtons from '@/components/template/FooterButtons';

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
}

export default function Edit({ report }: EditProps) {
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

  function handleCancel() {
    window.location.href = route('incident-reports.show', report.id);
  }

  function handleFormSubmit() {
    put(route('incident-reports.update', report.id));
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('incident_reports.edit.page_title', { number: report.report_number })} />
      <div className="container px-0 py-6">
        <Header
          title={t('incident_reports.edit.page_title', { number: report.report_number })}
          description={t('incident_reports.edit.page_description')}
          icon={<Shield className="h-5 w-5" />}
          model="incident_reports"
          routeName={() => route('incident-reports.show', report.id)}
          buttonText={t('common.back')}
          theme="indigo"
          showBackButton={true}
          backRouteName={() => route('incident-reports.show', report.id)}
          backButtonText={t('common.back')}
          showButton={false}
        />

        <form>
          <div className="grid gap-8">
            <Card className="border-none shadow-xl overflow-hidden bg-gradient-to-bl from-white dark:from-gray-800 to-indigo-50/30 dark:to-indigo-900/20">
              <CardHeader className="bg-gradient-to-l from-indigo-500 dark:from-indigo-600 to-indigo-600 dark:to-indigo-700 text-white border-b pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <FileText className="h-5 w-5" />
                  </div>
                  {t('incident_reports.form.info_title')}
                </CardTitle>
                <CardDescription className="text-indigo-100">
                  {t('incident_reports.form.info_description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="report_number" className="text-base font-medium flex items-center gap-2 text-indigo-700 dark:text-indigo-400 text-right" dir="rtl">
                      {t('incident_reports.form.report_number')}
                      <FileText className="h-4 w-4" />
                    </Label>
                    <Input
                      id="report_number"
                      value={data.report_number}
                      onChange={(e) => setData('report_number', e.target.value)}
                      disabled
                      className="h-12 border-indigo-200 dark:border-indigo-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 bg-gradient-to-l from-indigo-50 dark:from-indigo-900/30 to-white dark:to-gray-800 text-right"
                    />
                    {errors.report_number && <p className="text-sm text-red-500 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-200 dark:border-red-800 flex items-center gap-2 text-right">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.report_number}
                    </p>}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="report_date" className="text-base font-medium flex items-center gap-2 text-indigo-700 dark:text-indigo-400 text-right" dir="rtl">
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
                        className="h-12 border-indigo-200 dark:border-indigo-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 bg-gradient-to-l from-indigo-50 dark:from-indigo-900/30 to-white dark:to-gray-800 text-right"
                      />
                      <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-400 pointer-events-none" />
                    </div>
                    {errors.report_date && <p className="text-sm text-red-500 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-200 dark:border-red-800 flex items-center gap-2 text-right">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.report_date}
                    </p>}
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="security_level" className="text-base font-medium flex items-center gap-2 text-indigo-700 dark:text-indigo-400 text-right" dir="rtl">
                      {t('incident_reports.form.security_level')}
                      <Shield className="h-4 w-4" />
                    </Label>
                    <Select
                      value={data.security_level}
                      onValueChange={(value) => setData('security_level', value)}
                    >
                      <SelectTrigger id="security_level" className="h-12 border-indigo-200 dark:border-indigo-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 bg-gradient-to-l from-indigo-50 dark:from-indigo-900/30 to-white dark:to-gray-800 text-right">
                        <SelectValue placeholder={t('incident_reports.form.security_level_placeholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">{t('incident_reports.level.normal')}</SelectItem>
                        <SelectItem value="restricted">{t('incident_reports.level.restricted')}</SelectItem>
                        <SelectItem value="classified">{t('incident_reports.level.classified')}</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.security_level && <p className="text-sm text-red-500 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-200 dark:border-red-800 flex items-center gap-2 text-right">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.security_level}
                    </p>}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="report_status" className="text-base font-medium flex items-center gap-2 text-indigo-700 dark:text-indigo-400 text-right" dir="rtl">
                      {t('incident_reports.form.status')}
                      <Clock className="h-4 w-4" />
                    </Label>
                    <Select
                      value={data.report_status}
                      onValueChange={(value) => setData('report_status', value)}
                    >
                      <SelectTrigger id="report_status" className="h-12 border-indigo-200 dark:border-indigo-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 bg-gradient-to-l from-indigo-50 dark:from-indigo-900/30 to-white dark:to-gray-800 text-right">
                        <SelectValue placeholder={t('incident_reports.form.status_placeholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="submitted">{t('incident_reports.status.submitted')}</SelectItem>
                        <SelectItem value="reviewed">{t('incident_reports.status.reviewed')}</SelectItem>
                        <SelectItem value="approved">{t('incident_reports.status.approved')}</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.report_status && <p className="text-sm text-red-500 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-200 dark:border-red-800 flex items-center gap-2 text-right">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.report_status}
                    </p>}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="source" className="text-base font-medium flex items-center gap-2 text-indigo-700 dark:text-indigo-400 text-right" dir="rtl">
                    {t('incident_reports.form.source_label')}
                    <Users className="h-4 w-4" />
                  </Label>
                  <Input
                    id="source"
                    value={data.source}
                    onChange={(e) => setData('source', e.target.value)}
                    placeholder={t('incident_reports.form.source_placeholder')}
                    className="h-12 border-indigo-200 dark:border-indigo-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 bg-gradient-to-l from-indigo-50 dark:from-indigo-900/30 to-white dark:to-gray-800 text-right"
                  />
                  {errors.source && <p className="text-sm text-red-500 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-200 dark:border-red-800 flex items-center gap-2 text-right">
                    <AlertTriangle className="h-4 w-4" />
                    {errors.source}
                  </p>}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="details" className="text-base font-medium flex items-center gap-2 text-indigo-700 dark:text-indigo-400 text-right" dir="rtl">
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
                    className="min-h-[120px] resize-none border-indigo-200 dark:border-indigo-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 bg-gradient-to-l from-indigo-50 dark:from-indigo-900/30 to-white dark:to-gray-800 text-right"
                  />
                  {errors.details && <p className="text-sm text-red-500 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-200 dark:border-red-800 flex items-center gap-2 text-right">
                    <AlertTriangle className="h-4 w-4" />
                    {errors.details}
                  </p>}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="action_taken" className="text-base font-medium flex items-center gap-2 text-indigo-700 dark:text-indigo-400 text-right" dir="rtl">
                    {t('incident_reports.details.action_taken_label')}
                    <Gavel className="h-4 w-4" />
                  </Label>
                  <Textarea
                    id="action_taken"
                    rows={3}
                    value={data.action_taken}
                    onChange={(e) => setData('action_taken', e.target.value)}
                    placeholder={t('incident_reports.details.action_taken_placeholder')}
                    className="min-h-[80px] resize-none border-indigo-200 dark:border-indigo-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 bg-gradient-to-l from-indigo-50 dark:from-indigo-900/30 to-white dark:to-gray-800 text-right"
                  />
                  {errors.action_taken && <p className="text-sm text-red-500 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-200 dark:border-red-800 flex items-center gap-2 text-right">
                    <AlertTriangle className="h-4 w-4" />
                    {errors.action_taken}
                  </p>}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="recommendation" className="text-base font-medium flex items-center gap-2 text-indigo-700 dark:text-indigo-400 text-right" dir="rtl">
                    {t('incident_reports.details.recommendation_label')}
                    <FileCheck className="h-4 w-4" />
                  </Label>
                  <Textarea
                    id="recommendation"
                    rows={3}
                    value={data.recommendation}
                    onChange={(e) => setData('recommendation', e.target.value)}
                    placeholder={t('incident_reports.details.recommendation_placeholder')}
                    className="min-h-[80px] resize-none border-indigo-200 dark:border-indigo-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 bg-gradient-to-l from-indigo-50 dark:from-indigo-900/30 to-white dark:to-gray-800 text-right"
                  />
                  {errors.recommendation && <p className="text-sm text-red-500 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-200 dark:border-red-800 flex items-center gap-2 text-right">
                    <AlertTriangle className="h-4 w-4" />
                    {errors.recommendation}
                  </p>}
                </div>
              </CardContent>
            </Card>

            <FooterButtons
              onCancel={handleCancel}
              onSubmit={handleFormSubmit}
              processing={processing}
              cancelText={t('common.cancel')}
              submitText={t('incident_reports.actions.save_changes')}
              savingText={t('incident_reports.actions.saving')}
            />
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
