import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface StatCategoryItem {
  id: number;
  name: string;
  label: string;
  color: string | null;
  parent_id: number | null;
  children?: StatCategoryItem[];
}

interface TreeViewStatSelectorProps {
  items: StatCategoryItem[];
  statsData: {
    [key: number]: { value: string; notes: string | null };
  };
  onValueChange: (itemId: number, value: string) => void;
  onNotesChange: (itemId: number, notes: string) => void;
}

// Helper function to organize items into a tree structure
function organizeItemsIntoTree(items: StatCategoryItem[]): StatCategoryItem[] {
  const itemMap = new Map<number, StatCategoryItem>();
  const rootItems: StatCategoryItem[] = [];

  // First, create a map of all items
  items.forEach(item => {
    const itemWithChildren = { ...item, children: [] };
    itemMap.set(item.id, itemWithChildren);
  });

  // Now, organize items into a tree structure
  items.forEach(item => {
    const currentItem = itemMap.get(item.id);

    if (item.parent_id === null) {
      // This is a root item
      rootItems.push(currentItem!);
    } else {
      // This is a child item, add it to its parent's children array
      const parent = itemMap.get(item.parent_id);
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(currentItem!);
      }
    }
  });

  return rootItems;
}

// Component for rendering a single tree node
const TreeNode = ({
  item,
  level = 0,
  statsData,
  onValueChange,
  onNotesChange
}: {
  item: StatCategoryItem;
  level?: number;
  statsData: { [key: number]: { value: string; notes: string | null } };
  onValueChange: (itemId: number, value: string) => void;
  onNotesChange: (itemId: number, notes: string) => void;
}) => {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = item.children && item.children.length > 0;
  const isLeaf = !hasChildren;
  const paddingLeft = `${level * 20}px`;

  return (
    <div className="w-full">
      <div
        className={cn(
          "flex items-center py-2 border-b border-gray-100 dark:border-gray-800",
          hasChildren ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50" : ""
        )}
        style={{ paddingLeft }}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {hasChildren ? (
          <div className="mr-1">
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </div>
        ) : (
          <div className="w-5"></div> // Spacer for leaf nodes
        )}

        <div
          className="h-3 w-3 rounded-full mr-2 flex-shrink-0"
          style={{ backgroundColor: item.color || '#e2e8f0' }}
        ></div>

        <div className="font-medium flex-grow">{item.label}</div>

        {isLeaf && (
          <div className="flex-shrink-0 ml-4 w-32">
            <Input
              value={statsData[item.id]?.value || ''}
              onChange={(e) => onValueChange(item.id, e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder="Value"
              className="text-right h-8 py-1"
            />
          </div>
        )}
      </div>

      {hasChildren && expanded && (
        <div className={`pl-${level + 1}`}>
          {item.children?.map(child => (
            <TreeNode
              key={child.id}
              item={child}
              level={level + 1}
              statsData={statsData}
              onValueChange={onValueChange}
              onNotesChange={onNotesChange}
            />
          ))}
        </div>
      )}

      {isLeaf && statsData[item.id]?.value && (
        <div style={{ paddingLeft: `${paddingLeft + 20}px` }} className="py-2 border-b border-gray-100 dark:border-gray-800">
          <Textarea
            value={statsData[item.id]?.notes || ''}
            onChange={(e) => onNotesChange(item.id, e.target.value)}
            placeholder="Notes (optional)"
            className="text-sm mt-1"
            rows={2}
          />
        </div>
      )}
    </div>
  );
};

export default function TreeViewStatSelector({
  items,
  statsData,
  onValueChange,
  onNotesChange
}: TreeViewStatSelectorProps) {
  const treeItems = organizeItemsIntoTree(items);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-t-md">
        <Label className="font-semibold">Category Items</Label>
        <Label className="font-semibold w-32 text-right">Value</Label>
      </div>

      <div className="border rounded-b-md border-gray-200 dark:border-gray-700">
        {treeItems.map(item => (
          <TreeNode
            key={item.id}
            item={item}
            statsData={statsData}
            onValueChange={onValueChange}
            onNotesChange={onNotesChange}
          />
        ))}
      </div>
    </div>
  );
}