import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Header from '@/components/template/header';
import SearchFilters from '@/components/template/SearchFilters';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash, Search, ArrowUpDown, FilterX, Eye, BarChart3, Shield, Users, Building2, Calendar, FileText, AlertTriangle, TrendingUp, ChevronDown } from 'lucide-react';
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
import { format } from 'date-fns';
import { useTranslation } from '@/lib/i18n/translate';
import { formatPersianDate } from '@/lib/utils/date';
import { usePermissions } from '@/hooks/use-permissions';
import { CanCreate, CanView, CanUpdate, CanDelete } from '@/components/ui/permission-guard';
import { Pagination } from '@/components/pagination';

interface Department {
  id: number;
  name: string;
  code: string;
  infos_count: number;
  created_at: string;
  updated_at: string;
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
  departments: {
    data?: Department[];
    links?: PaginationLinks[];
    meta?: PaginationMeta;
  };
  filters: {
    search: string;
    sort: string;
    direction: string;
    per_page: number;
  };
  auth: {
    permissions: string[];
  };
}

const sortOptions = [
  { value: 'name', label: 'Name' },
  { value: 'code', label: 'Code' },
  { value: 'infos_count', label: 'Info Count' },
  { value: 'created_at', label: 'Created Date' },
  { value: 'updated_at', label: 'Updated Date' },
];

const perPageOptions = [
  { value: 10, label: '10 per page' },
  { value: 25, label: '25 per page' },
  { value: 50, label: '50 per page' },
  { value: 100, label: '100 per page' },
];

export default function DepartmentIndex({
  departments,
  filters = {
    search: '',
    sort: 'created_at',
    direction: 'desc',
    per_page: 10
  },
  auth = {
    permissions: []
  }
}: Props) {
  const { canCreate, canView, canUpdate, canDelete } = usePermissions();
  const { t } = useTranslation();

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('departments.page_title'),
      href: route('departments.index'),
    },
  ];
  const [searchQuery, setSearchQuery] = useState(filters.search);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);

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

  // Handle type filter change (not used for departments)
  const handleTypeChange = (value: string) => {
    // Not applicable for departments
  };

  // Handle category filter change (not used for departments)
  const handleCategoryChange = (value: string) => {
    // Not applicable for departments
  };

  // Handle department filter change (not used for departments)
  const handleDepartmentChange = (value: string) => {
    // Not applicable for departments
  };



  // Apply filters to the URL
  const applyFilters = (newFilters: Partial<Props['filters']>) => {
    router.get(route('departments.index'),
      { ...filters, ...newFilters, page: 1 },
      { preserveState: true, preserveScroll: true }
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    router.get(route('departments.index'), {
      search: '',
      sort: 'created_at',
      direction: 'desc',
      per_page: 10,
      page: 1,
    });
  };

  const openDeleteDialog = (department: Department) => {
    setDepartmentToDelete(department);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (departmentToDelete) {
      router.delete(route('departments.destroy', departmentToDelete.id), {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setDepartmentToDelete(null);
        },
      });
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('departments.page_title')} />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('departments.delete_dialog.title')}</AlertDialogTitle>
            <AlertDialogDescription>{t('departments.delete_dialog.description', { name: departmentToDelete?.name || '' })}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>{t('departments.delete_dialog.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              {t('departments.delete_dialog.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="container px-0 py-6">
        {/* Header Component */}
        <Header
          title={t('departments.page_title')}
          description={t('departments.page_description')}
          icon={<Building2 className="h-6 w-6 text-white" />}
          model="department"
          routeName="departments.create"
          buttonText={t('departments.add_button')}
          theme="blue"
        />

        <SearchFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={handleSearch}
          searchPlaceholder={t('departments.search_placeholder')}
          filters={{
            sort: filters.sort,
            direction: filters.direction as 'asc' | 'desc',
            per_page: filters.per_page
          }}
          onTypeChange={handleTypeChange}
          onCategoryChange={handleCategoryChange}
          onDepartmentChange={handleDepartmentChange}
          onSortChange={handleSortChange}
          onDirectionChange={handleDirectionChange}
          onPerPageChange={handlePerPageChange}
          onResetFilters={resetFilters}
          types={[]}
          categories={[]}
          departments={[]}
          sortOptions={sortOptions.map(option => ({
            value: option.value,
            label: t(`departments.sort_options.${option.value}`)
          }))}
          perPageOptions={perPageOptions.map(option => ({
            value: option.value,
            label: option.value.toString()
          }))}
          title={t('departments.search_filters')}
          description={t('departments.table.description')}
        />

        {/* Results Table */}
        <div className="mt-8">
          <Header
            title={t('departments.table.title')}
            description={t('departments.table.description')}
            icon={<TrendingUp className="h-6 w-6 text-white" />}
            model="department"
            routeName="departments.create"
            theme="blue"
            buttonText={t('departments.add_button')}
          />
          
          <Card className="overflow-hidden rounded-lg border dark:border-gray-700 dark:bg-gray-800 shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 dark:bg-muted/30">
                    <TableHead className="px-6 py-4 font-semibold text-foreground dark:text-foreground">{t('departments.table.id')}</TableHead>
                    <TableHead className="px-6 py-4 font-semibold text-foreground dark:text-foreground">{t('departments.table.name')}</TableHead>
                    <TableHead className="px-6 py-4 font-semibold text-foreground dark:text-foreground">{t('departments.table.code')}</TableHead>
                    <TableHead className="px-6 py-4 font-semibold text-foreground dark:text-foreground">{t('departments.table.info_count')}</TableHead>
                    <TableHead className="px-6 py-4 font-semibold text-foreground dark:text-foreground">{t('departments.table.created_at')}</TableHead>
                    <TableHead className="px-6 py-4 text-right font-semibold text-foreground dark:text-foreground">
                      {t('departments.table.actions')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.data && departments.data.length > 0 ? (
                    departments.data.map((department) => (
                      <TableRow
                        key={department.id}
                        className="hover:bg-muted/50 dark:hover:bg-muted/30 border-b border-border dark:border-border"
                      >
                        <TableCell className="px-6 py-4 font-medium text-foreground dark:text-foreground">{department.id}</TableCell>
                        <TableCell className="px-6 py-4 font-medium text-foreground dark:text-foreground">{department.name}</TableCell>
                        <TableCell className="px-6 py-4">
                          <Badge variant="secondary" className="bg-secondary text-secondary-foreground dark:bg-secondary dark:text-secondary-foreground">
                            {department.code}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="text-center">
                            <div className="font-semibold text-foreground dark:text-foreground">{department.infos_count || 0}</div>
                            <div className="text-xs text-muted-foreground dark:text-muted-foreground">{t('departments.table.info_records')}</div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-muted-foreground dark:text-muted-foreground">
                          {department.created_at ? (
                            formatPersianDate(department.created_at)
                          ) : (
                            <span className="text-muted-foreground dark:text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <CanView model="department">
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                title={t('departments.actions.view')}
                                className="h-8 w-8"
                              >
                                <Link href={route('departments.show', department.id)}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                            </CanView>
                            <CanUpdate model="department">
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                title={t('departments.actions.edit')}
                                className="h-8 w-8"
                              >
                                <Link href={route('departments.edit', department.id)}>
                                  <Pencil className="h-4 w-4" />
                                </Link>
                              </Button>
                            </CanUpdate>
                            <CanDelete model="department">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openDeleteDialog(department)}
                                title={t('departments.actions.delete')}
                                className="h-8 w-8"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </CanDelete>
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                              title={t('departments.analytics.view_analytics')}
                              className="h-8 w-8"
                            >
                              <Link href={`/analytics/Department/${department.id}`}>
                                <BarChart3 className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center">
                        <div className="flex flex-col items-center gap-4 text-muted-foreground dark:text-muted-foreground">
                          <div className="rounded-full bg-muted dark:bg-black p-4">
                            <AlertTriangle className="h-8 w-8 text-muted-foreground dark:text-muted-foreground dark:bg-black" />
                          </div>
                          <p className="text-lg font-semibold text-foreground dark:text-foreground">{t('departments.no_records')}</p>
                          <p className="text-sm text-muted-foreground dark:text-muted-foreground">{t('departments.no_records_description')}</p>
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
        {departments && departments.links && departments.links.length > 0 && (
          <div className="mt-6 flex justify-center">
            <Pagination links={departments.links} />
          </div>
        )}
      </div>
    </AppLayout>
  );
}
