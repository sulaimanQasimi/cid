import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/pagination';
import { PageHeader } from '@/components/page-header';
import { Plus, FileText, AlertCircle, Shield, Search, ArrowUpDown, X, Users, Building2, Calendar, TrendingUp, AlertTriangle, ChevronDown, FilterX, ChevronRight, ChevronLeft, Printer } from 'lucide-react';
import { format } from 'date-fns';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useRef } from 'react';
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
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  // Function to perform search with loading state
  const performSearch = (searchTerm: string, currentStatus: string, currentSecurityLevel: string, currentSortField: string, currentSortDirection: SortDirection) => {
    if (isLoading) return; // Prevent simultaneous requests
    
    setIsLoading(true);
    
    const params = {
      search: searchTerm,
      status: currentStatus === 'all' ? '' : currentStatus,
      security_level: currentSecurityLevel === 'all' ? '' : currentSecurityLevel,
      sort_field: currentSortField,
      sort_direction: currentSortDirection,
    };

    const routeUrl = route('incident-reports.index');
    const options = {
      preserveState: true,
      replace: true,
      onFinish: () => setIsLoading(false),
    };

    router.get(routeUrl, params, options);
  };

  // Manual search function for the search button
  const handleManualSearch = () => {
    performSearch(search, status, securityLevel, sortField, sortDirection);
  };

  // Apply filters when they change (debounced search only)
  useEffect(() => {
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Only trigger search if search term has changed and is different from current filter
    if (debouncedSearch !== filters.search) {
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(debouncedSearch, status, securityLevel, sortField, sortDirection);
      }, 100);
    }
  }, [debouncedSearch]);

  // Apply filters when status, security level, or sort changes
  useEffect(() => {
    // Only update if any filters have changed from their current values in the URL
    if (status !== filters.status ||
        securityLevel !== filters.security_level ||
        sortField !== filters.sort_field ||
        sortDirection !== filters.sort_direction) {

      performSearch(search, status, securityLevel, sortField, sortDirection);
    }
  }, [status, securityLevel, sortField, sortDirection]);

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
    if (isLoading) return; // Prevent clearing while loading
    
    setSearch('');
    setStatus('all');
    setSecurityLevel('all');
    setSortField('created_at');
    setSortDirection('desc');
    
    // Perform search with cleared filters
    performSearch('', 'all', 'all', 'created_at', 'desc');
  };

  // Handle Enter key press in search input
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleManualSearch();
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('incident_reports.page_title')} />

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
                <Shield className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl tracking-tight">{t('incident_reports.page_title')}</h2>
                <p className="text-white/90 flex items-center gap-3 text-xl font-medium">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <FileText className="h-6 w-6" />
                  </div>
                  {t('incident_reports.page_description')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button asChild size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 group/btn">
                <Link href={route('incident-reports.create')} className="flex items-center gap-3">
                  <div className="p-1 bg-white/20 rounded-lg group-hover/btn:scale-110 transition-transform duration-300">
                    <Plus className="h-5 w-5" />
                  </div>
                  {t('incident_reports.new_report')}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <Card className="shadow-2xl bg-gradient-to-bl from-white to-green-50/30 border-0 rounded-3xl overflow-hidden">
          <CardHeader className="py-4 bg-gradient-to-l from-green-500 to-green-600 text-white cursor-pointer" onClick={() => setIsFiltersOpen(!isFiltersOpen)}>
            <CardTitle className="text-lg font-semibold flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm shadow-lg">
                  <Search className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-bold">{t('incident_reports.search_filters')}</div>
                  <div className="text-green-100 text-xs font-medium">Find and filter incident reports</div>
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
                        placeholder={t('incident_reports.search_placeholder')}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyPress={handleSearchKeyPress}
                        disabled={isLoading}
                        className="w-full h-11 pl-20 pr-4 text-base border-green-200 focus:border-green-500 focus:ring-green-500/20 bg-gradient-to-l from-green-50 to-white rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <Button 
                        className="absolute left-1 top-1/2 -translate-y-1/2 h-9 px-4 bg-gradient-to-l from-green-500 to-green-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm disabled:opacity-50 disabled:cursor-not-allowed" 
                        onClick={handleManualSearch}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            {t('common.searching')}
                          </div>
                        ) : (
                          t('common.search')
                        )}
                      </Button>
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-400" />
                    </div>
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <Select value={status} onValueChange={setStatus} disabled={isLoading}>
                    <SelectTrigger className="h-11 shadow-lg border-green-200 focus:border-green-500 focus:ring-green-500/20 bg-gradient-to-l from-green-50 to-white rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                      <SelectValue placeholder="Status" />
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

                {/* Security Level Filter */}
                <div>
                  <Select value={securityLevel} onValueChange={setSecurityLevel} disabled={isLoading}>
                    <SelectTrigger className="h-11 shadow-lg border-green-200 focus:border-green-500 focus:ring-green-500/20 bg-gradient-to-l from-green-50 to-white rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                      <SelectValue placeholder="Security Level" />
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

                {/* Sort Options */}
                <div>
                  <Select
                    value={`${sortField}:${sortDirection}`}
                    onValueChange={(value) => {
                      const [field, direction] = value.split(':');
                      setSortField(field);
                      setSortDirection(direction as SortDirection);
                    }}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="h-11 shadow-lg border-green-200 focus:border-green-500 focus:ring-green-500/20 bg-gradient-to-l from-green-50 to-white rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                      <SelectValue placeholder="Sort By" />
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

                {/* Direction & Quick Actions Row */}
                <div className="md:col-span-2 lg:col-span-4 grid grid-cols-3 gap-3">
                  {/* Direction Button */}
                  <div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (isLoading) return; // Prevent clicking while loading
                        const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
                        setSortDirection(newDirection);
                      }}
                      title={sortDirection === 'asc' ? 'Descending' : 'Ascending'}
                      className="h-11 w-full shadow-lg border-green-300 text-green-700 hover:bg-green-100 hover:border-green-400 rounded-xl transition-all duration-300 hover:scale-105 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
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
                      className="h-11 px-3 shadow-lg border-green-300 text-green-700 hover:bg-green-100 hover:border-green-400 rounded-xl transition-all duration-300 hover:scale-105 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
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
          <Card className="shadow-2xl overflow-hidden bg-gradient-to-bl from-white to-green-50/30 border-0 rounded-3xl">
            <CardHeader className="bg-gradient-to-l from-green-500 to-green-600 text-white py-6">
              <CardTitle className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{t('incident_reports.table.title')}</div>
                  <div className="text-green-100 text-sm font-medium">Incident reports overview</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-hidden rounded-b-3xl">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="bg-gradient-to-l from-green-100 to-green-200 border-0">
                      <th
                        className="h-12 px-6 text-left align-middle font-bold text-green-800 text-lg cursor-pointer"
                        onClick={() => handleSort('report_number')}
                      >
                        {t('incident_reports.table.report_number')} {getSortIcon('report_number')}
                      </th>
                      <th
                        className="h-12 px-6 text-left align-middle font-bold text-green-800 text-lg cursor-pointer"
                        onClick={() => handleSort('report_date')}
                      >
                        {t('incident_reports.table.date')} {getSortIcon('report_date')}
                      </th>
                      <th
                        className="h-12 px-6 text-left align-middle font-bold text-green-800 text-lg cursor-pointer"
                        onClick={() => handleSort('incidents_count')}
                      >
                        {t('incident_reports.table.incidents')} {getSortIcon('incidents_count')}
                      </th>
                      <th
                        className="h-12 px-6 text-left align-middle font-bold text-green-800 text-lg cursor-pointer"
                        onClick={() => handleSort('security_level')}
                      >
                        {t('incident_reports.table.security_level')} {getSortIcon('security_level')}
                      </th>
                      <th className="h-12 px-6 text-left align-middle font-bold text-green-800 text-lg">
                        {t('incident_reports.table.submitted_by')}
                      </th>
                      <th
                        className="h-12 px-6 text-left align-middle font-bold text-green-800 text-lg cursor-pointer"
                        onClick={() => handleSort('report_status')}
                      >
                        {t('incident_reports.table.status')} {getSortIcon('report_status')}
                      </th>
                      <th className="h-12 px-6 text-left align-middle font-bold text-green-800 text-lg">
                        {t('common.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {isLoading ? (
                      <tr>
                        <td colSpan={7} className="h-32 text-center align-middle">
                          <div className="flex flex-col items-center gap-4 text-green-600">
                            <div className="p-4 bg-green-100 rounded-full">
                              <TrendingUp className="h-16 w-16 text-green-400 animate-spin" />
                            </div>
                            <p className="text-xl font-bold">{t('incident_reports.loading_reports')}</p>
                            <p className="text-green-500">{t('incident_reports.loading_description')}</p>
                          </div>
                        </td>
                      </tr>
                    ) : reports.data.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="h-32 text-center align-middle">
                          <div className="flex flex-col items-center gap-4 text-green-600">
                            <div className="p-4 bg-green-100 rounded-full">
                              <AlertTriangle className="h-16 w-16 text-green-400" />
                            </div>
                            <p className="text-xl font-bold">{t('incident_reports.no_reports')}</p>
                            <p className="text-green-500">No incident reports found</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      reports.data.map((report) => (
                        <tr
                          key={report.id}
                          className="border-b border-green-100 transition-colors hover:bg-green-50/50 data-[state=selected]:bg-muted"
                        >
                          <td className="p-6 align-middle">
                            <Link
                              href={route('incident-reports.show', report.id)}
                              className="font-bold text-green-900 text-lg hover:underline"
                            >
                              {report.report_number}
                            </Link>
                          </td>
                          <td className="p-6 align-middle text-green-800 font-medium">
                            {format(new Date(report.report_date), 'PPP')}
                          </td>
                          <td className="p-6 align-middle">
                            <Badge variant="outline" className="bg-gradient-to-l from-green-100 to-green-200 text-green-800 border-green-300 px-4 py-2 rounded-xl font-semibold">
                              {t('incident_reports.incidents_count', { count: String(report.incidents_count) })}
                            </Badge>
                          </td>
                          <td className="p-6 align-middle">
                            <Badge variant="outline" className="bg-gradient-to-l from-green-100 to-green-200 text-green-800 border-green-300 px-4 py-2 rounded-xl font-semibold">
                              <Shield className="mr-1 h-3 w-3" />
                              {report.security_level}
                            </Badge>
                          </td>
                          <td className="p-6 align-middle text-green-800 font-medium">
                            {report.submitter?.name || t('incidents.unknown')}
                          </td>
                          <td className="p-6 align-middle">
                            <Badge variant="outline" className="bg-gradient-to-l from-green-100 to-green-200 text-green-800 border-green-300 px-4 py-2 rounded-xl font-semibold">
                              {report.report_status}
                            </Badge>
                          </td>
                          <td className="p-6 align-middle">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                title={t('incident_reports.view')}
                                className="h-10 w-10 rounded-xl hover:bg-green-100 text-green-600 hover:text-green-700 transition-all duration-300 hover:scale-110"
                              >
                                <Link href={route('incident-reports.show', report.id)}>
                                  <FileText className="h-5 w-5" />
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                title={t('incidents.page_title')}
                                className="h-10 w-10 rounded-xl hover:bg-green-100 text-green-600 hover:text-green-700 transition-all duration-300 hover:scale-110"
                              >
                                <Link href={route('incident-reports.incidents', report.id)}>
                                  <AlertCircle className="h-5 w-5" />
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                title={t('incident_reports.print.title')}
                                className="h-10 w-10 rounded-xl hover:bg-green-100 text-green-600 hover:text-green-700 transition-all duration-300 hover:scale-110"
                              >
                                <Link href={route('incident-reports.print', report.id)}>
                                  <Printer className="h-5 w-5" />
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
        {reports.links && reports.links.length > 0 && (
          <div className="mt-8 flex justify-center">
            <div className="bg-gradient-to-l from-green-50 to-white p-4 rounded-3xl shadow-2xl border border-green-200">
              <Pagination links={reports.links} />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
