import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/pagination';
import { PageHeader } from '@/components/page-header';
import { Plus, Edit, Eye, Trash, MapPin, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

interface ProvinceData {
  id: number;
  name: string;
  code: string;
  description: string | null;
  governor: string | null;
  capital: string | null;
  status: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  creator?: {
    id: number;
    name: string;
  };
}

interface IndexProps {
  provinces: {
    data: ProvinceData[];
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
  };
}

export default function Index({ provinces }: IndexProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
    },
    {
      title: 'Provinces',
      href: route('provinces.index'),
    },
  ];

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [provinceToDelete, setProvinceToDelete] = useState<ProvinceData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function confirmDelete(province: ProvinceData) {
    setProvinceToDelete(province);
    setIsDeleteDialogOpen(true);
  }

  function handleDelete() {
    if (!provinceToDelete) return;

    setIsDeleting(true);

    router.delete(route('provinces.destroy', provinceToDelete.id), {
      preserveScroll: true,
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        setIsDeleting(false);
        toast.success(`Province "${provinceToDelete.name}" deleted successfully`);
      },
      onError: (errors) => {
        setIsDeleting(false);
        toast.error('Failed to delete province');
        console.error(errors);
      }
    });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Provinces" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <PageHeader
          title="Provinces"
          description="Manage provinces in the system"
          actions={
            <Button asChild>
              <Link href={route('provinces.create')}>
                <Plus className="mr-2 h-4 w-4" />
                Add Province
              </Link>
            </Button>
          }
        />

        <Card>
          <CardHeader>
            <CardTitle>All Provinces</CardTitle>
            <CardDescription>
              A list of all provinces in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Name
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Code
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Capital
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Status
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Created By
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {provinces.data.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="h-12 px-4 text-center align-middle">
                        No provinces found
                      </td>
                    </tr>
                  ) : (
                    provinces.data.map((province) => (
                      <tr
                        key={province.id}
                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                      >
                        <td className="p-4 align-middle">
                          <Link
                            href={route('provinces.show', province.id)}
                            className="font-medium text-primary hover:underline flex items-center"
                          >
                            <MapPin className="h-4 w-4 mr-2" />
                            {province.name}
                          </Link>
                        </td>
                        <td className="p-4 align-middle">
                          {province.code}
                        </td>
                        <td className="p-4 align-middle">
                          {province.capital || 'N/A'}
                        </td>
                        <td className="p-4 align-middle">
                          <Badge variant={province.status === 'active' ? 'default' : 'secondary'}>
                            {province.status}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle">
                          {province.creator?.name || 'N/A'}
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                            >
                              <Link href={route('provinces.show', province.id)}>
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Link>
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                            >
                              <Link href={route('provinces.edit', province.id)}>
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Link>
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => confirmDelete(province)}
                            >
                              <Trash className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <Pagination links={provinces.links} />
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the province
              <span className="font-semibold"> {provinceToDelete?.name}</span>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
