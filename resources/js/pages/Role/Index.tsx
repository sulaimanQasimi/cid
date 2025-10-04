import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Pagination } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash, Shield, Users, Crown, AlertTriangle } from 'lucide-react';
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

interface Permission {
  id: number;
  name: string;
  label: string;
}

interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

interface RoleIndexProps {
  auth: {
    user: any;
  };
  roles: {
    data: Role[];
    links: any[];
    current_page: number;
    last_page: number;
  };
  permissions: Permission[];
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'System Administration',
    href: '#',
  },
  {
    title: 'Role Management',
    href: route('roles.index'),
  },
];

export default function Index({ auth, roles, permissions }: RoleIndexProps) {
  const { t } = useTranslation();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  const confirmDelete = (role: Role) => {
    setRoleToDelete(role);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (roleToDelete) {
      router.delete(route('roles.destroy', roleToDelete.id));
      setIsDeleteDialogOpen(false);
    }
  };

  const getRoleIcon = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case 'superadmin':
        return <Crown className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      case 'admin':
        return <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      default:
        return <Users className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getRoleBadgeVariant = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case 'superadmin':
        return 'default';
      case 'admin':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('roles.page_title')} />

      <div className="container px-0 py-6">
        {/* Professional Header */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm mb-6">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Crown className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{t('roles.page_title')}</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('roles.page_description')}</p>
                </div>
              </div>
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link href={route('roles.create')} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  {t('roles.create_role')}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.data.map((role) => (
            <Card key={role.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    {getRoleIcon(role.name)}
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{role.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {role.permissions.length} {t('roles.permissions')}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {/* Permissions Preview */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('roles.permissions_preview')}</h4>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 3).map((permission) => (
                        <Badge 
                          key={permission.id} 
                          variant="secondary"
                          className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        >
                          {permission.label || permission.name}
                        </Badge>
                      ))}
                      {role.permissions.length > 3 && (
                        <Badge variant="outline" className="text-xs text-gray-600 dark:text-gray-400">
                          +{role.permissions.length - 3} {t('roles.more')}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="flex-1 text-gray-700 dark:bg-blue-900 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <Link href={route('roles.edit', role.id)} className="flex items-center gap-2">
                        <Pencil className="h-4 w-4" />
                        {t('common.edit')}
                      </Link>
                    </Button>
                    {!['admin', 'superadmin'].includes(role.name) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => confirmDelete(role)}
                        className="text-red-600 dark:text-red-400 dark:bg-gray-700 dark:text-red-400 border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {roles.data.length === 0 && (
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                  <AlertTriangle className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('roles.no_roles')}</p>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{t('roles.no_roles_description')}</p>
                </div>
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href={route('roles.create')} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {t('roles.create_first_role')}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {roles.links && roles.links.length > 0 && (
          <div className="mt-6 flex justify-center">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <Pagination links={roles.links} />
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg text-gray-900 dark:text-gray-100">{t('roles.delete_dialog.title')}</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              {t('roles.delete_confirm', { name: roleToDelete?.name || '' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600">{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
