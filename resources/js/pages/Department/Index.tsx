import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Eye, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
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

interface Department {
  id: number;
  name: string;
  code: string;
  infos_count: number;
  created_at: string;
  updated_at: string;
}

interface Props {
  departments: {
    data: Department[];
    links: any[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
  flash?: {
    message?: string;
  };
}

export default function DepartmentIndex({ departments, flash }: Props) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);

  const openDeleteDialog = (department: Department) => {
    setDepartmentToDelete(department);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (departmentToDelete) {
      router.delete(route('departments.destroy', departmentToDelete.id), {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
        }
      });
    }
  };

  return (
    <AppLayout>
      <Head title="Departments" />
      <div className="container p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Departments</h1>
          <Link href={route('departments.create')}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Department
            </Button>
          </Link>
        </div>

        {flash?.message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {flash.message}
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Info Count</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.data.map((department) => (
              <TableRow key={department.id}>
                <TableCell>{department.name}</TableCell>
                <TableCell>{department.code}</TableCell>
                <TableCell>{department.infos_count}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={route('departments.show', department.id)}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                    </Link>
                    <Link href={route('departments.edit', department.id)}>
                      <Button variant="outline" size="sm">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDeleteDialog(department)}
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {departments.data.length} of {departments.total} departments
          </div>
          <div className="flex gap-2">
            {departments.current_page > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.get(route('departments.index', { page: departments.current_page - 1 }))}
              >
                Previous
              </Button>
            )}
            {departments.current_page < departments.last_page && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.get(route('departments.index', { page: departments.current_page + 1 }))}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the department {departmentToDelete?.name}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
