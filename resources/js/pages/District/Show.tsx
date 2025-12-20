import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Users, Calendar, User, Clock, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { useTranslation } from '@/lib/i18n/translate';
import { CanView } from '@/components/ui/permission-guard';
import Header from '@/components/template/header';

interface DistrictData {
  id: number;
  name: string;
  code: string;
  description: string | null;
  province_id: number;
  status: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  creator?: {
    id: number;
    name: string;
  };
  province?: {
    id: number;
    name: string;
    code: string;
  };
}

interface ShowProps {
  district: DistrictData;
}

export default function Show({ district }: ShowProps) {
  const { t } = useTranslation();
  
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('dashboard.page_title'),
      href: route('dashboard'),
    },
    {
      title: t('districts.page_title'),
      href: route('districts.index'),
    },
    {
      title: district.name,
      href: '#',
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('districts.show.title', { name: district.name })} />
      
      <div className="container px-0 py-6">
        <Header
          title={district.name}
          description={t('districts.show.description', { code: district.code })}
          icon={<MapPin className="h-6 w-6 text-white" />}
          model="district"
          routeName={() => route('districts.edit', district.id)}
          theme="purple"
          buttonText={t('common.edit')}
          showBackButton={true}
          backRouteName={() => route('districts.index')}
          backButtonText={t('common.back_to_list')}
        />

        <div className="grid gap-6 md:grid-cols-3">
          {/* District Details Card */}
          <div className="md:col-span-2">
            <Card className="shadow-2xl overflow-hidden bg-gradient-to-bl from-white to-purple-50/30 dark:from-gray-800 dark:to-gray-900 border-0 rounded-3xl">
              <CardHeader className="bg-gradient-to-l from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 text-white py-6">
                <CardTitle className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{t('districts.show.details_title')}</div>
                    <div className="text-purple-100 text-sm font-medium">{t('districts.show.details_description')}</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6 bg-white dark:bg-gray-800">
                <div className="flex flex-wrap gap-3">
                  <Badge variant="outline" className="flex items-center gap-2 px-4 py-2 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/20">
                    <MapPin className="h-4 w-4" />
                    {t('districts.show.province')}: {district.province?.name || 'N/A'}
                  </Badge>

                  <Badge
                    variant={district.status === 'active' ? 'default' : 'secondary'}
                    className="flex items-center gap-2 px-4 py-2"
                  >
                    {district.status}
                  </Badge>
                </div>

                {district.description && (
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100">{t('districts.show.description_label')}</h3>
                    <div className="text-purple-800 dark:text-purple-200 font-medium leading-relaxed">
                      {district.description}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* District Information Card */}
          <div>
            <Card className="shadow-2xl overflow-hidden bg-gradient-to-bl from-white to-purple-50/30 dark:from-gray-800 dark:to-gray-900 border-0 rounded-3xl">
              <CardHeader className="bg-gradient-to-l from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 text-white py-6">
                <CardTitle className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-xl font-bold">{t('districts.show.info_title')}</div>
                    <div className="text-purple-100 text-sm font-medium">{t('districts.show.info_description')}</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6 bg-white dark:bg-gray-800">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <div>
                      <div className="text-sm font-medium text-purple-600 dark:text-purple-400">{t('districts.show.created_by')}</div>
                      <div className="font-semibold text-purple-900 dark:text-purple-100">{district.creator?.name || 'Unknown'}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <div>
                      <div className="text-sm font-medium text-purple-600 dark:text-purple-400">{t('districts.show.created_at')}</div>
                      <div className="font-semibold text-purple-900 dark:text-purple-100">{format(new Date(district.created_at), 'PPP')}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <div>
                      <div className="text-sm font-medium text-purple-600 dark:text-purple-400">{t('districts.show.updated_at')}</div>
                      <div className="font-semibold text-purple-900 dark:text-purple-100">{format(new Date(district.updated_at), 'PPP p')}</div>
                    </div>
                  </div>
                </div>

                {district.province && (
                  <div className="pt-4 border-t border-purple-200 dark:border-purple-700">
                    <CanView model="province">
                      <Button variant="outline" className="w-full h-12 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:border-purple-400 dark:hover:border-purple-500 rounded-xl transition-all duration-300 hover:scale-105" asChild>
                        <Link href={route('provinces.show', district.province.id)}>
                          <MapPin className="mr-2 h-4 w-4" />
                          {t('districts.show.view_province')}
                        </Link>
                      </Button>
                    </CanView>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
