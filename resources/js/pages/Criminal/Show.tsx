import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pencil, Trash, UserRound, MapPin, FileText, Calendar, Building, Phone, CreditCard, Printer } from 'lucide-react';
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
}

interface Props {
  criminal: Criminal;
}

export default function CriminalShow({ criminal }: Props) {
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
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild className="rounded-full shadow-sm">
              <Link href={route('criminals.index')}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{criminal.name}</h2>
              <p className="text-sm text-neutral-500">
                {criminal.number
                  ? t('criminal.show.id_number', { number: criminal.number })
                  : t('criminal.show.no_id')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" asChild className="rounded-full shadow-sm">
              <Link href={route('criminals.edit', criminal.id)}>
                <Pencil className="mr-2 h-4 w-4" />
                {t('criminal.show.edit_button')}
              </Link>
            </Button>
            <Button variant="outline" asChild className="rounded-full shadow-sm">
              <Link href={route('criminals.print', criminal.id)} target="_blank">
                <Printer className="mr-2 h-4 w-4" />
                {t('criminal.show.print_button')}
              </Link>
            </Button>
            <Button
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="rounded-full shadow-sm"
            >
              <Trash className="mr-2 h-4 w-4" />
              {t('criminal.show.delete_button')}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Photo and Basic Details */}
          <Card className="md:col-span-4 border-none shadow-md overflow-hidden">
            <CardHeader className="bg-neutral-50 dark:bg-neutral-900 border-b pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserRound className="h-5 w-5 text-neutral-500" />
                {t('criminal.show.personal_info.title')}
              </CardTitle>
              <CardDescription>
                {t('criminal.show.personal_info.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {criminal.photo ? (
                <div className="mb-6 overflow-hidden rounded-xl border border-neutral-200 shadow-sm">
                  <img
                    src={`/storage/${criminal.photo}`}
                    alt={criminal.name}
                    className="aspect-square h-auto w-full object-cover"
                  />
                </div>
              ) : (
                <div className="mb-6 flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 text-center">
                  <div className="flex flex-col items-center px-4 py-12">
                    <UserRound className="mb-3 h-16 w-16 text-neutral-300" />
                    <p className="text-sm font-medium text-neutral-500">{t('criminal.show.no_photo')}</p>
                  </div>
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-2.5 flex items-center">
                    <UserRound className="mr-1.5 h-3.5 w-3.5" />
                    {t('criminal.show.personal_details')}
                  </h3>
                  <div className="rounded-lg border border-neutral-100 bg-neutral-50/50 p-3 space-y-2.5">
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600 font-medium">{t('criminal.show.full_name')}:</span>
                      <span className="text-sm text-neutral-900 font-semibold">{criminal.name}</span>
                    </div>

                    {criminal.father_name && (
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-600 font-medium">{t('criminal.show.father_name')}:</span>
                        <span className="text-sm text-neutral-900">{criminal.father_name}</span>
                      </div>
                    )}

                    {criminal.grandfather_name && (
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-600 font-medium">{t('criminal.show.grandfather_name')}:</span>
                        <span className="text-sm text-neutral-900">{criminal.grandfather_name}</span>
                      </div>
                    )}

                    {criminal.id_card_number && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-600 font-medium flex items-center">
                          <CreditCard className="mr-1 h-3 w-3" />
                          {t('criminal.show.id_card')}:
                        </span>
                        <span className="text-sm text-neutral-900">{criminal.id_card_number}</span>
                      </div>
                    )}

                    {criminal.phone_number && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-600 font-medium flex items-center">
                          <Phone className="mr-1 h-3 w-3" />
                          {t('criminal.show.phone')}:
                        </span>
                        <span className="text-sm text-neutral-900">{criminal.phone_number}</span>
                      </div>
                    )}

                    {criminal.department && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-600 font-medium flex items-center">
                          <Building className="mr-1 h-3 w-3" />
                          {t('criminal.show.department')}:
                        </span>
                        <Badge variant="secondary" className="text-xs font-medium">
                          {criminal.department.name}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                {(criminal.original_residence || criminal.current_residence) && (
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500 mb-2.5 flex items-center">
                      <MapPin className="mr-1.5 h-3.5 w-3.5" />
                      {t('criminal.show.residence_info')}
                    </h3>
                    <div className="rounded-lg border border-neutral-100 bg-neutral-50/50 p-3 space-y-2.5">
                      {criminal.original_residence && (
                        <div>
                          <span className="text-sm text-neutral-600 font-medium">{t('criminal.show.original_residence')}:</span>
                          <p className="mt-1 text-sm text-neutral-900">{criminal.original_residence}</p>
                        </div>
                      )}

                      {criminal.original_residence && criminal.current_residence && (
                        <Separator className="my-2" />
                      )}

                      {criminal.current_residence && (
                        <div>
                          <span className="text-sm text-neutral-600 font-medium">{t('criminal.show.current_residence')}:</span>
                          <p className="mt-1 text-sm text-neutral-900">{criminal.current_residence}</p>
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
            <Card className="border-none shadow-md overflow-hidden">
              <CardHeader className="bg-neutral-50 dark:bg-neutral-900 border-b pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-neutral-500" />
                  {t('criminal.show.crime_info.title')}
                </CardTitle>
                <CardDescription>
                  {t('criminal.show.crime_info.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-5">
                  {criminal.crime_type && (
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500 mb-2.5">
                        {t('criminal.show.crime_type')}
                      </h3>
                      <div className="rounded-lg border border-neutral-100 bg-neutral-50/50 p-3">
                        <p className="text-sm">{criminal.crime_type}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {criminal.arrest_location && (
                      <div>
                        <h3 className="text-sm font-medium text-neutral-500 mb-2.5 flex items-center">
                          <MapPin className="mr-1.5 h-3.5 w-3.5" />
                          {t('criminal.show.arrest_location')}
                        </h3>
                        <div className="rounded-lg border border-neutral-100 bg-neutral-50/50 p-3">
                          <p className="text-sm">{criminal.arrest_location}</p>
                        </div>
                      </div>
                    )}

                    {criminal.arrest_date && (
                      <div>
                        <h3 className="text-sm font-medium text-neutral-500 mb-2.5 flex items-center">
                          <Calendar className="mr-1.5 h-3.5 w-3.5" />
                          {t('criminal.show.arrest_date')}
                        </h3>
                        <div className="rounded-lg border border-neutral-100 bg-neutral-50/50 p-3">
                          <p className="text-sm">{format(new Date(criminal.arrest_date), 'PPP')}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {criminal.arrested_by && (
                      <div>
                        <h3 className="text-sm font-medium text-neutral-500 mb-2.5">
                          {t('criminal.show.arrested_by')}
                        </h3>
                        <div className="rounded-lg border border-neutral-100 bg-neutral-50/50 p-3">
                          <p className="text-sm">{criminal.arrested_by}</p>
                        </div>
                      </div>
                    )}

                    {criminal.referred_to && (
                      <div>
                        <h3 className="text-sm font-medium text-neutral-500 mb-2.5">
                          {t('criminal.show.referred_to')}
                        </h3>
                        <div className="rounded-lg border border-neutral-100 bg-neutral-50/50 p-3">
                          <p className="text-sm">{criminal.referred_to}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {criminal.final_verdict && (
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500 mb-2.5">
                        {t('criminal.show.final_verdict')}
                      </h3>
                      <div className="rounded-lg border border-neutral-100 bg-neutral-50/50 p-3">
                        <p className="text-sm">{criminal.final_verdict}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            {criminal.notes && (
              <Card className="border-none shadow-md overflow-hidden">
                <CardHeader className="bg-neutral-50 dark:bg-neutral-900 border-b pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-neutral-500" />
                    {t('criminal.show.notes')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="rounded-lg border border-neutral-100 bg-neutral-50/50 p-3">
                    <p className="text-sm whitespace-pre-wrap">{criminal.notes}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* System Info */}
            <Card className="border-none shadow-md overflow-hidden">
              <CardHeader className="bg-neutral-50 dark:bg-neutral-900 border-b pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-neutral-500" />
                  {t('criminal.show.system_info.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {criminal.creator && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-600">{t('criminal.show.system_info.created_by')}:</span>
                      <span className="text-sm font-medium">{criminal.creator.name}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-600">{t('criminal.show.system_info.created_date')}:</span>
                    <span className="text-sm font-medium">
                      {format(new Date(criminal.created_at), 'PPP')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-600">{t('criminal.show.system_info.updated_date')}:</span>
                    <span className="text-sm font-medium">
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
