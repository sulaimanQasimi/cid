import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/pagination';
import { PageHeader } from '@/components/page-header';
import { Plus, FileText, AlertCircle, Shield } from 'lucide-react';
import { format } from 'date-fns';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface IncidentReportProps {
  reports: {
    data: Array<{
      id: number;
      report_number: string;
      report_date: string;
      report_status: string;
      security_level: string;
      details: string;
      incidents_count: number;
      submitter: {
        id: number;
        name: string;
      };
    }>;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Incident Reports',
    href: route('incident-reports.index'),
  },
];

export default function Index({ reports }: IncidentReportProps) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Incident Reports" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <PageHeader
          title="Incident Reports"
          description="incident.label" /* Placeholder label as requested */
          actions={
            <Button asChild>
              <Link href={route('incident-reports.create')}>
                <Plus className="mr-2 h-4 w-4" />
                New Report
              </Link>
            </Button>
          }
        />

        <Card>
          <CardHeader>
            <CardTitle>All Incident Reports</CardTitle>
            <CardDescription>
              A list of all incident reports in the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Report Number
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Date
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Incidents
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Security Level
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Submitted By
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Status
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {reports.data.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="h-12 px-4 text-center align-middle">
                        No reports found
                      </td>
                    </tr>
                  ) : (
                    reports.data.map((report) => (
                      <tr
                        key={report.id}
                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                      >
                        <td className="p-4 align-middle">
                          <Link
                            href={route('incident-reports.show', report.id)}
                            className="font-medium text-primary hover:underline"
                          >
                            {report.report_number}
                          </Link>
                        </td>
                        <td className="p-4 align-middle">
                          {format(new Date(report.report_date), 'PPP')}
                        </td>
                        <td className="p-4 align-middle">
                          <Badge variant="outline">
                            {report.incidents_count} incident{report.incidents_count !== 1 ? 's' : ''}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle">
                          <Badge variant={
                            report.security_level === 'classified' ? 'destructive' :
                            report.security_level === 'restricted' ? 'destructive' : 'default'
                          }>
                            <Shield className="mr-1 h-3 w-3" />
                            {report.security_level}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle">
                          {report.submitter?.name || 'Unknown'}
                        </td>
                        <td className="p-4 align-middle">
                          <Badge variant={
                            report.report_status === 'approved' ? 'outline' :
                            report.report_status === 'reviewed' ? 'secondary' : 'default'
                          }>
                            {report.report_status}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                            >
                              <Link href={route('incident-reports.show', report.id)}>
                                <FileText className="h-4 w-4 mr-1" />
                                View
                              </Link>
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                            >
                              <Link href={route('incident-reports.incidents', report.id)}>
                                <AlertCircle className="h-4 w-4 mr-1" />
                                Incidents
                              </Link>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <Pagination links={reports.links} />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
