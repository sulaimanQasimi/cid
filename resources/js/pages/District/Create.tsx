import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/page-header';
import { ArrowLeft, Save } from 'lucide-react';
import { FormEventHandler } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import InputError from '@/components/input-error';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProvinceData {
  id: number;
  name: string;
}

interface CreateProps {
  provinces: ProvinceData[];
}

export default function Create({ provinces }: CreateProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
    },
    {
      title: 'Districts',
      href: route('districts.index'),
    },
    {
      title: 'Create',
      href: route('districts.create'),
    },
  ];

  const { data, setData, post, processing, errors } = useForm({
    name: '',
    code: '',
    description: '',
    province_id: '',
    status: 'active',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('districts.store'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create District" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <PageHeader
          title="Create District"
          description="Add a new district to the system"
          actions={
            <Button variant="outline" asChild>
              <Link href={route('districts.index')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Districts
              </Link>
            </Button>
          }
        />

        <form onSubmit={submit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>District Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Enter district name"
                    required
                  />
                  <InputError message={errors.name} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">Code <span className="text-destructive">*</span></Label>
                  <Input
                    id="code"
                    value={data.code}
                    onChange={(e) => setData('code', e.target.value)}
                    placeholder="e.g. DST-001"
                    required
                  />
                  <InputError message={errors.code} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="province_id">Province <span className="text-destructive">*</span></Label>
                <Select
                  value={data.province_id}
                  onValueChange={(value) => setData('province_id', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a province" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map(province => (
                      <SelectItem key={province.id} value={province.id.toString()}>
                        {province.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <InputError message={errors.province_id} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  placeholder="Enter district description"
                  rows={4}
                />
                <InputError message={errors.description} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status <span className="text-destructive">*</span></Label>
                <Select
                  value={data.status}
                  onValueChange={(value) => setData('status', value)}
                  required
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
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button
                variant="outline"
                type="button"
                asChild
              >
                <Link href={route('districts.index')}>
                  Cancel
                </Link>
              </Button>
              <Button type="submit" disabled={processing}>
                <Save className="mr-2 h-4 w-4" />
                Create District
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </AppLayout>
  );
}
