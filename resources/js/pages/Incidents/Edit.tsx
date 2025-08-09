import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/page-header';
import { ArrowLeft, Save } from 'lucide-react';
import { FormEventHandler } from 'react';
import InputError from '@/components/input-error';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface EditIncidentProps {
  incident: {
    id: number;
    title: string;
    description: string;
    incident_date: string;
    incident_time: string | null;
    district_id: number;
    incident_category_id: number;
    incident_report_id: number | null;
    location: string | null;
    coordinates: string | null;
    casualties: number;
    injuries: number;
    incident_type: string;
    status: string;
  };
  districts: Array<{
    id: number;
    name: string;
    province: {
      id: number;
      name: string;
    };
  }>;
  categories: Array<{
    id: number;
    name: string;
    color: string;
  }>;
  reports: Array<{
    id: number;
    report_number: string;
    report_date: string;
  }>;
}

export default function Edit({ incident, districts, categories, reports }: EditIncidentProps) {
  const { data, setData, put, processing, errors } = useForm({
    title: incident.title || '',
    description: incident.description || '',
    incident_date: incident.incident_date || new Date().toISOString().split('T')[0],
    incident_time: incident.incident_time || '',
    district_id: incident.district_id?.toString() || '',
    incident_category_id: incident.incident_category_id?.toString() || '',
    incident_report_id: incident.incident_report_id?.toString() || 'none',
    location: incident.location || '',
    coordinates: incident.coordinates || '',
    casualties: incident.casualties?.toString() || '0',
    injuries: incident.injuries?.toString() || '0',
    incident_type: incident.incident_type || '',
    status: incident.status || 'reported',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    if (data.incident_report_id === 'none') {
      setData('incident_report_id', '');
    }

    put(route('incidents.update', incident.id));
  };

  return (
    <>
      <Head title={`Edit Incident - ${incident.title}`} />
      <PageHeader
        title="Edit Incident"
        description="incident.label" /* Placeholder label as requested */
        actions={
          <Button variant="outline" asChild>
            <Link href={route('incidents.show', incident.id)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Incident
            </Link>
          </Button>
        }
      />

      <form onSubmit={submit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Update the incident's basic details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
                <Input
                  id="title"
                  value={data.title}
                  onChange={e => setData('title', e.target.value)}
                  placeholder="Enter incident title"
                  required
                />
                <InputError message={errors.title} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="incident_type">Incident Type <span className="text-destructive">*</span></Label>
                <Input
                  id="incident_type"
                  value={data.incident_type}
                  onChange={e => setData('incident_type', e.target.value)}
                  placeholder="e.g. Theft, Security Breach, Violence"
                  required
                />
                <InputError message={errors.incident_type} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
              <Textarea
                id="description"
                value={data.description}
                onChange={e => setData('description', e.target.value)}
                placeholder="Provide a detailed description of the incident"
                rows={5}
                required
              />
              <InputError message={errors.description} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="incident_date">Date <span className="text-destructive">*</span></Label>
                <Input
                  id="incident_date"
                  type="date"
                  value={data.incident_date}
                  onChange={e => setData('incident_date', e.target.value)}
                  required
                />
                <InputError message={errors.incident_date} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="incident_time">Time</Label>
                <Input
                  id="incident_time"
                  type="time"
                  value={data.incident_time}
                  onChange={e => setData('incident_time', e.target.value)}
                />
                <InputError message={errors.incident_time} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location & Classification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="district_id">District <span className="text-destructive">*</span></Label>
                <Select
                  value={data.district_id}
                  onValueChange={value => setData('district_id', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a district" />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map(district => (
                      <SelectItem key={district.id} value={district.id.toString()}>
                        {district.name} ({district.province?.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <InputError message={errors.district_id} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="incident_category_id">Category <span className="text-destructive">*</span></Label>
                <Select
                  value={data.incident_category_id}
                  onValueChange={value => setData('incident_category_id', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <InputError message={errors.incident_category_id} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Specific Location</Label>
              <Input
                id="location"
                value={data.location}
                onChange={e => setData('location', e.target.value)}
                placeholder="e.g. Main Market, North Checkpoint"
              />
              <InputError message={errors.location} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coordinates">Coordinates</Label>
              <Input
                id="coordinates"
                value={data.coordinates}
                onChange={e => setData('coordinates', e.target.value)}
                placeholder="e.g. 34.5553° N, 69.2075° E"
              />
              <InputError message={errors.coordinates} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Impact & Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="casualties">Casualties</Label>
                <Input
                  id="casualties"
                  type="number"
                  min="0"
                  value={data.casualties}
                  onChange={e => setData('casualties', e.target.value)}
                />
                <InputError message={errors.casualties} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="injuries">Injuries</Label>
                <Input
                  id="injuries"
                  type="number"
                  min="0"
                  value={data.injuries}
                  onChange={e => setData('injuries', e.target.value)}
                />
                <InputError message={errors.injuries} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status <span className="text-destructive">*</span></Label>
              <Select
                value={data.status}
                onValueChange={value => setData('status', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reported">Reported</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <InputError message={errors.status} />
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <Label htmlFor="incident_report_id">Assign to Report (Optional)</Label>
              <Select
                value={data.incident_report_id}
                onValueChange={value => setData('incident_report_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a report (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {reports.map(report => (
                    <SelectItem key={report.id} value={report.id.toString()}>
                      {report.report_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <InputError message={errors.incident_report_id} />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" asChild>
              <Link href={route('incidents.show', incident.id)}>
                Cancel
              </Link>
            </Button>
            <Button type="submit" disabled={processing}>
              <Save className="mr-2 h-4 w-4" />
              Update Incident
            </Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
}
