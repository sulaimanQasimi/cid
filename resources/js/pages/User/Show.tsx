import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pencil, Trash, Shield, FileText, User, Eye, Calendar, Mail, CheckCircle, AlertTriangle, Clock, Edit3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/lib/i18n/translate';

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

interface Props {
  user: User;
}

export default function UserShow({ user }: Props) {
  const { t } = useTranslation();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('users.breadcrumb.management'),
      href: '#',
    },
    {
      title: t('users.breadcrumb.users'),
      href: route('users.index'),
    },
    {
      title: t('users.show.title'),
      href: route('users.show', user.id),
    },
  ];

  const handleDelete = () => {
    router.delete(route('users.destroy', user.id), {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('users.show.title', { name: user.name })} />
      
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
                <User className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl tracking-tight">{t('users.show.title')}</h2>
                <div className="text-white/90 flex items-center gap-3 text-xl font-medium">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <FileText className="h-6 w-6" />
                  </div>
                  {t('users.show.description', { name: user.name })}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                asChild
                className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                <Link href={route('users.index')}>
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  {t('common.back_to_list')}
                </Link>
              </Button>
              <Button 
                variant="outline" 
                asChild
                className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                <Link href={route('users.edit', user.id)}>
                  <Edit3 className="mr-2 h-5 w-5" />
                  {t('common.edit')}
                </Link>
              </Button>
              <Button
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={user.id === (window as any).auth?.user?.id}
                className="bg-red-500/20 backdrop-blur-md border-red-300/30 text-white hover:bg-red-500/30 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash className="mr-2 h-5 w-5" />
                {t('common.delete')}
              </Button>
            </div>
          </div>
        </div>

        {/* User Information Card */}
        <Card className="shadow-2xl bg-gradient-to-bl from-white to-blue-50/30 border-0 rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-l from-blue-500 to-blue-600 text-white py-6">
            <CardTitle className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold">{t('users.show.information_title')}</div>
                <div className="text-blue-100 text-sm font-medium">Complete user profile details</div>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  {t('users.show.basic_info')}
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-l from-blue-50 to-white p-6 rounded-2xl border border-blue-200 shadow-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-100 rounded-xl">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-blue-900">{t('users.form.name')}</h4>
                    </div>
                    <p className="text-xl font-bold text-blue-800">{user.name}</p>
                  </div>

                  <div className="bg-gradient-to-l from-blue-50 to-white p-6 rounded-2xl border border-blue-200 shadow-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-100 rounded-xl">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-blue-900">{t('users.form.email')}</h4>
                    </div>
                    <p className="text-xl font-bold text-blue-800">{user.email}</p>
                  </div>

                  <div className="bg-gradient-to-l from-blue-50 to-white p-6 rounded-2xl border border-blue-200 shadow-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-100 rounded-xl">
                        <Shield className="h-5 w-5 text-blue-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-blue-900">{t('users.form.roles')}</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {user.roles && user.roles.length > 0 ? (
                        user.roles.map(role => (
                          <Badge key={role.id} variant="outline" className="bg-gradient-to-l from-blue-100 to-blue-200 text-blue-800 border-blue-300 px-4 py-2 rounded-xl font-semibold">
                            {role.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-blue-600 font-medium">{t('users.none')}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  {t('users.show.account_info')}
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-l from-blue-50 to-white p-6 rounded-2xl border border-blue-200 shadow-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-100 rounded-xl">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-blue-900">{t('users.show.email_verified')}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      {user.email_verified_at ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-green-700 font-semibold">{t('users.show.verified')}</span>
                          <span className="text-blue-600 text-sm">
                            {format(new Date(user.email_verified_at), 'MMM d, yyyy, h:mm a')}
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-5 w-5 text-orange-600" />
                          <span className="text-orange-700 font-semibold">{t('users.show.not_verified')}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="bg-gradient-to-l from-blue-50 to-white p-6 rounded-2xl border border-blue-200 shadow-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-100 rounded-xl">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-blue-900">{t('users.show.created_at')}</h4>
                    </div>
                    <p className="text-xl font-bold text-blue-800">
                      {format(new Date(user.created_at), 'MMM d, yyyy, h:mm a')}
                    </p>
                  </div>

                  <div className="bg-gradient-to-l from-blue-50 to-white p-6 rounded-2xl border border-blue-200 shadow-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-100 rounded-xl">
                        <Clock className="h-5 w-5 text-blue-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-blue-900">{t('users.show.last_updated')}</h4>
                    </div>
                    <p className="text-xl font-bold text-blue-800">
                      {format(new Date(user.updated_at), 'MMM d, yyyy, h:mm a')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">{t('users.delete_dialog.title')}</AlertDialogTitle>
            <AlertDialogDescription className="mt-2">
              {t('users.delete_confirm', { name: user.name })}
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
