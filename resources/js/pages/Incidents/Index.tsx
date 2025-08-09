import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/pagination';
import { PageHeader } from '@/components/page-header';
import { Plus, FileText, AlertCircle, Search, ArrowUpDown, X } from 'lucide-react';
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

type SortDirection = 'asc' | 'desc';

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
  filters?: {
    search?: string;
    status?: string;
    category_id?: string;
    sort_field?: string;
    sort_direction?: SortDirection;
  };
  categories: Array<{
    id: number;
    name: string;
    color: string;
  }>;
}

export default function Index({ incidents, filters = {}, categories }: IncidentProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState(filters.search || '');
  const [status, setStatus] = useState(filters.status || '');
  const [categoryId, setCategoryId] = useState(filters.category_id || '');
  const [sortField, setSortField] = useState(filters.sort_field || 'incident_date');
  const [sortDirection, setSortDirection] = useState<SortDirection>(filters.sort_direction || 'desc');

  const debouncedSearch = useDebounce(search, 500);

  // Apply filters when they change
  useEffect(() => {
    try {
      // Only update if any filters have changed from their current values in the URL
      if (debouncedSearch !== filters.search ||
          status !== filters.status ||
          categoryId !== filters.category_id ||
          sortField !== filters.sort_field ||
          sortDirection !== filters.sort_direction) {

        const params = {
          search: debouncedSearch,
          status: status === 'all' ? '' : status,
          category_id: categoryId === 'all' ? '' : categoryId,
          sort_field: sortField,
          sort_direction: sortDirection,
        };

        // Use a safely-wrapped version of router.get
        const routeUrl = route('incidents.index');
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
  }, [debouncedSearch, status, categoryId, sortField, sortDirection, filters]);

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
    setCategoryId('all');
    setSortField('incident_date');
    setSortDirection('desc');
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('incidents.page_title')} />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <PageHeader
          title={t('incidents.page_title')}
          description={t('incidents.page_description')}
          actions={
            <Button asChild>
              <Link href={route('incidents.create')}>
                <Plus className="mr-2 h-4 w-4" />
                {t('incidents.new_incident')}
              </Link>
            </Button>
          }
        />

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>{t('incidents.all_incidents')}</CardTitle>
                <CardDescription>
                  {t('incidents.list_description')}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('incidents.search_placeholder')}
                    className="pl-8 pr-4"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                {(search || status || categoryId || sortField !== 'incident_date' || sortDirection !== 'desc') && (
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
                <Label htmlFor="status-filter">{t('incidents.filters.status')}</Label>
                <Select
                  value={status}
                  onValueChange={setStatus}
                >
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder={t('incidents.filters.all_statuses')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('incidents.filters.all_statuses')}</SelectItem>
                    <SelectItem value="reported">{t('incidents.status.reported')}</SelectItem>
                    <SelectItem value="investigating">{t('incidents.status.investigating')}</SelectItem>
                    <SelectItem value="resolved">{t('incidents.status.resolved')}</SelectItem>
                    <SelectItem value="closed">{t('incidents.status.closed')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category-filter">{t('incidents.filters.category')}</Label>
                <Select
                  value={categoryId}
                  onValueChange={setCategoryId}
                >
                  <SelectTrigger id="category-filter">
                    <SelectValue placeholder={t('incidents.filters.all_categories')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('incidents.filters.all_categories')}</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        <div className="flex items-center">
                          <div
                            className="mr-2 h-3 w-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          ></div>
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sort-by">{t('incidents.filters.sort_by')}</Label>
                <Select
                  value={`${sortField}:${sortDirection}`}
                  onValueChange={(value) => {
                    const [field, direction] = value.split(':');
                    setSortField(field);
                    setSortDirection(direction as SortDirection);
                  }}
                >
                  <SelectTrigger id="sort-by">
                    <SelectValue placeholder={t('incidents.filters.sort_by')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="incident_date:desc">{t('incidents.sort.date_newest')}</SelectItem>
                    <SelectItem value="incident_date:asc">{t('incidents.sort.date_oldest')}</SelectItem>
                    <SelectItem value="title:asc">{t('incidents.sort.title_asc')}</SelectItem>
                    <SelectItem value="title:desc">{t('incidents.sort.title_desc')}</SelectItem>
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
                      onClick={() => handleSort('title')}
                    >
                      {t('incidents.table.title')} {getSortIcon('title')}
                    </th>
                    <th
                      className="h-12 px-4 text-left align-middle font-medium cursor-pointer"
                      onClick={() => handleSort('incident_date')}
                    >
                      {t('incidents.table.date')} {getSortIcon('incident_date')}
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      {t('incidents.table.location')}
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      {t('incidents.table.category')}
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      {t('incidents.table.report')}
                    </th>
                    <th
                      className="h-12 px-4 text-left align-middle font-medium cursor-pointer"
                      onClick={() => handleSort('status')}
                    >
                      {t('incidents.table.status')} {getSortIcon('status')}
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      {t('common.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {incidents.data.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="h-12 px-4 text-center align-middle">
                        {t('incidents.no_incidents')}
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
                            {incident.category?.name || t('incidents.unspecified')}
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
                            <span className="text-muted-foreground text-sm">{t('incidents.none')}</span>
                          )}
                        </td>
                        <td className="p-4 align-middle">
                          <Badge variant={incident.status === 'resolved' ? 'default' :
                                          incident.status === 'investigating' ? 'default' :
                                          incident.status === 'closed' ? 'outline' : 'default'}>
                            {t(`incidents.status.${incident.status}`)}
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
                                {t('incidents.details')}
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
