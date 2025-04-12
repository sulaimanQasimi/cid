import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Camera, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface Criminal {
  id: number;
  photo: string | null;
  number: string | null;
  name: string;
  father_name: string | null;
  grandfather_name: string | null;
  id_card_number: string | null;
  phone_number: string | null;
  original_residence: string | null;
  current_residence: string | null;
  crime_type: string | null;
  arrest_location: string | null;
  arrested_by: string | null;
  arrest_date: string | null;
  referred_to: string | null;
  final_verdict: string | null;
  notes: string | null;
  department_id: number | null;
  created_by: number;
  created_at: string;
  updated_at: string;
  department?: {
    id: number;
    name: string;
    code: string;
  } | null;
  creator?: {
    id: number;
    name: string;
  };
}

interface Department {
  id: number;
  name: string;
  code: string;
}

interface Props {
  criminal: Criminal;
  departments: Department[];
}

export default function CriminalEdit({ criminal, departments = [] }: Props) {
  // Content tabs state
  const [activeTab, setActiveTab] = useState<string>('personal');
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    criminal.photo ? `/storage/${criminal.photo}` : null
  );

  const { data, setData, post, processing, errors, reset } = useForm({
    _method: 'PUT', // For method spoofing in Laravel
    photo: null as File | null,
    number: criminal.number || '',
    name: criminal.name || '',
    father_name: criminal.father_name || '',
    grandfather_name: criminal.grandfather_name || '',
    id_card_number: criminal.id_card_number || '',
    phone_number: criminal.phone_number || '',
    original_residence: criminal.original_residence || '',
    current_residence: criminal.current_residence || '',
    crime_type: criminal.crime_type || '',
    arrest_location: criminal.arrest_location || '',
    arrested_by: criminal.arrested_by || '',
    arrest_date: criminal.arrest_date || '',
    referred_to: criminal.referred_to || '',
    final_verdict: criminal.final_verdict || '',
    notes: criminal.notes || '',
    department_id: criminal.department_id ? criminal.department_id.toString() : 'none',
  });

  // Generate breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Criminal Records',
      href: route('criminals.index'),
    },
    {
      title: criminal.name,
      href: route('criminals.show', criminal.id),
    },
    {
      title: 'Edit',
      href: route('criminals.edit', criminal.id),
    },
  ];

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Handle photo change
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setData('photo', file);

      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('criminals.update', criminal.id), {
      forceFormData: true,
      onSuccess: () => {
        // Redirect happens automatically from the controller
      }
    });
  };

  const formattedCreatedAt = criminal.created_at
    ? format(new Date(criminal.created_at), 'MMM d, yyyy')
    : 'N/A';

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Criminal Record: ${criminal.name}`} />
      <div className="container px-0 py-4">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" asChild>
            <a href={route('criminals.show', criminal.id)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Details
            </a>
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Edit Criminal Record</h2>
            <p className="text-sm text-neutral-500">
              Record created on {formattedCreatedAt}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Photo Upload Card */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Photo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center justify-center">
                  <div className="relative mb-4 h-48 w-48 overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50 text-center">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Photo preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center p-6">
                        <Camera className="mb-2 h-10 w-10 text-gray-400" />
                        <p className="text-sm text-gray-500">No photo selected</p>
                      </div>
                    )}
                  </div>
                  <Label
                    htmlFor="photo"
                    className="cursor-pointer rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
                  >
                    Change Photo
                  </Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="sr-only"
                  />
                  {errors.photo && <p className="mt-2 text-sm text-red-500">{errors.photo}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Main Form Card */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Criminal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="personal" value={activeTab} onValueChange={handleTabChange}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="personal">Personal Details</TabsTrigger>
                    <TabsTrigger value="crime">Crime Details</TabsTrigger>
                    <TabsTrigger value="other">Other Information</TabsTrigger>
                  </TabsList>

                  {/* Personal Details Tab */}
                  <TabsContent value="personal" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                      <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                      />
                      {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="father_name">Father's Name</Label>
                        <Input
                          id="father_name"
                          value={data.father_name}
                          onChange={(e) => setData('father_name', e.target.value)}
                        />
                        {errors.father_name && <p className="text-sm text-red-500">{errors.father_name}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="grandfather_name">Grandfather's Name</Label>
                        <Input
                          id="grandfather_name"
                          value={data.grandfather_name}
                          onChange={(e) => setData('grandfather_name', e.target.value)}
                        />
                        {errors.grandfather_name && <p className="text-sm text-red-500">{errors.grandfather_name}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="id_card_number">ID Card Number</Label>
                        <Input
                          id="id_card_number"
                          value={data.id_card_number}
                          onChange={(e) => setData('id_card_number', e.target.value)}
                        />
                        {errors.id_card_number && <p className="text-sm text-red-500">{errors.id_card_number}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone_number">Phone Number</Label>
                        <Input
                          id="phone_number"
                          value={data.phone_number}
                          onChange={(e) => setData('phone_number', e.target.value)}
                        />
                        {errors.phone_number && <p className="text-sm text-red-500">{errors.phone_number}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="original_residence">Original Residence</Label>
                      <Textarea
                        id="original_residence"
                        value={data.original_residence}
                        onChange={(e) => setData('original_residence', e.target.value)}
                        rows={2}
                      />
                      {errors.original_residence && <p className="text-sm text-red-500">{errors.original_residence}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="current_residence">Current Residence</Label>
                      <Textarea
                        id="current_residence"
                        value={data.current_residence}
                        onChange={(e) => setData('current_residence', e.target.value)}
                        rows={2}
                      />
                      {errors.current_residence && <p className="text-sm text-red-500">{errors.current_residence}</p>}
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
                  </TabsContent>

                  {/* Crime Details Tab */}
                  <TabsContent value="crime" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="number">Record Number</Label>
                        <Input
                          id="number"
                          value={data.number}
                          onChange={(e) => setData('number', e.target.value)}
                          placeholder="e.g. CR-2023-0001"
                        />
                        {errors.number && <p className="text-sm text-red-500">{errors.number}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="crime_type">Crime Type</Label>
                        <Input
                          id="crime_type"
                          value={data.crime_type}
                          onChange={(e) => setData('crime_type', e.target.value)}
                        />
                        {errors.crime_type && <p className="text-sm text-red-500">{errors.crime_type}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="arrest_date">Arrest Date</Label>
                        <div className="relative">
                          <Input
                            id="arrest_date"
                            type="date"
                            value={data.arrest_date}
                            onChange={(e) => setData('arrest_date', e.target.value)}
                          />
                          <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                        {errors.arrest_date && <p className="text-sm text-red-500">{errors.arrest_date}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="arrest_location">Arrest Location</Label>
                        <Input
                          id="arrest_location"
                          value={data.arrest_location}
                          onChange={(e) => setData('arrest_location', e.target.value)}
                        />
                        {errors.arrest_location && <p className="text-sm text-red-500">{errors.arrest_location}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="arrested_by">Arrested By</Label>
                        <Input
                          id="arrested_by"
                          value={data.arrested_by}
                          onChange={(e) => setData('arrested_by', e.target.value)}
                          placeholder="Officer/Department name"
                        />
                        {errors.arrested_by && <p className="text-sm text-red-500">{errors.arrested_by}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="referred_to">Referred To</Label>
                        <Input
                          id="referred_to"
                          value={data.referred_to}
                          onChange={(e) => setData('referred_to', e.target.value)}
                          placeholder="Court/Authority"
                        />
                        {errors.referred_to && <p className="text-sm text-red-500">{errors.referred_to}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="final_verdict">Final Verdict</Label>
                      <Textarea
                        id="final_verdict"
                        value={data.final_verdict}
                        onChange={(e) => setData('final_verdict', e.target.value)}
                        rows={3}
                      />
                      {errors.final_verdict && <p className="text-sm text-red-500">{errors.final_verdict}</p>}
                    </div>
                  </TabsContent>

                  {/* Other Information Tab */}
                  <TabsContent value="other" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        value={data.notes}
                        onChange={(e) => setData('notes', e.target.value)}
                        rows={6}
                        placeholder="Enter any additional information about the criminal or the case"
                      />
                      {errors.notes && <p className="text-sm text-red-500">{errors.notes}</p>}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>

              <CardFooter className="flex justify-between border-t px-6 py-4">
                <Button
                  variant="outline"
                  onClick={() => window.location.href = route('criminals.show', criminal.id)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                  {processing ? 'Saving...' : 'Update Record'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
