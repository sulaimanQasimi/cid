import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { ArrowLeft, Edit, Trash, Tag, Database, Calendar, User, Clock, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
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

interface ItemData {
  id: number;
  stat_category_id: number;
  name: string;
  label: string;
  color: string | null;
  status: string;
  order: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  creator?: {
    id: number;
    name: string;
  };
  category?: {
    id: number;
    name: string;
    label: string;
    color: string;
  };
}

interface ShowProps {
  item: ItemData;
}

export default function Show({ item }: ShowProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
    },
    {
      title: 'Settings',
      href: '#',
    },
    {
      title: 'Stat Categories',
      href: route('stat-categories.index'),
    },
    {
      title: item.category?.label || 'Category',
      href: route('stat-categories.show', item.category?.id),
    },
    {
      title: item.name,
      href: route('stat-category-items.show', item.id),
    },
  ];

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  function confirmDelete() {
    setIsDeleteDialogOpen(true);
  }

  function handleDelete() {
    setIsDeleting(true);

    router.delete(route('stat-category-items.destroy', item.id), {
      onSuccess: () => {
        toast.success(`Item "${item.name}" deleted successfully`);
        router.visit(route('stat-category-items.index', { category_id: item.stat_category_id }));
      },
      onError: (errors) => {
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);
        toast.error('Failed to delete item');
        console.error(errors);
      }
    });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Item - ${item.name}`} />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <PageHeader
          title={item.label}
          description={`Item: ${item.name}`}
          actions={
            <div className="flex space-x-2">
              <Button variant="outline" asChild>
                <Link href={route('stat-category-items.index', { category_id: item.stat_category_id })}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={route('stat-categories.show', item.category?.id)}>
                  <Database className="mr-2 h-4 w-4" />
                  View Category
                </Link>
              </Button>
              <Button asChild>
                <Link href={route('stat-category-items.edit', item.id)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Item Details</CardTitle>
              <CardDescription>
                Detailed information about this statistical category item
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-2 border-b pb-4">
                <Badge
                  variant={item.status === 'active' ? 'default' : 'secondary'}
                  className="flex items-center"
                >
                  {item.status}
                </Badge>
                <Badge variant="outline" className="flex items-center">
                  <div
                    className="mr-1 h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color || item.category?.color }}
                  ></div>
                  {item.color || 'Using category default color'}
                </Badge>
                <Badge variant="outline" className="flex items-center">
                  Order: {item.order}
                </Badge>
              </div>

              <div>
                <h3 className="text-lg font-semibold">System Information</h3>
                <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Tag className="mr-2 h-4 w-4" />
                    <span>System Name: </span>
                    <span className="ml-1 font-medium text-foreground">{item.name}</span>
                  </div>
                  <div className="flex items-center">
                    <Tag className="mr-2 h-4 w-4" />
                    <span>Display Label: </span>
                    <span className="ml-1 font-medium text-foreground">{item.label}</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <Database className="mr-2 h-4 w-4" />
                    <span>Category: </span>
                    <Link
                      href={route('stat-categories.show', item.category?.id)}
                      className="ml-1 font-medium text-primary hover:underline"
                    >
                      {item.category?.label}
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Item Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Created By</div>
                <div className="flex items-center mt-1">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  {item.creator?.name || 'Unknown'}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-muted-foreground">Created At</div>
                <div className="flex items-center mt-1">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  {format(new Date(item.created_at), 'PPP')}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-muted-foreground">Last Updated</div>
                <div className="flex items-center mt-1">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  {format(new Date(item.updated_at), 'PPP p')}
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button variant="destructive" className="w-full" onClick={confirmDelete}>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete Item
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the item
              <span className="font-semibold"> {item.name}</span>.
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
