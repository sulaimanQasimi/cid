import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { FormEventHandler } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Color options
const colorOptions = [
  '#4f46e5', // Indigo
  '#3b82f6', // Blue
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#84cc16', // Lime
  '#eab308', // Yellow
  '#f97316', // Orange
  '#ef4444', // Red
  '#ec4899', // Pink
  '#8b5cf6', // Purple
  '#a3a3a3', // Gray
];

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    label: '',
    color: '#4f46e5',
    status: 'active',
  });

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
    },
    {
      title: 'Settings',
      href: '#',
    },
    {
      title: 'Stat Categories',
      href: route('stat-categories.index'),
    },
    {
      title: 'Create',
      href: route('stat-categories.create'),
    },
  ];

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('stat-categories.store'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Stat Category" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <PageHeader
          title="Create Statistical Category"
          description="Add a new statistical category to the system"
          actions={
            <Button variant="outline" asChild>
              <Link href={route('stat-categories.index')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Categories
              </Link>
            </Button>
          }
        />

        <form onSubmit={submit}>
          <Card>
            <CardHeader>
              <CardTitle>Category Information</CardTitle>
              <CardDescription>Enter the details for the new category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="system_name"
                  />
                  <p className="text-xs text-muted-foreground">
                    System name should be lowercase with underscores instead of spaces.
                  </p>
                  <InputError message={errors.name} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="label">Display Label</Label>
                  <Input
                    id="label"
                    value={data.label}
                    onChange={(e) => setData('label', e.target.value)}
                    placeholder="Display Label"
                  />
                  <p className="text-xs text-muted-foreground">
                    This is how the category will be displayed to users.
                  </p>
                  <InputError message={errors.label} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <div className="flex items-center space-x-2">
                    <div
                      className="h-8 w-8 rounded-full border"
                      style={{ backgroundColor: data.color }}
                    ></div>
                    <Input
                      id="color"
                      value={data.color}
                      onChange={(e) => setData('color', e.target.value)}
                      placeholder="#4f46e5"
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`h-6 w-6 rounded-full border ${
                          data.color === color ? 'ring-2 ring-primary ring-offset-2' : ''
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setData('color', color)}
                      />
                    ))}
                  </div>
                  <InputError message={errors.color} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={data.status}
                    onValueChange={(value) => setData('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <InputError message={errors.status} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" asChild>
                <Link href={route('stat-categories.index')}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={processing}>
                {processing ? 'Creating...' : 'Create Category'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </AppLayout>
  );
}
