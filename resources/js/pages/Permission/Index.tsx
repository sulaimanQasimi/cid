import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Pagination } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Crown, UserCheck, Settings, Plus, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';

interface User {
  id: number;
  name: string;
  email: string;
  roles: {
    id: number;
    name: string;
  }[];
  permissions: {
    id: number;
    name: string;
    label: string;
  }[];
}

interface Permission {
  id: number;
  name: string;
  label: string;
}

interface Role {
  id: number;
  name: string;
}

interface PermissionIndexProps {
  auth: {
    user: any;
  };
  users: {
    data: User[];
    links: any[];
    current_page: number;
    last_page: number;
  };
  roles: Role[];
  permissions: Permission[];
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'System Administration',
    href: '#',
  },
  {
    title: 'Permission Management',
    href: route('permissions.index'),
  },
];

export default function Index({ auth, users, roles, permissions }: PermissionIndexProps) {
  const { t } = useTranslation();

  const getRoleIcon = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case 'superadmin':
        return <Crown className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />;
      case 'admin':
        return <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      default:
        return <UserCheck className="h-4 w-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getRoleBadgeVariant = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case 'superadmin':
        return 'destructive';
      case 'admin':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('permissions.user_permissions_management')} />

      <div className="container px-0 py-6">
        {/* Professional Header */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm mb-6">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Settings className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{t('permissions.user_permissions_management')}</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('permissions.management_description')}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{users.data.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t('permissions.total_users')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {users.data.map((user) => (
            <Card key={user.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <Users className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">{user.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{user.email}</div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    {user.permissions.length} {t('permissions.permissions')}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {/* Roles Section */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <Crown className="h-4 w-4" />
                      {t('permissions.roles')}
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {user.roles.length > 0 ? (
                        user.roles.map((role) => (
                          <Badge key={role.id} variant={getRoleBadgeVariant(role.name)} className="text-xs flex items-center gap-1">
                            {getRoleIcon(role.name)}
                            {role.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500 dark:text-gray-400 italic">{t('permissions.no_roles')}</span>
                      )}
                    </div>
                  </div>

                  {/* Permissions Count */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('permissions.direct_permissions')}</span>
                    </div>
                    <Badge variant="outline" className="text-xs text-gray-600 dark:text-gray-400">
                      {user.permissions.length}
                    </Badge>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      <Link href={route('permissions.edit', user.id)} className="flex items-center justify-center gap-2">
                        <Settings className="h-4 w-4" />
                        {t('permissions.edit_permissions')}
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {users.data.length === 0 && (
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                  <Users className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('permissions.no_users_found')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{t('permissions.no_users_description')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {users.data.length > 0 && (
          <div className="mt-6 flex justify-center">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <Pagination links={users.links} />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
