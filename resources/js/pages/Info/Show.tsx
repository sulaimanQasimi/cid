import React, { useState, lazy, Suspense } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pencil, Trash, Check, X, BadgeInfo, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
import { Info, InfoType, InfoCategory, User } from '@/types/info';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Lazy load the LocationDisplay component
const LocationDisplay = lazy(() => import('@/components/LocationDisplay'));

interface Props {
  info: Info & {
    infoType?: InfoType;
    infoCategory?: InfoCategory;
    user?: User;
    creator?: User;
    confirmer?: User;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Info Management',
    href: '#',
  },
  {
    title: 'Info Records',
    href: route('infos.index'),
  },
  {
    title: 'View Info',
    href: '#',
  },
];

export default function ShowInfo({ info }: Props) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    router.delete(route('infos.destroy', info.id), {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
      },
    });
  };

  // Function to format the value object for display
  const formatValue = (value: any) => {
    if (!value) return 'No content';

    if (typeof value === 'object') {
      // If it's an object with content property, return the content
      if (value.content) return value.content;

      // If it's an object with location property, filter it out to avoid cluttering the view
      const { location, ...rest } = value;

      // If there are other properties, show them
      if (Object.keys(rest).length > 0) {
        return JSON.stringify(rest, null, 2);
      }

      // If only location was present, indicate that
      if (location) {
        return "Location data available in the Location tab.";
      }

      return JSON.stringify(value, null, 2);
    }

    return String(value);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`View Info: ${info.name || 'Info Record'}`} />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{info.name || 'Info Record'}</h1>
                <div className="flex items-center gap-2">
                  <Button variant="outline" asChild>
                    <Link href={route('infos.index')}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to List
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={route('infos.edit', info.id)}>
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

              {/* Info details */}
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Info Details</h2>
                    <Badge variant={info.confirmed ? "success" : "secondary"}>
                      {info.confirmed ?
                        <><Check className="h-3 w-3 mr-1" /> Confirmed</> :
                        <><X className="h-3 w-3 mr-1" /> Unconfirmed</>}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Name</h3>
                        <p className="mt-1 text-sm text-gray-900">{info.name || 'Not specified'}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Code</h3>
                        <p className="mt-1 text-sm text-gray-900 font-mono">{info.code || 'Not specified'}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Type</h3>
                        <p className="mt-1 text-sm text-gray-900">
                          {info.infoType ? (
                            <Link
                              href={route('info-types.show', info.infoType.id)}
                              className="text-blue-600 hover:underline"
                            >
                              {info.infoType.name}
                            </Link>
                          ) : (
                            <span>Not specified</span>
                          )}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Category</h3>
                        <p className="mt-1 text-sm text-gray-900">
                          {info.infoCategory ? (
                            <Link
                              href={route('info-categories.show', info.infoCategory.id)}
                              className="text-blue-600 hover:underline"
                            >
                              {info.infoCategory.name}
                            </Link>
                          ) : (
                            <span>Not specified</span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Description</h3>
                        <p className="mt-1 text-sm text-gray-900">{info.description || 'No description provided'}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Created By</h3>
                        <p className="mt-1 text-sm text-gray-900">{info.creator?.name || 'System'}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                        <p className="mt-1 text-sm text-gray-900">{new Date(info.created_at).toLocaleString()}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                        <p className="mt-1 text-sm text-gray-900">{new Date(info.updated_at).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Content/Value section */}
              <Card>
                <CardHeader className="pb-3">
                  <h2 className="text-lg font-semibold">Content</h2>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="basic">
                    <TabsList className="mb-4">
                      <TabsTrigger value="basic">Basic Content</TabsTrigger>
                      {info.value && info.value.location && (
                        <TabsTrigger value="location" className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          Location
                        </TabsTrigger>
                      )}
                    </TabsList>

                    <TabsContent value="basic">
                      <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap font-mono text-sm">
                        {formatValue(info.value?.content || info.value)}
                      </div>
                    </TabsContent>

                    {info.value && info.value.location && (
                      <TabsContent value="location">
                        <Suspense fallback={<div className="h-[400px] flex items-center justify-center bg-gray-100 rounded-md">Loading map...</div>}>
                          <LocationDisplay location={info.value.location} />
                        </Suspense>
                      </TabsContent>
                    )}
                  </Tabs>
                </CardContent>
              </Card>

              {/* Confirmation details if confirmed */}
              {info.confirmed && info.confirmer && (
                <Card className="mt-6">
                  <CardHeader className="pb-3">
                    <h2 className="text-lg font-semibold">Confirmation Details</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Confirmed By</h3>
                        <p className="mt-1 text-sm text-gray-900">{info.confirmer?.name || 'Unknown'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Confirmation Date</h3>
                        <p className="mt-1 text-sm text-gray-900">
                          {/* Use a relevant date - for now using updated_at as proxy */}
                          {new Date(info.updated_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this info record.
              <br />
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
