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

  // Group stat items by category for the dropdown filter
  const categoriesForFilter = statCategories.map(category => ({
    id: category.id,
    label: category.label,
    color: category.color
  }));

  // Filter stat items by category if one is selected
  const filteredStatItems = selectedCategory
    ? statItems.filter(item => item.category.id === selectedCategory)
    : statItems;

  // Handle stat input change
  function handleStatChange(itemId: number, value: string) {
    setStatsData(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId] || { notes: null }, value }
    }));
  }

  // Handle stat notes change
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
                <CardDescription>
                  Record statistical information related to this report
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
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

                <TreeViewStatSelector
                  items={filteredStatItems}
                  statsData={statsData}
                  onValueChange={handleStatChange}
                  onNotesChange={handleNotesChange}
                />
              </CardContent>
            </Card>

            <CardFooter className="bg-background flex p-6 justify-end space-x-2">
              <Button variant="outline" asChild>
                <Link href={route('incident-reports.index')}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={processing}>
                {processing ? 'Submitting...' : 'Create Report'}
              </Button>
            </CardFooter>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
