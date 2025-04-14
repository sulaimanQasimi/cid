import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash, Search, ArrowUpDown, FilterX, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
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
  infos: {
    data?: InfoRecord[];
    links?: PaginationLinks;
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

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Info Management',
    href: '#',
  },
  {
    title: 'Info Records',
    href: route('infos.index'),
  },
];

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
  infos = {
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
  types = [],
  categories = [],
  departments = [],
  filters
}: Props) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState(filters.search);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [infoToDelete, setInfoToDelete] = useState<InfoRecord | null>(null);
  const [selectedType, setSelectedType] = useState<string>(filters.type_id || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(filters.category_id || '');
  const [selectedDepartment, setSelectedDepartment] = useState<string>(filters.department_id || '');

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
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t('info.page_title')}</h2>
            <p className="text-muted-foreground mt-1">{t('info.page_description')}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild size="default" className="shadow-sm">
              <Link href={route('infos.create')}>
                <Plus className="mr-2 h-4 w-4" />
                {t('info.add_button')}
              </Link>
            </Button>
          </div>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="py-4">
            <CardTitle className="text-base font-medium">{t('info.search_filters')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row">
              {/* Search Bar */}
              <div className="flex-1">
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                  <Input
                    placeholder={t('info.search_placeholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                  <Button type="submit" variant="outline" size="sm" className="shadow-sm">
                    <Search className="h-4 w-4" />
                  </Button>
                </form>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2">
                  <Select
                    value={filters.sort}
                    onValueChange={handleSortChange}
                  >
                    <SelectTrigger className="w-[130px]">
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

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleDirectionChange}
                    title={t(`info.sort_${filters.direction === 'asc' ? 'ascending' : 'descending'}`)}
                  >
                    <ArrowUpDown className={`h-4 w-4 ${filters.direction === 'asc' ? '' : 'transform rotate-180'}`} />
                  </Button>
                </div>

                <Select
                  value={filters.per_page.toString()}
                  onValueChange={handlePerPageChange}
                >
                  <SelectTrigger className="w-[130px]">
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

                {/* Reset filters button */}
                {(filters.search || filters.sort !== 'name' || filters.direction !== 'asc' ||
                  filters.per_page !== 10 || filters.type_id || filters.category_id || filters.department_id) && (
                  <Button variant="ghost" size="sm" onClick={resetFilters} className="ml-2">
                    <FilterX className="h-4 w-4 mr-2" />
                    {t('info.reset_filters')}
                  </Button>
                )}
              </div>
            </div>

            {/* Type and Category Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="flex-1">
                <Select
                  value={selectedType}
                  onValueChange={handleTypeChange}
                >
                  <SelectTrigger>
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
              <div className="flex-1">
                <Select
                  value={selectedCategory}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Select
                  value={selectedDepartment}
                  onValueChange={handleDepartmentChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_all">All Departments</SelectItem>
                    {departments.map(department => (
                      <SelectItem key={department.id} value={department.id.toString()}>
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active filters */}
            <div className="flex flex-wrap gap-2 mt-4">
              {filters.search && (
                <Badge variant="secondary" className="px-3 py-1">
                  Search: {filters.search}
                  <button className="ml-2" onClick={() => applyFilters({ search: '' })}>×</button>
                </Badge>
              )}
              {filters.type_id && (
                <Badge variant="secondary" className="px-3 py-1">
                  Type: {types.find(t => t.id.toString() === filters.type_id)?.name || filters.type_id}
                  <button className="ml-2" onClick={() => handleTypeChange('')}>×</button>
                </Badge>
              )}
              {filters.category_id && (
                <Badge variant="secondary" className="px-3 py-1">
                  Category: {categories.find(c => c.id.toString() === filters.category_id)?.name || filters.category_id}
                  <button className="ml-2" onClick={() => handleCategoryChange('')}>×</button>
                </Badge>
              )}
              {filters.department_id && (
                <Badge variant="secondary" className="px-3 py-1">
                  Department: {departments.find(d => d.id.toString() === filters.department_id)?.name || filters.department_id}
                  <button className="ml-2" onClick={() => handleDepartmentChange('')}>×</button>
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {infos.data && infos.data.length > 0 ? (
              infos.data.map((info: InfoRecord) => (
                <TableRow key={info.id}>
                  <TableCell>{info.id}</TableCell>
                  <TableCell className="font-medium">{info.name}</TableCell>
                  <TableCell>{info.infoType?.name || '-'}</TableCell>
                  <TableCell>{info.infoCategory?.name || '-'}</TableCell>
                  <TableCell>{info.department?.name || '-'}</TableCell>
                  <TableCell>{new Date(info.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={route('infos.show', info.id)}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={route('infos.edit', info.id)}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => openDeleteDialog(info)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No info records found. Create your first one!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {infos?.meta && infos.meta.last_page > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing {infos?.meta?.from} to {infos?.meta?.to} of {infos?.meta?.total} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage((infos?.meta?.current_page || 1) - 1)}
                disabled={!infos?.links || !infos.links.prev}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {infos?.meta?.links && infos?.meta?.links.slice(1, -1).map((link, i) => (
                <Button
                  key={i}
                  variant={link.active ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (link.url) {
                      const page = new URL(link.url).searchParams.get('page');
                      page && goToPage(parseInt(page));
                    }
                  }}
                  disabled={!link.url}
                >
                  {link.label}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage((infos?.meta?.current_page || 1) + 1)}
                disabled={!infos?.links || !infos.links.next}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
