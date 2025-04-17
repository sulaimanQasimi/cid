import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader } from '@/components/page-header';
import { ArrowLeft, PlusCircle, Save, Trash2 } from 'lucide-react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import InputError from '@/components/input-error';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import axios from 'axios';

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

interface EditProps {
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
  };
  statItems: StatCategoryItem[];
  reportStats: ReportStat[];
  statCategories: StatCategory[];
}

export default function Edit({ report, statItems, reportStats, statCategories }: EditProps) {
  const { data, setData, put, processing, errors } = useForm({
    report_number: report.report_number,
    report_date: report.report_date,
    security_level: report.security_level,
    details: report.details,
    action_taken: report.action_taken || '',
    recommendation: report.recommendation || '',
    report_status: report.report_status,
    source: report.source || '',
  });

  const [statsData, setStatsData] = useState<{
    [key: number]: { value: string; notes: string | null };
  }>(() => {
    const initialStats: { [key: number]: { value: string; notes: string | null } } = {};
    reportStats.forEach((stat) => {
      initialStats[stat.stat_category_item_id] = {
        value: stat.integer_value !== null ? String(stat.integer_value) : (stat.string_value || ''),
        notes: stat.notes
      };
    });
    return initialStats;
  });

  const [statToDelete, setStatToDelete] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
    },
    {
      title: 'Incident Reports',
      href: route('incident-reports.index'),
    },
    {
      title: report.report_number,
      href: route('incident-reports.show', report.id),
    },
    {
      title: 'Edit',
      href: route('incident-reports.edit', report.id),
    },
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Prepare stats data for batch update
    const statsForUpdate = Object.entries(statsData).map(([itemId, { value, notes }]) => ({
      stat_category_item_id: parseInt(itemId),
      value,
      notes
    }));

    // First update the report itself
    put(route('incident-reports.update', report.id), {
      onSuccess: () => {
        // After successful update of the report, update the stats
        if (statsForUpdate.length > 0) {
          // Use axios to submit the stats data
          axios.post(route('incident-reports.stats.batch-update', report.id), {
            stats: statsForUpdate
          }, {
            headers: {
              'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }).then(() => {
            // Redirect to show page after both updates are complete
            window.location.href = route('incident-reports.show', report.id);
          }).catch((error: unknown) => {
            console.error('Error updating stats:', error);
          });
        } else {
          // If no stats to update, just redirect to show page
          window.location.href = route('incident-reports.show', report.id);
        }
      }
    });
  }

  // Group stat items by category
  const itemsByCategory: { [key: string]: StatCategoryItem[] } = {};
  statItems.forEach(item => {
    if (!itemsByCategory[item.category.label]) {
      itemsByCategory[item.category.label] = [];
    }
    itemsByCategory[item.category.label].push(item);
  });

  // Get filtered categories and items
  const filteredCategories = selectedCategory
    ? Object.entries(itemsByCategory).filter(([_, items]) =>
        items.some(item => item.category.id === selectedCategory))
    : Object.entries(itemsByCategory);

  // Handle stat input change - even empty values should be tracked to potentially clear existing values
  function handleStatChange(itemId: number, value: string) {
    setStatsData(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId] || { notes: null }, value }
    }));
  }

  // Handle stat notes change - always track the notes even if empty
  function handleNotesChange(itemId: number, notes: string) {
    setStatsData(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId] || { value: '' }, notes: notes || null }
    }));
  }

  // Delete a stat
  function deleteStat(itemId: number) {
    // Find the existing stat
    const existingStat = reportStats.find(s => s.stat_category_item_id === itemId);

    if (existingStat) {
      // If it exists in the database, send a delete request
      fetch(route('report-stats.destroy', existingStat.id), {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        }
      }).then(() => {
        // Remove from local state
        const newStatsData = { ...statsData };
        delete newStatsData[itemId];
        setStatsData(newStatsData);
      });
    } else {
      // If it's only in local state, just remove it
      const newStatsData = { ...statsData };
      delete newStatsData[itemId];
      setStatsData(newStatsData);
    }

    setStatToDelete(null);
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Report - ${report.report_number}`} />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <PageHeader
          title={`Edit Report ${report.report_number}`}
          description="Modify this incident report"
          actions={
            <div className="flex space-x-2">
              <Button variant="outline" asChild>
                <Link href={route('incident-reports.show', report.id)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Report
                </Link>
              </Button>
            </div>
          }
        />

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Report Information</CardTitle>
                <CardDescription>Update the basic report information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-3">
                  <Label htmlFor="report_number">Report Number</Label>
                  <Input
                    id="report_number"
                    value={data.report_number}
                    onChange={(e) => setData('report_number', e.target.value)}
                    disabled
                  />
                  <InputError message={errors.report_number} />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="report_date">Report Date</Label>
                  <Input
                    id="report_date"
                    type="date"
                    value={data.report_date}
                    onChange={(e) => setData('report_date', e.target.value)}
                    required
                  />
                  <InputError message={errors.report_date} />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="security_level">Security Level</Label>
                  <Select
                    value={data.security_level}
                    onValueChange={(value) => setData('security_level', value)}
                  >
                    <SelectTrigger id="security_level">
                      <SelectValue placeholder="Select security level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="restricted">Restricted</SelectItem>
                      <SelectItem value="classified">Classified</SelectItem>
                    </SelectContent>
                  </Select>
                  <InputError message={errors.security_level} />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="report_status">Status</Label>
                  <Select
                    value={data.report_status}
                    onValueChange={(value) => setData('report_status', value)}
                  >
                    <SelectTrigger id="report_status">
                      <SelectValue placeholder="Select report status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="reviewed">Reviewed</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                    </SelectContent>
                  </Select>
                  <InputError message={errors.report_status} />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="source">Source (Optional)</Label>
                  <Input
                    id="source"
                    value={data.source}
                    onChange={(e) => setData('source', e.target.value)}
                    placeholder="Information source"
                  />
                  <InputError message={errors.source} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Report Details</CardTitle>
                <CardDescription>Update the detailed information for this report</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-3">
                  <Label htmlFor="details">Details</Label>
                  <Textarea
                    id="details"
                    rows={5}
                    value={data.details}
                    onChange={(e) => setData('details', e.target.value)}
                    placeholder="Enter the report details..."
                    required
                  />
                  <InputError message={errors.details} />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="action_taken">Action Taken (Optional)</Label>
                  <Textarea
                    id="action_taken"
                    rows={3}
                    value={data.action_taken}
                    onChange={(e) => setData('action_taken', e.target.value)}
                    placeholder="Describe any actions taken..."
                  />
                  <InputError message={errors.action_taken} />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="recommendation">Recommendation (Optional)</Label>
                  <Textarea
                    id="recommendation"
                    rows={3}
                    value={data.recommendation}
                    onChange={(e) => setData('recommendation', e.target.value)}
                    placeholder="Enter any recommendations..."
                  />
                  <InputError message={errors.recommendation} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistical Data</CardTitle>
                <CardDescription>Add or edit statistical information for this report</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(itemsByCategory).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <p className="text-muted-foreground">No statistical categories available.</p>
                    <Button variant="outline" asChild className="mt-4">
                      <Link href={route('stat-categories.index')}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Manage Statistical Categories
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {statCategories.length > 1 && (
                      <div className="mb-4">
                        <Label htmlFor="category-filter">Filter by Category</Label>
                        <Select
                          onValueChange={(value) => setSelectedCategory(value === "all" ? null : parseInt(value))}
                          defaultValue="all"
                        >
                          <SelectTrigger id="category-filter">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {statCategories.map((category) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                <div className="flex items-center">
                                  <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: category.color }}></div>
                                  {category.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {filteredCategories.map(([categoryLabel, items]) => (
                      <div key={categoryLabel} className="space-y-3">
                        <h3 className="text-lg font-medium">
                          <div className="flex items-center">
                            <div
                              className="h-3 w-3 rounded-full mr-2"
                              style={{ backgroundColor: items[0].category.color }}
                            ></div>
                            {categoryLabel}
                          </div>
                        </h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Item</TableHead>
                              <TableHead>Value</TableHead>
                              <TableHead>Notes</TableHead>
                              <TableHead className="w-[100px]">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {items.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color || item.category.color }}></div>
                                    <span>{item.label}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Input
                                    value={statsData[item.id]?.value || ''}
                                    onChange={(e) => handleStatChange(item.id, e.target.value)}
                                    placeholder="Value"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    value={statsData[item.id]?.notes || ''}
                                    onChange={(e) => handleNotesChange(item.id, e.target.value)}
                                    placeholder="Optional notes"
                                  />
                                </TableCell>
                                <TableCell>
                                  {statsData[item.id] && (
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => setStatToDelete(item.id)}
                                        >
                                          <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Remove Statistical Data</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to remove this statistical data? This action cannot be undone.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            onClick={() => deleteStat(item.id)}
                                          >
                                            Remove
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  )}
                                </TableCell>
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

            <Card>
              <CardFooter className="flex justify-end space-x-2 pt-6">
                <Button
                  variant="outline"
                  asChild
                  type="button"
                >
                  <Link href={route('incident-reports.show', report.id)}>
                    Cancel
                  </Link>
                </Button>
                <Button type="submit" disabled={processing}>
                  <Save className="mr-2 h-4 w-4" />
                  {processing ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
