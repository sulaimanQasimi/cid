import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Shield, Users, Pencil, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';
import Header from '@/components/template/header';

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

interface RoleEditProps {
  auth: {
    user: any;
  };
  role: Role;
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
  {
    title: 'Edit Role',
    href: '#',
  },
];

export default function Edit({ auth, role, permissions }: RoleEditProps) {
  const { t } = useTranslation();
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(role.permissions.map(permission => permission.name));
  const { data, setData, put, processing, errors } = useForm({
    name: role.name,
    permissions: role.permissions.map(permission => permission.name),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('roles.update', role.id));
  };

  const togglePermission = (permissionName: string) => {
    const updatedPermissions = data.permissions.includes(permissionName)
      ? data.permissions.filter(permission => permission !== permissionName)
      : [...data.permissions, permissionName];

    setData('permissions', updatedPermissions);
    setSelectedPermissions(updatedPermissions);
  };

  const selectAllPermissions = () => {
    const allPermissionNames = permissions.map(p => p.name);
    setData('permissions', allPermissionNames);
    setSelectedPermissions(allPermissionNames);
  };

  const clearAllPermissions = () => {
    setData('permissions', []);
    setSelectedPermissions([]);
  };

  // Group permissions by model with better parsing
  const groupedPermissions: Record<string, Permission[]> = {};
  permissions.forEach(permission => {
    // Parse permission name (format: action.model)
    const parts = permission.name.split('.');
    if (parts.length === 2) {
      const [action, model] = parts;
      const groupKey = model;
      if (!groupedPermissions[groupKey]) {
        groupedPermissions[groupKey] = [];
      }
      groupedPermissions[groupKey].push(permission);
    } else {
      // Fallback for other formats (like hyphen-separated)
      const parts = permission.name.split('_');
      if (parts.length >= 2) {
        const model = parts[parts.length - 1]; // Last part is usually the model
        if (!groupedPermissions[model]) {
          groupedPermissions[model] = [];
        }
        groupedPermissions[model].push(permission);
      } else {
        // Final fallback
        const groupKey = 'other';
        if (!groupedPermissions[groupKey]) {
          groupedPermissions[groupKey] = [];
        }
        groupedPermissions[groupKey].push(permission);
      }
    }
  });

  const getModelIcon = (modelName: string) => {
    switch (modelName.toLowerCase()) {
      case 'user':
        return <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      case 'role':
        return <Crown className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />;
      case 'permission':
        return <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      default:
        return <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
    }
  };

  const isSystemRole = ['admin', 'superadmin'].includes(role.name);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('roles.edit_role', { name: role.name })} />

      <div className="container px-0 py-6">
        {/* Header Component */}
        <Header
          title={t('roles.edit_role', { name: role.name })}
          description={t('roles.edit_description')}
          icon={<Pencil className="h-6 w-6 text-white" />}
          model="role"
          routeName={() => route('roles.edit', role.id)}
          theme="blue"
          buttonText={t('common.edit')}
          showBackButton={true}
          backRouteName={() => route('roles.index')}
          backButtonText={t('common.back')}
          showButton={false}
        />

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Role Name Card */}
          <Card className="shadow-2xl overflow-hidden bg-gradient-to-bl from-white to-blue-50/30 dark:from-gray-800 dark:to-gray-900 border-0 rounded-3xl">
            <CardHeader className="bg-gradient-to-l from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white py-6">
              <CardTitle className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
                  <Crown className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{t('roles.role_details')}</div>
                  <div className="text-blue-100 text-sm font-medium">{t('roles.role_details_description')}</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 bg-white dark:bg-gray-800">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 block">
                    {t('roles.role_name')}
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder={t('roles.role_name_placeholder')}
                    className="w-full h-12 text-lg border-blue-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 bg-gradient-to-l from-blue-50 to-white dark:from-gray-700 dark:to-gray-800 text-gray-900 dark:text-gray-100 rounded-xl shadow-lg"
                    disabled={isSystemRole}
                  />
                  {isSystemRole && (
                    <p className="text-sm text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      {t('roles.system_role_protected', { name: role.name })}
                    </p>
                  )}
                  {errors.name && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-2 flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      {errors.name}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Permissions Card */}
          <Card className="shadow-2xl overflow-hidden bg-gradient-to-bl from-white to-blue-50/30 dark:from-gray-800 dark:to-gray-900 border-0 rounded-3xl">
            <CardHeader className="bg-gradient-to-l from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white py-6">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{t('roles.permissions')}</div>
                    <div className="text-blue-100 text-sm font-medium">
                      {selectedPermissions.length} {t('roles.permissions_selected')}
                    </div>
                  </div>
                </div>
                {!isSystemRole && (
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={selectAllPermissions}
                      className="bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-xl"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {t('roles.select_all')}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearAllPermissions}
                      className="bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-xl"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      {t('roles.clear_all')}
                    </Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 bg-white dark:bg-gray-800">
              <div className="space-y-8">
                {Object.entries(groupedPermissions).map(([model, modelPermissions]) => (
                  <div key={model} className="space-y-4">
                    <div className="flex items-center gap-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        {getModelIcon(model)}
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 capitalize">
                        {model} {t('roles.permissions')}
                      </h4>
                      <Badge variant="outline" className="bg-blue-100 dark:bg-gray-600 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-gray-500">
                        {modelPermissions.length}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {modelPermissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-3 p-3 bg-gradient-to-l from-blue-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl border border-blue-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-gray-500 transition-colors duration-300">
                          <Checkbox
                            id={`permission-${permission.id}`}
                            checked={data.permissions.includes(permission.name)}
                            onCheckedChange={() => togglePermission(permission.name)}
                            className="border-blue-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                            disabled={isSystemRole}
                          />
                          <Label htmlFor={`permission-${permission.id}`} className="font-medium text-gray-900 dark:text-gray-100 cursor-pointer flex-1">
                            {permission.label || permission.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {isSystemRole && (
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                    <p className="text-sm text-amber-800 dark:text-amber-300 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      {t('roles.system_role_permissions_info', { name: role.name })}
                    </p>
                  </div>
                )}

                {errors.permissions && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-4 flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    {errors.permissions}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={processing || isSystemRole}
              size="lg"
              className="bg-gradient-to-l from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white rounded-2xl px-12 py-4 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
            >
              {processing ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {t('roles.saving')}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Pencil className="h-5 w-5" />
                  {t('roles.save_changes')}
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
