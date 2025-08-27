import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/pagination';
import { PageHeader } from '@/components/page-header';
import { Plus, Edit, Eye, Trash, Tag, Loader2, Search, ArrowUpDown, FilterX, ChevronDown, TrendingUp, FileText, AlertTriangle, Database } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
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
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

interface CategoryData {
  id: number;
  name: string;
  label: string;
}

interface ItemData {
  id: number;
  stat_category_id: number;
  name: string;
  label: string;
  color: string | null;
  status: string;
  order: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  creator?: {
    id: number;
    name: string;
  };
  category?: {
    id: number;
    name: string;
    label: string;
    color: string;
  };
}

interface IndexProps {
  items: {
    data: ItemData[];
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
  };
  categories: CategoryData[];
  filter: {
    category_id?: string;
  };
}

export default function Index({ items, categories, filter }: IndexProps) {
  const { t } = useTranslation();
  
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: t('common.dashboard'),
      href: '/dashboard',
    },
    {
      title: t('common.settings'),
      href: '#',
    },
    {
      title: t('stat_categories.page_title'),
      href: route('stat-categories.index'),
    },
    {
      title: t('stat_category_items.page_title'),
      href: route('stat-category-items.index'),
    },
  ];

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ItemData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(filter.category_id || 'all');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  function confirmDelete(item: ItemData) {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  }

  function handleDelete() {
    if (!itemToDelete) return;

    setIsDeleting(true);

    router.delete(route('stat-category-items.destroy', itemToDelete.id), {
      preserveScroll: true,
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        setIsDeleting(false);
        toast.success(`Item "${itemToDelete.name}" deleted successfully`);
      },
      onError: (errors) => {
        setIsDeleting(false);
        toast.error('Failed to delete item');
        console.error(errors);
      }
    });
  }

  function handleCategoryChange(value: string) {
    setSelectedCategoryId(value);
    if (value === 'all') {
      router.visit(route('stat-category-items.index'));
    } else {
      router.visit(route('stat-category-items.index', { category_id: value }));
    }
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Category Items" />
      
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
                <Database className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl tracking-tight">{t('stat_category_items.page_title')}</h2>
                <div className="text-white/90 flex items-center gap-3 text-xl font-medium">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <FileText className="h-6 w-6" />
                  </div>
                  {t('stat_category_items.page_description')}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button asChild size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 group/btn">
              <Link
                href={selectedCategoryId !== 'all'
                  ? route('stat-category-items.create', { category_id: selectedCategoryId })
                  : route('stat-category-items.create')}
                  className="flex items-center gap-3"
                >
                  <div className="p-1 bg-white/20 rounded-lg group-hover/btn:scale-110 transition-transform duration-300">
                    <Plus className="h-5 w-5" />
                  </div>
                  {t('stat_category_items.add_button')}
              </Link>
            </Button>
            </div>
          </div>
        </div>

        <Card className="shadow-2xl bg-gradient-to-bl from-white to-blue-50/30 border-0 rounded-3xl overflow-hidden">
          <CardHeader className="py-4 bg-gradient-to-l from-blue-500 to-blue-600 text-white cursor-pointer" onClick={() => setIsFiltersOpen(!isFiltersOpen)}>
            <CardTitle className="text-lg font-semibold flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm shadow-lg">
                  <Search className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-bold">{t('stat_category_items.search_filters')}</div>
                  <div className="text-blue-100 text-xs font-medium">{t('stat_category_items.search_description')}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 rounded-xl"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCategoryId('all');
                    router.visit(route('stat-category-items.index'));
                  }}
                >
                  <FilterX className="h-4 w-4 mr-1" />
                  {t('common.reset')}
                </Button>
                <div className={`transition-transform duration-300 ${isFiltersOpen ? 'rotate-180' : ''}`}>
                  <ChevronDown className="h-5 w-5" />
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          
          <div className={`transition-all duration-300 overflow-hidden ${isFiltersOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div className="md:col-span-2">
                  <Label htmlFor="filter-category" className="text-sm font-medium text-gray-700 mb-2 block">{t('stat_category_items.filter_by_category')}</Label>
              <Select
                value={selectedCategoryId}
                onValueChange={handleCategoryChange}
              >
                    <SelectTrigger className="h-11 shadow-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gradient-to-l from-blue-50 to-white rounded-xl text-sm">
                      <SelectValue placeholder={t('stat_category_items.all_categories')} />
                </SelectTrigger>
                <SelectContent>
                      <SelectItem value="all">{t('stat_category_items.all_categories')}</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

                {/* Quick Actions */}
                <div className="flex gap-2 items-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedCategoryId('all');
                      router.visit(route('stat-category-items.index'));
                    }}
                    className="h-11 px-3 shadow-lg border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400 rounded-xl transition-all duration-300 hover:scale-105 text-sm"
                  >
                    <FilterX className="h-4 w-4" />
                                          {t('common.clear_filters')}
                  </Button>
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
                  <div className="text-2xl font-bold">{t('stat_category_items.table.title')}</div>
                  <div className="text-blue-100 text-sm font-medium">{t('stat_category_items.table.description')}</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-hidden rounded-b-3xl">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-l from-blue-100 to-blue-200 border-0">
                      <TableHead className="text-blue-800 font-bold text-lg py-6 px-6">{t('stat_category_items.table.name')}</TableHead>
                      <TableHead className="text-blue-800 font-bold text-lg py-6 px-6">{t('stat_category_items.table.label')}</TableHead>
                      <TableHead className="text-blue-800 font-bold text-lg py-6 px-6">{t('stat_category_items.table.category')}</TableHead>
                      <TableHead className="text-blue-800 font-bold text-lg py-6 px-6">{t('stat_category_items.table.color')}</TableHead>
                      <TableHead className="text-blue-800 font-bold text-lg py-6 px-6">{t('stat_category_items.table.order')}</TableHead>
                      <TableHead className="text-blue-800 font-bold text-lg py-6 px-6">{t('stat_category_items.table.status')}</TableHead>
                      <TableHead className="text-blue-800 font-bold text-lg py-6 px-6 text-right">{t('stat_category_items.table.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                  {items.data.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-32 text-center">
                          <div className="flex flex-col items-center gap-4 text-blue-600">
                            <div className="p-4 bg-blue-100 rounded-full">
                              <AlertTriangle className="h-16 w-16 text-blue-400" />
                            </div>
                            <p className="text-xl font-bold">{t('stat_category_items.no_records')}</p>
                            <p className="text-blue-500">{t('stat_category_items.no_records_description')}</p>
                          </div>
                        </TableCell>
                      </TableRow>
                  ) : (
                    items.data.map((item) => (
                        <TableRow key={item.id} className="hover:bg-blue-50/50 transition-colors duration-300 border-b border-blue-100">
                          <TableCell className="font-bold text-blue-900 py-6 px-6 text-lg">
                          <Link
                            href={route('stat-category-items.show', item.id)}
                              className="flex items-center hover:text-blue-700 transition-colors duration-300"
                          >
                            <Tag className="h-4 w-4 mr-2" />
                            {item.name}
                          </Link>
                          </TableCell>
                          <TableCell className="text-blue-800 py-6 px-6">{item.label}</TableCell>
                          <TableCell className="py-6 px-6">
                          <Link
                            href={route('stat-categories.show', item.category?.id)}
                              className="hover:underline text-blue-700 font-medium"
                          >
                            {item.category?.label}
                          </Link>
                          </TableCell>
                          <TableCell className="py-6 px-6">
                          {item.color ? (
                            <div className="flex items-center space-x-2">
                              <div
                                  className="h-6 w-6 rounded-full border-2 border-white shadow-lg"
                                style={{ backgroundColor: item.color }}
                              ></div>
                                <span className="text-sm font-medium">{item.color}</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <div
                                  className="h-6 w-6 rounded-full border-2 border-white shadow-lg"
                                style={{ backgroundColor: item.category?.color }}
                              ></div>
                                <span className="text-sm text-blue-600 font-medium">
                                  {t('stat_category_items.category_default')}
                              </span>
                            </div>
                          )}
                          </TableCell>
                          <TableCell className="text-blue-800 py-6 px-6 font-medium">{item.order}</TableCell>
                          <TableCell className="py-6 px-6">
                            <Badge 
                              variant={item.status === 'active' ? 'default' : 'secondary'}
                              className="bg-gradient-to-l from-green-100 to-green-200 text-green-800 border-green-300 px-4 py-2 rounded-xl font-semibold"
                            >
                            {item.status}
                          </Badge>
                          </TableCell>
                          <TableCell className="py-6 px-6">
                            <div className="flex items-center gap-2 justify-end">
                            <Button
                              variant="ghost"
                                size="icon"
                              asChild
                                title={t('stat_category_items.actions.view')}
                                className="h-10 w-10 rounded-xl hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-all duration-300 hover:scale-110"
                            >
                              <Link href={route('stat-category-items.show', item.id)}>
                                  <Eye className="h-5 w-5" />
                              </Link>
                            </Button>

                            <Button
                              variant="ghost"
                                size="icon"
                              asChild
                                title={t('stat_category_items.actions.edit')}
                                className="h-10 w-10 rounded-xl hover:bg-green-100 text-green-600 hover:text-green-700 transition-all duration-300 hover:scale-110"
                            >
                              <Link href={route('stat-category-items.edit', item.id)}>
                                  <Edit className="h-5 w-5" />
                              </Link>
                            </Button>

                            <Button
                              variant="ghost"
                                size="icon"
                              onClick={() => confirmDelete(item)}
                                title={t('stat_category_items.actions.delete')}
                                className="h-10 w-10 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-100 transition-all duration-300 hover:scale-110"
                            >
                                <Trash className="h-5 w-5" />
                            </Button>
                          </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
            </div>

        {/* Pagination */}
        {items && items.links && items.links.length > 0 && (
          <div className="mt-8 flex justify-center">
            <div className="bg-gradient-to-l from-blue-50 to-white p-4 rounded-3xl shadow-2xl border border-blue-200">
              <Pagination links={items.links} />
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">{t('stat_category_items.delete_dialog.title')}</AlertDialogTitle>
            <AlertDialogDescription className="mt-2">
              {t('stat_category_items.delete_dialog.description', { name: itemToDelete?.name || '' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel disabled={isDeleting}>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground shadow-sm"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                t('common.delete')
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
