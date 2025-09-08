import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash, Eye, BarChart3, FileText, AlertTriangle, TrendingUp } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
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
import Header from '@/components/template/header';
import SearchFilters from '@/components/template/SearchFilters';

interface InfoCategory {
  id: number;
  name: string;
  description: string | null;
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
  categories?: {
    data?: InfoCategory[];
    links?: PaginationLinks[];
    meta?: PaginationMeta;
  };
  filters?: {
    search: string;
    sort: string;
    direction: string;
    per_page: number;
  };
}

const sortOptions = [
  { value: 'name', label: 'Name' },
  { value: 'description', label: 'Description' },
  { value: 'created_at', label: 'Created Date' },
  { value: 'updated_at', label: 'Updated Date' },
];

const perPageOptions = [
  { value: 10, label: '10 per page' },
  { value: 25, label: '25 per page' },
  { value: 50, label: '50 per page' },
  { value: 100, label: '100 per page' },
];

export default function InfoCategoriesIndex({
  categories = { data: [], links: [], meta: undefined },
  filters = { search: '', sort: 'name', direction: 'asc', per_page: 10 }
}: Props) {
  const { canCreate, canView, canUpdate, canDelete, canConfirm } = usePermissions();
  const { t } = useTranslation();
  
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('info.page_title'),
      href: route('info-types.index'),
    },
    {
      title: t('info_categories.page_title'),
      href: '#',
    },
  ];
  const [searchQuery, setSearchQuery] = useState(filters.search);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<InfoCategory | null>(null);

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
    router.get(route('info-categories.index'),
      { ...filters, page },
      { preserveState: true, preserveScroll: true }
    );
  };

  // Apply filters to the URL
  const applyFilters = (newFilters: Partial<Props['filters']>) => {
    router.get(route('info-categories.index'),
      { ...filters, ...newFilters, page: 1 },
      { preserveState: true, preserveScroll: true }
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    router.get(route('info-categories.index'), {
      search: '',
      sort: 'name',
      direction: 'asc',
      per_page: 10,
      page: 1,
    });
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (category: InfoCategory) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const confirmDelete = () => {
    if (categoryToDelete) {
      router.delete(route('info-categories.destroy', categoryToDelete.id), {
        onSuccess: () => {
          setCategoryToDelete(null);
          setIsDeleteDialogOpen(false);
        },
      });
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('info_categories.page_title')} />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('info_categories.delete_dialog.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('info_categories.delete_dialog.description', { name: categoryToDelete?.name || '' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>{t('info_categories.delete_dialog.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              {t('info_categories.delete_dialog.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="container px-0 py-6">
        <SearchFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={handleSearch}
          searchPlaceholder={t('info_categories.search_placeholder')}
          filters={{
            sort: filters.sort,
            direction: filters.direction as 'asc' | 'desc',
            per_page: filters.per_page,
          }}
          onTypeChange={() => {}} // Not used for info categories
          onCategoryChange={() => {}} // Not used for info categories
          onDepartmentChange={() => {}} // Not used for info categories
          onSortChange={handleSortChange}
          onDirectionChange={handleDirectionChange}
          onPerPageChange={handlePerPageChange}
          onResetFilters={resetFilters}
          types={[]} // No types for info categories
          categories={[]} // No categories for info categories
          departments={[]} // No departments for info categories
          sortOptions={sortOptions}
          perPageOptions={perPageOptions}
          title={t('info_categories.search_filters')}
          description={t('info_categories.find_and_filter')}
          className="shadow-2xl bg-gradient-to-bl from-white dark:from-gray-800 to-purple-50/30 dark:to-purple-900/20  overflow-hidden"
        />

        {/* Results Table */}
        <div className="mt-8">
          <Header
            title={t('info_categories.table.title')}
            description={t('info_categories.table.description')}
            icon={<TrendingUp className="h-6 w-6 text-white" />}
            model="info_category"
            routeName="info-categories.create"
            buttonText={t('info_categories.add_button')}
            theme="purple"
            buttonSize="lg"
          />
          <Card className="shadow-2xl overflow-hidden bg-gradient-to-bl from-white dark:from-gray-800 to-purple-50/30 dark:to-purple-900/20 border-0">
            <CardContent className="p-0">
              <div className="overflow-hidden rounded-b-3xl">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-l from-purple-100 dark:from-purple-900 to-purple-200 dark:to-purple-800 border-0">
                      <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('info_categories.table.id')}</TableHead>
                      <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('info_categories.table.name')}</TableHead>
                      <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('info_categories.table.description')}</TableHead>
                      <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('info_categories.table.created_at')}</TableHead>
                      <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6 text-right">{t('info_categories.table.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories?.data && categories.data.length > 0 ? (
                      categories.data.map((category: InfoCategory) => (
                        <TableRow key={category.id} className="hover:bg-purple-50/50 dark:hover:bg-purple-900/30 transition-colors duration-300 border-b border-purple-100 dark:border-purple-800">
                          <TableCell className="font-bold text-purple-900 dark:text-purple-100 py-6 px-6 text-lg">{category.id}</TableCell>
                          <TableCell className="font-bold text-purple-900 dark:text-purple-100 py-6 px-6 text-lg">{category.name}</TableCell>
                          <TableCell className="py-6 px-6">
                            {category.description ? (
                              <span className="text-purple-800 dark:text-purple-200 font-medium">{category.description}</span>
                            ) : (
                              <span className="text-purple-600 dark:text-purple-400 font-medium">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-purple-800 dark:text-purple-200 py-6 px-6 font-medium">
                            {new Date(category.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="py-6 px-6">
                            <div className="flex items-center gap-2 justify-end">
                              <CanView model="info_category">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  asChild
                                  title={t('info_categories.actions.view')}
                                  className="h-10 w-10 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-300 hover:scale-110"
                                >
                                  <Link href={route('info-categories.show', category.id)}>
                                    <Eye className="h-5 w-5" />
                                  </Link>
                                </Button>
                              </CanView>
                              <CanUpdate model="info_category">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  asChild
                                  title={t('info_categories.actions.edit')}
                                  className="h-10 w-10 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-all duration-300 hover:scale-110"
                                >
                                  <Link href={route('info-categories.edit', category.id)}>
                                    <Pencil className="h-5 w-5" />
                                  </Link>
                                </Button>
                              </CanUpdate>
                              <CanDelete model="info_category">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openDeleteDialog(category)}
                                  title={t('info_categories.actions.delete')}
                                  className="h-10 w-10 rounded-xl text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-300 hover:scale-110"
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
                          <div className="flex flex-col items-center gap-4 text-purple-600 dark:text-purple-400">
                            <div className="p-4 bg-purple-100 dark:bg-purple-900/50 rounded-full">
                              <AlertTriangle className="h-16 w-16 text-purple-400 dark:text-purple-500" />
                            </div>
                            <p className="text-xl font-bold">{t('info_categories.no_records')}</p>
                            <p className="text-purple-500 dark:text-purple-400">{t('info_categories.no_records_description')}</p>
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
        {categories?.links && categories.links.length > 0 && (
          <div className="mt-8 flex justify-center">
            <div className="bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 p-4 rounded-3xl shadow-2xl border border-purple-200 dark:border-purple-800">
              <Pagination links={categories.links} />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
