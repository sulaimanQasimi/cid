import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/pagination';
import { PageHeader } from '@/components/page-header';
import { Plus, FileText, AlertCircle, Shield, Search, ArrowUpDown, X, Users, Building2, Calendar, TrendingUp, AlertTriangle, ChevronDown, FilterX, ChevronRight, ChevronLeft, Printer, Pencil, Trash, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { useTranslation } from '@/lib/i18n/translate';
import Header from '@/components/template/header';
import SearchFilters from '@/components/template/SearchFilters';

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
      can_view: boolean;
      can_update: boolean;
      can_delete: boolean;
      can_print: boolean;
      can_confirm: boolean;
      is_confirmed: boolean;
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
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 500);

  // Filter options for SearchFilters component
  const statusOptions = [
    { value: 'all', label: t('incident_reports.filters.all_statuses') },
    { value: 'pending', label: t('incident_reports.status.pending') },
    { value: 'reviewed', label: t('incident_reports.status.reviewed') },
    { value: 'approved', label: t('incident_reports.status.approved') },
    { value: 'rejected', label: t('incident_reports.status.rejected') }
  ];

  const securityLevelOptions = [
    { value: 'all', label: t('incident_reports.filters.all_security_levels') },
    { value: 'low', label: t('incident_reports.level.low') },
    { value: 'medium', label: t('incident_reports.level.medium') },
    { value: 'high', label: t('incident_reports.level.high') },
    { value: 'critical', label: t('incident_reports.level.critical') }
  ];

  const sortOptions = [
    { value: 'report_date:desc', label: t('incident_reports.sort.date_newest') },
    { value: 'report_date:asc', label: t('incident_reports.sort.date_oldest') },
    { value: 'report_number:asc', label: t('incident_reports.sort.number_asc') },
    { value: 'report_number:desc', label: t('incident_reports.sort.number_desc') },
    { value: 'incidents_count:desc', label: t('incident_reports.sort.incidents_most') },
    { value: 'incidents_count:asc', label: t('incident_reports.sort.incidents_least') }
  ];

  const perPageOptions = [
    { value: 10, label: '10' },
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 100, label: '100' }
  ];

  // Function to perform search with loading state
  const performSearch = (searchTerm: string, currentFilters: any, page: number = 1) => {
    if (isLoading) return; // Prevent simultaneous requests
    
    setIsLoading(true);
    
    const [sortField, sortDirection] = (currentFilters.sort || 'report_date:desc').split(':');
    
    const params: any = {
      search: searchTerm,
      status: currentFilters.category === 'all' ? '' : currentFilters.category,
      security_level: currentFilters.type === 'all' ? '' : currentFilters.type,
      sort_field: sortField,
      sort_direction: sortDirection,
      per_page: currentFilters.per_page || 10,
    };

    // Only include page if explicitly provided (for filter changes, reset to page 1)
    if (page > 1) {
      params.page = page;
    }

    const routeUrl = route('incident-reports.index');
    const options = {
      preserveState: true,
      replace: true,
      onFinish: () => setIsLoading(false),
    };

    router.get(routeUrl, params, options);
  };

  // Current filter state
  const currentFilters = {
    type: filters.security_level || 'all',
    category: filters.status || 'all',
    sort: `${filters.sort_field || 'report_date'}:${filters.sort_direction || 'desc'}`,
    direction: (filters.sort_direction || 'desc') as 'asc' | 'desc',
    per_page: 10
  };

  // Filter handlers for SearchFilters component
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery, currentFilters);
  };

  const handleTypeChange = (value: string) => {
    const newFilters = { ...currentFilters, type: value };
    performSearch(searchQuery, newFilters);
  };

  const handleCategoryChange = (value: string) => {
    const newFilters = { ...currentFilters, category: value };
    performSearch(searchQuery, newFilters);
  };

  const handleSortChange = (value: string) => {
    const newFilters = { ...currentFilters, sort: value };
    performSearch(searchQuery, newFilters);
  };

  const handleDirectionChange = () => {
    const newDirection = currentFilters.direction === 'asc' ? 'desc' : 'asc';
    const newFilters = { ...currentFilters, direction: newDirection, sort: `${currentFilters.sort.split(':')[0]}:${newDirection}` };
    performSearch(searchQuery, newFilters);
  };

  const handlePerPageChange = (value: string) => {
    const newFilters = { ...currentFilters, per_page: parseInt(value) };
    performSearch(searchQuery, newFilters);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    const resetFilters = {
      type: 'all',
      category: 'all',
      sort: 'report_date:desc',
      direction: 'desc' as 'asc' | 'desc',
      per_page: 10
    };
    performSearch('', resetFilters);
  };

  // Apply filters when search query changes (debounced search only)
  useEffect(() => {
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Only trigger search if search term has changed and is different from current filter
    // Don't trigger if we're just changing pages (pagination handles that via URL)
    if (debouncedSearch !== (filters.search || '')) {
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(debouncedSearch, currentFilters, 1); // Reset to page 1 when search changes
      }, 100);
    }
  }, [debouncedSearch]);

  // Handle sorting for table headers
  const handleSort = (field: string) => {
    const newDirection = currentFilters.direction === 'asc' ? 'desc' : 'asc';
    const newFilters = { ...currentFilters, direction: newDirection, sort: `${field}:${newDirection}` };
    performSearch(searchQuery, newFilters);
  };

  // Get sort icon
  const getSortIcon = (field: string) => {
    const currentField = currentFilters.sort.split(':')[0];
    if (currentField !== field) return null;

    return currentFilters.direction === 'asc'
      ? <ArrowUpDown className="ml-1 h-4 w-4 inline" />
      : <ArrowUpDown className="ml-1 h-4 w-4 inline rotate-180" />;
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('incident_reports.page_title')} />

      <div className="container px-0 py-6">
        <Header
          title={t('incident_reports.page_title')}
          description={t('incident_reports.page_description')}
          icon={<Shield className="h-6 w-6 text-white" />}
          model="incident_report"
          routeName={() => route('incident-reports.create')}
          buttonText={t('incident_reports.new_report')}
          theme="purple"
          buttonSize="lg"
          showBackButton={false}
          showButton={true}
        />

        <SearchFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={handleSearchSubmit}
          searchPlaceholder={t('incident_reports.search_placeholder')}
          filters={currentFilters}
          onTypeChange={handleTypeChange}
          onCategoryChange={handleCategoryChange}
          onDepartmentChange={() => {}} // Not used for incident reports
          onSortChange={handleSortChange}
          onDirectionChange={handleDirectionChange}
          onPerPageChange={handlePerPageChange}
          onResetFilters={handleResetFilters}
          types={securityLevelOptions}
          categories={statusOptions}
          departments={[]} // Not used for incident reports
          sortOptions={sortOptions}
          perPageOptions={perPageOptions}
          title={t('incident_reports.search_filters')}
          description={t('incident_reports.search_filters_description')}
          className="shadow-2xl bg-gradient-to-bl from-white dark:from-gray-800 to-purple-50/30 dark:to-purple-900/20 border-0 overflow-hidden"
        />

        {/* Results Table */}
        <div className="mt-8">
          <Card className="shadow-2xl overflow-hidden bg-gradient-to-bl from-white dark:from-gray-800 to-purple-50/30 dark:to-purple-900/20 border-0 rounded-3xl mt-6">
            <CardContent className="p-0">
              <div className="overflow-hidden rounded-b-3xl">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="bg-gradient-to-l from-purple-100 dark:from-purple-900 to-purple-200 dark:to-purple-800 border-0">
                      <th
                        className="h-12 px-6 text-left align-middle font-bold text-purple-800 dark:text-purple-200 text-lg cursor-pointer py-6"
                        onClick={() => handleSort('report_number')}
                      >
                        {t('incident_reports.table.report_number')} {getSortIcon('report_number')}
                      </th>
                      <th
                        className="h-12 px-6 text-left align-middle font-bold text-purple-800 dark:text-purple-200 text-lg cursor-pointer py-6"
                        onClick={() => handleSort('report_date')}
                      >
                        {t('incident_reports.table.date')} {getSortIcon('report_date')}
                      </th>
                      <th
                        className="h-12 px-6 text-left align-middle font-bold text-purple-800 dark:text-purple-200 text-lg cursor-pointer py-6"
                        onClick={() => handleSort('incidents_count')}
                      >
                        {t('incident_reports.table.incidents')} {getSortIcon('incidents_count')}
                      </th>
                      <th
                        className="h-12 px-6 text-left align-middle font-bold text-purple-800 dark:text-purple-200 text-lg cursor-pointer py-6"
                        onClick={() => handleSort('security_level')}
                      >
                        {t('incident_reports.table.security_level')} {getSortIcon('security_level')}
                      </th>
                      <th className="h-12 px-6 text-left align-middle font-bold text-purple-800 dark:text-purple-200 text-lg py-6">
                        {t('incident_reports.table.submitted_by')}
                      </th>
                      <th
                        className="h-12 px-6 text-left align-middle font-bold text-purple-800 dark:text-purple-200 text-lg cursor-pointer py-6"
                        onClick={() => handleSort('report_status')}
                      >
                        {t('incident_reports.table.status')} {getSortIcon('report_status')}
                      </th>
                      <th className="h-12 px-6 text-left align-middle font-bold text-purple-800 dark:text-purple-200 text-lg py-6">
                        {t('common.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {isLoading ? (
                      <tr>
                        <td colSpan={7} className="h-32 text-center align-middle">
                          <div className="flex flex-col items-center gap-4 text-purple-600 dark:text-purple-400">
                            <p className="text-xl font-bold">{t('incident_reports.loading_reports')}</p>
                            <p className="text-purple-500 dark:text-purple-400">{t('incident_reports.loading_description')}</p>
                          </div>
                        </td>
                      </tr>
                    ) : reports.data.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="h-32 text-center align-middle">
                          <div className="flex flex-col items-center gap-4 text-purple-600 dark:text-purple-400">
                            <div className="p-4 bg-purple-100 dark:bg-purple-800 rounded-full">
                              <AlertTriangle className="h-16 w-16 text-purple-400 dark:text-purple-300" />
                            </div>
                            <p className="text-xl font-bold">{t('incident_reports.no_reports')}</p>
                            <p className="text-purple-500 dark:text-purple-400">{t('incident_reports.no_reports_found')}</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      reports.data.map((report) => (
                        <tr
                          key={report.id}
                          className="border-b border-purple-100 dark:border-purple-800 transition-colors hover:bg-purple-50/50 dark:hover:bg-purple-900/20 data-[state=selected]:bg-muted"
                        >
                          <td className="p-6 align-middle">
                            <Link
                              href={route('incident-reports.show', report.id)}
                              className="font-bold text-purple-900 dark:text-purple-100 text-lg hover:underline"
                            >
                              {report.report_number}
                            </Link>
                          </td>
                          <td className="p-6 align-middle text-purple-800 dark:text-purple-200 font-medium">
                            {format(new Date(report.report_date), 'PPP')}
                          </td>
                          <td className="p-6 align-middle">
                            <Badge variant="outline" className="bg-gradient-to-l from-purple-100 dark:from-purple-800 to-purple-200 dark:to-purple-700 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-600 px-4 py-2 rounded-xl font-semibold">
                              {t('incident_reports.incidents_count', { count: String(report.incidents_count) })}
                            </Badge>
                          </td>
                          <td className="p-6 align-middle">
                            <Badge variant="outline" className="bg-gradient-to-l from-purple-100 dark:from-purple-800 to-purple-200 dark:to-purple-700 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-600 px-4 py-2 rounded-xl font-semibold">
                              <Shield className="mr-1 h-3 w-3" />
                              {report.security_level}
                            </Badge>
                          </td>
                          <td className="p-6 align-middle text-purple-800 dark:text-purple-200 font-medium">
                            {report.submitter?.name || t('incidents.unknown')}
                          </td>
                          <td className="p-6 align-middle">
                            <Badge variant="outline" className="bg-gradient-to-l from-purple-100 dark:from-purple-800 to-purple-200 dark:to-purple-700 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-600 px-4 py-2 rounded-xl font-semibold">
                              {report.report_status}
                            </Badge>
                          </td>
                          <td className="p-6 align-middle">
                            <div className="flex items-center gap-2">
                              {report.can_view && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    asChild
                                    title={t('incident_reports.view')}
                                    className="h-10 w-10 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-800 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-300 hover:scale-110"
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
                                    className="h-10 w-10 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-800 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-300 hover:scale-110"
                                  >
                                    <Link href={route('incident-reports.incidents', report.id)}>
                                      <AlertCircle className="h-5 w-5" />
                                    </Link>
                                  </Button>
                                </>
                              )}
                              {report.can_print && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  asChild
                                  title={t('incident_reports.print.title')}
                                  className="h-10 w-10 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-800 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-300 hover:scale-110"
                                >
                                  <Link href={route('incident-reports.print', report.id)}>
                                    <Printer className="h-5 w-5" />
                                  </Link>
                                </Button>
                              )}
                              {report.can_update && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  asChild
                                  title={t('common.edit')}
                                  className="h-10 w-10 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-800 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-300 hover:scale-110"
                                >
                                  <Link href={route('incident-reports.edit', report.id)}>
                                    <Pencil className="h-5 w-5" />
                                  </Link>
                                </Button>
                              )}
                              {report.can_confirm && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    if (report.is_confirmed) {
                                      if (confirm(t('incident_reports.confirm_unconfirm', { number: report.report_number }))) {
                                        router.post(route('incident-reports.unconfirm', report.id));
                                      }
                                    } else {
                                      router.post(route('incident-reports.confirm', report.id));
                                    }
                                  }}
                                  title={report.is_confirmed ? t('incident_reports.unconfirm') : t('incident_reports.confirm')}
                                  className={`h-10 w-10 rounded-xl transition-all duration-300 hover:scale-110 ${
                                    report.is_confirmed
                                      ? 'hover:bg-orange-100 dark:hover:bg-orange-800 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300'
                                      : 'hover:bg-green-100 dark:hover:bg-green-800 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300'
                                  }`}
                                >
                                  {report.is_confirmed ? (
                                    <XCircle className="h-5 w-5" />
                                  ) : (
                                    <CheckCircle className="h-5 w-5" />
                                  )}
                                </Button>
                              )}
                              {report.can_delete && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    if (confirm(t('incident_reports.confirm_delete', { number: report.report_number }))) {
                                      router.delete(route('incident-reports.destroy', report.id));
                                    }
                                  }}
                                  title={t('common.delete')}
                                  className="h-10 w-10 rounded-xl hover:bg-red-100 dark:hover:bg-red-800 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-all duration-300 hover:scale-110"
                                >
                                  <Trash className="h-5 w-5" />
                                </Button>
                              )}
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
            <div className="bg-gradient-to-l from-purple-50 dark:from-purple-900/20 to-white dark:to-gray-800 p-4 rounded-3xl shadow-2xl border border-purple-200 dark:border-purple-700">
              <Pagination links={reports.links} />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
