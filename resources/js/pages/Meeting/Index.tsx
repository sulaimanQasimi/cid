import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useTranslation } from '@/lib/i18n/translate';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Calendar, Users, Edit, Trash2, Eye, CalendarDays, AlertTriangle } from 'lucide-react';
import PersianDateDisplay from '@/components/ui/PersianDateDisplay';
import { Pagination } from '@/components/pagination';
import Header from '@/components/template/header';
import SearchFilters from '@/components/template/SearchFilters';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { type BreadcrumbItem } from '@/types';

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
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    meta?: {
      current_page: number;
      from: number;
      last_page: number;
      per_page: number;
      to: number;
      total: number;
    };
  };
  filters: {
    search: string;
    per_page: number;
  };
}

const sortOptions = [
  { value: 'created_at', label: 'meeting.sort.created_at' },
  { value: 'title', label: 'meeting.sort.title' },
  { value: 'start_date', label: 'meeting.sort.start_date' },
  { value: 'status', label: 'meeting.sort.status' },
];

const perPageOptions = [
  { value: 10, label: '10' },
  { value: 25, label: '25' },
  { value: 50, label: '50' },
  { value: 100, label: '100' },
];

export default function Index({ auth, meetings, filters }: MeetingIndexProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState<Meeting | null>(null);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('meeting.page_title') || 'Meetings',
      href: route('meetings.index'),
    },
  ];

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters({ search: searchQuery });
  };

  // Handle per page change
  const handlePerPageChange = (value: string) => {
    applyFilters({ per_page: parseInt(value) });
  };


  // Apply filters to the URL
  const applyFilters = (newFilters: Partial<MeetingIndexProps['filters']>) => {
    router.get(
      route('meetings.index'),
      { ...filters, ...newFilters, page: 1 },
      { preserveState: true, preserveScroll: true, replace: true },
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    router.get(route('meetings.index'), {
      search: '',
      per_page: 10,
      page: 1,
    });
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (meeting: Meeting) => {
    setMeetingToDelete(meeting);
    setIsDeleteDialogOpen(true);
  };

  // Confirm and execute delete
  const confirmDelete = () => {
    if (meetingToDelete) {
      router.delete(route('meetings.destroy', meetingToDelete.id), {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setMeetingToDelete(null);
        },
      });
    }
  };

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('meeting.page_title') || 'Meetings'} />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('meeting.delete_dialog.title') || 'Delete Meeting'}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('meeting.delete_dialog.description', { title: meetingToDelete?.title || '' }) || 
                `Are you sure you want to delete "${meetingToDelete?.title}"? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              {t('meeting.delete_dialog.cancel') || 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              {t('meeting.delete_dialog.confirm') || 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="container px-0 py-6">
        {/* Modern Header */}
        <Header
          title={t('meeting.page_title') || 'Meetings'}
          description={t('meeting.page_description') || 'Manage and organize your meetings'}
          icon={<CalendarDays className="h-6 w-6 text-white" />}
          model="meeting"
          routeName="meetings.create"
          theme="indigo"
          buttonText={t('meeting.create.button') || 'Create Meeting'}
          buttonSize="lg"
        />

        {/* Search Filters */}
        <SearchFilters
          title={t('meeting.search_filters') || 'Search & Filter Meetings'}
          description={t('meeting.search_description') || 'Find and filter meetings by title, description, or meeting code'}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={handleSearch}
          searchPlaceholder={t('meeting.search_placeholder') || 'Search meetings...'}
          filters={{
            sort: 'created_at',
            direction: 'desc' as 'asc' | 'desc',
            per_page: filters.per_page || 10,
          }}
          onTypeChange={() => {}}
          onCategoryChange={() => {}}
          onDepartmentChange={() => {}}
          onSortChange={() => {}}
          onDirectionChange={() => {}}
          onPerPageChange={handlePerPageChange}
          onResetFilters={resetFilters}
          types={[]}
          categories={[]}
          departments={[]}
          sortOptions={sortOptions}
          perPageOptions={perPageOptions}
        />

        {/* Meetings Table */}
        <div className="mt-8">
          <Card className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-700">
                    <TableHead className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">
                      {t('common.table.id') || 'ID'}
                    </TableHead>
                    <TableHead className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">
                      {t('meeting.table.title') || 'Title'}
                    </TableHead>
                    <TableHead className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">
                      {t('meeting.table.meeting_code') || 'Meeting Code'}
                    </TableHead>
                    <TableHead className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">
                      {t('meeting.table.status') || 'Status'}
                    </TableHead>
                    <TableHead className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">
                      {t('meeting.table.date_range') || 'Date Range'}
                    </TableHead>
                    <TableHead className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">
                      {t('meeting.table.members') || 'Members'}
                    </TableHead>
                    <TableHead className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">
                      {t('meeting.table.creator') || 'Creator'}
                    </TableHead>
                    <TableHead className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-gray-100">
                      {t('common.table.actions') || 'Actions'}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {meetings.data.length > 0 ? (
                    meetings.data.map((meeting) => (
                      <TableRow
                        key={meeting.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-600"
                      >
                        <TableCell className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                          {meeting.id}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {meeting.title}
                            </span>
                            {meeting.description && (
                              <span className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">
                                {meeting.description}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                            {meeting.meeting_code}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <Badge variant={getStatusVariant(meeting.status)} className="text-xs">
                            {t(`meeting.status.${meeting.status}`) || meeting.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-gray-500 dark:text-gray-400">
                          {meeting.start_date && meeting.end_date ? (
                            <div className="flex items-center gap-1.5 text-sm">
                              <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                              <span>
                                <PersianDateDisplay date={meeting.start_date} /> - <PersianDateDisplay date={meeting.end_date} />
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          {meeting.member_count > 0 ? (
                            <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                              <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                              <span>
                                {meeting.member_count} {t('meeting.members') || 'members'}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-gray-500 dark:text-gray-400">
                          {meeting.creator ? (
                            <span className="text-sm">{meeting.creator.name}</span>
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            {meeting.can_view && (
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                title={t('common.view') || 'View'}
                                className="h-8 w-8"
                              >
                                <Link href={route('meetings.show', meeting.id)}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                            )}
                            {meeting.can_update && (
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                title={t('common.edit') || 'Edit'}
                                className="h-8 w-8"
                              >
                                <Link href={route('meetings.edit', meeting.id)}>
                                  <Edit className="h-4 w-4" />
                                </Link>
                              </Button>
                            )}
                            {meeting.can_delete && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openDeleteDialog(meeting)}
                                title={t('common.delete') || 'Delete'}
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-32 text-center">
                        <div className="flex flex-col items-center gap-4 text-gray-500 dark:text-gray-400">
                          <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-4">
                            <AlertTriangle className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                          </div>
                          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {t('meeting.no_meetings') || 'No meetings found'}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t('meeting.no_meetings_description') || 'Get started by creating your first meeting'}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Pagination */}
        {meetings.links && meetings.links.length > 0 && (
          <div className="mt-6 flex justify-center">
            <Pagination links={meetings.links} />
          </div>
        )}
      </div>
    </AppLayout>
  );
}
