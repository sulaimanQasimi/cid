import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/pagination';
import { PageHeader } from '@/components/page-header';
import { Plus, Edit, Eye, Trash, Tag, Loader2 } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface CategoryData {
  id: number;
  name: string;
  label: string;
}

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

interface IndexProps {
  items: {
    data: ItemData[];
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
  };
  categories: CategoryData[];
  filter: {
    category_id?: string;
  };
}

export default function Index({ items, categories, filter }: IndexProps) {
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
      title: 'Category Items',
      href: route('stat-category-items.index'),
    },
  ];

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ItemData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(filter.category_id || 'all');

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

  function handleCategoryChange(value: string) {
    setSelectedCategoryId(value);
    if (value === 'all') {
      router.visit(route('stat-category-items.index'));
    } else {
      router.visit(route('stat-category-items.index', { category_id: value }));
    }
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Category Items" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <PageHeader
          title="Category Items"
          description="Manage statistical category items"
          actions={
            <Button asChild>
              <Link
                href={selectedCategoryId !== 'all'
                  ? route('stat-category-items.create', { category_id: selectedCategoryId })
                  : route('stat-category-items.create')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Link>
            </Button>
          }
        />

        <Card>
          <CardHeader>
            <CardTitle>All Items</CardTitle>
            <CardDescription>
              A list of all statistical category items
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 space-y-2 max-w-sm">
              <Label htmlFor="filter-category">Filter by Category</Label>
              <Select
                value={selectedCategoryId}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
                      Category
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Color
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Order
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
                  {items.data.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="h-12 px-4 text-center align-middle">
                        No items found
                      </td>
                    </tr>
                  ) : (
                    items.data.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                      >
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
                          <Link
                            href={route('stat-categories.show', item.category?.id)}
                            className="hover:underline text-muted-foreground"
                          >
                            {item.category?.label}
                          </Link>
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
                                style={{ backgroundColor: item.category?.color }}
                              ></div>
                              <span className="text-muted-foreground">
                                (Category default)
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="p-4 align-middle">
                          {item.order}
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
                              <Link href={route('stat-category-items.show', item.id)}>
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Link>
                            </Button>

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

            <div className="mt-6">
              <Pagination links={items.links} />
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
