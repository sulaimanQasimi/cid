import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import Header from '@/components/template/header';
import SearchFilters from '@/components/template/SearchFilters';
import { Plus, Pencil, Trash, Eye, AlertTriangle, TrendingUp, MapPin } from 'lucide-react';
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
import {  CanView, CanUpdate, CanDelete, CanConfirm } from '@/components/ui/permission-guard';
import { Pagination } from '@/components/pagination';
import { useState, useEffect, useRef } from 'react';

interface DistrictData {
  id: number;
  name: string;
  code: string;
  description: string | null;
  province_id: number;
  status: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  creator?: {
    id: number;
    name: string;
  };
  province?: {
    id: number;
    name: string;
  };
}

interface ProvinceData {
  id: number;
  name: string;
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
  districts?: {
    data?: DistrictData[];
    links?: PaginationLinks[];
    meta?: PaginationMeta;
  };
  provinces?: ProvinceData[];
  filters?: {
    search?: string;
    sort_field?: string;
    sort_direction?: SortDirection;
    per_page?: number;
    province_id?: string;
  };
}

const sortOptions = [
  { value: 'name:asc', label: 'Name (A-Z)' },
  { value: 'name:desc', label: 'Name (Z-A)' },
  { value: 'code:asc', label: 'Code (A-Z)' },
  { value: 'code:desc', label: 'Code (Z-A)' },
  { value: 'province:asc', label: 'Province (A-Z)' },
  { value: 'province:desc', label: 'Province (Z-A)' },
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

export default function DistrictIndex({
  districts = { data: [], links: [], meta: undefined },
  provinces = [],
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
      title: t('districts.page_title'),
      href: '#',
    },
  ];
  
  const [search, setSearch] = useState(filters.search || '');
  const [sortField, setSortField] = useState(filters.sort_field || 'name');
  const [sortDirection, setSortDirection] = useState<SortDirection>(filters.sort_direction || 'asc');
  const [provinceId, setProvinceId] = useState(filters.province_id || 'all');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [districtToDelete, setDistrictToDelete] = useState<DistrictData | null>(null);
  const isInitialMount = useRef(true);
  const prevFilters = useRef({
    sortField: filters.sort_field,
    sortDirection: filters.sort_direction,
    provinceId: filters.province_id
  });

  // Province options for SearchFilters component
  const provinceOptions = [
    { value: 'all', label: t('districts.all_provinces') },
    ...provinces.map(province => ({
      value: province.id.toString(),
      label: province.name
    }))
  ];

  // Apply search function (only for search)
  const applySearch = () => {
    try {
      const params = {
        search: search,
        sort_field: sortField,
        sort_direction: sortDirection,
        province_id: provinceId === 'all' ? '' : provinceId,
      };

      const routeUrl = route('districts.index');
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

  // Apply other filters (sort, province) without search
  const applyOtherFilters = () => {
    try {
      const params = {
        search: filters.search || '', // Keep current search from URL
        sort_field: sortField,
        sort_direction: sortDirection,
        province_id: provinceId === 'all' ? '' : provinceId,
      };

      const routeUrl = route('districts.index');
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
    const hasSortFieldChange = sortField !== prevFilters.current.sortField;
    const hasSortDirectionChange = sortDirection !== prevFilters.current.sortDirection;
    const hasProvinceChange = provinceId !== prevFilters.current.provinceId;

    if (hasSortFieldChange || hasSortDirectionChange || hasProvinceChange) {
      // Update the previous values
      prevFilters.current = {
        sortField,
        sortDirection,
        provinceId
      };
      
      applyOtherFilters();
    }
  }, [sortField, sortDirection, provinceId]);

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

  const handleProvinceChange = (value: string) => {
    setProvinceId(value === 'all' ? '' : value);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearch('');
    setSortField('name');
    setSortDirection('asc');
    setProvinceId('all');
    
    // Apply the cleared filters immediately
    try {
      const params = {
        search: '',
        sort_field: 'name',
        sort_direction: 'asc',
        province_id: '',
      };

      const routeUrl = route('districts.index');
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
  const openDeleteDialog = (district: DistrictData) => {
    setDistrictToDelete(district);
    setIsDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const confirmDelete = () => {
    if (districtToDelete) {
      router.delete(route('districts.destroy', districtToDelete.id), {
        onSuccess: () => {
          setDistrictToDelete(null);
          setIsDeleteDialogOpen(false);
        },
      });
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('districts.page_title')} />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('districts.delete_dialog.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('districts.delete_dialog.description', { name: districtToDelete?.name || '' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>{t('districts.delete_dialog.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              {t('districts.delete_dialog.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="container px-0 py-6">
        {/* Custom Header Component */}
        <Header
          title={t('districts.page_title')}
          description={t('districts.page_description')}
          icon={<MapPin className="h-6 w-6" />}
          model="district"
          routeName={() => route('districts.create')}
          buttonText={t('districts.add_button')}
          theme="purple"
          buttonSize="lg"
        />

        <SearchFilters
          searchQuery={search}
          onSearchChange={setSearch}
          onSearchSubmit={handleSearchSubmit}
          searchPlaceholder={t('districts.search_placeholder')}
          filters={{
            sort: `${sortField}:${sortDirection}`,
            direction: sortDirection,
            per_page: 10
          }}
          onTypeChange={() => {}} // Not used for districts
          onCategoryChange={() => {}} // Not used for districts
          onDepartmentChange={handleProvinceChange}
          onSortChange={handleSortChange}
          onDirectionChange={handleDirectionChange}
          onPerPageChange={handlePerPageChange}
          onResetFilters={clearFilters}
          types={[]} // No types for districts
          categories={[]} // No categories for districts
          departments={provinceOptions}
          sortOptions={sortOptions}
          perPageOptions={perPageOptions}
          title={t('districts.search_filters')}
          description={t('districts.find_and_filter')}
          className="shadow-2xl bg-gradient-to-bl from-white dark:from-gray-800 to-purple-50/30 dark:to-purple-900/20 border-0 overflow-hidden"
        />

        {/* Results Table */}
        <div className="mt-8">
          <Header
            title={t('districts.table.title')}
            description={t('districts.table.description')}
            icon={<TrendingUp className="h-6 w-6" />}
            model="district"
            routeName={() => ''}
            buttonText=""
            theme="purple"
            showButton={false}
          />
          <Card className="shadow-lg">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-l from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 border-0">
                    <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('districts.table.name')}</TableHead>
                    <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('districts.table.code')}</TableHead>
                    <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('districts.table.province')}</TableHead>
                    <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('districts.table.status')}</TableHead>
                    <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('districts.table.created_by')}</TableHead>
                    <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6 text-right">{t('districts.table.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {districts?.data && districts.data.length > 0 ? (
                    districts.data.map((district: DistrictData) => (
                      <TableRow key={district.id}>
                        <TableCell>
                          <Link
                            href={route('districts.show', district.id)}
                            className="font-bold hover:underline flex items-center gap-2"
                          >
                            <MapPin className="h-4 w-4" />
                            {district.name}
                          </Link>
                        </TableCell>
                        <TableCell className="font-bold">{district.code}</TableCell>
                        <TableCell>
                          {district.province ? (
                            <Link
                              href={route('provinces.show', district.province.id)}
                              className="hover:underline"
                            >
                              {district.province.name}
                            </Link>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={district.status === 'active' ? 'default' : 'secondary'}>
                            {district.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {district.creator?.name || '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 justify-end">
                            <CanView model="district">
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                title={t('districts.actions.view')}
                              >
                                <Link href={route('districts.show', district.id)}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                            </CanView>
                            <CanUpdate model="district">
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                title={t('districts.actions.edit')}
                              >
                                <Link href={route('districts.edit', district.id)}>
                                  <Pencil className="h-4 w-4" />
                                </Link>
                              </Button>
                            </CanUpdate>
                            <CanDelete model="district">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openDeleteDialog(district)}
                                title={t('districts.actions.delete')}
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
                        <div className="flex flex-col items-center gap-4 text-muted-foreground dark:text-gray-400">
                          <AlertTriangle className="h-16 w-16 text-gray-400 dark:text-gray-500" />
                          <p className="text-xl font-bold text-gray-600 dark:text-gray-300">{t('districts.no_records')}</p>
                          <p className="text-gray-500 dark:text-gray-400">{t('districts.no_records_description')}</p>
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
        {districts?.links && districts.links.length > 0 && (
          <div className="mt-8 flex justify-center">
            <div className="bg-gradient-to-l from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800 p-4 rounded-3xl shadow-2xl border border-purple-200 dark:border-purple-700">
              <Pagination links={districts.links} />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
