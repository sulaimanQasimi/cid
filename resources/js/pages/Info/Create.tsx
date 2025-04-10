import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type InfoType, type InfoCategory } from '@/types/info';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Info Management',
    href: '#',
  },
  {
    title: 'Info Records',
    href: route('infos.index'),
  },
  {
    title: 'Create',
    href: route('infos.create'),
  },
];

interface Props {
  infoTypes?: InfoType[];
  infoCategories?: InfoCategory[];
}

export default function InfoCreate({ infoTypes = [], infoCategories = [] }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    code: '',
    description: '',
    info_type_id: '',
    info_category_id: '',
    value: {
      content: ''
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('infos.store'), {
      onSuccess: () => {
        // Redirect happens automatically from the controller
      }
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Info Record" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Create Info Record</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="info_type_id">Type <span className="text-red-500">*</span></Label>
                    <Select
                      value={data.info_type_id}
                      onValueChange={(value) => setData('info_type_id', value)}
                      required
                    >
                      <SelectTrigger id="info_type_id">
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent>
                        {infoTypes.length > 0 ? (
                          infoTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id.toString()}>
                              {type.name}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-sm text-gray-500">No types available</div>
                        )}
                      </SelectContent>
                    </Select>
                    {errors.info_type_id && <p className="text-sm text-red-500">{errors.info_type_id}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="info_category_id">Category <span className="text-red-500">*</span></Label>
                    <Select
                      value={data.info_category_id}
                      onValueChange={(value) => setData('info_category_id', value)}
                      required
                    >
                      <SelectTrigger id="info_category_id">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {infoCategories.length > 0 ? (
                          infoCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-sm text-gray-500">No categories available</div>
                        )}
                      </SelectContent>
                    </Select>
                    {errors.info_category_id && <p className="text-sm text-red-500">{errors.info_category_id}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">Code</Label>
                  <Input
                    id="code"
                    value={data.code}
                    onChange={(e) => setData('code', e.target.value)}
                    placeholder="Unique identifier (optional)"
                  />
                  {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                  <p className="text-sm text-gray-500">A unique identifier for this record. Can contain letters, numbers, underscores, and hyphens.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    rows={3}
                  />
                  {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={data.value.content}
                    onChange={(e) => setData('value', { ...data.value, content: e.target.value })}
                    rows={5}
                  />
                  {errors.value && <p className="text-sm text-red-500">{errors.value}</p>}
                </div>
              </CardContent>

              <CardFooter className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={processing}>Save</Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
