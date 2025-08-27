import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/page-header';
import { ArrowRight, Plus, FileText, MapPin, Calendar, Shield, AlertTriangle, TrendingUp, Printer } from 'lucide-react';
import { format } from 'date-fns';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useTranslation } from '@/lib/i18n/translate';
import { cn } from '@/lib/utils';

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
        return <Badge variant="destructive" className="bg-red-500 text-white border-red-600 px-3 py-1 text-xs font-medium rounded-lg">{severity}</Badge>;
      case 'medium':
        return <Badge variant="default" className="bg-yellow-500 text-white border-yellow-600 px-3 py-1 text-xs font-medium rounded-lg">{severity}</Badge>;
      default:
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 px-3 py-1 text-xs font-medium rounded-lg">{severity}</Badge>;
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case 'closed':
        return <Badge variant="secondary" className="bg-gray-500 text-white border-gray-600 px-3 py-1 text-xs font-medium rounded-lg">{t('incidents.status.closed')}</Badge>;
      case 'in_progress':
        return <Badge variant="default" className="bg-blue-500 text-white border-blue-600 px-3 py-1 text-xs font-medium rounded-lg">{t('incidents.status.in_progress')}</Badge>;
      default:
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 px-3 py-1 text-xs font-medium rounded-lg">{status}</Badge>;
    }
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('incident_reports.incidents.page_title', { number: report.report_number })} />

      <div className="container px-0 py-6">
        {/* Modern Header with Glassmorphism */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-green-600 via-emerald-600 to-teal-600 p-8 lg:p-12 text-white shadow-2xl mb-8 group">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="absolute top-0 left-0 w-80 h-80 bg-white/10 rounded-full -translate-y-40 -translate-x-40 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 translate-x-32 blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full -translate-x-16 -translate-y-16 blur-xl group-hover:scale-150 transition-transform duration-500"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8">
            <div className="flex items-center gap-8">
              <div className="p-6 bg-white/20 backdrop-blur-md rounded-3xl border border-white/30 shadow-2xl group-hover:scale-105 transition-transform duration-300">
                <AlertTriangle className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl tracking-tight">{t('incident_reports.incidents.page_header_title', { number: report.report_number })}</h2>
                <p className="text-white/90 flex items-center gap-3 text-xl font-medium">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <FileText className="h-6 w-6" />
                  </div>
                  {t('incident_reports.incidents.page_header_desc', { date: format(new Date(report.report_date), 'PPP') })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Link href={route('incident-reports.show', report.id)} className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 rounded-xl shadow-lg px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 group/btn">
                <div className="flex items-center gap-2">
                  {t('incident_reports.actions.back_to_report')}
                  <div className="p-1 bg-white/20 rounded-lg group-hover/btn:scale-110 transition-transform duration-300">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
              
              <Button asChild size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105 group/btn">
                <Link href={route('incidents.create', { report_id: report.id })} className="flex items-center gap-3">
                  <div className="p-1 bg-white/20 rounded-lg group-hover/btn:scale-110 transition-transform duration-300">
                    <Plus className="h-5 w-5" />
                  </div>
                  {t('incident_reports.actions.add_incident')}
                </Link>
              </Button>
              
              <Button asChild size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105 group/btn">
                <Link href={route('incident-reports.print', report.id)} className="flex items-center gap-3">
                  <div className="p-1 bg-white/20 rounded-lg group-hover/btn:scale-110 transition-transform duration-300">
                    <Printer className="h-5 w-5" />
                  </div>
                  {t('incident_reports.actions.print_report')}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="mt-8">
          <Card className="shadow-2xl overflow-hidden bg-gradient-to-bl from-white to-green-50/30 border-0 rounded-3xl">
            <CardHeader className="bg-gradient-to-l from-green-500 to-green-600 text-white py-6">
              <CardTitle className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{t('incidents.page_title')}</div>
                  <div className="text-green-100 text-sm font-medium">Incidents overview for this report</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {incidents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="flex flex-col items-center gap-4 text-green-600">
                    <div className="p-4 bg-green-100 rounded-full">
                      <AlertTriangle className="h-16 w-16 text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold">{t('incidents.no_incidents')}</h3>
                    <p className="text-green-500 max-w-md">
                      {t('incident_reports.incidents.empty.description')}
                    </p>
                    <Button className="mt-6 bg-gradient-to-l from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg rounded-xl px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105" asChild>
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
                    <Card key={incident.id} className="flex flex-col border-none shadow-xl overflow-hidden bg-gradient-to-bl from-white to-green-50/30 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                      <CardHeader className="pb-3 bg-gradient-to-l from-green-500 to-green-600 text-white">
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
                            <CardDescription className="flex items-center text-green-100 text-xs">
                              <Calendar className="h-3 w-3 mr-1" />
                              {format(new Date(incident.incident_date), 'PPP')}
                            </CardDescription>
                          </div>
                          {incident.category ? (
                            <Badge className="bg-white/20 text-white border-white/30 px-3 py-1 text-xs font-medium">
                              {incident.category.name}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-white/20 text-white border-white/30 px-3 py-1 text-xs font-medium">
                              {t('incident_reports.incidents.uncategorized')}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 pb-3 p-6">
                        <div className="mb-4 flex items-start text-xs text-green-600">
                          <MapPin className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                          <span className="font-medium">{incident.location || t('incidents.unspecified_location')}</span>
                        </div>
                        <p className="text-sm text-green-800 line-clamp-3 mb-4">
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
                            className="text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-300"
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
