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
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>All Incidents</CardTitle>
                <CardDescription>
                  A list of all incidents in the system.
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search incidents..."
                    className="pl-8 pr-4"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                {(search || status || categoryId || sortField !== 'incident_date' || sortDirection !== 'desc') && (
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
                    <SelectItem value="reported">Reported</SelectItem>
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category-filter">Category</Label>
                <Select
                  value={categoryId}
                  onValueChange={setCategoryId}
                >
                  <SelectTrigger id="category-filter">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
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
                    <SelectItem value="incident_date:desc">Date (Newest first)</SelectItem>
                    <SelectItem value="incident_date:asc">Date (Oldest first)</SelectItem>
                    <SelectItem value="title:asc">Title (A-Z)</SelectItem>
                    <SelectItem value="title:desc">Title (Z-A)</SelectItem>
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
                      Title {getSortIcon('title')}
                    </th>
                    <th
                      className="h-12 px-4 text-left align-middle font-medium cursor-pointer"
                      onClick={() => handleSort('incident_date')}
                    >
                      Date {getSortIcon('incident_date')}
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
                    <th
                      className="h-12 px-4 text-left align-middle font-medium cursor-pointer"
                      onClick={() => handleSort('status')}
                    >
                      Status {getSortIcon('status')}
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
