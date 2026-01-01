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
import { Calendar, Users, Edit, Trash2, Eye, CalendarDays, AlertTriangle, Printer, ArrowLeft } from 'lucide-react';
import PersianDateDisplay from '@/components/ui/PersianDateDisplay';
import PersianDatePicker from '@/components/ui/PersianDatePicker';
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
    links?: Array<{
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
  } | Meeting[];
  filters: {
    search: string;
    per_page: number;
    start_date?: string | null;
    end_date?: string | null;
  };
  printMode?: boolean;
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

export default function Index({ auth, meetings, filters, printMode = false }: MeetingIndexProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState<Meeting | null>(null);
  const [startDate, setStartDate] = useState(filters.start_date || '');
  const [endDate, setEndDate] = useState(filters.end_date || '');

  // Normalize meetings data - handle both paginated and array formats
  const meetingsData = Array.isArray(meetings) ? meetings : meetings.data;
  const meetingsLinks = Array.isArray(meetings) ? undefined : meetings.links;

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

  // Handle print
  const handlePrint = () => {
    if (!startDate || !endDate) {
      alert(t('meeting.print.date_required') || 'Please select start and end dates');
      return;
    }
    router.get(route('meetings.print'), {
      start_date: startDate,
      end_date: endDate,
      print: true,
    });
  };

  // Handle print view
  const handlePrintView = () => {
    window.print();
  };

  // Handle back from print view
  const handleBackFromPrint = () => {
    router.get(route('meetings.index'), {}, { preserveState: false });
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

      {/* Print View */}
      {printMode ? (
        <div className="print:m-0 print:max-w-none print:p-0" style={{ fontFamily: 'Amiri, serif', direction: 'rtl' }}>
          <style
            dangerouslySetInnerHTML={{
              __html: `
              @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
              
              @media print {
                  @page {
                      size: A4 portrait;
                      margin: 2cm 2.5cm;
                  }
                  body {
                      font-size: 12px;
                      line-height: 1.8;
                      font-family: 'Amiri', serif !important;
                      direction: rtl;
                  }
                  * {
                      font-family: 'Amiri', serif !important;
                  }
                  .print\\:hidden {
                      display: none !important;
                  }
                  .print\\:border-gray-800 {
                      border-color: #1f2937 !important;
                  }
                  .print\\:page-break-inside-avoid {
                      page-break-inside: avoid;
                  }
              }
          `,
            }}
          />

          {/* Print Controls */}
          <div className="mb-6 print:hidden">
            <div className="flex items-center justify-between">
              <Button onClick={handleBackFromPrint} variant="outline" size="lg" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                {t('common.back') || 'Back'}
              </Button>
              <Button onClick={handlePrintView} size="lg" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700">
                <Printer className="h-4 w-4" />
                {t('common.print') || 'Print'}
              </Button>
            </div>
          </div>

          {/* Print Content for each meeting */}
          {meetingsData.map((meeting, index) => (
            <div key={meeting.id} className="print:page-break-inside-avoid relative mx-auto max-w-4xl px-4 mb-8">
              {/* Header Section */}
              <div className="mb-8 border-b-2 border-gray-300 print:border-gray-800 pb-6">
                <div className="relative mb-6 flex items-start justify-between">
                  {/* Left Logo/Seal */}
                  <div className="flex-shrink-0">
                    <div className="h-24 w-24 rounded-full border-4 border-gray-800 print:border-gray-800 flex items-center justify-center bg-white">
                      <div className="text-center text-xs font-bold">
                        <div className="mb-1">د افغانستان</div>
                        <div>اسلامی امارت</div>
                      </div>
                    </div>
                  </div>

                  {/* Center Title */}
                  <div className="flex-1 text-center">
                    <h1 className="mb-2 text-2xl font-bold text-gray-900 print:text-xl">
                      {t('meeting.print.government_name') || 'د افغانستان اسلامی امارت'}
                    </h1>
                    <h2 className="mb-1 text-xl font-semibold text-gray-800 print:text-lg">
                      {t('meeting.print.ministry_name') || 'د ملي دفاع وزارت'}
                    </h2>
                    <h3 className="mb-1 text-lg font-medium text-gray-700 print:text-base">
                      {t('meeting.print.directorate_name') || 'د استخباراتو معینیت'}
                    </h3>
                    <h4 className="text-base font-medium text-gray-600 print:text-sm">
                      {t('meeting.print.office_management') || 'د دفتر مدیریت'}
                    </h4>
                  </div>

                  {/* Right Meeting Number */}
                  <div className="flex-shrink-0 text-left">
                    <div className="text-lg font-bold text-gray-900 print:text-base">
                      {t('meeting.print.meeting_number') || 'مجلس گڼه'}: {meeting.id}
                    </div>
                    {meeting.created_at && (
                      <div className="mt-2 text-sm text-gray-700 print:text-xs">
                        {t('meeting.print.date') || 'نېټه'}: <PersianDateDisplay date={meeting.created_at} /> {t('meeting.print.hijri') || 'هـ ق'}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="mb-8">
                {/* Topic Title */}
                <div className="mb-6">
                  <h2 className="mb-4 text-xl font-bold text-gray-900 print:text-lg border-b border-gray-300 print:border-gray-800 pb-2">
                    {t('meeting.print.topic') || 'ومری موضوع'}
                  </h2>
                  <p className="text-lg font-semibold text-gray-800 print:text-base mb-4 leading-relaxed">
                    {meeting.title}
                  </p>
                </div>

                {/* Description */}
                {meeting.description && (
                  <div className="mb-6">
                    <p className="text-base text-gray-700 print:text-sm leading-relaxed whitespace-pre-wrap">
                      {meeting.description}
                    </p>
                  </div>
                )}

                {/* Meeting Details */}
                <div className="mb-6 space-y-4">
                  {meeting.start_date && meeting.end_date && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800 print:text-sm">
                        {t('meeting.print.date_range') || 'د نیټو سلسله'}:
                      </span>
                      <span className="text-gray-700 print:text-sm">
                        <PersianDateDisplay date={meeting.start_date} /> - <PersianDateDisplay date={meeting.end_date} />
                      </span>
                    </div>
                  )}

                  {meeting.meeting_code && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800 print:text-sm">
                        {t('meeting.print.meeting_code') || 'د مجلس کوډ'}:
                      </span>
                      <span className="font-mono text-gray-700 print:text-sm">{meeting.meeting_code}</span>
                    </div>
                  )}

                  {meeting.status && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800 print:text-sm">
                        {t('meeting.print.status') || 'حالت'}:
                      </span>
                      <span className="text-gray-700 print:text-sm">
                        {t(`meeting.status.${meeting.status}`) || meeting.status}
                      </span>
                    </div>
                  )}

                  {meeting.creator && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800 print:text-sm">
                        {t('meeting.print.created_by') || 'جوړونکی'}:
                      </span>
                      <span className="text-gray-700 print:text-sm">{meeting.creator.name}</span>
                    </div>
                  )}
                </div>

                {/* Members Section */}
                {meeting.members && meeting.members.length > 0 && (
                  <div className="mb-6">
                    <h3 className="mb-3 text-lg font-bold text-gray-900 print:text-base border-b border-gray-300 print:border-gray-800 pb-2">
                      {t('meeting.print.members') || 'د مجلس غړي'}
                    </h3>
                    <div className="space-y-2">
                      {meeting.members.map((member, memberIndex) => (
                        <div key={memberIndex} className="flex items-start gap-2 text-base text-gray-700 print:text-sm">
                          <span className="font-semibold">{memberIndex + 1}.</span>
                          <span>{member}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resolution Section */}
                <div className="mt-8">
                  <h3 className="mb-4 text-lg font-bold text-gray-900 print:text-base border-b border-gray-300 print:border-gray-800 pb-2">
                    {t('meeting.print.resolution') || 'د مجلس پرېکړه'}
                  </h3>
                  <div className="space-y-3 text-base text-gray-700 print:text-sm leading-relaxed">
                    <p>
                      {t('meeting.print.resolution_text') || 'د یادو موضوعاتو په اړه د مجلس پرېکړه د پورتنیو شرایطو سره سم ترسره کړئ.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-12 border-t-2 border-gray-300 print:border-gray-800 pt-6">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600 print:text-xs">
                    {t('meeting.print.duration') || 'د ترسره کیدو موده'}: <span className="font-semibold">{t('meeting.print.urgent') || 'عاجل'}</span>
                  </div>
                  <div className="text-sm text-gray-600 print:text-xs">
                    {t('meeting.print.printed_at') || 'چاپ شوی'}: <PersianDateDisplay date={new Date().toISOString().split('T')[0]} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
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

        {/* Print Section */}
        <Card className="mt-6 mb-6">
          <CardContent className="p-6">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <PersianDatePicker
                  id="start_date"
                  value={startDate}
                  onChange={(value) => setStartDate(value)}
                  label={t('meeting.print.start_date') || 'Start Date'}
                  placeholder={t('meeting.print.start_date_placeholder') || 'YYYY/MM/DD'}
                  className="w-full"
                />
              </div>
              <div className="flex-1">
                <PersianDatePicker
                  id="end_date"
                  value={endDate}
                  onChange={(value) => setEndDate(value)}
                  label={t('meeting.print.end_date') || 'End Date'}
                  placeholder={t('meeting.print.end_date_placeholder') || 'YYYY/MM/DD'}
                  className="w-full"
                />
              </div>
              <Button
                onClick={handlePrint}
                size="lg"
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
              >
                <Printer className="h-4 w-4" />
                {t('meeting.print.button') || 'Print Meetings'}
              </Button>
            </div>
          </CardContent>
        </Card>

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
                  {meetingsData.length > 0 ? (
                    meetingsData.map((meeting) => (
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
        {meetingsLinks && meetingsLinks.length > 0 && (
          <div className="mt-6 flex justify-center">
            <Pagination links={meetingsLinks} />
          </div>
        )}
      </div>
      )}
    </AppLayout>
  );
}
