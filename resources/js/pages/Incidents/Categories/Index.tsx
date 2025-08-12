import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/pagination';
import { PageHeader } from '@/components/page-header';
import { Plus, Pencil, Trash2, Search, ArrowUpDown, FilterX, ChevronRight, ChevronLeft, Eye, BarChart3, Shield, Users, Building2, Calendar, FileText, AlertTriangle, TrendingUp, ChevronDown } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define breadcrumb navigation
const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Incident Categories',
    href: route('incident-categories.index'),
  },
];

interface CategoriesProps {
  categories: {
    data: Array<{
      id: number;
      name: string;
      code: string | null;
      description: string | null;
      color: string | null;
      severity_level: number;
      status: string;
      incidents_count: number;
    }>;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
  };
}

export default function Index({ categories }: CategoriesProps) {
  const { t } = useTranslation();
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleDelete = () => {
    if (categoryToDelete) {
      try {
        const routeUrl = route('incident-categories.destroy', categoryToDelete);

        // Using setTimeout to avoid version errors
        setTimeout(() => {
          router.delete(routeUrl);
        }, 0);
      } catch (error) {
        console.error('Error deleting category:', error);
        setCategoryToDelete(null);
      }
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('incident_categories.page_title')} />

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
                <h2 className="text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl tracking-tight">{t('incident_categories.page_title')}</h2>
                <p className="text-white/90 flex items-center gap-3 text-xl font-medium">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <FileText className="h-6 w-6" />
                  </div>
                  {t('incident_categories.page_description')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button asChild size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 group/btn">
                <Link href={route('incident-categories.create')} className="flex items-center gap-3">
                  <div className="p-1 bg-white/20 rounded-lg group-hover/btn:scale-110 transition-transform duration-300">
                    <Plus className="h-5 w-5" />
                  </div>
                  {t('incident_categories.new_category')}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filters Card */}
        <Card className="shadow-2xl bg-gradient-to-bl from-white to-blue-50/30 border-0 rounded-3xl overflow-hidden">
          <CardHeader className="py-4 bg-gradient-to-l from-blue-500 to-blue-600 text-white cursor-pointer" onClick={() => setIsFiltersOpen(!isFiltersOpen)}>
            <CardTitle className="text-lg font-semibold flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm shadow-lg">
                  <Search className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-bold">{t('incident_categories.search_filters')}</div>
                  <div className="text-blue-100 text-xs font-medium">Find and filter incident categories</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 rounded-xl"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Reset filters logic here
                  }}
                >
                  <FilterX className="h-4 w-4 mr-1" />
                  Reset
                </Button>
                <div className={`transition-transform duration-300 ${isFiltersOpen ? 'rotate-180' : ''}`}>
                  <ChevronDown className="h-5 w-5" />
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          
          <div className={`transition-all duration-300 overflow-hidden ${isFiltersOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search Bar */}
                <div className="md:col-span-2">
                  <div className="relative">
                    <div className="relative">
                      <Input
                        placeholder={t('incident_categories.search_placeholder')}
                        className="w-full h-11 pl-20 pr-4 text-base border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gradient-to-l from-blue-50 to-white rounded-xl shadow-lg"
                      />
                      <Button className="absolute left-1 top-1/2 -translate-y-1/2 h-9 px-4 bg-gradient-to-l from-blue-500 to-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm">
                        Search
                      </Button>
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
                    </div>
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <Select>
                    <SelectTrigger className="h-11 shadow-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gradient-to-l from-blue-50 to-white rounded-xl text-sm">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('incident_categories.filters.all_statuses')}</SelectItem>
                      <SelectItem value="active">{t('incident_categories.form.status.active')}</SelectItem>
                      <SelectItem value="inactive">{t('incident_categories.form.status.inactive')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort Options */}
                <div>
                  <Select>
                    <SelectTrigger className="h-11 shadow-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gradient-to-l from-blue-50 to-white rounded-xl text-sm">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">{t('incident_categories.sort.name')}</SelectItem>
                      <SelectItem value="severity">{t('incident_categories.sort.severity')}</SelectItem>
                      <SelectItem value="incidents">{t('incident_categories.sort.incidents')}</SelectItem>
                      <SelectItem value="created_at">{t('incident_categories.sort.created_at')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Results Table */}
        <div className="mt-8">
          <Card className="shadow-2xl overflow-hidden bg-gradient-to-bl from-white to-blue-50/30 border-0 rounded-3xl">
            <CardHeader className="bg-gradient-to-l from-blue-500 to-blue-600 text-white py-6">
              <CardTitle className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{t('incident_categories.table.title')}</div>
                  <div className="text-blue-100 text-sm font-medium">Incident categories overview</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-hidden rounded-b-3xl">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="bg-gradient-to-l from-blue-100 to-blue-200 border-0">
                      <th className="h-12 px-6 text-left align-middle font-bold text-blue-800 text-lg">{t('incident_categories.table.name')}</th>
                      <th className="h-12 px-6 text-left align-middle font-bold text-blue-800 text-lg">{t('incident_categories.table.code')}</th>
                      <th className="h-12 px-6 text-left align-middle font-bold text-blue-800 text-lg">{t('incident_categories.table.color')}</th>
                      <th className="h-12 px-6 text-left align-middle font-bold text-blue-800 text-lg">{t('incident_categories.table.severity')}</th>
                      <th className="h-12 px-6 text-left align-middle font-bold text-blue-800 text-lg">{t('incident_categories.table.incidents')}</th>
                      <th className="h-12 px-6 text-left align-middle font-bold text-blue-800 text-lg">{t('incident_categories.table.status')}</th>
                      <th className="h-12 px-6 text-left align-middle font-bold text-blue-800 text-lg">{t('common.actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {categories.data.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="h-32 text-center align-middle">
                          <div className="flex flex-col items-center gap-4 text-blue-600">
                            <div className="p-4 bg-blue-100 rounded-full">
                              <AlertTriangle className="h-16 w-16 text-blue-400" />
                            </div>
                            <p className="text-xl font-bold">{t('incident_categories.no_categories')}</p>
                            <p className="text-blue-500">No incident categories found</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      categories.data.map((category) => (
                        <tr
                          key={category.id}
                          className="border-b border-blue-100 transition-colors hover:bg-blue-50/50 data-[state=selected]:bg-muted"
                        >
                          <td className="p-6 align-middle">
                            <div className="font-bold text-blue-900 text-lg">{category.name}</div>
                            <div className="text-xs text-blue-600 mt-1">
                              {category.description && category.description.length > 0
                                ? category.description
                                : "-"}
                            </div>
                          </td>
                          <td className="p-6 align-middle text-blue-800 font-medium">
                            {category.code || '-'}
                          </td>
                          <td className="p-6 align-middle">
                            {category.color && (
                              <div className="flex items-center space-x-2">
                                <div
                                  className="h-6 w-6 rounded-full border-2 border-blue-200"
                                  style={{ backgroundColor: category.color }}
                                />
                                <span className="text-blue-800 font-medium">{category.color}</span>
                              </div>
                            )}
                          </td>
                          <td className="p-6 align-middle">
                            <Badge
                              variant={
                                category.severity_level > 4 ? 'destructive' :
                                category.severity_level > 2 ? 'default' : 'outline'
                              }
                              className="bg-gradient-to-l from-blue-100 to-blue-200 text-blue-800 border-blue-300 px-4 py-2 rounded-xl font-semibold"
                            >
                              Level {category.severity_level}
                            </Badge>
                          </td>
                          <td className="p-6 align-middle">
                            <Badge variant="outline" className="bg-gradient-to-l from-blue-100 to-blue-200 text-blue-800 border-blue-300 px-4 py-2 rounded-xl font-semibold">
                              {category.incidents_count}
                            </Badge>
                          </td>
                          <td className="p-6 align-middle">
                            <Badge 
                              variant={category.status === 'active' ? 'default' : 'secondary'}
                              className="bg-gradient-to-l from-blue-100 to-blue-200 text-blue-800 border-blue-300 px-4 py-2 rounded-xl font-semibold"
                            >
                              {category.status}
                            </Badge>
                          </td>
                          <td className="p-6 align-middle">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                title={t('incident_categories.actions.edit')}
                                className="h-10 w-10 rounded-xl hover:bg-green-100 text-green-600 hover:text-green-700 transition-all duration-300 hover:scale-110"
                              >
                                <Link href={route('incident-categories.edit', category.id)}>
                                  <Pencil className="h-5 w-5" />
                                </Link>
                              </Button>

                              <AlertDialog
                                open={categoryToDelete === category.id}
                                onOpenChange={(open) => {
                                  if (!open) setCategoryToDelete(null);
                                }}
                              >
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setCategoryToDelete(category.id)}
                                    title={t('incident_categories.actions.delete')}
                                    className="h-10 w-10 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-100 transition-all duration-300 hover:scale-110"
                                  >
                                    <Trash2 className="h-5 w-5" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>{t('incident_categories.delete_title')}</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {t('incident_categories.delete_description')}
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
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modern Pagination */}
        {categories.links && categories.links.length > 0 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-3 bg-gradient-to-l from-blue-50 to-white p-4 rounded-3xl shadow-2xl border border-blue-200">
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 shadow-lg border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400 rounded-xl transition-all duration-300 hover:scale-110 disabled:opacity-50"
              >
                <ChevronRight className="h-5 w-5" />
                <ChevronRight className="h-5 w-5 -mr-1" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 shadow-lg border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400 rounded-xl transition-all duration-300 hover:scale-110 disabled:opacity-50"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
              <div className="px-6 py-3 bg-gradient-to-l from-blue-100 to-blue-200 text-blue-800 rounded-2xl font-bold text-lg shadow-lg">
                Page 1 of 1
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 shadow-lg border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400 rounded-xl transition-all duration-300 hover:scale-110 disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 shadow-lg border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400 rounded-xl transition-all duration-300 hover:scale-110 disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5" />
                <ChevronLeft className="h-5 w-5 -mr-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
