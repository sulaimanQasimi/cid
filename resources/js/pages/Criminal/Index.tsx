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
import { Pagination } from '@/components/pagination';

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

      <div className="container px-0 py-6">
        {/* Modern Header with Glassmorphism */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-red-600 via-orange-600 to-amber-600 p-8 lg:p-12 text-white shadow-2xl mb-8 group">
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
                <h2 className="text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl tracking-tight">{t('criminal.page_title')}</h2>
                <div className="text-white/90 flex items-center gap-3 text-xl font-medium">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <FileText className="h-6 w-6" />
                  </div>
                  {t('criminal.page_description')}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <CanCreate model="criminal">
                <Button asChild size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 group/btn">
                  <Link href={route('criminals.create')} className="flex items-center gap-3">
                    <div className="p-1 bg-white/20 rounded-lg group-hover/btn:scale-110 transition-transform duration-300">
                      <Plus className="h-5 w-5" />
                    </div>
                    {t('criminal.add_button')}
                  </Link>
                </Button>
              </CanCreate>
            </div>
          </div>
        </div>

        <Card className="shadow-2xl bg-gradient-to-bl from-white to-orange-50/30 border-0 rounded-3xl overflow-hidden">
          <CardHeader className="py-4 bg-gradient-to-l from-orange-500 to-orange-600 text-white cursor-pointer" onClick={() => setIsFiltersOpen(!isFiltersOpen)}>
            <CardTitle className="text-lg font-semibold flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm shadow-lg">
                  <Search className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-bold">{t('criminal.search_filters')}</div>
                  <div className="text-orange-100 text-xs font-medium">Find and filter criminal records</div>
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
                        placeholder={t('criminal.search_placeholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-11 pl-20 pr-4 text-base border-orange-200 focus:border-orange-500 focus:ring-orange-500/20 bg-gradient-to-l from-orange-50 to-white rounded-xl shadow-lg"
                      />
                      <Button type="submit" className="absolute left-1 top-1/2 -translate-y-1/2 h-9 px-4 bg-gradient-to-l from-orange-500 to-orange-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm">
                        Search
                      </Button>
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-400" />
                    </div>
                  </form>
                </div>

                {/* Department Filter */}
                <div>
                  <Select value={selectedDepartment} onValueChange={handleDepartmentChange}>
                    <SelectTrigger className="h-11 shadow-lg border-orange-200 focus:border-orange-500 focus:ring-orange-500/20 bg-gradient-to-l from-orange-50 to-white rounded-xl text-sm">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_all">{t('criminal.all_departments')}</SelectItem>
                      {departments.map((department) => (
                        <SelectItem key={department.id} value={department.id.toString()}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort Options */}
                <div>
                  <Select value={filters.sort} onValueChange={handleSortChange}>
                    <SelectTrigger className="h-11 shadow-lg border-orange-200 focus:border-orange-500 focus:ring-orange-500/20 bg-gradient-to-l from-orange-50 to-white rounded-xl text-sm">
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
                      title={t(`criminal.sort_${filters.direction === 'asc' ? 'descending' : 'ascending'}`)}
                      className="h-11 w-full shadow-lg border-orange-300 text-orange-700 hover:bg-orange-100 hover:border-orange-400 rounded-xl transition-all duration-300 hover:scale-105 text-sm"
                    >
                      <ArrowUpDown className={`h-4 w-4 mr-2 ${filters.direction === 'desc' ? 'rotate-180' : ''}`} />
                      {filters.direction === 'asc' ? 'Asc' : 'Desc'}
                    </Button>
                  </div>

                  {/* Per Page Options */}
                  <div>
                    <Select value={filters.per_page.toString()} onValueChange={handlePerPageChange}>
                      <SelectTrigger className="h-11 shadow-lg border-orange-200 focus:border-orange-500 focus:ring-orange-500/20 bg-gradient-to-l from-orange-50 to-white rounded-xl text-sm">
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
                      className="h-11 px-3 shadow-lg border-orange-300 text-orange-700 hover:bg-orange-100 hover:border-orange-400 rounded-xl transition-all duration-300 hover:scale-105 text-sm"
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
          <Card className="shadow-2xl overflow-hidden bg-gradient-to-bl from-white to-orange-50/30 border-0 rounded-3xl">
            <CardHeader className="bg-gradient-to-l from-orange-500 to-orange-600 text-white py-6">
              <CardTitle className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{t('criminal.table.title')}</div>
                  <div className="text-orange-100 text-sm font-medium">Criminal records overview</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-hidden rounded-b-3xl">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-l from-orange-100 to-orange-200 border-0">
                      <TableHead className="text-orange-800 font-bold text-lg py-6 px-6">{t('criminal.table.name')}</TableHead>
                      <TableHead className="text-orange-800 font-bold text-lg py-6 px-6">{t('criminal.table.number')}</TableHead>
                      <TableHead className="text-orange-800 font-bold text-lg py-6 px-6">{t('criminal.table.crime_type')}</TableHead>
                      <TableHead className="text-orange-800 font-bold text-lg py-6 px-6">{t('criminal.table.department')}</TableHead>
                      <TableHead className="text-orange-800 font-bold text-lg py-6 px-6">{t('criminal.table.arrest_date')}</TableHead>
                      <TableHead className="text-orange-800 font-bold text-lg py-6 px-6">{t('criminal.table.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                <TableBody>
                  {criminals.data && criminals.data.length > 0 ? (
                    criminals.data.map((criminal) => (
                      <TableRow key={criminal.id} className="hover:bg-orange-50/50 transition-colors duration-300 border-b border-orange-100">
                        <TableCell className="font-bold text-orange-900 py-6 px-6 text-lg">{criminal.name}</TableCell>
                        <TableCell className="text-orange-800 py-6 px-6">{criminal.number || t('criminal.na')}</TableCell>
                        <TableCell className="text-orange-800 py-6 px-6">{criminal.crime_type || t('criminal.na')}</TableCell>
                        <TableCell className="py-6 px-6">
                          {criminal.department ? (
                            <Badge variant="outline" className="bg-gradient-to-l from-orange-100 to-orange-200 text-orange-800 border-orange-300 px-4 py-2 rounded-xl font-semibold">
                              {criminal.department.name}
                            </Badge>
                          ) : (
                            <span className="text-orange-600 font-medium">{t('criminal.na')}</span>
                          )}
                        </TableCell>
                        <TableCell className="text-orange-800 py-6 px-6 font-medium">
                          {criminal.arrest_date ? (
                            format(new Date(criminal.arrest_date), 'MMM d, yyyy')
                          ) : (
                            <span className="text-orange-600">{t('criminal.na')}</span>
                          )}
                        </TableCell>
                        <TableCell className="py-6 px-6">
                          <div className="flex items-center gap-2">
                            <CanView model="criminal">
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                title={t('criminal.actions.view')}
                                className="h-10 w-10 rounded-xl hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-all duration-300 hover:scale-110"
                              >
                                <Link href={route('criminals.show', criminal.id)}>
                                  <Eye className="h-5 w-5" />
                                </Link>
                              </Button>
                            </CanView>
                            <CanUpdate model="criminal">
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                title={t('criminal.actions.edit')}
                                className="h-10 w-10 rounded-xl hover:bg-green-100 text-green-600 hover:text-green-700 transition-all duration-300 hover:scale-110"
                              >
                                <Link href={route('criminals.edit', criminal.id)}>
                                  <Pencil className="h-5 w-5" />
                                </Link>
                              </Button>
                            </CanUpdate>
                            <CanDelete model="criminal">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openDeleteDialog(criminal)}
                                title={t('criminal.actions.delete')}
                                className="h-10 w-10 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-100 transition-all duration-300 hover:scale-110"
                              >
                                <Trash className="h-5 w-5" />
                              </Button>
                            </CanDelete>
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                              title={t('criminal.analytics.view_analytics')}
                              className="h-10 w-10 rounded-xl hover:bg-purple-100 text-purple-600 hover:text-purple-700 transition-all duration-300 hover:scale-110"
                            >
                              <Link href={`/analytics/Criminal/${criminal.id}`}>
                                <BarChart3 className="h-5 w-5" />
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center">
                        <div className="flex flex-col items-center gap-4 text-orange-600">
                          <div className="p-4 bg-orange-100 rounded-full">
                            <AlertTriangle className="h-16 w-16 text-orange-400" />
                          </div>
                          <p className="text-xl font-bold">{t('criminal.no_records')}</p>
                          <p className="text-orange-500">No criminal records found</p>
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
        {criminals && criminals.links && criminals.links.length > 0 && (
          <div className="mt-8 flex justify-center">
            <div className="bg-gradient-to-l from-orange-50 to-white p-4 rounded-3xl shadow-2xl border border-orange-200">
              <Pagination links={criminals.links} />
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">{t('criminal.delete_dialog.title')}</AlertDialogTitle>
            <AlertDialogDescription className="mt-2">
              {t('criminal.delete_dialog.description', { name: criminalToDelete?.name || '' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel className="shadow-sm">{t('criminal.delete_dialog.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground shadow-sm">
              {t('criminal.delete_dialog.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
