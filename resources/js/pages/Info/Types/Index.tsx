import React, { useState } from 'react';
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

interface InfoType {
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
  types: {
    data: InfoType[];
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
    title: 'Info Types',
    href: route('info-types.index'),
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

export default function InfoTypesIndex({ types, filters }: Props) {
  const [searchQuery, setSearchQuery] = useState(filters.search);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState<InfoType | null>(null);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters({ search: searchQuery });
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    applyFilters({ sort: value });
  };

  // Handle direction change
  const handleDirectionChange = () => {
    const newDirection = filters.direction === 'asc' ? 'desc' : 'asc';
    applyFilters({ direction: newDirection });
  };

  // Handle per page change
  const handlePerPageChange = (value: string) => {
    applyFilters({ per_page: parseInt(value) });
  };

  // Navigate to page
  const goToPage = (page: number) => {
    router.get(route('info-types.index'),
      { ...filters, page },
      { preserveState: true, preserveScroll: true }
    );
  };

  // Apply filters to the URL
  const applyFilters = (newFilters: Partial<Props['filters']>) => {
    router.get(route('info-types.index'),
      { ...filters, ...newFilters, page: 1 },
      { preserveState: true, preserveScroll: true }
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    router.get(route('info-types.index'), {
      search: '',
      sort: 'name',
      direction: 'asc',
      per_page: 10,
      page: 1
    });
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (type: InfoType) => {
    setTypeToDelete(type);
    setIsDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const confirmDelete = () => {
    if (typeToDelete) {
      router.delete(route('info-types.destroy', typeToDelete.id), {
        onSuccess: () => {
          setTypeToDelete(null);
          setIsDeleteDialogOpen(false);
        },
      });
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Info Types" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Info Types</h1>
                <Button asChild>
                  <Link href={route('info-types.create')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Type
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
                          placeholder="Search types..."
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
                          value={filters.sort}
                          onValueChange={handleSortChange}
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
                          title={filters.direction === 'asc' ? 'Ascending' : 'Descending'}
                        >
                          <ArrowUpDown className={`h-4 w-4 ${filters.direction === 'asc' ? '' : 'transform rotate-180'}`} />
                        </Button>
                      </div>

                      <Select
                        value={filters.per_page.toString()}
                        onValueChange={handlePerPageChange}
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
                      {(filters.search || filters.sort !== 'name' || filters.direction !== 'asc' || filters.per_page !== 10) && (
                        <Button variant="ghost" size="sm" onClick={resetFilters} className="ml-2">
                          <FilterX className="h-4 w-4 mr-2" />
                          Reset
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Active filters */}
                  {(filters.search || filters.sort !== 'name' || filters.direction !== 'asc' || filters.per_page !== 10) && (
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="text-sm text-gray-500">Active filters:</span>
                      {filters.search && (
                        <Badge variant="secondary" className="text-xs">
                          Search: {filters.search}
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        Sort: {sortOptions.find(o => o.value === filters.sort)?.label || filters.sort} ({filters.direction === 'asc' ? 'Ascending' : 'Descending'})
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Per page: {filters.per_page}
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
                  {types.data && types.data.length > 0 ? (
                    types.data.map((type) => (
                      <TableRow key={type.id}>
                        <TableCell>{type.id}</TableCell>
                        <TableCell className="font-medium">{type.name}</TableCell>
                        <TableCell>{type.description || '-'}</TableCell>
                        <TableCell>{new Date(type.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" asChild>
                              <Link href={route('info-types.show', type.id)}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button size="sm" variant="outline" asChild>
                              <Link href={route('info-types.edit', type.id)}>
                                <Pencil className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => openDeleteDialog(type)}
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
                        No types found. {filters.search ? 'Try clearing your search filters.' : 'Create your first one!'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {types.meta && types.meta.last_page > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing {types.meta.from} to {types.meta.to} of {types.meta.total} types
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(types.meta.current_page - 1)}
                      disabled={types.meta.current_page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {types.meta.links.slice(1, -1).map((link, index) => (
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
                      onClick={() => goToPage(types.meta.current_page + 1)}
                      disabled={types.meta.current_page === types.meta.last_page}
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
              This will permanently delete the type "{typeToDelete?.name}".
              <br />
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTypeToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
