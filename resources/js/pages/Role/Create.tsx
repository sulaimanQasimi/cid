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
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Crown, Shield, Users, Plus, ArrowLeft, CheckCircle, XCircle, Key, ChevronDown } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';
import Header from '@/components/template/header';
import FooterButtons from '@/components/template/FooterButtons';

interface Permission {
  id: number;
  name: string;
  label: string;
}

interface GroupedPermissions {
  [key: string]: Permission[];
}

interface RoleCreateProps {
  auth: {
    user: any;
  };
  permissions: Permission[];
  groupedPermissions: GroupedPermissions;
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

export default function Create({ auth, permissions, groupedPermissions = {} }: RoleCreateProps) {
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

  const getModelDisplayName = (model: string) => {
    const modelNames: { [key: string]: string } = {
      'criminal': 'Criminals',
      'department': 'Departments',
      'district': 'Districts',
      'incident': 'Incidents',
      'incident_category': 'Incident Categories',
      'incident_report': 'Incident Reports',
      'info': 'Information',
      'info_category': 'Info Categories',
      'info_type': 'Info Types',
      'language': 'Languages',
      'meeting': 'Meetings',
      'meeting_message': 'Meeting Messages',
      'meeting_session': 'Meeting Sessions',
      'province': 'Provinces',
      'report': 'Reports',
      'report_stat': 'Report Statistics',
      'stat_category': 'Statistics Categories',
      'stat_category_item': 'Statistics Items',
      'translation': 'Translations',
      'user': 'Users',
      'role': 'Roles',
      'permission': 'Permissions',
    };
    return modelNames[model] || model;
  };

  // Sort groups by model display name
  const sortedGroupedPermissions = Object.entries(groupedPermissions).sort(([modelA], [modelB]) => {
    const displayNameA = getModelDisplayName(modelA).toLowerCase();
    const displayNameB = getModelDisplayName(modelB).toLowerCase();
    return displayNameA.localeCompare(displayNameB);
  });

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('roles.create_role')} />

      <div className="container px-0 py-6">
        {/* Header Component */}
        <Header
          title={t('roles.create_role')}
          description={t('roles.create_description')}
          icon={<Plus className="h-6 w-6 text-white" />}
          model="role"
          routeName={() => route('roles.create')}
          theme="blue"
          buttonText={t('common.create')}
          showBackButton={true}
          backRouteName={() => route('roles.index')}
          backButtonText={t('common.back')}
          showButton={false}
        />

        <form onSubmit={handleSubmit}>
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
                  />
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

          <Separator className="my-8 bg-blue-200 dark:bg-gray-600" />

          {/* Permissions Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Key className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100">{t('roles.permissions')}</h3>
              <div className="flex gap-2 ml-auto">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={selectAllPermissions}
                  className="bg-blue-50 dark:bg-gray-700 border-blue-200 dark:border-gray-600 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-gray-600 rounded-xl"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {t('roles.select_all')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearAllPermissions}
                  className="bg-blue-50 dark:bg-gray-700 border-blue-200 dark:border-gray-600 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-gray-600 rounded-xl"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  {t('roles.clear_all')}
                </Button>
              </div>
            </div>
            
            <div className="bg-gradient-to-l from-blue-50 to-white dark:from-gray-700 dark:to-gray-800 border-2 border-blue-200 dark:border-gray-600 rounded-2xl p-6 shadow-lg">
              <p className="text-blue-700 dark:text-blue-300 mb-6 font-medium">
                {selectedPermissions.length} {t('roles.permissions_selected')}
              </p>
              
              <div className="space-y-4">
                {sortedGroupedPermissions.map(([model, modelPermissions]) => (
                  <Collapsible key={model} className="border border-blue-200 dark:border-gray-600 rounded-xl overflow-hidden">
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gradient-to-l from-blue-100 to-blue-200 dark:from-gray-700 dark:to-gray-600 hover:from-blue-200 hover:to-blue-300 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600 rounded-lg">
                          <Shield className="h-4 w-4 text-white" />
                        </div>
                        <h4 className="text-lg font-bold text-blue-900 dark:text-blue-100">{getModelDisplayName(model)}</h4>
                        <Badge variant="outline" className="bg-blue-100 dark:bg-gray-600 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-gray-500">
                          {modelPermissions.length} permissions
                        </Badge>
                      </div>
                      <ChevronDown className="h-5 w-5 text-blue-700 dark:text-blue-300 transition-transform duration-300" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-4 bg-white dark:bg-gray-800">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {modelPermissions.map((permission: Permission) => (
                          <div key={permission.id} className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-gray-700 rounded-lg border border-blue-100 dark:border-gray-600 hover:bg-blue-100 dark:hover:bg-gray-600 transition-all duration-300">
                            <Checkbox
                              id={`permission-${permission.id}`}
                              checked={data.permissions.includes(permission.name)}
                              onCheckedChange={() => togglePermission(permission.name)}
                              className="h-4 w-4 text-blue-600 border-blue-300 rounded"
                            />
                            <Label
                              htmlFor={`permission-${permission.id}`}
                              className="cursor-pointer text-sm font-medium text-blue-900 dark:text-blue-100 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-300 flex-1"
                              title={permission.name}
                            >
                              {permission.label || permission.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
              
              {errors.permissions && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-200 dark:border-red-800 mt-4">
                  <XCircle className="h-4 w-4" />
                  <p className="text-sm font-medium">{errors.permissions}</p>
                </div>
              )}
            </div>
          </div>

          <FooterButtons
            onCancel={() => window.history.back()}
            onSubmit={() => handleSubmit({} as React.FormEvent)}
            processing={processing}
            cancelText={t('common.cancel')}
            submitText={t('roles.create_role')}
            savingText={t('roles.creating')}
          />
        </form>
      </div>
    </AppLayout>
  );
}
