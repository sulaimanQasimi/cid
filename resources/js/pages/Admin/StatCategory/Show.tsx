import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { ArrowLeft, Edit, Plus, Trash, Database, Tag, Calendar, User, Clock, Loader2 } from 'lucide-react';
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
}

interface CategoryData {
  id: number;
  name: string;
  label: string;
  color: string;
  status: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  creator?: {
    id: number;
    name: string;
  };
  items: ItemData[];
}

interface ShowProps {
  category: CategoryData;
}

export default function Show({ category }: ShowProps) {
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
      title: category.name,
      href: route('stat-categories.show', category.id),
    },
  ];

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ItemData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function confirmDelete(item: ItemData) {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  }

  function handleDelete() {
    if (!itemToDelete) return;

    setIsDeleting(true);

    router.delete(route('stat-category-items.destroy', itemToDelete.id), {
      preserveScroll: true,
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        setIsDeleting(false);
        toast.success(`Item "${itemToDelete.name}" deleted successfully`);
      },
      onError: (errors) => {
        setIsDeleting(false);
        toast.error('Failed to delete item');
        console.error(errors);
      }
    });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Category - ${category.name}`} />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <PageHeader
          title={category.label}
          description={`Category: ${category.name}`}
          actions={
            <div className="flex space-x-2">
              <Button variant="outline" asChild>
                <Link href={route('stat-categories.index')}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Link>
              </Button>
              <Button asChild>
                <Link href={route('stat-categories.edit', category.id)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
            </div>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Category Details</CardTitle>
              <CardDescription>
                Detailed information about this statistical category
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-2 border-b pb-4">
                <Badge
                  variant={category.status === 'active' ? 'default' : 'secondary'}
                  className="flex items-center"
                >
                  {category.status}
                </Badge>
                <Badge variant="outline" className="flex items-center">
                  <div
                    className="mr-1 h-3 w-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  {category.color}
                </Badge>
              </div>

              <div>
                <h3 className="text-lg font-semibold">System Information</h3>
                <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Database className="mr-2 h-4 w-4" />
                    <span>System Name: </span>
                    <span className="ml-1 font-medium text-foreground">{category.name}</span>
                  </div>
                  <div className="flex items-center">
                    <Tag className="mr-2 h-4 w-4" />
                    <span>Display Label: </span>
                    <span className="ml-1 font-medium text-foreground">{category.label}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Category Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Created By</div>
                <div className="flex items-center mt-1">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  {category.creator?.name || 'Unknown'}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-muted-foreground">Created At</div>
                <div className="flex items-center mt-1">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  {format(new Date(category.created_at), 'PPP')}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-muted-foreground">Last Updated</div>
                <div className="flex items-center mt-1">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  {format(new Date(category.updated_at), 'PPP p')}
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full" asChild>
                  <Link href={route('stat-category-items.create', { category_id: category.id })}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category Item
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Category Items</CardTitle>
              <CardDescription>
                Items within this category
              </CardDescription>
            </div>
            <Button asChild>
              <Link href={route('stat-category-items.create', { category_id: category.id })}>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium">Order</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Label</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Color</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {category.items.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="h-12 px-4 text-center align-middle">
                        No items found. Add an item to this category.
                      </td>
                    </tr>
                  ) : (
                    category.items.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                      >
                        <td className="p-4 align-middle">
                          {item.order}
                        </td>
                        <td className="p-4 align-middle">
                          <Link
                            href={route('stat-category-items.show', item.id)}
                            className="font-medium text-primary hover:underline flex items-center"
                          >
                            <Tag className="h-4 w-4 mr-2" />
                            {item.name}
                          </Link>
                        </td>
                        <td className="p-4 align-middle">
                          {item.label}
                        </td>
                        <td className="p-4 align-middle">
                          {item.color ? (
                            <div className="flex items-center space-x-2">
                              <div
                                className="h-4 w-4 rounded-full border"
                                style={{ backgroundColor: item.color }}
                              ></div>
                              <span>{item.color}</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <div
                                className="h-4 w-4 rounded-full border"
                                style={{ backgroundColor: category.color }}
                              ></div>
                              <span className="text-muted-foreground">
                                (Category default)
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="p-4 align-middle">
                          <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                            {item.status}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                            >
                              <Link href={route('stat-category-items.edit', item.id)}>
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Link>
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => confirmDelete(item)}
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
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the item
              <span className="font-semibold"> {itemToDelete?.name}</span>.
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
