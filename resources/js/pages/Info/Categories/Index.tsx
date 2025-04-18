import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash, Search, ArrowUpDown, FilterX, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
import { useDebounce } from '@/hooks/use-debounce';

interface InfoCategory {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

interface Props {
  categories: {
    data: InfoCategory[];
    links: PaginationLinks;
    meta: PaginationMeta;
  };
  filters: {
    search: string;
    sort: string;
    direction: string;
    per_page: number;
  };
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
];

const sortOptions = [
  { value: 'name', label: 'Name' },
  { value: 'created_at', label: 'Created Date' },
  { value: 'updated_at', label: 'Updated Date' },
];

const perPageOptions = [
  { value: 10, label: '10 per page' },
  { value: 25, label: '25 per page' },
  { value: 50, label: '50 per page' },
  { value: 100, label: '100 per page' },
];

export default function InfoCategoriesIndex({ categories, filters }: Props) {
  // Use local state for all filter values
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [sortField, setSortField] = useState(filters.sort || 'name');
  const [sortDirection, setSortDirection] = useState(filters.direction || 'asc');
  const [perPage, setPerPage] = useState(filters.per_page || 10);
  const [currentPage, setCurrentPage] = useState(categories.meta?.current_page || 1);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<InfoCategory | null>(null);

  // Create debounced versions of filters for search to avoid too many requests
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Apply filters when debounced values change
  useEffect(() => {
    if (debouncedSearch !== filters.search ||
        sortField !== filters.sort ||
        sortDirection !== filters.direction ||
        perPage !== filters.per_page) {
      applyFilters();
    }
  }, [debouncedSearch, sortField, sortDirection, perPage]);

  // Function to safely navigate with filters
  const applyFilters = () => {
    try {
      const params = {
        search: debouncedSearch,
        sort: sortField,
        direction: sortDirection,
        per_page: perPage,
        page: 1  // Reset to first page when filters change
      };

      router.get(route('info-categories.index'), params, {
        preserveState: true,
        preserveScroll: false,
        replace: true
      });
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  };

  // Handle pagination separately
  const goToPage = (page: number) => {
    if (page === currentPage) return;

    setCurrentPage(page);
    try {
      router.get(route('info-categories.index'), {
        search: debouncedSearch,
        sort: sortField,
        direction: sortDirection,
        per_page: perPage,
        page
      }, {
        preserveState: true,
        preserveScroll: true,
        replace: true
      });
    } catch (error) {
      console.error('Error navigating to page:', error);
    }
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The useEffect will handle the actual navigation
  };

  // Toggle sort direction
  const handleDirectionChange = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSortField('name');
    setSortDirection('asc');
    setPerPage(10);
  };

  // Handle delete confirmation
  const confirmDelete = () => {
    if (categoryToDelete) {
      try {
        router.delete(route('info-categories.destroy', categoryToDelete.id), {
          onSuccess: () => {
            setCategoryToDelete(null);
            setIsDeleteDialogOpen(false);
          },
          preserveScroll: true
        });
      } catch (error) {
        console.error('Error deleting category:', error);
        setCategoryToDelete(null);
        setIsDeleteDialogOpen(false);
      }
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Info Categories" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Info Categories</h1>
                <Button asChild>
                  <Link href={route('info-categories.create')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Category
                  </Link>
                </Button>
              </div>

              {/* Filters */}
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
                        <Input
                          type="search"
                          placeholder="Search categories..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="flex-1"
                        />
                        <Button type="submit" size="sm">
                          <Search className="h-4 w-4 mr-2" />
                          Search
                        </Button>
                      </form>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Select
                          value={sortField}
                          onValueChange={setSortField}
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Sort by" />
                          </SelectTrigger>
                          <SelectContent>
                            {sortOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleDirectionChange}
                          title={sortDirection === 'asc' ? 'Ascending' : 'Descending'}
                        >
                          <ArrowUpDown className={`h-4 w-4 ${sortDirection === 'asc' ? '' : 'transform rotate-180'}`} />
                        </Button>
                      </div>

                      <Select
                        value={perPage.toString()}
                        onValueChange={(value) => setPerPage(parseInt(value))}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Items per page" />
                        </SelectTrigger>
                        <SelectContent>
                          {perPageOptions.map(option => (
                            <SelectItem key={option.value} value={option.value.toString()}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Reset filters button */}
                      {(searchQuery || sortField !== 'name' || sortDirection !== 'asc' || perPage !== 10) && (
                        <Button variant="ghost" size="sm" onClick={resetFilters} className="ml-2">
                          <FilterX className="h-4 w-4 mr-2" />
                          Reset
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Active filters */}
                  {(searchQuery || sortField !== 'name' || sortDirection !== 'asc' || perPage !== 10) && (
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="text-sm text-gray-500">Active filters:</span>
                      {searchQuery && (
                        <Badge variant="secondary" className="text-xs">
                          Search: {searchQuery}
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        Sort: {sortOptions.find(o => o.value === sortField)?.label || sortField} ({sortDirection === 'asc' ? 'Ascending' : 'Descending'})
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Per page: {perPage}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.data && categories.data.length > 0 ? (
                    categories.data.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>{category.id}</TableCell>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{category.description || '-'}</TableCell>
                        <TableCell>{new Date(category.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" asChild>
                              <Link href={route('info-categories.show', category.id)}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button size="sm" variant="outline" asChild>
                              <Link href={route('info-categories.edit', category.id)}>
                                <Pencil className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setCategoryToDelete(category);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        No categories found. {searchQuery ? 'Try clearing your search filters.' : 'Create your first one!'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {categories.meta && categories.meta.last_page > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing {categories.meta.from} to {categories.meta.to} of {categories.meta.total} categories
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(categories.meta.current_page - 1)}
                      disabled={categories.meta.current_page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {categories.meta.links.slice(1, -1).map((link, index) => (
                      <Button
                        key={index}
                        variant={link.active ? "default" : "outline"}
                        size="sm"
                        onClick={() => link.url && goToPage(Number(link.label))}
                        disabled={!link.url}
                      >
                        {link.label}
                      </Button>
                    ))}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(categories.meta.current_page + 1)}
                      disabled={categories.meta.current_page === categories.meta.last_page}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
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
              This will permanently delete the category "{categoryToDelete?.name}".
              <br />
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCategoryToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
