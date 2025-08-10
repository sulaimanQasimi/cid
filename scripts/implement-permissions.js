#!/usr/bin/env node

/**
 * Permission Implementation Script
 * 
 * This script helps implement permissions across all pages in the application.
 * It can:
 * 1. Add permission imports to pages
 * 2. Replace hardcoded permission checks with permission guards
 * 3. Generate permission-based navigation
 * 4. Create permission-aware components
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const PAGES_DIR = 'resources/js/pages';
const COMPONENTS_DIR = 'resources/js/components';

// Permission patterns to look for and replace
const PERMISSION_PATTERNS = [
  {
    pattern: /auth\.permissions\.includes\('([^']+)'\)/g,
    replacement: (match, permission) => {
      const [model, action] = permission.split('.');
      const guardMap = {
        'view': 'CanView',
        'view_any': 'CanViewAny', 
        'create': 'CanCreate',
        'update': 'CanUpdate',
        'delete': 'CanDelete',
        'restore': 'CanRestore',
        'force_delete': 'CanForceDelete',
        'confirm': 'CanConfirm'
      };
      const guard = guardMap[action];
      return guard ? `<${guard} model="${model}">` : match;
    }
  }
];

// Import statements to add
const PERMISSION_IMPORTS = [
  "import { usePermissions } from '@/hooks/use-permissions';",
  "import { CanCreate, CanView, CanUpdate, CanDelete, CanConfirm } from '@/components/ui/permission-guard';"
];

// Hook usage to add
const PERMISSION_HOOK = "const { canCreate, canView, canUpdate, canDelete, canConfirm } = usePermissions();";

/**
 * Add permission imports to a file
 */
function addPermissionImports(content) {
  const lines = content.split('\n');
  const importIndex = lines.findIndex(line => line.includes('import') && line.includes('@/lib/i18n/translate'));
  
  if (importIndex !== -1) {
    // Add permission imports after the translation import
    lines.splice(importIndex + 1, 0, ...PERMISSION_IMPORTS);
  }
  
  return lines.join('\n');
}

/**
 * Add permission hook to a component
 */
function addPermissionHook(content) {
  const lines = content.split('\n');
  const componentIndex = lines.findIndex(line => line.includes('export default function'));
  
  if (componentIndex !== -1) {
    // Find the opening brace of the component
    let braceIndex = -1;
    for (let i = componentIndex; i < lines.length; i++) {
      if (lines[i].includes('{')) {
        braceIndex = i;
        break;
      }
    }
    
    if (braceIndex !== -1) {
      // Add permission hook after the opening brace
      lines.splice(braceIndex + 1, 0, `  ${PERMISSION_HOOK}`);
    }
  }
  
  return lines.join('\n');
}

/**
 * Replace permission patterns in content
 */
function replacePermissionPatterns(content) {
  let updatedContent = content;
  
  PERMISSION_PATTERNS.forEach(({ pattern, replacement }) => {
    updatedContent = updatedContent.replace(pattern, replacement);
  });
  
  return updatedContent;
}

/**
 * Process a single file
 */
function processFile(filePath) {
  console.log(`Processing: ${filePath}`);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Check if file already has permission imports
    const hasPermissionImports = PERMISSION_IMPORTS.some(import => 
      content.includes(import)
    );
    
    if (!hasPermissionImports) {
      content = addPermissionImports(content);
      modified = true;
    }
    
    // Check if file has permission hook
    const hasPermissionHook = content.includes('usePermissions');
    
    if (!hasPermissionHook) {
      content = addPermissionHook(content);
      modified = true;
    }
    
    // Replace permission patterns
    const originalContent = content;
    content = replacePermissionPatterns(content);
    
    if (content !== originalContent) {
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Updated: ${filePath}`);
    } else {
      console.log(`- No changes needed: ${filePath}`);
    }
    
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
  }
}

/**
 * Find all React pages and components
 */
function findReactFiles() {
  const patterns = [
    `${PAGES_DIR}/**/*.tsx`,
    `${PAGES_DIR}/**/*.jsx`,
    `${COMPONENTS_DIR}/**/*.tsx`,
    `${COMPONENTS_DIR}/**/*.jsx`
  ];
  
  const files = [];
  patterns.forEach(pattern => {
    const matches = glob.sync(pattern);
    files.push(...matches);
  });
  
  return files;
}

/**
 * Generate permission guard examples
 */
function generatePermissionExamples() {
  const examples = `
// Example 1: Basic permission guards
<CanCreate model="criminal">
  <Button>Add Criminal</Button>
</CanCreate>

<CanView model="criminal">
  <Button>View Criminal</Button>
</CanView>

<CanUpdate model="criminal">
  <Button>Edit Criminal</Button>
</CanUpdate>

<CanDelete model="criminal">
  <Button>Delete Criminal</Button>
</CanDelete>

// Example 2: Using permission hooks
const { canCreate, canView, canUpdate, canDelete } = usePermissions();

{canCreate('criminal') && <Button>Add Criminal</Button>}
{canView('criminal') && <Button>View Criminal</Button>}
{canUpdate('criminal') && <Button>Edit Criminal</Button>}
{canDelete('criminal') && <Button>Delete Criminal</Button>}

// Example 3: Table actions with permissions
<TableCell>
  <div className="flex gap-2">
    <CanView model="criminal">
      <Button size="sm" asChild>
        <Link href={route('criminals.show', criminal.id)}>
          <Eye className="h-4 w-4" />
        </Link>
      </Button>
    </CanView>
    <CanUpdate model="criminal">
      <Button size="sm" asChild>
        <Link href={route('criminals.edit', criminal.id)}>
          <Pencil className="h-4 w-4" />
        </Link>
      </Button>
    </CanUpdate>
    <CanDelete model="criminal">
      <Button size="sm" variant="destructive" onClick={() => deleteCriminal(criminal.id)}>
        <Trash className="h-4 w-4" />
      </Button>
    </CanDelete>
  </div>
</TableCell>
`;
  
  fs.writeFileSync('permission-examples.txt', examples);
  console.log('✓ Generated permission examples: permission-examples.txt');
}

/**
 * Main function
 */
function main() {
  console.log('🔐 Permission Implementation Script');
  console.log('=====================================\n');
  
  const files = findReactFiles();
  console.log(`Found ${files.length} React files to process\n`);
  
  files.forEach(processFile);
  
  console.log('\n📝 Generating permission examples...');
  generatePermissionExamples();
  
  console.log('\n✅ Permission implementation complete!');
  console.log('\nNext steps:');
  console.log('1. Review the changes made to your files');
  console.log('2. Test the permission system with different user roles');
  console.log('3. Check the permission-examples.txt file for usage examples');
  console.log('4. Refer to PERMISSIONS_IMPLEMENTATION_GUIDE.md for detailed documentation');
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  processFile,
  addPermissionImports,
  addPermissionHook,
  replacePermissionPatterns
};
