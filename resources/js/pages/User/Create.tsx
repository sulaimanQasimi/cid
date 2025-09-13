import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Shield, FileText, UserPlus, CheckCircle, AlertCircle, User, Mail, Lock, Users, Key, Building2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslation } from '@/lib/i18n/translate';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/template/header';
import FooterButtons from '@/components/template/FooterButtons';

interface Role {
  id: number;
  name: string;
}

interface Permission {
  id: number;
  name: string;
  label: string;
}

interface GroupedPermissions {
  [key: string]: Permission[];
}

interface Department {
  id: number;
  name: string;
  code: string;
}

interface Props {
  roles: Role[];
  groupedPermissions: GroupedPermissions;
  departments: Department[];
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
  {
    title: 'Create',
    href: route('users.create'),
  },
];

export default function UserCreate({ roles = [], groupedPermissions = {}, departments = [] }: Props) {
  const { t } = useTranslation();
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    department_id: null as number | null,
    roles: [] as number[],
    permissions: [] as number[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('users.store'));
  };

  const toggleRole = (roleId: number) => {
    const currentRoles = [...data.roles];
    const index = currentRoles.indexOf(roleId);

    if (index === -1) {
      // Add role
      currentRoles.push(roleId);
    } else {
      // Remove role
      currentRoles.splice(index, 1);
    }

    setData('roles', currentRoles);
  };

  const togglePermission = (permissionId: number) => {
    const currentPermissions = [...data.permissions];
    const index = currentPermissions.indexOf(permissionId);

    if (index === -1) {
      // Add permission
      currentPermissions.push(permissionId);
    } else {
      // Remove permission
      currentPermissions.splice(index, 1);
    }

    setData('permissions', currentPermissions);
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
    };
    return modelNames[model] || model;
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('users.create.title')} />
      
      <div className="container px-0 py-6">
        {/* Modern Header with Glassmorphism */}
        <Header
          title={t('users.create.title')}
          description={t('users.create.description')}
          icon={<User className="h-6 w-6 text-white" />}
          model="user"
          routeName={() => route('users.create')}
          theme="blue"
          buttonText={t('common.create')}
          showBackButton={true}
          backRouteName={() => route('users.index')}
          backButtonText={t('common.back_to_list')}
        showButton={false}
        />

        <Card className="shadow-2xl bg-gradient-to-bl from-white to-blue-50/30 dark:from-gray-800 dark:to-gray-900 border-0 rounded-3xl overflow-hidden">
          <form onSubmit={handleSubmit}>
            <CardContent className="p-8 bg-white dark:bg-gray-800">
              {/* Personal Information Section */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 ">
                    <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100">{t('users.create.personal_info')}</h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-lg font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                      <span>{t('users.form.name')}</span>
                      <span className="text-red-500 dark:text-red-400 text-xl">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400 dark:text-blue-500" />
                      <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        className="h-12 text-lg border-blue-200 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 bg-gradient-to-l from-blue-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl shadow-lg pl-10 text-gray-900 dark:text-gray-100"
                        placeholder={t('users.form.name_placeholder')}
                      />
                    </div>
                    {errors.name && (
                      <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-200 dark:border-red-800">
                        <AlertCircle className="h-4 w-4" />
                        <p className="text-sm font-medium">{errors.name}</p>
                      </div>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-lg font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                      <span>{t('users.form.email')}</span>
                      <span className="text-red-500 dark:text-red-400 text-xl">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400 dark:text-blue-500" />
                      <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        className="h-12 text-lg border-blue-200 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 bg-gradient-to-l from-blue-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl shadow-lg pl-10 text-gray-900 dark:text-gray-100"
                        placeholder={t('users.form.email_placeholder')}
                      />
                    </div>
                    {errors.email && (
                      <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-200 dark:border-red-800">
                        <AlertCircle className="h-4 w-4" />
                        <p className="text-sm font-medium">{errors.email}</p>
                      </div>
                    )}
                  </div>

                  {/* Department Field */}
                  <div className="space-y-3">
                    <Label htmlFor="department_id" className="text-lg font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                      <span>{t('users.form.department')}</span>
                    </Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400 dark:text-blue-500" />
                      <Select
                        value={data.department_id?.toString() || ''}
                        onValueChange={(value) => setData('department_id', value ? parseInt(value) : null)}
                      >
                        <SelectTrigger className="h-12 text-lg border-blue-200 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 bg-gradient-to-l from-blue-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl shadow-lg pl-10 text-gray-900 dark:text-gray-100">
                          <SelectValue placeholder={t('users.form.select_department')} />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((department) => (
                            <SelectItem key={department.id} value={department.id.toString()}>
                              {department.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {errors.department_id && (
                      <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3  border border-red-200">
                        <AlertCircle className="h-4 w-4" />
                        <p className="text-sm font-medium">{errors.department_id}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator className="my-8 bg-blue-200 dark:bg-blue-700" />

              {/* Security Information Section */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100">{t('users.create.security_info')}</h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Password Field */}
                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-lg font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                      <span>{t('users.form.password')}</span>
                      <span className="text-red-500 dark:text-red-400 text-xl">*</span>
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400 dark:text-blue-500" />
                      <Input
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        required
                        className="h-12 text-lg border-blue-200 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 bg-gradient-to-l from-blue-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl shadow-lg pl-10 text-gray-900 dark:text-gray-100"
                        placeholder={t('users.form.password_placeholder')}
                      />
                    </div>
                    {errors.password && (
                      <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-200 dark:border-red-800">
                        <AlertCircle className="h-4 w-4" />
                        <p className="text-sm font-medium">{errors.password}</p>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-200 dark:border-blue-800">
                      <CheckCircle className="h-4 w-4" />
                      <p className="text-sm font-medium">{t('users.form.password_requirements')}</p>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-3">
                    <Label htmlFor="password_confirmation" className="text-lg font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                      <span>{t('users.form.confirm_password')}</span>
                      <span className="text-red-500 dark:text-red-400 text-xl">*</span>
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400 dark:text-blue-500" />
                      <Input
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                        className="h-12 text-lg border-blue-200 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 bg-gradient-to-l from-blue-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl shadow-lg pl-10 text-gray-900 dark:text-gray-100"
                        placeholder={t('users.form.confirm_password_placeholder')}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Roles Section */}
              {roles.length > 0 && (
                <>
                  <Separator className="my-8 bg-blue-200 dark:bg-blue-700" />
                  
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                        <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100">{t('users.create.roles_section')}</h3>
                    </div>
                    
                    <div className="bg-gradient-to-l from-blue-50 to-white dark:from-gray-700 dark:to-gray-800 border-2 border-blue-200 dark:border-blue-700 rounded-2xl p-6 shadow-lg">
                      <p className="text-blue-700 dark:text-blue-300 mb-4 font-medium">{t('users.create.roles_description')}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {roles.map(role => (
                          <div key={role.id} className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-blue-100 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-300 hover:scale-105 hover:shadow-md">
                            <Checkbox
                              id={`role-${role.id}`}
                              checked={data.roles.includes(role.id)}
                              onCheckedChange={() => toggleRole(role.id)}
                              className="h-5 w-5 text-blue-600 border-blue-300 rounded-lg"
                            />
                            <Label
                              htmlFor={`role-${role.id}`}
                              className="cursor-pointer font-medium text-blue-900 dark:text-blue-100 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-300 flex-1"
                            >
                              {role.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {errors.roles && (
                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-200 dark:border-red-800 mt-4">
                          <AlertCircle className="h-4 w-4" />
                          <p className="text-sm font-medium">{errors.roles}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Permissions Section */}
              {Object.keys(groupedPermissions).length > 0 && (
                <>
                  <Separator className="my-8 bg-blue-200 dark:bg-blue-700" />
                  
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                        <Key className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100">{t('users.create.permissions_section')}</h3>
                    </div>
                    
                    <div className="bg-gradient-to-l from-blue-50 to-white dark:from-gray-700 dark:to-gray-800 border-2 border-blue-200 dark:border-blue-700 rounded-2xl p-6 shadow-lg">
                      <p className="text-blue-700 dark:text-blue-300 mb-6 font-medium">{t('users.create.permissions_description')}</p>
                      
                      <div className="space-y-4">
                        {Object.entries(groupedPermissions).map(([model, permissions]) => (
                          <Collapsible key={model} className="border border-blue-200 dark:border-blue-700 rounded-xl overflow-hidden">
                            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gradient-to-l from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900 hover:from-blue-200 hover:to-blue-300 dark:hover:from-blue-700 dark:hover:to-blue-800 transition-all duration-300">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-600 rounded-lg">
                                  <Shield className="h-4 w-4 text-white" />
                                </div>
                                <h4 className="text-lg font-bold text-blue-900 dark:text-blue-100">{getModelDisplayName(model)}</h4>
                                <Badge variant="outline" className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-600">
                                  {permissions.length} permissions
                                </Badge>
                              </div>
                              <ChevronDown className="h-5 w-5 text-blue-700 dark:text-blue-300 transition-transform duration-300" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="p-4 bg-white dark:bg-gray-800">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {permissions.map(permission => (
                                  <div key={permission.id} className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-gray-700 rounded-lg border border-blue-100 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300">
                                    <Checkbox
                                      id={`permission-${permission.id}`}
                                      checked={data.permissions.includes(permission.id)}
                                      onCheckedChange={() => togglePermission(permission.id)}
                                      className="h-4 w-4 text-blue-600 border-blue-300 rounded"
                                    />
                                    <Label
                                      htmlFor={`permission-${permission.id}`}
                                      className="cursor-pointer text-sm font-medium text-blue-900 dark:text-blue-100 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-300 flex-1"
                                      title={permission.name}
                                    >
                                      {permission.label}
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
                          <AlertCircle className="h-4 w-4" />
                          <p className="text-sm font-medium">{errors.permissions}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>

            <FooterButtons
              onCancel={() => window.history.back()}
              onSubmit={() => {
                const form = document.querySelector('form') as HTMLFormElement;
                if (form) {
                  form.requestSubmit();
                }
              }}
              processing={processing}
              cancelText={t('common.cancel')}
              submitText={t('users.create.button')}
              savingText={t('common.creating')}
            />
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
