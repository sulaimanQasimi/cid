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
import { X, Plus } from 'lucide-react';

interface Meeting {
  id: number;
  title: string;
  description: string;
  start_date: string | null;
  end_date: string | null;
  scheduled_at: string | null;
  duration_minutes: number | null;
  status: string;
  members: string[];
  is_recurring: boolean;
  offline_enabled: boolean;
}

interface MeetingEditProps {
  auth: {
    user: any;
  };
  meeting: Meeting;
}

export default function Edit({ auth, meeting }: MeetingEditProps) {
  const { t } = useTranslation();
  const [memberName, setMemberName] = useState<string>('');

  const { data, setData, put, processing, errors } = useForm({
    title: meeting.title,
    description: meeting.description || '',
    start_date: meeting.start_date || '',
    end_date: meeting.end_date || '',
    members: meeting.members || [],
  });

  const handleAddMember = () => {
    const trimmedName = memberName.trim();
    if (trimmedName && !data.members.includes(trimmedName)) {
      setData('members', [...data.members, trimmedName]);
      setMemberName('');
    }
  };

  const handleRemoveMember = (index: number) => {
    setData('members', data.members.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddMember();
    }
  };

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
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder={t('meeting.add_member_placeholder') || 'Enter member name...'}
                        value={memberName}
                        onChange={(e) => setMemberName(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={handleAddMember}
                        variant="outline"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {data.members.length > 0 && (
                      <div className="border border-gray-300 dark:border-gray-700 rounded-md p-3 space-y-2">
                        {data.members.map((member, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded"
                          >
                            <span className="text-sm text-gray-900 dark:text-gray-100">{member}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveMember(index)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.members && <div className="text-red-500 text-sm mt-1">{errors.members}</div>}
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
