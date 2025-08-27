import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/page-header';
import { Pagination } from '@/components/pagination';
import { ArrowRight, Edit, Shield, AlertTriangle, FileText, Clock, User, PlusCircle, ChartBar, Pencil, Trash, UserRound, MapPin, Calendar, Building2, Phone, IdCard, Printer, BarChart3, Eye, Users, Home, Gavel, FileCheck, BookText, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/lib/i18n/translate';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';

interface StatCategory {
  id: number;
  name: string;
  label: string;
  color: string;
  status: string;
}

interface StatCategoryItem {
  id: number;
  name: string;
  label: string;
  color: string;
  category: {
    id: number;
    name: string;
    label: string;
    color: string;
  };
}

interface ReportStat {
  id: number;
  incident_report_id: number;
  stat_category_item_id: number;
  integer_value: number | null;
  string_value: string | null;
  notes: string | null;
  stat_category_item: StatCategoryItem;
}

interface ShowProps {
  report: {
    id: number;
    report_number: string;
    report_date: string;
    report_status: string;
    security_level: string;
    details: string;
    action_taken?: string;
    recommendation?: string;
    source?: string;
    submitted_by: number;
    approved_by?: number;
    created_at: string;
    updated_at: string;
    submitter?: {
      id: number;
      name: string;
    };
    approver?: {
      id: number;
      name: string;
    };
  };
  incidents: {
    data: Array<{
      id: number;
      title: string;
      incident_date: string;
      description: string;
      severity: string;
      district?: {
        id: number;
        name: string;
      };
      category?: {
        id: number;
        name: string;
        color: string;
      };
    }>;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
  };
  reportStats: ReportStat[];
  statCategories: StatCategory[];
}

export default function Show({ report, incidents, reportStats, statCategories }: ShowProps) {
  const { t } = useTranslation();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Generate breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('incident_reports.page_title'),
      href: route('incident-reports.index'),
    },
    {
      title: report.report_number,
      href: route('incident-reports.show', report.id),
    },
  ];

  // Handle delete
  const handleDelete = () => {
    router.delete(route('incident-reports.destroy', report.id));
  };

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  function getStatusBadge(status: string) {
    switch (status) {
      case 'approved':
        return <Badge variant="success">{status}</Badge>;
      case 'reviewed':
        return <Badge variant="secondary">{status}</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  }

  // Group stats by category
  const statsByCategory: Record<string, ReportStat[]> = {};
  reportStats.forEach(stat => {
    const categoryName = stat.stat_category_item.category.label;
    const categoryId = stat.stat_category_item.category.id;

    if (!statsByCategory[categoryName]) {
      statsByCategory[categoryName] = [];
    }
    statsByCategory[categoryName].push(stat);
  });

  // Filter stats by selected category
  const filteredStatsByCategory = selectedCategory
    ? Object.entries(statsByCategory).filter(([_, stats]) =>
        stats.some(stat => stat.stat_category_item.category.id === selectedCategory))
    : Object.entries(statsByCategory);

  // Get value from report stat
  function getStatValue(stat: ReportStat): string {
    return stat.integer_value !== null ? stat.integer_value.toString() : (stat.string_value || '');
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('incident_reports.show.page_title', { number: report.report_number })} />

      <div className="container px-0 py-6">
        {/* Modern Header with Glassmorphism */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-teal-600 via-emerald-600 to-green-600 p-8 lg:p-12 text-white shadow-2xl mb-8 group">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="absolute top-0 left-0 w-80 h-80 bg-white/10 rounded-full -translate-y-40 -translate-x-40 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 translate-x-32 blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full -translate-x-16 -translate-y-16 blur-xl group-hover:scale-150 transition-transform duration-500"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8">
            <div className="flex items-center gap-8">
              <div className="p-6 bg-white/20 backdrop-blur-md rounded-3xl border border-white/30 shadow-2xl group-hover:scale-105 transition-transform duration-300">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl tracking-tight">{report.report_number}</h2>
                <p className="text-white/90 flex items-center gap-3 text-xl font-medium">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <FileText className="h-6 w-6" />
                  </div>
                  {t('incident_reports.show.report_date_label')}: {format(new Date(report.report_date), 'PPP')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setIsDeleteDialogOpen(true)}
                className="bg-red-500/20 backdrop-blur-md border-red-300/30 text-white hover:bg-red-500/30 rounded-xl shadow-lg px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-red-500/20 rounded-lg">
                    <Trash className="h-4 w-4" />
                  </div>
                  {t('common.delete')}
                </div>
              </Button>
              
              <Button asChild className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 rounded-xl shadow-lg px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105">
                <Link href={route('incident-reports.edit', report.id)}>
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-white/20 rounded-lg">
                      <Pencil className="h-4 w-4" />
                    </div>
                    {t('incident_reports.actions.edit_report')}
                  </div>
                </Link>
              </Button>
              
              <Button asChild className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 rounded-xl shadow-lg px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105">
                <Link href={route('incident-reports.print', report.id)}>
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-white/20 rounded-lg">
                      <Printer className="h-4 w-4" />
                    </div>
                    {t('incident_reports.actions.print_report')}
                  </div>
                </Link>
              </Button>
              
              <Link href={route('incident-reports.index')} className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 rounded-xl shadow-lg px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 group/btn">
                <div className="flex items-center gap-2">
                  {t('common.back')}
                  <div className="p-1 bg-white/20 rounded-lg group-hover/btn:scale-110 transition-transform duration-300">
                    <ArrowLeft className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Report Information */}
          <Card className="md:col-span-4 border-none shadow-xl overflow-hidden bg-gradient-to-bl from-white to-green-50/30">
            <CardHeader className="bg-gradient-to-l from-green-500 to-green-600 text-white border-b pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 bg-white/20 rounded-lg">
                  <FileText className="h-5 w-5" />
                </div>
                {t('incident_reports.form.info_title')}
              </CardTitle>
              <CardDescription className="text-green-100">
                {t('incident_reports.details.long_description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-medium text-green-600 mb-3 flex items-center gap-2" dir="rtl">
                    {t('incident_reports.show.report_info')}
                    <FileText className="h-4 w-4" />
                  </h3>
                  <div className="rounded-xl border border-green-100 bg-gradient-to-l from-green-50 to-white p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-700 font-medium flex items-center gap-2" dir="rtl">
                        {t('incident_reports.show.report_number')}:
                        <FileText className="h-4 w-4" />
                      </span>
                      <span className="text-sm text-green-900 font-semibold">{report.report_number}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-700 font-medium flex items-center gap-2" dir="rtl">
                        {t('incident_reports.show.report_date_label')}:
                        <Calendar className="h-4 w-4" />
                      </span>
                      <span className="text-sm text-green-900">{format(new Date(report.report_date), 'PPP')}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-700 font-medium flex items-center gap-2" dir="rtl">
                        {t('incident_reports.show.status')}:
                        <Clock className="h-4 w-4" />
                      </span>
                      <Badge variant="outline" className="bg-gradient-to-l from-green-100 to-green-200 text-green-800 border-green-300 px-3 py-1 text-xs font-medium">
                        {t(`incident_reports.status.${report.report_status}`)}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-700 font-medium flex items-center gap-2" dir="rtl">
                        {t('incident_reports.show.security_level')}:
                        <Shield className="h-4 w-4" />
                      </span>
                      <Badge variant="outline" className="bg-gradient-to-l from-green-100 to-green-200 text-green-800 border-green-300 px-3 py-1 text-xs font-medium">
                        {t(`incident_reports.level.${report.security_level}`)}
                      </Badge>
                    </div>

                    {report.source && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-green-700 font-medium flex items-center gap-2" dir="rtl">
                          {t('incident_reports.show.source_label')}:
                          <Users className="h-4 w-4" />
                        </span>
                        <span className="text-sm text-green-900">{report.source}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-green-600 mb-3 flex items-center gap-2" dir="rtl">
                    {t('incident_reports.show.user_info')}
                    <UserRound className="h-4 w-4" />
                  </h3>
                  <div className="rounded-xl border border-green-100 bg-gradient-to-l from-green-50 to-white p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-700 font-medium flex items-center gap-2" dir="rtl">
                        {t('incident_reports.show.submitted_by')}:
                        <User className="h-4 w-4" />
                      </span>
                      <span className="text-sm text-green-900">{report.submitter?.name || t('incidents.unknown')}</span>
                    </div>

                    {report.approver && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-green-700 font-medium flex items-center gap-2" dir="rtl">
                          {t('incident_reports.show.approved_by')}:
                          <User className="h-4 w-4" />
                        </span>
                        <span className="text-sm text-green-900">{report.approver?.name}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-700 font-medium flex items-center gap-2" dir="rtl">
                        {t('incident_reports.show.created_at')}:
                        <Clock className="h-4 w-4" />
                      </span>
                      <span className="text-sm text-green-900">{format(new Date(report.created_at), 'PPP')}</span>
                    </div>

                    {report.updated_at !== report.created_at && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-green-700 font-medium flex items-center gap-2" dir="rtl">
                          {t('incident_reports.show.last_updated')}:
                          <Clock className="h-4 w-4" />
                        </span>
                        <span className="text-sm text-green-900">{format(new Date(report.updated_at), 'PPP')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Report Details */}
          <div className="md:col-span-8 space-y-8">
            <Card className="border-none shadow-xl overflow-hidden bg-gradient-to-bl from-white to-green-50/30">
              <CardHeader className="bg-gradient-to-l from-green-500 to-green-600 text-white border-b pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <BookText className="h-5 w-5" />
                  </div>
                  {t('incident_reports.details.title')}
                </CardTitle>
                <CardDescription className="text-green-100">
                  {t('incident_reports.details.long_description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-green-600 mb-3 flex items-center gap-2" dir="rtl">
                      {t('incident_reports.details.details_label')}
                      <FileText className="h-4 w-4" />
                    </h3>
                    <div className="rounded-xl border border-green-100 bg-gradient-to-l from-green-50 to-white p-4">
                      <p className="text-sm text-green-900 whitespace-pre-wrap" dir="rtl">{report.details}</p>
                    </div>
                  </div>

                  {report.action_taken && (
                    <div>
                      <h3 className="text-sm font-medium text-green-600 mb-3 flex items-center gap-2" dir="rtl">
                        {t('incident_reports.details.action_taken_label')}
                        <Gavel className="h-4 w-4" />
                      </h3>
                      <div className="rounded-xl border border-green-100 bg-gradient-to-l from-green-50 to-white p-4">
                        <p className="text-sm text-green-900 whitespace-pre-wrap" dir="rtl">{report.action_taken}</p>
                      </div>
                    </div>
                  )}

                  {report.recommendation && (
                    <div>
                      <h3 className="text-sm font-medium text-green-600 mb-3 flex items-center gap-2" dir="rtl">
                        {t('incident_reports.details.recommendation_label')}
                        <FileCheck className="h-4 w-4" />
                      </h3>
                      <div className="rounded-xl border border-green-100 bg-gradient-to-l from-green-50 to-white p-4">
                        <p className="text-sm text-green-900 whitespace-pre-wrap" dir="rtl">{report.recommendation}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="mt-8">
          <Tabs defaultValue="incidents" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 rounded-xl p-1 bg-gradient-to-l from-green-100 to-green-200 shadow-lg">
              <TabsTrigger
                value="incidents"
                className={cn(
                  "data-[state=active]:bg-gradient-to-l data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg flex items-center gap-2",
                  "transition-all duration-300 rounded-lg"
                )}
              >
                <AlertTriangle className="h-4 w-4" />
                <span>{t('incidents.page_title')}</span>
              </TabsTrigger>
              <TabsTrigger
                value="stats"
                className={cn(
                  "data-[state=active]:bg-gradient-to-l data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg flex items-center gap-2",
                  "transition-all duration-300 rounded-lg"
                )}
              >
                <ChartBar className="h-4 w-4" />
                <span>{t('incident_reports.stats.title')}</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="incidents">
              <Card className="border-none shadow-xl overflow-hidden bg-gradient-to-bl from-white to-green-50/30">
                <CardHeader className="bg-gradient-to-l from-green-500 to-green-600 text-white border-b pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    {t('incidents.page_title')}
                  </CardTitle>
                  <CardDescription className="text-green-100">
                    {t('incident_reports.incidents.card_description')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex justify-end mb-4">
                    <Button asChild className="bg-gradient-to-l from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg">
                      <Link href={route('incident-reports.incidents', report.id)}>
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        {t('incident_reports.incidents.view_all')}
                      </Link>
                    </Button>
                  </div>
                  
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-green-50/50 data-[state=selected]:bg-green-50">
                          <th className="h-12 px-4 text-left align-middle font-medium text-green-700">{t('incidents.table.title')}</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-green-700">{t('incidents.table.date')}</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-green-700">{t('incidents.table.category')}</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-green-700">{t('incidents.table.severity')}</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-green-700">{t('common.actions')}</th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0">
                        {incidents.data.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="h-12 px-4 text-center align-middle text-green-600">
                              {t('incidents.no_incidents')}
                            </td>
                          </tr>
                        ) : (
                          incidents.data.map((incident) => (
                            <tr key={incident.id} className="border-b transition-colors hover:bg-green-50/50 data-[state=selected]:bg-green-50">
                              <td className="p-4 align-middle text-green-900">{incident.title}</td>
                              <td className="p-4 align-middle text-green-900">{format(new Date(incident.incident_date), 'PP')}</td>
                              <td className="p-4 align-middle">
                                {incident.category ? (
                                  <Badge
                                    style={{ backgroundColor: incident.category.color, color: '#fff' }}
                                  >
                                    {incident.category.name}
                                  </Badge>
                                ) : (
                                  t('incidents.none')
                                )}
                              </td>
                              <td className="p-4 align-middle">
                                <Badge variant={
                                  incident.severity === 'high' ? 'destructive' :
                                  incident.severity === 'medium' ? 'warning' : 'default'
                                }>
                                  {incident.severity}
                                </Badge>
                              </td>
                              <td className="p-4 align-middle">
                                <Button variant="ghost" size="sm" asChild className="text-green-600 hover:text-green-700 hover:bg-green-50">
                                  <Link href={route('incidents.show', incident.id)}>{t('incident_reports.view')}</Link>
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4">
                    <Pagination links={incidents.links} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats">
              <Card className="border-none shadow-xl overflow-hidden bg-gradient-to-bl from-white to-green-50/30">
                <CardHeader className="bg-gradient-to-l from-green-500 to-green-600 text-white border-b pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <ChartBar className="h-5 w-5" />
                    </div>
                    {t('incident_reports.stats.title')}
                  </CardTitle>
                  <CardDescription className="text-green-100">
                    {t('incident_reports.stats.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex justify-end mb-4">
                    <Button asChild className="bg-gradient-to-l from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg">
                      <Link href={route('incident-reports.edit', report.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        {t('incident_reports.stats.edit')}
                      </Link>
                    </Button>
                  </div>
                  
                  {Object.keys(statsByCategory).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <p className="text-green-600">{t('incident_reports.stats.empty')}</p>
                      <Button variant="outline" asChild className="mt-4 border-green-300 text-green-700 hover:bg-green-50">
                        <Link href={route('incident-reports.edit', report.id)}>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          {t('incident_reports.stats.add_data')}
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {statCategories.length > 1 && reportStats.length > 0 && (
                        <div className="mb-4">
                          <Label htmlFor="category-filter" className="text-green-700 font-medium">{t('incident_reports.stats.filter_by_category')}</Label>
                          <Select
                            onValueChange={(value) => setSelectedCategory(value === "all" ? null : parseInt(value))}
                            defaultValue="all"
                          >
                            <SelectTrigger id="category-filter" className="border-green-200 focus:border-green-500 focus:ring-green-500/20 bg-gradient-to-l from-green-50 to-white">
                              <SelectValue placeholder={t('incident_reports.stats.select_category')} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">{t('incidents.filters.all_categories')}</SelectItem>
                              {statCategories
                                .filter(category =>
                                  Object.entries(statsByCategory).some(([categoryLabel]) =>
                                    statsByCategory[categoryLabel][0].stat_category_item.category.id === category.id
                                  )
                                )
                                .map((category) => (
                                  <SelectItem key={category.id} value={category.id.toString()}>
                                    <div className="flex items-center">
                                      <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: category.color }}></div>
                                      {category.label}
                                    </div>
                                  </SelectItem>
                                ))
                              }
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {filteredStatsByCategory.map(([categoryName, stats]) => (
                        <div key={categoryName} className="space-y-3">
                          <h3 className="text-lg font-medium text-green-700">
                            <div className="flex items-center">
                              <div
                                className="h-3 w-3 rounded-full mr-2"
                                style={{ backgroundColor: stats[0].stat_category_item.category.color }}
                              ></div>
                              {categoryName}
                            </div>
                          </h3>
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-green-50">
                                <TableHead className="text-green-700 font-medium">{t('incident_reports.stats.table.item')}</TableHead>
                                <TableHead className="text-green-700 font-medium">{t('incident_reports.stats.table.value')}</TableHead>
                                <TableHead className="text-green-700 font-medium">{t('incident_reports.stats.table.notes')}</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {stats.map((stat) => (
                                <TableRow key={stat.id} className="hover:bg-green-50/50">
                                  <TableCell className="text-green-900">
                                    <div className="flex items-center space-x-2">
                                      <div
                                        className="h-3 w-3 rounded-full"
                                        style={{ backgroundColor: stat.stat_category_item.color || stat.stat_category_item.category.color }}
                                      ></div>
                                      <span>{stat.stat_category_item.label}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-green-900 font-medium">{getStatValue(stat)}</TableCell>
                                  <TableCell className="text-green-900">{stat.notes || '-'}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">{t('incident_reports.delete_dialog.title')}</AlertDialogTitle>
            <AlertDialogDescription className="mt-2">
              {t('incident_reports.delete_dialog.description', { number: report.report_number })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel className="shadow-sm">{t('incident_reports.delete_dialog.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground shadow-sm">
              {t('incident_reports.delete_dialog.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
