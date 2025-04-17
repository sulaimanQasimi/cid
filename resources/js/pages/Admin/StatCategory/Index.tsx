import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/pagination';
import { PageHeader } from '@/components/page-header';
import { Plus, Edit, Eye, Trash, Database, Loader2 } from 'lucide-react';
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
}

interface IndexProps {
  categories: {
    data: CategoryData[];
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
  };
}

export default function Index({ categories }: IndexProps) {
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
  ];

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function confirmDelete(category: CategoryData) {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  }

  function handleDelete() {
    if (!categoryToDelete) return;

    setIsDeleting(true);

    router.delete(route('stat-categories.destroy', categoryToDelete.id), {
      preserveScroll: true,
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        setIsDeleting(false);
        toast.success(`Category "${categoryToDelete.name}" deleted successfully`);
      },
      onError: (errors) => {
        setIsDeleting(false);
        toast.error('Failed to delete category');
        console.error(errors);
      }
    });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Stat Categories" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <PageHeader
          title="Stat Categories"
          description="Manage statistical categories in the system"
          actions={
            <Button asChild>
              <Link href={route('stat-categories.create')}>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Link>
            </Button>
          }
        />

        <Card>
          <CardHeader>
            <CardTitle>All Categories</CardTitle>
            <CardDescription>
              A list of all statistical categories in the system
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
                      Label
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Color
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
                  {categories.data.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="h-12 px-4 text-center align-middle">
                        No categories found
                      </td>
                    </tr>
                  ) : (
                    categories.data.map((category) => (
                      <tr
                        key={category.id}
                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                      >
                        <td className="p-4 align-middle">
                          <Link
                            href={route('stat-categories.show', category.id)}
                            className="font-medium text-primary hover:underline flex items-center"
                          >
                            <Database className="h-4 w-4 mr-2" />
                            {category.name}
                          </Link>
                        </td>
                        <td className="p-4 align-middle">
                          {category.label}
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center space-x-2">
                            <div
                              className="h-4 w-4 rounded-full border"
                              style={{ backgroundColor: category.color }}
                            ></div>
                            <span>{category.color}</span>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <Badge variant={category.status === 'active' ? 'default' : 'secondary'}>
                            {category.status}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle">
                          {category.creator?.name || 'N/A'}
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                            >
                              <Link href={route('stat-categories.show', category.id)}>
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Link>
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                            >
                              <Link href={route('stat-categories.edit', category.id)}>
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Link>
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => confirmDelete(category)}
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
              <Pagination links={categories.links} />
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category
              <span className="font-semibold"> {categoryToDelete?.name}</span> and all associated items.
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
