import { Head, Link, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/pagination';
import { PageHeader } from '@/components/page-header';
import { Plus, Edit, Eye, Trash, MapPin, Loader2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
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
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

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
  };
}

interface ProvinceData {
  id: number;
  name: string;
}

interface IndexProps {
  districts: {
    data: DistrictData[];
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
  };
  provinces: ProvinceData[];
}

export default function Index({ districts, provinces }: IndexProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
    },
    {
      title: 'Districts',
      href: route('districts.index'),
    },
  ];

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [districtToDelete, setDistrictToDelete] = useState<DistrictData | null>(null);
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const { delete: destroy, processing } = useForm();

  function confirmDelete(district: DistrictData) {
    setDistrictToDelete(district);
    setIsDeleteDialogOpen(true);
  }

  function handleDelete() {
    if (!districtToDelete) return;

    setIsDeleting(true);

    router.delete(route('districts.destroy', districtToDelete.id), {
      preserveScroll: true,
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        setIsDeleting(false);
        toast.success(`District "${districtToDelete.name}" deleted successfully`);
      },
      onError: (errors) => {
        setIsDeleting(false);
        toast.error('Failed to delete district');
        console.error(errors);
      }
    });
  }

  const filteredDistricts = districts.data.filter(district => {
    const matchesSearch = searchTerm === '' ||
      district.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      district.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesProvince = selectedProvinceId === 'all' ||
      district.province_id.toString() === selectedProvinceId;

    return matchesSearch && matchesProvince;
  });

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Districts" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <PageHeader
          title="Districts"
          description="Manage districts in the system"
          actions={
            <Button asChild>
              <Link href={route('districts.create')}>
                <Plus className="mr-2 h-4 w-4" />
                Add District
              </Link>
            </Button>
          }
        />

        <Card>
          <CardHeader>
            <CardTitle>All Districts</CardTitle>
            <CardDescription>
              A list of all districts in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 mb-6 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search by name or code"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="province">Filter by Province</Label>
                <Select
                  value={selectedProvinceId}
                  onValueChange={setSelectedProvinceId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Provinces" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Provinces</SelectItem>
                    {provinces.map(province => (
                      <SelectItem key={province.id} value={province.id.toString()}>
                        {province.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Name
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Code
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Province
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Status
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Created By
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {filteredDistricts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="h-12 px-4 text-center align-middle">
                        No districts found
                      </td>
                    </tr>
                  ) : (
                    filteredDistricts.map((district) => (
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
                          {district.province ? (
                            <Link
                              href={route('provinces.show', district.province.id)}
                              className="hover:underline"
                            >
                              {district.province.name}
                            </Link>
                          ) : (
                            'N/A'
                          )}
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

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => confirmDelete(district)}
                            >
                              <Trash className="h-4 w-4 mr-1" />
                              Delete
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the district
              <span className="font-semibold"> {districtToDelete?.name}</span>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={processing || isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
