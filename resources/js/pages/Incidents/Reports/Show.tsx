import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/page-header';
import { Pagination } from '@/components/pagination';
import { ArrowLeft, Edit, Shield, AlertTriangle, FileText, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

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
}

export default function Show({ report, incidents }: ShowProps) {
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
      title: report.report_number,
      href: route('incident-reports.show', report.id),
    },
  ];

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

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Report ${report.report_number}`} />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <PageHeader
          title={`Report ${report.report_number}`}
          description={format(new Date(report.report_date), 'PPP')}
          actions={
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => window.history.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button asChild>
                <Link href={route('incident-reports.edit', report.id)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Report
                </Link>
              </Button>
            </div>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Report Details</CardTitle>
              <CardDescription>
                Detailed information about this incident report
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-2 border-b pb-4">
                <Badge variant="outline" className="flex items-center">
                  <Clock className="mr-1 h-3 w-3" />
                  Report Date: {format(new Date(report.report_date), 'PPP')}
                </Badge>
                <Badge className="flex items-center" variant={
                  report.report_status === 'approved' ? 'outline' :
                  report.report_status === 'reviewed' ? 'secondary' : 'default'
                }>
                  {report.report_status}
                </Badge>
                <Badge variant={
                  report.security_level === 'classified' ? 'destructive' :
                  report.security_level === 'restricted' ? 'destructive' : 'default'
                } className="flex items-center">
                  <Shield className="mr-1 h-3 w-3" />
                  {report.security_level}
                </Badge>
                {report.source && (
                  <Badge variant="outline" className="flex items-center">
                    Source: {report.source}
                  </Badge>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold">Report Details</h3>
                <div className="whitespace-pre-wrap mt-2 text-muted-foreground">
                  {report.details}
                </div>
              </div>

              {report.action_taken && (
                <div>
                  <h3 className="text-lg font-semibold">Actions Taken</h3>
                  <div className="whitespace-pre-wrap mt-2 text-muted-foreground">
                    {report.action_taken}
                  </div>
                </div>
              )}

              {report.recommendation && (
                <div>
                  <h3 className="text-lg font-semibold">Recommendations</h3>
                  <div className="whitespace-pre-wrap mt-2 text-muted-foreground">
                    {report.recommendation}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Report Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Submitted By</div>
                <div className="flex items-center mt-1">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  {report.submitter?.name || 'Unknown'}
                </div>
              </div>

              {report.approver && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Approved By</div>
                  <div className="flex items-center mt-1">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    {report.approver?.name}
                  </div>
                </div>
              )}

              <div>
                <div className="text-sm font-medium text-muted-foreground">Created At</div>
                <div className="mt-1">
                  {format(new Date(report.created_at), 'PPP p')}
                </div>
              </div>

              {report.updated_at !== report.created_at && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Last Updated</div>
                  <div className="mt-1">
                    {format(new Date(report.updated_at), 'PPP p')}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Incidents</CardTitle>
              <CardDescription>
                Incidents associated with this report
              </CardDescription>
            </div>
            <Button asChild>
              <Link href={route('incident-reports.incidents', report.id)}>
                <AlertTriangle className="mr-2 h-4 w-4" />
                View All Incidents
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium">Title</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Category</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Severity</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {incidents.data.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="h-12 px-4 text-center align-middle">
                        No incidents found
                      </td>
                    </tr>
                  ) : (
                    incidents.data.map((incident) => (
                      <tr
                        key={incident.id}
                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                      >
                        <td className="p-4 align-middle">
                          <Link
                            href={route('incidents.show', incident.id)}
                            className="font-medium text-primary hover:underline"
                          >
                            {incident.title}
                          </Link>
                        </td>
                        <td className="p-4 align-middle">
                          {format(new Date(incident.incident_date), 'PPP')}
                        </td>
                        <td className="p-4 align-middle">
                          {incident.category ? (
                            <Badge style={{ backgroundColor: incident.category.color }}>
                              {incident.category.name}
                            </Badge>
                          ) : (
                            <Badge variant="outline">Uncategorized</Badge>
                          )}
                        </td>
                        <td className="p-4 align-middle">
                          <Badge variant={
                            incident.severity === 'high' ? 'destructive' :
                            incident.severity === 'medium' ? 'default' : 'outline'
                          }>
                            {incident.severity}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle">
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                          >
                            <Link href={route('incidents.show', incident.id)}>
                              <FileText className="h-4 w-4 mr-1" />
                              View
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <Pagination links={incidents.links} />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
