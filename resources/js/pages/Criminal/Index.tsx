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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { format } from 'date-fns';

interface Criminal {
  id: number;
  photo: string | null;
  number: string | null;
  name: string;
  father_name: string | null;
  grandfather_name: string | null;
  id_card_number: string | null;
  phone_number: string | null;
  original_residence: string | null;
  current_residence: string | null;
  crime_type: string | null;
  arrest_location: string | null;
  arrested_by: string | null;
  arrest_date: string | null;
  referred_to: string | null;
  final_verdict: string | null;
  notes: string | null;
  department_id: number | null;
  created_by: number;
  created_at: string;
  updated_at: string;
  department?: {
    id: number;
    name: string;
    code: string;
  } | null;
  creator?: {
    id: number;
    name: string;
  };
}

interface Department {
  id: number;
  name: string;
  code: string;
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
  criminals: {
    data?: Criminal[];
    links?: PaginationLinks;
    meta?: PaginationMeta;
  };
  departments: Department[];
  filters: {
    search: string;
    sort: string;
    direction: string;
    per_page: number;
    department_id?: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Criminal Records',
    href: route('criminals.index'),
  },
];

const sortOptions = [
  { value: 'name', label: 'Name' },
  { value: 'number', label: 'Number' },
  { value: 'crime_type', label: 'Crime Type' },
  { value: 'arrest_date', label: 'Arrest Date' },
  { value: 'department_id', label: 'Department' },
  { value: 'created_at', label: 'Created Date' },
  { value: 'updated_at', label: 'Updated Date' },
];

const perPageOptions = [
  { value: 10, label: '10 per page' },
  { value: 25, label: '25 per page' },
  { value: 50, label: '50 per page' },
  { value: 100, label: '100 per page' },
];

export default function CriminalIndex({
  criminals = {
    data: [],
    links: { first: null, last: null, prev: null, next: null },
    meta: {
      current_page: 1,
      from: 1,
      last_page: 1,
      links: [],
      path: '',
      per_page: 10,
      to: 0,
      total: 0
    }
  },
  departments = [],
  filters
}: Props) {
  const [searchQuery, setSearchQuery] = useState(filters.search);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [criminalToDelete, setCriminalToDelete] = useState<Criminal | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>(filters.department_id || '');

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

  // Handle department filter change
  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value);
    applyFilters({ department_id: value === "_all" ? undefined : value });
  };

  // Navigate to page
  const goToPage = (page: number) => {
    router.get(route('criminals.index'),
      { ...filters, page },
      { preserveState: true, preserveScroll: true }
    );
  };

  // Apply filters to the URL
  const applyFilters = (newFilters: Partial<Props['filters']>) => {
    router.get(route('criminals.index'),
      { ...filters, ...newFilters, page: 1 },
      { preserveState: true, preserveScroll: true }
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDepartment('');
    router.get(route('criminals.index'), {
      search: '',
      sort: 'created_at',
      direction: 'desc',
      per_page: 10,
      page: 1,
      department_id: undefined
    });
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (criminal: Criminal) => {
    setCriminalToDelete(criminal);
    setIsDeleteDialogOpen(true);
  };

  // Confirm and execute delete
  const confirmDelete = () => {
    if (criminalToDelete) {
      router.delete(route('criminals.destroy', criminalToDelete.id), {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setCriminalToDelete(null);
        },
      });
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Criminal Records" />

      <div className="container px-0 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Criminal Records</h2>
            <p className="text-sm text-neutral-500">Manage and track criminal records</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild size="sm">
              <Link href={route('criminals.create')}>
                <Plus className="mr-2 h-4 w-4" />
                Add Criminal
              </Link>
            </Button>
          </div>
        </div>

        <Card className="mt-6">
          <CardHeader className="py-4">
            <CardTitle className="text-base font-medium">Search and Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row">
              {/* Search Bar */}
              <div className="flex-1">
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                  <Input
                    placeholder="Search by name, number, crime type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                  <Button type="submit" variant="outline" size="sm">
                    <Search className="h-4 w-4" />
                  </Button>
                </form>
              </div>

              {/* Department Filter */}
              <div className="w-full md:w-56">
                <Select value={selectedDepartment} onValueChange={handleDepartmentChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_all">All Departments</SelectItem>
                    {departments.map((department) => (
                      <SelectItem key={department.id} value={department.id.toString()}>
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Options */}
              <div className="w-full md:w-44">
                <Select value={filters.sort} onValueChange={handleSortChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Direction Button */}
              <div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleDirectionChange}
                  title={`Sort ${filters.direction === 'asc' ? 'Descending' : 'Ascending'}`}
                >
                  <ArrowUpDown className={`h-4 w-4 ${filters.direction === 'desc' ? 'rotate-180' : ''}`} />
                </Button>
              </div>

              {/* Per Page Options */}
              <div className="w-full md:w-40">
                <Select value={filters.per_page.toString()} onValueChange={handlePerPageChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Items per page" />
                  </SelectTrigger>
                  <SelectContent>
                    {perPageOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Reset Filters Button */}
              <div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={resetFilters}
                  title="Reset all filters"
                >
                  <FilterX className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Table */}
        <div className="mt-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Number</TableHead>
                    <TableHead>Crime Type</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Arrest Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {criminals.data && criminals.data.length > 0 ? (
                    criminals.data.map((criminal) => (
                      <TableRow key={criminal.id}>
                        <TableCell className="font-medium">{criminal.name}</TableCell>
                        <TableCell>{criminal.number || 'N/A'}</TableCell>
                        <TableCell>{criminal.crime_type || 'N/A'}</TableCell>
                        <TableCell>
                          {criminal.department ? (
                            <Badge variant="outline">{criminal.department.name}</Badge>
                          ) : (
                            'N/A'
                          )}
                        </TableCell>
                        <TableCell>
                          {criminal.arrest_date ? (
                            format(new Date(criminal.arrest_date), 'MMM d, yyyy')
                          ) : (
                            'N/A'
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                              title="View"
                            >
                              <Link href={route('criminals.show', criminal.id)}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                              title="Edit"
                            >
                              <Link href={route('criminals.edit', criminal.id)}>
                                <Pencil className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDeleteDialog(criminal)}
                              title="Delete"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No criminal records found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Pagination */}
        {criminals.meta && criminals.meta.last_page > 1 && (
          <div className="mt-4 flex justify-center">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(1)}
                disabled={criminals.meta.current_page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <ChevronLeft className="h-4 w-4 -ml-2" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(criminals.meta.current_page - 1)}
                disabled={criminals.meta.current_page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="px-2 text-sm text-muted-foreground">
                Page {criminals.meta.current_page} of {criminals.meta.last_page}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(criminals.meta.current_page + 1)}
                disabled={criminals.meta.current_page === criminals.meta.last_page}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(criminals.meta.last_page)}
                disabled={criminals.meta.current_page === criminals.meta.last_page}
              >
                <ChevronRight className="h-4 w-4" />
                <ChevronRight className="h-4 w-4 -ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the criminal record for{' '}
              <strong>{criminalToDelete?.name}</strong>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
