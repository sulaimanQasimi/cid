import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { InfoType } from '@/types/info';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';

interface Props {
  infoType: InfoType;
}

export default function EditInfoType({ infoType }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    name: infoType.name,
    code: infoType.code || '',
    description: infoType.description || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('info-types.update', infoType.id));
  };

  return (
    <>
      <Head title={`Edit Info Type: ${infoType.name}`} />
      <div className="py-12">
        <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold">Edit Info Type</CardTitle>
                <Link href={route('info-types.index')}>
                  <Button
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    <ArrowLeft size={16} />
                    <span>Back to List</span>
                  </Button>
                </Link>
              </div>
              <CardDescription>
                Update the information type details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name <span className="text-red-600">*</span></Label>
                  <Input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('name', e.target.value)}
                    required
                    placeholder="Enter type name"
                    className={errors.name ? 'border-red-500' : ''}
                    disabled={processing}
                  />
                  {errors.name && (
                    <div className="text-red-500 text-sm mt-1">{errors.name}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">Code</Label>
                  <Input
                    id="code"
                    type="text"
                    value={data.code}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('code', e.target.value)}
                    placeholder="Enter unique code (optional)"
                    className={errors.code ? 'border-red-500' : ''}
                    disabled={processing}
                  />
                  {errors.code && (
                    <div className="text-red-500 text-sm mt-1">{errors.code}</div>
                  )}
                  <p className="text-gray-500 text-sm mt-1">
                    Unique identifier code. Can contain letters, numbers, underscores, dashes and periods.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                    placeholder="Enter type description (optional)"
                    className={errors.description ? 'border-red-500' : ''}
                    disabled={processing}
                    rows={4}
                  />
                  {errors.description && (
                    <div className="text-red-500 text-sm mt-1">{errors.description}</div>
                  )}
                </div>

                <div className="flex justify-end gap-3">
                  <Link href={route('info-types.index')}>
                    <Button type="button" variant="outline" disabled={processing}>
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" disabled={processing} className="flex items-center gap-1">
                    <Save size={16} />
                    <span>{processing ? 'Saving...' : 'Save'}</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
