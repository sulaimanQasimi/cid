import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/page-header';
import { Pagination } from '@/components/pagination';
import { ArrowLeft, Edit, Shield, AlertTriangle, FileText, Clock, User, PlusCircle, ChartBar } from 'lucide-react';
import { format } from 'date-fns';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/lib/i18n/translate';

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
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('sidebar.intelligence_dashboard'),
      href: '/dashboard',
    },
    {
      title: t('sidebar.incident_reports'),
      href: route('incident-reports.index'),
    },
    {
      title: report.report_number,
      href: route('incident-reports.show', report.id),
    },
  ];

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
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <PageHeader
          title={t('incident_reports.show.page_header_title', { number: report.report_number })}
          description={format(new Date(report.report_date), 'PPP')}
          actions={
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => window.history.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('common.back')}
              </Button>
              <Button asChild>
                <Link href={route('incident-reports.edit', report.id)}>
                  <Edit className="mr-2 h-4 w-4" />
                  {t('incident_reports.actions.edit_report')}
                </Link>
              </Button>
            </div>
          }
        />

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">{t('incident_reports.tabs.details')}</TabsTrigger>
            <TabsTrigger value="incidents">{t('incidents.page_title')}</TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center">
              <ChartBar className="mr-2 h-4 w-4" />
              {t('incident_reports.stats.title')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>{t('incident_reports.details.title')}</CardTitle>
                <CardDescription>
                  {t('incident_reports.details.long_description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-2 border-b pb-4">
                  <Badge variant="outline" className="flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    {t('incident_reports.show.report_date_label')}: {format(new Date(report.report_date), 'PPP')}
                  </Badge>
                  <Badge className="flex items-center" variant={
                    report.report_status === 'approved' ? 'outline' :
                    report.report_status === 'reviewed' ? 'secondary' : 'default'
                  }>
                    {t(`incident_reports.status.${report.report_status}`)}
                  </Badge>
                  <Badge variant={
                    report.security_level === 'classified' ? 'destructive' :
                    report.security_level === 'restricted' ? 'destructive' : 'default'
                  } className="flex items-center">
                    <Shield className="mr-1 h-3 w-3" />
                    {t(`incident_reports.level.${report.security_level}`)}
                  </Badge>
                  {report.source && (
                    <Badge variant="outline" className="flex items-center">
                      {t('incident_reports.show.source_label')}: {report.source}
                    </Badge>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold">{t('incident_reports.details.title')}</h3>
                  <div className="whitespace-pre-wrap mt-2 text-muted-foreground">
                    {report.details}
                  </div>
                </div>

                {report.action_taken && (
                  <div>
                    <h3 className="text-lg font-semibold">{t('incident_reports.details.actions_taken_title')}</h3>
                    <div className="whitespace-pre-wrap mt-2 text-muted-foreground">
                      {report.action_taken}
                    </div>
                  </div>
                )}

                {report.recommendation && (
                  <div>
                    <h3 className="text-lg font-semibold">{t('incident_reports.details.recommendations_title')}</h3>
                    <div className="whitespace-pre-wrap mt-2 text-muted-foreground">
                      {report.recommendation}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('incident_reports.form.info_title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">{t('incident_reports.show.submitted_by')}</div>
                  <div className="flex items-center mt-1">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    {report.submitter?.name || t('incidents.unknown')}
                  </div>
                </div>

                {report.approver && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">{t('incident_reports.show.approved_by')}</div>
                    <div className="flex items-center mt-1">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      {report.approver?.name}
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-sm font-medium text-muted-foreground">{t('incident_reports.show.created_at')}</div>
                  <div className="mt-1">
                    {format(new Date(report.created_at), 'PPP p')}
                  </div>
                </div>

                {report.updated_at !== report.created_at && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">{t('incident_reports.show.last_updated')}</div>
                    <div className="mt-1">
                      {format(new Date(report.updated_at), 'PPP p')}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="incidents">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{t('incidents.page_title')}</CardTitle>
                  <CardDescription>
                    {t('incident_reports.incidents.card_description')}
                  </CardDescription>
                </div>
                <Button asChild>
                  <Link href={route('incident-reports.incidents', report.id)}>
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    {t('incident_reports.incidents.view_all')}
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium">{t('incidents.table.title')}</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">{t('incidents.table.date')}</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">{t('incidents.table.category')}</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">{t('incidents.table.severity')}</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">{t('common.actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {incidents.data.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="h-12 px-4 text-center align-middle">
                            {t('incidents.no_incidents')}
                          </td>
                        </tr>
                      ) : (
                        incidents.data.map((incident) => (
                          <tr key={incident.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <td className="p-4 align-middle">{incident.title}</td>
                            <td className="p-4 align-middle">{format(new Date(incident.incident_date), 'PP')}</td>
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
                              <Button variant="ghost" size="sm" asChild>
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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{t('incident_reports.stats.title')}</CardTitle>
                  <CardDescription>{t('incident_reports.stats.description')}</CardDescription>
                </div>
                <Button asChild>
                  <Link href={route('incident-reports.edit', report.id)}>
                    <Edit className="mr-2 h-4 w-4" />
                    {t('incident_reports.stats.edit')}
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {Object.keys(statsByCategory).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <p className="text-muted-foreground">{t('incident_reports.stats.empty')}</p>
                    <Button variant="outline" asChild className="mt-4">
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
                        <Label htmlFor="category-filter">{t('incident_reports.stats.filter_by_category')}</Label>
                        <Select
                          onValueChange={(value) => setSelectedCategory(value === "all" ? null : parseInt(value))}
                          defaultValue="all"
                        >
                          <SelectTrigger id="category-filter">
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
                        <h3 className="text-lg font-medium">
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
                            <TableRow>
                              <TableHead>{t('incident_reports.stats.table.item')}</TableHead>
                              <TableHead>{t('incident_reports.stats.table.value')}</TableHead>
                              <TableHead>{t('incident_reports.stats.table.notes')}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {stats.map((stat) => (
                              <TableRow key={stat.id}>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    <div
                                      className="h-3 w-3 rounded-full"
                                      style={{ backgroundColor: stat.stat_category_item.color || stat.stat_category_item.category.color }}
                                    ></div>
                                    <span>{stat.stat_category_item.label}</span>
                                  </div>
                                </TableCell>
                                <TableCell>{getStatValue(stat)}</TableCell>
                                <TableCell>{stat.notes || '-'}</TableCell>
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
    </AppLayout>
  );
}
