import React, { useState, lazy, Suspense, useEffect } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin } from 'lucide-react';

// Import the LocationSelector component directly to avoid issues with lazy loading
import LocationSelector from '@/components/LocationSelector';

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

interface Department {
  id: number;
  name: string;
  code: string;
}

interface Props {
  infoTypes?: InfoType[];
  infoCategories?: InfoCategory[];
  departments?: Department[];
}

export default function InfoCreate({ infoTypes = [], infoCategories = [], departments = [] }: Props) {
  // Content tabs state
  const [activeTab, setActiveTab] = useState<string>('basic');

  // Flag to track map mounting
  const [isMapTabMounted, setIsMapTabMounted] = useState(false);

  // Location data state
  const [location, setLocation] = useState<{ lat: number, lng: number, province?: string } | null>(null);

  const { data, setData, post, processing, errors } = useForm({
    name: '',
    code: '',
    description: '',
    info_type_id: '',
    info_category_id: '',
    department_id: 'none',
    value: {
      content: '',
      location: null as { lat: number, lng: number, province?: string } | null
    }
  });

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'location') {
      setIsMapTabMounted(true);
    }
  };

  // Handle location change
  const handleLocationChange = (newLocation: { lat: number, lng: number, province: string } | null) => {
    setLocation(newLocation);
    setData('value', {
      ...data.value,
      location: newLocation
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('infos.store'), {
      onSuccess: () => {
        // Redirect happens automatically from the controller
      }
    });
  };

  // Load map component when needed
  useEffect(() => {
    if (activeTab === 'location') {
      setIsMapTabMounted(true);
    }
  }, [activeTab]);

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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                  <div className="space-y-2">
                    <Label htmlFor="department_id">Department</Label>
                    <Select
                      value={data.department_id}
                      onValueChange={(value) => setData('department_id', value)}
                    >
                      <SelectTrigger id="department_id">
                        <SelectValue placeholder="Select a department (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {departments.length > 0 ? (
                          departments.map((department) => (
                            <SelectItem key={department.id} value={department.id.toString()}>
                              {department.name}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-sm text-gray-500">No departments available</div>
                        )}
                      </SelectContent>
                    </Select>
                    {errors.department_id && <p className="text-sm text-red-500">{errors.department_id}</p>}
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

                {/* Content section with tabs */}
                <div className="space-y-2">
                  <Label>Content</Label>

                  <Tabs defaultValue="basic" value={activeTab} onValueChange={handleTabChange}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="basic">Basic Content</TabsTrigger>
                      <TabsTrigger value="location" className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        Location
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="pt-4">
                      <Textarea
                        id="content"
                        value={data.value.content}
                        onChange={(e) => setData('value', { ...data.value, content: e.target.value })}
                        rows={5}
                        placeholder="Enter content here..."
                      />
                    </TabsContent>

                    <TabsContent value="location" className="pt-4">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">Click on the map to select a location in Afghanistan.</p>
                        {isMapTabMounted && (
                          <LocationSelector
                            value={location}
                            onChange={handleLocationChange}
                          />
                        )}
                        {!isMapTabMounted && (
                          <div className="h-[400px] flex items-center justify-center bg-gray-100 rounded-md">
                            Loading map...
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>

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
