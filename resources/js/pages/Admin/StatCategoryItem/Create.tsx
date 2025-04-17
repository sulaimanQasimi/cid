import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { FormEventHandler, useEffect } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';

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

interface CategoryData {
  id: number;
  name: string;
  label: string;
  color: string;
}

interface CreateProps {
  categories: CategoryData[];
  preselected_category_id?: string;
}

export default function Create({ categories, preselected_category_id }: CreateProps) {
  const { data, setData, post, processing, errors } = useForm({
    stat_category_id: preselected_category_id || '',
    name: '',
    label: '',
    color: '',
    status: 'active',
    order: 0,
    redirect_to_category: false,
  });

  // If a category is selected, find its color for reference
  const selectedCategory = categories.find(c => c.id.toString() === data.stat_category_id);

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
      title: 'Category Items',
      href: data.stat_category_id
        ? route('stat-category-items.index', { category_id: data.stat_category_id })
        : route('stat-category-items.index'),
    },
    {
      title: 'Create',
      href: route('stat-category-items.create'),
    },
  ];

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('stat-category-items.store'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Category Item" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <PageHeader
          title="Create Category Item"
          description="Add a new item to a statistical category"
          actions={
            <Button variant="outline" asChild>
              <Link href={data.stat_category_id
                ? route('stat-category-items.index', { category_id: data.stat_category_id })
                : route('stat-category-items.index')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Items
              </Link>
            </Button>
          }
        />

        <form onSubmit={submit}>
          <Card>
            <CardHeader>
              <CardTitle>Item Information</CardTitle>
              <CardDescription>Enter the details for the new category item</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={data.stat_category_id}
                  onValueChange={(value) => setData('stat_category_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        <div className="flex items-center">
                          <div
                            className="mr-2 h-3 w-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          ></div>
                          {category.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <InputError message={errors.stat_category_id} />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Item Name</Label>
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
                    This is how the item will be displayed to users.
                  </p>
                  <InputError message={errors.label} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="color">Color (Optional)</Label>
                  <div className="flex items-center space-x-2">
                    <div
                      className="h-8 w-8 rounded-full border"
                      style={{ backgroundColor: data.color || (selectedCategory?.color || '#e2e8f0') }}
                    ></div>
                    <Input
                      id="color"
                      value={data.color}
                      onChange={(e) => setData('color', e.target.value)}
                      placeholder={selectedCategory?.color || "Optional override"}
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
                    {selectedCategory && (
                      <button
                        type="button"
                        className={`h-6 w-6 rounded-full border ${
                          data.color === '' ? 'ring-2 ring-primary ring-offset-2' : ''
                        }`}
                        style={{ backgroundColor: selectedCategory.color }}
                        onClick={() => setData('color', '')}
                        title="Use category default"
                      />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Leave empty to use the category's default color.
                  </p>
                  <InputError message={errors.color} />
                </div>

                <div className="grid grid-cols-1 gap-4">
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

                  <div className="space-y-2">
                    <Label htmlFor="order">Display Order</Label>
                    <Input
                      id="order"
                      type="number"
                      min="0"
                      value={data.order.toString()}
                      onChange={(e) => setData('order', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                    <p className="text-xs text-muted-foreground">
                      Lower numbers appear first. Leave at 0 to add at the end.
                    </p>
                    <InputError message={errors.order} />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-4">
                <Checkbox
                  id="redirect_to_category"
                  checked={data.redirect_to_category}
                  onCheckedChange={(checked) =>
                    setData('redirect_to_category', checked === true)
                  }
                />
                <Label
                  htmlFor="redirect_to_category"
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  After saving, redirect to the category details page
                </Label>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" asChild>
                <Link href={data.stat_category_id
                  ? route('stat-category-items.index', { category_id: data.stat_category_id })
                  : route('stat-category-items.index')}
                >
                  Cancel
                </Link>
              </Button>
              <Button type="submit" disabled={processing}>
                {processing ? 'Creating...' : 'Create Item'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </AppLayout>
  );
}
