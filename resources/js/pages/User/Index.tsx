import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination } from '@/components/pagination';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Search, Trash, Pencil, User as UserIcon, Shield, FileText, AlertTriangle, TrendingUp, ChevronDown, FilterX, ArrowUpDown, Eye, BarChart3 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';
import { format } from 'date-fns';
import { formatPersianDate } from '@/lib/utils/date';
import { useDebounce } from '@/hooks/useDebounce';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/template/header';
import SearchFilters from '@/components/template/SearchFilters';
import { CanView, CanUpdate, CanDelete } from '@/components/ui/permission-guard';

interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  department?: {
    id: number;
    name: string;
    code: string;
  } | null;
  roles: Role[];
}

interface Filters {
  search: string;
  sort: string;
  direction: string;
  per_page: number;
}

interface UsersPaginatedData {
  current_page: number;
  data: User[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: { url: string | null; label: string; active: boolean }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}


interface Props {
  users: UsersPaginatedData;
  filters: Filters;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'User Management',
    href: '#',
  },
  {
    title: 'Users',
    href: route('users.index'),
  },
];

export default function UserIndex({ users, filters }: Props) {
  const { t } = useTranslation();
  const [search, setSearch] = useState(filters.search);
  const [perPage, setPerPage] = useState(filters.per_page.toString());
  const [sort, setSort] = useState(filters.sort);
  const [direction, setDirection] = useState(filters.direction);
  const [currentPage, setCurrentPage] = useState(users.current_page);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  // Update current page when users data changes (e.g., from pagination)
  React.useEffect(() => {
    setCurrentPage(users.current_page);
  }, [users.current_page]);

  // Update the URL when filters change
  React.useEffect(() => {
    router.get(
      route('users.index'),
      { search: debouncedSearch, per_page: perPage, sort, direction, page: currentPage },
      { preserveState: true, replace: true }
    );
  }, [debouncedSearch, perPage, sort, direction, currentPage]);

  const handleSort = (column: string) => {
    if (sort === column) {
      setDirection(direction === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(column);
      setDirection('asc');
    }
  };

  const getSortIndicator = (column: string) => {
    if (sort !== column) return null;
    return direction === 'asc' ? ' ↑' : ' ↓';
  };

  const confirmDelete = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (userToDelete) {
      router.delete(route('users.destroy', userToDelete.id));
      setIsDeleteDialogOpen(false);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setPerPage('10');
    setSort('created_at');
    setDirection('desc');
    setCurrentPage(1);
    router.get(route('users.index'), {
      search: '',
      per_page: 10,
      sort: 'created_at',
      direction: 'desc',
      page: 1,
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to page 1 when searching
    router.get(
      route('users.index'),
      { search, per_page: perPage, sort, direction, page: 1 },
      { preserveState: true, replace: true }
    );
  };

  const sortOptions = [
    { value: 'name', label: 'users.sort_options.name' },
    { value: 'email', label: 'users.sort_options.email' },
    { value: 'created_at', label: 'users.sort_options.created_at' },
  ];

  const perPageOptions = [
    { value: 5, label: '5 per page' },
    { value: 10, label: '10 per page' },
    { value: 25, label: '25 per page' },
    { value: 50, label: '50 per page' },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('users.page_title')} />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('users.delete_dialog.title')}</AlertDialogTitle>
            <AlertDialogDescription>{t('users.delete_dialog.description', { name: userToDelete?.name || '' })}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>{t('users.delete_dialog.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              {t('users.delete_dialog.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="container px-0 py-6">
        {/* Modern Header with Glassmorphism */}
        <Header
          title={t('users.page_title')}
          description={t('users.page_description')}
          icon={<Shield className="h-8 w-8 text-white" />}
          model="user"
          routeName="users.create"
          buttonText={t('users.add_user')}
          theme="blue"
        />
        <SearchFilters
          title={t('users.search_filters')}
          description={t('users.table.description')}
          searchQuery={search}
          onSearchChange={setSearch}
          onSearchSubmit={handleSearch}
          filters={{
            sort: filters.sort,
            direction: filters.direction as 'asc' | 'desc',
            per_page: filters.per_page,
          }}
          onTypeChange={() => { }}
          onCategoryChange={() => { }}
          onDepartmentChange={() => { }}
          onSortChange={handleSort}
          onDirectionChange={() => setDirection(direction === 'asc' ? 'desc' : 'asc')}
          onPerPageChange={setPerPage}
          onResetFilters={resetFilters}
          types={[]}
          categories={[]}
          departments={[]}
          sortOptions={sortOptions}
          perPageOptions={perPageOptions}
        />

        {/* Results Table */}
        <div className="mt-8">          
          <Card className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
                    <TableHead className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">{t('users.table.id')}</TableHead>
                    <TableHead className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">{t('users.table.name')}</TableHead>
                    <TableHead className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">{t('users.table.email')}</TableHead>
                    <TableHead className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">{t('users.table.department')}</TableHead>
                    <TableHead className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">{t('users.table.roles')}</TableHead>
                    <TableHead className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">{t('users.table.created')}</TableHead>
                    <TableHead className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-gray-100">
                      {t('users.table.actions')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.data && users.data.length > 0 ? (
                    users.data.map((user) => (
                      <TableRow
                        key={user.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/30 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800"
                      >
                        <TableCell className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{user.id}</TableCell>
                        <TableCell className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                          <div className="flex items-center space-x-2">
                            <UserIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <span>{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-gray-900 dark:text-gray-100">{user.email}</TableCell>
                        <TableCell className="px-6 py-4">
                          {user.department ? (
                            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700">
                              {user.department.name}
                            </Badge>
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {user.roles && user.roles.length > 0 ? (
                              user.roles.map(role => (
                                <Badge key={role.id} variant="secondary" className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600">
                                  {role.name}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-gray-500 dark:text-gray-400">-</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-gray-500 dark:text-gray-400">
                          {formatPersianDate(user.created_at)}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <CanView model="user">
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                title={t('users.actions.view')}
                                className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                              >
                                <Link href={route('users.show', user.id)}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                            </CanView>
                            <CanUpdate model="user">
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                title={t('users.actions.edit')}
                                className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                              >
                                <Link href={route('users.edit', user.id)}>
                                  <Pencil className="h-4 w-4" />
                                </Link>
                              </Button>
                            </CanUpdate>
                            <CanDelete model="user">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => confirmDelete(user)}
                                title={t('users.actions.delete')}
                                className="h-8 w-8 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </CanDelete>
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                              title={t('users.analytics.view_analytics')}
                              className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                            >
                              <Link href={`/analytics/User/${user.id}`}>
                                <BarChart3 className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center bg-white dark:bg-gray-800">
                        <div className="flex flex-col items-center gap-4 text-gray-500 dark:text-gray-400">
                          <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-4">
                            <AlertTriangle className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                          </div>
                          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('users.no_users')}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{t('users.no_users_description')}</p>
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
        {users && users.links && users.links.length > 0 && (
          <div className="mt-6 flex justify-center">
            <Pagination links={users.links} />
          </div>
        )}
      </div>
    </AppLayout>
  );
}
