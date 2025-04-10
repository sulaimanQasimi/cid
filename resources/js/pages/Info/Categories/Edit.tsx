import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';

interface InfoCategory {
  id: number;
  name: string;
  code: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

interface Props {
  infoCategory: InfoCategory;
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
  {
    title: 'Edit Category',
    href: '#',
  },
];

export default function InfoCategoryEdit({ infoCategory }: Props) {
  const { data, setData, patch, processing, errors } = useForm({
    name: infoCategory.name || '',
    code: infoCategory.code || '',
    description: infoCategory.description || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    patch(route('info-categories.update', infoCategory.id));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Category: ${infoCategory.name}`} />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">Edit Category</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href={route('info-categories.index')}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Categories
                </Link>
              </Button>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('name', e.target.value)}
                    required
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">Code</Label>
                  <Input
                    id="code"
                    value={data.code}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('code', e.target.value)}
                    placeholder="Unique identifier (optional)"
                  />
                  {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                  <p className="text-sm text-gray-500">A unique identifier for this category. Can contain letters, numbers, underscores, and hyphens.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                    rows={3}
                  />
                  {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                </div>
              </CardContent>

              <CardFooter className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                  disabled={processing}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                  {processing ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}