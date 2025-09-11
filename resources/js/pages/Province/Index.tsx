import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import Header from '@/components/template/header';
import SearchFilters from '@/components/template/SearchFilters';
import { Plus, Pencil, Trash, Eye, BarChart3, AlertTriangle, TrendingUp, MapPin } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useTranslation } from '@/lib/i18n/translate';
import { usePermissions } from '@/hooks/use-permissions';
import { CanCreate, CanView, CanUpdate, CanDelete, CanConfirm } from '@/components/ui/permission-guard';
import { Pagination } from '@/components/pagination';
import { useState, useEffect, useRef } from 'react';

interface ProvinceData {
  id: number;
  name: string;
  code: string;
  description: string | null;
  governor: string | null;
  capital: string | null;
  status: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  creator?: {
    id: number;
    name: string;
  };
}

interface PaginationLinks {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

type SortDirection = 'asc' | 'desc';

interface Props {
  provinces?: {
    data?: ProvinceData[];
    links?: PaginationLinks[];
    meta?: PaginationMeta;
  };
  filters?: {
    search?: string;
    sort_field?: string;
    sort_direction?: SortDirection;
    per_page?: number;
  };
}

const sortOptions = [
  { value: 'name:asc', label: 'Name (A-Z)' },
  { value: 'name:desc', label: 'Name (Z-A)' },
  { value: 'code:asc', label: 'Code (A-Z)' },
  { value: 'code:desc', label: 'Code (Z-A)' },
  { value: 'capital:asc', label: 'Capital (A-Z)' },
  { value: 'capital:desc', label: 'Capital (Z-A)' },
  { value: 'status:asc', label: 'Status (A-Z)' },
  { value: 'status:desc', label: 'Status (Z-A)' },
  { value: 'created_at:desc', label: 'Created Date (Newest)' },
  { value: 'created_at:asc', label: 'Created Date (Oldest)' },
];

const perPageOptions = [
  { value: 10, label: '10 per page' },
  { value: 25, label: '25 per page' },
  { value: 50, label: '50 per page' },
  { value: 100, label: '100 per page' },
];

export default function ProvinceIndex({
  provinces = { data: [], links: [], meta: undefined },
  filters = {}
}: Props) {
  const { canCreate, canView, canUpdate, canDelete, canConfirm } = usePermissions();
  const { t } = useTranslation();
  
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('dashboard.page_title'),
      href: route('dashboard'),
    },
    {
      title: t('provinces.page_title'),
      href: '#',
    },
  ];
  
  const [search, setSearch] = useState(filters.search || '');
  const [sortField, setSortField] = useState(filters.sort_field || 'name');
  const [sortDirection, setSortDirection] = useState<SortDirection>(filters.sort_direction || 'asc');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [provinceToDelete, setProvinceToDelete] = useState<ProvinceData | null>(null);
  const isInitialMount = useRef(true);
  const prevFilters = useRef({
    sortField: filters.sort_field,
    sortDirection: filters.sort_direction
  });

  // Apply search function (only for search)
  const applySearch = () => {
    try {
      const params = {
        search: search,
        sort_field: sortField,
        sort_direction: sortDirection,
      };

      const routeUrl = route('provinces.index');
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

  // Apply other filters (sort) without search
  const applyOtherFilters = () => {
    try {
      const params = {
        search: filters.search || '', // Keep current search from URL
        sort_field: sortField,
        sort_direction: sortDirection,
      };

      const routeUrl = route('provinces.index');
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

  // Apply filters when sort changes
  useEffect(() => {
    // Skip on initial mount to prevent unnecessary requests
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Check if there's an actual change compared to previous values
    const hasSortFieldChange = sortField !== prevFilters.current.sortField;
    const hasSortDirectionChange = sortDirection !== prevFilters.current.sortDirection;

    if (hasSortFieldChange || hasSortDirectionChange) {
      // Update the previous values
      prevFilters.current = {
        sortField,
        sortDirection
      };
      
      applyOtherFilters();
    }
  }, [sortField, sortDirection]);

  // Handler functions for SearchFilters component
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applySearch();
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
    setSortField('name');
    setSortDirection('asc');
    
    // Apply the cleared filters immediately
    try {
      const params = {
        search: '',
        sort_field: 'name',
        sort_direction: 'asc',
      };

      const routeUrl = route('provinces.index');
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

  // Open delete confirmation dialog
  const openDeleteDialog = (province: ProvinceData) => {
    setProvinceToDelete(province);
    setIsDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const confirmDelete = () => {
    if (provinceToDelete) {
      router.delete(route('provinces.destroy', provinceToDelete.id), {
        onSuccess: () => {
          setProvinceToDelete(null);
          setIsDeleteDialogOpen(false);
        },
      });
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('provinces.page_title')} />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('provinces.delete_dialog.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('provinces.delete_dialog.description', { name: provinceToDelete?.name || '' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>{t('provinces.delete_dialog.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              {t('provinces.delete_dialog.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="container px-0 py-6">
        {/* Custom Header Component */}
        <Header
          title={t('provinces.page_title')}
          description={t('provinces.page_description')}
          icon={<MapPin className="h-6 w-6" />}
          model="province"
          routeName={() => route('provinces.create')}
          buttonText={t('provinces.add_button')}
          theme="purple"
          buttonSize="lg"
        />

        <SearchFilters
          searchQuery={search}
          onSearchChange={setSearch}
          onSearchSubmit={handleSearchSubmit}
          searchPlaceholder={t('provinces.search_placeholder')}
          filters={{
            sort: `${sortField}:${sortDirection}`,
            direction: sortDirection,
            per_page: 10
          }}
          onTypeChange={() => {}} // Not used for provinces
          onCategoryChange={() => {}} // Not used for provinces
          onDepartmentChange={() => {}} // Not used for provinces
          onSortChange={handleSortChange}
          onDirectionChange={handleDirectionChange}
          onPerPageChange={handlePerPageChange}
          onResetFilters={clearFilters}
          types={[]} // No types for provinces
          categories={[]} // No categories for provinces
          departments={[]} // No departments for provinces
          sortOptions={sortOptions}
          perPageOptions={perPageOptions}
          title={t('provinces.search_filters')}
          description={t('provinces.find_and_filter')}
          className="shadow-2xl bg-gradient-to-bl from-white dark:from-gray-800 to-purple-50/30 dark:to-purple-900/20 border-0 overflow-hidden"
        />

        {/* Results Table */}
        <div className="mt-8">
          <Header
            title={t('provinces.table.title')}
            description={t('provinces.table.description')}
            icon={<TrendingUp className="h-6 w-6" />}
            model="province"
            routeName={() => ''}
            buttonText=""
            theme="purple"
            showButton={false}
          />
          <Card className="shadow-lg bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-700">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-l from-purple-100 dark:from-purple-900/30 to-purple-200 dark:to-purple-800/30 border-0">
                    <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('provinces.table.name')}</TableHead>
                    <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('provinces.table.code')}</TableHead>
                    <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('provinces.table.capital')}</TableHead>
                    <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('provinces.table.status')}</TableHead>
                    <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('provinces.table.created_by')}</TableHead>
                    <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6 text-right">{t('provinces.table.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {provinces?.data && provinces.data.length > 0 ? (
                    provinces.data.map((province: ProvinceData) => (
                      <TableRow key={province.id} className="hover:bg-purple-50/50 dark:hover:bg-purple-900/20">
                        <TableCell>
                          <Link
                            href={route('provinces.show', province.id)}
                            className="font-bold hover:underline flex items-center gap-2 text-purple-900 dark:text-purple-100"
                          >
                            <MapPin className="h-4 w-4" />
                            {province.name}
                          </Link>
                        </TableCell>
                        <TableCell className="font-bold text-purple-900 dark:text-purple-100">{province.code}</TableCell>
                        <TableCell className="text-purple-900 dark:text-purple-100">
                          {province.capital || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={province.status === 'active' ? 'default' : 'secondary'}>
                            {province.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-purple-900 dark:text-purple-100">
                          {province.creator?.name || '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 justify-end">
                            <CanView model="province">
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                title={t('provinces.actions.view')}
                              >
                                <Link href={route('provinces.show', province.id)}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                            </CanView>
                            <CanUpdate model="province">
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                title={t('provinces.actions.edit')}
                              >
                                <Link href={route('provinces.edit', province.id)}>
                                  <Pencil className="h-4 w-4" />
                                </Link>
                              </Button>
                            </CanUpdate>
                            <CanDelete model="province">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openDeleteDialog(province)}
                                title={t('provinces.actions.delete')}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </CanDelete>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center">
                        <div className="flex flex-col items-center gap-4 text-purple-600 dark:text-purple-400">
                          <AlertTriangle className="h-16 w-16" />
                          <p className="text-xl font-bold">{t('provinces.no_records')}</p>
                          <p>{t('provinces.no_records_description')}</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Pagination */}
        {provinces?.links && provinces.links.length > 0 && (
          <div className="mt-8 flex justify-center">
            <div className="bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 p-4 rounded-3xl shadow-2xl border border-purple-200 dark:border-purple-700">
              <Pagination links={provinces.links} />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
