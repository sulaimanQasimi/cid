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
import TreeViewStatSelector from '@/components/reports/TreeViewStatSelector';

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
  color: string | null;
  parent_id: number | null;
  children_count: number;
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

  // Filter stat items by category if one is selected
  const filteredStatItems = selectedCategory
    ? statItems.filter(item => item.category.id === selectedCategory)
    : statItems;

  // Group stat categories for the dropdown filter
  const categoriesForFilter = statCategories.map(category => ({
    id: category.id,
    label: category.label,
    color: category.color
  }));

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
                <CardDescription>
                  Record statistical information related to this report
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Category filter dropdown */}
                <div className="mb-6">
                  <Label htmlFor="category-filter">Filter by Category</Label>
                  <Select
                    value={selectedCategory?.toString() || 'all'}
                    onValueChange={(value) => setSelectedCategory(value !== 'all' ? parseInt(value) : null)}
                  >
                    <SelectTrigger id="category-filter">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categoriesForFilter.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          <div className="flex items-center">
                            <div
                              className="mr-2 h-3 w-3 rounded-full"
                              style={{ backgroundColor: category.color }}
                            ></div>
                            {category.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tree View Stat Selector */}
                <TreeViewStatSelector
                  items={filteredStatItems}
                  statsData={statsData}
                  onValueChange={handleStatChange}
                  onNotesChange={handleNotesChange}
                />
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
