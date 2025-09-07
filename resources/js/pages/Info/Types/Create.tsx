import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, FileText, BarChart3, Save, X, AlertTriangle, Building2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';
import { usePermissions } from '@/hooks/use-permissions';
import { CanCreate } from '@/components/ui/permission-guard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TreeViewStatSelector from '@/components/reports/TreeViewStatSelector';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/template/header';

interface StatCategory {
  id: number;
  name: string;
  label: string;
  color: string;
  status: string;
}

interface StatCategoryItem {
  id: number;
  name: string;
  label: string;
  color: string | null;
  parent_id: number | null;
  category: {
    id: number;
    name: string;
    label: string;
    color: string;
  };
}

interface CreateProps {
  statItems: StatCategoryItem[];
  statCategories: StatCategory[];
}

type InfoTypeFormData = {
  name: string;
  code?: string;
  description?: string;
  stats?: Array<{
    stat_category_item_id: number;
    value: string;
    notes?: string;
  }>;
};

export default function InfoTypesCreate({ statItems, statCategories }: CreateProps) {
  const { t } = useTranslation();
  const { canCreate } = usePermissions();
  
  const { data, setData, post, processing, errors } = useForm<InfoTypeFormData>({
    name: '',
    code: '',
    description: '',
  });

  // State for managing statistical data
  const [statsData, setStatsData] = useState<{
    [key: number]: { value: string; notes: string | null };
  }>({});

  // Add state for category filter
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('info.page_title'),
      href: route('infos.index'),
    },
    {
      title: t('info_types.page_title'),
      href: route('info-types.index'),
    },
    {
      title: t('info_types.create.page_title'),
      href: '#',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare stats data for submission
    const stats = Object.entries(statsData)
      .filter(([_, { value }]) => value.trim() !== '')
      .map(([itemId, { value, notes }]) => ({
        stat_category_item_id: parseInt(itemId),
        value,
        notes: notes || undefined,
      }));

    // Add stats to form data
    if (stats.length > 0) {
      setData('stats', stats);
    }

    // Submit the form
    post(route('info-types.store'));
  };

  // Group stat items by category for the dropdown filter
  const categoriesForFilter = statCategories.map(category => ({
    id: category.id,
    label: category.label,
    color: category.color
  }));

  // Filter stat items by category if one is selected
  const filteredStatItems = selectedCategory
    ? statItems.filter(item => item.category.id === selectedCategory)
    : statItems;

  // Handle stat input change
  function handleStatChange(itemId: number, value: string) {
    setStatsData(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId] || { notes: null }, value }
    }));
  }

  // Handle stat notes change
  function handleNotesChange(itemId: number, notes: string) {
    setStatsData(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId] || { value: '' }, notes: notes || null }
    }));
  }

  const statsCount = Object.keys(statsData).length;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('info_types.create.page_title')} />
      
      <div className="container px-0 py-6">
        <Header
          title={t('info_types.create.page_title')}
          description={t('info_types.create.page_description')}
          icon={<FileText className="h-6 w-6 text-white" />}
          model="info_type"
          routeName="info-types.create"
          buttonText={t('info_types.create.save_button')}
          theme="purple"
          buttonSize="lg"
          showBackButton={true}
          backRouteName="info-types.index"
          backButtonText={t('info_types.create.back_button')}
        />

        {/* Create Form Card */}
        <CanCreate model="info_type">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-8">
              <Card className="shadow-2xl bg-gradient-to-bl from-white to-purple-50/30 border-0 rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-l from-purple-500 to-purple-600 text-white py-6">
                  <CardTitle className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
                      <Save className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{t('info_types.create.form_title')}</div>
                      <div className="text-purple-100 text-sm font-medium">{t('info_types.create.form_description')}</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-8 space-y-8">
                  {/* Name Field */}
                  <div className="space-y-4">
                    <Label htmlFor="name" className="text-lg font-semibold text-purple-800 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {t('info_types.create.name_label')} *
                    </Label>
                    <div className="relative">
                      <Input
                        id="name"
                        value={data.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('name', e.target.value)}
                        required
                        className="h-12 text-lg border-purple-200 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 to-white rounded-xl shadow-lg"
                        placeholder={t('info_types.create.name_placeholder')}
                      />
                      {errors.name && (
                        <div className="mt-2 flex items-center gap-2 text-red-600">
                          <X className="h-4 w-4" />
                          <p className="text-sm font-medium">{errors.name}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Code Field */}
                  <div className="space-y-4">
                    <Label htmlFor="code" className="text-lg font-semibold text-purple-800 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      {t('info_types.create.code_label')}
                    </Label>
                    <div className="relative">
                      <Input
                        id="code"
                        value={data.code}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('code', e.target.value)}
                        className="h-12 text-lg border-purple-200 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 to-white rounded-xl shadow-lg"
                        placeholder={t('info_types.create.code_placeholder')}
                      />
                      {errors.code && (
                        <div className="mt-2 flex items-center gap-2 text-red-600">
                          <X className="h-4 w-4" />
                          <p className="text-sm font-medium">{errors.code}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description Field */}
                  <div className="space-y-4">
                    <Label htmlFor="description" className="text-lg font-semibold text-purple-800 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {t('info_types.create.description_label')}
                    </Label>
                    <div className="relative">
                      <Textarea
                        id="description"
                        value={data.description}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                        rows={4}
                        className="text-lg border-purple-200 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 to-white rounded-xl shadow-lg resize-none"
                        placeholder={t('info_types.create.description_placeholder')}
                      />
                      {errors.description && (
                        <div className="mt-2 flex items-center gap-2 text-red-600">
                          <X className="h-4 w-4" />
                          <p className="text-sm font-medium">{errors.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-2xl bg-gradient-to-bl from-white to-purple-50/30 border-0 rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-l from-purple-500 to-purple-600 text-white py-6">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
                        <AlertTriangle className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{t('info_types.stats.title')}</div>
                        <div className="text-purple-100 text-sm font-medium">{t('info_types.stats.description')}</div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-white/20 text-white px-3 py-1">
                      {statsCount} {t('info_types.stats.selected_count')}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="mb-6">
                    <Label htmlFor="category-filter" className="text-base font-medium flex items-center gap-2 text-purple-700 text-right" dir="rtl">
                      {t('info_types.stats.filter_by_category')}
                      <Building2 className="h-4 w-4" />
                    </Label>
                    <Select
                      value={selectedCategory?.toString() || 'all'}
                      onValueChange={(value) => setSelectedCategory(value !== 'all' ? parseInt(value) : null)}
                    >
                      <SelectTrigger id="category-filter" className="h-12 border-purple-200 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 to-white text-right">
                        <SelectValue placeholder={t('incidents.filters.all_categories')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('incidents.filters.all_categories')}</SelectItem>
                        {categoriesForFilter.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            <div className="flex items-center">
                              <div
                                className="mr-2 h-3 w-3 rounded-full"
                                style={{ backgroundColor: category.color }}
                              ></div>
                              {category.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {filteredStatItems.length > 0 ? (
                    <TreeViewStatSelector
                      items={filteredStatItems}
                      statsData={statsData}
                      onValueChange={handleStatChange}
                      onNotesChange={handleNotesChange}
                    />
                  ) : (
                    <div className="text-center py-8">
                      <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <AlertTriangle className="h-8 w-8 text-purple-400" />
                      </div>
                      <p className="text-lg font-semibold text-purple-800 mb-2">{t('info_types.stats.no_items')}</p>
                      <p className="text-purple-600">{t('info_types.stats.no_items_description')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Form Actions */}
              <Card className="shadow-2xl bg-gradient-to-bl from-white to-purple-50/30 border-0 rounded-3xl overflow-hidden">
                <CardContent className="px-8 py-6 bg-gradient-to-l from-purple-50 to-white border-t border-purple-200 flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.history.back()}
                    className="h-12 px-6 shadow-lg border-purple-300 text-purple-700 hover:bg-purple-100 hover:border-purple-400 rounded-xl transition-all duration-300 hover:scale-105 text-lg font-semibold"
                  >
                    {t('info_types.create.cancel_button')}
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={processing}
                    className="h-12 px-8 bg-gradient-to-l from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 shadow-2xl rounded-xl transition-all duration-300 hover:scale-105 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {t('info_types.create.saving_button')}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Save className="h-5 w-5" />
                        {t('info_types.create.save_button')}
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </form>
        </CanCreate>
      </div>
    </AppLayout>
  );
}
