import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash, Search, ArrowUpDown, FilterX, ChevronLeft, ChevronRight, Eye, BarChart3, Shield, Users, Building2, Calendar, FileText, AlertTriangle, TrendingUp, ChevronDown } from 'lucide-react';
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
import { useTranslation } from '@/lib/i18n/translate';
import { usePermissions } from '@/hooks/use-permissions';
import { CanCreate, CanView, CanUpdate, CanDelete, CanConfirm } from '@/components/ui/permission-guard';
import { cn } from '@/lib/utils';
import { Pagination } from '@/components/pagination';

interface InfoRecord {
  id: number;
  name: string;
  code: string | null;
  description: string | null;
  info_type_id: number;
  info_category_id: number;
  department_id: number | null;
  created_at: string;
  updated_at: string;
  infoType?: {
    id: number;
    name: string;
  };
  infoCategory?: {
    id: number;
    name: string;
  };
  department?: {
    id: number;
    name: string;
    code: string;
  } | null;
}

interface InfoCategory {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

interface InfoType {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
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
  infos: {
    data?: InfoRecord[];
    links?: PaginationLinks[];
    meta?: PaginationMeta;
  };
  types: InfoType[];
  categories: InfoCategory[];
  departments: Department[];
  filters: {
    search: string;
    sort: string;
    direction: string;
    per_page: number;
    type_id?: string;
    category_id?: string;
    department_id?: string;
  };
}

const sortOptions = [
  { value: 'name', label: 'Name' },
  { value: 'info_type_id', label: 'Type' },
  { value: 'info_category_id', label: 'Category' },
  { value: 'department_id', label: 'Department' },
  { value: 'created_at', label: 'Created Date' },
  { value: 'updated_at', label: 'Updated Date' },
];

const perPageOptions = [
  { value: 10, label: '10 per page' },
  { value: 25, label: '25 per page' },
  { value: 50, label: '50 per page' },
  { value: 100, label: '100 per page' },
];

export default function InfoIndex({
  infos ,
  types = [],
  categories = [],
  departments = [],
  filters
}: Props) {
  const { canCreate, canView, canUpdate, canDelete, canConfirm } = usePermissions();
  const { t } = useTranslation();
  
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('info.page_title'),
      href: '#',
    },
    {
      title: t('info.page_title'),
      href: route('infos.index'),
    },
  ];
  const [searchQuery, setSearchQuery] = useState(filters.search);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [infoToDelete, setInfoToDelete] = useState<InfoRecord | null>(null);
  const [selectedType, setSelectedType] = useState<string>(filters.type_id || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(filters.category_id || '');
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

  // Handle type filter change
  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    applyFilters({ type_id: value === "_all" ? undefined : value });
  };

  // Handle category filter change
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    applyFilters({ category_id: value === "_all" ? undefined : value });
  };

  // Handle department filter change
  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value);
    applyFilters({ department_id: value === "_all" ? undefined : value });
  };

  // Navigate to page
  const goToPage = (page: number) => {
    router.get(route('infos.index'),
      { ...filters, page },
      { preserveState: true, preserveScroll: true }
    );
  };

  // Apply filters to the URL
  const applyFilters = (newFilters: Partial<Props['filters']>) => {
    router.get(route('infos.index'),
      { ...filters, ...newFilters, page: 1 },
      { preserveState: true, preserveScroll: true }
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedType('');
    setSelectedCategory('');
    setSelectedDepartment('');
    router.get(route('infos.index'), {
      search: '',
      sort: 'name',
      direction: 'asc',
      per_page: 10,
      page: 1,
      type_id: undefined,
      category_id: undefined,
      department_id: undefined
    });
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (info: InfoRecord) => {
    setInfoToDelete(info);
    setIsDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const confirmDelete = () => {
    if (infoToDelete) {
      router.delete(route('infos.destroy', infoToDelete.id), {
        onSuccess: () => {
          setInfoToDelete(null);
          setIsDeleteDialogOpen(false);
        },
      });
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('info.page_title')} />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('info.delete_dialog.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('info.delete_dialog.description', { name: infoToDelete?.name || '' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>{t('info.delete_dialog.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              {t('info.delete_dialog.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="container px-0 py-6">
        {/* Modern Header with Glassmorphism */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-purple-600 via-indigo-600 to-blue-600 p-8 lg:p-12 text-white shadow-2xl mb-8 group">
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
                <h2 className="text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl tracking-tight">{t('info.page_title')}</h2>
                <div className="text-white/90 flex items-center gap-3 text-xl font-medium">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <FileText className="h-6 w-6" />
                  </div>
                  {t('info.page_description')}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <CanCreate model="info">
                <Button asChild size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 group/btn">
                  <Link href={route('infos.create')} className="flex items-center gap-3">
                    <div className="p-1 bg-white/20 rounded-lg group-hover/btn:scale-110 transition-transform duration-300">
                      <Plus className="h-5 w-5" />
                    </div>
                    {t('info.add_button')}
                  </Link>
                </Button>
              </CanCreate>
            </div>
          </div>
        </div>

        <Card className="shadow-2xl bg-gradient-to-bl from-white to-purple-50/30 border-0 rounded-3xl overflow-hidden">
          <CardHeader className="py-4 bg-gradient-to-l from-purple-500 to-purple-600 text-white cursor-pointer" onClick={() => setIsFiltersOpen(!isFiltersOpen)}>
            <CardTitle className="text-lg font-semibold flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm shadow-lg">
                  <Search className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-bold">{t('info.search_filters')}</div>
                  <div className="text-purple-100 text-xs font-medium">{t('info.find_and_filter')}</div>
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
                  {t('info.reset_filters')}
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
                        placeholder={t('info.search_placeholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-11 pl-20 pr-4 text-base border-purple-200 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 to-white rounded-xl shadow-lg"
                      />
                      <Button type="submit" className="absolute left-1 top-1/2 -translate-y-1/2 h-9 px-4 bg-gradient-to-l from-purple-500 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm">
                        {t('common.search')}
                      </Button>
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400" />
                    </div>
                  </form>
                </div>

                {/* Type Filter */}
                <div>
                  <Select
                    value={selectedType}
                    onValueChange={handleTypeChange}
                  >
                    <SelectTrigger className="h-11 shadow-lg border-purple-200 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 to-white rounded-xl text-sm">
                      <SelectValue placeholder={t('info.filter_by_type')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_all">{t('info.all_types')}</SelectItem>
                      {types.map(type => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Category Filter */}
                <div>
                  <Select
                    value={selectedCategory}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger className="h-11 shadow-lg border-purple-200 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 to-white rounded-xl text-sm">
                      <SelectValue placeholder={t('info.filter_by_category')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_all">{t('info.all_categories')}</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Department Filter */}
                <div>
                  <Select
                    value={selectedDepartment}
                    onValueChange={handleDepartmentChange}
                  >
                    <SelectTrigger className="h-11 shadow-lg border-purple-200 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 to-white rounded-xl text-sm">
                      <SelectValue placeholder={t('info.filter_by_department')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_all">{t('info.all_departments')}</SelectItem>
                      {departments.map(department => (
                        <SelectItem key={department.id} value={department.id.toString()}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort Options */}
                <div>
                  <Select
                    value={filters.sort}
                    onValueChange={handleSortChange}
                  >
                    <SelectTrigger className="h-11 shadow-lg border-purple-200 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 to-white rounded-xl text-sm">
                      <SelectValue placeholder={t('info.sort_by')} />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {t(`info.sort_options.${option.value}`)}
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
                      title={t(`info.sort_${filters.direction === 'asc' ? 'ascending' : 'descending'}`)}
                      className="h-11 w-full shadow-lg border-purple-300 text-purple-700 hover:bg-purple-100 hover:border-purple-400 rounded-xl transition-all duration-300 hover:scale-105 text-sm"
                    >
                      <ArrowUpDown className={`h-4 w-4 mr-2 ${filters.direction === 'asc' ? '' : 'transform rotate-180'}`} />
                      {filters.direction === 'asc' ? t('info.sort_ascending') : t('info.sort_descending')}
                    </Button>
                  </div>

                  {/* Per Page Options */}
                  <div>
                    <Select
                      value={filters.per_page.toString()}
                      onValueChange={handlePerPageChange}
                    >
                      <SelectTrigger className="h-11 shadow-lg border-purple-200 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 to-white rounded-xl text-sm">
                        <SelectValue placeholder={t('info.items_per_page')} />
                      </SelectTrigger>
                      <SelectContent>
                        {perPageOptions.map(option => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            {t('info.per_page_option', { count: option.value.toString() })}
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
                      className="h-11 px-3 shadow-lg border-purple-300 text-purple-700 hover:bg-purple-100 hover:border-purple-400 rounded-xl transition-all duration-300 hover:scale-105 text-sm"
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
          <Card className="shadow-2xl overflow-hidden bg-gradient-to-bl from-white to-purple-50/30 border-0 rounded-3xl">
            <CardHeader className="bg-gradient-to-l from-purple-500 to-purple-600 text-white py-6">
              <CardTitle className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{t('info.table.title')}</div>
                  <div className="text-purple-100 text-sm font-medium">{t('info.table.description')}</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-hidden rounded-b-3xl">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-l from-purple-100 to-purple-200 border-0">
                      <TableHead className="text-purple-800 font-bold text-lg py-6 px-6">{t('info.table.id')}</TableHead>
                      <TableHead className="text-purple-800 font-bold text-lg py-6 px-6">{t('info.table.name')}</TableHead>
                      <TableHead className="text-purple-800 font-bold text-lg py-6 px-6">{t('info.table.type')}</TableHead>
                      <TableHead className="text-purple-800 font-bold text-lg py-6 px-6">{t('info.table.category')}</TableHead>
                      <TableHead className="text-purple-800 font-bold text-lg py-6 px-6">{t('info.table.department')}</TableHead>
                      <TableHead className="text-purple-800 font-bold text-lg py-6 px-6">{t('info.table.created_at')}</TableHead>
                      <TableHead className="text-purple-800 font-bold text-lg py-6 px-6 text-right">{t('info.table.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {infos.data && infos.data.length > 0 ? (
                      infos.data.map((info: InfoRecord) => (
                        <TableRow key={info.id} className="hover:bg-purple-50/50 transition-colors duration-300 border-b border-purple-100">
                          <TableCell className="font-bold text-purple-900 py-6 px-6 text-lg">{info.id}</TableCell>
                          <TableCell className="font-bold text-purple-900 py-6 px-6 text-lg">{info.name}</TableCell>
                          <TableCell className="py-6 px-6">
                            {info.infoType ? (
                              <Badge variant="outline" className="bg-gradient-to-l from-purple-100 to-purple-200 text-purple-800 border-purple-300 px-4 py-2 rounded-xl font-semibold">
                                {info.infoType.name}
                              </Badge>
                            ) : (
                              <span className="text-purple-600 font-medium">-</span>
                            )}
                          </TableCell>
                          <TableCell className="py-6 px-6">
                            {info.infoCategory ? (
                              <Badge variant="outline" className="bg-gradient-to-l from-purple-100 to-purple-200 text-purple-800 border-purple-300 px-4 py-2 rounded-xl font-semibold">
                                {info.infoCategory.name}
                              </Badge>
                            ) : (
                              <span className="text-purple-600 font-medium">-</span>
                            )}
                          </TableCell>
                          <TableCell className="py-6 px-6">
                            {info.department ? (
                              <Badge variant="outline" className="bg-gradient-to-l from-purple-100 to-purple-200 text-purple-800 border-purple-300 px-4 py-2 rounded-xl font-semibold">
                                {info.department.name}
                              </Badge>
                            ) : (
                              <span className="text-purple-600 font-medium">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-purple-800 py-6 px-6 font-medium">
                            {new Date(info.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="py-6 px-6">
                            <div className="flex items-center gap-2 justify-end">
                              <CanView model="info">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  asChild
                                  title={t('info.actions.view')}
                                  className="h-10 w-10 rounded-xl hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-all duration-300 hover:scale-110"
                                >
                                  <Link href={route('infos.show', info.id)}>
                                    <Eye className="h-5 w-5" />
                                  </Link>
                                </Button>
                              </CanView>
                              <CanUpdate model="info">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  asChild
                                  title={t('info.actions.edit')}
                                  className="h-10 w-10 rounded-xl hover:bg-green-100 text-green-600 hover:text-green-700 transition-all duration-300 hover:scale-110"
                                >
                                  <Link href={route('infos.edit', info.id)}>
                                    <Pencil className="h-5 w-5" />
                                  </Link>
                                </Button>
                              </CanUpdate>
                              <CanDelete model="info">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openDeleteDialog(info)}
                                  title={t('info.actions.delete')}
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
                        <TableCell colSpan={7} className="h-32 text-center">
                          <div className="flex flex-col items-center gap-4 text-purple-600">
                            <div className="p-4 bg-purple-100 rounded-full">
                              <AlertTriangle className="h-16 w-16 text-purple-400" />
                            </div>
                            <p className="text-xl font-bold">{t('info.no_records')}</p>
                            <p className="text-purple-500">{t('info.no_records_description')}</p>
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
        {infos && infos.links && infos.links.length > 0 && (
          <div className="mt-8 flex justify-center">
            <div className="bg-gradient-to-l from-purple-50 to-white p-4 rounded-3xl shadow-2xl border border-purple-200">
              <Pagination links={infos.links} />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
