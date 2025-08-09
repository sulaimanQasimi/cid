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
import { useTranslation } from '@/lib/i18n/translate';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface CreateIncidentProps {
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

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Incidents',
    href: route('incidents.index'),
  },
  {
    title: 'Create',
    href: route('incidents.create'),
  },
];

export default function Create({ districts, categories, reports }: CreateIncidentProps) {
  const { t } = useTranslation();
  const { data, setData, post, processing, errors, reset } = useForm({
    title: '',
    description: '',
    incident_date: new Date().toISOString().split('T')[0],
    incident_time: '',
    district_id: '',
    incident_category_id: '',
    incident_report_id: 'none',
    location: '',
    coordinates: '',
    casualties: '0',
    injuries: '0',
    incident_type: '',
    status: 'reported',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    // Create a copy of the data to modify
    const formData = { ...data };

    // Convert "none" to null for the incident_report_id
    if (formData.incident_report_id === 'none') {
      formData.incident_report_id = null as unknown as string;
    }

    post(route('incidents.store'), {
      onSuccess: () => {
        // handle success if needed
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('incidents.create_title')} />
      <PageHeader
        title={t('incidents.create_title')}
        description={t('incidents.create_description')}
        actions={
          <Button variant="outline" asChild>
            <Link href={route('incidents.index')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('incidents.back_to_list')}
            </Link>
          </Button>
        }
      />

      <form onSubmit={submit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('incidents.basic_info')}</CardTitle>
            <CardDescription>{t('incidents.basic_info_description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">{t('incidents.form.title')} <span className="text-destructive">*</span></Label>
                <Input
                  id="title"
                  value={data.title}
                  onChange={e => setData('title', e.target.value)}
                  placeholder={t('incidents.form.title_placeholder')}
                  required
                />
                <InputError message={errors.title} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="incident_type">{t('incidents.form.type')} <span className="text-destructive">*</span></Label>
                <Input
                  id="incident_type"
                  value={data.incident_type}
                  onChange={e => setData('incident_type', e.target.value)}
                  placeholder={t('incidents.form.type_placeholder')}
                  required
                />
                <InputError message={errors.incident_type} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('incidents.form.description')} <span className="text-destructive">*</span></Label>
              <Textarea
                id="description"
                value={data.description}
                onChange={e => setData('description', e.target.value)}
                placeholder={t('incidents.form.description_placeholder')}
                rows={5}
                required
              />
              <InputError message={errors.description} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="incident_date">{t('incidents.form.date')} <span className="text-destructive">*</span></Label>
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
                <Label htmlFor="incident_time">{t('incidents.form.time')}</Label>
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
            <CardTitle>{t('incidents.location_classification')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="district_id">{t('incidents.form.district')} <span className="text-destructive">*</span></Label>
                <Select
                  value={data.district_id}
                  onValueChange={value => setData('district_id', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('incidents.form.select_district')} />
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
                <Label htmlFor="incident_category_id">{t('incidents.form.category')} <span className="text-destructive">*</span></Label>
                <Select
                  value={data.incident_category_id}
                  onValueChange={value => setData('incident_category_id', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('incidents.form.select_category')} />
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
              <Label htmlFor="location">{t('incidents.form.location')}</Label>
              <Input
                id="location"
                value={data.location}
                onChange={e => setData('location', e.target.value)}
                placeholder={t('incidents.form.location_placeholder')}
              />
              <InputError message={errors.location} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coordinates">{t('incidents.form.coordinates')}</Label>
              <Input
                id="coordinates"
                value={data.coordinates}
                onChange={e => setData('coordinates', e.target.value)}
                placeholder={t('incidents.form.coordinates_placeholder')}
              />
              <InputError message={errors.coordinates} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('incidents.impact_status')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="casualties">{t('incidents.form.casualties')}</Label>
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
                <Label htmlFor="injuries">{t('incidents.form.injuries')}</Label>
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
              <Label htmlFor="status">{t('incidents.form.status')} <span className="text-destructive">*</span></Label>
              <Select
                value={data.status}
                onValueChange={value => setData('status', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('incidents.form.select_status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reported">{t('incidents.status.reported')}</SelectItem>
                  <SelectItem value="investigating">{t('incidents.status.investigating')}</SelectItem>
                  <SelectItem value="resolved">{t('incidents.status.resolved')}</SelectItem>
                  <SelectItem value="closed">{t('incidents.status.closed')}</SelectItem>
                </SelectContent>
              </Select>
              <InputError message={errors.status} />
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <Label htmlFor="incident_report_id">{t('incidents.form.assign_report')}</Label>
              <Select
                value={data.incident_report_id}
                onValueChange={value => setData('incident_report_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('incidents.form.select_report_optional')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t('incidents.none')}</SelectItem>
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
            <Button variant="outline" onClick={() => reset()}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={processing}>
              <Save className="mr-2 h-4 w-4" />
              {t('incidents.save_incident')}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </AppLayout>
  );
}
