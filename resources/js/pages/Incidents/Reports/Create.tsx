import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PersianDatePicker from '@/components/ui/PersianDatePicker';

import { Shield, FileText, AlertTriangle, Calendar, Clock, Users, MapPin, Phone, IdCard, Home, Gavel, FileCheck, ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import InputError from '@/components/input-error';
import { useTranslation } from '@/lib/i18n/translate';
import Header from '@/components/template/header';
import FooterButtons from '@/components/template/FooterButtons';

interface CreateProps {
  securityLevels: string[];
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

export default function Create({ securityLevels }: CreateProps) {
  const { t } = useTranslation();
  const { data, setData, post, processing, errors } = useForm<ReportFormData>({
    report_date: '',
    security_level: 'normal',
    details: '',
    report_status: 'submitted',
    report_number: '',
    action_taken: '',
    recommendation: '',
    source: '',
  });

  function handleCancel() {
    window.location.href = route('incident-reports.index');
  }

  function handleFormSubmit() {
    // Submit the form
    post(route('incident-reports.store'));
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('incident_reports.create.page_title')} />
      <div className="container px-0 py-6">
        <Header
          title={t('incident_reports.create.page_title')}
          description={t('incident_reports.create.page_description')}
          icon={<Shield className="h-5 w-5" />}
          model="incident_reports"
          routeName={() => route('incident-reports.index')}
          buttonText={t('common.back')}
          theme="indigo"
          showBackButton={true}
          backRouteName={() => route('incident-reports.index')}
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
                      {t('incident_reports.form.report_number_label')}
                      <FileText className="h-4 w-4" />
                    </Label>
                    <Input
                      id="report_number"
                      value={data.report_number}
                      onChange={(e) => setData('report_number', e.target.value)}
                      placeholder={t('incident_reports.form.report_number_placeholder')}
                      className="h-12 border-indigo-200 dark:border-indigo-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 bg-gradient-to-l from-indigo-50 dark:from-indigo-900/30 to-white dark:to-gray-800 text-right"
                    />
                    {errors.report_number && <p className="text-sm text-red-500 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-200 dark:border-red-800 flex items-center gap-2 text-right">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.report_number}
                    </p>}
                  </div>

                  <div className="space-y-3">
                    <PersianDatePicker
                      id="report_date"
                      label={t('incident_reports.form.report_date')}
                      value={data.report_date}
                      onChange={(value) => setData('report_date', value)}
                      placeholder={t('incident_reports.form.report_date_placeholder')}
                      required
                      error={errors.report_date}
                      className="w-full"
                    />
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

                <input type="hidden" name="report_status" value="submitted" />
              </CardContent>
            </Card>

            <FooterButtons
              onCancel={handleCancel}
              onSubmit={handleFormSubmit}
              processing={processing}
              cancelText={t('common.cancel')}
              submitText={t('incident_reports.actions.create')}
              savingText={t('incident_reports.actions.submitting')}
            />
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
