import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, FileText, Save, X, Users, Search, ArrowRight, Trash, User, Shield, BarChart3 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translate';
import { usePermissions } from '@/hooks/use-permissions';
import { CanCreate } from '@/components/ui/permission-guard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/template/header';
import FooterButtons from '@/components/template/FooterButtons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PersianDatePicker from '@/components/ui/PersianDatePicker';
import moment from 'moment-jalaali';


interface User {
  id: number;
  name: string;
  email: string;
}

interface CreateProps {
  users: User[];
}

type NationalInsightCenterInfoFormData = {
  name: string;
  code?: string;
  description?: string;
  date?: string;
  access_users?: number[];
};

export default function NationalInsightCenterInfosCreate({ users }: CreateProps) {
  const { t } = useTranslation();
  const { canCreate } = usePermissions();

  const { data, setData, post, processing, errors } = useForm<NationalInsightCenterInfoFormData>({
    name: '',
    code: '',
    description: '',
    date: moment().format('jYYYY/jMM/jDD'), // Default to today's date
    access_users: [] as number[],
  });



  // Access control state
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState<string>('');

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
      title: t('national_insight_center_info.create.page_title'),
      href: '#',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Submit the form
    post(route('national-insight-center-infos.store'));
  };


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
      <Head title={t('national_insight_center_info.create.page_title')} />

      <div className="container px-0 py-6" dir="rtl">
        <Header
          title={t('national_insight_center_info.create.page_title')}
          description={t('national_insight_center_info.create.page_description')}
          icon={<FileText className="h-6 w-6 text-white" />}
          model="national_insight_center_info"
          routeName="national-insight-center-infos.create"
          buttonText={t('national_insight_center_info.create.save_button')}
          theme="purple"
          buttonSize="lg"
          showBackButton={true}
          backRouteName="national-insight-center-infos.index"
          backButtonText={t('national_insight_center_info.create.back_button')}
          showButton={false}
          actionButtons={
            <>
              <Button asChild variant="outline" size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105">
                <Link href={route('national-insight-center-infos.index')} className="flex items-center gap-3">
                  <ArrowRight className="h-5 w-5" />
                  {t('national_insight_center_info.create.back_button')}
                </Link>
              </Button>
            </>
          }
        />

        {/* Create Form Card */}
        <CanCreate model="national_insight_center_info">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-8">
              <Card className="shadow-2xl bg-gradient-to-bl from-white dark:from-gray-800 to-purple-50/30 dark:to-purple-900/20 border-0 overflow-hidden">
                <CardContent className="p-8">
                  <Tabs defaultValue="basic" className="w-full" dir="rtl">
                    <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <TabsTrigger value="basic" className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white dark:data-[state=active]:bg-purple-700 dark:data-[state=active]:text-white hover:bg-purple-100 dark:hover:bg-gray-700 transition-colors">
                        <FileText className="h-4 w-4" />
                        {t('national_insight_center_info.basic_info')}
                      </TabsTrigger>
                      <TabsTrigger value="access" className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white dark:data-[state=active]:bg-purple-700 dark:data-[state=active]:text-white hover:bg-purple-100 dark:hover:bg-gray-700 transition-colors">
                        <Shield className="h-4 w-4" />
                        {t('national_insight_center_info.access_control')}
                      </TabsTrigger>
                    </TabsList>

                    {/* Basic Information Tab */}
                    <TabsContent value="basic" className="space-y-8">
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
                          <BarChart3 className="h-4 w-4" />
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

                  </Tabs>
                </CardContent>
              </Card>

              {/* Form Actions */}
              <FooterButtons
                onCancel={() => window.history.back()}
                onSubmit={() => { }}
                processing={processing}
                cancelText={t('national_insight_center_info.create.cancel_button')}
                submitText={t('national_insight_center_info.create.save_button')}
                savingText={t('national_insight_center_info.create.saving_button')}
              />
            </div>
          </form>
        </CanCreate>
      </div>
    </AppLayout>
  );
}
0