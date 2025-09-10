import React, { useState, useCallback, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Database, Settings, Building2, AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';
import { CanUpdate } from '@/components/ui/permission-guard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/template/header';
import FooterButtons from '@/components/template/FooterButtons';
// Note: Using browser alert for simplicity, can be replaced with toast notifications

// Type definitions
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
  children?: StatCategoryItem[];
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

interface StatData {
  value: string;
  notes: string;
}

interface ManageStatsProps {
  infoType: InfoType;
  statItems: StatCategoryItem[];
  statCategories: StatCategory[];
}

// Tree organization helper
function organizeItemsIntoTree(items: StatCategoryItem[]): StatCategoryItem[] {
  const itemMap = new Map<number, StatCategoryItem>();
  const rootItems: StatCategoryItem[] = [];

  // First pass: create map and add children array
  items.forEach(item => {
    itemMap.set(item.id, { ...item, children: [] });
  });

  // Second pass: organize tree structure
  items.forEach(item => {
    const mappedItem = itemMap.get(item.id)!;
    if (item.parent_id === null) {
      rootItems.push(mappedItem);
    } else {
      const parent = itemMap.get(item.parent_id);
      if (parent) {
        parent.children!.push(mappedItem);
      }
    }
  });

  return rootItems;
}

// Tree node component
const TreeNode: React.FC<{
  item: StatCategoryItem;
  level: number;
  statsData: Record<number, StatData>;
  onValueChange: (itemId: number, value: string) => void;
  onNotesChange: (itemId: number, notes: string) => void;
}> = ({ item, level, statsData, onValueChange, onNotesChange }) => {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = item.children && item.children.length > 0;
  const isLeaf = !hasChildren;
  const paddingLeft = level * 20;

  const currentStat = statsData[item.id] || { value: '', notes: '' };

  return (
    <div className="w-full">
      {/* Item Row */}
      <div
        className={`flex items-center py-3 border-b border-gray-100 dark:border-gray-800 ${
          hasChildren ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50' : ''
        }`}
        style={{ paddingLeft }}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {/* Expand/Collapse Icon */}
        <div className="w-5 flex justify-center">
          {hasChildren && (
            <div className="text-gray-400">
              {expanded ? '▼' : '▶'}
            </div>
          )}
        </div>

        {/* Color Indicator */}
        <div
          className="h-3 w-3 rounded-full mr-3 flex-shrink-0"
          style={{ backgroundColor: item.color || item.category.color || '#e2e8f0' }}
        />

        {/* Label */}
        <div className="font-medium flex-grow text-gray-900 dark:text-gray-100">
          {item.label}
        </div>

        {/* Value Input (for leaf nodes only) */}
        {isLeaf && (
          <div className="flex-shrink-0 ml-4 w-32">
            <Input
              value={currentStat.value}
              onChange={(e) => onValueChange(item.id, e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder="Value"
              className="text-right h-8 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700"
            />
          </div>
        )}
      </div>

      {/* Notes Section (for leaf nodes with values) */}
      {isLeaf && currentStat.value.trim() && (
        <div style={{ paddingLeft: paddingLeft + 20 }} className="py-2 border-b border-gray-100 dark:border-gray-800">
          <Textarea
            value={currentStat.notes}
            onChange={(e) => onNotesChange(item.id, e.target.value)}
            placeholder="Notes (optional)"
            className="text-sm resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700"
            rows={2}
          />
        </div>
      )}

      {/* Children */}
      {hasChildren && expanded && (
        <div>
          {item.children!.map(child => (
            <TreeNode
              key={child.id}
              item={child}
              level={level + 1}
              statsData={statsData}
              onValueChange={onValueChange}
              onNotesChange={onNotesChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Main component
export default function ManageStats({ infoType, statItems, statCategories }: ManageStatsProps) {
  const { t } = useTranslation();
  
  // State management
  const [statsData, setStatsData] = useState<Record<number, StatData>>(() => {
    const initialData: Record<number, StatData> = {};
    
    if (infoType.infoStats && Array.isArray(infoType.infoStats)) {
      infoType.infoStats.forEach(stat => {
        const value = stat.integer_value !== null 
          ? stat.integer_value.toString() 
          : stat.string_value || '';
        
        initialData[stat.stat_category_item.id] = {
          value,
          notes: stat.notes || ''
        };
      });
    }
    
    return initialData;
  });

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Computed values
  const treeItems = useMemo(() => organizeItemsIntoTree(statItems), [statItems]);
  
  const filteredTreeItems = useMemo(() => {
    if (!selectedCategory) return treeItems;
    
    const filterByCategory = (items: StatCategoryItem[]): StatCategoryItem[] => {
      return items.reduce((acc: StatCategoryItem[], item) => {
        if (item.category.id === selectedCategory) {
          acc.push(item);
        } else if (item.children) {
          const filteredChildren = filterByCategory(item.children);
          if (filteredChildren.length > 0) {
            acc.push({ ...item, children: filteredChildren });
          }
        }
        return acc;
      }, []);
    };
    
    return filterByCategory(treeItems);
  }, [treeItems, selectedCategory]);

  const statsCount = useMemo(() => {
    return Object.values(statsData).filter(stat => stat.value.trim() !== '').length;
  }, [statsData]);

  // Event handlers
  const handleValueChange = useCallback((itemId: number, value: string) => {
    setStatsData(prev => ({
      ...prev,
      [itemId]: {
        value,
        notes: prev[itemId]?.notes || ''
      }
    }));
  }, []);

  const handleNotesChange = useCallback((itemId: number, notes: string) => {
    setStatsData(prev => ({
      ...prev,
      [itemId]: {
        value: prev[itemId]?.value || '',
        notes
      }
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;

    // Prepare data for submission
    const statsToSubmit = Object.entries(statsData)
      .filter(([_, data]) => data.value.trim() !== '')
      .map(([itemId, data]) => ({
        stat_category_item_id: parseInt(itemId, 10),
        value: data.value.trim(),
        notes: data.notes.trim() || null
      }));

    if (statsToSubmit.length === 0) {
      alert(t('info_types.manage_stats.no_stats_error'));
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise<void>((resolve, reject) => {
        router.put(
          route('info-types.stats.update', infoType.id),
          { stats: statsToSubmit },
          {
            preserveScroll: true,
            onSuccess: () => {
              alert(t('info_types.manage_stats.save_success'));
              // Refresh the page to show updated stats
              router.reload({ only: ['infoType'] });
              resolve();
            },
            onError: (errors) => {
              console.error('Validation errors:', errors);
              alert(t('info_types.manage_stats.save_error'));
              reject(new Error('Validation failed'));
            },
            onFinish: () => {
              setIsSubmitting(false);
            }
          }
        );
      });
    } catch (error) {
      console.error('Submit error:', error);
      setIsSubmitting(false);
    }
  }, [isSubmitting, statsData, infoType.id, t]);

  const handleFormSubmit = useCallback(async () => {
    if (isSubmitting) return;

    // Prepare data for submission
    const statsToSubmit = Object.entries(statsData)
      .filter(([_, data]) => data.value.trim() !== '')
      .map(([itemId, data]) => ({
        stat_category_item_id: parseInt(itemId, 10),
        value: data.value.trim(),
        notes: data.notes.trim() || null
      }));

    if (statsToSubmit.length === 0) {
      alert(t('info_types.manage_stats.no_stats_error'));
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise<void>((resolve, reject) => {
        router.put(
          route('info-types.stats.update', infoType.id),
          { stats: statsToSubmit },
          {
            preserveScroll: true,
            onSuccess: () => {
              alert(t('info_types.manage_stats.save_success'));
              // Refresh the page to show updated stats
              router.reload({ only: ['infoType'] });
              resolve();
            },
            onError: (errors) => {
              console.error('Validation errors:', errors);
              alert(t('info_types.manage_stats.save_error'));
              reject(new Error('Validation failed'));
            },
            onFinish: () => {
              setIsSubmitting(false);
            }
          }
        );
      });
    } catch (error) {
      console.error('Submit error:', error);
      setIsSubmitting(false);
    }
  }, [isSubmitting, statsData, infoType.id, t]);

  const handleCancel = useCallback(() => {
    router.visit(route('info-types.show', infoType.id));
  }, [infoType.id]);

  // Breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = [
    { title: t('info_types.page_title'), href: route('info-types.index') },
    { title: t('info_types.page_title'), href: route('info-types.index') },
    { title: infoType.name, href: route('info-types.show', infoType.id) },
    { title: t('info_types.manage_stats.page_title'), href: '#' }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('info_types.manage_stats.page_title', { name: infoType.name })} />
      
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header Component */}
        <Header
          title={t('info_types.manage_stats.page_title', { name: infoType.name })}
          description={t('info_types.manage_stats.page_description')}
          icon={<Settings className="h-6 w-6 text-white" />}
          model="info_type"
          routeName={route('info-types.stats', infoType.id)}
          theme="purple"
          buttonText={t('info_types.manage_stats.back_button')}
          showBackButton={true}
          backRouteName={route('info-types.show', infoType.id)}
          backButtonText={t('info_types.manage_stats.back_button')}
          showButton={false}
          actionButtons={
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              <Link href={route('info-types.show', infoType.id)} className="flex items-center gap-3">
                <ArrowLeft className="h-5 w-5" />
                {t('info_types.manage_stats.back_button')}
              </Link>
            </Button>
          }
        />

        {/* Main Content */}
        <CanUpdate model="info_type">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Stats Management Card */}
            <Card className="shadow-xl border-0 rounded-2xl overflow-hidden bg-gradient-to-bl from-white dark:from-gray-800 to-purple-50/30 dark:to-purple-900/20">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl">
                      <Database className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xl font-bold">{t('info_types.manage_stats.form_title')}</div>
                      <div className="text-purple-100 text-sm">{t('info_types.manage_stats.form_description')}</div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white px-3 py-1">
                    {statsCount} {t('info_types.manage_stats.selected_count')}
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6 space-y-6">
                {/* Category Filter */}
                <div>
                  <Label htmlFor="category-filter" className="text-base font-medium flex items-center gap-2 text-purple-700 dark:text-purple-300 mb-2">
                    <Building2 className="h-4 w-4" />
                    {t('info_types.manage_stats.filter_by_category')}
                  </Label>
                  <Select
                    value={selectedCategory?.toString() || 'all'}
                    onValueChange={(value) => setSelectedCategory(value !== 'all' ? parseInt(value, 10) : null)}
                  >
                    <SelectTrigger className="h-12 border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                      <SelectValue placeholder={t('incidents.filters.all_categories')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('incidents.filters.all_categories')}</SelectItem>
                      {statCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            {category.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Stats Tree */}
                {filteredTreeItems.length > 0 ? (
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 font-medium text-sm text-gray-900 dark:text-gray-100">
                      <span>{t('info_types.manage_stats.category_items')}</span>
                      <span className="w-32 text-right">{t('info_types.manage_stats.value_column')}</span>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredTreeItems.map(item => (
                        <TreeNode
                          key={item.id}
                          item={item}
                          level={0}
                          statsData={statsData}
                          onValueChange={handleValueChange}
                          onNotesChange={handleNotesChange}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="p-4 bg-purple-100 dark:bg-purple-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <AlertTriangle className="h-8 w-8 text-purple-400 dark:text-purple-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-2">
                      {t('info_types.manage_stats.no_items')}
                    </h3>
                    <p className="text-purple-600 dark:text-purple-400">
                      {t('info_types.manage_stats.no_items_description')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
              <CardContent className="p-6 bg-gradient-to-r from-purple-50 dark:from-purple-900/20 to-white dark:to-gray-800">
                <FooterButtons
                  onCancel={handleCancel}
                  onSubmit={handleFormSubmit}
                  processing={isSubmitting}
                  cancelText={t('info_types.manage_stats.cancel_button')}
                  submitText={t('info_types.manage_stats.save_button')}
                  savingText={t('info_types.manage_stats.saving_button')}
                  disabled={statsCount === 0}
                />
              </CardContent>
            </Card>
          </form>
        </CanUpdate>
      </div>
    </AppLayout>
  );
}