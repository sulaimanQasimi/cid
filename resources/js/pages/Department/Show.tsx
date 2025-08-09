import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/lib/i18n/translate';

interface Info {
  id: number;
  name: string;
  code: string;
  description: string;
  info_type: {
    id: number;
    name: string;
  };
  info_category: {
    id: number;
    name: string;
  };
  created_at: string;
}

interface Department {
  id: number;
  name: string;
  code: string;
  created_at: string;
  updated_at: string;
  infos: Info[];
}

interface Props {
  department: Department;
}

export default function DepartmentShow({ department }: Props) {
  const { t } = useTranslation();
  return (
    <AppLayout>
      <Head title={t('departments.show_title', { name: department.name })} />
      <div className="container p-6">
        <div className="mb-6 flex justify-between">
          <Link href={route('departments.index')}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('departments.back_to_list')}
            </Button>
          </Link>
          <Link href={route('departments.edit', department.id)}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              {t('departments.edit_button')}
            </Button>
          </Link>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('departments.details_title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">{t('departments.form.name')}</dt>
                  <dd className="mt-1 text-sm text-gray-900">{department.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">{t('departments.form.code')}</dt>
                  <dd className="mt-1 text-sm text-gray-900">{department.code}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">{t('departments.created_at')}</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(department.created_at).toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">{t('departments.updated_at')}</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(department.updated_at).toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">{t('departments.total_info')}</dt>
                  <dd className="mt-1">
                    <Badge>{department.infos.length}</Badge>
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('departments.associated_info')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('departments.form.name')}</TableHead>
                    <TableHead>{t('departments.form.code')}</TableHead>
                    <TableHead>{t('departments.table.type')}</TableHead>
                    <TableHead>{t('departments.table.category')}</TableHead>
                    <TableHead className="text-right">{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {department.infos.length > 0 ? (
                    department.infos.map((info) => (
                      <TableRow key={info.id}>
                        <TableCell>{info.name}</TableCell>
                        <TableCell>{info.code}</TableCell>
                        <TableCell>{info.info_type.name}</TableCell>
                        <TableCell>{info.info_category.name}</TableCell>
                        <TableCell className="text-right">
                          <Link href={route('infos.show', info.id)}>
                            <Button variant="outline" size="sm">
                              {t('common.view', {})}
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                        {t('departments.no_info')}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
