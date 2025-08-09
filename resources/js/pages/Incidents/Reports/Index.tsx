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
import { useTranslation } from '@/lib/i18n/translate';

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
  const { t } = useTranslation();
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
      <Head title={t('incident_reports.page_title')} />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <PageHeader
          title={t('incident_reports.page_title')}
          description={t('incident_reports.page_description')}
          actions={
            <Button asChild>
              <Link href={route('incident-reports.create')}>
                <Plus className="mr-2 h-4 w-4" />
                {t('incident_reports.new_report')}
              </Link>
            </Button>
          }
        />

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>{t('incident_reports.all_reports')}</CardTitle>
                <CardDescription>
                  {t('incident_reports.list_description')}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('incident_reports.search_placeholder')}
                    className="pl-8 pr-4"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                {(search || status || securityLevel || sortField !== 'report_date' || sortDirection !== 'desc') && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="mr-2 h-4 w-4" />
                    {t('common.clear')}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="status-filter">{t('incident_reports.filters.status')}</Label>
                <Select
                  value={status}
                  onValueChange={setStatus}
                >
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder={t('incident_reports.filters.all_statuses')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('incident_reports.filters.all_statuses')}</SelectItem>
                    <SelectItem value="pending">{t('incident_reports.status.pending')}</SelectItem>
                    <SelectItem value="reviewed">{t('incident_reports.status.reviewed')}</SelectItem>
                    <SelectItem value="approved">{t('incident_reports.status.approved')}</SelectItem>
                    <SelectItem value="rejected">{t('incident_reports.status.rejected')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="security-level-filter">{t('incident_reports.filters.security_level')}</Label>
                <Select
                  value={securityLevel}
                  onValueChange={setSecurityLevel}
                >
                  <SelectTrigger id="security-level-filter">
                    <SelectValue placeholder={t('incident_reports.filters.all_security_levels')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('incident_reports.filters.all_security_levels')}</SelectItem>
                    <SelectItem value="low">{t('incident_reports.level.low')}</SelectItem>
                    <SelectItem value="medium">{t('incident_reports.level.medium')}</SelectItem>
                    <SelectItem value="high">{t('incident_reports.level.high')}</SelectItem>
                    <SelectItem value="critical">{t('incident_reports.level.critical')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sort-by">{t('incident_reports.filters.sort_by')}</Label>
                <Select
                  value={`${sortField}:${sortDirection}`}
                  onValueChange={(value) => {
                    const [field, direction] = value.split(':');
                    setSortField(field);
                    setSortDirection(direction as SortDirection);
                  }}
                >
                  <SelectTrigger id="sort-by">
                    <SelectValue placeholder={t('incident_reports.filters.sort_by')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="report_date:desc">{t('incident_reports.sort.date_newest')}</SelectItem>
                    <SelectItem value="report_date:asc">{t('incident_reports.sort.date_oldest')}</SelectItem>
                    <SelectItem value="report_number:asc">{t('incident_reports.sort.number_asc')}</SelectItem>
                    <SelectItem value="report_number:desc">{t('incident_reports.sort.number_desc')}</SelectItem>
                    <SelectItem value="incidents_count:desc">{t('incident_reports.sort.incidents_most')}</SelectItem>
                    <SelectItem value="incidents_count:asc">{t('incident_reports.sort.incidents_least')}</SelectItem>
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
                      {t('incident_reports.table.report_number')} {getSortIcon('report_number')}
                    </th>
                    <th
                      className="h-12 px-4 text-left align-middle font-medium cursor-pointer"
                      onClick={() => handleSort('report_date')}
                    >
                      {t('incident_reports.table.date')} {getSortIcon('report_date')}
                    </th>
                    <th
                      className="h-12 px-4 text-left align-middle font-medium cursor-pointer"
                      onClick={() => handleSort('incidents_count')}
                    >
                      {t('incident_reports.table.incidents')} {getSortIcon('incidents_count')}
                    </th>
                    <th
                      className="h-12 px-4 text-left align-middle font-medium cursor-pointer"
                      onClick={() => handleSort('security_level')}
                    >
                      {t('incident_reports.table.security_level')} {getSortIcon('security_level')}
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      {t('incident_reports.table.submitted_by')}
                    </th>
                    <th
                      className="h-12 px-4 text-left align-middle font-medium cursor-pointer"
                      onClick={() => handleSort('report_status')}
                    >
                      {t('incident_reports.table.status')} {getSortIcon('report_status')}
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      {t('common.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {reports.data.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="h-12 px-4 text-center align-middle">{t('incident_reports.no_reports')}</td>
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
                             {t('incident_reports.incidents_count', { count: String(report.incidents_count) })}
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
                           {report.submitter?.name || t('incidents.unknown')}
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
                                 {t('incident_reports.view')}
                              </Link>
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                            >
                              <Link href={route('incident-reports.incidents', report.id)}>
                                 <AlertCircle className="h-4 w-4 mr-1" />
                                 {t('incidents.page_title')}
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
