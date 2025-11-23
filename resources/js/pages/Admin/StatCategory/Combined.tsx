import React, { useState, useMemo, useRef } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { Plus, Edit, Trash, Database, Loader2, ChevronDown, ChevronRight, Layers, FileText } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
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
import { cn } from '@/lib/utils';
import 'devextreme/dist/css/dx.light.css';
import { TreeList, Column, Editing, Selection, FilterRow, HeaderFilter, SearchPanel, ColumnChooser } from 'devextreme-react/tree-list';

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

interface ItemData {
  id: number;
  stat_category_id: number;
  name: string;
  label: string;
  color: string | null;
  status: string;
  order: number;
  parent_id: number | null;
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
  parent?: {
    id: number;
    name: string;
    label: string;
  };
  children?: ItemData[];
}

interface CombinedProps {
  categories: CategoryData[];
  items: ItemData[];
}

// Helper function to add items recursively to TreeList data
function addItemsToTreeList(items: ItemData[], data: any[], defaultParentId: string | number) {
  items.forEach(item => {
    // Determine parent_id: if item has no parent, use defaultParentId (category or parent item), otherwise use item's parent_id
    const itemParentId = item.parent_id === null ? defaultParentId : item.parent_id;
    
    data.push({
      id: item.id,
      stat_category_id: item.stat_category_id,
      name: item.name,
      label: item.label,
      color: item.color,
      status: item.status,
      order: item.order,
      parent_id: itemParentId,
      type: 'item',
      category: item.category,
      parent: item.parent,
      creator: item.creator,
      created_at: item.created_at,
      updated_at: item.updated_at,
    });
    
    // Recursively add children - children should reference their parent item's ID
    if (item.children && item.children.length > 0) {
      addItemsToTreeList(item.children, data, item.id);
    }
  });
}

export default function Combined({ categories, items }: CombinedProps) {
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
  ];

  // State for category operations
  const [isCategoryCreateOpen, setIsCategoryCreateOpen] = useState(false);
  const [isCategoryEditOpen, setIsCategoryEditOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryData | null>(null);
  const [isCategoryDeleteDialogOpen, setIsCategoryDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryData | null>(null);
  const [isCategoryDeleting, setIsCategoryDeleting] = useState(false);

  // State for item operations
  const [isItemCreateOpen, setIsItemCreateOpen] = useState(false);
  const [isItemEditOpen, setIsItemEditOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<ItemData | null>(null);
  const [isItemDeleteDialogOpen, setIsItemDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ItemData | null>(null);
  const [isItemDeleting, setIsItemDeleting] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  // Category form
  const categoryForm = useForm({
    name: '',
    label: '',
    color: '#4f46e5',
    status: 'active',
  });

  // Item form
  const itemForm = useForm({
    stat_category_id: '',
    parent_id: 'null',
    name: '',
    label: '',
    color: '',
    status: 'active',
    order: 0,
  });

  // Organize items by category and into tree structure
  const itemsByCategory = useMemo(() => {
    const grouped: { [key: number]: ItemData[] } = {};
    items.forEach(item => {
      if (!grouped[item.stat_category_id]) {
        grouped[item.stat_category_id] = [];
      }
      grouped[item.stat_category_id].push(item);
    });

    const result: { [key: number]: ItemData[] } = {};
    Object.keys(grouped).forEach(catId => {
      const categoryItems = grouped[parseInt(catId)];
      const itemMap = new Map<number, ItemData>();
      const rootItems: ItemData[] = [];

      categoryItems.forEach(item => {
        const itemWithChildren = { ...item, children: [] };
        itemMap.set(item.id, itemWithChildren);
      });

      categoryItems.forEach(item => {
        const currentItem = itemMap.get(item.id);
        if (item.parent_id === null) {
          rootItems.push(currentItem!);
        } else {
          const parent = itemMap.get(item.parent_id);
          if (parent) {
            parent.children = parent.children || [];
            parent.children.push(currentItem!);
          }
        }
      });

      result[parseInt(catId)] = rootItems;
    });
    return result;
  }, [items]);

  // Prepare data for TreeList - combine categories and items
  const treeListData = useMemo(() => {
    const data: any[] = [];
    
    categories.forEach(category => {
      const categoryItems = itemsByCategory[category.id] || [];
      const categoryNodeId = `category-${category.id}`;
      
      // Add category as root node
      const categoryNode = {
        id: categoryNodeId,
        stat_category_id: category.id,
        name: category.name,
        label: category.label,
        color: category.color,
        status: category.status,
        order: 0,
        parent_id: null,
        type: 'category',
        category: category,
        creator: category.creator,
        created_at: category.created_at,
        updated_at: category.updated_at,
      };
      
      data.push(categoryNode);
      
      // Add items as children of category
      if (categoryItems.length > 0) {
        addItemsToTreeList(categoryItems, data, categoryNodeId);
      }
    });
    
    return data;
  }, [categories, itemsByCategory]);

  // Category handlers
  function handleCategoryCreate() {
    setIsCategoryCreateOpen(true);
    categoryForm.reset();
  }

  function handleCategoryEdit(category: CategoryData) {
    setCategoryToEdit(category);
    categoryForm.setData({
      name: category.name,
      label: category.label,
      color: category.color,
      status: category.status,
    });
    setIsCategoryEditOpen(true);
  }

  function handleCategorySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (categoryToEdit) {
      categoryForm.put(route('stat-categories.update', categoryToEdit.id), {
        onSuccess: () => {
          setIsCategoryEditOpen(false);
          setCategoryToEdit(null);
          toast.success(t('stat_categories.update_success'));
        },
        onError: () => {
          toast.error(t('stat_categories.update_error'));
        },
      });
    } else {
      categoryForm.post(route('stat-categories.store'), {
        onSuccess: () => {
          setIsCategoryCreateOpen(false);
          categoryForm.reset();
          toast.success(t('stat_categories.create_success'));
        },
        onError: () => {
          toast.error(t('stat_categories.create_error'));
        },
      });
    }
  }

  function confirmCategoryDelete(category: CategoryData) {
    setCategoryToDelete(category);
    setIsCategoryDeleteDialogOpen(true);
  }

  function handleCategoryDelete() {
    if (!categoryToDelete) return;

    setIsCategoryDeleting(true);
    router.delete(route('stat-categories.destroy', categoryToDelete.id), {
      preserveScroll: true,
      onSuccess: () => {
        setIsCategoryDeleteDialogOpen(false);
        setIsCategoryDeleting(false);
        toast.success(t('stat_categories.delete_success'));
      },
      onError: () => {
        setIsCategoryDeleting(false);
        toast.error(t('stat_categories.delete_error'));
      },
    });
  }

  // Item handlers
  function handleItemCreate(categoryId?: number) {
    setIsItemCreateOpen(true);
    itemForm.reset();
    if (categoryId) {
      itemForm.setData('stat_category_id', categoryId.toString());
      setSelectedCategoryId(categoryId);
    } else {
      setSelectedCategoryId(null);
    }
  }

  function handleItemEdit(item: ItemData) {
    setItemToEdit(item);
    itemForm.setData({
      stat_category_id: item.stat_category_id.toString(),
      parent_id: item.parent_id ? item.parent_id.toString() : 'null',
      name: item.name,
      label: item.label,
      color: item.color || '',
      status: item.status,
      order: item.order,
    });
    setIsItemEditOpen(true);
  }

  function handleItemSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (itemToEdit) {
      itemForm.put(route('stat-category-items.update', itemToEdit.id), {
        onSuccess: () => {
          setIsItemEditOpen(false);
          setItemToEdit(null);
          toast.success(t('stat_category_items.update_success'));
        },
        onError: () => {
          toast.error(t('stat_category_items.update_error'));
        },
      });
    } else {
      itemForm.post(route('stat-category-items.store'), {
        onSuccess: () => {
          setIsItemCreateOpen(false);
          itemForm.reset();
          toast.success(t('stat_category_items.create_success'));
        },
        onError: () => {
          toast.error(t('stat_category_items.create_error'));
        },
      });
    }
  }

  function confirmItemDelete(item: ItemData) {
    setItemToDelete(item);
    setIsItemDeleteDialogOpen(true);
  }

  function handleItemDelete() {
    if (!itemToDelete) return;

    setIsItemDeleting(true);
    router.delete(route('stat-category-items.destroy', itemToDelete.id), {
      preserveScroll: true,
      onSuccess: () => {
        setIsItemDeleteDialogOpen(false);
        setIsItemDeleting(false);
        toast.success(t('stat_category_items.delete_success'));
      },
      onError: () => {
        setIsItemDeleting(false);
        toast.error(t('stat_category_items.delete_error'));
      },
    });
  }

  // Handle TreeList row double-click - open modal
  const onRowDblClick = (e: any) => {
    const data = e.data;
    if (data.type === 'category') {
      const category = categories.find(c => c.id === data.stat_category_id);
      if (category) {
        handleCategoryEdit(category);
      }
    } else if (data.type === 'item') {
      const item = items.find(i => i.id === data.id);
      if (item) {
        handleItemEdit(item);
      }
    }
  };


  // Get parent items for the selected category
  const availableParentItems = useMemo(() => {
    if (!itemForm.data.stat_category_id) return [];
    const categoryId = parseInt(itemForm.data.stat_category_id);
    return items
      .filter(item => 
        item.stat_category_id === categoryId && 
        item.id !== itemToEdit?.id &&
        item.status === 'active'
      )
      .map(item => ({ id: item.id, name: item.name, label: item.label }));
  }, [itemForm.data.stat_category_id, items, itemToEdit]);

  const selectedCategory = categories.find(c => c.id.toString() === itemForm.data.stat_category_id);

  // TreeList ref for programmatic control
  const treeListRef = useRef<any>(null);

  // Handle TreeList initialization
  const onTreeListInitialized = (e: any) => {
    treeListRef.current = e.component;
  };

  // Handle TreeList row click - expand/collapse
  const onRowClick = (e: any) => {
    const data = e.data;
    const key = data.id;
    
    if (treeListRef.current) {
      try {
        const expandedRowKeys = treeListRef.current.option('expandedRowKeys') || [];
        const isExpanded = expandedRowKeys.includes(key);
        
        if (isExpanded) {
          treeListRef.current.collapseRow(key);
        } else {
          treeListRef.current.expandRow(key);
        }
      } catch (error) {
        console.error('Error toggling row expansion:', error);
        // Fallback: just expand if we can't determine state
        try {
          treeListRef.current.expandRow(key);
        } catch (err) {
          console.error('Error expanding row:', err);
        }
      }
    }
  };

  // Custom cell template for actions
  const ActionCell = (cellData: any) => {
    const data = cellData.data;
    
    return (
      <div className="flex items-center gap-2">
        {data.type === 'category' ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                const category = categories.find(c => c.id === data.stat_category_id);
                if (category) handleCategoryEdit(category);
              }}
              className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/30"
              title={t('common.edit')}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                const category = categories.find(c => c.id === data.stat_category_id);
                if (category) confirmCategoryDelete(category);
              }}
              className="h-8 w-8 p-0 text-destructive hover:bg-red-100 dark:hover:bg-red-900/30"
              title={t('common.delete')}
            >
              <Trash className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleItemCreate(data.stat_category_id);
              }}
              className="h-8 w-8 p-0 hover:bg-green-100 dark:hover:bg-green-900/30"
              title={t('stat_category_items.add_item')}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                const item = items.find(i => i.id === data.id);
                if (item) handleItemEdit(item);
              }}
              className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/30"
              title={t('common.edit')}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                const item = items.find(i => i.id === data.id);
                if (item) confirmItemDelete(item);
              }}
              className="h-8 w-8 p-0 text-destructive hover:bg-red-100 dark:hover:bg-red-900/30"
              title={t('common.delete')}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    );
  };

  // Custom cell template for color
  const ColorCell = (cellData: any) => {
    const color = cellData.value || cellData.data.category?.color || '#e2e8f0';
    return (
      <div className="flex items-center gap-2">
        <div
          className="h-5 w-5 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"
          style={{ backgroundColor: color }}
        ></div>
        <span className="text-sm font-mono">{color}</span>
      </div>
    );
  };

  // Custom cell template for status
  const StatusCell = (cellData: any) => {
    const status = cellData.value;
    return (
      <Badge
        variant={status === 'active' ? 'default' : 'secondary'}
        className={cn(
          "px-3 py-1",
          status === 'active'
            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
        )}
      >
        {status === 'active' ? t('common.active') : t('common.inactive')}
      </Badge>
    );
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('stat_categories.page_title')} />
      <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
        {/* Modern Header with Glassmorphism */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-blue-600 via-indigo-600 to-purple-600 p-8 lg:p-12 text-white shadow-2xl mb-2 group">
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
                <h2 className="text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl tracking-tight">
                  {t('stat_categories.page_title')}
                </h2>
                <div className="text-white/90 flex items-center gap-3 text-xl font-medium">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <FileText className="h-6 w-6" />
                  </div>
                  {t('stat_categories.page_description')}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
              <Button 
                onClick={handleCategoryCreate}
                size="lg" 
                className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 group/btn"
              >
                <div className="p-1 bg-white/20 rounded-lg group-hover/btn:scale-110 transition-transform duration-300 mr-2">
                  <Plus className="h-5 w-5" />
                </div>
                {t('stat_categories.add_category')}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleItemCreate()}
                size="lg" 
                className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 shadow-2xl rounded-2xl px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 group/btn"
              >
                <div className="p-1 bg-white/20 rounded-lg group-hover/btn:scale-110 transition-transform duration-300 mr-2">
                  <Layers className="h-5 w-5" />
                </div>
                {t('stat_category_items.add_item')}
              </Button>
            </div>
          </div>
        </div>

        {/* DevExtreme TreeList */}
        <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <TreeList
            dataSource={treeListData}
            keyExpr="id"
            parentIdExpr="parent_id"
            showBorders={true}
            showRowLines={true}
            columnAutoWidth={true}
            wordWrapEnabled={true}
            onInitialized={onTreeListInitialized}
            onRowClick={onRowClick}
            onRowDblClick={onRowDblClick}
            rootValue={null}
            autoExpandAll={false}
            allowColumnReordering={true}
            allowColumnResizing={true}
            expandNodesOnFiltering={true}
          >
                <Selection mode="single" />
                <FilterRow visible={true} />
                <HeaderFilter visible={true} />
                <SearchPanel visible={true} width={300} placeholder={t('common.search')} />
                <ColumnChooser enabled={true} />
                
                <Column
                  dataField="label"
                  caption={t('stat_categories.label')}
                  width={300}
                  cellRender={(cellData: any) => {
                    const data = cellData.data;
                    return (
                      <div className="flex items-center gap-3 py-2">
                        {data.type === 'category' ? (
                          <Database className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <Layers className="h-4 w-4 text-purple-600 dark:text-purple-400 ml-4" />
                        )}
                        <span className="font-semibold">{data.label}</span>
                      </div>
                    );
                  }}
                />
                
                <Column
                  dataField="name"
                  caption={t('stat_categories.name')}
                  width={200}
                  cellRender={(cellData: any) => {
                    return (
                      <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {cellData.value}
                      </span>
                    );
                  }}
                />
                
                <Column
                  dataField="color"
                  caption={t('stat_categories.color')}
                  width={150}
                  cellRender={ColorCell}
                />
                
                <Column
                  dataField="status"
                  caption={t('stat_categories.status')}
                  width={120}
                  cellRender={StatusCell}
                />
                
                <Column
                  dataField="creator"
                  caption={t('stat_categories.created_by')}
                  width={150}
                  cellRender={(cellData: any) => {
                    return cellData.data.creator?.name || 'N/A';
                  }}
                />
                
                <Column
                  caption={t('common.actions')}
                  width={150}
                  cellRender={ActionCell}
                  allowSorting={false}
                  allowFiltering={false}
                />
              </TreeList>
        </div>

        {/* Category Create/Edit Dialog */}
        <Dialog open={isCategoryCreateOpen || isCategoryEditOpen} onOpenChange={(open) => {
          if (!open) {
            setIsCategoryCreateOpen(false);
            setIsCategoryEditOpen(false);
            setCategoryToEdit(null);
            categoryForm.reset();
          }
        }}>
          <DialogContent className="max-w-2xl bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-900 dark:to-gray-800 border-0 shadow-2xl">
            <DialogHeader>
              <DialogTitle>
                {categoryToEdit ? t('stat_categories.edit_category') : t('stat_categories.create_category')}
              </DialogTitle>
              <DialogDescription>
                {categoryToEdit ? t('stat_categories.edit_description') : t('stat_categories.create_description')}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCategorySubmit}>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category-name">{t('stat_categories.name')}</Label>
                    <Input
                      id="category-name"
                      value={categoryForm.data.name}
                      onChange={(e) => categoryForm.setData('name', e.target.value)}
                      placeholder="system_name"
                    />
                    <p className="text-xs text-muted-foreground">
                      {t('stat_categories.name_help')}
                    </p>
                    <InputError message={categoryForm.errors.name} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category-label">{t('stat_categories.label')}</Label>
                    <Input
                      id="category-label"
                      value={categoryForm.data.label}
                      onChange={(e) => categoryForm.setData('label', e.target.value)}
                      placeholder={t('stat_categories.label_placeholder')}
                    />
                    <InputError message={categoryForm.errors.label} />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category-color">{t('stat_categories.color')}</Label>
                    <div className="flex items-center space-x-2">
                      <div
                        className="h-8 w-8 rounded-full border"
                        style={{ backgroundColor: categoryForm.data.color }}
                      ></div>
                      <Input
                        id="category-color"
                        value={categoryForm.data.color}
                        onChange={(e) => categoryForm.setData('color', e.target.value)}
                        placeholder="#4f46e5"
                      />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`h-6 w-6 rounded-full border ${
                            categoryForm.data.color === color ? 'ring-2 ring-primary ring-offset-2' : ''
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => categoryForm.setData('color', color)}
                        />
                      ))}
                    </div>
                    <InputError message={categoryForm.errors.color} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category-status">{t('stat_categories.status')}</Label>
                    <Select
                      value={categoryForm.data.status}
                      onValueChange={(value) => categoryForm.setData('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('stat_categories.select_status')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">{t('common.active')}</SelectItem>
                        <SelectItem value="inactive">{t('common.inactive')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <InputError message={categoryForm.errors.status} />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCategoryCreateOpen(false);
                    setIsCategoryEditOpen(false);
                    setCategoryToEdit(null);
                    categoryForm.reset();
                  }}
                >
                  {t('common.cancel')}
                </Button>
                <Button type="submit" disabled={categoryForm.processing}>
                  {categoryForm.processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('common.saving')}
                    </>
                  ) : (
                    categoryToEdit ? t('common.save') : t('common.create')
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Item Create/Edit Dialog */}
        <Dialog open={isItemCreateOpen || isItemEditOpen} onOpenChange={(open) => {
          if (!open) {
            setIsItemCreateOpen(false);
            setIsItemEditOpen(false);
            setItemToEdit(null);
            itemForm.reset();
          }
        }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-purple-50/50 dark:from-gray-900 dark:to-gray-800 border-0 shadow-2xl">
            <DialogHeader>
              <DialogTitle>
                {itemToEdit ? t('stat_category_items.edit_item') : t('stat_category_items.create_item')}
              </DialogTitle>
              <DialogDescription>
                {itemToEdit ? t('stat_category_items.edit_description') : t('stat_category_items.create_description')}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleItemSubmit}>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="item-category">{t('stat_category_items.category')}</Label>
                    <Select
                      value={itemForm.data.stat_category_id}
                      onValueChange={(value) => {
                        itemForm.setData('stat_category_id', value);
                        itemForm.setData('parent_id', 'null');
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('stat_category_items.select_category')} />
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
                    <InputError message={itemForm.errors.stat_category_id} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="item-parent">{t('stat_category_items.parent')}</Label>
                    <Select
                      value={itemForm.data.parent_id}
                      onValueChange={(value) => itemForm.setData('parent_id', value)}
                      disabled={!itemForm.data.stat_category_id || availableParentItems.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('stat_category_items.no_parent')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="null">{t('stat_category_items.no_parent')}</SelectItem>
                        {availableParentItems.map((item) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <InputError message={itemForm.errors.parent_id} />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="item-name">{t('stat_category_items.name')}</Label>
                    <Input
                      id="item-name"
                      value={itemForm.data.name}
                      onChange={(e) => itemForm.setData('name', e.target.value)}
                      placeholder={t('stat_category_items.name_placeholder')}
                    />
                    <InputError message={itemForm.errors.name} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="item-label">{t('stat_category_items.label')}</Label>
                    <Input
                      id="item-label"
                      value={itemForm.data.label}
                      onChange={(e) => itemForm.setData('label', e.target.value)}
                      placeholder={t('stat_category_items.label_placeholder')}
                    />
                    <InputError message={itemForm.errors.label} />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="item-color">{t('stat_category_items.color')}</Label>
                    <div className="flex items-center space-x-2">
                      <div
                        className="h-8 w-8 rounded-full border"
                        style={{ backgroundColor: itemForm.data.color || selectedCategory?.color || '#e2e8f0' }}
                      ></div>
                      <Input
                        id="item-color"
                        value={itemForm.data.color}
                        onChange={(e) => itemForm.setData('color', e.target.value)}
                        placeholder={selectedCategory?.color || t('stat_category_items.color_placeholder')}
                      />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`h-6 w-6 rounded-full border ${
                            itemForm.data.color === color ? 'ring-2 ring-primary ring-offset-2' : ''
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => itemForm.setData('color', color)}
                        />
                      ))}
                      {selectedCategory && (
                        <button
                          type="button"
                          className={`h-6 w-6 rounded-full border ${
                            itemForm.data.color === '' ? 'ring-2 ring-primary ring-offset-2' : ''
                          }`}
                          style={{ backgroundColor: selectedCategory.color }}
                          onClick={() => itemForm.setData('color', '')}
                          title={t('stat_category_items.use_category_default')}
                        />
                      )}
                    </div>
                    <InputError message={itemForm.errors.color} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="item-status">{t('stat_category_items.status')}</Label>
                      <Select
                        value={itemForm.data.status}
                        onValueChange={(value) => itemForm.setData('status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('stat_category_items.select_status')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">{t('common.active')}</SelectItem>
                          <SelectItem value="inactive">{t('common.inactive')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <InputError message={itemForm.errors.status} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="item-order">{t('stat_category_items.order')}</Label>
                      <Input
                        id="item-order"
                        type="number"
                        min="0"
                        value={itemForm.data.order.toString()}
                        onChange={(e) => itemForm.setData('order', parseInt(e.target.value) || 0)}
                        placeholder="0"
                      />
                      <InputError message={itemForm.errors.order} />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsItemCreateOpen(false);
                    setIsItemEditOpen(false);
                    setItemToEdit(null);
                    itemForm.reset();
                  }}
                >
                  {t('common.cancel')}
                </Button>
                <Button type="submit" disabled={itemForm.processing}>
                  {itemForm.processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('common.saving')}
                    </>
                  ) : (
                    itemToEdit ? t('common.save') : t('common.create')
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Category Delete Dialog */}
        <AlertDialog open={isCategoryDeleteDialogOpen} onOpenChange={setIsCategoryDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('stat_categories.delete_confirm_title')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('stat_categories.delete_confirm_description', { name: categoryToDelete?.name || '' })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isCategoryDeleting}>
                {t('common.cancel')}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCategoryDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={isCategoryDeleting}
              >
                {isCategoryDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('common.deleting')}
                  </>
                ) : (
                  t('common.delete')
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Item Delete Dialog */}
        <AlertDialog open={isItemDeleteDialogOpen} onOpenChange={setIsItemDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('stat_category_items.delete_confirm_title')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('stat_category_items.delete_confirm_description', { name: itemToDelete?.name || '' })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isItemDeleting}>
                {t('common.cancel')}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleItemDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={isItemDeleting}
              >
                {isItemDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('common.deleting')}
                  </>
                ) : (
                  t('common.delete')
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}
