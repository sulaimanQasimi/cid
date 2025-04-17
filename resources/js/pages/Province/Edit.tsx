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
  code: string;
  description: string | null;
  governor: string | null;
  capital: string | null;
  status: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface EditProps {
  province: ProvinceData;
}

export default function Edit({ province }: EditProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
    },
    {
      title: 'Provinces',
      href: route('provinces.index'),
    },
    {
      title: province.name,
      href: route('provinces.show', province.id),
    },
    {
      title: 'Edit',
      href: route('provinces.edit', province.id),
    },
  ];

  const { data, setData, put, processing, errors } = useForm({
    name: province.name || '',
    code: province.code || '',
    description: province.description || '',
    governor: province.governor || '',
    capital: province.capital || '',
    status: province.status || 'active',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    put(route('provinces.update', province.id));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Province - ${province.name}`} />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <PageHeader
          title={`Edit Province: ${province.name}`}
          description="Update province information"
          actions={
            <Button variant="outline" asChild>
              <Link href={route('provinces.show', province.id)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Province
              </Link>
            </Button>
          }
        />

        <form onSubmit={submit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Province Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Enter province name"
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
                    placeholder="e.g. KBL"
                    required
                  />
                  <InputError message={errors.code} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="governor">Governor</Label>
                  <Input
                    id="governor"
                    value={data.governor}
                    onChange={(e) => setData('governor', e.target.value)}
                    placeholder="Enter governor name"
                  />
                  <InputError message={errors.governor} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capital">Capital</Label>
                  <Input
                    id="capital"
                    value={data.capital}
                    onChange={(e) => setData('capital', e.target.value)}
                    placeholder="Enter capital city name"
                  />
                  <InputError message={errors.capital} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  placeholder="Enter province description"
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
                <Link href={route('provinces.show', province.id)}>
                  Cancel
                </Link>
              </Button>
              <Button type="submit" disabled={processing}>
                <Save className="mr-2 h-4 w-4" />
                Update Province
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </AppLayout>
  );
}
