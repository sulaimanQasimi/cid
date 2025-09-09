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
import Header from '@/components/template/header';
import SearchFilters from '@/components/template/SearchFilters';
import { formatPersianDateOnly } from '@/lib/utils/date';

interface InfoType {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  infos_count?: number;
  info_stats_count?: number;
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
  infoTypes?: {
    data?: InfoType[];
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
  { value: 'infos_count', label: 'Infos Count' },
  { value: 'info_stats_count', label: 'Stats Count' },
];

const perPageOptions = [
  { value: 10, label: '10 per page' },
  { value: 25, label: '25 per page' },
  { value: 50, label: '50 per page' },
  { value: 100, label: '100 per page' },
];

export default function InfoTypesIndex({
  infoTypes = { data: [], links: [], meta: undefined },
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
      title: t('info_types.page_title'),
      href: '#',
    },
  ];
  const [searchQuery, setSearchQuery] = useState(filters.search);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [infoTypeToDelete, setInfoTypeToDelete] = useState<InfoType | null>(null);

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
    router.get(route('info-types.index'),
      { ...filters, page },
      { preserveState: true, preserveScroll: true, replace: true }
    );
  };

  // Apply filters to the URL
  const applyFilters = (newFilters: Partial<Props['filters']>) => {
    router.get(route('info-types.index'),
      { ...filters, ...newFilters, page: 1 },
      { preserveState: true, preserveScroll: true, replace: true }
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    router.get(route('info-types.index'), {
      search: '',
      sort: 'name',
      direction: 'asc',
      per_page: 10,
      page: 1,
    }, { replace: true });
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (infoType: InfoType) => {
    setInfoTypeToDelete(infoType);
    setIsDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const confirmDelete = () => {
    if (infoTypeToDelete) {
      router.delete(route('info-types.destroy', infoTypeToDelete.id), {
        onSuccess: () => {
          setInfoTypeToDelete(null);
          setIsDeleteDialogOpen(false);
        },
      });
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('info_types.page_title')} />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('info_types.delete_dialog.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('info_types.delete_dialog.description', { name: infoTypeToDelete?.name || '' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>{t('info_types.delete_dialog.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              {t('info_types.delete_dialog.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="container px-0 py-6">
        <Header
          title={t('info_types.page_title')}
          description={t('info_types.page_description')}
          icon={<FileText className="h-6 w-6 text-white" />}
          model="info_type"
          routeName="info-types.create"
          buttonText={t('info_types.add_button')}
          theme="purple"
          buttonSize="lg"
        />

        <SearchFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={handleSearch}
          searchPlaceholder={t('info_types.search_placeholder')}
          filters={{
            sort: filters.sort,
            direction: filters.direction as 'asc' | 'desc',
            per_page: filters.per_page,
          }}
          onTypeChange={() => {}} // Not used for info types
          onCategoryChange={() => {}} // Not used for info types
          onDepartmentChange={() => {}} // Not used for info types
          onSortChange={handleSortChange}
          onDirectionChange={handleDirectionChange}
          onPerPageChange={handlePerPageChange}
          onResetFilters={resetFilters}
          types={[]} // No types for info types
          categories={[]} // No categories for info types
          departments={[]} // No departments for info types
          sortOptions={sortOptions}
          perPageOptions={perPageOptions}
          title={t('info_types.search_filters')}
          description={t('info_types.find_and_filter')}
          className="shadow-2xl bg-gradient-to-bl from-white dark:from-gray-800 to-purple-50/30 dark:to-purple-900/20 border-0 overflow-hidden"
        />

                {/* Results Table */}
        <div className="mt-8">
          <Header
            title={t('info_types.table.title')}
            description={t('info_types.table.description')}
            icon={<TrendingUp className="h-6 w-6 text-white" />}
            model="info_type"
            routeName="info-types.create"
            buttonText={t('info_types.add_button')}
            theme="purple"
          />
          <Card className="shadow-2xl overflow-hidden bg-gradient-to-bl from-white dark:from-gray-800 to-purple-50/30 dark:to-purple-900/20 border-0 rounded-3xl">
            <CardContent className="p-0">
              <div className="overflow-hidden rounded-b-3xl">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-l from-purple-100 dark:from-purple-900 to-purple-200 dark:to-purple-800 border-0">
                      <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('info_types.table.id')}</TableHead>
                      <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('info_types.table.name')}</TableHead>
                      <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('info_types.table.description')}</TableHead>
                      <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('info_types.table.infos_count')}</TableHead>
                      <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('info_types.table.stats_count')}</TableHead>
                      <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('info_types.table.created_at')}</TableHead>
                      <TableHead className="text-purple-800 dark:text-purple-200 font-bold text-lg py-6 px-6">{t('info_types.table.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {infoTypes?.data && infoTypes.data.length > 0 ? (
                      infoTypes.data.map((infoType: InfoType) => (
                        <TableRow key={infoType.id} className="hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-colors duration-300 border-b border-purple-100 dark:border-purple-800">
                          <TableCell className="font-bold text-purple-900 dark:text-purple-100 py-6 px-6 text-lg">{infoType.id}</TableCell>
                          <TableCell className="font-bold text-purple-900 dark:text-purple-100 py-6 px-6 text-lg">{infoType.name}</TableCell>
                          <TableCell className="py-6 px-6">
                            {infoType.description ? (
                              <span className="text-purple-800 dark:text-purple-200 font-medium">{infoType.description}</span>
                            ) : (
                              <span className="text-purple-600 dark:text-purple-400 font-medium">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-purple-800 dark:text-purple-200 py-6 px-6">
                            <Badge variant="outline" className="bg-gradient-to-l from-purple-100 dark:from-purple-800 to-purple-200 dark:to-purple-700 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-600 px-4 py-2 rounded-xl font-semibold">
                              {infoType.infos_count || 0} {t('info_types.info_records')}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-purple-800 dark:text-purple-200 py-6 px-6">
                            <Badge variant="outline" className="bg-gradient-to-l from-purple-100 dark:from-purple-800 to-purple-200 dark:to-purple-700 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-600 px-4 py-2 rounded-xl font-semibold">
                              {infoType.info_stats_count || 0} {t('info_types.stats_records')}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-purple-800 dark:text-purple-200 py-6 px-6 font-medium">
                            {infoType.created_at ? (
                              formatPersianDateOnly(infoType.created_at)
                            ) : (
                              <span className="text-purple-600 dark:text-purple-400">{t('info_types.na')}</span>
                            )}
                          </TableCell>
                          <TableCell className="py-6 px-6">
                            <div className="flex items-center gap-2">
                              <CanView model="info_type">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  asChild
                                  title={t('info_types.actions.view')}
                                  className="h-10 w-10 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-800 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-300 hover:scale-110"
                                >
                                  <Link href={route('info-types.show', infoType.id)}>
                                    <Eye className="h-5 w-5" />
                                  </Link>
                                </Button>
                              </CanView>
                              <CanUpdate model="info_type">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  asChild
                                  title={t('info_types.actions.manage_stats')}
                                  className="h-10 w-10 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-800 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-all duration-300 hover:scale-110"
                                >
                                  <Link href={route('info-types.stats', infoType.id)}>
                                    <BarChart3 className="h-5 w-5" />
                                  </Link>
                                </Button>
                              </CanUpdate>
                              <CanUpdate model="info_type">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  asChild
                                  title={t('info_types.actions.edit')}
                                  className="h-10 w-10 rounded-xl hover:bg-green-100 dark:hover:bg-green-800 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-all duration-300 hover:scale-110"
                                >
                                  <Link href={route('info-types.edit', infoType.id)}>
                                    <Pencil className="h-5 w-5" />
                                  </Link>
                                </Button>
                              </CanUpdate>
                              <CanDelete model="info_type">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openDeleteDialog(infoType)}
                                  title={t('info_types.actions.delete')}
                                  className="h-10 w-10 rounded-xl text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-800 transition-all duration-300 hover:scale-110"
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
                          <div className="flex flex-col items-center gap-4 text-purple-600 dark:text-purple-400">
                            <div className="p-4 bg-purple-100 dark:bg-purple-800 rounded-full">
                              <AlertTriangle className="h-16 w-16 text-purple-400 dark:text-purple-300" />
                            </div>
                            <p className="text-xl font-bold">{t('info_types.no_records')}</p>
                            <p className="text-purple-500 dark:text-purple-400">No info type records found</p>
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
        {infoTypes?.links && infoTypes.links.length > 0 && (
          <div className="mt-8 flex justify-center">
            <div className="bg-gradient-to-l from-purple-50 dark:from-purple-900/20 to-white dark:to-gray-800 p-4 rounded-3xl shadow-2xl border border-purple-200 dark:border-purple-700">
              <Pagination links={infoTypes.links} />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}