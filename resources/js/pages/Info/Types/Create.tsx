import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, FileText, BarChart3, Save, X, AlertTriangle, Building2, Users, Search, ArrowRight, Trash, User } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';
import { usePermissions } from '@/hooks/use-permissions';
import { CanCreate } from '@/components/ui/permission-guard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TreeViewStatSelector from '@/components/reports/TreeViewStatSelector';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/template/header';
import FooterButtons from '@/components/template/FooterButtons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

interface User {
  id: number;
  name: string;
  email: string;
}

interface CreateProps {
  statItems: StatCategoryItem[];
  statCategories: StatCategory[];
  users: User[];
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

export default function InfoTypesCreate({ statItems, statCategories, users }: CreateProps) {
  const { t } = useTranslation();
  const { canCreate } = usePermissions();

  const { data, setData, post, processing, errors } = useForm<InfoTypeFormData>({
    name: '',
    code: '',
    description: '',
    access_users: [] as number[],
  });

  // State for managing statistical data
  const [statsData, setStatsData] = useState<{
    [key: number]: { value: string; notes: string | null };
  }>({});

  // Add state for category filter
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Access control state
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState<string>('');

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
          showButton={false}
          actionButtons={
            <>
              <Button asChild variant="outline" size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105">
                <Link href={route('info-types.index')} className="flex items-center gap-3">
                  <ArrowLeft className="h-5 w-5" />
                  {t('info_types.create.back_button')}
                </Link>
              </Button>
            </>
          }
        />

        {/* Create Form Card */}
        <CanCreate model="info_type">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-8">
              <Card className="shadow-2xl bg-gradient-to-bl from-white dark:from-gray-800 to-purple-50/30 dark:to-purple-900/20 border-0 rounded-3xl overflow-hidden">
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

                <CardContent className="p-8">
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8 bg-purple-100 dark:bg-purple-900/30 rounded-xl p-1">
                      <TabsTrigger 
                        value="basic" 
                        className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-lg rounded-lg font-medium transition-all duration-300"
                      >
                        <FileText className="h-4 w-4" />
                        {t('info_types.create.basic_info')}
                      </TabsTrigger>
                      <TabsTrigger 
                        value="access" 
                        className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-lg rounded-lg font-medium transition-all duration-300"
                      >
                        <Users className="h-4 w-4" />
                        {t('info_type.access.tab')}
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-8">
                      {/* Name Field */}
                      <div className="space-y-4">
                        <Label htmlFor="name" className="text-lg font-semibold text-purple-800 dark:text-purple-200 flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          {t('info_types.create.name_label')} *
                        </Label>
                        <div className="relative">
                          <Input
                            id="name"
                            value={data.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('name', e.target.value)}
                            required
                            className="h-12 text-lg border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 rounded-xl shadow-lg"
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
                        <Label htmlFor="code" className="text-lg font-semibold text-purple-800 dark:text-purple-200 flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          {t('info_types.create.code_label')}
                        </Label>
                        <div className="relative">
                          <Input
                            id="code"
                            value={data.code}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('code', e.target.value)}
                            className="h-12 text-lg border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 rounded-xl shadow-lg"
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
                        <Label htmlFor="description" className="text-lg font-semibold text-purple-800 dark:text-purple-200 flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          {t('info_types.create.description_label')}
                        </Label>
                        <div className="relative">
                          <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                            rows={4}
                            className="text-lg border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 rounded-xl shadow-lg resize-none"
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
                    </TabsContent>

                    <TabsContent value="access" className="space-y-6">
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-2">
                          {t('info_type.access.title')}
                        </h3>
                        <p className="text-purple-600 dark:text-purple-300">
                          {t('info_type.access.description')}
                        </p>
                      </div>

                      {/* User Search */}
                      <div className="space-y-4">
                        <Label className="text-lg font-semibold text-purple-800 dark:text-purple-200 flex items-center gap-2">
                          <Search className="h-4 w-4" />
                          {t('info_type.access.search_users')}
                        </Label>
                        <div className="relative">
                          <Input
                            value={userSearchTerm}
                            onChange={(e) => setUserSearchTerm(e.target.value)}
                            placeholder={t('info_type.access.search_users')}
                            className="h-12 text-lg border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 rounded-xl shadow-lg"
                          />
                          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                        </div>
                      </div>

                      {/* User Search Results */}
                      {userSearchTerm && (
                        <div className="space-y-2">
                          <h4 className="text-md font-semibold text-purple-800 dark:text-purple-200">
                            {t('info_type.access.select_users')}
                          </h4>
                          <div className="max-h-48 overflow-y-auto space-y-2 border border-purple-200 dark:border-purple-700 rounded-xl p-4 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800">
                            {filteredUsers
                              .filter(user => !selectedUsers.includes(user.id))
                              .map(user => (
                                <div
                                  key={user.id}
                                  onClick={() => handleUserSelect(user.id)}
                                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-purple-100 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/30 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-900 rounded-lg">
                                      <User className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                                    </div>
                                    <div>
                                      <p className="font-medium text-purple-900 dark:text-purple-100">{user.name}</p>
                                      <p className="text-sm text-purple-600 dark:text-purple-400">{user.email}</p>
                                    </div>
                                  </div>
                                  <ArrowRight className="h-4 w-4 text-purple-500" />
                                </div>
                              ))}
                            {filteredUsers.filter(user => !selectedUsers.includes(user.id)).length === 0 && (
                              <p className="text-center text-purple-600 dark:text-purple-400 py-4">
                                {t('info_type.access.no_users_found')}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Selected Users */}
                      <div className="space-y-4">
                        <h4 className="text-md font-semibold text-purple-800 dark:text-purple-200 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {t('info_type.access.selected_users')}
                        </h4>
                        {selectedUsers.length > 0 ? (
                          <div className="space-y-2">
                            {selectedUsers.map(userId => {
                              const user = users.find(u => u.id === userId);
                              return user ? (
                                <div
                                  key={userId}
                                  className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-900 rounded-lg border border-purple-200 dark:border-purple-700"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-purple-200 to-purple-300 dark:from-purple-700 dark:to-purple-800 rounded-lg">
                                      <User className="h-4 w-4 text-purple-700 dark:text-purple-200" />
                                    </div>
                                    <div>
                                      <p className="font-medium text-purple-900 dark:text-purple-100">{user.name}</p>
                                      <p className="text-sm text-purple-600 dark:text-purple-400">{user.email}</p>
                                    </div>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUserRemove(userId)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 border-red-200 dark:border-red-700"
                                  >
                                    <Trash className="h-3 w-3" />
                                  </Button>
                                </div>
                              ) : null;
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-purple-600 dark:text-purple-400">
                            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>{t('info_type.access.no_users_selected')}</p>
                          </div>
                        )}
                      </div>

                      {/* Notes */}
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                          <div className="text-right">
                            <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">
                              {t('info_type.access.creator_note')}
                            </p>
                            <p className="text-xs text-blue-600 dark:text-blue-300">
                              {t('info_type.access.permissions_note')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <Card className="shadow-2xl bg-gradient-to-bl from-white dark:from-gray-800 to-purple-50/30 dark:to-purple-900/20 border-0 rounded-3xl overflow-hidden">
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
                    <Label htmlFor="category-filter" className="text-base font-medium flex items-center gap-2 text-purple-700 dark:text-purple-300 text-right" dir="rtl">
                      {t('info_types.stats.filter_by_category')}
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
                      <p className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-2">{t('info_types.stats.no_items')}</p>
                      <p className="text-purple-600 dark:text-purple-400">{t('info_types.stats.no_items_description')}</p>
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
