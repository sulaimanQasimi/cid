import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/pagination';
import { PageHeader } from '@/components/page-header';
import { Plus, FileText, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

// Define breadcrumb navigation
const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Incidents',
    href: route('incidents.index'),
  },
];

interface IncidentProps {
  incidents: {
    data: Array<{
      id: number;
      title: string;
      incident_date: string;
      status: string;
      district: {
        id: number;
        name: string;
      };
      district_province: {
        id: number;
        name: string;
      };
      category: {
        id: number;
        name: string;
        color: string;
      };
      report: {
        id: number;
        report_number: string;
      } | null;
    }>;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
  };
}

export default function Index({ incidents }: IncidentProps) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Incidents" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <PageHeader
          title="Incidents"
          description="Manage and track all security incidents"
          actions={
            <Button asChild>
              <Link href={route('incidents.create')}>
                <Plus className="mr-2 h-4 w-4" />
                New Incident
              </Link>
            </Button>
          }
        />

        <Card>
          <CardHeader>
            <CardTitle>All Incidents</CardTitle>
            <CardDescription>
              A list of all incidents in the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Title
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Date
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Location
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Category
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Report
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
                  {incidents.data.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="h-12 px-4 text-center align-middle">
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
                          {incident.district?.name}, {incident.district_province?.name}
                        </td>
                        <td className="p-4 align-middle">
                          <Badge style={{ backgroundColor: incident.category?.color || '#888888' }}>
                            {incident.category?.name || 'Unspecified'}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle">
                          {incident.report ? (
                            <Link
                              href={route('incident-reports.show', incident.report.id)}
                              className="flex items-center text-sm text-muted-foreground hover:underline"
                            >
                              <FileText className="mr-1 h-4 w-4" />
                              {incident.report.report_number}
                            </Link>
                          ) : (
                            <span className="text-muted-foreground text-sm">None</span>
                          )}
                        </td>
                        <td className="p-4 align-middle">
                          <Badge variant={incident.status === 'resolved' ? 'default' :
                                          incident.status === 'investigating' ? 'default' :
                                          incident.status === 'closed' ? 'outline' : 'default'}>
                            {incident.status}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                            >
                              <Link href={route('incidents.show', incident.id)}>
                                <AlertCircle className="h-4 w-4 mr-1" />
                                Details
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
              <Pagination links={incidents.links} />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
