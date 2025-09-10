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
import Header from '@/components/template/header';
import FooterButtons from '@/components/template/FooterButtons';

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
  const [processing, setProcessing] = React.useState(false);

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
    setProcessing(true);
    router.put(route('info-types.update', infoType.id), formData, {
      onFinish: () => setProcessing(false),
    });
  };

  const handleFormSubmit = () => {
    setProcessing(true);
    router.put(route('info-types.update', infoType.id), formData, {
      onFinish: () => setProcessing(false),
    });
  };

  const handleCancel = () => {
    router.visit(route('info-types.index'));
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
        {/* Header Component */}
        <Header
          title={t('info_types.edit.page_title', { name: infoType.name })}
          description={t('info_types.edit.page_description')}
          icon={<Pencil className="h-6 w-6 text-white" />}
          model="info_type"
          routeName={route('info-types.edit', infoType.id)}
          theme="purple"
          buttonText={t('info_types.edit.back_button')}
          showBackButton={true}
          backRouteName={route('info-types.index')}
          backButtonText={t('info_types.edit.back_button')}
          showButton={false}
          actionButtons={
            <Button asChild variant="outline" size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105">
              <Link href={route('info-types.index')} className="flex items-center gap-3">
                <ArrowLeft className="h-5 w-5" />
                {t('info_types.edit.back_button')}
              </Link>
            </Button>
          }
        />

        {/* Edit Form Card */}
        <CanUpdate model="info_type">
          <Card className="shadow-2xl bg-gradient-to-bl from-white dark:from-gray-800 to-purple-50/30 dark:to-purple-900/20 border-0  overflow-hidden">
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
                  <Label htmlFor="name" className="text-lg font-semibold text-purple-800 dark:text-purple-200">
                    {t('info_types.edit.name_label')} *
                  </Label>
                  <div className="relative">
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="h-12 text-lg border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl shadow-lg"
                      placeholder={t('info_types.edit.name_placeholder')}
                    />
                  </div>
                </div>

                {/* Description Field */}
                <div className="space-y-4">
                  <Label htmlFor="description" className="text-lg font-semibold text-purple-800 dark:text-purple-200">
                    {t('info_types.edit.description_label')}
                  </Label>
                  <div className="relative">
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="text-lg border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl shadow-lg resize-none"
                      placeholder={t('info_types.edit.description_placeholder')}
                    />
                  </div>
                </div>
              </CardContent>

              {/* Form Actions */}
              <div className="px-8 py-6 bg-gradient-to-l from-purple-50 dark:from-purple-900/20 to-white dark:to-gray-800">
                <FooterButtons
                  onCancel={handleCancel}
                  onSubmit={handleFormSubmit}
                  processing={processing}
                  cancelText={t('info_types.edit.cancel_button')}
                  submitText={t('info_types.edit.save_button')}
                  savingText={t('info_types.edit.saving_button')}
                />
              </div>
            </form>
          </Card>
        </CanUpdate>

        {/* Stats Management Card */}
        <Card className="shadow-2xl bg-gradient-to-bl from-white dark:from-gray-800 to-purple-50/30 dark:to-purple-900/20 border-0  overflow-hidden mt-8">
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
                  <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200">{t('info_types.edit.current_stats')}</h3>
                  <p className="text-purple-600 dark:text-purple-400">{t('info_types.edit.current_stats_description')}</p>
                </div>
                <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-3 py-1">
                  {infoType.infoStats?.length || 0} {t('info_types.edit.stats_count')}
                </Badge>
              </div>
              
              {infoType.infoStats && infoType.infoStats.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {infoType.infoStats.map((stat) => (
                    <div key={stat.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-purple-200 dark:border-purple-700">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: stat.stat_category_item.category.color }}
                        ></div>
                        <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                          {stat.stat_category_item.category.label}
                        </span>
                      </div>
                      <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">
                        {stat.stat_category_item.label}
                      </h4>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400 mb-2">
                        {stat.integer_value !== null ? stat.integer_value : stat.string_value}
                      </p>
                      {stat.notes && (
                        <p className="text-sm text-purple-600 dark:text-purple-400 italic">
                          {stat.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="p-4 bg-purple-100 dark:bg-purple-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Database className="h-8 w-8 text-purple-400 dark:text-purple-300" />
                  </div>
                  <p className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-2">{t('info_types.edit.no_stats')}</p>
                  <p className="text-purple-600 dark:text-purple-400 mb-4">{t('info_types.edit.no_stats_description')}</p>
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
