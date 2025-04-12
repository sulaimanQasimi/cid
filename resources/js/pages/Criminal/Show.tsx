import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pencil, Trash, UserRound, MapPin, FileText, Calendar, Building, Phone, CreditCard } from 'lucide-react';
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Generate breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Criminal Records',
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
      <Head title={`Criminal Record: ${criminal.name}`} />

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
                {criminal.number ? `ID: ${criminal.number}` : 'No ID assigned'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" asChild className="rounded-full shadow-sm">
              <Link href={route('criminals.edit', criminal.id)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Record
              </Link>
            </Button>
            <Button
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="rounded-full shadow-sm"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Photo and Basic Details */}
          <Card className="md:col-span-4 border-none shadow-md overflow-hidden">
            <CardHeader className="bg-neutral-50 dark:bg-neutral-900 border-b pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserRound className="h-5 w-5 text-neutral-500" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Basic identification details
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
                    <p className="text-sm font-medium text-neutral-500">No photo available</p>
                  </div>
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-2.5 flex items-center">
                    <UserRound className="mr-1.5 h-3.5 w-3.5" />
                    Personal Details
                  </h3>
                  <div className="rounded-lg border border-neutral-100 bg-neutral-50/50 p-3 space-y-2.5">
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600 font-medium">Full Name:</span>
                      <span className="text-sm text-neutral-900 font-semibold">{criminal.name}</span>
                    </div>

                    {criminal.father_name && (
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-600 font-medium">Father's Name:</span>
                        <span className="text-sm text-neutral-900">{criminal.father_name}</span>
                      </div>
                    )}

                    {criminal.grandfather_name && (
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-600 font-medium">Grandfather's Name:</span>
                        <span className="text-sm text-neutral-900">{criminal.grandfather_name}</span>
                      </div>
                    )}

                    {criminal.id_card_number && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-600 font-medium flex items-center">
                          <CreditCard className="mr-1 h-3 w-3" />
                          ID Card:
                        </span>
                        <span className="text-sm text-neutral-900">{criminal.id_card_number}</span>
                      </div>
                    )}

                    {criminal.phone_number && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-600 font-medium flex items-center">
                          <Phone className="mr-1 h-3 w-3" />
                          Phone:
                        </span>
                        <span className="text-sm text-neutral-900">{criminal.phone_number}</span>
                      </div>
                    )}

                    {criminal.department && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-600 font-medium flex items-center">
                          <Building className="mr-1 h-3 w-3" />
                          Department:
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
                      Residence Information
                    </h3>
                    <div className="rounded-lg border border-neutral-100 bg-neutral-50/50 p-3 space-y-2.5">
                      {criminal.original_residence && (
                        <div>
                          <span className="text-sm text-neutral-600 font-medium">Original Residence:</span>
                          <p className="mt-1 text-sm text-neutral-900">{criminal.original_residence}</p>
                        </div>
                      )}

                      {criminal.original_residence && criminal.current_residence && (
                        <Separator className="my-2" />
                      )}

                      {criminal.current_residence && (
                        <div>
                          <span className="text-sm text-neutral-600 font-medium">Current Residence:</span>
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
                  Crime Information
                </CardTitle>
                <CardDescription>
                  Details about the criminal case
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-3 flex items-center">
                    <FileText className="mr-1.5 h-3.5 w-3.5" />
                    Case Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {criminal.crime_type && (
                      <div className="rounded-lg border border-neutral-100 bg-neutral-50/50 p-3">
                        <span className="text-xs uppercase text-neutral-500 font-medium">Crime Type</span>
                        <p className="mt-1 text-sm font-semibold text-neutral-900">{criminal.crime_type}</p>
                      </div>
                    )}

                    {criminal.arrest_date && (
                      <div className="rounded-lg border border-neutral-100 bg-neutral-50/50 p-3">
                        <span className="text-xs uppercase text-neutral-500 font-medium flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          Arrest Date
                        </span>
                        <p className="mt-1 text-sm font-medium text-neutral-900">
                          {format(new Date(criminal.arrest_date), 'MMMM d, yyyy')}
                        </p>
                      </div>
                    )}

                    {criminal.arrest_location && (
                      <div className="rounded-lg border border-neutral-100 bg-neutral-50/50 p-3">
                        <span className="text-xs uppercase text-neutral-500 font-medium flex items-center">
                          <MapPin className="mr-1 h-3 w-3" />
                          Arrest Location
                        </span>
                        <p className="mt-1 text-sm text-neutral-900">{criminal.arrest_location}</p>
                      </div>
                    )}

                    {criminal.arrested_by && (
                      <div className="rounded-lg border border-neutral-100 bg-neutral-50/50 p-3">
                        <span className="text-xs uppercase text-neutral-500 font-medium">Arrested By</span>
                        <p className="mt-1 text-sm text-neutral-900">{criminal.arrested_by}</p>
                      </div>
                    )}

                    {criminal.referred_to && (
                      <div className="rounded-lg border border-neutral-100 bg-neutral-50/50 p-3">
                        <span className="text-xs uppercase text-neutral-500 font-medium">Referred To</span>
                        <p className="mt-1 text-sm text-neutral-900">{criminal.referred_to}</p>
                      </div>
                    )}
                  </div>
                </div>

                {criminal.final_verdict && (
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500 mb-3">Final Verdict</h3>
                    <div className="rounded-lg border border-neutral-100 bg-neutral-50/50 p-4">
                      <p className="text-sm text-neutral-900 whitespace-pre-wrap">{criminal.final_verdict}</p>
                    </div>
                  </div>
                )}

                {criminal.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500 mb-3">Additional Notes</h3>
                    <div className="rounded-lg border border-neutral-100 bg-neutral-50/50 p-4">
                      <p className="text-sm text-neutral-900 whitespace-pre-wrap">{criminal.notes}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-none shadow-md overflow-hidden">
              <CardHeader className="bg-neutral-50 dark:bg-neutral-900 border-b pb-4">
                <CardTitle className="text-lg">Record Management</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-lg border border-neutral-100 bg-neutral-50/50 p-3">
                    <span className="text-xs uppercase text-neutral-500 font-medium">Created By</span>
                    <p className="mt-1 text-sm text-neutral-900">
                      {criminal.creator ? criminal.creator.name : 'Unknown'}
                    </p>
                  </div>

                  <div className="rounded-lg border border-neutral-100 bg-neutral-50/50 p-3">
                    <span className="text-xs uppercase text-neutral-500 font-medium">Created On</span>
                    <p className="mt-1 text-sm text-neutral-900">
                      {format(new Date(criminal.created_at), 'MMMM d, yyyy')}
                    </p>
                  </div>

                  <div className="rounded-lg border border-neutral-100 bg-neutral-50/50 p-3">
                    <span className="text-xs uppercase text-neutral-500 font-medium">Last Updated</span>
                    <p className="mt-1 text-sm text-neutral-900">
                      {format(new Date(criminal.updated_at), 'MMMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4 bg-neutral-50 dark:bg-neutral-900">
                <div className="w-full flex justify-end">
                  <Button
                    variant="outline"
                    className="rounded-full"
                    asChild
                  >
                    <Link href={route('criminals.index')}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to List
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="mt-2">
              This will permanently delete the criminal record for{' '}
              <span className="font-semibold text-foreground">{criminal.name}</span>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground rounded-full"
            >
              Delete Record
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
