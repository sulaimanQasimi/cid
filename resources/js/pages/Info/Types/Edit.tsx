import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface InfoType {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

interface Props {
  infoType: InfoType;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Info Management',
    href: '#',
  },
  {
    title: 'Info Types',
    href: route('info-types.index'),
  },
  {
    title: 'Edit Type',
    href: '#',
  },
];

export default function EditInfoType({ infoType }: Props) {
  const [formData, setFormData] = React.useState({
    name: infoType.name,
    description: infoType.description || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.put(route('info-types.update', infoType.id), formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Type: ${infoType.name}`} />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Edit Type</h1>
                <Button variant="outline" asChild>
                  <Link href={route('info-types.index')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Types
                  </Link>
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">Type Information</h2>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" asChild>
                        <Link href={route('info-types.index')}>
                          Cancel
                        </Link>
                      </Button>
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
