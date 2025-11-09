import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, FileText, Save, X, Users, Search, ArrowRight, Trash, User, Shield, BarChart3, Building2, AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';
import { usePermissions } from '@/hooks/use-permissions';
import { CanUpdate } from '@/components/ui/permission-guard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/template/header';
import FooterButtons from '@/components/template/FooterButtons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TreeViewStatSelector from '@/components/reports/TreeViewStatSelector';
import PersianDatePicker from '@/components/ui/PersianDatePicker';
import moment from 'moment-jalaali';


interface User {
  id: number;
  name: string;
  email: string;
}

interface AccessUser {
  id: number;
  user: {
    id: number;
    name: string;
  };
}

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

interface NationalInsightCenterInfo {
  id: number;
  name: string;
  code: string;
  description: string | null;
  date: string | null;
  created_at: string;
  updated_at: string;
  accesses?: AccessUser[];
  infoStats?: InfoStat[];
}

interface EditProps {
  nationalInsightCenterInfo: NationalInsightCenterInfo;
  users: User[];
  statItems?: StatCategoryItem[];
  statCategories?: StatCategory[];
}

type NationalInsightCenterInfoFormData = {
  name: string;
  code?: string;
  description?: string;
  date?: string;
  access_users?: number[];
  stats?: Array<{
    stat_category_item_id: number;
    value: string;
    notes?: string;
  }>;
};

export default function NationalInsightCenterInfosEdit({ nationalInsightCenterInfo, users, statItems = [], statCategories = [] }: EditProps) {
  const { t } = useTranslation();
  const { canUpdate } = usePermissions();

  const { data, setData, put, processing, errors } = useForm<NationalInsightCenterInfoFormData>({
    name: nationalInsightCenterInfo.name || '',
    code: nationalInsightCenterInfo.code || '',
    description: nationalInsightCenterInfo.description || '',
    date: nationalInsightCenterInfo.date ? (() => {
      // Convert database date (YYYY-MM-DD) to Persian format (jYYYY/jMM/jDD)
      const dbDate = moment(nationalInsightCenterInfo.date);
      return dbDate.isValid() ? dbDate.format('jYYYY/jMM/jDD') : '';
    })() : '',
    access_users: [] as number[],
  });

  // Access control state
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState<string>('');

  // Statistics state
  const [statsData, setStatsData] = useState<{
    [key: number]: { value: string; notes: string | null };
  }>(() => {
    const initialStatsData: { [key: number]: { value: string; notes: string | null } } = {};
    nationalInsightCenterInfo.infoStats?.forEach(stat => {
      initialStatsData[stat.statCategoryItem.id] = {
        value: stat.string_value || '',
        notes: stat.notes
      };
    });
    return initialStatsData;
  });

  // Category filter for stats
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);


  // Initialize selected users from existing access data
  useEffect(() => {
    if (nationalInsightCenterInfo.accesses) {
      const existingUserIds = nationalInsightCenterInfo.accesses.map(access => access.user.id);
      setSelectedUsers(existingUserIds);
      setData('access_users', existingUserIds);
    }
  }, [nationalInsightCenterInfo.accesses]);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('info.page_title'),
      href: route('national-insight-center-infos.index'),
    },
    {
      title: t('national_insight_center_info.page_title'),
      href: route('national-insight-center-infos.index'),
    },
    {
      title: nationalInsightCenterInfo.name,
      href: route('national-insight-center-infos.show', { national_insight_center_info: nationalInsightCenterInfo.id }),
    },
    {
      title: t('national_insight_center_info.edit.page_title'),
      href: '#',
    },
  ];

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

    // Include stats in the form data
    setData('stats', stats);

    // Submit the form
    put(route('national-insight-center-infos.update', nationalInsightCenterInfo.id));
  };

  // Filter stat items by category if one is selected
  const filteredStatItems = selectedCategory
    ? statItems.filter(item => item.category.id === selectedCategory)
    : statItems;

  // Group stat items by category for the dropdown filter
  const categoriesForFilter = statCategories.map(category => ({
    id: category.id,
    label: category.label,
    color: category.color
  }));


  // Access control functions
  const handleUserSelect = (userId: number) => {
    if (!selectedUsers.includes(userId)) {
      setSelectedUsers(prev => [...prev, userId]);
      setData('access_users', [...selectedUsers, userId]);
    }
  };

  const handleUserRemove = (userId: number) => {
    const newSelectedUsers = selectedUsers.filter(id => id !== userId);
    setSelectedUsers(newSelectedUsers);
    setData('access_users', newSelectedUsers);
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('national_insight_center_info.edit.page_title', { name: nationalInsightCenterInfo.name })} />

      <div className="container px-0 py-6" dir="rtl">
        <Header
          title={t('national_insight_center_info.edit.page_title', { name: nationalInsightCenterInfo.name })}
          description={t('national_insight_center_info.edit.page_description')}
          icon={<FileText className="h-6 w-6 text-white" />}
          model="national_insight_center_info"
          routeName="national-insight-center-infos.edit"
          buttonText={t('national_insight_center_info.edit.save_button')}
          theme="purple"
          buttonSize="lg"
          showBackButton={true}
          backRouteName={() => route('national-insight-center-infos.show', { national_insight_center_info: nationalInsightCenterInfo.id })}
          backButtonText={t('national_insight_center_info.edit.back_button')}
          showButton={false}
          actionButtons={
            <>
              <Button asChild variant="outline" size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105">
                <Link href={route('national-insight-center-infos.show', { national_insight_center_info: nationalInsightCenterInfo.id })} className="flex items-center gap-3">
                  <ArrowRight className="h-5 w-5" />
                  {t('national_insight_center_info.edit.back_button')}
                </Link>
              </Button>
            </>
          }
        />

        {/* Edit Form Card */}
        <CanUpdate model="national_insight_center_info">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-8">
              <Card className="shadow-2xl bg-gradient-to-bl from-white dark:from-gray-800 to-purple-50/30 dark:to-purple-900/20 border-0 overflow-hidden">
                <CardContent className="p-8">
                  <Tabs defaultValue="basic" className="w-full" dir="rtl">
                    <TabsList className="grid w-full grid-cols-3 mb-8">
                      <TabsTrigger value="basic" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {t('national_insight_center_info.basic_info')}
                      </TabsTrigger>
                      <TabsTrigger value="access" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        {t('national_insight_center_info.access_control')}
                      </TabsTrigger>
                      <TabsTrigger value="statistics" className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        {t('national_insight_center_info.statistics')}
                      </TabsTrigger>
                    </TabsList>

                    {/* Basic Information Tab */}
                    <TabsContent value="basic" className="space-y-8">
                      {/* Name Field */}
                      <div className="space-y-4">
                        <Label htmlFor="name" dir="rtl" className="text-lg font-semibold text-purple-800 dark:text-purple-200 flex items-center gap-2 text-right">
                          <FileText className="h-4 w-4" />
                          {t('national_insight_center_info.name_label')} *
                        </Label>
                        <div className="relative">
                          <Input
                            id="name"
                            value={data.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('name', e.target.value)}
                            required
                            className="h-12 text-lg border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 rounded-xl shadow-lg text-right"
                            placeholder={t('national_insight_center_info.name_placeholder')}
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
                        <Label htmlFor="code" dir="rtl" className="text-lg font-semibold text-purple-800 dark:text-purple-200 flex items-center gap-2 text-right">
                          <FileText className="h-4 w-4" />
                          {t('national_insight_center_info.code_label')}
                        </Label>
                        <div className="relative">
                          <Input
                            id="code"
                            value={data.code}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('code', e.target.value)}
                            className="h-12 text-lg border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 rounded-xl shadow-lg text-right"
                            placeholder={t('national_insight_center_info.code_placeholder')}
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
                        <Label htmlFor="description" dir="rtl" className="text-lg font-semibold text-purple-800 dark:text-purple-200 flex items-center gap-2 text-right">
                          <FileText className="h-4 w-4" />
                          {t('national_insight_center_info.description_label')}
                        </Label>
                        <div className="relative">
                          <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                            rows={4}
                            className="text-lg border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 shadow-lg resize-none text-right"
                            placeholder={t('national_insight_center_info.description_placeholder')}
                          />
                          {errors.description && (
                            <div className="mt-2 flex items-center gap-2 text-red-600">
                              <X className="h-4 w-4" />
                              <p className="text-sm font-medium">{errors.description}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Date Field */}
                      <div className="space-y-4">
                        <PersianDatePicker
                          id="date"
                          value={data.date}
                          onChange={(value) => setData('date', value)}
                          label={t('national_insight_center_info.date_label')}
                          required
                          error={errors.date}
                          className="w-full"
                        />
                      </div>
                    </TabsContent>

                    {/* Access Control Tab */}
                    <TabsContent value="access" className="space-y-6">
                      <div className="bg-gradient-to-l from-purple-50/50 dark:from-purple-900/10 to-white dark:to-gray-800 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
                        <div className="flex items-center gap-2 mb-4">
                          <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200">
                            {t('national_insight_center_info.access.title')}
                          </h3>
                        </div>
                        <p className="text-sm text-purple-600 dark:text-purple-400 mb-6">
                          {t('national_insight_center_info.access.description')}
                        </p>

                        {/* User Search */}
                        <div className="space-y-4">
                          <Label htmlFor="user-search" dir="rtl" className="text-base font-medium flex items-center gap-2 text-purple-700 dark:text-purple-300 text-right">
                            <Search className="h-4 w-4" />
                            {t('national_insight_center_info.access.search_users')}
                          </Label>
                          <div className="relative">
                            <Input
                              id="user-search"
                              value={userSearchTerm}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserSearchTerm(e.target.value)}
                              className="h-12 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 text-right"
                              placeholder={t('national_insight_center_info.access.search_placeholder')}
                            />
                          </div>
                        </div>

                        {/* User Selection */}
                        {filteredUsers.length > 0 && (
                          <div className="space-y-4">
                            <Label dir="rtl" className="text-base font-medium flex items-center gap-2 text-purple-700 dark:text-purple-300 text-right">
                              <User className="h-4 w-4" />
                              {t('national_insight_center_info.access.select_users')}
                            </Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                              {filteredUsers.map((user) => (
                                <div
                                  key={user.id}
                                  onClick={() => handleUserSelect(user.id)}
                                  className="p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 bg-white dark:bg-gray-800"
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="font-medium text-purple-800 dark:text-purple-200">{user.name}</p>
                                      <p className="text-sm text-purple-600 dark:text-purple-400">{user.email}</p>
                                    </div>
                                    {selectedUsers.includes(user.id) && (
                                      <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs">✓</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Selected Users */}
                        <div className="mt-6">
                          <div className="flex items-center justify-between mb-4">
                            <Label dir="rtl" className="text-base font-medium flex items-center gap-2 text-purple-700 dark:text-purple-300 text-right">
                              <Users className="h-4 w-4" />
                              {t('national_insight_center_info.access.selected_users')}
                              {selectedUsers.length > 0 && (
                                <span className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded-full">
                                  {selectedUsers.length}
                                </span>
                              )}
                            </Label>
                          </div>

                          {selectedUsers.length === 0 ? (
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              {t('national_insight_center_info.access.no_users_selected')}
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {selectedUsers.map((userId) => {
                                const user = users.find(u => u.id === userId);
                                return user ? (
                                  <div
                                    key={userId}
                                    className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700"
                                  >
                                    <div>
                                      <p className="font-medium text-purple-800 dark:text-purple-200">{user.name}</p>
                                      <p className="text-sm text-purple-600 dark:text-purple-400">{user.email}</p>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleUserRemove(userId)}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ) : null;
                              })}
                            </div>
                          )}
                        </div>

                        {filteredUsers.length === 0 && userSearchTerm && (
                          <div className="text-center py-8">
                            <div className="p-4 bg-purple-100 dark:bg-purple-800/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                              <Search className="h-8 w-8 text-purple-400 dark:text-purple-500" />
                            </div>
                            <p className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-2">{t('national_insight_center_info.access.no_users_found')}</p>
                            <p className="text-purple-600 dark:text-purple-400">{t('national_insight_center_info.access.try_different_search')}</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    {/* Statistics Tab */}
                    <TabsContent value="statistics" className="space-y-6">
                      <div className="bg-gradient-to-l from-purple-50/50 dark:from-purple-900/10 to-white dark:to-gray-800 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
                        <div className="flex items-center gap-2 mb-4">
                          <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200">
                            {t('national_insight_center_info.statistics_title')}
                          </h3>
                        </div>
                        <p className="text-sm text-purple-600 dark:text-purple-400 mb-6">
                          {t('national_insight_center_info.statistics_description')}
                        </p>

                        {/* Category Filter */}
                        <div className="mb-6">
                          <Label htmlFor="category-filter" className="text-base font-medium flex items-center gap-2 text-purple-700 dark:text-purple-300 text-right" dir="rtl">
                            {t('national_insight_center_info_item.stats.filter_by_category')}
                            <Building2 className="h-4 w-4" />
                          </Label>
                          <Select
                            value={selectedCategory?.toString() || 'all'}
                            onValueChange={(value) => setSelectedCategory(value !== 'all' ? parseInt(value) : null)}
                          >
                            <SelectTrigger id="category-filter" className="h-12 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 text-right mt-2">
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

                        {/* Stats Selector */}
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
                      </div>
                    </TabsContent>

                  </Tabs>
                </CardContent>
              </Card>

              {/* Form Actions */}
              <FooterButtons
                onCancel={() => window.history.back()}
                onSubmit={handleSubmit}
                processing={processing}
                cancelText={t('national_insight_center_info.edit.cancel_button')}
                submitText={t('national_insight_center_info.edit.save_button')}
                savingText={t('national_insight_center_info.edit.saving_button')}
              />
            </div>
          </form>
        </CanUpdate>
      </div>
    </AppLayout>
  );
}
