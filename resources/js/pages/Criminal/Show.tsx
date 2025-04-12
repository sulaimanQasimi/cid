import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pencil, Trash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { format } from 'date-fns';

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

      <div className="container px-0 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href={route('criminals.index')}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h2 className="text-2xl font-bold">{criminal.name}</h2>
              <p className="text-sm text-neutral-500">
                {criminal.number ? `ID: ${criminal.number}` : 'No ID assigned'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href={route('criminals.edit', criminal.id)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Photo and Basic Details */}
          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {criminal.photo && (
                <div className="overflow-hidden rounded-md">
                  <img
                    src={`/storage/${criminal.photo}`}
                    alt={criminal.name}
                    className="h-auto w-full object-cover"
                  />
                </div>
              )}

              <div>
                <h3 className="font-medium">Personal Details</h3>
                <div className="mt-2 space-y-2">
                  <div className="grid grid-cols-3 gap-1">
                    <span className="text-sm text-neutral-500">Full Name:</span>
                    <span className="col-span-2 text-sm font-medium">{criminal.name}</span>
                  </div>

                  {criminal.father_name && (
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-sm text-neutral-500">Father's Name:</span>
                      <span className="col-span-2 text-sm">{criminal.father_name}</span>
                    </div>
                  )}

                  {criminal.grandfather_name && (
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-sm text-neutral-500">Grandfather's Name:</span>
                      <span className="col-span-2 text-sm">{criminal.grandfather_name}</span>
                    </div>
                  )}

                  {criminal.id_card_number && (
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-sm text-neutral-500">ID Card Number:</span>
                      <span className="col-span-2 text-sm">{criminal.id_card_number}</span>
                    </div>
                  )}

                  {criminal.phone_number && (
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-sm text-neutral-500">Phone Number:</span>
                      <span className="col-span-2 text-sm">{criminal.phone_number}</span>
                    </div>
                  )}

                  {criminal.department && (
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-sm text-neutral-500">Department:</span>
                      <span className="col-span-2 text-sm">
                        <Badge variant="outline">{criminal.department.name}</Badge>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {(criminal.original_residence || criminal.current_residence) && (
                <div>
                  <h3 className="font-medium">Residence Information</h3>
                  <div className="mt-2 space-y-2">
                    {criminal.original_residence && (
                      <div className="grid grid-cols-3 gap-1">
                        <span className="text-sm text-neutral-500">Original Residence:</span>
                        <span className="col-span-2 text-sm">{criminal.original_residence}</span>
                      </div>
                    )}

                    {criminal.current_residence && (
                      <div className="grid grid-cols-3 gap-1">
                        <span className="text-sm text-neutral-500">Current Residence:</span>
                        <span className="col-span-2 text-sm">{criminal.current_residence}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Crime Details */}
          <Card className="md:col-span-8">
            <CardHeader>
              <CardTitle>Crime Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium">Crime Details</h3>
                <div className="mt-2 space-y-3">
                  {criminal.crime_type && (
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-sm text-neutral-500">Crime Type:</span>
                      <span className="col-span-2 text-sm font-medium">{criminal.crime_type}</span>
                    </div>
                  )}

                  {criminal.arrest_date && (
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-sm text-neutral-500">Arrest Date:</span>
                      <span className="col-span-2 text-sm">
                        {format(new Date(criminal.arrest_date), 'MMMM d, yyyy')}
                      </span>
                    </div>
                  )}

                  {criminal.arrest_location && (
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-sm text-neutral-500">Arrest Location:</span>
                      <span className="col-span-2 text-sm">{criminal.arrest_location}</span>
                    </div>
                  )}

                  {criminal.arrested_by && (
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-sm text-neutral-500">Arrested By:</span>
                      <span className="col-span-2 text-sm">{criminal.arrested_by}</span>
                    </div>
                  )}

                  {criminal.referred_to && (
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-sm text-neutral-500">Referred To:</span>
                      <span className="col-span-2 text-sm">{criminal.referred_to}</span>
                    </div>
                  )}
                </div>
              </div>

              {criminal.final_verdict && (
                <div>
                  <h3 className="font-medium">Final Verdict</h3>
                  <p className="mt-2 text-sm whitespace-pre-wrap">{criminal.final_verdict}</p>
                </div>
              )}

              {criminal.notes && (
                <div>
                  <h3 className="font-medium">Additional Notes</h3>
                  <p className="mt-2 text-sm whitespace-pre-wrap">{criminal.notes}</p>
                </div>
              )}

              <div>
                <h3 className="font-medium">Record Information</h3>
                <div className="mt-2 space-y-2">
                  <div className="grid grid-cols-3 gap-1">
                    <span className="text-sm text-neutral-500">Created By:</span>
                    <span className="col-span-2 text-sm">
                      {criminal.creator ? criminal.creator.name : 'Unknown'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <span className="text-sm text-neutral-500">Created On:</span>
                    <span className="col-span-2 text-sm">
                      {format(new Date(criminal.created_at), 'MMMM d, yyyy')}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <span className="text-sm text-neutral-500">Last Updated:</span>
                    <span className="col-span-2 text-sm">
                      {format(new Date(criminal.updated_at), 'MMMM d, yyyy')}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the criminal record for <strong>{criminal.name}</strong>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
