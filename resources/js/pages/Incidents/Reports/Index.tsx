import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/pagination';
import { PageHeader } from '@/components/page-header';
import { Plus, FileText, AlertCircle, Shield, Search, ArrowUpDown, X } from 'lucide-react';
import { format } from 'date-fns';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { useDebounce } from '@/hooks/use-debounce';

type SortDirection = 'asc' | 'desc';

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
  filters?: {
    search?: string;
    status?: string;
    security_level?: string;
    sort_field?: string;
    sort_direction?: SortDirection;
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

export default function Index({ reports, filters = {} }: IncidentReportProps) {
  const [search, setSearch] = useState(filters.search || '');
  const [status, setStatus] = useState(filters.status || 'all');
  const [securityLevel, setSecurityLevel] = useState(filters.security_level || 'all');
  const [sortField, setSortField] = useState(filters.sort_field || 'created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>(filters.sort_direction || 'desc');

  const debouncedSearch = useDebounce(search, 500);

  // Apply filters when they change
  useEffect(() => {
    try {
      // Only update if any filters have changed from their current values in the URL
      if (debouncedSearch !== filters.search ||
          status !== filters.status ||
          securityLevel !== filters.security_level ||
          sortField !== filters.sort_field ||
          sortDirection !== filters.sort_direction) {

        const params = {
          search: debouncedSearch,
          status: status === 'all' ? '' : status,
          security_level: securityLevel === 'all' ? '' : securityLevel,
          sort_field: sortField,
          sort_direction: sortDirection,
        };

        const routeUrl = route('incident-reports.index');
        const options = {
          preserveState: true,
          replace: true,
        };

        // Using a setTimeout to avoid the version error that occurs during direct calls
        setTimeout(() => {
          router.get(routeUrl, params, options);
        }, 0);
      }
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  }, [debouncedSearch, status, securityLevel, sortField, sortDirection, filters]);

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get sort icon
  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;

    return sortDirection === 'asc'
      ? <ArrowUpDown className="ml-1 h-4 w-4 inline" />
      : <ArrowUpDown className="ml-1 h-4 w-4 inline rotate-180" />;
  };

  // Clear all filters
  const clearFilters = () => {
    setSearch('');
    setStatus('all');
    setSecurityLevel('all');
    setSortField('created_at');
    setSortDirection('desc');
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Incident Reports" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <PageHeader
          title="Incident Reports"
          description="Security reports and analysis documents"
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
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>All Incident Reports</CardTitle>
                <CardDescription>
                  A list of all incident reports in the system.
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports..."
                    className="pl-8 pr-4"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                {(search || status || securityLevel || sortField !== 'report_date' || sortDirection !== 'desc') && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="mr-2 h-4 w-4" />
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="status-filter">Status</Label>
                <Select
                  value={status}
                  onValueChange={setStatus}
                >
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="security-level-filter">Security Level</Label>
                <Select
                  value={securityLevel}
                  onValueChange={setSecurityLevel}
                >
                  <SelectTrigger id="security-level-filter">
                    <SelectValue placeholder="All Security Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Security Levels</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sort-by">Sort By</Label>
                <Select
                  value={`${sortField}:${sortDirection}`}
                  onValueChange={(value) => {
                    const [field, direction] = value.split(':');
                    setSortField(field);
                    setSortDirection(direction as SortDirection);
                  }}
                >
                  <SelectTrigger id="sort-by">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="report_date:desc">Date (Newest first)</SelectItem>
                    <SelectItem value="report_date:asc">Date (Oldest first)</SelectItem>
                    <SelectItem value="report_number:asc">Report Number (A-Z)</SelectItem>
                    <SelectItem value="report_number:desc">Report Number (Z-A)</SelectItem>
                    <SelectItem value="incidents_count:desc">Incidents (Most first)</SelectItem>
                    <SelectItem value="incidents_count:asc">Incidents (Least first)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th
                      className="h-12 px-4 text-left align-middle font-medium cursor-pointer"
                      onClick={() => handleSort('report_number')}
                    >
                      Report Number {getSortIcon('report_number')}
                    </th>
                    <th
                      className="h-12 px-4 text-left align-middle font-medium cursor-pointer"
                      onClick={() => handleSort('report_date')}
                    >
                      Date {getSortIcon('report_date')}
                    </th>
                    <th
                      className="h-12 px-4 text-left align-middle font-medium cursor-pointer"
                      onClick={() => handleSort('incidents_count')}
                    >
                      Incidents {getSortIcon('incidents_count')}
                    </th>
                    <th
                      className="h-12 px-4 text-left align-middle font-medium cursor-pointer"
                      onClick={() => handleSort('security_level')}
                    >
                      Security Level {getSortIcon('security_level')}
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Submitted By
                    </th>
                    <th
                      className="h-12 px-4 text-left align-middle font-medium cursor-pointer"
                      onClick={() => handleSort('report_status')}
                    >
                      Status {getSortIcon('report_status')}
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
