import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader } from '@/components/page-header';
import { ArrowLeft, Save } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import InputError from '@/components/input-error';
import { FormEventHandler } from 'react';

// Define breadcrumb navigation
const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Incident Categories',
    href: route('incident-categories.index'),
  },
  {
    title: 'Create',
    href: route('incident-categories.create'),
  },
];

// Define color options for the color picker
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
  // Initialize form with useForm hook
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    code: '',
    description: '',
    color: '#3b82f6', // Default color
    severity_level: '3', // Default level
    status: 'active',
  });

  // Handle form submission
  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('incident-categories.store'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Incident Category" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <PageHeader
          title="Create Incident Category"
          description="Add a new incident category to the system"
          actions={
            <Button variant="outline" asChild>
              <Link href={route('incident-categories.index')}>
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
              <CardDescription>Enter the details for the new incident category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    placeholder="Category name"
                    required
                  />
                  <InputError message={errors.name} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">Code</Label>
                  <Input
                    id="code"
                    value={data.code}
                    onChange={e => setData('code', e.target.value)}
                    placeholder="e.g. CAT-01"
                  />
                  <InputError message={errors.code} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={e => setData('description', e.target.value)}
                  placeholder="Provide a description of this category"
                  rows={3}
                />
                <InputError message={errors.description} />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <div className="flex items-center space-x-2">
                    <div
                      className="h-8 w-8 rounded-full border"
                      style={{ backgroundColor: data.color || '#e2e8f0' }}
                    ></div>
                    <Input
                      id="color"
                      value={data.color}
                      onChange={e => setData('color', e.target.value)}
                      placeholder="Color code"
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
                  <Label htmlFor="severity_level">Severity Level <span className="text-destructive">*</span></Label>
                  <Select
                    value={data.severity_level}
                    onValueChange={(value) => setData('severity_level', value)}
                    required
                  >
                    <SelectTrigger id="severity_level">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Level 1 (Low)</SelectItem>
                      <SelectItem value="2">Level 2</SelectItem>
                      <SelectItem value="3">Level 3 (Medium)</SelectItem>
                      <SelectItem value="4">Level 4</SelectItem>
                      <SelectItem value="5">Level 5 (High)</SelectItem>
                    </SelectContent>
                  </Select>
                  <InputError message={errors.severity_level} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status <span className="text-destructive">*</span></Label>
                  <Select
                    value={data.status}
                    onValueChange={(value) => setData('status', value)}
                    required
                  >
                    <SelectTrigger id="status">
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
                <Link href={route('incident-categories.index')}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={processing}>
                <Save className="mr-2 h-4 w-4" />
                {processing ? 'Creating...' : 'Create Category'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </AppLayout>
  );
}
