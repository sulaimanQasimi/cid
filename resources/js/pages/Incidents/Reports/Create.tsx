import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader } from '@/components/page-header';
import { ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import InputError from '@/components/input-error';

interface CreateProps {
  securityLevels: string[];
}

type ReportFormData = {
  report_date: string;
  security_level: string;
  details: string;
  report_number?: string;
  action_taken?: string;
  recommendation?: string;
  report_status: string;
  source?: string;
};

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Incident Reports',
    href: route('incident-reports.index'),
  },
  {
    title: 'Create',
    href: route('incident-reports.create'),
  },
];

export default function Create({ securityLevels }: CreateProps) {
  const { data, setData, post, processing, errors } = useForm<ReportFormData>({
    report_date: new Date().toISOString().split('T')[0],
    security_level: 'normal',
    details: '',
    report_status: 'submitted',
    report_number: '',
    action_taken: '',
    recommendation: '',
    source: '',
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('Submitting form with data:', data);

    post(route('incident-reports.store'), {
      onSuccess: () => {
        console.log('Form submitted successfully');
      },
      onError: (errors) => {
        console.error('Form submission error:', errors);
      }
    });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Incident Report" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <PageHeader
          title="Create Incident Report"
          description="Add a new incident report to the system"
          actions={
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          }
        />

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Incident Report Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-3">
                <Label htmlFor="report_number">Report Number (Optional)</Label>
                <Input
                  id="report_number"
                  value={data.report_number}
                  onChange={(e) => setData('report_number', e.target.value)}
                  placeholder="Will be auto-generated if left empty"
                />
                <InputError message={errors.report_number} />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="report_date">Report Date</Label>
                <Input
                  id="report_date"
                  type="date"
                  value={data.report_date}
                  onChange={(e) => setData('report_date', e.target.value)}
                  required
                />
                <InputError message={errors.report_date} />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="security_level">Security Level</Label>
                <Select
                  value={data.security_level}
                  onValueChange={(value) => setData('security_level', value)}
                >
                  <SelectTrigger id="security_level">
                    <SelectValue placeholder="Select security level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="restricted">Restricted</SelectItem>
                    <SelectItem value="classified">Classified</SelectItem>
                  </SelectContent>
                </Select>
                <InputError message={errors.security_level} />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="details">Details</Label>
                <Textarea
                  id="details"
                  rows={5}
                  value={data.details}
                  onChange={(e) => setData('details', e.target.value)}
                  placeholder="Enter the report details..."
                  required
                />
                <InputError message={errors.details} />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="action_taken">Action Taken (Optional)</Label>
                <Textarea
                  id="action_taken"
                  rows={3}
                  value={data.action_taken}
                  onChange={(e) => setData('action_taken', e.target.value)}
                  placeholder="Describe any actions taken..."
                />
                <InputError message={errors.action_taken} />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="recommendation">Recommendation (Optional)</Label>
                <Textarea
                  id="recommendation"
                  rows={3}
                  value={data.recommendation}
                  onChange={(e) => setData('recommendation', e.target.value)}
                  placeholder="Enter any recommendations..."
                />
                <InputError message={errors.recommendation} />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="source">Source (Optional)</Label>
                <Input
                  id="source"
                  value={data.source}
                  onChange={(e) => setData('source', e.target.value)}
                  placeholder="Information source"
                />
                <InputError message={errors.source} />
              </div>

              <input type="hidden" name="report_status" value="submitted" />
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={processing}>
                Create Report
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </AppLayout>
  );
}
