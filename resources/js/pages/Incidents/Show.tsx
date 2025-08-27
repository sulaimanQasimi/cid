import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/page-header';
import { AlertTriangle, Edit, Trash2, User, MapPin, Calendar, Tag, FileText, ArrowRight, Shield, Clock, Users, Building2, AlertCircle, Home, Gavel, FileCheck, BookText } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

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
    is_confirmed: boolean;
    confirmed_at: string | null;
    confirmation_notes: string | null;
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
    confirmer: {
      id: number;
      name: string;
    } | null;
  };
  canEdit: boolean;
  canDelete: boolean;
  canConfirm: boolean;
}

export default function Show({ incident, canEdit, canDelete, canConfirm }: IncidentDetailProps) {
  const { t } = useTranslation();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [confirmationNotes, setConfirmationNotes] = useState('');

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

  const handleConfirm = () => {
    router.post(route('incidents.confirm', incident.id), {
      confirmation_notes: confirmationNotes
    });
  };

  const handleUnconfirm = () => {
    router.post(route('incidents.unconfirm', incident.id));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('incidents.show_title', { name: incident.title })} />

      <div className="container px-0 py-6">
        {/* Modern Header with Glassmorphism */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-blue-600 via-indigo-600 to-purple-600 p-8 lg:p-12 text-white shadow-2xl mb-8 group">
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
                <h2 className="text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl tracking-tight">{incident.title}</h2>
                <p className="text-white/90 flex items-center gap-3 text-xl font-medium">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <FileText className="h-6 w-6" />
                  </div>
                  {incident.incident_type}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Link href={route('incidents.index')} className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 rounded-xl shadow-lg px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 group/btn">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-white/20 rounded-lg group-hover/btn:scale-110 transition-transform duration-300">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                  {t('incidents.back_to_list')}
                </div>
              </Link>
              
              <Button asChild className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 rounded-xl shadow-lg px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105">
                <Link href={route('incidents.edit', incident.id)}>
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-white/20 rounded-lg">
                      <Edit className="h-4 w-4" />
                    </div>
                    {t('common.edit')}
                  </div>
                </Link>
              </Button>
              
              <Button
                onClick={() => setIsDeleteDialogOpen(true)}
                className="bg-red-500/20 backdrop-blur-md border-red-300/30 text-white hover:bg-red-500/30 rounded-xl shadow-lg px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-red-500/20 rounded-lg">
                    <Trash2 className="h-4 w-4" />
                  </div>
                  {t('common.delete')}
                </div>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Incident Details */}
          <div className="md:col-span-8 space-y-8">
            <Card className="border-none shadow-xl overflow-hidden bg-gradient-to-bl from-white to-blue-50/30">
              <CardHeader className="bg-gradient-to-l from-blue-500 to-blue-600 text-white border-b pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <FileText className="h-5 w-5" />
                  </div>
                  {t('incidents.details_title')}
                </CardTitle>
                <CardDescription className="text-blue-100">
                  {t('incidents.details_description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-blue-600 mb-3 flex items-center gap-2" dir="rtl">
                      {t('incidents.form.description')}
                      <BookText className="h-4 w-4" />
                    </h3>
                    <div className="rounded-xl border border-blue-100 bg-gradient-to-l from-blue-50 to-white p-4">
                      <p className="text-sm text-blue-900 whitespace-pre-line" dir="rtl">{incident.description}</p>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div>
                    <h3 className="text-sm font-medium text-blue-600 mb-3 flex items-center gap-2" dir="rtl">
                      {t('incidents.impact')}
                      <AlertTriangle className="h-4 w-4" />
                    </h3>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="rounded-xl border border-blue-100 bg-gradient-to-l from-blue-50 to-white p-4">
                        <div className="text-sm text-blue-700 font-medium" dir="rtl">{t('incidents.form.casualties')}</div>
                        <div className="mt-2 text-3xl font-bold text-blue-900">
                          {incident.casualties}
                        </div>
                      </div>
                      <div className="rounded-xl border border-blue-100 bg-gradient-to-l from-blue-50 to-white p-4">
                        <div className="text-sm text-blue-700 font-medium" dir="rtl">{t('incidents.form.injuries')}</div>
                        <div className="mt-2 text-3xl font-bold text-blue-900">
                          {incident.injuries}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {incident.report && (
              <Card className="border-none shadow-xl overflow-hidden bg-gradient-to-bl from-white to-blue-50/30">
                <CardHeader className="bg-gradient-to-l from-blue-500 to-blue-600 text-white border-b pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <FileText className="h-5 w-5" />
                    </div>
                    {t('incidents.associated_report')}
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    {t('incidents.associated_report_description')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <Link
                    href={route('incident-reports.show', incident.report.id)}
                    className="group flex items-center rounded-xl border border-blue-100 bg-gradient-to-l from-blue-50 to-white p-4 transition-all duration-300 hover:bg-blue-100/50 hover:scale-105"
                  >
                    <div className="mr-4 rounded-full bg-blue-100 p-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-blue-900 group-hover:underline">
                        {incident.report.report_number}
                      </div>
                      <div className="text-sm text-blue-600">
                         {t('incidents.view_full_report')}
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Incident Information */}
          <div className="md:col-span-4 space-y-8">
            <Card className="border-none shadow-xl overflow-hidden bg-gradient-to-bl from-white to-blue-50/30">
              <CardHeader className="bg-gradient-to-l from-blue-500 to-blue-600 text-white border-b pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  {t('incidents.information')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700 font-medium flex items-center gap-2" dir="rtl">
                      {t('incidents.date_time')}:
                      <Calendar className="h-4 w-4" />
                    </span>
                    <span className="text-sm text-blue-900 font-semibold">
                      {format(new Date(incident.incident_date), 'PPP')}
                      {incident.incident_time && ` ${incident.incident_time}`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700 font-medium flex items-center gap-2" dir="rtl">
                      {t('incidents.category_type')}:
                      <Tag className="h-4 w-4" />
                    </span>
                    <div className="text-right">
                      <Badge variant="outline" className="bg-gradient-to-l from-blue-100 to-blue-200 text-blue-800 border-blue-300 px-3 py-1 text-xs font-medium mb-1">
                        {incident.category?.name || t('incidents.unspecified')}
                      </Badge>
                      <div className="text-sm text-blue-900 font-semibold">{incident.incident_type}</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700 font-medium flex items-center gap-2" dir="rtl">
                      {t('incidents.table.location')}:
                      <MapPin className="h-4 w-4" />
                    </span>
                    <div className="text-right">
                      <div className="text-sm text-blue-900 font-semibold">
                        {incident.location || t('incidents.unspecified_location')}
                      </div>
                      <div className="text-sm text-blue-800">
                        {incident.district?.name}, {incident.district?.province?.name}
                      </div>
                      {incident.coordinates && (
                        <div className="text-xs text-blue-600 mt-1">
                          Coordinates: {incident.coordinates}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700 font-medium flex items-center gap-2" dir="rtl">
                      {t('incidents.reported_by')}:
                      <User className="h-4 w-4" />
                    </span>
                    <span className="text-sm text-blue-900 font-semibold">
                      {incident.reporter?.name || t('incidents.unknown')}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700 font-medium flex items-center gap-2" dir="rtl">
                      {t('incidents.status')}:
                      <FileCheck className="h-4 w-4" />
                    </span>
                    <Badge variant="outline" className="bg-gradient-to-l from-blue-100 to-blue-200 text-blue-800 border-blue-300 px-3 py-1 text-xs font-medium">
                      {incident.status}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700 font-medium flex items-center gap-2" dir="rtl">
                      {t('incidents.confirmation_status')}:
                      <Shield className="h-4 w-4" />
                    </span>
                    <div className="text-right">
                      <Badge 
                        variant={incident.is_confirmed ? "default" : "outline"} 
                        className={`px-3 py-1 text-xs font-medium ${
                          incident.is_confirmed 
                            ? 'bg-green-100 text-green-800 border-green-300' 
                            : 'bg-yellow-100 text-yellow-800 border-yellow-300'
                        }`}
                      >
                        {incident.is_confirmed ? (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            {t('incidents.confirmed')}
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            {t('incidents.unconfirmed')}
                          </div>
                        )}
                      </Badge>
                      {incident.is_confirmed && incident.confirmer && (
                        <div className="text-xs text-blue-600 mt-1">
                          {t('incidents.confirmed_by')}: {incident.confirmer.name}
                        </div>
                      )}
                      {incident.is_confirmed && incident.confirmed_at && (
                        <div className="text-xs text-blue-600">
                          {t('incidents.confirmed_at')}: {format(new Date(incident.confirmed_at), 'PPP')}
                        </div>
                      )}
                    </div>
                  </div>

                  {incident.confirmation_notes && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-blue-700 font-medium flex items-center gap-2" dir="rtl">
                        {t('incidents.confirmation_notes')}:
                        <FileText className="h-4 w-4" />
                      </span>
                      <div className="text-right max-w-xs">
                        <div className="text-sm text-blue-900 bg-blue-50 p-2 rounded-lg border border-blue-200">
                          {incident.confirmation_notes}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          {canEdit && (
            <Button asChild className="bg-gradient-to-l from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg rounded-xl px-6 py-3 font-semibold transition-all duration-300 hover:scale-105">
              <Link href={route('incidents.edit', incident.id)}>
                <Edit className="mr-2 h-4 w-4" />
                {t('common.edit')}
              </Link>
            </Button>
          )}

          {canDelete && (
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="shadow-lg rounded-xl px-6 py-3 font-semibold transition-all duration-300 hover:scale-105">
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t('common.delete')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl">{t('incidents.delete_title')}</AlertDialogTitle>
                  <AlertDialogDescription className="mt-2">
                    {t('incidents.delete_description')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-6">
                  <AlertDialogCancel className="shadow-sm">{t('common.cancel')}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground shadow-sm">
                    {t('common.delete')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {canConfirm && !incident.is_confirmed && (
            <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button className="bg-gradient-to-l from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg rounded-xl px-6 py-3 font-semibold transition-all duration-300 hover:scale-105">
                  <Shield className="mr-2 h-4 w-4" />
                  {t('incidents.confirm')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl">{t('incidents.confirm_title')}</AlertDialogTitle>
                  <AlertDialogDescription className="mt-2">
                    {t('incidents.confirm_description')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="mt-4">
                  <Label htmlFor="confirmation_notes" className="text-sm font-medium">
                    {t('incidents.confirmation_notes')} ({t('common.optional')})
                  </Label>
                  <Textarea
                    id="confirmation_notes"
                    value={confirmationNotes}
                    onChange={(e) => setConfirmationNotes(e.target.value)}
                    placeholder={t('incidents.confirmation_notes_placeholder')}
                    className="mt-2"
                    rows={3}
                  />
                </div>
                <AlertDialogFooter className="mt-6">
                  <AlertDialogCancel className="shadow-sm">{t('common.cancel')}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleConfirm} className="bg-green-600 text-white shadow-sm">
                    {t('incidents.confirm')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {canConfirm && incident.is_confirmed && (
            <Button 
              onClick={handleUnconfirm}
              variant="outline" 
              className="border-yellow-300 text-yellow-700 hover:bg-yellow-50 shadow-lg rounded-xl px-6 py-3 font-semibold transition-all duration-300 hover:scale-105"
            >
              <Shield className="mr-2 h-4 w-4" />
              {t('incidents.unconfirm')}
            </Button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">{t('incidents.delete_title')}</AlertDialogTitle>
            <AlertDialogDescription className="mt-2">
              {t('incidents.delete_description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel className="shadow-sm">{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground shadow-sm">
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
