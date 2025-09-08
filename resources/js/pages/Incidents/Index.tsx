import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent} from '@/components/ui/card';
import { Pagination } from '@/components/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Plus, FileText, AlertCircle, ArrowUpDown, Shield, TrendingUp, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@/lib/i18n/translate';
import Header from '@/components/template/header';
import SearchFilters from '@/components/template/SearchFilters';

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
      is_confirmed: boolean;
      confirmed_at: string | null;
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
      reporter: {
        id: number;
        name: string;
      } | null;
      confirmer: {
        id: number;
        name: string;
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
  canConfirm: boolean;
}

export default function Index({ incidents, filters = {}, categories, canConfirm }: IncidentProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState(filters.search || '');
  const [status, setStatus] = useState(filters.status || '');
  const [categoryId, setCategoryId] = useState(filters.category_id || '');
  const [sortField, setSortField] = useState(filters.sort_field || 'incident_date');
  const [sortDirection, setSortDirection] = useState<SortDirection>(filters.sort_direction || 'desc');
  const isInitialMount = useRef(true);
  const prevFilters = useRef({
    status: filters.status,
    categoryId: filters.category_id,
    sortField: filters.sort_field,
    sortDirection: filters.sort_direction
  });

  // Filter options for SearchFilters component
  const statusOptions = [
    { value: 'all', label: t('incidents.filters.all_statuses') },
    { value: 'reported', label: t('incidents.status.reported') },
    { value: 'investigating', label: t('incidents.status.investigating') },
    { value: 'resolved', label: t('incidents.status.resolved') },
    { value: 'closed', label: t('incidents.status.closed') },
  ];

  const categoryOptions = [
    { value: 'all', label: t('incidents.filters.all_categories') },
    ...categories.map(category => ({
      value: category.id.toString(),
      label: category.name
    }))
  ];

  const sortOptions = [
    { value: 'incident_date:desc', label: t('incidents.sort.date_newest') },
    { value: 'incident_date:asc', label: t('incidents.sort.date_oldest') },
    { value: 'title:asc', label: t('incidents.sort.title_asc') },
    { value: 'title:desc', label: t('incidents.sort.title_desc') },
  ];

  const perPageOptions = [
    { value: 10, label: '10 per page' },
    { value: 25, label: '25 per page' },
    { value: 50, label: '50 per page' },
    { value: 100, label: '100 per page' },
  ];

  // Apply search function (only for search)
  const applySearch = () => {
    try {
      const params = {
        search: search,
        status: status === 'all' ? '' : status,
        category_id: categoryId === 'all' ? '' : categoryId,
        sort_field: sortField,
        sort_direction: sortDirection,
      };

      const routeUrl = route('incidents.index');
      const options = {
        preserveState: true,
        replace: true,
      };

      setTimeout(() => {
        router.get(routeUrl, params, options);
      }, 0);
    } catch (error) {
      console.error('Error applying search:', error);
    }
  };

  // Apply other filters (status, category, sort) without search
  const applyOtherFilters = () => {
    try {
      const params = {
        search: filters.search || '', // Keep current search from URL
        status: status === 'all' ? '' : status,
        category_id: categoryId === 'all' ? '' : categoryId,
        sort_field: sortField,
        sort_direction: sortDirection,
      };

      const routeUrl = route('incidents.index');
      const options = {
        preserveState: true,
        replace: true,
      };

      setTimeout(() => {
        router.get(routeUrl, params, options);
      }, 0);
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  };

  // Apply filters when sort or other non-search filters change
  useEffect(() => {
    // Skip on initial mount to prevent unnecessary requests
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Check if there's an actual change compared to previous values
    const hasStatusChange = status !== prevFilters.current.status;
    const hasCategoryChange = categoryId !== prevFilters.current.categoryId;
    const hasSortFieldChange = sortField !== prevFilters.current.sortField;
    const hasSortDirectionChange = sortDirection !== prevFilters.current.sortDirection;

    if (hasStatusChange || hasCategoryChange || hasSortFieldChange || hasSortDirectionChange) {
      // Update the previous values
      prevFilters.current = {
        status,
        categoryId,
        sortField,
        sortDirection
      };
      
      applyOtherFilters();
    }
  }, [status, categoryId, sortField, sortDirection]);

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
    
    // Apply the cleared filters immediately
    try {
      const params = {
        search: '',
        status: '',
        category_id: '',
        sort_field: 'incident_date',
        sort_direction: 'desc',
      };

      const routeUrl = route('incidents.index');
      const options = {
        preserveState: true,
        replace: true,
      };

      setTimeout(() => {
        router.get(routeUrl, params, options);
      }, 0);
    } catch (error) {
      console.error('Error clearing filters:', error);
    }
  };

  // Handler functions for SearchFilters component
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applySearch();
  };

  const handleStatusChange = (value: string) => {
    setStatus(value === 'all' ? '' : value);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryId(value === 'all' ? '' : value);
  };

  const handleSortChange = (value: string) => {
    const [field, direction] = value.split(':');
    setSortField(field);
    setSortDirection(direction as SortDirection);
  };

  const handleDirectionChange = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const handlePerPageChange = (value: string) => {
    // For now, we'll keep the default pagination
    // This can be implemented later if needed
    console.log('Per page changed to:', value);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('incidents.page_title')} />

      <div className="container px-0 py-6">
        {/* Header Component */}
        <Header
          title={t('incidents.page_title')}
          description={t('incidents.page_description')}
          icon={<Shield className="h-6 w-6" />}
          model="incident"
          routeName="incidents.create"
          buttonText={t('incidents.new_incident')}
          theme="blue"
          buttonSize="lg"
        />

        <SearchFilters
          searchQuery={search}
          onSearchChange={setSearch}
          onSearchSubmit={handleSearchSubmit}
          searchPlaceholder={t('incidents.search_placeholder')}
          filters={{
            type: status,
            category: categoryId,
            sort: `${sortField}:${sortDirection}`,
            direction: sortDirection,
            per_page: 10
          }}
          onTypeChange={handleStatusChange}
          onCategoryChange={handleCategoryChange}
          onDepartmentChange={() => {}} // Not used for incidents
          onSortChange={handleSortChange}
          onDirectionChange={handleDirectionChange}
          onPerPageChange={handlePerPageChange}
          onResetFilters={clearFilters}
          types={statusOptions}
          categories={categoryOptions}
          departments={[]} // No departments for incidents
          sortOptions={sortOptions}
          perPageOptions={perPageOptions}
          title={t('incidents.search_filters')}
          description={t('incidents.find_and_filter')}
          className="shadow-2xl bg-gradient-to-bl from-white dark:from-gray-800 to-blue-50/30 dark:to-blue-900/20 border-0  overflow-hidden"
        />

        {/* Results Table */}
        <div className="mt-8 dark:bg-gray-800">
          <Header
            title={t('incidents.table.title')}
            description={t('incidents.table.description')}
            icon={<TrendingUp className="h-6 w-6" />}
            model="incident"
            routeName=""
            buttonText=""
            theme="blue"
            showButton={false}
          />
          <Card className="shadow-lg">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => handleSort('title')}
                    >
                      {t('incidents.table.title')} {getSortIcon('title')}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => handleSort('incident_date')}
                    >
                      {t('incidents.table.date')} {getSortIcon('incident_date')}
                    </TableHead>
                    <TableHead>
                      {t('incidents.table.location')}
                    </TableHead>
                    <TableHead>
                      {t('incidents.table.category')}
                    </TableHead>
                    <TableHead>
                      {t('incidents.table.report')}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => handleSort('status')}
                    >
                      {t('incidents.table.status')} {getSortIcon('status')}
                    </TableHead>
                    <TableHead>
                      {t('incidents.table.confirmation')}
                    </TableHead>
                    <TableHead>
                      {t('common.actions')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incidents.data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-32 text-center">
                        <div className="flex flex-col items-center gap-4 text-muted-foreground">
                          <AlertTriangle className="h-16 w-16" />
                          <p className="text-xl font-bold">{t('incidents.no_incidents')}</p>
                          <p>No incident records found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    incidents.data.map((incident) => (
                      <TableRow key={incident.id}>
                        <TableCell>
                          <Link
                            href={route('incidents.show', incident.id)}
                            className="font-medium hover:underline"
                          >
                            {incident.title}
                          </Link>
                        </TableCell>
                        <TableCell>
                          {format(new Date(incident.incident_date), 'PPP')}
                        </TableCell>
                        <TableCell>
                          {incident.district?.name}, {incident.district_province?.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {incident.category?.name || t('incidents.unspecified')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {incident.report ? (
                            <Link
                              href={route('incident-reports.show', incident.report.id)}
                              className="flex items-center text-sm hover:underline"
                            >
                              <FileText className="mr-1 h-4 w-4" />
                              {incident.report.report_number}
                            </Link>
                          ) : (
                            <span className="text-muted-foreground">{t('incidents.none')}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {t(`incidents.status.${incident.status}`)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={incident.is_confirmed ? "default" : "outline"}
                          >
                            {incident.is_confirmed ? (
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                {t('incidents.confirmed')}
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                {t('incidents.unconfirmed')}
                              </div>
                            )}
                          </Badge>
                          {incident.is_confirmed && incident.confirmer && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {t('incidents.confirmed_by')}: {incident.confirmer.name}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            title={t('incidents.details')}
                          >
                            <Link href={route('incidents.show', incident.id)}>
                              <AlertCircle className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
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
