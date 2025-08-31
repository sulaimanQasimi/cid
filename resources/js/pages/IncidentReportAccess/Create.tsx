import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Shield, User, Calendar, Clock, AlertTriangle, CheckCircle, Users, Lock, FileText } from 'lucide-react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useTranslation } from '@/lib/i18n/translate';
import { format } from 'date-fns';

interface User {
  id: number;
  name: string;
  email: string;
}

interface IncidentReport {
  id: number;
  report_number: string;
  report_date: string;
}

interface CreateProps {
  users: User[];
  incidentReports: IncidentReport[];
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Incident Report Access',
    href: route('incident-report-access.index'),
  },
  {
    title: 'Grant Access',
    href: route('incident-report-access.create'),
  },
];

export default function Create({ users, incidentReports }: CreateProps) {
  const { t } = useTranslation();
  const { data, setData, post, processing, errors } = useForm({
    user_id: '',
    incident_report_id: '',
    access_type: 'read_only',
    notes: '',
    expires_at: '',
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Convert "global" to empty string for backend processing
    const formData = {
      ...data,
      incident_report_id: data.incident_report_id === 'global' ? '' : data.incident_report_id,
    };
    
    // Update the form data and submit
    setData(formData);
    post(route('incident-report-access.store'));
  }

  // Handle report selection change
  function handleReportChange(value: string) {
    setData('incident_report_id', value);
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Grant Incident Report Access" />
      <div className="container px-0 py-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-purple-600 via-blue-600 to-indigo-600 p-8 lg:p-12 text-white shadow-2xl mb-8 group">
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="absolute top-0 left-0 w-80 h-80 bg-white/10 rounded-full -translate-y-40 -translate-x-40 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 translate-x-32 blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8">
            <div className="flex items-center gap-8">
              <div className="p-6 bg-white/20 backdrop-blur-md rounded-3xl border border-white/30 shadow-2xl group-hover:scale-105 transition-transform duration-300">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl tracking-tight">{t('grant_access')}</h2>
                <div className="text-white/90 flex items-center gap-3 text-xl font-medium">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Lock className="h-6 w-6" />
                  </div>
                  {t('grant_incident_report_access_to_user')}
                </div>
              </div>
            </div>
            
            <Button asChild className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 rounded-xl shadow-lg px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105">
              <Link href={route('incident-report-access.index')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('back_to_access_management')}
              </Link>
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8">
            {/* User Selection */}
            <Card className="border-none shadow-xl overflow-hidden bg-gradient-to-bl from-white to-purple-50/30">
              <CardHeader className="bg-gradient-to-l from-purple-500 to-purple-600 text-white border-b pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <User className="h-5 w-5" />
                  </div>
                  {t('select_user')}
                </CardTitle>
                <CardDescription className="text-purple-100">
                  {t('choose_user_to_grant_access')}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="user_id" className="text-base font-medium flex items-center gap-2 text-purple-700">
                    <span className="text-red-500">*</span>
                    {t('user')}
                    <User className="h-4 w-4" />
                  </Label>
                  <Select
                    value={data.user_id}
                    onValueChange={(value) => setData('user_id', value)}
                  >
                    <SelectTrigger className="h-12 border-purple-200 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 to-white">
                      <SelectValue placeholder={t('select_user_to_grant_access')} />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          <div className="flex flex-col">
                            <span className="font-medium">{user.name}</span>
                            <span className="text-sm text-gray-500">{user.email}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.user_id && (
                    <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.user_id}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Report Selection */}
            <Card className="border-none shadow-xl overflow-hidden bg-gradient-to-bl from-white to-purple-50/30">
              <CardHeader className="bg-gradient-to-l from-purple-500 to-purple-600 text-white border-b pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <FileText className="h-5 w-5" />
                  </div>
                  {t('report_selection')}
                </CardTitle>
                <CardDescription className="text-purple-100">
                  {t('choose_global_or_specific')}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="incident_report_id" className="text-base font-medium flex items-center gap-2 text-purple-700">
                    {t('report_optional')}
                    <FileText className="h-4 w-4" />
                  </Label>
                  <Select
                    value={data.incident_report_id}
                    onValueChange={handleReportChange}
                  >
                    <SelectTrigger className="h-12 border-purple-200 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 to-white">
                      <SelectValue placeholder={t('select_specific_report')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="global">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <div>
                            <div className="font-medium">{t('global_access')}</div>
                            <div className="text-sm text-gray-500">{t('access_to_all_incident_reports')}</div>
                          </div>
                        </div>
                      </SelectItem>
                      {incidentReports.map((report) => (
                        <SelectItem key={report.id} value={report.id.toString()}>
                          <div className="flex flex-col">
                            <span className="font-medium">{report.report_number}</span>
                            <span className="text-sm text-gray-500">
                              {format(new Date(report.report_date), 'PPP')}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.incident_report_id && (
                    <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.incident_report_id}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Access Configuration */}
            <Card className="border-none shadow-xl overflow-hidden bg-gradient-to-bl from-white to-purple-50/30">
              <CardHeader className="bg-gradient-to-l from-purple-500 to-purple-600 text-white border-b pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Shield className="h-5 w-5" />
                  </div>
                  {t('access_configuration')}
                </CardTitle>
                <CardDescription className="text-purple-100">
                  {t('configure_type_and_duration')}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="access_type" className="text-base font-medium flex items-center gap-2 text-purple-700">
                      <span className="text-red-500">*</span>
                      {t('access_type')}
                      <Shield className="h-4 w-4" />
                    </Label>
                    <Select
                      value={data.access_type}
                      onValueChange={(value) => setData('access_type', value)}
                    >
                      <SelectTrigger className="h-12 border-purple-200 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 to-white">
                        <SelectValue placeholder={t('select_access_type')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="read_only">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <div>
                              <div className="font-medium">{t('read_only')}</div>
                              <div className="text-sm text-gray-500">{t('view_incident_reports_and_incidents_only')}</div>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="incidents_only">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <div>
                              <div className="font-medium">{t('incidents_only')}</div>
                              <div className="text-sm text-gray-500">{t('access_to_incidents_only_not_reports')}</div>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="full">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <div>
                              <div className="font-medium">{t('full_access')}</div>
                              <div className="text-sm text-gray-500">{t('complete_access_to_create_edit_and_delete')}</div>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.access_type && (
                      <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        {errors.access_type}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="expires_at" className="text-base font-medium flex items-center gap-2 text-purple-700">
                      {t('expiration_date')}
                      <Calendar className="h-4 w-4" />
                    </Label>
                    <Input
                      id="expires_at"
                      type="datetime-local"
                      value={data.expires_at}
                      onChange={(e) => setData('expires_at', e.target.value)}
                      className="h-12 border-purple-200 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 to-white"
                    />
                    {errors.expires_at && (
                      <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        {errors.expires_at}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="notes" className="text-base font-medium flex items-center gap-2 text-purple-700">
                    {t('notes')}
                    <Clock className="h-4 w-4" />
                  </Label>
                  <Textarea
                    id="notes"
                    rows={3}
                    value={data.notes}
                    onChange={(e) => setData('notes', e.target.value)}
                    placeholder={t('optional_notes')}
                    className="min-h-[80px] resize-none border-purple-200 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 to-white"
                  />
                  {errors.notes && (
                    <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.notes}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Access Type Information */}
            <Card className="border-none shadow-xl overflow-hidden bg-gradient-to-bl from-white to-purple-50/30">
              <CardHeader className="bg-gradient-to-l from-blue-500 to-blue-600 text-white border-b pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  {t('access_type_details')}
                </CardTitle>
                <CardDescription className="text-blue-100">
                  {t('understanding_access_levels')}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <h3 className="font-semibold text-blue-900">{t('read_only')}</h3>
                    </div>
                    <p className="text-sm text-blue-700">
                      {t('read_only_description')}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <h3 className="font-semibold text-orange-900">{t('incidents_only')}</h3>
                    </div>
                    <p className="text-sm text-orange-700">
                      {t('incidents_only_description')}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <h3 className="font-semibold text-green-900">{t('full_access')}</h3>
                    </div>
                    <p className="text-sm text-green-700">
                      {t('full_access_description')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <Card className="border-none shadow-xl overflow-hidden bg-gradient-to-bl from-white to-purple-50/30">
              <CardFooter className="flex justify-between border-t px-6 py-5 bg-gradient-to-l from-purple-50 to-purple-100">
                <Button
                  variant="outline"
                  asChild
                  className="rounded-full border-purple-300 text-purple-700 hover:bg-purple-100 hover:border-purple-400 shadow-lg"
                >
                  <Link href={route('incident-report-access.index')}>
                    {t('cancel')}
                  </Link>
                </Button>
                <Button
                  type="submit"
                  disabled={processing}
                  className="rounded-full px-8 font-medium bg-gradient-to-l from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {processing ? t('granting_access') : t('grant_access')}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
