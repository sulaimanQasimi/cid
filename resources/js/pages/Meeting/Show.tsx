import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useTranslation } from '@/lib/i18n/translate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Edit, Trash2, ArrowLeft } from 'lucide-react';
import PersianDateDisplay from '@/components/ui/PersianDateDisplay';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Meeting {
  id: number;
  title: string;
  description: string;
  meeting_code: string;
  start_date: string | null;
  end_date: string | null;
  scheduled_at: string | null;
  duration_minutes: number | null;
  status: string;
  members: Array<{ id: number; name: string }> | null;
  is_recurring: boolean;
  offline_enabled: boolean;
  created_by: number;
  created_at: string;
  creator: User | null;
}

interface MeetingShowProps {
  auth: {
    user: User;
  };
  meeting: Meeting;
}

export default function Show({ auth, meeting }: MeetingShowProps) {
  const { t } = useTranslation();

  const breadcrumbs = [
    {
      title: t('meeting.page_title') || 'Meetings',
      href: route('meetings.index'),
    },
    {
      title: meeting.title,
      href: '#',
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`${t('meeting.show.page_title') || 'Meeting'}: ${meeting.title}`} />
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link href={route('meetings.index')}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" />
                {t('common.back') || 'Back'}
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">{meeting.title}</CardTitle>
                  {meeting.creator && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('meeting.created_by') || 'Created by'}: {meeting.creator.name}
                    </p>
                  )}
                </div>
                <Badge variant={meeting.status === 'scheduled' ? 'default' : 'secondary'}>
                  {meeting.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {meeting.description && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    {t('meeting.description') || 'Description'}
                  </h3>
                  <p className="text-gray-900 dark:text-gray-100">
                    {meeting.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {meeting.start_date && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      {t('meeting.start_date') || 'Start Date'}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <PersianDateDisplay date={meeting.start_date} />
                    </div>
                  </div>
                )}

                {meeting.end_date && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      {t('meeting.end_date') || 'End Date'}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <PersianDateDisplay date={meeting.end_date} />
                    </div>
                  </div>
                )}

                {meeting.scheduled_at && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      {t('meeting.scheduled_at') || 'Scheduled At'}
                    </h3>
                    <p className="text-gray-900 dark:text-gray-100">
                      {new Date(meeting.scheduled_at).toLocaleString()}
                    </p>
                  </div>
                )}

                {meeting.duration_minutes && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      {t('meeting.duration') || 'Duration'}
                    </h3>
                    <p className="text-gray-900 dark:text-gray-100">
                      {meeting.duration_minutes} {t('meeting.minutes') || 'minutes'}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    {t('meeting.meeting_code') || 'Meeting Code'}
                  </h3>
                  <p className="text-gray-900 dark:text-gray-100 font-mono">
                    {meeting.meeting_code}
                  </p>
                </div>
              </div>

              {meeting.members && meeting.members.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {t('meeting.members') || 'Members'} ({meeting.members.length})
                  </h3>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-md divide-y divide-gray-200 dark:divide-gray-700">
                    {meeting.members.map((member, index) => (
                      <div
                        key={member.id || index}
                        className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <span className="text-sm text-gray-900 dark:text-gray-100">
                          {member.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link href={route('meetings.index')}>
                  <Button variant="outline">
                    {t('common.back') || 'Back'}
                  </Button>
                </Link>
                <Link href={route('meetings.edit', meeting.id)}>
                  <Button>
                    <Edit className="h-4 w-4 mr-1" />
                    {t('common.edit') || 'Edit'}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
