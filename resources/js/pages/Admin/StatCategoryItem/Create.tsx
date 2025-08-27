import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { ArrowLeft, Plus, Database, FileText, Tag, Palette, Settings, Layers } from 'lucide-react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { FormEventHandler, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslation } from '@/lib/i18n/translate';

// Color options
const colorOptions = [
  '#4f46e5', // Indigo
  '#3b82f6', // Blue
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#84cc16', // Lime
  '#eab308', // Yellow
  '#f97316', // Orange
  '#ef4444', // Red
  '#ec4899', // Pink
  '#8b5cf6', // Purple
  '#a3a3a3', // Gray
];

interface CategoryData {
  id: number;
  name: string;
  label: string;
  color: string;
}

interface ParentItemData {
  id: number;
  name: string;
  label: string;
}

interface CreateProps {
  categories: CategoryData[];
  preselected_category_id?: string;
  parentItems?: ParentItemData[];
}

export default function Create({ categories, preselected_category_id, parentItems = [] }: CreateProps) {
  const { t } = useTranslation();
  
  const { data, setData, post, processing, errors } = useForm({
    stat_category_id: preselected_category_id || '',
    parent_id: 'null',
    name: '',
    label: '',
    color: '',
    status: 'active',
    order: 0,
  });

  // Use a separate state for the checkbox
  const [redirectToCategory, setRedirectToCategory] = useState(false);

  // If a category is selected, find its color for reference
  const selectedCategory = categories.find(c => c.id.toString() === data.stat_category_id);

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setData({
      ...data,
      stat_category_id: value,
      parent_id: 'null',  // Reset parent_id when category changes
    });
  };

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
      href: data.stat_category_id
        ? route('stat-category-items.index', { category_id: data.stat_category_id })
        : route('stat-category-items.index'),
    },
    {
      title: t('stat_category_items.create.title'),
      href: route('stat-category-items.create'),
    },
  ];

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    const url = new URL(route('stat-category-items.store'));
    if (redirectToCategory) {
      url.searchParams.append('redirect_to_category', 'true');
    }

    post(url.toString());
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('stat_category_items.create.page_title')} />
      
      <div className="container px-0 py-6">
        {/* Modern Header with Glassmorphism */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-green-600 via-emerald-600 to-teal-600 p-8 lg:p-12 text-white shadow-2xl mb-8 group">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="absolute top-0 left-0 w-80 h-80 bg-white/10 rounded-full -translate-y-40 -translate-x-40 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 translate-x-32 blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full -translate-x-16 -translate-y-16 blur-xl group-hover:scale-150 transition-transform duration-500"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8">
            <div className="flex items-center gap-8">
              <div className="p-6 bg-white/20 backdrop-blur-md rounded-3xl border border-white/30 shadow-2xl group-hover:scale-105 transition-transform duration-300">
                <Plus className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl tracking-tight">{t('stat_category_items.create.title')}</h2>
                <div className="text-white/90 flex items-center gap-3 text-xl font-medium">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <FileText className="h-6 w-6" />
                  </div>
                  {t('stat_category_items.create.description')}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" asChild size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105">
                <Link href={data.stat_category_id
                  ? route('stat-category-items.index', { category_id: data.stat_category_id })
                  : route('stat-category-items.index')}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t('stat_category_items.create.back_to_list')}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <form onSubmit={submit}>
          <Card className="shadow-2xl bg-gradient-to-bl from-white to-green-50/30 border-0 rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-l from-green-500 to-green-600 text-white py-6">
              <CardTitle className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
                  <Settings className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{t('stat_category_items.create.form.title')}</div>
                  <div className="text-green-100 text-sm font-medium">{t('stat_category_items.create.form.description')}</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Database className="h-4 w-4 text-green-600" />
                      {t('stat_category_items.create.fields.category')}
                    </Label>
                    <Select
                      value={data.stat_category_id}
                      onValueChange={handleCategoryChange}
                    >
                      <SelectTrigger className="h-12 shadow-lg border-green-200 focus:border-green-500 focus:ring-green-500/20 bg-gradient-to-l from-green-50 to-white rounded-xl">
                        <SelectValue placeholder={t('stat_category_items.create.placeholders.select_category')} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
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
                    <InputError message={errors.stat_category_id} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="parent_id" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Layers className="h-4 w-4 text-green-600" />
                      {t('stat_category_items.create.fields.parent')}
                    </Label>
                    <Select
                      value={data.parent_id}
                      onValueChange={(value) => setData('parent_id', value)}
                      disabled={!data.stat_category_id || parentItems.length === 0}
                    >
                      <SelectTrigger className="h-12 shadow-lg border-green-200 focus:border-green-500 focus:ring-green-500/20 bg-gradient-to-l from-green-50 to-white rounded-xl">
                        <SelectValue placeholder={t('stat_category_items.create.placeholders.no_parent')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="null">{t('stat_category_items.create.placeholders.no_parent')}</SelectItem>
                        {parentItems.map((item) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">
                      {t('stat_category_items.create.fields.parent_help')}
                    </p>
                    <InputError message={errors.parent_id} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Tag className="h-4 w-4 text-green-600" />
                      {t('stat_category_items.create.fields.name')}
                    </Label>
                    <Input
                      id="name"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      placeholder={t('stat_category_items.create.placeholders.name')}
                      className="h-12 shadow-lg border-green-200 focus:border-green-500 focus:ring-green-500/20 bg-gradient-to-l from-green-50 to-white rounded-xl"
                    />
                    <p className="text-xs text-gray-500">
                      {t('stat_category_items.create.fields.name_help')}
                    </p>
                    <InputError message={errors.name} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="label" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-green-600" />
                      {t('stat_category_items.create.fields.label')}
                    </Label>
                    <Input
                      id="label"
                      value={data.label}
                      onChange={(e) => setData('label', e.target.value)}
                      placeholder={t('stat_category_items.create.placeholders.label')}
                      className="h-12 shadow-lg border-green-200 focus:border-green-500 focus:ring-green-500/20 bg-gradient-to-l from-green-50 to-white rounded-xl"
                    />
                    <p className="text-xs text-gray-500">
                      {t('stat_category_items.create.fields.label_help')}
                    </p>
                    <InputError message={errors.label} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="color" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Palette className="h-4 w-4 text-green-600" />
                      {t('stat_category_items.create.fields.color')}
                    </Label>
                    <div className="flex items-center space-x-2">
                      <div
                        className="h-10 w-10 rounded-full border-2 border-white shadow-lg"
                        style={{ backgroundColor: data.color || (selectedCategory?.color || '#e2e8f0') }}
                      ></div>
                      <Input
                        id="color"
                        value={data.color}
                        onChange={(e) => setData('color', e.target.value)}
                        placeholder={selectedCategory?.color || t('stat_category_items.create.placeholders.color_override')}
                        className="h-12 shadow-lg border-green-200 focus:border-green-500 focus:ring-green-500/20 bg-gradient-to-l from-green-50 to-white rounded-xl"
                      />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`h-8 w-8 rounded-full border-2 border-white shadow-lg transition-all duration-300 hover:scale-110 ${
                            data.color === color ? 'ring-2 ring-green-500 ring-offset-2' : ''
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setData('color', color)}
                        />
                      ))}
                      {selectedCategory && (
                        <button
                          type="button"
                          className={`h-8 w-8 rounded-full border-2 border-white shadow-lg transition-all duration-300 hover:scale-110 ${
                            data.color === '' ? 'ring-2 ring-green-500 ring-offset-2' : ''
                          }`}
                          style={{ backgroundColor: selectedCategory.color }}
                          onClick={() => setData('color', '')}
                          title={t('stat_category_items.create.fields.use_category_default')}
                        />
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {t('stat_category_items.create.fields.color_help')}
                    </p>
                    <InputError message={errors.color} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Settings className="h-4 w-4 text-green-600" />
                      {t('stat_category_items.create.fields.status')}
                    </Label>
                    <Select
                      value={data.status}
                      onValueChange={(value) => setData('status', value)}
                    >
                      <SelectTrigger className="h-12 shadow-lg border-green-200 focus:border-green-500 focus:ring-green-500/20 bg-gradient-to-l from-green-50 to-white rounded-xl">
                        <SelectValue placeholder={t('stat_category_items.create.placeholders.select_status')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">{t('stat_category_items.create.fields.status_active')}</SelectItem>
                        <SelectItem value="inactive">{t('stat_category_items.create.fields.status_inactive')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <InputError message={errors.status} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="order" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Tag className="h-4 w-4 text-green-600" />
                      {t('stat_category_items.create.fields.order')}
                    </Label>
                    <Input
                      id="order"
                      type="number"
                      min="0"
                      value={data.order.toString()}
                      onChange={(e) => setData('order', parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className="h-12 shadow-lg border-green-200 focus:border-green-500 focus:ring-green-500/20 bg-gradient-to-l from-green-50 to-white rounded-xl"
                    />
                    <p className="text-xs text-gray-500">
                      {t('stat_category_items.create.fields.order_help')}
                    </p>
                    <InputError message={errors.order} />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-4 border-t border-green-200">
                <Checkbox
                  id="redirect_to_category"
                  checked={redirectToCategory}
                  onCheckedChange={(value) => {
                    setRedirectToCategory(value === true);
                  }}
                  className="border-green-300 text-green-600 focus:ring-green-500"
                />
                <Label
                  htmlFor="redirect_to_category"
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t('stat_category_items.create.fields.redirect_to_category')}
                </Label>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-3 p-6 bg-gradient-to-l from-green-50 to-white border-t border-green-200">
              <Button variant="outline" asChild className="shadow-lg border-green-300 text-green-700 hover:bg-green-100 hover:border-green-400 rounded-xl transition-all duration-300 hover:scale-105">
                <Link href={data.stat_category_id
                  ? route('stat-category-items.index', { category_id: data.stat_category_id })
                  : route('stat-category-items.index')}
                >
                  {t('common.cancel')}
                </Link>
              </Button>
              <Button type="submit" disabled={processing} className="bg-gradient-to-l from-green-500 to-green-600 text-white shadow-lg rounded-xl px-8 py-3 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                {processing ? t('stat_category_items.create.saving') : t('stat_category_items.create.save')}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </AppLayout>
  );
}
