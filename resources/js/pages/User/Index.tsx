import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination } from '@/components/pagination';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Search, Trash, Pencil, User as UserIcon } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';
import { format } from 'date-fns';
import { useDebounce } from '@/hooks/useDebounce';
import { Badge } from '@/components/ui/badge';

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  // Update the URL when filters change
  React.useEffect(() => {
    router.get(
      route('users.index'),
      { search: debouncedSearch, per_page: perPage, sort, direction },
      { preserveState: true, replace: true }
    );
  }, [debouncedSearch, perPage, sort, direction]);

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

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('users.page_title')} />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{t('users.page_title')}</h1>
            <Button asChild>
              <Link href={route('users.create')}>
                <Plus className="mr-2 h-4 w-4" />
                {t('users.add_user')}
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-0">
              <div className="flex justify-between items-center">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder={t('users.search_placeholder')}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <div className="flex space-x-2 items-center">
                  <span className="text-sm text-gray-500">{t('users.show')}</span>
                  <select
                    value={perPage}
                    onChange={(e) => setPerPage(e.target.value)}
                    className="border rounded p-1 text-sm"
                  >
                    <option value="5">{t('users.per_page', { count: '5' })}</option>
                    <option value="10">{t('users.per_page', { count: '10' })}</option>
                    <option value="25">{t('users.per_page', { count: '25' })}</option>
                    <option value="50">{t('users.per_page', { count: '50' })}</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      {t('users.table.name')}{getSortIndicator('name')}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort('email')}
                    >
                      {t('users.table.email')}{getSortIndicator('email')}
                    </TableHead>
                    <TableHead>
                      {t('users.table.roles')}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort('created_at')}
                    >
                      {t('users.table.created')}{getSortIndicator('created_at')}
                    </TableHead>
                    <TableHead className="text-right">{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        {t('users.no_users')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.data.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <UserIcon className="h-5 w-5 text-gray-500" />
                            <span>{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {user.roles && user.roles.length > 0 ? (
                              user.roles.map(role => (
                                <Badge key={role.id} variant="secondary" className="text-xs">
                                  {role.name}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-xs text-gray-500">{t('users.none')}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{format(new Date(user.created_at), 'MMM d, yyyy')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                            >
                              <Link href={route('users.edit', user.id)}>
                                <Pencil className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => confirmDelete(user)}
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

              {users.last_page > 1 && (
                <div className="mt-4">
                  <Pagination links={users.links} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('common.confirm')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('users.delete_confirm', { name: userToDelete?.name || '' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">{t('common.delete')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
