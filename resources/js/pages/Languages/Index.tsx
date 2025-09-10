import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Header from '@/components/template/header';
import SearchFilters from '@/components/template/SearchFilters';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash, Search, ArrowUpDown, FilterX, Eye, BarChart3, Shield, Users, Globe, Calendar, FileText, AlertTriangle, TrendingUp, ChevronDown } from 'lucide-react';
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

interface Language {
  id: number;
  code: string;
  name: string;
  direction: 'ltr' | 'rtl';
  active: boolean;
  default: boolean;
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
  languages: {
    data?: Language[];
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
  { value: 'direction', label: 'Direction' },
  { value: 'active', label: 'Active' },
  { value: 'created_at', label: 'Created Date' },
  { value: 'updated_at', label: 'Updated Date' },
];

const perPageOptions = [
  { value: 10, label: '10 per page' },
  { value: 25, label: '25 per page' },
  { value: 50, label: '50 per page' },
  { value: 100, label: '100 per page' },
];

export default function LanguagesIndex({
  languages,
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
      title: t('languages.page_title'),
      href: route('languages.index'),
    },
  ];
  const [searchQuery, setSearchQuery] = useState(filters.search);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [languageToDelete, setLanguageToDelete] = useState<Language | null>(null);

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

  // Handle type filter change (not used for languages)
  const handleTypeChange = (value: string) => {
    // Not applicable for languages
  };

  // Handle category filter change (not used for languages)
  const handleCategoryChange = (value: string) => {
    // Not applicable for languages
  };

  // Handle department filter change (not used for languages)
  const handleDepartmentChange = (value: string) => {
    // Not applicable for languages
  };

  // Apply filters to the URL
  const applyFilters = (newFilters: Partial<Props['filters']>) => {
    router.get(route('languages.index'),
      { ...filters, ...newFilters, page: 1 },
      { preserveState: true, preserveScroll: true }
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    router.get(route('languages.index'), {
      search: '',
      sort: 'created_at',
      direction: 'desc',
      per_page: 10,
      page: 1,
    });
  };

  const openDeleteDialog = (language: Language) => {
    setLanguageToDelete(language);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (languageToDelete) {
      router.delete(route('languages.destroy', languageToDelete.id), {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setLanguageToDelete(null);
        },
      });
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('languages.page_title')} />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('languages.delete_dialog.title')}</AlertDialogTitle>
            <AlertDialogDescription>{t('languages.delete_dialog.description', { name: languageToDelete?.name || '' })}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>{t('languages.delete_dialog.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              {t('languages.delete_dialog.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="container px-0 py-6">
        {/* Header Component */}
        <Header
          title={t('languages.page_title')}
          description={t('languages.page_description')}
          icon={<Globe className="h-6 w-6 text-white" />}
          model="language"
          routeName="languages.create"
          buttonText={t('languages.add_button')}
          theme="green"
        />

        <SearchFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={handleSearch}
          searchPlaceholder={t('languages.search_placeholder')}
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
            label: t(`languages.sort_options.${option.value}`)
          }))}
          perPageOptions={perPageOptions.map(option => ({
            value: option.value,
            label: option.value.toString()
          }))}
          title={t('languages.search_filters')}
          description={t('languages.table.description')}
        />

        {/* Results Table */}
        <div className="mt-8">
          <Header
            title={t('languages.table.title')}
            description={t('languages.table.description')}
            icon={<TrendingUp className="h-6 w-6 text-white" />}
            model="language"
            routeName="languages.create"
            buttonText={t('languages.add_button')}
            theme="green"
          />
          <Card className="shadow-2xl overflow-hidden bg-gradient-to-bl from-white dark:from-gray-800 to-green-50/30 dark:to-green-900/20 border-0 rounded-3xl">
            <CardContent className="p-0">
              <div className="overflow-hidden rounded-b-3xl">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-l from-green-100 dark:from-green-900 to-green-200 dark:to-green-800 border-0">
                      <TableHead className="text-green-800 dark:text-green-200 font-bold text-lg py-6 px-6">{t('languages.table.name')}</TableHead>
                      <TableHead className="text-green-800 dark:text-green-200 font-bold text-lg py-6 px-6">{t('languages.table.code')}</TableHead>
                      <TableHead className="text-green-800 dark:text-green-200 font-bold text-lg py-6 px-6">{t('languages.table.direction')}</TableHead>
                      <TableHead className="text-green-800 dark:text-green-200 font-bold text-lg py-6 px-6">{t('languages.table.status')}</TableHead>
                      <TableHead className="text-green-800 dark:text-green-200 font-bold text-lg py-6 px-6">{t('languages.table.created_at')}</TableHead>
                      <TableHead className="text-green-800 dark:text-green-200 font-bold text-lg py-6 px-6">{t('languages.table.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {languages.data && languages.data.length > 0 ? (
                      languages.data.map((language) => (
                        <TableRow key={language.id} className="hover:bg-green-50/50 dark:hover:bg-green-900/20 transition-colors duration-300 border-b border-green-100 dark:border-green-800">
                          <TableCell className="font-bold text-green-900 dark:text-green-100 py-6 px-6 text-lg">{language.name}</TableCell>
                          <TableCell className="text-green-800 dark:text-green-200 py-6 px-6">
                            <Badge variant="outline" className="bg-gradient-to-l from-green-100 dark:from-green-800 to-green-200 dark:to-green-700 text-green-800 dark:text-green-200 border-green-300 dark:border-green-600 px-4 py-2 rounded-xl font-semibold">
                              {language.code}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-green-800 dark:text-green-200 py-6 px-6">
                            <Badge variant="outline" className={`px-4 py-2 rounded-xl font-semibold ${
                              language.direction === 'rtl' 
                                ? 'bg-gradient-to-l from-orange-100 dark:from-orange-800 to-orange-200 dark:to-orange-700 text-orange-800 dark:text-orange-200 border-orange-300 dark:border-orange-600'
                                : 'bg-gradient-to-l from-blue-100 dark:from-blue-800 to-blue-200 dark:to-blue-700 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-600'
                            }`}>
                              {language.direction === 'rtl' ? t('languages.right_to_left') : t('languages.left_to_right')}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-green-800 dark:text-green-200 py-6 px-6">
                            <div className="flex flex-col gap-2">
                              <Badge variant="outline" className={`px-4 py-2 rounded-xl font-semibold ${
                                language.active 
                                  ? 'bg-gradient-to-l from-green-100 dark:from-green-800 to-green-200 dark:to-green-700 text-green-800 dark:text-green-200 border-green-300 dark:border-green-600'
                                  : 'bg-gradient-to-l from-gray-100 dark:from-gray-800 to-gray-200 dark:to-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600'
                              }`}>
                                {language.active ? t('common.yes') : t('common.no')}
                              </Badge>
                              {language.default && (
                                <Badge variant="outline" className="bg-gradient-to-l from-purple-100 dark:from-purple-800 to-purple-200 dark:to-purple-700 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-600 px-4 py-2 rounded-xl font-semibold">
                                  {t('languages.default')}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-green-800 dark:text-green-200 py-6 px-6 font-medium">
                            {language.created_at ? (
                              format(new Date(language.created_at), 'MMM d, yyyy')
                            ) : (
                              <span className="text-green-600 dark:text-green-400">{t('languages.na')}</span>
                            )}
                          </TableCell>
                          <TableCell className="py-6 px-6">
                            <div className="flex items-center gap-2">
                              <CanView model="language">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  asChild
                                  title={t('languages.actions.view')}
                                  className="h-10 w-10 rounded-xl hover:bg-green-100 dark:hover:bg-green-800 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-all duration-300 hover:scale-110"
                                >
                                  <Link href={route('translations.index', { language: language.code })}>
                                    <Eye className="h-5 w-5" />
                                  </Link>
                                </Button>
                              </CanView>
                              <CanUpdate model="language">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  asChild
                                  title={t('languages.actions.edit')}
                                  className="h-10 w-10 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-300 hover:scale-110"
                                >
                                  <Link href={route('languages.edit', language.id)}>
                                    <Pencil className="h-5 w-5" />
                                  </Link>
                                </Button>
                              </CanUpdate>
                              {!language.default && (
                                <CanDelete model="language">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => openDeleteDialog(language)}
                                    title={t('languages.actions.delete')}
                                    className="h-10 w-10 rounded-xl text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-800 transition-all duration-300 hover:scale-110"
                                  >
                                    <Trash className="h-5 w-5" />
                                  </Button>
                                </CanDelete>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-32 text-center">
                          <div className="flex flex-col items-center gap-4 text-green-600 dark:text-green-400">
                            <div className="p-4 bg-green-100 dark:bg-green-800 rounded-full">
                              <AlertTriangle className="h-16 w-16 text-green-400 dark:text-green-300" />
                            </div>
                            <p className="text-xl font-bold">{t('languages.no_records')}</p>
                            <p className="text-green-500 dark:text-green-400">No language records found</p>
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
        {languages.links && languages.links.length > 0 && (
          <div className="mt-8 flex justify-center">
            <div className="bg-gradient-to-l from-green-50 dark:from-green-900/20 to-white dark:to-gray-800 p-4 rounded-3xl shadow-2xl border border-green-200 dark:border-green-700">
              <Pagination links={languages.links} />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
