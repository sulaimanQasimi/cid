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
import { Crown, Shield, Users, Plus, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';

interface Permission {
  id: number;
  name: string;
  label: string;
}

interface RoleCreateProps {
  auth: {
    user: any;
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
  {
    title: 'Create Role',
    href: route('roles.create'),
  },
];

export default function Create({ auth, permissions }: RoleCreateProps) {
  const { t } = useTranslation();
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    permissions: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('roles.store'));
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
        return <Users className="h-4 w-4" />;
      case 'role':
        return <Crown className="h-4 w-4" />;
      case 'permission':
        return <Shield className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('roles.create_role')} />

      <div className="container px-0 py-6">
        {/* Modern Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-purple-600 via-indigo-600 to-blue-600 p-8 lg:p-12 text-white shadow-2xl mb-8 group">
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="absolute top-0 left-0 w-80 h-80 bg-white/10 rounded-full -translate-y-40 -translate-x-40 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 translate-x-32 blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8">
            <div className="flex items-center gap-8">
              <div className="p-6 bg-white/20 backdrop-blur-md rounded-3xl border border-white/30 shadow-2xl group-hover:scale-105 transition-transform duration-300">
                <Plus className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl tracking-tight">{t('roles.create_role')}</h2>
                <div className="text-white/90 flex items-center gap-3 text-xl font-medium">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Crown className="h-6 w-6" />
                  </div>
                  {t('roles.create_description')}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button asChild variant="outline" size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105">
                <Link href={route('roles.index')} className="flex items-center gap-3">
                  <ArrowLeft className="h-5 w-5" />
                  {t('common.back')}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Role Name Card */}
          <Card className="shadow-2xl overflow-hidden bg-gradient-to-bl from-white to-blue-50/30 border-0 rounded-3xl">
            <CardHeader className="bg-gradient-to-l from-blue-500 to-blue-600 text-white py-6">
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
            <CardContent className="p-8">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-lg font-semibold text-gray-900 mb-3 block">
                    {t('roles.role_name')}
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder={t('roles.role_name_placeholder')}
                    className="w-full h-12 text-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gradient-to-l from-blue-50 to-white rounded-xl shadow-lg"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-2 flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      {errors.name}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Permissions Card */}
          <Card className="shadow-2xl overflow-hidden bg-gradient-to-bl from-white to-blue-50/30 border-0 rounded-3xl">
            <CardHeader className="bg-gradient-to-l from-blue-500 to-blue-600 text-white py-6">
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
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-8">
                {Object.entries(groupedPermissions).map(([model, modelPermissions]) => (
                  <div key={model} className="space-y-4">
                    <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {getModelIcon(model)}
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 capitalize">
                        {model} {t('roles.permissions')}
                      </h4>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                        {modelPermissions.length}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {modelPermissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-3 p-3 bg-gradient-to-l from-blue-50 to-white rounded-xl border border-blue-200 hover:border-blue-300 transition-colors duration-300">
                          <Checkbox
                            id={`permission-${permission.id}`}
                            checked={data.permissions.includes(permission.name)}
                            onCheckedChange={() => togglePermission(permission.name)}
                            className="border-blue-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          />
                          <Label htmlFor={`permission-${permission.id}`} className="font-medium text-gray-900 cursor-pointer flex-1">
                            {permission.label || permission.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {errors.permissions && (
                  <p className="text-sm text-red-600 mt-4 flex items-center gap-2">
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
              disabled={processing}
              size="lg"
              className="bg-gradient-to-l from-blue-500 to-blue-600 text-white rounded-2xl px-12 py-4 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
            >
              {processing ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {t('roles.creating')}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Plus className="h-5 w-5" />
                  {t('roles.create_role')}
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
