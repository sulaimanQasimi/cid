import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/page-header';
import { AlertTriangle, Edit, Trash2, User, MapPin, Calendar, Tag, FileText, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useTranslation } from '@/lib/i18n/translate';

interface IncidentDetailProps {
  incident: {
    id: number;
    title: string;
    description: string;
    incident_date: string;
    incident_time: string | null;
    status: string;
    incident_type: string;
    location: string | null;
    coordinates: string | null;
    casualties: number;
    injuries: number;
    district: {
      id: number;
      name: string;
      province: {
        id: number;
        name: string;
      };
    };
    category: {
      id: number;
      name: string;
      color: string;
    };
    report: {
      id: number;
      report_number: string;
    } | null;
    reporter: {
      id: number;
      name: string;
    };
  };
}

export default function Show({ incident }: IncidentDetailProps) {
  const { t } = useTranslation();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Define breadcrumb navigation
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
    },
    {
      title: 'Incidents',
      href: route('incidents.index'),
    },
    {
      title: incident.title,
      href: route('incidents.show', incident.id),
    },
  ];

  const handleDelete = () => {
    router.delete(route('incidents.destroy', incident.id));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('incidents.show_title', { name: incident.title })} />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <PageHeader
          title={t('incidents.details_title')}
          description={t('incidents.details_description')}
          actions={
            <div className="flex space-x-2">
              <Button variant="outline" asChild>
                <Link href={route('incidents.index')}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t('incidents.back_to_list')}
                </Link>
              </Button>
              <Button asChild>
                <Link href={route('incidents.edit', incident.id)}>
                  <Edit className="mr-2 h-4 w-4" />
                  {t('common.edit')}
                </Link>
              </Button>
              <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t('common.delete')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('incidents.delete_title')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('incidents.delete_description')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      {t('common.delete')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          }
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{incident.title}</CardTitle>
                    <CardDescription>
                      {incident.incident_type}
                    </CardDescription>
                  </div>
                  <Badge variant={
                    incident.status === 'resolved' ? 'default' :
                    incident.status === 'investigating' ? 'default' :
                    incident.status === 'closed' ? 'outline' : 'default'
                  }>
                    {incident.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium">{t('incidents.form.description')}</h3>
                    <p className="mt-2 whitespace-pre-line text-muted-foreground">{incident.description}</p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium">{t('incidents.impact')}</h3>
                    <div className="mt-2 grid gap-4 md:grid-cols-2">
                      <div className="rounded-lg border p-3">
                        <div className="text-sm font-medium">{t('incidents.form.casualties')}</div>
                        <div className="mt-1 text-2xl font-bold">
                          {incident.casualties}
                        </div>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="text-sm font-medium">{t('incidents.form.injuries')}</div>
                        <div className="mt-1 text-2xl font-bold">
                          {incident.injuries}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {incident.report && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('incidents.associated_report')}</CardTitle>
                  <CardDescription>
                    {t('incidents.associated_report_description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    href={route('incident-reports.show', incident.report.id)}
                    className="group flex items-center rounded-md border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="mr-4 rounded-full bg-primary/10 p-2">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium group-hover:underline">
                        {incident.report.report_number}
                      </div>
                      <div className="text-sm text-muted-foreground">
                         {t('incidents.view_full_report')}
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('incidents.information')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{t('incidents.date_time')}</div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(incident.incident_date), 'PPP')}
                      {incident.incident_time && ` ${incident.incident_time}`}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Tag className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{t('incidents.category_type')}</div>
                    <div className="text-sm text-muted-foreground">
                      <Badge
                        className="mr-2"
                        style={{ backgroundColor: incident.category?.color || '#888888' }}
                      >
                        {incident.category?.name || t('incidents.unspecified')}
                      </Badge>
                      {incident.incident_type}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{t('incidents.table.location')}</div>
                    <div className="text-sm text-muted-foreground">
                       {incident.location || t('incidents.unspecified_location')}<br />
                      {incident.district?.name}, {incident.district?.province?.name}
                      {incident.coordinates && (
                        <div className="mt-1 text-xs">
                          Coordinates: {incident.coordinates}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <User className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{t('incidents.reported_by')}</div>
                    <div className="text-sm text-muted-foreground">
                     {incident.reporter?.name || t('incidents.unknown')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
