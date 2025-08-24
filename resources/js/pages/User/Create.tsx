import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Shield, FileText, UserPlus, CheckCircle, AlertCircle, User, Mail, Lock, Users } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslation } from '@/lib/i18n/translate';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface Role {
  id: number;
  name: string;
}

interface Props {
  roles: Role[];
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

export default function UserCreate({ roles = [] }: Props) {
  const { t } = useTranslation();
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    roles: [] as number[],
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

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('users.create.title')} />
      
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
                <UserPlus className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl tracking-tight">{t('users.create.title')}</h2>
                <p className="text-white/90 flex items-center gap-3 text-xl font-medium">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <FileText className="h-6 w-6" />
                  </div>
                  {t('users.create.description')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => window.history.back()}
                className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                {t('common.back')}
              </Button>
            </div>
          </div>
        </div>

        <Card className="shadow-2xl bg-gradient-to-bl from-white to-blue-50/30 border-0 rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-l from-blue-500 to-blue-600 text-white py-6">
            <CardTitle className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold">{t('users.create.form_title')}</div>
                <div className="text-blue-100 text-sm font-medium">Fill in the user information below</div>
              </div>
            </CardTitle>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="p-8">
              {/* Personal Information Section */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-900">{t('users.create.personal_info')}</h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                      <span>{t('users.form.name')}</span>
                      <span className="text-red-500 text-xl">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400" />
                      <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        className="h-12 text-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gradient-to-l from-blue-50 to-white rounded-xl shadow-lg pl-10"
                        placeholder={t('users.form.name_placeholder')}
                      />
                    </div>
                    {errors.name && (
                      <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                        <AlertCircle className="h-4 w-4" />
                        <p className="text-sm font-medium">{errors.name}</p>
                      </div>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                      <span>{t('users.form.email')}</span>
                      <span className="text-red-500 text-xl">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400" />
                      <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        className="h-12 text-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gradient-to-l from-blue-50 to-white rounded-xl shadow-lg pl-10"
                        placeholder={t('users.form.email_placeholder')}
                      />
                    </div>
                    {errors.email && (
                      <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                        <AlertCircle className="h-4 w-4" />
                        <p className="text-sm font-medium">{errors.email}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator className="my-8 bg-blue-200" />

              {/* Security Information Section */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <Lock className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-900">{t('users.create.security_info')}</h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Password Field */}
                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                      <span>{t('users.form.password')}</span>
                      <span className="text-red-500 text-xl">*</span>
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400" />
                      <Input
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        required
                        className="h-12 text-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gradient-to-l from-blue-50 to-white rounded-xl shadow-lg pl-10"
                        placeholder={t('users.form.password_placeholder')}
                      />
                    </div>
                    {errors.password && (
                      <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                        <AlertCircle className="h-4 w-4" />
                        <p className="text-sm font-medium">{errors.password}</p>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-3 rounded-xl border border-blue-200">
                      <CheckCircle className="h-4 w-4" />
                      <p className="text-sm font-medium">{t('users.form.password_requirements')}</p>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-3">
                    <Label htmlFor="password_confirmation" className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                      <span>{t('users.form.confirm_password')}</span>
                      <span className="text-red-500 text-xl">*</span>
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400" />
                      <Input
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                        className="h-12 text-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gradient-to-l from-blue-50 to-white rounded-xl shadow-lg pl-10"
                        placeholder={t('users.form.confirm_password_placeholder')}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Roles Section */}
              {roles.length > 0 && (
                <>
                  <Separator className="my-8 bg-blue-200" />
                  
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-blue-100 rounded-xl">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold text-blue-900">{t('users.create.roles_section')}</h3>
                    </div>
                    
                    <div className="bg-gradient-to-l from-blue-50 to-white border-2 border-blue-200 rounded-2xl p-6 shadow-lg">
                      <p className="text-blue-700 mb-4 font-medium">{t('users.create.roles_description')}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {roles.map(role => (
                          <div key={role.id} className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-blue-100 hover:bg-blue-50 transition-all duration-300 hover:scale-105 hover:shadow-md">
                            <Checkbox
                              id={`role-${role.id}`}
                              checked={data.roles.includes(role.id)}
                              onCheckedChange={() => toggleRole(role.id)}
                              className="h-5 w-5 text-blue-600 border-blue-300 rounded-lg"
                            />
                            <Label
                              htmlFor={`role-${role.id}`}
                              className="cursor-pointer font-medium text-blue-900 hover:text-blue-700 transition-colors duration-300 flex-1"
                            >
                              {role.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {errors.roles && (
                        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-200 mt-4">
                          <AlertCircle className="h-4 w-4" />
                          <p className="text-sm font-medium">{errors.roles}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>

            <CardFooter className="bg-gradient-to-l from-blue-50 to-white p-6 border-t border-blue-200">
              <div className="flex justify-end space-x-4 w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                  className="px-8 py-3 text-lg font-semibold border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  {t('common.cancel')}
                </Button>
                <Button 
                  type="submit" 
                  disabled={processing}
                  className="px-8 py-3 text-lg font-semibold bg-gradient-to-l from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? t('common.creating') : t('users.create.button')}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
