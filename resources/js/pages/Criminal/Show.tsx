import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowRight, Pencil, Trash, UserRound, MapPin, FileText, Calendar, Building2, Phone, IdCard, Printer, BarChart3, Eye, Clock, Users, Shield, Home, Gavel, FileCheck, BookText, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n/translate';

interface Criminal {
  id: number;
  photo: string | null;
  number: string | null;
  name: string;
  father_name: string | null;
  grandfather_name: string | null;
  id_card_number: string | null;
  phone_number: string | null;
  original_residence: string | null;
  current_residence: string | null;
  crime_type: string | null;
  arrest_location: string | null;
  arrested_by: string | null;
  arrest_date: string | null;
  referred_to: string | null;
  final_verdict: string | null;
  notes: string | null;
  department_id: number | null;
  created_by: number;
  created_at: string;
  updated_at: string;
  department?: {
    id: number;
    name: string;
    code: string;
  } | null;
  creator?: {
    id: number;
    name: string;
  };
  // Visitor statistics
  visits_count?: number;
  unique_visitors_count?: number;
  today_visits_count?: number;
  this_week_visits_count?: number;
  this_month_visits_count?: number;
  bounce_rate?: number;
  average_time_spent?: number;
}

interface Props {
  criminal: Criminal;
  auth: {
    permissions: string[];
  };
}

export default function CriminalShow({ criminal, auth }: Props) {
  const { t } = useTranslation();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Generate breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('criminal.page_title'),
      href: route('criminals.index'),
    },
    {
      title: criminal.name,
      href: route('criminals.show', criminal.id),
    },
  ];

  // Handle delete
  const handleDelete = () => {
    router.delete(route('criminals.destroy', criminal.id));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('criminal.show.page_title', { name: criminal.name })} />

      <div className="container px-0 py-6">
        {/* Modern Header with Glassmorphism */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-red-600 via-orange-600 to-amber-600 p-8 lg:p-12 text-white shadow-2xl mb-8 group">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="absolute top-0 left-0 w-80 h-80 bg-white/10 rounded-full -translate-y-40 -translate-x-40 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 translate-x-32 blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full -translate-x-16 -translate-y-16 blur-xl group-hover:scale-150 transition-transform duration-500"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8">
            <div className="flex items-center gap-8">
              <div className="p-6 bg-white/20 backdrop-blur-md rounded-3xl border border-white/30 shadow-2xl group-hover:scale-105 transition-transform duration-300">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl tracking-tight">{criminal.name}</h2>
                <p className="text-white/90 flex items-center gap-3 text-xl font-medium">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <FileText className="h-6 w-6" />
                  </div>
                  {criminal.number
                    ? t('criminal.show.id_number', { number: criminal.number })
                    : t('criminal.show.no_id')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Link href={route('criminals.index')} className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 rounded-2xl shadow-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105 group/btn">
                <div className="flex items-center gap-3">
                  <div className="p-1 bg-white/20 rounded-lg group-hover/btn:scale-110 transition-transform duration-300">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                  {t('criminal.show.back_button')}
                </div>
              </Link>
              
              {auth.permissions.includes('criminal.update') && (
                <Button asChild className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 rounded-2xl shadow-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105">
                  <Link href={route('criminals.edit', criminal.id)}>
                    <div className="flex items-center gap-3">
                      <div className="p-1 bg-white/20 rounded-lg">
                        <Pencil className="h-5 w-5" />
                      </div>
                      {t('criminal.show.edit_button')}
                    </div>
                  </Link>
                </Button>
              )}
              
              {auth.permissions.includes('criminal.view') && (
                <Button asChild className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 rounded-2xl shadow-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105">
                  <Link href={route('criminals.print', criminal.id)} target="_blank">
                    <div className="flex items-center gap-3">
                      <div className="p-1 bg-white/20 rounded-lg">
                        <Printer className="h-5 w-5" />
                      </div>
                      {t('criminal.show.print_button')}
                    </div>
                  </Link>
                </Button>
              )}
              
              {auth.permissions.includes('criminal.delete') && (
                <Button
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="bg-red-500/20 backdrop-blur-md border-red-300/30 text-white hover:bg-red-500/30 rounded-2xl shadow-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1 bg-red-500/20 rounded-lg">
                      <Trash className="h-5 w-5" />
                    </div>
                    {t('criminal.show.delete_button')}
                  </div>
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Photo and Basic Details */}
          <Card className="md:col-span-4 border-none shadow-xl overflow-hidden bg-gradient-to-bl from-white to-red-50/30">
            <CardHeader className="bg-gradient-to-l from-red-500 to-red-600 text-white border-b pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 bg-white/20 rounded-lg">
                  <UserRound className="h-5 w-5" />
                </div>
                {t('criminal.show.personal_info.title')}
              </CardTitle>
              <CardDescription className="text-red-100">
                {t('criminal.show.personal_info.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {criminal.photo ? (
                <div className="mb-6 overflow-hidden rounded-2xl border border-red-200 shadow-lg">
                  <img
                    src={`/storage/${criminal.photo}`}
                    alt={criminal.name}
                    className="aspect-square h-auto w-full object-cover"
                  />
                </div>
              ) : (
                <div className="mb-6 flex aspect-square items-center justify-center rounded-2xl border-2 border-dashed border-red-200 bg-gradient-to-bl from-red-50 to-red-100 text-center">
                  <div className="flex flex-col items-center px-4 py-12">
                    <div className="p-4 bg-gradient-to-br from-red-100 to-red-200 rounded-full mb-3">
                      <UserRound className="h-16 w-16 text-red-600" />
                    </div>
                    <p className="text-sm font-medium text-red-700">{t('criminal.show.no_photo')}</p>
                  </div>
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-medium text-red-600 mb-3 flex items-center gap-2" dir="rtl">
                    {t('criminal.show.personal_details')}
                    <UserRound className="h-4 w-4" />
                  </h3>
                  <div className="rounded-xl border border-red-100 bg-gradient-to-l from-red-50 to-white p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-red-700 font-medium flex items-center gap-2" dir="rtl">
                        {t('criminal.show.full_name')}:
                        <Users className="h-4 w-4" />
                      </span>
                      <span className="text-sm text-red-900 font-semibold">{criminal.name}</span>
                    </div>

                    {criminal.father_name && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-red-700 font-medium flex items-center gap-2" dir="rtl">
                          {t('criminal.show.father_name')}:
                          <Users className="h-4 w-4" />
                        </span>
                        <span className="text-sm text-red-900">{criminal.father_name}</span>
                      </div>
                    )}

                    {criminal.grandfather_name && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-red-700 font-medium flex items-center gap-2" dir="rtl">
                          {t('criminal.show.grandfather_name')}:
                          <Users className="h-4 w-4" />
                        </span>
                        <span className="text-sm text-red-900">{criminal.grandfather_name}</span>
                      </div>
                    )}

                    {criminal.id_card_number && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-red-700 font-medium flex items-center gap-2" dir="rtl">
                          {t('criminal.show.id_card')}:
                          <IdCard className="h-4 w-4" />
                        </span>
                        <span className="text-sm text-red-900">{criminal.id_card_number}</span>
                      </div>
                    )}

                    {criminal.phone_number && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-red-700 font-medium flex items-center gap-2" dir="rtl">
                          {t('criminal.show.phone')}:
                          <Phone className="h-4 w-4" />
                        </span>
                        <span className="text-sm text-red-900">{criminal.phone_number}</span>
                      </div>
                    )}

                    {criminal.department && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-red-700 font-medium flex items-center gap-2" dir="rtl">
                          {t('criminal.show.department')}:
                          <Building2 className="h-4 w-4" />
                        </span>
                        <Badge variant="outline" className="bg-gradient-to-l from-red-100 to-red-200 text-red-800 border-red-300 px-3 py-1 text-xs font-medium">
                          {criminal.department.name}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                {(criminal.original_residence || criminal.current_residence) && (
                                  <div>
                  <h3 className="text-sm font-medium text-red-600 mb-3 flex items-center gap-2" dir="rtl">
                    {t('criminal.show.residence_info')}
                    <MapPin className="h-4 w-4" />
                  </h3>
                  <div className="rounded-xl border border-red-100 bg-gradient-to-l from-red-50 to-white p-4 space-y-3">
                    {criminal.original_residence && (
                      <div>
                        <span className="text-sm text-red-700 font-medium flex items-center gap-2" dir="rtl">
                          {t('criminal.show.original_residence')}:
                          <Home className="h-4 w-4" />
                        </span>
                        <p className="mt-2 text-sm text-red-900">{criminal.original_residence}</p>
                      </div>
                    )}

                    {criminal.original_residence && criminal.current_residence && (
                      <Separator className="my-3" />
                    )}

                    {criminal.current_residence && (
                      <div>
                        <span className="text-sm text-red-700 font-medium flex items-center gap-2" dir="rtl">
                          {t('criminal.show.current_residence')}:
                          <MapPin className="h-4 w-4" />
                        </span>
                        <p className="mt-2 text-sm text-red-900">{criminal.current_residence}</p>
                      </div>
                    )}
                  </div>
                </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Crime Details */}
          <div className="md:col-span-8 space-y-8">
            <Card className="border-none shadow-xl overflow-hidden bg-gradient-to-bl from-white to-orange-50/30">
              <CardHeader className="bg-gradient-to-l from-orange-500 to-orange-600 text-white border-b pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <FileText className="h-5 w-5" />
                  </div>
                  {t('criminal.show.crime_info.title')}
                </CardTitle>
                <CardDescription className="text-orange-100">
                  {t('criminal.show.crime_info.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {criminal.crime_type && (
                    <div>
                      <h3 className="text-sm font-medium text-orange-600 mb-3 flex items-center gap-2" dir="rtl">
                        {t('criminal.show.crime_type')}
                        <Gavel className="h-4 w-4" />
                      </h3>
                      <div className="rounded-xl border border-orange-100 bg-gradient-to-l from-orange-50 to-white p-4">
                        <p className="text-sm text-orange-900">{criminal.crime_type}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {criminal.arrest_location && (
                      <div>
                        <h3 className="text-sm font-medium text-orange-600 mb-3 flex items-center gap-2" dir="rtl">
                          {t('criminal.show.arrest_location')}
                          <MapPin className="h-4 w-4" />
                        </h3>
                        <div className="rounded-xl border border-orange-100 bg-gradient-to-l from-orange-50 to-white p-4">
                          <p className="text-sm text-orange-900">{criminal.arrest_location}</p>
                        </div>
                      </div>
                    )}

                    {criminal.arrest_date && (
                      <div>
                        <h3 className="text-sm font-medium text-orange-600 mb-3 flex items-center gap-2" dir="rtl">
                          {t('criminal.show.arrest_date')}
                          <Calendar className="h-4 w-4" />
                        </h3>
                        <div className="rounded-xl border border-orange-100 bg-gradient-to-l from-orange-50 to-white p-4">
                          <p className="text-sm text-orange-900">{format(new Date(criminal.arrest_date), 'PPP')}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {criminal.arrested_by && (
                      <div>
                        <h3 className="text-sm font-medium text-orange-600 mb-3 flex items-center gap-2" dir="rtl">
                          {t('criminal.show.arrested_by')}
                          <Shield className="h-4 w-4" />
                        </h3>
                        <div className="rounded-xl border border-orange-100 bg-gradient-to-l from-orange-50 to-white p-4">
                          <p className="text-sm text-orange-900">{criminal.arrested_by}</p>
                        </div>
                      </div>
                    )}

                    {criminal.referred_to && (
                      <div>
                        <h3 className="text-sm font-medium text-orange-600 mb-3 flex items-center gap-2" dir="rtl">
                          {t('criminal.show.referred_to')}
                          <Building2 className="h-4 w-4" />
                        </h3>
                        <div className="rounded-xl border border-orange-100 bg-gradient-to-l from-orange-50 to-white p-4">
                          <p className="text-sm text-orange-900">{criminal.referred_to}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {criminal.final_verdict && (
                    <div>
                      <h3 className="text-sm font-medium text-orange-600 mb-3 flex items-center gap-2" dir="rtl">
                        {t('criminal.show.final_verdict')}
                        <FileCheck className="h-4 w-4" />
                      </h3>
                      <div className="rounded-xl border border-orange-100 bg-gradient-to-l from-orange-50 to-white p-4">
                        <p className="text-sm text-orange-900">{criminal.final_verdict}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            {criminal.notes && (
              <Card className="border-none shadow-xl overflow-hidden bg-gradient-to-bl from-white to-orange-50/30">
                <CardHeader className="bg-gradient-to-l from-orange-500 to-orange-600 text-white border-b pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <BookText className="h-5 w-5" />
                    </div>
                    {t('criminal.show.notes')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="rounded-xl border border-orange-100 bg-gradient-to-l from-orange-50 to-white p-4">
                    <p className="text-sm text-orange-900 whitespace-pre-wrap" dir="rtl">{criminal.notes}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* System Info */}
            <Card className="border-none shadow-xl overflow-hidden bg-gradient-to-bl from-white to-orange-50/30">
              <CardHeader className="bg-gradient-to-l from-orange-500 to-orange-600 text-white border-b pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Clock className="h-5 w-5" />
                  </div>
                  {t('criminal.show.system_info.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {criminal.creator && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-orange-700 font-medium" dir="rtl">{t('criminal.show.system_info.created_by')}:</span>
                      <span className="text-sm font-semibold text-orange-900">{criminal.creator.name}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-orange-700 font-medium" dir="rtl">{t('criminal.show.system_info.created_date')}:</span>
                    <span className="text-sm font-semibold text-orange-900">
                      {format(new Date(criminal.created_at), 'PPP')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-orange-700 font-medium" dir="rtl">{t('criminal.show.system_info.updated_date')}:</span>
                    <span className="text-sm font-semibold text-orange-900">
                      {format(new Date(criminal.updated_at), 'PPP')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">{t('criminal.delete_dialog.title')}</AlertDialogTitle>
            <AlertDialogDescription className="mt-2">
              {t('criminal.delete_dialog.description', { name: criminal.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel className="shadow-sm">{t('criminal.delete_dialog.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground shadow-sm">
              {t('criminal.delete_dialog.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
