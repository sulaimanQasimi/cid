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
import { usePermissions } from '@/hooks/use-permissions';
import { CanCreate, CanView, CanUpdate, CanDelete } from '@/components/ui/permission-guard';

interface Department {
  id: number;
  name: string;
  code: string;
  infos_count: number;
  created_at: string;
  updated_at: string;
}

interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
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
    links?: PaginationLinks;
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
  { value: 'name', label: 'departments.sort_options.name' },
  { value: 'code', label: 'departments.sort_options.code' },
  { value: 'infos_count', label: 'departments.sort_options.infos_count' },
  { value: 'created_at', label: 'departments.sort_options.created_at' },
  { value: 'updated_at', label: 'departments.sort_options.updated_at' },
];

const perPageOptions = [
  { value: 10, label: 'departments.per_page_option' },
  { value: 25, label: 'departments.per_page_option' },
  { value: 50, label: 'departments.per_page_option' },
  { value: 100, label: 'departments.per_page_option' },
];

export default function DepartmentIndex({
  departments = {
    data: [],
    links: { first: null, last: null, prev: null, next: null },
    meta: {
      current_page: 1,
      from: 1,
      last_page: 1,
      links: [],
      path: '',
      per_page: 10,
      to: 0,
      total: 0
    }
  },
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

  // Navigate to page
  const goToPage = (page: number) => {
    router.get(route('departments.index'),
      { ...filters, page },
      { preserveState: true, preserveScroll: true }
    );
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
        {/* Modern Header with Glassmorphism */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-blue-600 via-blue-700 to-indigo-700 p-8 lg:p-12 text-white shadow-2xl mb-8 group">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="absolute top-0 left-0 w-80 h-80 bg-white/10 rounded-full -translate-y-40 -translate-x-40 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 translate-x-32 blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full -translate-x-16 -translate-y-16 blur-xl group-hover:scale-150 transition-transform duration-500"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8">
            <div className="flex items-center gap-8">
              <div className="p-6 bg-white/20 backdrop-blur-md rounded-3xl border border-white/30 shadow-2xl group-hover:scale-105 transition-transform duration-300">
                <Building2 className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl tracking-tight">{t('departments.page_title')}</h2>
                <p className="text-white/90 flex items-center gap-3 text-xl font-medium">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <FileText className="h-6 w-6" />
                  </div>
                  {t('departments.page_description')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <CanCreate model="department">
                <Button asChild size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 group/btn">
                  <Link href={route('departments.create')} className="flex items-center gap-3">
                    <div className="p-1 bg-white/20 rounded-lg group-hover/btn:scale-110 transition-transform duration-300">
                      <Plus className="h-5 w-5" />
                    </div>
                    {t('departments.add_button')}
                  </Link>
                </Button>
              </CanCreate>
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
                  <div className="text-xl font-bold">{t('departments.search_filters')}</div>
                  <div className="text-blue-100 text-xs font-medium">Find and filter department records</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 rounded-xl"
                  onClick={(e) => {
                    e.stopPropagation();
                    resetFilters();
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
                  <form onSubmit={handleSearch} className="relative">
                    <div className="relative">
                      <Input
                        placeholder={t('departments.search_placeholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-11 pl-20 pr-4 text-base border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gradient-to-l from-blue-50 to-white rounded-xl shadow-lg"
                      />
                      <Button type="submit" className="absolute left-1 top-1/2 -translate-y-1/2 h-9 px-4 bg-gradient-to-l from-blue-500 to-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm">
                        Search
                      </Button>
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
                    </div>
                  </form>
                </div>

                {/* Sort Options */}
                <div>
                  <Select value={filters.sort} onValueChange={handleSortChange}>
                    <SelectTrigger className="h-11 shadow-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gradient-to-l from-blue-50 to-white rounded-xl text-sm">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {t(option.label)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Direction & Per Page Row */}
                <div className="md:col-span-2 lg:col-span-4 grid grid-cols-3 gap-3">
                  {/* Direction Button */}
                  <div>
                    <Button
                      variant="outline"
                      onClick={handleDirectionChange}
                      title={t(`departments.sort_${filters.direction === 'asc' ? 'descending' : 'ascending'}`)}
                      className="h-11 w-full shadow-lg border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400 rounded-xl transition-all duration-300 hover:scale-105 text-sm"
                    >
                      <ArrowUpDown className={`h-4 w-4 mr-2 ${filters.direction === 'desc' ? 'rotate-180' : ''}`} />
                      {filters.direction === 'asc' ? 'Asc' : 'Desc'}
                    </Button>
                  </div>

                  {/* Per Page Options */}
                  <div>
                    <Select value={filters.per_page.toString()} onValueChange={handlePerPageChange}>
                      <SelectTrigger className="h-11 shadow-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gradient-to-l from-blue-50 to-white rounded-xl text-sm">
                        <SelectValue placeholder="Per Page" />
                      </SelectTrigger>
                      <SelectContent>
                        {perPageOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            {t(option.label, { count: String(option.value) })}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetFilters}
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

        {/* Modern Pagination */}
        {departments.meta && departments.meta.total > 0 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-3 bg-gradient-to-l from-blue-50 to-white p-4 rounded-3xl shadow-2xl border border-blue-200">
              {/* First Page Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => departments.meta && goToPage(1)}
                disabled={!departments.meta || departments.meta.current_page === 1}
                className="h-12 w-12 shadow-lg border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400 rounded-xl transition-all duration-300 hover:scale-110 disabled:opacity-50"
                title={t('departments.pagination.first_page')}
              >
                <ChevronRight className="h-5 w-5" />
                <ChevronRight className="h-5 w-5 -mr-1" />
              </Button>
              
              {/* Previous Page Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => departments.meta && goToPage(departments.meta.current_page - 1)}
                disabled={!departments.meta || departments.meta.current_page === 1}
                className="h-12 w-12 shadow-lg border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400 rounded-xl transition-all duration-300 hover:scale-110 disabled:opacity-50"
                title={t('departments.pagination.previous_page')}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
              
              {/* Page Info */}
              <div className="px-6 py-3 bg-gradient-to-l from-blue-100 to-blue-200 text-blue-800 rounded-2xl font-bold text-lg shadow-lg">
                Page {departments.meta?.current_page} of {departments.meta?.last_page} ({departments.meta?.from}-{departments.meta?.to} of {departments.meta?.total})
              </div>
              
              {/* Next Page Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => departments.meta && goToPage(departments.meta.current_page + 1)}
                disabled={!departments.meta || departments.meta.current_page === departments.meta.last_page}
                className="h-12 w-12 shadow-lg border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400 rounded-xl transition-all duration-300 hover:scale-110 disabled:opacity-50"
                title={t('departments.pagination.next_page')}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              {/* Last Page Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => departments.meta && goToPage(departments.meta.last_page)}
                disabled={!departments.meta || departments.meta.current_page === departments.meta.last_page}
                className="h-12 w-12 shadow-lg border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400 rounded-xl transition-all duration-300 hover:scale-110 disabled:opacity-50"
                title={t('departments.pagination.last_page')}
              >
                <ChevronLeft className="h-5 w-5" />
                <ChevronLeft className="h-5 w-5 -mr-1" />
              </Button>
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
