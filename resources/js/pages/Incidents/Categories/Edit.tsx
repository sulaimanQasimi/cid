import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader } from '@/components/page-header';
import { ArrowLeft, Save } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import InputError from '@/components/input-error';
import { FormEventHandler } from 'react';
import { useTranslation } from '@/lib/i18n/translate';

// Define color options for the color picker
const colorOptions = [
  '#4f46e5', // Indigo
  '#3b82f6', // Blue
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#84cc16', // Lime
  '#eab308', // Yellow
  '#f97316', // Orange
  '#ef4444', // Red
  '#ec4899', // Pink
  '#8b5cf6', // Purple
  '#a3a3a3', // Gray
];

interface CategoryProps {
  category: {
    id: number;
    name: string;
    code: string | null;
    description: string | null;
    color: string | null;
    severity_level: number;
    status: string;
  };
}

export default function Edit({ category }: CategoryProps) {
  const { t } = useTranslation();
  // Define breadcrumb navigation
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
    },
    {
      title: 'Incident Categories',
      href: route('incident-categories.index'),
    },
    {
      title: category.name,
      href: route('incident-categories.edit', category.id),
    },
    {
      title: 'Edit',
      href: route('incident-categories.edit', category.id),
    },
  ];

  // Initialize form with useForm hook and existing category data
  const { data, setData, put, processing, errors } = useForm({
    name: category.name,
    code: category.code || '',
    description: category.description || '',
    color: category.color || '#3b82f6', // Default to blue if null
    severity_level: category.severity_level.toString(),
    status: category.status,
  });

  // Handle form submission
  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    put(route('incident-categories.update', category.id));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('incident_categories.edit_title', { name: category.name })} />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <PageHeader
          title={t('incident_categories.edit_header', { name: category.name })}
          description={t('incident_categories.edit_description')}
          actions={
            <Button variant="outline" asChild>
              <Link href={route('incident-categories.index')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('incident_categories.back_to_list')}
              </Link>
            </Button>
          }
        />

        <form onSubmit={submit}>
          <Card>
            <CardHeader>
              <CardTitle>{t('incident_categories.info_title')}</CardTitle>
              <CardDescription>{t('incident_categories.info_description_edit')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('incident_categories.form.name')} <span className="text-destructive">*</span></Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    placeholder={t('incident_categories.form.name_placeholder')}
                    required
                  />
                  <InputError message={errors.name} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">{t('incident_categories.form.code')}</Label>
                  <Input
                    id="code"
                    value={data.code}
                    onChange={e => setData('code', e.target.value)}
                    placeholder={t('incident_categories.form.code_placeholder')}
                  />
                  <InputError message={errors.code} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t('incident_categories.form.description')}</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={e => setData('description', e.target.value)}
                  placeholder={t('incident_categories.form.description_placeholder')}
                  rows={3}
                />
                <InputError message={errors.description} />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="color">{t('incident_categories.form.color')}</Label>
                  <div className="flex items-center space-x-2">
                    <div
                      className="h-8 w-8 rounded-full border"
                      style={{ backgroundColor: data.color || '#e2e8f0' }}
                    ></div>
                    <Input
                      id="color"
                      value={data.color}
                      onChange={e => setData('color', e.target.value)}
                      placeholder={t('incident_categories.form.color_placeholder')}
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`h-6 w-6 rounded-full border ${
                          data.color === color ? 'ring-2 ring-primary ring-offset-2' : ''
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setData('color', color)}
                      />
                    ))}
                  </div>
                  <InputError message={errors.color} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="severity_level">{t('incident_categories.form.severity_level')} <span className="text-destructive">*</span></Label>
                  <Select
                    value={data.severity_level}
                    onValueChange={(value) => setData('severity_level', value)}
                    required
                  >
                    <SelectTrigger id="severity_level">
                      <SelectValue placeholder={t('incident_categories.form.severity_placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">{t('incident_categories.form.severity.level1')}</SelectItem>
                      <SelectItem value="2">{t('incident_categories.form.severity.level2')}</SelectItem>
                      <SelectItem value="3">{t('incident_categories.form.severity.level3')}</SelectItem>
                      <SelectItem value="4">{t('incident_categories.form.severity.level4')}</SelectItem>
                      <SelectItem value="5">{t('incident_categories.form.severity.level5')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <InputError message={errors.severity_level} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">{t('incident_categories.form.status')} <span className="text-destructive">*</span></Label>
                  <Select
                    value={data.status}
                    onValueChange={(value) => setData('status', value)}
                    required
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder={t('incident_categories.form.status_placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{t('incident_categories.form.status.active')}</SelectItem>
                      <SelectItem value="inactive">{t('incident_categories.form.status.inactive')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <InputError message={errors.status} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" asChild>
                <Link href={route('incident-categories.index')}>{t('common.cancel')}</Link>
              </Button>
              <Button type="submit" disabled={processing}>
                <Save className="mr-2 h-4 w-4" />
                {processing ? t('incident_categories.actions.saving') : t('incident_categories.actions.save_changes')}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </AppLayout>
  );
}
