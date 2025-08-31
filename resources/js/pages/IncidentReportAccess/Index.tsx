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
        <Badge className="bg-purple-100 text-purple-800 border-purple-300">
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
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-purple-600 via-blue-600 to-indigo-600 p-8 lg:p-12 text-white shadow-2xl mb-8 group">
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="absolute top-0 left-0 w-80 h-80 bg-white/10 rounded-full -translate-y-40 -translate-x-40 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 translate-x-32 blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8">
            <div className="flex items-center gap-8">
              <div className="p-6 bg-white/20 backdrop-blur-md rounded-3xl border border-white/30 shadow-2xl group-hover:scale-105 transition-transform duration-300">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl tracking-tight">{t('incident_report_access')}</h2>
                <div className="text-white/90 flex items-center gap-3 text-xl font-medium">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Lock className="h-6 w-6" />
                  </div>
                  {t('manage_user_access_to_incident_reports')}
                </div>
              </div>
            </div>
            
            <Button asChild size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 group/btn">
              <Link href={route('incident-report-access.create')} className="flex items-center gap-3">
                <div className="p-1 bg-white/20 rounded-lg group-hover/btn:scale-110 transition-transform duration-300">
                  <Plus className="h-5 w-5" />
                </div>
                {t('grant_access')}
              </Link>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="shadow-2xl bg-gradient-to-bl from-white to-purple-50/30 border-0 rounded-3xl overflow-hidden mb-8">
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
                  <Label htmlFor="search" className="text-purple-700 font-medium">Search Users</Label>
                  <Input
                    id="search"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mt-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 to-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="status" className="text-purple-700 font-medium">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="mt-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 to-white">
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
                  <Label htmlFor="access_type" className="text-purple-700 font-medium">Access Type</Label>
                  <Select value={accessType} onValueChange={setAccessType}>
                    <SelectTrigger className="mt-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 to-white">
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
                  <Label htmlFor="report_type" className="text-purple-700 font-medium">Report Type</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger className="mt-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 to-white">
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
                  <Label htmlFor="incident_report_id" className="text-purple-700 font-medium">Specific Report</Label>
                  <Select value={incidentReportId} onValueChange={setIncidentReportId}>
                    <SelectTrigger className="mt-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500/20 bg-gradient-to-l from-purple-50 to-white">
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
        <Card className="shadow-2xl overflow-hidden bg-gradient-to-bl from-white to-purple-50/30 border-0 rounded-3xl">
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
                  <tr className="bg-gradient-to-l from-purple-100 to-purple-200 border-0">
                    <th className="h-12 px-6 text-left align-middle font-bold text-purple-800 text-lg">User</th>
                    <th className="h-12 px-6 text-left align-middle font-bold text-purple-800 text-lg">Access Type</th>
                    <th className="h-12 px-6 text-left align-middle font-bold text-purple-800 text-lg">Report</th>
                    <th className="h-12 px-6 text-left align-middle font-bold text-purple-800 text-lg">Status</th>
                    <th className="h-12 px-6 text-left align-middle font-bold text-purple-800 text-lg">Granted By</th>
                    <th className="h-12 px-6 text-left align-middle font-bold text-purple-800 text-lg">Expires</th>
                    <th className="h-12 px-6 text-left align-middle font-bold text-purple-800 text-lg">Actions</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {accessRecords.data.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="h-32 text-center align-middle">
                        <div className="flex flex-col items-center gap-4 text-purple-600">
                          <div className="p-4 bg-purple-100 rounded-full">
                            <Shield className="h-16 w-16 text-purple-400" />
                          </div>
                          <p className="text-xl font-bold">No access records found</p>
                          <p className="text-purple-500">No users have been granted incident report access yet</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    accessRecords.data.map((record) => (
                      <tr
                        key={record.id}
                        className="border-b border-purple-100 transition-colors hover:bg-purple-50/50 data-[state=selected]:bg-purple-50"
                      >
                        <td className="p-6 align-middle">
                          <div>
                            <div className="font-semibold text-purple-900">{record.user.name}</div>
                            <div className="text-sm text-purple-600">{record.user.email}</div>
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
                        <td className="p-6 align-middle text-purple-800 font-medium">
                          {record.granted_by.name}
                        </td>
                        <td className="p-6 align-middle text-purple-800">
                          {record.expires_at ? (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-purple-500" />
                              {format(new Date(record.expires_at), 'PPP')}
                            </div>
                          ) : (
                            <span className="text-purple-600">No expiration</span>
                          )}
                        </td>
                        <td className="p-6 align-middle">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                              title="View Details"
                              className="h-10 w-10 rounded-xl hover:bg-purple-100 text-purple-600 hover:text-purple-700 transition-all duration-300 hover:scale-110"
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
                              className="h-10 w-10 rounded-xl hover:bg-purple-100 text-purple-600 hover:text-purple-700 transition-all duration-300 hover:scale-110"
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
            <div className="bg-gradient-to-l from-purple-50 to-white p-4 rounded-3xl shadow-2xl border border-purple-200">
              <Pagination links={accessRecords.links} />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
