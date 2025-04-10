import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pencil, Trash, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Info {
  id: number;
  title: string;
  content: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface InfoCategory {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  infos: Info[];
}

interface Props {
  infoCategory: InfoCategory;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Info Management',
    href: '#',
  },
  {
    title: 'Info Categories',
    href: route('info-categories.index'),
  },
  {
    title: 'View Category',
    href: '#',
  },
];

export default function ShowInfoCategory({ infoCategory }: Props) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const handleDelete = () => {
    router.delete(route('info-categories.destroy', infoCategory.id), {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`View Category: ${infoCategory.name}`} />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Category Details</h1>
                <div className="flex items-center gap-2">
                  <Button variant="outline" asChild>
                    <Link href={route('info-categories.index')}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Categories
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={route('info-categories.edit', infoCategory.id)}>
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

              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <h2 className="text-lg font-semibold">{infoCategory.name}</h2>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Description</h3>
                      <p className="mt-1 text-sm text-gray-900">{infoCategory.description || 'No description provided'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                      <p className="mt-1 text-sm text-gray-900">{new Date(infoCategory.created_at).toLocaleString()}</p>

                      <h3 className="text-sm font-medium text-gray-500 mt-4">Updated At</h3>
                      <p className="mt-1 text-sm text-gray-900">{new Date(infoCategory.updated_at).toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Info records table */}
              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Associated Info Records</h2>
                  <Button asChild>
                    <Link href={route('infos.create', { category_id: infoCategory.id })}>
                      Create New Info
                    </Link>
                  </Button>
                </div>

                {infoCategory.infos && infoCategory.infos.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {infoCategory.infos.map((info) => (
                        <TableRow key={info.id}>
                          <TableCell>{info.id}</TableCell>
                          <TableCell className="font-medium">{info.title}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              info.status === 'published'
                                ? 'bg-green-100 text-green-800'
                                : info.status === 'draft'
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {info.status.charAt(0).toUpperCase() + info.status.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>{new Date(info.created_at).toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline" asChild>
                                <Link href={route('infos.show', info.id)}>
                                  <ExternalLink className="h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Card>
                    <CardContent className="flex items-center justify-center p-6">
                      <div className="text-center">
                        <p className="text-gray-500 mb-4">No info records found for this category.</p>
                        <Button asChild>
                          <Link href={route('infos.create', { category_id: infoCategory.id })}>
                            Create First Info Record
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
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
              This will permanently delete the category "{infoCategory.name}".
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
