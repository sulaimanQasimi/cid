import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Camera, Calendar, UserRound, FileText, BookText } from 'lucide-react';
import { cn } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Criminal Records',
    href: route('criminals.index'),
  },
  {
    title: 'Create',
    href: route('criminals.create'),
  },
];

interface Department {
  id: number;
  name: string;
  code: string;
}

interface Props {
  departments?: Department[];
}

export default function CriminalCreate({ departments = [] }: Props) {
  // Content tabs state
  const [activeTab, setActiveTab] = useState<string>('personal');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const { data, setData, post, processing, errors, reset } = useForm({
    photo: null as File | null,
    number: '',
    name: '',
    father_name: '',
    grandfather_name: '',
    id_card_number: '',
    phone_number: '',
    original_residence: '',
    current_residence: '',
    crime_type: '',
    arrest_location: '',
    arrested_by: '',
    arrest_date: '',
    referred_to: '',
    final_verdict: '',
    notes: '',
    department_id: 'none',
  });

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
    post(route('criminals.store'), {
      forceFormData: true,
      onSuccess: () => {
        // Redirect happens automatically from the controller
      }
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Criminal Record" />
      <div className="container px-0 py-6">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" asChild className="rounded-full shadow-sm">
            <a href={route('criminals.index')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to List
            </a>
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Create Criminal Record</h2>
            <p className="text-sm text-neutral-500">Add a new criminal record to the database</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Photo Upload Card */}
            <Card className="lg:col-span-1 overflow-hidden border-none shadow-md">
              <CardHeader className="bg-neutral-50 dark:bg-neutral-900 border-b pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Camera className="h-5 w-5 text-neutral-500" />
                  Photo Identification
                </CardTitle>
                <CardDescription>
                  Upload a clear photo of the individual
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex flex-col items-center justify-center">
                  <div className={cn(
                    "relative mb-6 h-56 w-56 overflow-hidden rounded-xl border-2 border-dashed",
                    "bg-neutral-50 text-center transition-all duration-200 hover:border-primary/50",
                    "flex items-center justify-center",
                    photoPreview ? "border-primary/30" : "border-neutral-200"
                  )}>
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Photo preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center p-6">
                        <Camera className="mb-3 h-12 w-12 text-neutral-400" />
                        <p className="text-sm text-neutral-500 font-medium">No photo selected</p>
                        <p className="text-xs text-neutral-400 mt-1">Click the button below to upload</p>
                      </div>
                    )}
                  </div>
                  <Label
                    htmlFor="photo"
                    className={cn(
                      "cursor-pointer rounded-full px-5 py-2.5 text-sm font-medium transition-colors",
                      "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                    )}
                  >
                    {photoPreview ? "Change Photo" : "Upload Photo"}
                  </Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="sr-only"
                  />
                  {errors.photo && <p className="mt-3 text-sm text-red-500 font-medium">{errors.photo}</p>}

                  <div className="mt-6 text-center max-w-xs">
                    <p className="text-xs text-neutral-500">
                      Upload a clear, recent photo for identification purposes. Maximum file size: 2MB.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Form Card */}
            <Card className="lg:col-span-2 border-none shadow-md overflow-hidden">
              <CardHeader className="bg-neutral-50 dark:bg-neutral-900 border-b pb-4">
                <CardTitle className="text-lg">Criminal Record Information</CardTitle>
                <CardDescription>
                  Fill in the details of the criminal record below
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs defaultValue="personal" value={activeTab} onValueChange={handleTabChange} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6 rounded-lg p-1 bg-neutral-100 dark:bg-neutral-800">
                    <TabsTrigger
                      value="personal"
                      className={cn(
                        "data-[state=active]:shadow-sm flex items-center gap-2",
                        "transition-all duration-200"
                      )}
                    >
                      <UserRound className="h-4 w-4" />
                      <span>Personal Details</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="crime"
                      className={cn(
                        "data-[state=active]:shadow-sm flex items-center gap-2",
                        "transition-all duration-200"
                      )}
                    >
                      <FileText className="h-4 w-4" />
                      <span>Crime Details</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="other"
                      className={cn(
                        "data-[state=active]:shadow-sm flex items-center gap-2",
                        "transition-all duration-200"
                      )}
                    >
                      <BookText className="h-4 w-4" />
                      <span>Additional Info</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Personal Details Tab */}
                  <TabsContent value="personal" className="space-y-6 pt-2">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-base font-medium">
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        placeholder="Enter full name"
                        className="h-11"
                      />
                      {errors.name && <p className="text-sm text-red-500 font-medium">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label htmlFor="father_name" className="font-medium">Father's Name</Label>
                        <Input
                          id="father_name"
                          value={data.father_name}
                          onChange={(e) => setData('father_name', e.target.value)}
                          placeholder="Enter father's name"
                          className="h-11"
                        />
                        {errors.father_name && <p className="text-sm text-red-500 font-medium">{errors.father_name}</p>}
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="grandfather_name" className="font-medium">Grandfather's Name</Label>
                        <Input
                          id="grandfather_name"
                          value={data.grandfather_name}
                          onChange={(e) => setData('grandfather_name', e.target.value)}
                          placeholder="Enter grandfather's name"
                          className="h-11"
                        />
                        {errors.grandfather_name && <p className="text-sm text-red-500 font-medium">{errors.grandfather_name}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label htmlFor="id_card_number" className="font-medium">ID Card Number</Label>
                        <Input
                          id="id_card_number"
                          value={data.id_card_number}
                          onChange={(e) => setData('id_card_number', e.target.value)}
                          placeholder="Enter ID card number"
                          className="h-11"
                        />
                        {errors.id_card_number && <p className="text-sm text-red-500 font-medium">{errors.id_card_number}</p>}
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="phone_number" className="font-medium">Phone Number</Label>
                        <Input
                          id="phone_number"
                          value={data.phone_number}
                          onChange={(e) => setData('phone_number', e.target.value)}
                          placeholder="Enter phone number"
                          className="h-11"
                        />
                        {errors.phone_number && <p className="text-sm text-red-500 font-medium">{errors.phone_number}</p>}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="original_residence" className="font-medium">Original Residence</Label>
                      <Textarea
                        id="original_residence"
                        value={data.original_residence}
                        onChange={(e) => setData('original_residence', e.target.value)}
                        rows={2}
                        placeholder="Enter original residence address"
                        className="min-h-[80px] resize-none"
                      />
                      {errors.original_residence && <p className="text-sm text-red-500 font-medium">{errors.original_residence}</p>}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="current_residence" className="font-medium">Current Residence</Label>
                      <Textarea
                        id="current_residence"
                        value={data.current_residence}
                        onChange={(e) => setData('current_residence', e.target.value)}
                        rows={2}
                        placeholder="Enter current residence address"
                        className="min-h-[80px] resize-none"
                      />
                      {errors.current_residence && <p className="text-sm text-red-500 font-medium">{errors.current_residence}</p>}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="department_id" className="font-medium">Department</Label>
                      <Select
                        value={data.department_id}
                        onValueChange={(value) => setData('department_id', value)}
                      >
                        <SelectTrigger id="department_id" className="h-11">
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
                            <div className="p-2 text-sm text-neutral-500">No departments available</div>
                          )}
                        </SelectContent>
                      </Select>
                      {errors.department_id && <p className="text-sm text-red-500 font-medium">{errors.department_id}</p>}
                    </div>
                  </TabsContent>

                  {/* Crime Details Tab */}
                  <TabsContent value="crime" className="space-y-6 pt-2">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label htmlFor="number" className="font-medium">Record Number</Label>
                        <Input
                          id="number"
                          value={data.number}
                          onChange={(e) => setData('number', e.target.value)}
                          placeholder="e.g. CR-2023-0001"
                          className="h-11"
                        />
                        {errors.number && <p className="text-sm text-red-500 font-medium">{errors.number}</p>}
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="crime_type" className="font-medium">Crime Type</Label>
                        <Input
                          id="crime_type"
                          value={data.crime_type}
                          onChange={(e) => setData('crime_type', e.target.value)}
                          placeholder="Enter type of crime"
                          className="h-11"
                        />
                        {errors.crime_type && <p className="text-sm text-red-500 font-medium">{errors.crime_type}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label htmlFor="arrest_date" className="font-medium">Arrest Date</Label>
                        <div className="relative">
                          <Input
                            id="arrest_date"
                            type="date"
                            value={data.arrest_date}
                            onChange={(e) => setData('arrest_date', e.target.value)}
                            className="h-11"
                          />
                          <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                        </div>
                        {errors.arrest_date && <p className="text-sm text-red-500 font-medium">{errors.arrest_date}</p>}
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="arrest_location" className="font-medium">Arrest Location</Label>
                        <Input
                          id="arrest_location"
                          value={data.arrest_location}
                          onChange={(e) => setData('arrest_location', e.target.value)}
                          placeholder="Enter arrest location"
                          className="h-11"
                        />
                        {errors.arrest_location && <p className="text-sm text-red-500 font-medium">{errors.arrest_location}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label htmlFor="arrested_by" className="font-medium">Arrested By</Label>
                        <Input
                          id="arrested_by"
                          value={data.arrested_by}
                          onChange={(e) => setData('arrested_by', e.target.value)}
                          placeholder="Officer/Department name"
                          className="h-11"
                        />
                        {errors.arrested_by && <p className="text-sm text-red-500 font-medium">{errors.arrested_by}</p>}
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="referred_to" className="font-medium">Referred To</Label>
                        <Input
                          id="referred_to"
                          value={data.referred_to}
                          onChange={(e) => setData('referred_to', e.target.value)}
                          placeholder="Court/Authority"
                          className="h-11"
                        />
                        {errors.referred_to && <p className="text-sm text-red-500 font-medium">{errors.referred_to}</p>}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="final_verdict" className="font-medium">Final Verdict</Label>
                      <Textarea
                        id="final_verdict"
                        value={data.final_verdict}
                        onChange={(e) => setData('final_verdict', e.target.value)}
                        rows={3}
                        placeholder="Enter the final verdict or sentence information"
                        className="min-h-[120px] resize-none"
                      />
                      {errors.final_verdict && <p className="text-sm text-red-500 font-medium">{errors.final_verdict}</p>}
                    </div>
                  </TabsContent>

                  {/* Other Information Tab */}
                  <TabsContent value="other" className="space-y-6 pt-2">
                    <div className="space-y-3">
                      <Label htmlFor="notes" className="font-medium">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        value={data.notes}
                        onChange={(e) => setData('notes', e.target.value)}
                        rows={8}
                        placeholder="Enter any additional information about the criminal or the case"
                        className="min-h-[240px]"
                      />
                      {errors.notes && <p className="text-sm text-red-500 font-medium">{errors.notes}</p>}

                      <p className="text-xs text-neutral-500 mt-2">
                        Add any additional details that might be relevant to this case but don't fit in the structured fields above.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>

              <CardFooter className="flex justify-between border-t px-6 py-5 bg-neutral-50 dark:bg-neutral-900">
                <Button
                  variant="outline"
                  onClick={() => reset()}
                  type="button"
                  disabled={processing}
                  className="rounded-full"
                >
                  Reset Form
                </Button>
                <Button
                  type="submit"
                  disabled={processing}
                  className="rounded-full px-8 font-medium"
                >
                  {processing ? 'Saving...' : 'Save Criminal Record'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
