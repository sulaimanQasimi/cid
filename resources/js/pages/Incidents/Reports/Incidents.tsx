import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/page-header';
import { ArrowLeft, Plus, FileText, MapPin, Calendar, Shield } from 'lucide-react';
import { format } from 'date-fns';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useTranslation } from '@/lib/i18n/translate';

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
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('sidebar.intelligence_dashboard'),
      href: '/dashboard',
    },
    {
      title: t('sidebar.incident_reports'),
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
        return <Badge variant="destructive">{severity}</Badge>;
      case 'medium':
        return <Badge variant="default">{severity}</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case 'closed':
        return <Badge variant="secondary">{t('incidents.status.closed')}</Badge>;
      case 'in_progress':
        return <Badge variant="default">{t('incidents.status.in_progress')}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('incident_reports.incidents.page_title', { number: report.report_number })} />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <PageHeader
          title={t('incident_reports.incidents.page_header_title', { number: report.report_number })}
          description={t('incident_reports.incidents.page_header_desc', { date: format(new Date(report.report_date), 'PPP') })}
          actions={
            <div className="flex space-x-2">
              <Button variant="outline" asChild>
                <Link href={route('incident-reports.show', report.id)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t('incident_reports.actions.back_to_report')}
                </Link>
              </Button>
              <Button asChild>
                <Link href={route('incidents.create', { report_id: report.id })}>
                  <Plus className="mr-2 h-4 w-4" />
                  {t('incident_reports.actions.add_incident')}
                </Link>
              </Button>
            </div>
          }
        />

        {incidents.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <div className="text-center">
                <h3 className="text-lg font-medium">{t('incidents.no_incidents')}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('incident_reports.incidents.empty.description')}
                </p>
                <Button className="mt-4" asChild>
                  <Link href={route('incidents.create', { report_id: report.id })}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('incident_reports.incidents.empty.add_first')}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {incidents.map((incident) => (
              <Card key={incident.id} className="flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-base">
                        <Link
                          href={route('incidents.show', incident.id)}
                          className="hover:underline text-primary"
                        >
                          {incident.title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="flex items-center text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(incident.incident_date), 'PPP')}
                      </CardDescription>
                    </div>
                    {incident.category ? (
                      <Badge style={{ backgroundColor: incident.category.color }}>
                        {incident.category.name}
                      </Badge>
                    ) : (
                      <Badge variant="outline">{t('incident_reports.incidents.uncategorized')}</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 pb-2">
                  <div className="mb-3 flex items-start text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                    <span>{incident.location || t('incidents.unspecified_location')}</span>
                  </div>
                  <p className="text-sm line-clamp-3">
                    {incident.description}
                  </p>
                </CardContent>
                <div className="px-6 pb-4 pt-0 mt-auto">
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      {getSeverityBadge(incident.severity)}
                      {getStatusBadge(incident.status)}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                    >
                      <Link href={route('incidents.show', incident.id)}>
                        <FileText className="h-4 w-4 mr-1" />
                        {t('incident_reports.view')}
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
