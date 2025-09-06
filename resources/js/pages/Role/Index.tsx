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
        return <Crown className="h-5 w-5 text-yellow-600" />;
      case 'admin':
        return <Shield className="h-5 w-5 text-blue-600" />;
      default:
        return <Users className="h-5 w-5 text-gray-600" />;
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
        {/* Modern Header with Glassmorphism */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-purple-600 via-indigo-600 to-blue-600 p-8 lg:p-12 text-white shadow-2xl mb-8 group">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="absolute top-0 left-0 w-80 h-80 bg-white/10 rounded-full -translate-y-40 -translate-x-40 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 translate-x-32 blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full -translate-x-16 -translate-y-16 blur-xl group-hover:scale-150 transition-transform duration-500"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8">
            <div className="flex items-center gap-8">
              <div className="p-6 bg-white/20 backdrop-blur-md rounded-3xl border border-white/30 shadow-2xl group-hover:scale-105 transition-transform duration-300">
                <Crown className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl tracking-tight">{t('roles.page_title')}</h2>
                <div className="text-white/90 flex items-center gap-3 text-xl font-medium">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Shield className="h-6 w-6" />
                  </div>
                  {t('roles.page_description')}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button asChild size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 group/btn">
                <Link href={route('roles.create')} className="flex items-center gap-3">
                  <div className="p-1 bg-white/20 rounded-lg group-hover/btn:scale-110 transition-transform duration-300">
                    <Plus className="h-5 w-5" />
                  </div>
                  {t('roles.create_role')}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.data.map((role) => (
            <Card key={role.id} className="shadow-2xl overflow-hidden bg-gradient-to-bl from-white to-blue-50/30 border-0 rounded-3xl group hover:shadow-3xl transition-all duration-300 hover:scale-105">
              <CardHeader className="bg-gradient-to-l from-blue-500 to-blue-600 text-white py-6">
                <CardTitle className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
                    {getRoleIcon(role.name)}
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{role.name}</div>
                    <div className="text-blue-100 text-sm font-medium">
                      {role.permissions.length} {t('roles.permissions')}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Permissions Preview */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">{t('roles.permissions_preview')}</h4>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.slice(0, 4).map((permission) => (
                        <Badge 
                          key={permission.id} 
                          variant="outline" 
                          className="bg-gradient-to-l from-blue-100 to-blue-200 text-blue-800 border-blue-300 px-3 py-1 rounded-xl font-semibold text-xs"
                        >
                          {permission.label || permission.name}
                        </Badge>
                      ))}
                      {role.permissions.length > 4 && (
                        <Badge variant="outline" className="bg-gradient-to-l from-gray-100 to-gray-200 text-gray-800 border-gray-300 px-3 py-1 rounded-xl font-semibold text-xs">
                          +{role.permissions.length - 4} {t('roles.more')}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="flex-1 bg-gradient-to-l from-blue-50 to-white border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400 rounded-xl transition-all duration-300 hover:scale-105"
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
                        className="bg-gradient-to-l from-red-50 to-white border-red-300 text-red-700 hover:bg-red-100 hover:border-red-400 rounded-xl transition-all duration-300 hover:scale-105"
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
          <Card className="shadow-2xl overflow-hidden bg-gradient-to-bl from-white to-blue-50/30 border-0 rounded-3xl">
            <CardContent className="p-12 text-center">
              <div className="flex flex-col items-center gap-6 text-blue-600">
                <div className="p-6 bg-blue-100 rounded-full">
                  <AlertTriangle className="h-16 w-16 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{t('roles.no_roles')}</p>
                  <p className="text-blue-500 mt-2">{t('roles.no_roles_description')}</p>
                </div>
                <Button asChild size="lg" className="bg-gradient-to-l from-blue-500 to-blue-600 text-white rounded-2xl px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                  <Link href={route('roles.create')} className="flex items-center gap-3">
                    <Plus className="h-5 w-5" />
                    {t('roles.create_first_role')}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {roles.links && roles.links.length > 0 && (
          <div className="mt-8 flex justify-center">
            <div className="bg-gradient-to-l from-blue-50 to-white p-4 rounded-3xl shadow-2xl border border-blue-200">
              <Pagination links={roles.links} />
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">{t('roles.delete_dialog.title')}</AlertDialogTitle>
            <AlertDialogDescription className="mt-2">
              {t('roles.delete_confirm', { name: roleToDelete?.name || '' })}
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
