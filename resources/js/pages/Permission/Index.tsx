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
        return <Crown className="h-4 w-4" />;
      case 'admin':
        return <Shield className="h-4 w-4" />;
      default:
        return <UserCheck className="h-4 w-4" />;
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
        {/* Modern Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-purple-600 via-indigo-600 to-blue-600 p-8 lg:p-12 text-white shadow-2xl mb-8 group">
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="absolute top-0 left-0 w-80 h-80 bg-white/10 rounded-full -translate-y-40 -translate-x-40 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 translate-x-32 blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8">
            <div className="flex items-center gap-8">
              <div className="p-6 bg-white/20 backdrop-blur-md rounded-3xl border border-white/30 shadow-2xl group-hover:scale-105 transition-transform duration-300">
                <Settings className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl tracking-tight">
                  {t('permissions.user_permissions_management')}
                </h2>
                <div className="text-white/90 flex items-center gap-3 text-xl font-medium">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Shield className="h-6 w-6" />
                  </div>
                  {t('permissions.management_description')}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-3xl font-bold text-white">{users.data.length}</div>
                <div className="text-white/80 text-sm">{t('permissions.total_users')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {users.data.map((user) => (
            <Card key={user.id} className="shadow-2xl overflow-hidden bg-gradient-to-bl from-white to-blue-50/30 border-0 rounded-3xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
              <CardHeader className="bg-gradient-to-l from-blue-500 to-blue-600 text-white py-6">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-xl font-bold truncate">{user.name}</div>
                      <div className="text-blue-100 text-sm font-medium">{user.email}</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-white/20 border-white/30 text-white">
                    {user.permissions.length} {t('permissions.permissions')}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Roles Section */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Crown className="h-4 w-4" />
                      {t('permissions.roles')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {user.roles.length > 0 ? (
                        user.roles.map((role) => (
                          <Badge key={role.id} variant={getRoleBadgeVariant(role.name)} className="flex items-center gap-1">
                            {getRoleIcon(role.name)}
                            {role.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500 italic">{t('permissions.no_roles')}</span>
                      )}
                    </div>
                  </div>

                  {/* Permissions Count */}
                  <div className="flex items-center justify-between p-3 bg-gradient-to-l from-blue-50 to-white rounded-xl border border-blue-200">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">{t('permissions.direct_permissions')}</span>
                    </div>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                      {user.permissions.length}
                    </Badge>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    <Button asChild className="w-full bg-gradient-to-l from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                      <Link href={route('permissions.edit', user.id)} className="flex items-center justify-center gap-2">
                        <Settings className="h-4 w-4" />
                        {t('permissions.edit_permissions')}
                        <ArrowRight className="h-4 w-4" />
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
          <Card className="shadow-2xl overflow-hidden bg-gradient-to-bl from-white to-blue-50/30 border-0 rounded-3xl">
            <CardContent className="p-12 text-center">
              <div className="p-6 bg-blue-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Users className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{t('permissions.no_users_found')}</h3>
              <p className="text-gray-600 mb-6">{t('permissions.no_users_description')}</p>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {users.data.length > 0 && (
          <div className="mt-8">
            <Pagination links={users.links} />
          </div>
        )}
      </div>
    </AppLayout>
  );
}
