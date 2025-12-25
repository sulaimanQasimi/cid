import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useTranslation } from '@/lib/i18n/translate';
import PersianDatePicker from '@/components/ui/PersianDatePicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Meeting {
  id: number;
  title: string;
  description: string;
  start_date: string | null;
  end_date: string | null;
  scheduled_at: string | null;
  duration_minutes: number | null;
  status: string;
  members: Array<{ id: number; name: string }> | null;
  is_recurring: boolean;
  offline_enabled: boolean;
}

interface MeetingEditProps {
  auth: {
    user: User;
  };
  meeting: Meeting;
  users: User[];
  selectedMemberIds: number[];
}

export default function Edit({ auth, meeting, users, selectedMemberIds: initialSelectedMemberIds }: MeetingEditProps) {
  const { t } = useTranslation();
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>(initialSelectedMemberIds);
  const [userSearchTerm, setUserSearchTerm] = useState<string>('');

  const { data, setData, put, processing, errors } = useForm({
    title: meeting.title,
    description: meeting.description || '',
    start_date: meeting.start_date || '',
    end_date: meeting.end_date || '',
    members: meeting.members?.map(m => ({ id: m.id })) || [],
  });

  useEffect(() => {
    // Update form data when selectedMemberIds changes
    const memberObjects = selectedMemberIds.map(id => ({ id }));
    setData('members', memberObjects);
  }, [selectedMemberIds]);

  const handleMemberToggle = (userId: number) => {
    setSelectedMemberIds(prev => {
      const newIds = prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId];
      return newIds;
    });
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('meetings.update', meeting.id));
  };

  const breadcrumbs = [
    {
      title: t('meeting.page_title') || 'Meetings',
      href: route('meetings.index'),
    },
    {
      title: t('meeting.edit.page_title') || 'Edit Meeting',
      href: '#',
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`${t('meeting.edit.page_title') || 'Edit Meeting'}: ${meeting.title}`} />
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold mb-6">{t('meeting.edit.page_title') || 'Edit Meeting'}</h1>

          <Card>
            <CardHeader>
              <CardTitle>{t('meeting.edit.form_title') || 'Meeting Information'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title" className="block text-sm font-medium mb-1">
                    {t('meeting.title') || 'Title'} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    className="w-full"
                    required
                  />
                  {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
                </div>

                <div>
                  <Label htmlFor="description" className="block text-sm font-medium mb-1">
                    {t('meeting.description') || 'Description'}
                  </Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    className="w-full"
                  />
                  {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <PersianDatePicker
                      label={t('meeting.start_date') || 'Start Date'}
                      value={data.start_date}
                      onChange={(value) => setData('start_date', value)}
                      required
                      error={errors.start_date}
                      id="start_date"
                    />
                  </div>

                  <div>
                    <PersianDatePicker
                      label={t('meeting.end_date') || 'End Date'}
                      value={data.end_date}
                      onChange={(value) => setData('end_date', value)}
                      required
                      error={errors.end_date}
                      id="end_date"
                    />
                  </div>
                </div>

                <div>
                  <Label className="block text-sm font-medium mb-2">
                    {t('meeting.members') || 'Members'}
                  </Label>
                  <div className="space-y-3">
                    <Input
                      type="text"
                      placeholder={t('meeting.search_members') || 'Search members...'}
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      className="w-full"
                    />
                    <div className="max-h-60 overflow-y-auto border border-gray-300 dark:border-gray-700 rounded-md p-3 space-y-2">
                      {filteredUsers.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">
                          {t('meeting.no_users_found') || 'No users found'}
                        </p>
                      ) : (
                        filteredUsers.map((user) => (
                          <div key={user.id} className="flex items-center space-x-2 space-x-reverse">
                            <input
                              type="checkbox"
                              id={`user-${user.id}`}
                              checked={selectedMemberIds.includes(user.id)}
                              onChange={() => handleMemberToggle(user.id)}
                              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <label
                              htmlFor={`user-${user.id}`}
                              className="flex-1 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                            >
                              {user.name} ({user.email})
                            </label>
                          </div>
                        ))
                      )}
                    </div>
                    {errors.members && <div className="text-red-500 text-sm mt-1">{errors.members}</div>}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 space-x-reverse">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.history.back()}
                  >
                    {t('common.cancel') || 'Cancel'}
                  </Button>
                  <Button
                    type="submit"
                    disabled={processing}
                  >
                    {processing ? (t('common.saving') || 'Saving...') : (t('common.save') || 'Save Changes')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
