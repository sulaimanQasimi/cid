import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BarChart3, Save, X, AlertTriangle, Building2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';
import { usePermissions } from '@/hooks/use-permissions';
import { CanUpdate } from '@/components/ui/permission-guard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TreeViewStatSelector from '@/components/reports/TreeViewStatSelector';
import { Label } from '@/components/ui/label';
import Header from '@/components/template/header';
import FooterButtons from '@/components/template/FooterButtons';

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

interface InfoStat {
  id: number;
  stat_category_item_id: number;
  string_value: string;
  notes: string | null;
  statCategoryItem: {
    id: number;
    name: string;
    label: string;
    category: {
      id: number;
      name: string;
      label: string;
      color: string;
    };
  };
}

interface NationalInsightCenterInfoItem {
  id: number;
  title: string;
  registration_number: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  itemStats: InfoStat[];
}

interface ManageStatsProps {
  item: NationalInsightCenterInfoItem;
  statItems: StatCategoryItem[];
  statCategories: StatCategory[];
}

type ManageStatsFormData = {
  stats: Array<{
    stat_category_item_id: number;
    value: string;
    notes: string | undefined;
  }>;
};

export default function ManageStats({ item, statItems, statCategories }: ManageStatsProps) {
  const { t } = useTranslation();
  const { canUpdate } = usePermissions();

  const { data, setData, put, processing, errors } = useForm<ManageStatsFormData>({
    stats: []
  });

  // State for managing statistical data
  const [statsData, setStatsData] = useState<{
    [key: number]: { value: string; notes: string | null };
  }>(() => {
    const initialStatsData: { [key: number]: { value: string; notes: string | null } } = {};
    item.itemStats?.forEach(stat => {
      initialStatsData[stat.statCategoryItem.id] = {
        value: stat.string_value || '',
        notes: stat.notes
      };
    });
    return initialStatsData;
  });

  // Add state for category filter
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('national_insight_center_info.page_title'),
      href: route('national-insight-center-infos.index'),
    },
    {
      title: item.title,
      href: route('national-insight-center-info-items.show', item.id),
    },
    {
      title: t('national_insight_center_info_item.stats.title'),
      href: '#',
    },
  ];

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    // Prepare stats data for submission
    const stats = Object.entries(statsData)
      .filter(([_, { value }]) => value.trim() !== '')
      .map(([itemId, { value, notes }]) => ({
        stat_category_item_id: parseInt(itemId),
        value,
        notes: notes || undefined,
      }));

    // Set the data and submit
    setData('stats', stats);
    put(route('national-insight-center-info-items.stats.update', item.id));
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
      <Head title={t('national_insight_center_info_item.stats.title', { name: item.title })} />

      <div className="container px-0 py-6">
        <Header
          title={t('national_insight_center_info_item.stats.title', { name: item.title })}
          description={t('national_insight_center_info_item.stats.description')}
          icon={<BarChart3 className="h-6 w-6 text-white" />}
          model="national_insight_center_info_item"
          routeName="national-insight-center-info-items.stats"
          buttonText={t('national_insight_center_info_item.stats.save_button')}
          theme="purple"
          buttonSize="lg"
          showBackButton={true}
          backRouteName="national-insight-center-info-items.show"
          backButtonText={t('national_insight_center_info_item.stats.back_button')}
          showButton={false}
          actionButtons={
            <>
              <Button asChild variant="outline" size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105">
                <Link href={route('national-insight-center-info-items.show', item.id)} className="flex items-center gap-3">
                  <ArrowLeft className="h-5 w-5" />
                  {t('national_insight_center_info_item.stats.back_button')}
                </Link>
              </Button>
            </>
          }
        />

        {/* Stats Management Form */}
        <CanUpdate model="national_insight_center_info_item">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-8">
              <Card className="shadow-2xl bg-gradient-to-bl from-white dark:from-gray-800 to-purple-50/30 dark:to-purple-900/20 border-0 overflow-hidden">
                <CardContent className="p-8 space-y-6">
                  <div className="mb-6">
                    <Label htmlFor="category-filter" className="text-base font-medium flex items-center gap-2 text-purple-700 dark:text-purple-300 text-right" dir="rtl">
                      {t('national_insight_center_info_item.stats.filter_by_category')}
                      <Building2 className="h-4 w-4" />
                    </Label>
                    <Select
                      value={selectedCategory?.toString() || 'all'}
                      onValueChange={(value) => setSelectedCategory(value !== 'all' ? parseInt(value) : null)}
                    >
                      <SelectTrigger id="category-filter" className="h-12 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 text-right">
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
                      <div className="p-4 bg-purple-100 dark:bg-purple-800/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <AlertTriangle className="h-8 w-8 text-purple-400 dark:text-purple-500" />
                      </div>
                      <p className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-2">{t('national_insight_center_info_item.stats.no_items')}</p>
                      <p className="text-purple-600 dark:text-purple-400">{t('national_insight_center_info_item.stats.no_items_description')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Form Actions */}
              <FooterButtons
                onCancel={() => window.history.back()}
                onSubmit={handleSubmit}
                processing={processing}
                cancelText={t('national_insight_center_info_item.stats.cancel_button')}
                submitText={t('national_insight_center_info_item.stats.save_button')}
                savingText={t('national_insight_center_info_item.stats.saving_button')}
              />
            </div>
          </form>
        </CanUpdate>
      </div>
    </AppLayout>
  );
}
