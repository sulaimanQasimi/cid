import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/pagination';
import { PageHeader } from '@/components/page-header';
import { Plus, FileText, AlertCircle, Search, ArrowUpDown, X, Shield, Users, Building2, Calendar, TrendingUp, AlertTriangle, ChevronDown, FilterX, ChevronRight, ChevronLeft } from 'lucide-react';
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
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

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

      <div className="container px-0 py-6">
        {/* Modern Header with Glassmorphism */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-blue-600 via-indigo-600 to-purple-600 p-8 lg:p-12 text-white shadow-2xl mb-8 group">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="absolute top-0 left-0 w-80 h-80 bg-white/10 rounded-full -translate-y-40 -translate-x-40 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 translate-x-32 blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full -translate-x-16 -translate-y-16 blur-xl group-hover:scale-150 transition-transform duration-500"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8">
            <div className="flex items-center gap-8">
              <div className="p-6 bg-white/20 backdrop-blur-md rounded-3xl border border-white/30 shadow-2xl group-hover:scale-105 transition-transform duration-300">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl tracking-tight">{t('incidents.page_title')}</h2>
                <div className="text-white/90 flex items-center gap-3 text-xl font-medium">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <FileText className="h-6 w-6" />
                  </div>
                  {t('incidents.page_description')}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button asChild size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 group/btn">
                <Link href={route('incidents.create')} className="flex items-center gap-3">
                  <div className="p-1 bg-white/20 rounded-lg group-hover/btn:scale-110 transition-transform duration-300">
                    <Plus className="h-5 w-5" />
                  </div>
                  {t('incidents.new_incident')}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <Card className="shadow-2xl bg-gradient-to-bl from-white to-blue-50/30 border-0 rounded-3xl overflow-hidden">
          <CardHeader className="py-4 bg-gradient-to-l from-blue-500 to-blue-600 text-white cursor-pointer" onClick={() => setIsFiltersOpen(!isFiltersOpen)}>
            <CardTitle className="text-lg font-semibold flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm shadow-lg">
                  <Search className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-bold">{t('incidents.search_filters')}</div>
                  <div className="text-blue-100 text-xs font-medium">Find and filter incident records</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 rounded-xl"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFilters();
                  }}
                >
                  <FilterX className="h-4 w-4 mr-1" />
                  Reset
                </Button>
                <div className={`transition-transform duration-300 ${isFiltersOpen ? 'rotate-180' : ''}`}>
                  <ChevronDown className="h-5 w-5" />
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <div className={`transition-all duration-300 overflow-hidden ${isFiltersOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search Bar */}
                <div className="md:col-span-2">
                  <div className="relative">
                    <div className="relative">
                      <Input
                        placeholder={t('incidents.search_placeholder')}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-11 pl-20 pr-4 text-base border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gradient-to-l from-blue-50 to-white rounded-xl shadow-lg"
                      />
                      <Button className="absolute left-1 top-1/2 -translate-y-1/2 h-9 px-4 bg-gradient-to-l from-blue-500 to-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm">
                        Search
                      </Button>
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
                    </div>
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="h-11 shadow-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gradient-to-l from-blue-50 to-white rounded-xl text-sm">
                      <SelectValue placeholder="Status" />
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

                {/* Category Filter */}
                <div>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger className="h-11 shadow-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gradient-to-l from-blue-50 to-white rounded-xl text-sm">
                      <SelectValue placeholder="Category" />
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

                {/* Sort Options */}
                <div>
                  <Select
                    value={`${sortField}:${sortDirection}`}
                    onValueChange={(value) => {
                      const [field, direction] = value.split(':');
                      setSortField(field);
                      setSortDirection(direction as SortDirection);
                    }}
                  >
                    <SelectTrigger className="h-11 shadow-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gradient-to-l from-blue-50 to-white rounded-xl text-sm">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="incident_date:desc">{t('incidents.sort.date_newest')}</SelectItem>
                      <SelectItem value="incident_date:asc">{t('incidents.sort.date_oldest')}</SelectItem>
                      <SelectItem value="title:asc">{t('incidents.sort.title_asc')}</SelectItem>
                      <SelectItem value="title:desc">{t('incidents.sort.title_desc')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Direction & Quick Actions Row */}
                <div className="md:col-span-2 lg:col-span-4 grid grid-cols-3 gap-3">
                  {/* Direction Button */}
                  <div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
                        setSortDirection(newDirection);
                      }}
                      title={sortDirection === 'asc' ? 'Descending' : 'Ascending'}
                      className="h-11 w-full shadow-lg border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400 rounded-xl transition-all duration-300 hover:scale-105 text-sm"
                    >
                      <ArrowUpDown className={`h-4 w-4 mr-2 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      {sortDirection === 'asc' ? 'Asc' : 'Desc'}
                    </Button>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      className="h-11 px-3 shadow-lg border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400 rounded-xl transition-all duration-300 hover:scale-105 text-sm"
                    >
                      <FilterX className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Results Table */}
        <div className="mt-8">
          <Card className="shadow-2xl overflow-hidden bg-gradient-to-bl from-white to-blue-50/30 border-0 rounded-3xl">
            <CardHeader className="bg-gradient-to-l from-blue-500 to-blue-600 text-white py-6">
              <CardTitle className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{t('incidents.table.title')}</div>
                  <div className="text-blue-100 text-sm font-medium">Incident records overview</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-hidden rounded-b-3xl">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="bg-gradient-to-l from-blue-100 to-blue-200 border-0">
                      <th
                        className="h-12 px-6 text-left align-middle font-bold text-blue-800 text-lg cursor-pointer"
                        onClick={() => handleSort('title')}
                      >
                        {t('incidents.table.title')} {getSortIcon('title')}
                      </th>
                      <th
                        className="h-12 px-6 text-left align-middle font-bold text-blue-800 text-lg cursor-pointer"
                        onClick={() => handleSort('incident_date')}
                      >
                        {t('incidents.table.date')} {getSortIcon('incident_date')}
                      </th>
                      <th className="h-12 px-6 text-left align-middle font-bold text-blue-800 text-lg">
                        {t('incidents.table.location')}
                      </th>
                      <th className="h-12 px-6 text-left align-middle font-bold text-blue-800 text-lg">
                        {t('incidents.table.category')}
                      </th>
                      <th className="h-12 px-6 text-left align-middle font-bold text-blue-800 text-lg">
                        {t('incidents.table.report')}
                      </th>
                      <th
                        className="h-12 px-6 text-left align-middle font-bold text-blue-800 text-lg cursor-pointer"
                        onClick={() => handleSort('status')}
                      >
                        {t('incidents.table.status')} {getSortIcon('status')}
                      </th>
                      <th className="h-12 px-6 text-left align-middle font-bold text-blue-800 text-lg">
                        {t('common.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {incidents.data.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="h-32 text-center align-middle">
                          <div className="flex flex-col items-center gap-4 text-blue-600">
                            <div className="p-4 bg-blue-100 rounded-full">
                              <AlertTriangle className="h-16 w-16 text-blue-400" />
                            </div>
                            <p className="text-xl font-bold">{t('incidents.no_incidents')}</p>
                            <p className="text-blue-500">No incident records found</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      incidents.data.map((incident) => (
                        <tr
                          key={incident.id}
                          className="border-b border-blue-100 transition-colors hover:bg-blue-50/50 data-[state=selected]:bg-muted"
                        >
                          <td className="p-6 align-middle">
                            <Link
                              href={route('incidents.show', incident.id)}
                              className="font-bold text-blue-900 text-lg hover:underline"
                            >
                              {incident.title}
                            </Link>
                          </td>
                          <td className="p-6 align-middle text-blue-800 font-medium">
                            {format(new Date(incident.incident_date), 'PPP')}
                          </td>
                          <td className="p-6 align-middle text-blue-800">
                            {incident.district?.name}, {incident.district_province?.name}
                          </td>
                          <td className="p-6 align-middle">
                            <Badge variant="outline" className="bg-gradient-to-l from-blue-100 to-blue-200 text-blue-800 border-blue-300 px-4 py-2 rounded-xl font-semibold">
                              {incident.category?.name || t('incidents.unspecified')}
                            </Badge>
                          </td>
                          <td className="p-6 align-middle">
                            {incident.report ? (
                              <Link
                                href={route('incident-reports.show', incident.report.id)}
                                className="flex items-center text-sm text-blue-600 hover:underline font-medium"
                              >
                                <FileText className="mr-1 h-4 w-4" />
                                {incident.report.report_number}
                              </Link>
                            ) : (
                              <span className="text-blue-600 font-medium">{t('incidents.none')}</span>
                            )}
                          </td>
                          <td className="p-6 align-middle">
                            <Badge variant="outline" className="bg-gradient-to-l from-blue-100 to-blue-200 text-blue-800 border-blue-300 px-4 py-2 rounded-xl font-semibold">
                              {t(`incidents.status.${incident.status}`)}
                            </Badge>
                          </td>
                          <td className="p-6 align-middle">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                title={t('incidents.details')}
                                className="h-10 w-10 rounded-xl hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-all duration-300 hover:scale-110"
                              >
                                <Link href={route('incidents.show', incident.id)}>
                                  <AlertCircle className="h-5 w-5" />
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
            </CardContent>
          </Card>
        </div>

        {/* Pagination */}
        {incidents.links && incidents.links.length > 0 && (
          <div className="mt-8 flex justify-center">
            <div className="bg-gradient-to-l from-blue-50 to-white p-4 rounded-3xl shadow-2xl border border-blue-200">
              <Pagination links={incidents.links} />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
