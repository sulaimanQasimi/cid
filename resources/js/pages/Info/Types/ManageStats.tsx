import React from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Database, BarChart3, Settings, Plus, X, AlertTriangle, Building2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';
import { usePermissions } from '@/hooks/use-permissions';
import { CanUpdate } from '@/components/ui/permission-guard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TreeViewStatSelector from '@/components/reports/TreeViewStatSelector';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

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
  stat_category_item: {
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
  integer_value: number | null;
  string_value: string | null;
  notes: string | null;
  created_at: string;
}

interface InfoType {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  infoStats?: InfoStat[];
}

interface ManageStatsProps {
  infoType: InfoType;
  statItems: StatCategoryItem[];
  statCategories: StatCategory[];
}

export default function ManageStats({ infoType, statItems, statCategories }: ManageStatsProps) {
  const { t } = useTranslation();
  const { canUpdate } = usePermissions();
  
  // State for managing statistical data
  const [statsData, setStatsData] = useState<{
    [key: number]: { value: string; notes: string | null };
  }>(() => {
    // Initialize with existing stats
    const initialData: { [key: number]: { value: string; notes: string | null } } = {};
    
    // Check if infoStats exists and is an array before iterating
    if (infoType.infoStats && Array.isArray(infoType.infoStats)) {
      infoType.infoStats.forEach(stat => {
        const value = stat.integer_value !== null ? stat.integer_value.toString() : stat.string_value || '';
        initialData[stat.stat_category_item.id] = {
          value,
          notes: stat.notes
        };
      });
    }
    
    return initialData;
  });

  // Add state for category filter
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const [processing, setProcessing] = useState(false);

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
      title: infoType.name,
      href: route('info-types.show', infoType.id),
    },
    {
      title: t('info_types.manage_stats.page_title'),
      href: '#',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (processing) return;

    // Prepare stats data for submission
    const stats = Object.entries(statsData)
      .filter(([_, { value }]) => value.trim() !== '')
      .map(([itemId, { value, notes }]) => ({
        stat_category_item_id: parseInt(itemId),
        value: value.trim(),
        notes: notes?.trim() || null,
      }));

    if (stats.length === 0) {
      alert(t('info_types.manage_stats.no_stats_error'));
      return;
    }

    setProcessing(true);

    try {
      await router.put(route('info-types.stats.update', infoType.id), {
        stats: stats
      }, {
        preserveScroll: true,
        onSuccess: () => {
          // Refresh the page data
          router.reload({ only: ['infoType'] });
        },
        onError: (errors) => {
          console.error('Save errors:', errors);
          alert(t('info_types.manage_stats.save_error'));
        },
        onFinish: () => {
          setProcessing(false);
        }
      });
    } catch (error) {
      console.error('Submit error:', error);
      setProcessing(false);
      alert(t('info_types.manage_stats.save_error'));
    }
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

  // Get stats count for display
  const statsCount = Object.values(statsData).filter(({ value }) => value.trim() !== '').length;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('info_types.manage_stats.page_title', { name: infoType.name })} />
      
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
                <Settings className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl tracking-tight">
                  {t('info_types.manage_stats.page_title', { name: infoType.name })}
                </h2>
                <div className="text-white/90 flex items-center gap-3 text-xl font-medium">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Database className="h-6 w-6" />
                  </div>
                  {t('info_types.manage_stats.page_description')}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button asChild variant="outline" size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105">
                <Link href={route('info-types.show', infoType.id)} className="flex items-center gap-3">
                  <ArrowLeft className="h-5 w-5" />
                  {t('info_types.manage_stats.back_button')}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Management Form */}
        <CanUpdate model="info_type">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-8">
              <Card className="shadow-2xl bg-gradient-to-bl from-white to-purple-50/30 border-0 rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-l from-purple-500 to-purple-600 text-white py-6">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
                        <Save className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{t('info_types.manage_stats.form_title')}</div>
                        <div className="text-purple-100 text-sm font-medium">{t('info_types.manage_stats.form_description')}</div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-white/20 text-white px-3 py-1">
                      {statsCount} {t('info_types.manage_stats.selected_count')}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-8 space-y-6">
                  <div className="mb-6">
                    <Label htmlFor="category-filter" className="text-base font-medium flex items-center gap-2 text-purple-700 text-right" dir="rtl">
                      {t('info_types.manage_stats.filter_by_category')}
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
                      <p className="text-lg font-semibold text-purple-800 mb-2">{t('info_types.manage_stats.no_items')}</p>
                      <p className="text-purple-600">{t('info_types.manage_stats.no_items_description')}</p>
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
                    asChild
                    className="h-12 px-6 shadow-lg border-purple-300 text-purple-700 hover:bg-purple-100 hover:border-purple-400 rounded-xl transition-all duration-300 hover:scale-105 text-lg font-semibold"
                  >
                    <Link href={route('info-types.show', infoType.id)}>
                      {t('info_types.manage_stats.cancel_button')}
                    </Link>
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={processing}
                    className="h-12 px-8 bg-gradient-to-l from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 shadow-2xl rounded-xl transition-all duration-300 hover:scale-105 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {t('info_types.manage_stats.saving_button')}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Save className="h-5 w-5" />
                        {t('info_types.manage_stats.save_button')}
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </form>
        </CanUpdate>
      </div>
    </AppLayout>
  );
}
