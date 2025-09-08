import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, FileText, Building2, AlertTriangle, BookText, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n/translate';
import Header from '@/components/template/header';

interface Department {
  id: number;
  name: string;
  code: string;
  description?: string;
}

interface Props {
  department: Department;
  auth: {
    permissions: string[];
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Departments',
    href: route('departments.index'),
  },
  {
    title: 'Edit',
    href: '#',
  },
];

export default function DepartmentEdit({ department, auth }: Props) {
  const { t } = useTranslation();

  const { data, setData, put, processing, errors, reset } = useForm({
    name: department.name,
    code: department.code,
    description: department.description || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('departments.update', department.id), {
      onSuccess: () => {
        // Redirect happens automatically from the controller
      }
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('departments.edit.page_title', { name: department.name })} />
      <div className="container px-0 py-6">
        {/* Header with gradient background */}
        <Header
          title={t('departments.edit.title', { name: department.name })}
          description={t('departments.edit.description')}
          theme="blue"
          icon={<Building2 className="h-5 w-5" />}
          model="department"
          routeName={() => route("departments.edit", department.id)}
          buttonText={t('departments.edit.update')}
          showBackButton={true}
          backRouteName={() => route("departments.index")}
          backButtonText={t('departments.edit.back_to_list')}
        />

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-8">
            {/* Main Form Card */}
            <Card className="border-none shadow-xl overflow-hidden bg-gradient-to-bl from-white to-blue-50/30">
              <CardHeader className="bg-gradient-to-l from-blue-500 to-blue-600 text-white border-b pb-4">
                <CardTitle className="text-lg flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <FileText className="h-5 w-5" />
                  </div>
                  {t('departments.edit.form.title')}
                </CardTitle>
                <CardDescription className="text-blue-100">
                  {t('departments.edit.form.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Department Name */}
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-base font-medium flex items-center gap-2 text-blue-700 text-right" dir="rtl">
                      <span className="text-red-500">*</span>
                      {t('departments.edit.fields.name')}
                      <Building2 className="h-4 w-4" />
                    </Label>
                    <div className="relative">
                      <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        placeholder={t('departments.edit.placeholders.name')}
                        className="h-12 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gradient-to-l from-blue-50 to-white text-right"
                      />
                    </div>
                    {errors.name && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.name}
                    </p>}
                  </div>

                  {/* Department Code */}
                  <div className="space-y-3">
                    <Label htmlFor="code" className="font-medium flex items-center gap-2 text-blue-700 text-right" dir="rtl">
                      <span className="text-red-500">*</span>
                      {t('departments.edit.fields.code')}
                      <Hash className="h-4 w-4" />
                    </Label>
                    <Input
                      id="code"
                      value={data.code}
                      onChange={(e) => setData('code', e.target.value)}
                      required
                      placeholder={t('departments.edit.placeholders.code')}
                      className="h-12 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gradient-to-l from-blue-50 to-white text-right"
                    />
                    {errors.code && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.code}
                    </p>}
                  </div>

                  {/* Department Description */}
                  <div className="space-y-3">
                    <Label htmlFor="description" className="font-medium flex items-center gap-2 text-blue-700 text-right" dir="rtl">
                      {t('departments.edit.fields.description')}
                      <BookText className="h-4 w-4" />
                    </Label>
                    <Textarea
                      id="description"
                      value={data.description}
                      onChange={(e) => setData('description', e.target.value)}
                      rows={6}
                      placeholder={t('departments.edit.placeholders.description')}
                      className="min-h-[180px] resize-none border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gradient-to-l from-blue-50 to-white text-right"
                    />
                    {errors.description && <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.description}
                    </p>}

                    <p className="text-xs text-neutral-500 mt-2 text-right">
                      {t('departments.edit.description_helper')}
                    </p>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between border-t px-6 py-5 bg-gradient-to-l from-blue-50 to-blue-100">
                <Button
                  variant="outline"
                  onClick={() => reset()}
                  type="button"
                  disabled={processing}
                  className="rounded-full border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400 shadow-lg"
                >
                  {t('departments.edit.reset')}
                </Button>
                <Button
                  type="submit"
                  disabled={processing}
                  className="rounded-full px-8 font-medium bg-gradient-to-l from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {processing ? t('departments.edit.updating') : t('departments.edit.update')}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
