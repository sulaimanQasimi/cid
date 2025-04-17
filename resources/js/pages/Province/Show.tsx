import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/pagination';
import { PageHeader } from '@/components/page-header';
import { ArrowLeft, Edit, Eye, MapPin, Users, Calendar, User, Clock } from 'lucide-react';
import { format } from 'date-fns';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useEffect, useRef } from 'react';

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
}

interface ProvinceData {
  id: number;
  name: string;
  code: string;
  description: string | null;
  governor: string | null;
  capital: string | null;
  status: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  creator?: {
    id: number;
    name: string;
  };
}

interface ShowProps {
  province: ProvinceData;
  districts: {
    data: DistrictData[];
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
  };
}

export default function Show({ province, districts }: ShowProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only load if we have the province code and the element exists
    if (province.code && mapRef.current) {
      // Create inline SVG map (simplified approach without external libraries)
      const provinceCode = province.code;
      const mapContainer = mapRef.current;

      // Set up map container
      mapContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full">
          <div class="text-center p-4">
            <svg width="300" height="200" viewBox="0 0 800 600" class="max-w-full">
              <path
                d="M400,150 L450,200 L500,180 L550,200 L600,250 L550,300 L500,350 L450,400 L400,450 L350,400 L300,350 L250,300 L200,250 L250,200 L300,180 L350,200 Z"
                fill="#5D87FF"
                stroke="#FFFFFF"
                stroke-width="2"
              />
              <text x="400" y="300" text-anchor="middle" fill="#FFFFFF" font-weight="bold">${province.name}</text>
            </svg>
          </div>
          <div class="text-sm text-center">
            <p>Province: ${province.name}</p>
            <p>Code: ${provinceCode}</p>
          </div>
        </div>
      `;

      // Add map loading script tag for future enhancement
      const script = document.createElement('script');
      script.textContent = `
        // This is a placeholder for future integration with a mapping library
        // When implementing with amCharts or a similar library, this can be expanded
        console.log('Map initialized for province: ${provinceCode}');
      `;
      mapContainer.appendChild(script);
    }
  }, [province.code, province.name]);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
    },
    {
      title: 'Provinces',
      href: route('provinces.index'),
    },
    {
      title: province.name,
      href: route('provinces.show', province.id),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Province - ${province.name}`} />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <PageHeader
          title={province.name}
          description={`Province Code: ${province.code}`}
          actions={
            <div className="flex space-x-2">
              <Button variant="outline" asChild>
                <Link href={route('provinces.index')}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Link>
              </Button>
              <Button asChild>
                <Link href={route('provinces.edit', province.id)}>
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
              <CardTitle>Province Details</CardTitle>
              <CardDescription>
                Detailed information about this province
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-2 border-b pb-4">
                {province.capital && (
                  <Badge variant="outline" className="flex items-center">
                    <MapPin className="mr-1 h-3 w-3" />
                    Capital: {province.capital}
                  </Badge>
                )}
                {province.governor && (
                  <Badge variant="outline" className="flex items-center">
                    <User className="mr-1 h-3 w-3" />
                    Governor: {province.governor}
                  </Badge>
                )}
                <Badge
                  variant={province.status === 'active' ? 'default' : 'secondary'}
                  className="flex items-center"
                >
                  {province.status}
                </Badge>
              </div>

              {/* Province Map */}
              <div>
                <h3 className="text-lg font-semibold">Province Map</h3>
                <div
                  ref={mapRef}
                  className="mt-2 h-[300px] w-full bg-muted/30 rounded-md overflow-hidden shadow-sm border"
                ></div>
                <p className="text-xs text-muted-foreground mt-2">
                  Map visualization based on province code: {province.code}
                </p>
              </div>

              {province.description && (
                <div>
                  <h3 className="text-lg font-semibold">Description</h3>
                  <div className="whitespace-pre-wrap mt-2 text-muted-foreground">
                    {province.description}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Province Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Created By</div>
                <div className="flex items-center mt-1">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  {province.creator?.name || 'Unknown'}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-muted-foreground">Created At</div>
                <div className="flex items-center mt-1">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  {format(new Date(province.created_at), 'PPP')}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-muted-foreground">Last Updated</div>
                <div className="flex items-center mt-1">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  {format(new Date(province.updated_at), 'PPP p')}
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full" asChild>
                  <Link href={route('districts.create', { province_id: province.id })}>
                    <MapPin className="mr-2 h-4 w-4" />
                    Add District
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Districts</CardTitle>
              <CardDescription>
                Districts in this province
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Code</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Created By</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {districts.data.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="h-12 px-4 text-center align-middle">
                        No districts found
                      </td>
                    </tr>
                  ) : (
                    districts.data.map((district) => (
                      <tr
                        key={district.id}
                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                      >
                        <td className="p-4 align-middle">
                          <Link
                            href={route('districts.show', district.id)}
                            className="font-medium text-primary hover:underline flex items-center"
                          >
                            <MapPin className="h-4 w-4 mr-2" />
                            {district.name}
                          </Link>
                        </td>
                        <td className="p-4 align-middle">
                          {district.code}
                        </td>
                        <td className="p-4 align-middle">
                          <Badge variant={district.status === 'active' ? 'default' : 'secondary'}>
                            {district.status}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle">
                          {district.creator?.name || 'N/A'}
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                            >
                              <Link href={route('districts.show', district.id)}>
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Link>
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                            >
                              <Link href={route('districts.edit', district.id)}>
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Link>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <Pagination links={districts.links} />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
