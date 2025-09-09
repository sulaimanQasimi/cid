import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/pagination';
import Header from '@/components/template/header';
import SearchFilters from '@/components/template/SearchFilters';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Pencil, Trash2, Shield, AlertTriangle, TrendingUp } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useState, useEffect, useRef } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useTranslation } from '@/lib/i18n/translate';

// Define breadcrumb navigation
const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Incident Categories',
    href: route('incident-categories.index'),
  },
];

type SortDirection = 'asc' | 'desc';

interface CategoriesProps {
  categories: {
    data: Array<{
      id: number;
      name: string;
      code: string | null;
      description: string | null;
      color: string | null;
      severity_level: number;
      status: string;
      incidents_count: number;
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
    sort_field?: string;
    sort_direction?: SortDirection;
  };
}

export default function Index({ categories, filters = {} }: CategoriesProps) {
  const { t } = useTranslation();
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [search, setSearch] = useState(filters.search || '');
  const [status, setStatus] = useState(filters.status || '');
  const [sortField, setSortField] = useState(filters.sort_field || 'name');
  const [sortDirection, setSortDirection] = useState<SortDirection>(filters.sort_direction || 'asc');
  const isInitialMount = useRef(true);
  const prevFilters = useRef({
    status: filters.status,
    sortField: filters.sort_field,
    sortDirection: filters.sort_direction
  });

  // Filter options for SearchFilters component
  const statusOptions = [
    { value: 'all', label: t('incident_categories.filters.all_statuses') },
    { value: 'active', label: t('incident_categories.form.status.active') },
    { value: 'inactive', label: t('incident_categories.form.status.inactive') },
  ];

  const sortOptions = [
    { value: 'name:asc', label: t('incident_categories.sort.name_asc') },
    { value: 'name:desc', label: t('incident_categories.sort.name_desc') },
    { value: 'severity_level:asc', label: t('incident_categories.sort.severity_low') },
    { value: 'severity_level:desc', label: t('incident_categories.sort.severity_high') },
    { value: 'incidents_count:asc', label: t('incident_categories.sort.incidents_low') },
    { value: 'incidents_count:desc', label: t('incident_categories.sort.incidents_high') },
    { value: 'created_at:desc', label: t('incident_categories.sort.created_at') },
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
        sort_field: sortField,
        sort_direction: sortDirection,
      };

      const routeUrl = route('incident-categories.index');
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

  // Apply other filters (status, sort) without search
  const applyOtherFilters = () => {
    try {
      const params = {
        search: filters.search || '', // Keep current search from URL
        status: status === 'all' ? '' : status,
        sort_field: sortField,
        sort_direction: sortDirection,
      };

      const routeUrl = route('incident-categories.index');
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
    const hasSortFieldChange = sortField !== prevFilters.current.sortField;
    const hasSortDirectionChange = sortDirection !== prevFilters.current.sortDirection;

    if (hasStatusChange || hasSortFieldChange || hasSortDirectionChange) {
      // Update the previous values
      prevFilters.current = {
        status,
        sortField,
        sortDirection
      };
      
      applyOtherFilters();
    }
  }, [status, sortField, sortDirection]);

  // Handler functions for SearchFilters component
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applySearch();
  };

  const handleStatusChange = (value: string) => {
    setStatus(value === 'all' ? '' : value);
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

  // Clear all filters
  const clearFilters = () => {
    setSearch('');
    setStatus('all');
    setSortField('name');
    setSortDirection('asc');
    
    // Apply the cleared filters immediately
    try {
      const params = {
        search: '',
        status: '',
        sort_field: 'name',
        sort_direction: 'asc',
      };

      const routeUrl = route('incident-categories.index');
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

  const handleDelete = () => {
    if (categoryToDelete) {
      try {
        const routeUrl = route('incident-categories.destroy', categoryToDelete);

        // Using setTimeout to avoid version errors
        setTimeout(() => {
          router.delete(routeUrl);
        }, 0);
      } catch (error) {
        console.error('Error deleting category:', error);
        setCategoryToDelete(null);
      }
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('incident_categories.page_title')} />

      <div className="container px-0 py-6">
        {/* Custom Header Component */}
        <Header
          title={t('incident_categories.page_title')}
          description={t('incident_categories.page_description')}
          icon={<Shield className="h-6 w-6" />}
          model="incident-categories"
          routeName={() => route('incident-categories.create')}
          buttonText={t('incident_categories.new_category')}
          theme="blue"
          buttonSize="lg"
        />

        <SearchFilters
          searchQuery={search}
          onSearchChange={setSearch}
          onSearchSubmit={handleSearchSubmit}
          searchPlaceholder={t('incident_categories.search_placeholder')}
          filters={{
            type: status,
            sort: `${sortField}:${sortDirection}`,
            direction: sortDirection,
            per_page: 10
          }}
          onTypeChange={handleStatusChange}
          onCategoryChange={() => {}} // Not used for categories
          onDepartmentChange={() => {}} // Not used for categories
          onSortChange={handleSortChange}
          onDirectionChange={handleDirectionChange}
          onPerPageChange={handlePerPageChange}
          onResetFilters={clearFilters}
          types={statusOptions}
          categories={[]} // No categories filter for categories page
          departments={[]} // No departments for categories
          sortOptions={sortOptions}
          perPageOptions={perPageOptions}
          title={t('incident_categories.search_filters')}
          description={t('incident_categories.find_and_filter')}
          className="shadow-2xl bg-gradient-to-bl from-white dark:from-gray-800 to-blue-50/30 dark:to-blue-900/20 border-0 overflow-hidden"
        />

        {/* Results Table */}
        <div className="mt-8">
          <Header
            title={t('incident_categories.table.title')}
            description={t('incident_categories.table.description')}
            icon={<TrendingUp className="h-6 w-6" />}
            model="incident-categories"
            routeName={() => ''}
            buttonText=""
            theme="blue"
            showButton={false}
          />
          <Card className="shadow-lg">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-l from-blue-100 to-blue-200 border-0">
                    <TableHead className="h-12 px-6 text-left align-middle font-bold text-blue-800 text-lg">{t('incident_categories.table.name')}</TableHead>
                    <TableHead className="h-12 px-6 text-left align-middle font-bold text-blue-800 text-lg">{t('incident_categories.table.code')}</TableHead>
                    <TableHead className="h-12 px-6 text-left align-middle font-bold text-blue-800 text-lg">{t('incident_categories.table.color')}</TableHead>
                    <TableHead className="h-12 px-6 text-left align-middle font-bold text-blue-800 text-lg">{t('incident_categories.table.severity')}</TableHead>
                    <TableHead className="h-12 px-6 text-left align-middle font-bold text-blue-800 text-lg">{t('incident_categories.table.incidents')}</TableHead>
                    <TableHead className="h-12 px-6 text-left align-middle font-bold text-blue-800 text-lg">{t('incident_categories.table.status')}</TableHead>
                    <TableHead className="h-12 px-6 text-left align-middle font-bold text-blue-800 text-lg">{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center">
                        <div className="flex flex-col items-center gap-4 text-muted-foreground">
                          <AlertTriangle className="h-16 w-16" />
                          <p className="text-xl font-bold">{t('incident_categories.no_categories')}</p>
                          <p>No incident categories found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    categories.data.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>
                          <div className="font-bold text-lg">{category.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {category.description && category.description.length > 0
                              ? category.description
                              : "-"}
                          </div>
                        </TableCell>
                        <TableCell>
                          {category.code || '-'}
                        </TableCell>
                        <TableCell>
                          {category.color && (
                            <div className="flex items-center space-x-2">
                              <div
                                className="h-6 w-6 rounded-full border-2 border-gray-200"
                                style={{ backgroundColor: category.color }}
                              />
                              <span className="font-medium">{category.color}</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              category.severity_level > 4 ? 'destructive' :
                              category.severity_level > 2 ? 'default' : 'outline'
                            }
                          >
                            Level {category.severity_level}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {category.incidents_count}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={category.status === 'active' ? 'default' : 'secondary'}
                          >
                            {category.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                              title={t('incident_categories.actions.edit')}
                            >
                              <Link href={route('incident-categories.edit', category.id)}>
                                <Pencil className="h-4 w-4" />
                              </Link>
                            </Button>

                            <AlertDialog
                              open={categoryToDelete === category.id}
                              onOpenChange={(open) => {
                                if (!open) setCategoryToDelete(null);
                              }}
                            >
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setCategoryToDelete(category.id)}
                                  title={t('incident_categories.actions.delete')}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>{t('incident_categories.delete_title')}</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {t('incident_categories.delete_description')}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    {t('common.delete')}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
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
        {categories.links && categories.links.length > 0 && (
          <div className="mt-8 flex justify-center">
            <div className="bg-gradient-to-l from-blue-50 to-white p-4 rounded-3xl shadow-2xl border border-blue-200">
              <Pagination links={categories.links} />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
