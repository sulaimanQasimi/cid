import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/pagination';
import { PageHeader } from '@/components/page-header';
import { Plus, Pencil, Trash2 } from 'lucide-react';
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
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <PageHeader
          title={t('incident_categories.page_title')}
          description={t('incident_categories.page_description')}
          actions={
            <Button asChild>
              <Link href={route('incident-categories.create')}>
                <Plus className="mr-2 h-4 w-4" />
                {t('incident_categories.new_category')}
              </Link>
            </Button>
          }
        />

        <Card>
          <CardHeader>
            <CardTitle>{t('incident_categories.all_categories')}</CardTitle>
            <CardDescription>
              {t('incident_categories.list_description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium">{t('incident_categories.table.name')}</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">{t('incident_categories.table.code')}</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">{t('incident_categories.table.color')}</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">{t('incident_categories.table.severity')}</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">{t('incident_categories.table.incidents')}</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">{t('incident_categories.table.status')}</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {categories.data.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="h-12 px-4 text-center align-middle">{t('incident_categories.no_categories')}</td>
                    </tr>
                  ) : (
                    categories.data.map((category) => (
                      <tr
                        key={category.id}
                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                      >
                        <td className="p-4 align-middle">
                          <div className="font-medium">{category.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {category.description && category.description.length > 0
                              ? category.description
                              : "-"}
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          {category.code || '-'}
                        </td>
                        <td className="p-4 align-middle">
                          {category.color && (
                            <div className="flex items-center space-x-2">
                              <div
                                className="h-4 w-4 rounded-full"
                                style={{ backgroundColor: category.color }}
                              />
                              <span>{category.color}</span>
                            </div>
                          )}
                        </td>
                        <td className="p-4 align-middle">
                          <Badge
                            variant={
                              category.severity_level > 4 ? 'destructive' :
                              category.severity_level > 2 ? 'default' : 'outline'
                            }
                          >
                            Level {category.severity_level}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle">
                          {category.incidents_count}
                        </td>
                        <td className="p-4 align-middle">
                          <Badge variant={category.status === 'active' ? 'default' : 'secondary'}>
                            {category.status}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                            >
                              <Link href={route('incident-categories.edit', category.id)}>
                                <Pencil className="h-4 w-4 mr-1" />
                                Edit
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
                                  size="sm"
                                  onClick={() => setCategoryToDelete(category.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
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

            <div className="mt-6">
              <Pagination links={categories.links} />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
