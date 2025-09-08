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
import Header from '@/components/template/header';

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

        <Header
          title={t('users.show.title')}
          description={t('users.show.description')}
          icon={<User className="h-6 w-6 text-white" />}
          model="user"
          routeName={() => route('users.edit', user.id)}
          theme="blue"
          buttonText={t('common.edit')}
          showBackButton={true}
          backRouteName={() => route('users.index')}
          backButtonText={t('common.back_to_list')}
        />
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
