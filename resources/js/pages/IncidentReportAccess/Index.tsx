import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/pagination';
import { PageHeader } from '@/components/page-header';
import { Plus, Shield, User, Clock, Calendar, Search, Filter, ArrowUpDown, Eye, Edit, Trash2, AlertTriangle, CheckCircle, XCircle, Users, Lock, Unlock } from 'lucide-react';
import { format } from 'date-fns';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { useDebounce } from '@/hooks/use-debounce';
import { useTranslation } from '@/lib/i18n/translate';
import Header from '@/components/template/header';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';

interface AccessRecord {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  granted_by: {
    id: number;
    name: string;
  };
  incident_report: {
    id: number;
    report_number: string;
    report_date: string;
  } | null;
  access_type: 'full' | 'read_only' | 'incidents_only';
  notes: string | null;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface IncidentReport {
  id: number;
  report_number: string;
  report_date: string;
}

interface IndexProps {
  accessRecords: {
    data: AccessRecord[];
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
  };
  incidentReports: IncidentReport[];
  filters?: {
    search?: string;
    status?: string;
    access_type?: string;
    report_type?: string;
    incident_report_id?: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Incident Report Access',
    href: route('incident-report-access.index'),
  },
];

export default function Index({ accessRecords, incidentReports, filters = {} }: IndexProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState(filters.search || '');
  const [status, setStatus] = useState(filters.status || 'all');
  const [accessType, setAccessType] = useState(filters.access_type || 'all');
  const [reportType, setReportType] = useState(filters.report_type || 'all');
  const [incidentReportId, setIncidentReportId] = useState(filters.incident_report_id || 'all');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  // Apply filters when they change
  useEffect(() => {
    const params = {
      search: debouncedSearch,
      status: status === 'all' ? '' : status,
      access_type: accessType === 'all' ? '' : accessType,
      report_type: reportType === 'all' ? '' : reportType,
      incident_report_id: incidentReportId === 'all' ? '' : incidentReportId,
    };

    router.get(route('incident-report-access.index'), params, {
      preserveState: true,
      replace: true,
    });
  }, [debouncedSearch, status, accessType, reportType, incidentReportId]);

  function getAccessTypeBadge(type: string) {
    switch (type) {
      case 'full':
        return <Badge className="bg-green-100 text-green-800 border-green-300">{t('full_access')}</Badge>;
      case 'read_only':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">{t('read_only')}</Badge>;
      case 'incidents_only':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-300">{t('incidents_only')}</Badge>;
      default:
        return <Badge variant="outline">{t('unknown')}</Badge>;
    }
  }

  function getStatusBadge(record: AccessRecord) {
    if (!record.is_active) {
      return <Badge className="bg-gray-100 text-gray-800 border-gray-300">{t('inactive')}</Badge>;
    }
    
    if (record.expires_at && new Date(record.expires_at) < new Date()) {
      return <Badge className="bg-red-100 text-red-800 border-red-300">{t('expired')}</Badge>;
    }
    
    return <Badge className="bg-green-100 text-green-800 border-green-300">{t('active')}</Badge>;
  }

  function getReportBadge(record: AccessRecord) {
    if (record.incident_report) {
      return (
        <Badge className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-purple-300">
          {record.incident_report.report_number}
        </Badge>
      );
    }
    return <Badge className="bg-blue-100 text-blue-800 border-blue-300">{t('global')}</Badge>;
  }

  function handleRevoke(recordId: number) {
    router.delete(route('incident-report-access.destroy', recordId));
  }

  function handleRevokeUser(userId: number) {
    router.post(route('incident-report-access.revoke', userId));
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Incident Report Access Management" />

      <div className="container px-0 py-6">
        <Header
          title={t('incident_report_access')}
          description={t('manage_user_access_to_incident_reports')}
          icon={<Shield className="h-6 w-6 text-white" />}
          model="incident_report_access"
          routeName={() => route('incident-report-access.create')}
          buttonText={t('grant_access')}
          theme="purple"
          buttonSize="lg"
          showBackButton={false}
          showButton={true}
        />

        {/* Filters */}
        <Card className="shadow-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700  overflow-hidden mb-8">
          <CardHeader className="py-4 bg-gradient-to-l from-purple-500 to-purple-600 text-white cursor-pointer" onClick={() => setIsFiltersOpen(!isFiltersOpen)}>
            <CardTitle className="text-lg font-semibold flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm shadow-lg">
                  <Filter className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-bold">{t('filters')}</div>
                  <div className="text-purple-100 text-xs font-medium">{t('filter_access_records')}</div>
                </div>
              </div>
              <div className={`transition-transform duration-300 ${isFiltersOpen ? 'rotate-180' : ''}`}>
                <ArrowUpDown className="h-5 w-5" />
              </div>
            </CardTitle>
          </CardHeader>
          <div className={`transition-all duration-300 overflow-hidden ${isFiltersOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <Label htmlFor="search" className="text-gray-800 dark:text-gray-200 font-medium">Search Users</Label>
                  <Input
                    id="search"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mt-2 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 bg-white dark:bg-gray-800"
                  />
                </div>
                
                <div>
                  <Label htmlFor="status" className="text-gray-800 dark:text-gray-200 font-medium">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="mt-2 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 bg-white dark:bg-gray-800">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="access_type" className="text-gray-800 dark:text-gray-200 font-medium">Access Type</Label>
                  <Select value={accessType} onValueChange={setAccessType}>
                    <SelectTrigger className="mt-2 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 bg-white dark:bg-gray-800">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="full">Full Access</SelectItem>
                      <SelectItem value="read_only">Read Only</SelectItem>
                      <SelectItem value="incidents_only">Incidents Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="report_type" className="text-gray-800 dark:text-gray-200 font-medium">Report Type</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger className="mt-2 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 bg-white dark:bg-gray-800">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="global">Global Access</SelectItem>
                      <SelectItem value="specific">Report Specific</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="incident_report_id" className="text-gray-800 dark:text-gray-200 font-medium">Specific Report</Label>
                  <Select value={incidentReportId} onValueChange={setIncidentReportId}>
                    <SelectTrigger className="mt-2 border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 bg-white dark:bg-gray-800">
                      <SelectValue placeholder="All Reports" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Reports</SelectItem>
                      {incidentReports.map((report) => (
                        <SelectItem key={report.id} value={report.id.toString()}>
                          {report.report_number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Results */}
        <Card className="shadow-2xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ">
          <CardHeader className="bg-gradient-to-l from-purple-500 to-purple-600 text-white py-6">
            <CardTitle className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold">Access Records</div>
                <div className="text-purple-100 text-sm font-medium">Manage user access to incident reports</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-hidden rounded-b-3xl">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="bg-gray-100 dark:bg-gray-700 border-0">
                    <th className="h-12 px-6 text-left align-middle font-bold text-gray-800 dark:text-gray-200 text-lg">User</th>
                    <th className="h-12 px-6 text-left align-middle font-bold text-gray-800 dark:text-gray-200 text-lg">Access Type</th>
                    <th className="h-12 px-6 text-left align-middle font-bold text-gray-800 dark:text-gray-200 text-lg">Report</th>
                    <th className="h-12 px-6 text-left align-middle font-bold text-gray-800 dark:text-gray-200 text-lg">Status</th>
                    <th className="h-12 px-6 text-left align-middle font-bold text-gray-800 dark:text-gray-200 text-lg">Granted By</th>
                    <th className="h-12 px-6 text-left align-middle font-bold text-gray-800 dark:text-gray-200 text-lg">Expires</th>
                    <th className="h-12 px-6 text-left align-middle font-bold text-gray-800 dark:text-gray-200 text-lg">Actions</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {accessRecords.data.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="h-32 text-center align-middle">
                        <div className="flex flex-col items-center gap-4 text-gray-600 dark:text-gray-400">
                          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                            <Shield className="h-16 w-16 text-gray-400" />
                          </div>
                          <p className="text-xl font-bold">No access records found</p>
                          <p className="text-gray-500 dark:text-gray-400">No users have been granted incident report access yet</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    accessRecords.data.map((record) => (
                      <tr
                        key={record.id}
                        className="border-b border-gray-200 dark:border-gray-700 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 data-[state=selected]:bg-muted"
                      >
                        <td className="p-6 align-middle">
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-gray-100">{record.user.name}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{record.user.email}</div>
                          </div>
                        </td>
                        <td className="p-6 align-middle">
                          {getAccessTypeBadge(record.access_type)}
                        </td>
                        <td className="p-6 align-middle">
                          {getReportBadge(record)}
                        </td>
                        <td className="p-6 align-middle">
                          {getStatusBadge(record)}
                        </td>
                        <td className="p-6 align-middle text-gray-800 dark:text-gray-200 font-medium">
                          {record.granted_by.name}
                        </td>
                        <td className="p-6 align-middle text-gray-800 dark:text-gray-200">
                          {record.expires_at ? (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              {format(new Date(record.expires_at), 'PPP')}
                            </div>
                          ) : (
                            <span className="text-gray-600 dark:text-gray-400">No expiration</span>
                          )}
                        </td>
                        <td className="p-6 align-middle">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                              title="View Details"
                              className="h-10 w-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:text-gray-200 transition-all duration-300 hover:scale-110"
                            >
                              <Link href={route('incident-report-access.show', record.id)}>
                                <Eye className="h-5 w-5" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                              title="Edit Access"
                              className="h-10 w-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:text-gray-200 transition-all duration-300 hover:scale-110"
                            >
                              <Link href={route('incident-report-access.edit', record.id)}>
                                <Edit className="h-5 w-5" />
                              </Link>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="Revoke Access"
                                  className="h-10 w-10 rounded-xl hover:bg-red-100 text-red-600 hover:text-red-700 transition-all duration-300 hover:scale-110"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Revoke Access</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to revoke incident report access for {record.user.name}? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleRevoke(record.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Revoke Access
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        {accessRecords.links && accessRecords.links.length > 0 && (
          <div className="mt-8 flex justify-center">
            <div className="bg-white dark:bg-gray-800 p-4  shadow-2xl border border-gray-200 dark:border-gray-700">
              <Pagination links={accessRecords.links} />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
