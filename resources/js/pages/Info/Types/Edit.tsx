import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, FileText, BarChart3, Pencil, X, Database, Settings, Plus, Users, Search, ArrowRight, Trash, User, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/lib/i18n/translate';
import { usePermissions } from '@/hooks/use-permissions';
import { CanUpdate } from '@/components/ui/permission-guard';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface User {
  id: number;
  name: string;
  email: string;
}

interface InfoTypeAccess {
  id: number;
  user_id: number;
  user: User;
}

interface InfoType {
  id: number;
  name: string;
  code: string | null;
  description: string | null;
  created_by: number;
  created_at: string;
  updated_at: string;
  accesses?: InfoTypeAccess[];
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
  users: User[];
}

export default function EditInfoType({ infoType, users }: Props) {
  const { t } = useTranslation();
  const { canUpdate } = usePermissions();
  
  // Access control state
  const [selectedUsers, setSelectedUsers] = useState<number[]>(
    infoType.accesses?.map(access => access.user_id) || []
  );
  const [userSearchTerm, setUserSearchTerm] = useState<string>('');
  const [isRemoveUserDialogOpen, setIsRemoveUserDialogOpen] = useState<boolean>(false);
  const [userToRemove, setUserToRemove] = useState<{ id: number; name: string } | null>(null);
  const [deletedUsers, setDeletedUsers] = useState<number[]>([]);

  const { data, setData, post, processing, errors } = useForm({
    _method: 'PUT',
    name: infoType.name,
    code: infoType.code || '',
    description: infoType.description || '',
    access_users: infoType.accesses?.map(access => access.user_id) || [],
    deleted_users: [] as number[],
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

  // Access control functions
  const handleUserSelect = (userId: number) => {
    if (!selectedUsers.includes(userId)) {
      setSelectedUsers(prev => [...prev, userId]);
    }
  };

  const handleUserRemoveClick = (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setUserToRemove({ id: userId, name: user.name });
      setIsRemoveUserDialogOpen(true);
    }
  };

  const confirmUserRemove = () => {
    if (userToRemove) {
      const newSelectedUsers = selectedUsers.filter(id => id !== userToRemove.id);
      setSelectedUsers(newSelectedUsers);
      
      // Add user to deletedUsers array
      setDeletedUsers(prev => [...prev, userToRemove.id]);
      
      setIsRemoveUserDialogOpen(false);
      setUserToRemove(null);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create the complete form data object with proper data types
    const completeFormData = {
      ...data,
      access_users: selectedUsers.map(id => parseInt(id.toString())),
      deleted_users: deletedUsers.map(id => parseInt(id.toString())),
    };
    
    // Use router.post directly with the complete data
    router.post(route('info-types.update', infoType.id), completeFormData, {
      onSuccess: () => {
        // Redirect happens automatically from the controller
      }
    });
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
                        {t('info_types.edit.name_label')} *
                      </Label>
                      <div className="relative">
                        <Input
                          id="name"
                          value={data.name}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('name', e.target.value)}
                          required
                          className="h-12 text-lg border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 rounded-xl shadow-lg"
                          placeholder={t('info_types.edit.name_placeholder')}
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
                        <FileText className="h-4 w-4" />
                        {t('info_types.edit.code_label')}
                      </Label>
                      <div className="relative">
                        <Input
                          id="code"
                          value={data.code}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('code', e.target.value)}
                          className="h-12 text-lg border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 rounded-xl shadow-lg"
                          placeholder={t('info_types.edit.code_placeholder')}
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
                        {t('info_types.edit.description_label')}
                      </Label>
                      <div className="relative">
                        <Textarea
                          id="description"
                          value={data.description}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                          rows={4}
                          className="text-lg border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 dark:from-purple-900/30 to-white dark:to-gray-800 rounded-xl shadow-lg resize-none"
                          placeholder={t('info_types.edit.description_placeholder')}
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
                                className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                                  userId === infoType.created_by
                                    ? 'bg-gradient-to-r from-green-100 to-green-200 dark:from-green-800 dark:to-green-900 border-green-200 dark:border-green-700'
                                    : 'bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-900 border-purple-200 dark:border-purple-700'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-lg ${
                                    userId === infoType.created_by
                                      ? 'bg-gradient-to-br from-green-200 to-green-300 dark:from-green-700 dark:to-green-800'
                                      : 'bg-gradient-to-br from-purple-200 to-purple-300 dark:from-purple-700 dark:to-purple-800'
                                  }`}>
                                    <User className={`h-4 w-4 ${
                                      userId === infoType.created_by
                                        ? 'text-green-700 dark:text-green-200'
                                        : 'text-purple-700 dark:text-purple-200'
                                    }`} />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <p className="font-medium text-purple-900 dark:text-purple-100">{user.name}</p>
                                      {userId === infoType.created_by && (
                                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 px-2 py-0.5 text-xs font-medium">
                                          {t('info_type.access.creator')}
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-purple-600 dark:text-purple-400">{user.email}</p>
                                  </div>
                                </div>
                                {userId !== infoType.created_by && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUserRemoveClick(userId)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 border-red-200 dark:border-red-700"
                                  >
                                    <Trash className="h-3 w-3" />
                                  </Button>
                                )}
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

      {/* Remove User Confirmation Dialog */}
      <Dialog open={isRemoveUserDialogOpen} onOpenChange={setIsRemoveUserDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">{t('info_type.access.remove_user_confirm_title')}</DialogTitle>
            <DialogDescription className="mt-2">
              {t('info_type.access.remove_user_confirm_message', { name: userToRemove?.name || '' })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setIsRemoveUserDialogOpen(false)}
              className="shadow-sm"
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={confirmUserRemove}
              className="bg-red-600 hover:bg-red-700 text-white shadow-sm"
            >
              {t('info_type.access.remove_user_confirm_button')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
