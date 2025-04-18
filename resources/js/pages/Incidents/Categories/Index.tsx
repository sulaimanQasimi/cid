import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/pagination';
import { PageHeader } from '@/components/page-header';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

// Define breadcrumb navigation
const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Incident Categories',
    href: route('incident-categories.index'),
  },
];

interface CategoriesProps {
  categories: {
    data: Array<{
      id: number;
      name: string;
      code: string | null;
      description: string | null;
      color: string | null;
      severity_level: number;
      status: string;
      incidents_count: number;
    }>;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
  };
}

export default function Index({ categories }: CategoriesProps) {
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  const handleDelete = () => {
    if (categoryToDelete) {
      router.delete(route('incident-categories.destroy', categoryToDelete));
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Incident Categories" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <PageHeader
          title="Incident Categories"
          description="Manage incident categories for classification"
          actions={
            <Button asChild>
              <Link href={route('incident-categories.create')}>
                <Plus className="mr-2 h-4 w-4" />
                New Category
              </Link>
            </Button>
          }
        />

        <Card>
          <CardHeader>
            <CardTitle>All Categories</CardTitle>
            <CardDescription>
              A list of all incident categories in the system.
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
                      Color
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Severity
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Incidents
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Status
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {categories.data.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="h-12 px-4 text-center align-middle">
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
                          <div className="font-medium">{category.name}</div>
                          <div className="text-xs text-muted-foreground">{category.description?.substring(0, 50)}{category.description && category.description.length > 50 ? '...' : ''}</div>
                        </td>
                        <td className="p-4 align-middle">
                          {category.code || '-'}
                        </td>
                        <td className="p-4 align-middle">
                          {category.color && (
                            <div className="flex items-center space-x-2">
                              <div
                                className="h-4 w-4 rounded-full"
                                style={{ backgroundColor: category.color }}
                              />
                              <span>{category.color}</span>
                            </div>
                          )}
                        </td>
                        <td className="p-4 align-middle">
                          <Badge variant={
                            category.severity_level > 4 ? 'destructive' :
                            category.severity_level > 3 ? 'default' :
                            category.severity_level > 1 ? 'default' : 'outline'
                          }>
                            Level {category.severity_level}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle">
                          {category.incidents_count}
                        </td>
                        <td className="p-4 align-middle">
                          <Badge variant={category.status === 'active' ? 'default' : 'secondary'}>
                            {category.status}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                            >
                              <Link href={route('incident-categories.edit', category.id)}>
                                <Pencil className="h-4 w-4 mr-1" />
                                Edit
                              </Link>
                            </Button>

                            <AlertDialog
                              open={categoryToDelete === category.id}
                              onOpenChange={(open) => {
                                if (!open) setCategoryToDelete(null);
                              }}
                            >
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setCategoryToDelete(category.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Incident Category</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this category? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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
    </AppLayout>
  );
}
