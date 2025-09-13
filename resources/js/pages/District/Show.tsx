import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, Eye, MapPin, Users, Calendar, User, Clock, AlertCircle, FileText, BarChart3, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { useTranslation } from '@/lib/i18n/translate';
import { usePermissions } from '@/hooks/use-permissions';
import { CanCreate, CanView, CanUpdate, CanDelete } from '@/components/ui/permission-guard';
import Header from '@/components/template/header';

interface IncidentData {
  id: number;
  title: string;
  incident_date: string;
  severity: string;
  status: string;
  category?: {
    id: number;
    name: string;
    color: string;
  };
}

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
  incidents: IncidentData[];
}

export default function Show({ district, incidents }: ShowProps) {
  const { canCreate, canView, canUpdate, canDelete } = usePermissions();
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

        {/* Recent Incidents Card */}
        <div className="mt-8">
          <Card className="shadow-2xl overflow-hidden bg-gradient-to-bl from-white to-purple-50/30 dark:from-gray-800 dark:to-gray-900 border-0 rounded-3xl">
            <CardHeader className="bg-gradient-to-l from-purple-500 to-purple-600 text-white py-6">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{t('districts.show.incidents_title')}</div>
                    <div className="text-purple-100 text-sm font-medium">{t('districts.show.incidents_description')}</div>
                  </div>
                </div>
                <CanCreate model="incident">
                  <Button asChild size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105 group/btn">
                    <Link href={route('incidents.create', { district_id: district.id })} className="flex items-center gap-3">
                      <div className="p-1 bg-white/20 rounded-lg group-hover/btn:scale-110 transition-transform duration-300">
                        <Plus className="h-5 w-5" />
                      </div>
                      {t('districts.show.add_incident')}
                    </Link>
                  </Button>
                </CanCreate>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 bg-white dark:bg-gray-800">
              {incidents.length === 0 ? (
                <div className="text-center py-12">
                  <div className="flex flex-col items-center gap-4 text-purple-600 dark:text-purple-400">
                    <div className="p-4 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                      <AlertCircle className="h-16 w-16 text-purple-400 dark:text-purple-500" />
                    </div>
                    <p className="text-xl font-bold text-purple-900 dark:text-purple-100">{t('districts.show.no_incidents')}</p>
                    <p className="text-purple-500 dark:text-purple-400">{t('districts.show.no_incidents_description')}</p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {incidents.map((incident) => (
                    <Card key={incident.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 bg-gradient-to-bl from-white to-purple-50/30 dark:from-gray-800 dark:to-gray-900 rounded-2xl">
                      <CardHeader className="p-6 pb-4">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">
                            <Link
                              href={route('incidents.show', incident.id)}
                              className="hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-300 text-purple-900 dark:text-purple-100 font-bold"
                            >
                              {incident.title}
                            </Link>
                          </CardTitle>
                          {incident.category && (
                            <Badge style={{ backgroundColor: incident.category.color }} className="text-white font-semibold">
                              {incident.category.name}
                            </Badge>
                          )}
                        </div>
                        <div className="text-purple-600 dark:text-purple-400 text-sm font-medium mt-2">
                          {format(new Date(incident.incident_date), 'PPP')}
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 pt-0">
                        <div className="flex justify-between items-center">
                          <Badge variant={
                            incident.severity === 'high' ? 'destructive' :
                            incident.severity === 'medium' ? 'default' : 'outline'
                          } className="font-semibold">
                            {incident.severity}
                          </Badge>

                          <CanView model="incident">
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-xl transition-all duration-300 hover:scale-105"
                            >
                              <Link href={route('incidents.show', incident.id)}>
                                <Eye className="h-4 w-4 mr-2" />
                                {t('common.view')}
                              </Link>
                            </Button>
                          </CanView>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {incidents.length > 0 && (
                <div className="flex justify-center mt-8">
                  <Button variant="outline" className="h-12 px-8 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:border-purple-400 dark:hover:border-purple-500 rounded-xl transition-all duration-300 hover:scale-105" asChild>
                    <Link href={route('incidents.index', { district_id: district.id })}>
                      {t('districts.show.view_all_incidents')}
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
