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
  console.log(departments);
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('departments.page_title')} />

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
          description="Find and filter department records"
        />

        {/* Results Table */}
        <div className="mt-8">
          <Card className="shadow-2xl overflow-hidden bg-gradient-to-bl from-white to-blue-50/30 border-0 rounded-3xl">
            <CardHeader className="bg-gradient-to-l from-blue-500 to-blue-600 text-white py-6">
              <CardTitle className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{t('departments.table.title')}</div>
                  <div className="text-blue-100 text-sm font-medium">Department records overview</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-hidden rounded-b-3xl">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-l from-blue-100 to-blue-200 border-0">
                      <TableHead className="text-blue-800 font-bold text-lg py-6 px-6">{t('departments.table.name')}</TableHead>
                      <TableHead className="text-blue-800 font-bold text-lg py-6 px-6">{t('departments.table.code')}</TableHead>
                      <TableHead className="text-blue-800 font-bold text-lg py-6 px-6">{t('departments.table.info_count')}</TableHead>
                      <TableHead className="text-blue-800 font-bold text-lg py-6 px-6">{t('departments.table.created_at')}</TableHead>
                      <TableHead className="text-blue-800 font-bold text-lg py-6 px-6">{t('departments.table.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departments.data && departments.data.length > 0 ? (
                      departments.data.map((department) => (
                        <TableRow key={department.id} className="hover:bg-blue-50/50 transition-colors duration-300 border-b border-blue-100">
                          <TableCell className="font-bold text-blue-900 py-6 px-6 text-lg">{department.name}</TableCell>
                          <TableCell className="text-blue-800 py-6 px-6">
                            <Badge variant="outline" className="bg-gradient-to-l from-blue-100 to-blue-200 text-blue-800 border-blue-300 px-4 py-2 rounded-xl font-semibold">
                              {department.code}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-orange-800 py-6 px-6 font-medium">
                            <Badge variant="outline" className="bg-gradient-to-l from-blue-100 to-blue-200 text-blue-800 border-blue-300 px-4 py-2 rounded-xl font-semibold">
                              {department.infos_count} {t('departments.info_records')}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-blue-800 py-6 px-6 font-medium">
                            {department.created_at ? (
                              format(new Date(department.created_at), 'MMM d, yyyy')
                            ) : (
                              <span className="text-blue-600">{t('departments.na')}</span>
                            )}
                          </TableCell>
                          <TableCell className="py-6 px-6">
                            <div className="flex items-center gap-2">
                              <CanView model="department">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  asChild
                                  title={t('departments.actions.view')}
                                  className="h-10 w-10 rounded-xl hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-all duration-300 hover:scale-110"
                                >
                                  <Link href={route('departments.show', department.id)}>
                                    <Eye className="h-5 w-5" />
                                  </Link>
                                </Button>
                              </CanView>
                              <CanUpdate model="department">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  asChild
                                  title={t('departments.actions.edit')}
                                  className="h-10 w-10 rounded-xl hover:bg-green-100 text-green-600 hover:text-green-700 transition-all duration-300 hover:scale-110"
                                >
                                  <Link href={route('departments.edit', department.id)}>
                                    <Pencil className="h-5 w-5" />
                                  </Link>
                                </Button>
                              </CanUpdate>
                              <CanDelete model="department">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openDeleteDialog(department)}
                                  title={t('departments.actions.delete')}
                                  className="h-10 w-10 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-100 transition-all duration-300 hover:scale-110"
                                >
                                  <Trash className="h-5 w-5" />
                                </Button>
                              </CanDelete>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-32 text-center">
                          <div className="flex flex-col items-center gap-4 text-blue-600">
                            <div className="p-4 bg-blue-100 rounded-full">
                              <AlertTriangle className="h-16 w-16 text-blue-400" />
                            </div>
                            <p className="text-xl font-bold">{t('departments.no_records')}</p>
                            <p className="text-blue-500">No department records found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

                {/* Pagination */}
        {departments.links && departments.links.length > 0 && (
          <div className="mt-8 flex justify-center">
            <div className="bg-gradient-to-l from-blue-50 to-white p-4 rounded-3xl shadow-2xl border border-blue-200">
              <Pagination links={departments.links} />
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('common.confirm')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('departments.delete_confirm', { name: departmentToDelete?.name || '' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>{t('common.delete')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
