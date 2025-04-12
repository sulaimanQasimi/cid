import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Label } from '@/components/ui/label';

interface Department {
  id: number;
  name: string;
  code: string;
}

interface Props extends PageProps {
  department: Department;
}

export default function DepartmentEdit({ department }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    name: department.name,
    code: department.code,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('departments.update', department.id));
  };

  return (
    <AppLayout>
      <Head title={`Edit Department: ${department.name}`} />
      <div className="container p-6">
        <div className="mb-6">
          <Link href={route('departments.index')}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Departments
            </Button>
          </Link>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Edit Department: {department.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder="Enter department name"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  value={data.code}
                  onChange={(e) => setData('code', e.target.value)}
                  placeholder="Enter department code"
                  className={errors.code ? 'border-red-500' : ''}
                />
                {errors.code && (
                  <p className="text-red-500 text-sm mt-1">{errors.code}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={processing}
              >
                Update Department
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
