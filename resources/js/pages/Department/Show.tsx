import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, FileText, Building2, Calendar, Clock, Users, Hash, BookText, Eye, Edit, AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

interface Info {
  id: number;
  name: string;
  code: string;
  description: string;
  info_type: {
    id: number;
    name: string;
  };
  info_category: {
    id: number;
    name: string;
  };
  created_at: string;
}

interface Department {
  id: number;
  name: string;
  code: string;
  description?: string;
  created_at: string;
  updated_at: string;
  infos: Info[];
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
    title: 'View',
    href: '#',
  },
];

export default function DepartmentShow({ department, auth }: Props) {
  const { t } = useTranslation();

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('departments.show.page_title', { name: department.name })} />
      <div className="container px-0 py-6">
        {/* Header with gradient background */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-blue-600 via-blue-700 to-indigo-700 p-8 text-white shadow-2xl mb-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 -translate-x-32"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 translate-x-24"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">{t('departments.show.title', { name: department.name })}</h2>
                <p className="text-white/90 flex items-center gap-2 mt-2 text-lg">
                  <FileText className="h-5 w-5" />
                  {t('departments.show.description')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Link href={route('departments.index')} className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 rounded-full shadow-lg px-4 py-2 flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                {t('departments.show.back_to_list')}
              </Link>
              <Link href={route('departments.edit', department.id)} className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 rounded-full shadow-lg px-4 py-2 flex items-center gap-2">
                <Edit className="h-4 w-4" />
                {t('departments.show.edit')}
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-8">
          {/* Department Details Card */}
          <Card className="border-none shadow-xl overflow-hidden bg-gradient-to-bl from-white to-blue-50/30">
            <CardHeader className="bg-gradient-to-l from-blue-500 to-blue-600 text-white border-b pb-4">
              <CardTitle className="text-lg flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Building2 className="h-5 w-5" />
                </div>
                {t('departments.show.details.title')}
              </CardTitle>
              <CardDescription className="text-blue-100">
                {t('departments.show.details.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Department Name */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-blue-700 text-right" dir="rtl">
                    <Building2 className="h-4 w-4" />
                    <span className="font-medium">{t('departments.show.fields.name')}</span>
                  </div>
                  <div className="p-4 bg-gradient-to-l from-blue-50 to-white border border-blue-200 rounded-xl text-right">
                    <p className="text-lg font-semibold text-blue-900">{department.name}</p>
                  </div>
                </div>

                {/* Department Code */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-blue-700 text-right" dir="rtl">
                    <Hash className="h-4 w-4" />
                    <span className="font-medium">{t('departments.show.fields.code')}</span>
                  </div>
                  <div className="p-4 bg-gradient-to-l from-blue-50 to-white border border-blue-200 rounded-xl text-right">
                    <Badge className="bg-gradient-to-l from-blue-100 to-blue-200 text-blue-800 border-blue-300 px-4 py-2 rounded-xl font-semibold text-lg">
                      {department.code}
                    </Badge>
                  </div>
                </div>

                {/* Created At */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-blue-700 text-right" dir="rtl">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">{t('departments.show.fields.created_at')}</span>
                  </div>
                  <div className="p-4 bg-gradient-to-l from-blue-50 to-white border border-blue-200 rounded-xl text-right">
                    <p className="text-lg font-semibold text-blue-900">
                      {new Date(department.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-blue-600">
                      {new Date(department.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                {/* Updated At */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-blue-700 text-right" dir="rtl">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">{t('departments.show.fields.updated_at')}</span>
                  </div>
                  <div className="p-4 bg-gradient-to-l from-blue-50 to-white border border-blue-200 rounded-xl text-right">
                    <p className="text-lg font-semibold text-blue-900">
                      {new Date(department.updated_at).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-blue-600">
                      {new Date(department.updated_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                {/* Total Info Records */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-blue-700 text-right" dir="rtl">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">{t('departments.show.fields.total_info')}</span>
                  </div>
                  <div className="p-4 bg-gradient-to-l from-blue-50 to-white border border-blue-200 rounded-xl text-right">
                    <Badge className="bg-gradient-to-l from-green-100 to-green-200 text-green-800 border-green-300 px-4 py-2 rounded-xl font-semibold text-lg">
                      {department.infos.length} {t('departments.show.info_records')}
                    </Badge>
                  </div>
                </div>

                {/* Description */}
                {department.description && (
                  <div className="space-y-3 md:col-span-2">
                    <div className="flex items-center gap-2 text-blue-700 text-right" dir="rtl">
                      <BookText className="h-4 w-4" />
                      <span className="font-medium">{t('departments.show.fields.description')}</span>
                    </div>
                    <div className="p-4 bg-gradient-to-l from-blue-50 to-white border border-blue-200 rounded-xl text-right">
                      <p className="text-lg text-blue-900 leading-relaxed">{department.description}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Associated Info Records Card */}
          <Card className="border-none shadow-xl overflow-hidden bg-gradient-to-bl from-white to-blue-50/30">
            <CardHeader className="bg-gradient-to-l from-blue-500 to-blue-600 text-white border-b pb-4">
              <CardTitle className="text-lg flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <FileText className="h-5 w-5" />
                </div>
                {t('departments.show.associated_info.title')}
              </CardTitle>
              <CardDescription className="text-blue-100">
                {t('departments.show.associated_info.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-hidden rounded-b-3xl">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-l from-blue-100 to-blue-200 border-0">
                      <TableHead className="text-blue-800 font-bold text-lg py-6 px-6">{t('departments.show.table.name')}</TableHead>
                      <TableHead className="text-blue-800 font-bold text-lg py-6 px-6">{t('departments.show.table.code')}</TableHead>
                      <TableHead className="text-blue-800 font-bold text-lg py-6 px-6">{t('departments.show.table.type')}</TableHead>
                      <TableHead className="text-blue-800 font-bold text-lg py-6 px-6">{t('departments.show.table.category')}</TableHead>
                      <TableHead className="text-blue-800 font-bold text-lg py-6 px-6 text-center">{t('common.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {department.infos.length > 0 ? (
                      department.infos.map((info) => (
                        <TableRow key={info.id} className="hover:bg-blue-50/50 transition-colors duration-300 border-b border-blue-100">
                          <TableCell className="font-bold text-blue-900 py-6 px-6 text-lg">{info.name}</TableCell>
                          <TableCell className="text-blue-800 py-6 px-6">
                            <Badge variant="outline" className="bg-gradient-to-l from-blue-100 to-blue-200 text-blue-800 border-blue-300 px-4 py-2 rounded-xl font-semibold">
                              {info.code}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-blue-800 py-6 px-6 font-medium">{info.info_type.name}</TableCell>
                          <TableCell className="text-blue-800 py-6 px-6 font-medium">{info.info_category.name}</TableCell>
                          <TableCell className="py-6 px-6 text-center">
                            <Link href={route('infos.show', info.id)}>
                              <Button
                                variant="ghost"
                                size="icon"
                                title={t('departments.show.actions.view')}
                                className="h-10 w-10 rounded-xl hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-all duration-300 hover:scale-110"
                              >
                                <Eye className="h-5 w-5" />
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-32 text-center">
                          <div className="flex flex-col items-center gap-4 text-blue-600">
                            <div className="p-4 bg-blue-100 rounded-full">
                              <AlertTriangle className="h-16 w-16 text-blue-400" />
                            </div>
                            <p className="text-xl font-bold">{t('departments.show.no_info')}</p>
                            <p className="text-blue-500">{t('departments.show.no_info_description')}</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
