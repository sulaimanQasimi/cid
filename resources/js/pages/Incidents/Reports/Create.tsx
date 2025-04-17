import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader } from '@/components/page-header';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import InputError from '@/components/input-error';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState } from 'react';

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

interface CreateProps {
  securityLevels: string[];
  statItems: StatCategoryItem[];
  statCategories: StatCategory[];
}

type ReportFormData = {
  report_date: string;
  security_level: string;
  details: string;
  report_number?: string;
  action_taken?: string;
  recommendation?: string;
  report_status: string;
  source?: string;
  stats?: Array<{
    stat_category_item_id: number;
    value: string;
    notes?: string;
  }>;
};

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
    title: 'Create',
    href: route('incident-reports.create'),
  },
];

export default function Create({ securityLevels, statItems, statCategories }: CreateProps) {
  const { data, setData, post, processing, errors } = useForm<ReportFormData>({
    report_date: new Date().toISOString().split('T')[0],
    security_level: 'normal',
    details: '',
    report_status: 'submitted',
    report_number: '',
    action_taken: '',
    recommendation: '',
    source: '',
  });

  // State for managing statistical data
  const [statsData, setStatsData] = useState<{
    [key: number]: { value: string; notes: string | null };
  }>({});

  // Add state for category filter
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Prepare stats data for submission
    const stats = Object.entries(statsData)
      .filter(([_, { value }]) => value.trim() !== '')
      .map(([itemId, { value, notes }]) => ({
        stat_category_item_id: parseInt(itemId),
        value,
        notes: notes || undefined,
      }));

    // Add stats to form data
    if (stats.length > 0) {
      setData('stats', stats);
    }

    // Submit the form
    post(route('incident-reports.store'));
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

  // Handle stat input change
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

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Incident Report" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <PageHeader
          title="Create Incident Report"
          description="Add a new incident report to the system"
          actions={
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          }
        />

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Report Information</CardTitle>
                <CardDescription>Enter the basic report information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-3">
                  <Label htmlFor="report_number">Report Number (Optional)</Label>
                  <Input
                    id="report_number"
                    value={data.report_number}
                    onChange={(e) => setData('report_number', e.target.value)}
                    placeholder="Will be auto-generated if left empty"
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
                <CardDescription>Enter the detailed information for this report</CardDescription>
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

                <input type="hidden" name="report_status" value="submitted" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistical Data</CardTitle>
                <CardDescription>Add statistical information for this report</CardDescription>
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
                  onClick={() => window.history.back()}
                  type="button"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                  {processing ? 'Creating...' : 'Create Report'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
