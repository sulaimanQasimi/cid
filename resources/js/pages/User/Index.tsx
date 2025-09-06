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
import { Plus, Search, Trash, Pencil, User as UserIcon, Shield, FileText, AlertTriangle, TrendingUp, ChevronDown, FilterX, ArrowUpDown } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';
import { format } from 'date-fns';
import { useDebounce } from '@/hooks/useDebounce';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
      
      <div className="container px-0 py-6">
        {/* Modern Header with Glassmorphism */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-blue-600 via-indigo-600 to-purple-600 p-8 lg:p-12 text-white shadow-2xl mb-8 group">
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
                <h2 className="text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl tracking-tight">{t('users.page_title')}</h2>
                <div className="text-white/90 flex items-center gap-3 text-xl font-medium">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <FileText className="h-6 w-6" />
                  </div>
                  {t('users.page_description')}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button asChild size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 group/btn">
                <Link href={route('users.create')} className="flex items-center gap-3">
                  <div className="p-1 bg-white/20 rounded-lg group-hover/btn:scale-110 transition-transform duration-300">
                    <Plus className="h-5 w-5" />
                  </div>
                  {t('users.add_user')}
                </Link>
              </Button>
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
                  <div className="text-xl font-bold">{t('users.search_filters')}</div>
                  <div className="text-blue-100 text-xs font-medium">Find and filter user records</div>
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
                        placeholder={t('users.search_placeholder')}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
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
                  <Select value={sort} onValueChange={(value) => setSort(value)}>
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
                      onClick={() => setDirection(direction === 'asc' ? 'desc' : 'asc')}
                      title={t(`users.sort_${direction === 'asc' ? 'descending' : 'ascending'}`)}
                      className="h-11 w-full shadow-lg border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400 rounded-xl transition-all duration-300 hover:scale-105 text-sm"
                    >
                      <ArrowUpDown className={`h-4 w-4 mr-2 ${direction === 'desc' ? 'rotate-180' : ''}`} />
                      {direction === 'asc' ? 'Asc' : 'Desc'}
                    </Button>
                  </div>

                  {/* Per Page Options */}
                  <div>
                    <Select value={perPage} onValueChange={(value) => setPerPage(value)}>
                      <SelectTrigger className="h-11 shadow-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gradient-to-l from-blue-50 to-white rounded-xl text-sm">
                        <SelectValue placeholder="Per Page" />
                      </SelectTrigger>
                      <SelectContent>
                        {perPageOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            {t('users.per_page', { count: String(option.value) })}
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
                  <div className="text-2xl font-bold">{t('users.table.title')}</div>
                  <div className="text-blue-100 text-sm font-medium">User records overview</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-hidden rounded-b-3xl">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-l from-blue-100 to-blue-200 border-0">
                      <TableHead 
                        className="text-blue-800 font-bold text-lg py-6 px-6 cursor-pointer hover:bg-blue-200/50 transition-colors duration-300"
                        onClick={() => handleSort('name')}
                      >
                        {t('users.table.name')}{getSortIndicator('name')}
                      </TableHead>
                      <TableHead 
                        className="text-blue-800 font-bold text-lg py-6 px-6 cursor-pointer hover:bg-blue-200/50 transition-colors duration-300"
                        onClick={() => handleSort('email')}
                      >
                        {t('users.table.email')}{getSortIndicator('email')}
                      </TableHead>
                      <TableHead className="text-blue-800 font-bold text-lg py-6 px-6">
                        {t('users.table.roles')}
                      </TableHead>
                      <TableHead 
                        className="text-blue-800 font-bold text-lg py-6 px-6 cursor-pointer hover:bg-blue-200/50 transition-colors duration-300"
                        onClick={() => handleSort('created_at')}
                      >
                        {t('users.table.created')}{getSortIndicator('created_at')}
                      </TableHead>
                      <TableHead className="text-blue-800 font-bold text-lg py-6 px-6 text-right">{t('common.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.data.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-32 text-center">
                          <div className="flex flex-col items-center gap-4 text-blue-600">
                            <div className="p-4 bg-blue-100 rounded-full">
                              <AlertTriangle className="h-16 w-16 text-blue-400" />
                            </div>
                            <p className="text-xl font-bold">{t('users.no_users')}</p>
                            <p className="text-blue-500">No user records found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.data.map((user) => (
                        <TableRow key={user.id} className="hover:bg-blue-50/50 transition-colors duration-300 border-b border-blue-100">
                          <TableCell className="font-bold text-blue-900 py-6 px-6 text-lg">
                            <div className="flex items-center space-x-2">
                              <UserIcon className="h-5 w-5 text-blue-500" />
                              <span>{user.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-blue-800 py-6 px-6 font-medium">{user.email}</TableCell>
                          <TableCell className="py-6 px-6">
                            <div className="flex flex-wrap gap-1">
                              {user.roles && user.roles.length > 0 ? (
                                user.roles.map(role => (
                                  <Badge key={role.id} variant="outline" className="bg-gradient-to-l from-blue-100 to-blue-200 text-blue-800 border-blue-300 px-4 py-2 rounded-xl font-semibold">
                                    {role.name}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-blue-600 font-medium">{t('users.none')}</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-blue-800 py-6 px-6 font-medium">
                            {format(new Date(user.created_at), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell className="py-6 px-6">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                title={t('users.actions.edit')}
                                className="h-10 w-10 rounded-xl hover:bg-green-100 text-green-600 hover:text-green-700 transition-all duration-300 hover:scale-110"
                              >
                                <Link href={route('users.edit', user.id)}>
                                  <Pencil className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => confirmDelete(user)}
                                title={t('users.actions.delete')}
                                className="h-10 w-10 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-100 transition-all duration-300 hover:scale-110"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pagination */}
        {users.links && users.links.length > 0 && (
          <div className="mt-8 flex justify-center">
            <div className="bg-gradient-to-l from-blue-50 to-white p-4 rounded-3xl shadow-2xl border border-blue-200">
              <Pagination links={users.links} />
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">{t('users.delete_dialog.title')}</AlertDialogTitle>
            <AlertDialogDescription className="mt-2">
              {t('users.delete_confirm', { name: userToDelete?.name || '' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel className="shadow-sm">{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground shadow-sm">
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
