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
  return (
    <AppLayout>
      <Head title={`Department: ${department.name}`} />
      <div className="container p-6">
        <div className="mb-6 flex justify-between">
          <Link href={route('departments.index')}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Departments
            </Button>
          </Link>
          <Link href={route('departments.edit', department.id)}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit Department
            </Button>
          </Link>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Department Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{department.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Code</dt>
                  <dd className="mt-1 text-sm text-gray-900">{department.code}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created At</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(department.created_at).toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Updated At</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(department.updated_at).toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Total Info Records</dt>
                  <dd className="mt-1">
                    <Badge>{department.infos.length}</Badge>
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Associated Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
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
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                        No information records found for this department
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
