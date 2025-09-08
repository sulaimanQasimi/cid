import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, FileText, BarChart3, Pencil, X, Database, Settings, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/lib/i18n/translate';
import { usePermissions } from '@/hooks/use-permissions';
import { CanUpdate } from '@/components/ui/permission-guard';
import { Badge } from '@/components/ui/badge';

interface InfoType {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  infoStats?: {
    id: number;
    info_type_id: number;
    stat_category_item_id: number;
    integer_value: number | null;
    string_value: string | null;
    notes: string | null;
    stat_category_item: {
      id: number;
      label: string;
      category: {
        id: number;
        label: string;
        color: string;
      };
    };
  }[];
}

interface Props {
  infoType: InfoType;
}

export default function EditInfoType({ infoType }: Props) {
  const { t } = useTranslation();
  const { canUpdate } = usePermissions();
  
  const [formData, setFormData] = React.useState({
    name: infoType.name,
    description: infoType.description || '',
  });

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('info.page_title'),
      href: route('info-types.index'),
    },
    {
      title: t('info_types.page_title'),
      href: route('info-types.index'),
    },
    {
      title: t('info_types.edit.page_title', { name: infoType.name }),
      href: '#',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.put(route('info-types.update', infoType.id), formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('info_types.edit.page_title', { name: infoType.name })} />
      
      <div className="container px-0 py-6">
        {/* Modern Header with Glassmorphism */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-purple-600 via-indigo-600 to-blue-600 p-8 lg:p-12 text-white shadow-2xl mb-8 group">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="absolute top-0 left-0 w-80 h-80 bg-white/10 rounded-full -translate-y-40 -translate-x-40 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 translate-x-32 blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full -translate-x-16 -translate-y-16 blur-xl group-hover:scale-150 transition-transform duration-500"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8">
            <div className="flex items-center gap-8">
              <div className="p-6 bg-white/20 backdrop-blur-md rounded-3xl border border-white/30 shadow-2xl group-hover:scale-105 transition-transform duration-300">
                <Pencil className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl tracking-tight">{t('info_types.edit.page_title', { name: infoType.name })}</h2>
                <div className="text-white/90 flex items-center gap-3 text-xl font-medium">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  {t('info_types.edit.page_description')}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button asChild variant="outline" size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105">
                <Link href={route('info-types.index')} className="flex items-center gap-3">
                  <ArrowLeft className="h-5 w-5" />
                  {t('info_types.edit.back_button')}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Edit Form Card */}
        <CanUpdate model="info_type">
          <Card className="shadow-2xl bg-gradient-to-bl from-white to-purple-50/30 border-0 rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-l from-purple-500 to-purple-600 text-white py-6">
              <CardTitle className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
                  <Save className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{t('info_types.edit.form_title')}</div>
                  <div className="text-purple-100 text-sm font-medium">{t('info_types.edit.form_description')}</div>
                </div>
              </CardTitle>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="p-8 space-y-8">
                {/* Name Field */}
                <div className="space-y-4">
                  <Label htmlFor="name" className="text-lg font-semibold text-purple-800">
                    {t('info_types.edit.name_label')} *
                  </Label>
                  <div className="relative">
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="h-12 text-lg border-purple-200 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 to-white rounded-xl shadow-lg"
                      placeholder={t('info_types.edit.name_placeholder')}
                    />
                  </div>
                </div>

                {/* Description Field */}
                <div className="space-y-4">
                  <Label htmlFor="description" className="text-lg font-semibold text-purple-800">
                    {t('info_types.edit.description_label')}
                  </Label>
                  <div className="relative">
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="text-lg border-purple-200 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 to-white rounded-xl shadow-lg resize-none"
                      placeholder={t('info_types.edit.description_placeholder')}
                    />
                  </div>
                </div>
              </CardContent>

              {/* Form Actions */}
              <div className="px-8 py-6 bg-gradient-to-l from-purple-50 to-white border-t border-purple-200 flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  asChild
                  className="h-12 px-6 shadow-lg border-purple-300 text-purple-700 hover:bg-purple-100 hover:border-purple-400 rounded-xl transition-all duration-300 hover:scale-105 text-lg font-semibold"
                >
                  <Link href={route('info-types.index')}>
                    {t('info_types.edit.cancel_button')}
                  </Link>
                </Button>
                <Button 
                  type="submit"
                  className="h-12 px-8 bg-gradient-to-l from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 shadow-2xl rounded-xl transition-all duration-300 hover:scale-105 text-lg font-semibold"
                >
                  <div className="flex items-center gap-2">
                    <Save className="h-5 w-5" />
                    {t('info_types.edit.save_button')}
                  </div>
                </Button>
              </div>
            </form>
          </Card>
        </CanUpdate>

        {/* Stats Management Card */}
        <Card className="shadow-2xl bg-gradient-to-bl from-white to-purple-50/30 border-0 rounded-3xl overflow-hidden mt-8">
          <CardHeader className="bg-gradient-to-l from-purple-500 to-purple-600 text-white py-6">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
                  <Database className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{t('info_types.edit.stats_title')}</div>
                  <div className="text-purple-100 text-sm font-medium">{t('info_types.edit.stats_description')}</div>
                </div>
              </div>
              <CanUpdate model="info_type">
                <Button asChild size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105">
                  <Link href={route('info-types.stats', infoType.id)} className="flex items-center gap-3">
                    <Settings className="h-5 w-5" />
                    {t('info_types.edit.manage_stats_button')}
                  </Link>
                </Button>
              </CanUpdate>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-purple-800">{t('info_types.edit.current_stats')}</h3>
                  <p className="text-purple-600">{t('info_types.edit.current_stats_description')}</p>
                </div>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 px-3 py-1">
                  {infoType.infoStats?.length || 0} {t('info_types.edit.stats_count')}
                </Badge>
              </div>
              
              {infoType.infoStats && infoType.infoStats.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {infoType.infoStats.map((stat) => (
                    <div key={stat.id} className="bg-gradient-to-l from-purple-50 to-white p-4 rounded-xl border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: stat.stat_category_item.category.color }}
                        ></div>
                        <span className="text-sm font-medium text-purple-700">
                          {stat.stat_category_item.category.label}
                        </span>
                      </div>
                      <h4 className="font-semibold text-purple-900 mb-1">
                        {stat.stat_category_item.label}
                      </h4>
                      <p className="text-lg font-bold text-green-600 mb-2">
                        {stat.integer_value !== null ? stat.integer_value : stat.string_value}
                      </p>
                      {stat.notes && (
                        <p className="text-sm text-purple-600 italic">
                          {stat.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Database className="h-8 w-8 text-purple-400" />
                  </div>
                  <p className="text-lg font-semibold text-purple-800 mb-2">{t('info_types.edit.no_stats')}</p>
                  <p className="text-purple-600 mb-4">{t('info_types.edit.no_stats_description')}</p>
                  <CanUpdate model="info_type">
                    <Button asChild className="bg-gradient-to-l from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105">
                      <Link href={route('info-types.stats', infoType.id)} className="flex items-center gap-3">
                        <Plus className="h-5 w-5" />
                        {t('info_types.edit.add_stats_button')}
                      </Link>
                    </Button>
                  </CanUpdate>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
