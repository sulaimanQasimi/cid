import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/pagination';
import { Shield, AlertTriangle, FileText, Clock, User, Pencil, Trash, UserRound, MapPin, Calendar, Building2, Phone, IdCard, Printer, BarChart3, Eye, Users, Home, Gavel, FileCheck, BookText, ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState } from 'react';
import { useTranslation } from '@/lib/i18n/translate';
import { cn } from '@/lib/utils';
import Header from '@/components/template/header';
import PersianDateDisplay from '@/components/ui/PersianDateDisplay';
import { formatPersianDateOnly } from '@/lib/utils/date';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { useIncidentReportAccess } from '@/hooks/use-incident-report-access';
import IncidentCreateModal from '@/components/IncidentCreateModal';

interface ShowProps {
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
    submitter?: {
      id: number;
      name: string;
    };
    approver?: {
      id: number;
      name: string;
    };
  };
  incidents: {
    data: Array<{
      id: number;
      title: string;
      incident_date: string;
      description: string;
      severity: string;
      district?: {
        id: number;
        name: string;
      };
      category?: {
        id: number;
        name: string;
        color: string;
      };
    }>;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
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

export default function Show({ report, incidents, districts, categories, reports }: ShowProps) {
  const { t } = useTranslation();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const incidentReportAccess = useIncidentReportAccess();

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
  ];

  // Handle delete
  const handleDelete = () => {
    router.delete(route('incident-reports.destroy', report.id));
  };

  function getStatusBadge(status: string) {
    switch (status) {
      case 'approved':
        return <Badge variant="success">{status}</Badge>;
      case 'reviewed':
        return <Badge variant="secondary">{status}</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  }

  // Show access warning if user doesn't have proper access or access is expired
  if (!incidentReportAccess.hasIncidentReportAccessForReport || incidentReportAccess.isAccessExpired()) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title={t('incident_reports.show.page_title', { number: report.report_number })} />
        <div className="container px-0 py-6">
          <Card className="border-none shadow-xl overflow-hidden bg-gradient-to-bl from-red-50 to-red-100/30">
            <CardHeader className="bg-gradient-to-l from-red-500 to-red-600 text-white border-b pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Shield className="h-5 w-5" />
                </div>
                {t('incident_reports.access_denied.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-red-700 mb-2">
                  {t('incident_reports.access_denied.message')}
                </h3>
                <p className="text-red-600 mb-6">
                  {t('incident_reports.access_denied.description')}
                </p>
                <Button asChild className="bg-gradient-to-l from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white">
                  <Link href={route('incident-reports.index')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t('common.back_to_list')}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('incident_reports.show.page_title', { number: report.report_number })} />

      <div className="container px-0 py-6">
        <Header
          title={report.report_number}
          description={`${t('incident_reports.show.report_date_label')}: ${formatPersianDateOnly(report.report_date)}`}
          icon={<Shield className="h-5 w-5" />}
          model="incident_reports"
          routeName={() => route('incident-reports.index')}
          buttonText={t('common.back')}
          theme="violet"
          showBackButton={true}
          backRouteName={() => route('incident-reports.index')}
          backButtonText={t('common.back')}
          showButton={false}
          actionButtons={
            <div className="flex items-center gap-2">
              {incidentReportAccess.canDeleteIncidentReport && (
                <Button
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="bg-red-500/20 dark:bg-red-500/30 backdrop-blur-md border-red-300/30 dark:border-red-400/40 text-white hover:bg-red-500/30 dark:hover:bg-red-500/40 rounded-xl shadow-lg px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-red-500/20 dark:bg-red-500/30 rounded-lg">
                      <Trash className="h-4 w-4" />
                    </div>
                    {t('common.delete')}
                  </div>
                </Button>
              )}
              
              {incidentReportAccess.canUpdateIncidentReport && (
                <Button asChild className="bg-white/20 dark:bg-white/10 backdrop-blur-md border-white/30 dark:border-white/20 text-white hover:bg-white/30 dark:hover:bg-white/20 rounded-xl shadow-lg px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105">
                  <Link href={route('incident-reports.edit', report.id)}>
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-white/20 dark:bg-white/10 rounded-lg">
                        <Pencil className="h-4 w-4" />
                      </div>
                      {t('incident_reports.actions.edit_report')}
                    </div>
                  </Link>
                </Button>
              )}
              
              {incidentReportAccess.canViewIncidentReport && (
                <Button asChild className="bg-white/20 dark:bg-white/10 backdrop-blur-md border-white/30 dark:border-white/20 text-white hover:bg-white/30 dark:hover:bg-white/20 rounded-xl shadow-lg px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105">
                  <Link href={route('incident-reports.print', report.id)}>
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-white/20 dark:bg-white/10 rounded-lg">
                        <Printer className="h-4 w-4" />
                      </div>
                      {t('incident_reports.actions.print_report')}
                    </div>
                  </Link>
                </Button>
              )}
            </div>
          }
        />

        {/* Access badges */}
        {incidentReportAccess.currentAccess && (
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="bg-gradient-to-r from-violet-50/80 dark:from-violet-900/40 to-violet-100/80 dark:to-violet-800/40 backdrop-blur-sm border-violet-200/50 dark:border-violet-700/50 text-violet-700 dark:text-violet-300 px-4 py-2 text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200">
              <Shield className="h-3.5 w-3.5 mr-1.5" />
              {incidentReportAccess.currentAccess.access_type === 'full' && t('incident_reports.access.full')}
              {incidentReportAccess.currentAccess.access_type === 'read_only' && t('incident_reports.access.read_only')}
              {incidentReportAccess.currentAccess.access_type === 'incidents_only' && t('incident_reports.access.incidents_only')}
            </Badge>
            <Badge variant="outline" className="bg-gradient-to-r from-violet-50/80 dark:from-violet-900/40 to-violet-100/80 dark:to-violet-800/40 backdrop-blur-sm border-violet-200/50 dark:border-violet-700/50 text-violet-700 dark:text-violet-300 px-4 py-2 text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200">
              <FileText className="h-3.5 w-3.5 mr-1.5" />
              {incidentReportAccess.isReportSpecific() ? t('incident_reports.access.report_specific') : t('incident_reports.access.global')}
            </Badge>
            {incidentReportAccess.currentAccess.expires_at && (
              <Badge 
                variant="outline" 
                className={cn(
                  "backdrop-blur-sm px-4 py-2 text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200",
                  new Date(incidentReportAccess.currentAccess.expires_at) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    ? "bg-gradient-to-r from-yellow-50/80 dark:from-yellow-900/40 to-yellow-100/80 dark:to-yellow-800/40 border-yellow-300/50 dark:border-yellow-600/50 text-yellow-700 dark:text-yellow-300"
                    : "bg-gradient-to-r from-violet-50/80 dark:from-violet-900/40 to-violet-100/80 dark:to-violet-800/40 border-violet-200/50 dark:border-violet-700/50 text-violet-700 dark:text-violet-300"
                )}
              >
                <Clock className="h-3.5 w-3.5 mr-1.5" />
                {t('incident_reports.access.expires')}: <PersianDateDisplay date={incidentReportAccess.currentAccess.expires_at} format="date" />
              </Badge>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:gap-8 md:grid-cols-12">
          {/* Report Information */}
          <Card className="md:col-span-4 border-none shadow-2xl overflow-hidden bg-gradient-to-br from-white dark:from-gray-800 via-violet-50/20 dark:via-violet-900/10 to-white dark:to-gray-800 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-violet-500 via-violet-600 to-violet-700 dark:from-violet-600 dark:via-violet-700 dark:to-violet-800 text-white border-b border-violet-400/20 dark:border-violet-600/20 pb-5 shadow-lg">
              <CardTitle className="flex items-center gap-3 text-xl font-bold">
                <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg">
                  <FileText className="h-5 w-5" />
                </div>
                {t('incident_reports.form.info_title')}
              </CardTitle>
              <CardDescription className="text-violet-100 text-sm mt-2">
                {t('incident_reports.details.long_description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-violet-700 dark:text-violet-300 mb-4 flex items-center gap-2 uppercase tracking-wide" dir="rtl">
                    <div className="p-1.5 bg-violet-100 dark:bg-violet-900/50 rounded-lg">
                      <FileText className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                    </div>
                    {t('incident_reports.show.report_info')}
                  </h3>
                  <div className="rounded-2xl border-2 border-violet-100/50 dark:border-violet-800/50 bg-gradient-to-br from-violet-50/50 dark:from-violet-900/20 via-white dark:via-gray-800 to-violet-50/30 dark:to-violet-900/10 p-5 space-y-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex justify-between items-center py-2 border-b border-violet-100/50 dark:border-violet-800/30 last:border-0">
                      <span className="text-sm text-violet-600 dark:text-violet-400 font-semibold flex items-center gap-2" dir="rtl">
                        <div className="p-1 bg-violet-100 dark:bg-violet-900/50 rounded-md">
                          <FileText className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                        </div>
                        {t('incident_reports.show.report_number')}:
                      </span>
                      <span className="text-sm text-violet-900 dark:text-violet-100 font-bold">{report.report_number}</span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-violet-100/50 dark:border-violet-800/30 last:border-0">
                      <span className="text-sm text-violet-600 dark:text-violet-400 font-semibold flex items-center gap-2" dir="rtl">
                        <div className="p-1 bg-violet-100 dark:bg-violet-900/50 rounded-md">
                          <Calendar className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                        </div>
                        {t('incident_reports.show.report_date_label')}:
                      </span>
                      <span className="text-sm text-violet-900 dark:text-violet-100 font-medium">
                        <PersianDateDisplay date={report.report_date} format="date" />
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-violet-100/50 dark:border-violet-800/30 last:border-0">
                      <span className="text-sm text-violet-600 dark:text-violet-400 font-semibold flex items-center gap-2" dir="rtl">
                        <div className="p-1 bg-violet-100 dark:bg-violet-900/50 rounded-md">
                          <Clock className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                        </div>
                        {t('incident_reports.show.status')}:
                      </span>
                      <Badge variant="outline" className="bg-gradient-to-r from-violet-100 dark:from-violet-900/40 to-violet-200 dark:to-violet-800/40 text-violet-800 dark:text-violet-200 border-violet-300/50 dark:border-violet-700/50 px-3 py-1 text-xs font-semibold shadow-sm">
                        {t(`incident_reports.status.${report.report_status}`)}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-violet-100/50 dark:border-violet-800/30 last:border-0">
                      <span className="text-sm text-violet-600 dark:text-violet-400 font-semibold flex items-center gap-2" dir="rtl">
                        <div className="p-1 bg-violet-100 dark:bg-violet-900/50 rounded-md">
                          <Shield className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                        </div>
                        {t('incident_reports.show.security_level')}:
                      </span>
                      <Badge variant="outline" className="bg-gradient-to-r from-violet-100 dark:from-violet-900/40 to-violet-200 dark:to-violet-800/40 text-violet-800 dark:text-violet-200 border-violet-300/50 dark:border-violet-700/50 px-3 py-1 text-xs font-semibold shadow-sm">
                        {t(`incident_reports.level.${report.security_level}`)}
                      </Badge>
                    </div>

                    {report.source && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-violet-600 dark:text-violet-400 font-semibold flex items-center gap-2" dir="rtl">
                          <div className="p-1 bg-violet-100 dark:bg-violet-900/50 rounded-md">
                            <Users className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                          </div>
                          {t('incident_reports.show.source_label')}:
                        </span>
                        <span className="text-sm text-violet-900 dark:text-violet-100 font-medium">{report.source}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-violet-700 dark:text-violet-300 mb-4 flex items-center gap-2 uppercase tracking-wide" dir="rtl">
                    <div className="p-1.5 bg-violet-100 dark:bg-violet-900/50 rounded-lg">
                      <UserRound className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                    </div>
                    {t('incident_reports.show.user_info')}
                  </h3>
                  <div className="rounded-2xl border-2 border-violet-100/50 dark:border-violet-800/50 bg-gradient-to-br from-violet-50/50 dark:from-violet-900/20 via-white dark:via-gray-800 to-violet-50/30 dark:to-violet-900/10 p-5 space-y-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex justify-between items-center py-2 border-b border-violet-100/50 dark:border-violet-800/30 last:border-0">
                      <span className="text-sm text-violet-600 dark:text-violet-400 font-semibold flex items-center gap-2" dir="rtl">
                        <div className="p-1 bg-violet-100 dark:bg-violet-900/50 rounded-md">
                          <User className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                        </div>
                        {t('incident_reports.show.submitted_by')}:
                      </span>
                      <span className="text-sm text-violet-900 dark:text-violet-100 font-medium">{report.submitter?.name || t('incidents.unknown')}</span>
                    </div>

                    {report.approver && (
                      <div className="flex justify-between items-center py-2 border-b border-violet-100/50 dark:border-violet-800/30 last:border-0">
                        <span className="text-sm text-violet-600 dark:text-violet-400 font-semibold flex items-center gap-2" dir="rtl">
                          <div className="p-1 bg-violet-100 dark:bg-violet-900/50 rounded-md">
                            <User className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                          </div>
                          {t('incident_reports.show.approved_by')}:
                        </span>
                        <span className="text-sm text-violet-900 dark:text-violet-100 font-medium">{report.approver?.name}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center py-2 border-b border-violet-100/50 dark:border-violet-800/30 last:border-0">
                      <span className="text-sm text-violet-600 dark:text-violet-400 font-semibold flex items-center gap-2" dir="rtl">
                        <div className="p-1 bg-violet-100 dark:bg-violet-900/50 rounded-md">
                          <Clock className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                        </div>
                        {t('incident_reports.show.created_at')}:
                      </span>
                      <span className="text-sm text-violet-900 dark:text-violet-100 font-medium">
                        <PersianDateDisplay date={report.created_at} format="date" />
                      </span>
                    </div>

                    {report.updated_at !== report.created_at && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-violet-600 dark:text-violet-400 font-semibold flex items-center gap-2" dir="rtl">
                          <div className="p-1 bg-violet-100 dark:bg-violet-900/50 rounded-md">
                            <Clock className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                          </div>
                          {t('incident_reports.show.last_updated')}:
                        </span>
                        <span className="text-sm text-violet-900 dark:text-violet-100 font-medium">
                          <PersianDateDisplay date={report.updated_at} format="date" />
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Report Details */}
          <div className="md:col-span-8">
            <Card className="border-none shadow-2xl overflow-hidden bg-gradient-to-br from-white dark:from-gray-800 via-violet-50/20 dark:via-violet-900/10 to-white dark:to-gray-800 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-violet-500 via-violet-600 to-violet-700 dark:from-violet-600 dark:via-violet-700 dark:to-violet-800 text-white border-b border-violet-400/20 dark:border-violet-600/20 pb-5 shadow-lg">
                <CardTitle className="flex items-center gap-3 text-xl font-bold">
                  <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg">
                    <BookText className="h-5 w-5" />
                  </div>
                  {t('incident_reports.details.title')}
                </CardTitle>
                <CardDescription className="text-violet-100 text-sm mt-2">
                  {t('incident_reports.details.long_description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-violet-700 dark:text-violet-300 mb-4 flex items-center gap-2 uppercase tracking-wide" dir="rtl">
                      <div className="p-1.5 bg-violet-100 dark:bg-violet-900/50 rounded-lg">
                        <FileText className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                      </div>
                      {t('incident_reports.details.details_label')}
                    </h3>
                    <div className="rounded-2xl border-2 border-violet-100/50 dark:border-violet-800/50 bg-gradient-to-br from-violet-50/50 dark:from-violet-900/20 via-white dark:via-gray-800 to-violet-50/30 dark:to-violet-900/10 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
                      <p className="text-sm leading-relaxed text-violet-900 dark:text-violet-100 whitespace-pre-wrap" dir="rtl">{report.details}</p>
                    </div>
                  </div>

                  {report.action_taken && (
                    <div>
                      <h3 className="text-sm font-semibold text-violet-700 dark:text-violet-300 mb-4 flex items-center gap-2 uppercase tracking-wide" dir="rtl">
                        <div className="p-1.5 bg-violet-100 dark:bg-violet-900/50 rounded-lg">
                          <Gavel className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                        </div>
                        {t('incident_reports.details.action_taken_label')}
                      </h3>
                      <div className="rounded-2xl border-2 border-violet-100/50 dark:border-violet-800/50 bg-gradient-to-br from-violet-50/50 dark:from-violet-900/20 via-white dark:via-gray-800 to-violet-50/30 dark:to-violet-900/10 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <p className="text-sm leading-relaxed text-violet-900 dark:text-violet-100 whitespace-pre-wrap" dir="rtl">{report.action_taken}</p>
                      </div>
                    </div>
                  )}

                  {report.recommendation && (
                    <div>
                      <h3 className="text-sm font-semibold text-violet-700 dark:text-violet-300 mb-4 flex items-center gap-2 uppercase tracking-wide" dir="rtl">
                        <div className="p-1.5 bg-violet-100 dark:bg-violet-900/50 rounded-lg">
                          <FileCheck className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                        </div>
                        {t('incident_reports.details.recommendation_label')}
                      </h3>
                      <div className="rounded-2xl border-2 border-violet-100/50 dark:border-violet-800/50 bg-gradient-to-br from-violet-50/50 dark:from-violet-900/20 via-white dark:via-gray-800 to-violet-50/30 dark:to-violet-900/10 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <p className="text-sm leading-relaxed text-violet-900 dark:text-violet-100 whitespace-pre-wrap" dir="rtl">{report.recommendation}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="mt-8">
              <Header
                title={t('incidents.page_title')}
                description={t('incident_reports.incidents.card_description')}
                icon={<AlertTriangle className="h-5 w-5" />}
                model="incident_reports"
                routeName={() => route('incident-reports.index')}
                buttonText={t('common.back')}
                theme="violet"
                showBackButton={true}
                backRouteName={() => route('incident-reports.index')}
                backButtonText={t('common.back')}
                showButton={false}
              />
              <Card className="mt-6 border-none shadow-2xl overflow-hidden bg-gradient-to-br from-white dark:from-gray-800 via-violet-50/20 dark:via-violet-900/10 to-white dark:to-gray-800 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-violet-100 dark:bg-violet-900/50 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                      </div>
                      <h3 className="text-lg font-bold text-violet-900 dark:text-violet-100">{t('incidents.page_title')}</h3>
                    </div>
                    <Button 
                      onClick={() => setIsCreateModalOpen(true)}
                      className="bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 dark:from-violet-600 dark:to-violet-700 dark:hover:from-violet-700 dark:hover:to-violet-800"
                    >
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      {t('incidents.create_title')}
                    </Button>
                  </div>
                  
                  <div className="relative w-full overflow-auto rounded-xl border border-violet-100/50 dark:border-violet-800/50">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="[&_tr]:border-b">
                        <tr className="bg-gradient-to-r from-violet-50 dark:from-violet-900/30 to-violet-100/50 dark:to-violet-800/30 border-b border-violet-200/50 dark:border-violet-700/50">
                          <th className="h-14 px-6 text-left align-middle font-bold text-violet-800 dark:text-violet-200 text-sm uppercase tracking-wide">{t('incidents.table.title')}</th>
                          <th className="h-14 px-6 text-left align-middle font-bold text-violet-800 dark:text-violet-200 text-sm uppercase tracking-wide">{t('incidents.table.date')}</th>
                          <th className="h-14 px-6 text-left align-middle font-bold text-violet-800 dark:text-violet-200 text-sm uppercase tracking-wide">{t('incidents.table.category')}</th>
                          <th className="h-14 px-6 text-left align-middle font-bold text-violet-800 dark:text-violet-200 text-sm uppercase tracking-wide">{t('incidents.table.severity')}</th>
                          <th className="h-14 px-6 text-left align-middle font-bold text-violet-800 dark:text-violet-200 text-sm uppercase tracking-wide">{t('common.actions')}</th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0">
                        {incidents.data.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="h-32 px-6 text-center align-middle">
                              <div className="flex flex-col items-center gap-3 text-violet-600 dark:text-violet-400">
                                <div className="p-3 bg-violet-100 dark:bg-violet-900/50 rounded-full">
                                  <AlertTriangle className="h-8 w-8 text-violet-400 dark:text-violet-500" />
                                </div>
                                <p className="text-base font-semibold">{t('incidents.no_incidents')}</p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          incidents.data.map((incident) => (
                            <tr key={incident.id} className="border-b border-violet-100/50 dark:border-violet-800/30 transition-all duration-200 hover:bg-violet-50/50 dark:hover:bg-violet-900/20 group">
                              <td className="p-5 align-middle font-semibold text-violet-900 dark:text-violet-100 group-hover:text-violet-700 dark:group-hover:text-violet-200 transition-colors">{incident.title}</td>
                              <td className="p-5 align-middle text-violet-800 dark:text-violet-200 font-medium">
                                <PersianDateDisplay date={incident.incident_date} format="date" />
                              </td>
                              <td className="p-5 align-middle">
                                {incident.category ? (
                                  <Badge
                                    style={{ backgroundColor: incident.category.color, color: '#fff' }}
                                    className="px-3 py-1.5 font-semibold shadow-sm"
                                  >
                                    {incident.category.name}
                                  </Badge>
                                ) : (
                                  <span className="text-violet-600 dark:text-violet-400 text-sm">{t('incidents.none')}</span>
                                )}
                              </td>
                              <td className="p-5 align-middle">
                                <Badge 
                                  variant={
                                    incident.severity === 'high' ? 'destructive' :
                                    incident.severity === 'medium' ? 'warning' : 'default'
                                  }
                                  className="px-3 py-1.5 font-semibold shadow-sm"
                                >
                                  {incident.severity}
                                </Badge>
                              </td>
                              <td className="p-5 align-middle">
                                <Button variant="ghost" size="sm" asChild className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/40 rounded-lg transition-all duration-200 hover:scale-105">
                                  <Link href={route('incidents.show', incident.id)}>
                                    <Eye className="h-4 w-4 mr-1.5" />
                                    {t('incident_reports.view')}
                                  </Link>
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  {incidents.links && incidents.links.length > 0 && (
                    <div className="mt-6 flex justify-center">
                      <div className="bg-gradient-to-r from-violet-50 dark:from-violet-900/20 to-white dark:to-gray-800 p-4 rounded-xl shadow-lg border border-violet-200/50 dark:border-violet-700/50">
                        <Pagination links={incidents.links} />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md bg-gradient-to-br from-white dark:from-gray-800 via-red-50/10 dark:via-red-900/10 to-white dark:to-gray-800 border-red-200/50 dark:border-red-800/50 shadow-2xl">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <AlertDialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('incident_reports.delete_dialog.title')}</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="mt-2 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {t('incident_reports.delete_dialog.description', { number: report.report_number })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3">
            <AlertDialogCancel className="shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg transition-all duration-200">{t('incident_reports.delete_dialog.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg">
              {t('incident_reports.delete_dialog.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Incident Modal */}
      <IncidentCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        districts={districts}
        categories={categories}
        reportId={report.id}
      />
    </AppLayout>
  );
}
