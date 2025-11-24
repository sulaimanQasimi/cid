import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, FileText, BarChart3, Pencil, X, Database, Settings, Plus, Users, Search, ArrowRight, Trash, User, AlertTriangle } from 'lucide-react';
import Header from '@/components/template/header';
import FooterButtons from '@/components/template/FooterButtons';
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

  const handleCancel = () => {
    router.visit(route('info-types.index'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('info_types.edit.page_title', { name: infoType.name })} />
      
      <div className="container px-0 py-6">
        <Header
          title={t('info_types.edit.page_title', { name: infoType.name })}
          description={t('info_types.edit.page_description')}
          icon={<Pencil className="h-6 w-6 text-white" />}
          model="info_type"
          routeName={() => route('info-types.index')}
          buttonText={t('info_types.edit.back_button')}
          theme="purple"
          buttonSize="lg"
          showBackButton={true}
          backRouteName={() => route('info-types.index')}
          backButtonText={t('info_types.edit.back_button')}
          showButton={false}
          actionButtons={
            <>
              <Button asChild variant="outline" size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105">
                <Link href={route('info-types.index')} className="flex items-center gap-3">
                  {t('info_types.edit.back_button')}
            
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
            </>
          }
        />

        {/* Edit Form Card */}
        <CanUpdate model="info_type">
          <Card className="shadow-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700  overflow-hidden">
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
                <Tabs defaultValue="basic" className="w-full" dir="rtl">
                  <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 dark:bg-gray-700 rounded-xl p-1" dir="rtl">
                    <TabsTrigger 
                      value="basic" 
                      className="flex flex-row-reverse items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-purple-600 dark:data-[state=active]:text-gray-400 data-[state=active]:shadow-lg rounded-lg font-medium transition-all duration-300"
                    >
                      <FileText className="h-4 w-4" />
                      {t('info_types.create.basic_info')}
                    </TabsTrigger>
                    <TabsTrigger 
                      value="access" 
                      className="flex flex-row-reverse items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-purple-600 dark:data-[state=active]:text-gray-400 data-[state=active]:shadow-lg rounded-lg font-medium transition-all duration-300"
                    >
                      <Users className="h-4 w-4" />
                      {t('info_type.access.tab')}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-8">
                    {/* Code Field */}
                    <div className="space-y-4">
                      <Label htmlFor="code" className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {t('info_types.edit.code_label')}
                      </Label>
                      <div className="relative">
                        <Input
                          id="code"
                          value={data.code}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('code', e.target.value)}
                          className="h-12 text-lg border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
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

                    {/* Name Field */}
                    <div className="space-y-4">
                      <Label htmlFor="name" className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {t('info_types.edit.name_label')} *
                      </Label>
                      <div className="relative">
                        <Input
                          id="name"
                          value={data.name}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('name', e.target.value)}
                          required
                          className="h-12 text-lg border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
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

                    {/* Description Field */}
                    <div className="space-y-4">
                      <Label htmlFor="description" className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {t('info_types.edit.description_label')}
                      </Label>
                      <div className="relative">
                        <Textarea
                          id="description"
                          value={data.description}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                          rows={4}
                          className="text-lg border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 bg-white dark:bg-gray-800 rounded-xl shadow-lg resize-none"
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
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                        {t('info_type.access.title')}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {t('info_type.access.description')}
                      </p>
                    </div>

                    {/* User Search */}
                    <div className="space-y-4">
                      <Label className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <Search className="h-4 w-4" />
                        {t('info_type.access.search_users')}
                      </Label>
                      <div className="relative">
                        <Input
                          value={userSearchTerm}
                          onChange={(e) => setUserSearchTerm(e.target.value)}
                          placeholder={t('info_type.access.search_users')}
                          className="h-12 text-lg border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
                        />
                        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    {/* User Search Results */}
                    {userSearchTerm && (
                      <div className="space-y-2">
                        <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200">
                          {t('info_type.access.select_users')}
                        </h4>
                        <div className="max-h-48 overflow-y-auto space-y-2 border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-800">
                          {filteredUsers
                            .filter(user => !selectedUsers.includes(user.id))
                            .map(user => (
                              <div
                                key={user.id}
                                onClick={() => handleUserSelect(user.id)}
                                className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg">
                                    <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                                  </div>
                                </div>
                                <ArrowRight className="h-4 w-4 text-gray-500" />
                              </div>
                            ))}
                          {filteredUsers.filter(user => !selectedUsers.includes(user.id)).length === 0 && (
                            <p className="text-center text-gray-600 dark:text-gray-400 py-4">
                              {t('info_type.access.no_users_found')}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Selected Users */}
                    <div className="space-y-4">
                      <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
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
                                    : 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 border-purple-200 dark:border-purple-700'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-lg ${
                                    userId === infoType.created_by
                                      ? 'bg-gradient-to-br from-green-200 to-green-300 dark:from-green-700 dark:to-green-800'
                                      : 'bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700'
                                  }`}>
                                    <User className={`h-4 w-4 ${
                                      userId === infoType.created_by
                                        ? 'text-green-700 dark:text-green-200'
                                        : 'text-gray-700 dark:text-gray-200'
                                    }`} />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <p className="font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                                      {userId === infoType.created_by && (
                                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 px-2 py-0.5 text-xs font-medium">
                                          {t('info_type.access.creator')}
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
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
                        <div className="text-center py-8 text-gray-600 dark:text-gray-400">
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
              <div className="px-8 py-6 bg-gray-50 dark:bg-gray-800">
                <FooterButtons
                  onCancel={handleCancel}
                  onSubmit={() => {}}
                  processing={processing}
                  cancelText={t('info_types.edit.cancel_button')}
                  submitText={t('info_types.edit.save_button')}
                  savingText={t('info_types.edit.saving_button')}
                />
              </div>
            </form>
          </Card>
        </CanUpdate>

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
