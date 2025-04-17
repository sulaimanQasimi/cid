import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { ArrowLeft, Edit, Eye, MapPin, Users, Calendar, User, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface IncidentData {
  id: number;
  title: string;
  incident_date: string;
  severity: string;
  status: string;
  category?: {
    id: number;
    name: string;
    color: string;
  };
}

interface DistrictData {
  id: number;
  name: string;
  code: string;
  description: string | null;
  province_id: number;
  status: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  creator?: {
    id: number;
    name: string;
  };
  province?: {
    id: number;
    name: string;
    code: string;
  };
}

interface ShowProps {
  district: DistrictData;
  incidents: IncidentData[];
}

export default function Show({ district, incidents }: ShowProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
    },
    {
      title: 'Districts',
      href: route('districts.index'),
    },
    {
      title: district.name,
      href: route('districts.show', district.id),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`District - ${district.name}`} />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <PageHeader
          title={district.name}
          description={`District Code: ${district.code}`}
          actions={
            <div className="flex space-x-2">
              <Button variant="outline" asChild>
                <Link href={route('districts.index')}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Link>
              </Button>
              <Button asChild>
                <Link href={route('districts.edit', district.id)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
            </div>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>District Details</CardTitle>
              <CardDescription>
                Detailed information about this district
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-2 border-b pb-4">
                <Badge variant="outline" className="flex items-center">
                  <MapPin className="mr-1 h-3 w-3" />
                  Province: {district.province?.name || 'N/A'}
                </Badge>

                <Badge
                  variant={district.status === 'active' ? 'default' : 'secondary'}
                  className="flex items-center"
                >
                  {district.status}
                </Badge>
              </div>

              {district.description && (
                <div>
                  <h3 className="text-lg font-semibold">Description</h3>
                  <div className="whitespace-pre-wrap mt-2 text-muted-foreground">
                    {district.description}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>District Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Created By</div>
                <div className="flex items-center mt-1">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  {district.creator?.name || 'Unknown'}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-muted-foreground">Created At</div>
                <div className="flex items-center mt-1">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  {format(new Date(district.created_at), 'PPP')}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-muted-foreground">Last Updated</div>
                <div className="flex items-center mt-1">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  {format(new Date(district.updated_at), 'PPP p')}
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full" asChild>
                  <Link href={route('provinces.show', district.province?.id)}>
                    <MapPin className="mr-2 h-4 w-4" />
                    View Province
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Incidents</CardTitle>
              <CardDescription>
                Recent incidents in this district
              </CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link href={route('incidents.create', { district_id: district.id })}>
                <AlertCircle className="mr-2 h-4 w-4" />
                Add Incident
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {incidents.length === 0 ? (
              <div className="py-4 text-center text-muted-foreground">
                No incidents found for this district
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {incidents.map((incident) => (
                  <Card key={incident.id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-0">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">
                          <Link
                            href={route('incidents.show', incident.id)}
                            className="hover:underline text-primary"
                          >
                            {incident.title}
                          </Link>
                        </CardTitle>
                        {incident.category && (
                          <Badge style={{ backgroundColor: incident.category.color }}>
                            {incident.category.name}
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-xs mt-1">
                        {format(new Date(incident.incident_date), 'PPP')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <div className="flex justify-between items-center">
                        <Badge variant={
                          incident.severity === 'high' ? 'destructive' :
                          incident.severity === 'medium' ? 'default' : 'outline'
                        }>
                          {incident.severity}
                        </Badge>

                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                        >
                          <Link href={route('incidents.show', incident.id)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {incidents.length > 0 && (
              <div className="flex justify-center mt-6">
                <Button variant="outline" asChild>
                  <Link href={route('incidents.index', { district_id: district.id })}>
                    View All Incidents
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
