# Permissions Implementation Guide

This guide explains how to implement permission-based access control throughout the application using the permission system that's been integrated with the PermissionSeeder.

## Overview

The permission system is based on the permissions defined in `database/seeders/PermissionSeeder.php` and is shared through `app/Http/Middleware/HandleInertiaRequests.php`. The system provides:

1. **Permission-based navigation** - Sidebar items are filtered based on user permissions
2. **Permission guards** - Components that show/hide content based on permissions
3. **Permission hooks** - React hooks for checking permissions in components
4. **Permission utilities** - Helper functions for permission checking

## Permission Structure

Permissions follow the pattern: `{model}.{action}`

### Available Actions
- `view` - View individual records
- `view_any` - View lists of records
- `create` - Create new records
- `update` - Edit existing records
- `delete` - Delete records
- `restore` - Restore soft-deleted records
- `force_delete` - Permanently delete records
- `confirm` - Confirm/approve records (for info-related models)

### Available Models
- `criminal` - Criminal records
- `department` - Departments
- `district` - Districts
- `incident` - Incidents
- `incident_category` - Incident categories
- `incident_report` - Incident reports
- `info` - Information records
- `info_category` - Information categories
- `info_type` - Information types
- `language` - Languages
- `meeting` - Meetings
- `meeting_message` - Meeting messages
- `meeting_session` - Meeting sessions
- `province` - Provinces
- `report` - Reports
- `report_stat` - Report statistics
- `stat_category` - Statistics categories
- `stat_category_item` - Statistics category items
- `translation` - Translations
- `user` - Users

## Implementation Examples

### 1. Using Permission Guards in Components

```tsx
import { CanCreate, CanView, CanUpdate, CanDelete } from '@/components/ui/permission-guard';

function MyComponent() {
  return (
    <div>
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
    </div>
  );
}
```

### 2. Using Permission Hooks

```tsx
import { usePermissions } from '@/hooks/use-permissions';

function MyComponent() {
  const { 
    can, 
    canView, 
    canCreate, 
    canUpdate, 
    canDelete,
    isAdmin,
    isManager 
  } = usePermissions();

  return (
    <div>
      {canView('criminal') && <Button>View Criminals</Button>}
      {canCreate('criminal') && <Button>Add Criminal</Button>}
      {canUpdate('criminal') && <Button>Edit Criminal</Button>}
      {canDelete('criminal') && <Button>Delete Criminal</Button>}
      
      {isAdmin() && <AdminPanel />}
      {isManager() && <ManagerPanel />}
    </div>
  );
}
```

### 3. Using Permission Utilities Directly

```tsx
import { hasPermission, PermissionPatterns } from '@/lib/permissions';
import { usePage } from '@inertiajs/react';

function MyComponent() {
  const { auth } = usePage().props as any;
  
  const canViewCriminals = hasPermission(auth, PermissionPatterns.criminal.viewAny);
  const canCreateCriminals = hasPermission(auth, PermissionPatterns.criminal.create);
  
  return (
    <div>
      {canViewCriminals && <CriminalList />}
      {canCreateCriminals && <AddCriminalForm />}
    </div>
  );
}
```

### 4. Conditional Rendering in Tables

```tsx
function CriminalTable({ criminals }) {
  const { canView, canUpdate, canDelete } = usePermissions();
  
  return (
    <Table>
      <TableBody>
        {criminals.map(criminal => (
          <TableRow key={criminal.id}>
            <TableCell>{criminal.name}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                {canView('criminal') && (
                  <Button size="sm" asChild>
                    <Link href={route('criminals.show', criminal.id)}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
                {canUpdate('criminal') && (
                  <Button size="sm" asChild>
                    <Link href={route('criminals.edit', criminal.id)}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
                {canDelete('criminal') && (
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => deleteCriminal(criminal.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

### 5. Page-Level Permission Checks

```tsx
import { CanViewAny } from '@/components/ui/permission-guard';

function CriminalIndex() {
  return (
    <CanViewAny model="criminal" fallback={<AccessDenied />}>
      <div>
        <h1>Criminal Records</h1>
        <CriminalTable />
      </div>
    </CanViewAny>
  );
}
```

## Role-Based Access

The system includes predefined roles with different permission sets:

### Admin Role
- Has access to all permissions
- Can manage users, roles, and system settings
- Full CRUD access to all models

### Manager Role
- Has most permissions but not all
- Can manage operational data
- Cannot access user management or system settings

### User Role
- Basic permissions for viewing and limited operations
- Can view criminals, incidents, and information
- Limited create/update permissions

## Best Practices

### 1. Always Check Permissions
- Never assume a user has access to functionality
- Always wrap sensitive operations with permission checks
- Use permission guards for UI elements

### 2. Graceful Degradation
- Provide fallback content when permissions are denied
- Show appropriate messages for unauthorized access
- Hide functionality rather than showing broken UI

### 3. Consistent Permission Patterns
- Use the same permission patterns across similar components
- Follow the established naming conventions
- Use permission guards for reusable components

### 4. Performance Considerations
- Permission checks are fast and cached
- Don't over-optimize permission checking
- Use permission hooks for complex logic

## Migration Guide

To update existing components to use the new permission system:

### Before (Old Way)
```tsx
{auth.permissions.includes('criminal.create') && (
  <Button>Add Criminal</Button>
)}
```

### After (New Way)
```tsx
<CanCreate model="criminal">
  <Button>Add Criminal</Button>
</CanCreate>
```

### Or Using Hooks
```tsx
const { canCreate } = usePermissions();

{canCreate('criminal') && (
  <Button>Add Criminal</Button>
)}
```

## Testing Permissions

To test different permission levels:

1. **Admin User**: Has all permissions
2. **Manager User**: Has most operational permissions
3. **Regular User**: Has basic viewing permissions

You can modify user roles in the database or create test users with specific permission sets.

## Troubleshooting

### Common Issues

1. **Permissions not showing**: Check that permissions are properly seeded and shared through Inertia
2. **Permission guards not working**: Ensure you're importing the correct components
3. **Type errors**: Make sure the auth interface includes the permissions array

### Debug Permissions

```tsx
import { usePermissions } from '@/hooks/use-permissions';

function DebugComponent() {
  const { permissions, isAdmin, isManager } = usePermissions();
  
  return (
    <div>
      <h3>User Permissions:</h3>
      <ul>
        {permissions.map(permission => (
          <li key={permission}>{permission}</li>
        ))}
      </ul>
      <p>Is Admin: {isAdmin() ? 'Yes' : 'No'}</p>
      <p>Is Manager: {isManager() ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

This permission system provides a robust, scalable way to control access throughout your application while maintaining clean, readable code.
