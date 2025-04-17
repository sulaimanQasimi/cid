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

// AM Map Province codes for Afghanistan
const amMapProvinceCodes = [
  { id: 'AF-BAL', name: 'Balkh' },
  { id: 'AF-BAM', name: 'Bamyan' },
  { id: 'AF-BDG', name: 'Badghis' },
  { id: 'AF-BDS', name: 'Badakhshan' },
  { id: 'AF-BGL', name: 'Baghlan' },
  { id: 'AF-DAY', name: 'Daykundi' },
  { id: 'AF-FRA', name: 'Farah' },
  { id: 'AF-FYB', name: 'Faryab' },
  { id: 'AF-GHA', name: 'Ghazni' },
  { id: 'AF-GHO', name: 'Ghor' },
  { id: 'AF-HEL', name: 'Helmand' },
  { id: 'AF-HER', name: 'Herat' },
  { id: 'AF-JOW', name: 'Jowzjan' },
  { id: 'AF-KAB', name: 'Kabul' },
  { id: 'AF-KAN', name: 'Kandahar' },
  { id: 'AF-KAP', name: 'Kapisa' },
  { id: 'AF-KDZ', name: 'Kunduz' },
  { id: 'AF-KHO', name: 'Khost' },
  { id: 'AF-KNR', name: 'Kunar' },
  { id: 'AF-LAG', name: 'Laghman' },
  { id: 'AF-LOG', name: 'Logar' },
  { id: 'AF-NAN', name: 'Nangarhar' },
  { id: 'AF-NIM', name: 'Nimruz' },
  { id: 'AF-NUR', name: 'Nuristan' },
  { id: 'AF-PAN', name: 'Panjshir' },
  { id: 'AF-PAR', name: 'Parwan' },
  { id: 'AF-PIA', name: 'Paktia' },
  { id: 'AF-PKA', name: 'Paktika' },
  { id: 'AF-SAM', name: 'Samangan' },
  { id: 'AF-SAR', name: 'Sar-e Pol' },
  { id: 'AF-TAK', name: 'Takhar' },
  { id: 'AF-URU', name: 'Uruzgan' },
  { id: 'AF-WAR', name: 'Wardak' },
  { id: 'AF-ZAB', name: 'Zabul' },
];

export default function Create() {
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
      title: 'Create',
      href: route('provinces.create'),
    },
  ];

  const { data, setData, post, processing, errors } = useForm({
    name: '',
    code: '',
    description: '',
    governor: '',
    capital: '',
    status: 'active',
  });

  const handleProvinceCodeChange = (code: string) => {
    setData('code', code);
    // Optionally auto-fill the name field with the province name
    const selectedProvince = amMapProvinceCodes.find(province => province.id === code);
    if (selectedProvince && !data.name) {
      setData('name', selectedProvince.name);
    }
  };

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('provinces.store'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Province" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <PageHeader
          title="Create Province"
          description="Add a new province to the system"
          actions={
            <Button variant="outline" asChild>
              <Link href={route('provinces.index')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Provinces
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
                  <Label htmlFor="code">AM Map Province Code <span className="text-destructive">*</span></Label>
                  <Select
                    value={data.code}
                    onValueChange={handleProvinceCodeChange}
                    required
                  >
                    <SelectTrigger id="code">
                      <SelectValue placeholder="Select province code" />
                    </SelectTrigger>
                    <SelectContent>
                      {amMapProvinceCodes.map((province) => (
                        <SelectItem key={province.id} value={province.id}>
                          {province.id} - {province.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                <Link href={route('provinces.index')}>
                  Cancel
                </Link>
              </Button>
              <Button type="submit" disabled={processing}>
                <Save className="mr-2 h-4 w-4" />
                Save Province
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </AppLayout>
  );
}
