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
    };
    district: {
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    router.delete(route('incidents.destroy', incident.id));
  };

  return (
    <>
      <Head title={`Incident - ${incident.title}`} />
      <PageHeader
        title="Incident Details"
        description="View detailed information about this incident"
        actions={
          <div className="flex space-x-2">
            <Button variant="outline" asChild>
              <Link href={route('incidents.index')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Incidents
              </Link>
            </Button>
            <Button asChild>
              <Link href={route('incidents.edit', incident.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Incident</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this incident? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
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
                    incident.label {/* Placeholder label as requested */}
                  </CardDescription>
                </div>
                <Badge variant={incident.status === 'resolved' ? 'success' :
                               incident.status === 'investigating' ? 'warning' :
                               incident.status === 'closed' ? 'outline' : 'default'}>
                  {incident.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Description</h3>
                  <p className="mt-2 whitespace-pre-line text-muted-foreground">{incident.description}</p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium">Impact</h3>
                  <div className="mt-2 grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border p-3">
                      <div className="text-sm font-medium">Casualties</div>
                      <div className="mt-1 text-2xl font-bold">
                        {incident.casualties}
                      </div>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="text-sm font-medium">Injuries</div>
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
                <CardTitle>Associated Report</CardTitle>
                <CardDescription>
                  This incident is part of the following report
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
                      View full report details
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
              <CardTitle>Incident Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Calendar className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Date & Time</div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(incident.incident_date), 'PPP')}
                    {incident.incident_time && ` at ${incident.incident_time}`}
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Tag className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Category & Type</div>
                  <div className="text-sm text-muted-foreground">
                    <Badge
                      className="mr-2"
                      style={{ backgroundColor: incident.category?.color || '#888888' }}
                    >
                      {incident.category?.name || 'Unspecified'}
                    </Badge>
                    {incident.incident_type}
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Location</div>
                  <div className="text-sm text-muted-foreground">
                    {incident.location || 'Unspecified location'}<br />
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
                  <div className="font-medium">Reported By</div>
                  <div className="text-sm text-muted-foreground">
                    {incident.reporter?.name || 'Unknown'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
