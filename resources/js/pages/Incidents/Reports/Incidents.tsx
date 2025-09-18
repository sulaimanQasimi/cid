import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, MapPin, Calendar, AlertTriangle, TrendingUp, Printer } from 'lucide-react';
import { format } from 'date-fns';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useTranslation } from '@/lib/i18n/translate';
import { cn } from '@/lib/utils';
import Header from '@/components/template/header';

interface IncidentsProps {
  report: {
    id: number;
    report_number: string;
    report_date: string;
    report_status: string;
    security_level: string;
    details: string;
    submitter?: {
      id: number;
      name: string;
    };
  };
  incidents: Array<{
    id: number;
    title: string;
    incident_date: string;
    location: string;
    description: string;
    severity: string;
    status: string;
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
}

export default function Incidents({ report, incidents }: IncidentsProps) {
  const { t } = useTranslation();
  
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
      title: t('incidents.page_title'),
      href: route('incident-reports.incidents', report.id),
    },
  ];

  function getSeverityBadge(severity: string) {
    switch (severity) {
      case 'high':
        return <Badge variant="destructive" className="bg-red-500 dark:bg-red-600 text-white border-red-600 dark:border-red-700 px-3 py-1 text-xs font-medium rounded-lg">{severity}</Badge>;
      case 'medium':
        return <Badge variant="default" className="bg-yellow-500 dark:bg-yellow-600 text-white border-yellow-600 dark:border-yellow-700 px-3 py-1 text-xs font-medium rounded-lg">{severity}</Badge>;
      default:
        return <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700 px-3 py-1 text-xs font-medium rounded-lg">{severity}</Badge>;
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case 'closed':
        return <Badge variant="secondary" className="bg-gray-500 dark:bg-gray-600 text-white border-gray-600 dark:border-gray-700 px-3 py-1 text-xs font-medium rounded-lg">{t('incidents.status.closed')}</Badge>;
      case 'in_progress':
        return <Badge variant="default" className="bg-blue-500 dark:bg-blue-600 text-white border-blue-600 dark:border-blue-700 px-3 py-1 text-xs font-medium rounded-lg">{t('incidents.status.in_progress')}</Badge>;
      default:
        return <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700 px-3 py-1 text-xs font-medium rounded-lg">{status}</Badge>;
    }
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('incident_reports.incidents.page_title', { number: report.report_number })} />

      <div className="container px-0 py-6">
        <Header
          title={t('incident_reports.incidents.page_header_title', { number: report.report_number })}
          description={`${t('incident_reports.incidents.page_header_desc', { date: format(new Date(report.report_date), 'PPP') })}`}
          icon={<AlertTriangle className="h-5 w-5" />}
          model="incident_reports"
          routeName={() => route('incident-reports.index')}
          buttonText={t('common.back')}
          theme="violet"
          showBackButton={true}
          backRouteName={() => route('incident-reports.show', report.id)}
          backButtonText={t('incident_reports.actions.back_to_report')}
          showButton={false}
          actionButtons={
            <div className="flex items-center gap-2">
              <Button asChild className="bg-white/20 dark:bg-white/10 backdrop-blur-md border-white/30 dark:border-white/20 text-white hover:bg-white/30 dark:hover:bg-white/20 rounded-xl shadow-lg px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105">
                <Link href={route('incidents.create', { report_id: report.id })}>
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-white/20 dark:bg-white/10 rounded-lg">
                      <Plus className="h-4 w-4" />
                    </div>
                    {t('incident_reports.actions.add_incident')}
                  </div>
                </Link>
              </Button>
              
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
            </div>
          }
        />

        {/* Results Section */}
        <div className="mt-8">
          <Card className="shadow-2xl overflow-hidden bg-gradient-to-bl from-white dark:from-gray-800 to-violet-50/30 dark:to-violet-900/20 border-0 rounded-3xl">
            <CardHeader className="bg-gradient-to-l from-violet-500 dark:from-violet-600 to-violet-600 dark:to-violet-700 text-white py-6">
              <CardTitle className="flex items-center gap-4">
                <div className="p-3 bg-white/20 dark:bg-white/10 rounded-2xl backdrop-blur-sm shadow-lg">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{t('incidents.page_title')}</div>
                  <div className="text-violet-100 dark:text-violet-200 text-sm font-medium">Incidents overview for this report</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {incidents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="flex flex-col items-center gap-4 text-violet-600 dark:text-violet-400">
                    <div className="p-4 bg-violet-100 dark:bg-violet-900/30 rounded-full">
                      <AlertTriangle className="h-16 w-16 text-violet-400 dark:text-violet-500" />
                    </div>
                    <h3 className="text-xl font-bold">{t('incidents.no_incidents')}</h3>
                    <p className="text-violet-500 dark:text-violet-400 max-w-md">
                      {t('incident_reports.incidents.empty.description')}
                    </p>
                    <Button className="mt-6 bg-gradient-to-l from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 dark:from-violet-600 dark:to-violet-700 dark:hover:from-violet-700 dark:hover:to-violet-800 text-white shadow-lg rounded-xl px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105" asChild>
                      <Link href={route('incidents.create', { report_id: report.id })}>
                        <Plus className="mr-2 h-5 w-5" />
                        {t('incident_reports.incidents.empty.add_first')}
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {incidents.map((incident) => (
                    <Card key={incident.id} className="flex flex-col border-none shadow-xl overflow-hidden bg-gradient-to-bl from-white dark:from-gray-800 to-violet-50/30 dark:to-violet-900/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                      <CardHeader className="pb-3 bg-gradient-to-l from-violet-500 dark:from-violet-600 to-violet-600 dark:to-violet-700 text-white">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <CardTitle className="text-base">
                              <Link
                                href={route('incidents.show', incident.id)}
                                className="hover:underline text-white font-bold"
                              >
                                {incident.title}
                              </Link>
                            </CardTitle>
                            <CardDescription className="flex items-center text-violet-100 dark:text-violet-200 text-xs">
                              <Calendar className="h-3 w-3 mr-1" />
                              {format(new Date(incident.incident_date), 'PPP')}
                            </CardDescription>
                          </div>
                          {incident.category ? (
                            <Badge className="bg-white/20 dark:bg-white/10 text-white border-white/30 dark:border-white/20 px-3 py-1 text-xs font-medium">
                              {incident.category.name}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-white/20 dark:bg-white/10 text-white border-white/30 dark:border-white/20 px-3 py-1 text-xs font-medium">
                              {t('incident_reports.incidents.uncategorized')}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 pb-3 p-6">
                        <div className="mb-4 flex items-start text-xs text-violet-600 dark:text-violet-400">
                          <MapPin className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                          <span className="font-medium">{incident.location || t('incidents.unspecified_location')}</span>
                        </div>
                        <p className="text-sm text-violet-800 dark:text-violet-200 line-clamp-3 mb-4">
                          {incident.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2">
                            {getSeverityBadge(incident.severity)}
                            {getStatusBadge(incident.status)}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-all duration-300"
                          >
                            <Link href={route('incidents.show', incident.id)}>
                              <FileText className="h-4 w-4 mr-1" />
                              {t('incident_reports.view')}
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
