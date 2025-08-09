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
import { useTranslation } from '@/lib/i18n/translate';
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
  const { t } = useTranslation();
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
      <Head title={t('departments.page_title')} />
      <div className="container p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">{t('departments.page_title')}</h1>
          <Link href={route('departments.create')}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('departments.create_button')}
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
              <TableHead>{t('departments.table.name')}</TableHead>
              <TableHead>{t('departments.table.code')}</TableHead>
              <TableHead>{t('departments.table.info_count')}</TableHead>
              <TableHead className="text-right">{t('common.actions')}</TableHead>
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
                        <span className="sr-only">{t('common.view', {})}</span>
                      </Button>
                    </Link>
                    <Link href={route('departments.edit', department.id)}>
                      <Button variant="outline" size="sm">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">{t('common.edit')}</span>
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDeleteDialog(department)}
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">{t('common.delete')}</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {t('departments.showing', { current: String(departments.data.length), total: String(departments.total) })}
          </div>
          <div className="flex gap-2">
            {departments.current_page > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.get(route('departments.index', { page: departments.current_page - 1 }))}
              >
                {t('departments.prev')}
              </Button>
            )}
            {departments.current_page < departments.last_page && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.get(route('departments.index', { page: departments.current_page + 1 }))}
              >
                {t('departments.next')}
              </Button>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('common.confirm')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('departments.delete_confirm', { name: departmentToDelete?.name || '' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>{t('common.delete')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
