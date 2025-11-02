import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Pagination } from '@/components/pagination';
import { useTranslation } from '@/lib/i18n/translate';

interface Permission {
  id: number;
  name: string;
  label?: string;
  guard_name: string;
}

interface PermissionIndexProps {
  auth: {
    user: any;
  };
  permissions: {
    data: Permission[];
    links: any[];
    current_page: number;
    last_page: number;
    total?: number;
  };
  filters?: {
    search?: string;
    sort?: string;
    direction?: string;
    per_page?: number;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'System Administration',
    href: '#',
  },
  {
    title: 'Permissions',
    href: route('permissions.index'),
  },
];

export default function Index({ auth, permissions, filters = {} }: PermissionIndexProps) {
  const { t } = useTranslation();

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('permissions.permissions_list')} />

      <div className="container px-0 py-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm mb-6">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{t('permissions.permissions_list')}</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('permissions.list_description')}</p>
                </div>
              </div>
              {permissions.total !== undefined && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {permissions.total}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t('permissions.total_permissions')}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Permissions Table */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-hidden rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
                    <TableHead className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">{t('permissions.table.id')}</TableHead>
                    <TableHead className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">{t('permissions.table.name')}</TableHead>
                    <TableHead className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">{t('permissions.table.guard_name')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions?.data && permissions.data.length > 0 ? (
                    permissions.data.map((permission) => (
                      <TableRow 
                        key={permission.id} 
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors border-b border-gray-200 dark:border-gray-700"
                      >
                        <TableCell className="px-6 py-4 text-gray-900 dark:text-gray-100 font-medium">
                          {permission.id}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-gray-900 dark:text-gray-100">
                          {permission.label || permission.name}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-400">
                          {permission.guard_name || 'web'}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        {t('permissions.no_permissions_found')}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        {permissions?.data && permissions.data.length > 0 && permissions.links && permissions.links.length > 0 && (
          <div className="mt-6 flex justify-center">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <Pagination links={permissions.links} />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
