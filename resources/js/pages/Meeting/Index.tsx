import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useTranslation } from '@/lib/i18n/translate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Edit, Trash2, Eye } from 'lucide-react';
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
  status: string;
  start_date: string | null;
  end_date: string | null;
  scheduled_at: string | null;
  members: string[];
  member_count: number;
  created_by: number;
  created_at: string;
  creator: User | null;
  can_view: boolean;
  can_update: boolean;
  can_delete: boolean;
}

interface MeetingIndexProps {
  auth: {
    user: User;
  };
  meetings: {
    data: Meeting[];
    links: any;
    meta: any;
  };
  filters: {
    search: string;
    per_page: number;
  };
}

export default function Index({ auth, meetings, filters }: MeetingIndexProps) {
  const { t } = useTranslation();

  const breadcrumbs = [
    {
      title: t('meeting.page_title') || 'Meetings',
      href: route('meetings.index'),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('meeting.page_title') || 'Meetings'} />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{t('meeting.page_title') || 'Meetings'}</h1>
            <Link href={route('meetings.create')}>
              <Button>
                {t('meeting.create.button') || 'Create Meeting'}
              </Button>
            </Link>
          </div>

          {meetings.data.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">{t('meeting.no_meetings') || 'No meetings found.'}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {meetings.data.map((meeting) => (
                <Card key={meeting.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{meeting.title}</CardTitle>
                        {meeting.description && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                            {meeting.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                          {meeting.start_date && meeting.end_date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>
                                <PersianDateDisplay date={meeting.start_date} /> - <PersianDateDisplay date={meeting.end_date} />
                              </span>
                            </div>
                          )}
                          {meeting.member_count > 0 && (
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>
                                {meeting.member_count} {t('meeting.members') || 'members'}
                              </span>
                            </div>
                          )}
                          {meeting.creator && (
                            <span>
                              {t('meeting.created_by') || 'Created by'}: {meeting.creator.name}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={meeting.status === 'scheduled' ? 'default' : 'secondary'}>
                          {meeting.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-end gap-2">
                      {meeting.can_view && (
                        <Link href={route('meetings.show', meeting.id)}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            {t('common.view') || 'View'}
                          </Button>
                        </Link>
                      )}
                      {meeting.can_update && (
                        <Link href={route('meetings.edit', meeting.id)}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            {t('common.edit') || 'Edit'}
                          </Button>
                        </Link>
                      )}
                      {meeting.can_delete && (
                        <Link
                          href={route('meetings.destroy', meeting.id)}
                          method="delete"
                          as="button"
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          {t('common.delete') || 'Delete'}
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
