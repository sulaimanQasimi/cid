import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash, Search, ArrowUpDown, FilterX, ChevronRight, ChevronLeft, Eye, BarChart3, Shield, Users, Building2, Calendar, FileText, AlertTriangle, TrendingUp, ChevronDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { format } from 'date-fns';
import { useTranslation } from '@/lib/i18n/translate';
import { formatPersianDate } from '@/lib/utils/date';
import { usePermissions } from '@/hooks/use-permissions';
import { CanCreate, CanView, CanUpdate, CanDelete } from '@/components/ui/permission-guard';
import { Pagination } from '@/components/pagination';
import Header from '@/components/template/header';
import SearchFilters from '@/components/template/SearchFilters';

interface Criminal {
  id: number;
  photo: string | null;
  number: string | null;
  name: string;
  father_name: string | null;
  grandfather_name: string | null;
  id_card_number: string | null;
  phone_number: string | null;
  original_residence: string | null;
  current_residence: string | null;
  crime_type: string | null;
  arrest_location: string | null;
  arrested_by: string | null;
  arrest_date: string | null;
  referred_to: string | null;
  final_verdict: string | null;
  notes: string | null;
  department_id: number | null;
  created_by: number;
  created_at: string;
  updated_at: string;
  department?: {
    id: number;
    name: string;
    code: string;
  } | null;
  creator?: {
    id: number;
    name: string;
  };
  // Visitor statistics
  visits_count?: number;
  unique_visitors_count?: number;
  today_visits_count?: number;
  this_week_visits_count?: number;
  this_month_visits_count?: number;
  bounce_rate?: number;
  average_time_spent?: number;
}

interface Department {
  id: number;
  name: string;
  code: string;
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

interface Props {
  criminals: {
    data?: Criminal[];
    links?: PaginationLinks[];
    meta?: PaginationMeta;
  };
  departments: Department[];
  filters: {
    search: string;
    sort: string;
    direction: string;
    per_page: number;
    department_id?: string;
  };
  auth: {
    permissions: string[];
  };
}

const sortOptions = [
  { value: 'name', label: 'criminal.sort_options.name' },
  { value: 'number', label: 'criminal.sort_options.number' },
  { value: 'crime_type', label: 'criminal.sort_options.crime_type' },
  { value: 'arrest_date', label: 'criminal.sort_options.arrest_date' },
  { value: 'department_id', label: 'criminal.sort_options.department_id' },
  { value: 'created_at', label: 'criminal.sort_options.created_at' },
  { value: 'updated_at', label: 'criminal.sort_options.updated_at' },
];

const perPageOptions = [
  { value: 10, label: 'criminal.per_page_option' },
  { value: 25, label: 'criminal.per_page_option' },
  { value: 50, label: 'criminal.per_page_option' },
  { value: 100, label: 'criminal.per_page_option' },
];

export default function CriminalIndex({
  criminals,
  departments = [],
  filters,
  auth
}: Props) {
  const { canCreate, canView, canUpdate, canDelete } = usePermissions();
  const { t } = useTranslation();

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('criminal.page_title'),
      href: route('criminals.index'),
    },
  ];
  const [searchQuery, setSearchQuery] = useState(filters.search);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [criminalToDelete, setCriminalToDelete] = useState<Criminal | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>(filters.department_id || '');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters({ search: searchQuery });
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    applyFilters({ sort: value });
  };

  // Handle direction change
  const handleDirectionChange = () => {
    const newDirection = filters.direction === 'asc' ? 'desc' : 'asc';
    applyFilters({ direction: newDirection });
  };

  // Handle per page change
  const handlePerPageChange = (value: string) => {
    applyFilters({ per_page: parseInt(value) });
  };

  // Handle department filter change
  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value);
    applyFilters({ department_id: value === "_all" ? undefined : value });
  };

  // Navigate to page
  const goToPage = (page: number) => {
    router.get(route('criminals.index'),
      { ...filters, page },
      { preserveState: true, preserveScroll: true }
    );
  };

  // Apply filters to the URL
  const applyFilters = (newFilters: Partial<Props['filters']>) => {
    router.get(route('criminals.index'),
      { ...filters, ...newFilters, page: 1 },
      { preserveState: true, preserveScroll: true }
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDepartment('');
    router.get(route('criminals.index'), {
      search: '',
      sort: 'created_at',
      direction: 'desc',
      per_page: 10,
      page: 1,
      department_id: undefined
    });
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (criminal: Criminal) => {
    setCriminalToDelete(criminal);
    setIsDeleteDialogOpen(true);
  };

  // Confirm and execute delete
  const confirmDelete = () => {
    if (criminalToDelete) {
      router.delete(route('criminals.destroy', criminalToDelete.id), {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setCriminalToDelete(null);
        },
      });
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('criminal.page_title')} />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('criminal.delete_dialog.title')}</AlertDialogTitle>
            <AlertDialogDescription>{t('criminal.delete_dialog.description', { name: criminalToDelete?.name || '' })}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>{t('criminal.delete_dialog.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              {t('criminal.delete_dialog.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="container px-0 py-6">
        {/* Modern Header with Glassmorphism */}
        <Header
          title={t('criminal.page_title')}
          description={t('criminal.page_description')}
          icon={<TrendingUp className="h-6 w-6 text-white" />}
          model="criminal"
          routeName="criminals.create"
          theme="orange"
          buttonText={t('criminal.add_button')}
          showBackButton={true}
          backRouteName={() => route('criminals.index')}
          backButtonText={t('common.back_to_list')}
        />
        <SearchFilters
          title={t('criminal.search_filters')}
          description={t('criminal.table.description')}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={handleSearch}
          filters={{
            sort: filters.sort,
            direction: filters.direction as 'asc' | 'desc',
            per_page: filters.per_page,
          }}
          onTypeChange={() => { }}
          onCategoryChange={() => { }}
          onDepartmentChange={() => { }}
          onSortChange={handleSortChange}
          onDirectionChange={handleDirectionChange}
          onPerPageChange={handlePerPageChange}
          onResetFilters={resetFilters}
          types={[]}
          categories={[]}
          departments={[]}
          sortOptions={sortOptions}
          perPageOptions={perPageOptions}
        />
        {/* Results Table */}
        <div className="mt-8">

          <Card className="overflow-hidden rounded-lg border dark:border-gray-700 dark:bg-gray-800 shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 dark:bg-muted/30">
                    <TableHead className="px-6 py-4 font-semibold text-foreground dark:text-foreground">{t('common.table.id')}</TableHead>
                    <TableHead className="px-6 py-4 font-semibold text-foreground dark:text-foreground">{t('criminal.table.name')}</TableHead>
                    <TableHead className="px-6 py-4 font-semibold text-foreground dark:text-foreground">{t('criminal.table.number')}</TableHead>
                    <TableHead className="px-6 py-4 font-semibold text-foreground dark:text-foreground">{t('criminal.table.crime_type')}</TableHead>
                    <TableHead className="px-6 py-4 font-semibold text-foreground dark:text-foreground">{t('criminal.table.department')}</TableHead>
                    <TableHead className="px-6 py-4 font-semibold text-foreground dark:text-foreground">{t('criminal.table.arrest_date')}</TableHead>
                    <TableHead className="px-6 py-4 text-right font-semibold text-foreground dark:text-foreground">
                      {t('criminal.table.actions')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {criminals.data && criminals.data.length > 0 ? (
                    criminals.data.map((criminal) => (
                      <TableRow
                        key={criminal.id}
                        className="hover:bg-muted/50 dark:hover:bg-muted/30 border-b border-border dark:border-border"
                      >
                        <TableCell className="px-6 py-4 font-medium text-foreground dark:text-foreground">{criminal.id}</TableCell>
                        <TableCell className="px-6 py-4 font-medium text-foreground dark:text-foreground">{criminal.name}</TableCell>
                        <TableCell className="px-6 py-4 text-foreground dark:text-foreground">{criminal.number || '-'}</TableCell>
                        <TableCell className="px-6 py-4">
                          {criminal.crime_type ? (
                            <Badge variant="secondary" className="bg-secondary text-secondary-foreground dark:bg-secondary dark:text-secondary-foreground">
                              {criminal.crime_type}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground dark:text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          {criminal.department ? (
                            <Badge variant="secondary" className="bg-secondary text-secondary-foreground dark:bg-secondary dark:text-secondary-foreground">
                              {criminal.department.name}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground dark:text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-muted-foreground dark:text-muted-foreground">
                          {criminal.arrest_date ? (
                            formatPersianDate(criminal.arrest_date)
                          ) : (
                            <span className="text-muted-foreground dark:text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <CanView model="criminal">
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                title={t('criminal.actions.view')}
                                className="h-8 w-8"
                              >
                                <Link href={route('criminals.show', criminal.id)}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                            </CanView>
                            <CanUpdate model="criminal">
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                title={t('criminal.actions.edit')}
                                className="h-8 w-8"
                              >
                                <Link href={route('criminals.edit', criminal.id)}>
                                  <Pencil className="h-4 w-4" />
                                </Link>
                              </Button>
                            </CanUpdate>
                            <CanDelete model="criminal">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openDeleteDialog(criminal)}
                                title={t('criminal.actions.delete')}
                                className="h-8 w-8"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </CanDelete>
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                              title={t('criminal.analytics.view_analytics')}
                              className="h-8 w-8"
                            >
                              <Link href={`/analytics/Criminal/${criminal.id}`}>
                                <BarChart3 className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center">
                        <div className="flex flex-col items-center gap-4 text-muted-foreground dark:text-muted-foreground">
                          <div className="rounded-full bg-muted dark:bg-black p-4">
                            <AlertTriangle className="h-8 w-8 text-muted-foreground dark:text-muted-foreground dark:bg-black" />
                          </div>
                          <p className="text-lg font-semibold text-foreground dark:text-foreground">{t('criminal.no_records')}</p>
                          <p className="text-sm text-muted-foreground dark:text-muted-foreground">{t('criminal.no_records_description')}</p>
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
        {criminals && criminals.links && criminals.links.length > 0 && (
          <div className="mt-6 flex justify-center">
            <Pagination links={criminals.links} />
          </div>
        )}
      </div>
    </AppLayout>
  );
}
