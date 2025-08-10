import { usePage } from '@inertiajs/react';
import { hasPermission, hasAnyPermission, hasAllPermissions, PermissionPatterns } from '@/lib/permissions';

export function usePermissions() {
  const { auth } = usePage().props as any;
  
  return {
    // Check single permission
    can: (permission: string) => hasPermission(auth, permission),
    
    // Check any of multiple permissions
    canAny: (permissions: string[]) => hasAnyPermission(auth, permissions),
    
    // Check all permissions
    canAll: (permissions: string[]) => hasAllPermissions(auth, permissions),
    
    // Convenience methods for common patterns
    canView: (model: string) => hasPermission(auth, PermissionPatterns.canView(model)),
    canViewAny: (model: string) => hasPermission(auth, PermissionPatterns.canViewAny(model)),
    canCreate: (model: string) => hasPermission(auth, PermissionPatterns.canCreate(model)),
    canUpdate: (model: string) => hasPermission(auth, PermissionPatterns.canUpdate(model)),
    canDelete: (model: string) => hasPermission(auth, PermissionPatterns.canDelete(model)),
    canRestore: (model: string) => hasPermission(auth, PermissionPatterns.canRestore(model)),
    canForceDelete: (model: string) => hasPermission(auth, PermissionPatterns.canForceDelete(model)),
    canConfirm: (model: string) => hasPermission(auth, PermissionPatterns.canConfirm(model)),
    
    // Get all user permissions
    permissions: auth.permissions || [],
    
    // Check if user has admin role (has all permissions)
    isAdmin: () => {
      const adminPermissions = [
        'criminal.view_any', 'incident.view_any', 'info.view_any', 
        'user.view_any', 'language.view_any', 'translation.view_any'
      ];
      return hasAllPermissions(auth, adminPermissions);
    },
    
    // Check if user has manager role (has most permissions but not all)
    isManager: () => {
      const managerPermissions = [
        'criminal.view_any', 'incident.view_any', 'info.view_any',
        'meeting.view_any', 'report.view_any'
      ];
      return hasAllPermissions(auth, managerPermissions);
    },
    
    // Check if user has basic user role
    isUser: () => {
      const userPermissions = [
        'criminal.view_any', 'incident.view_any', 'info.view_any'
      ];
      return hasAllPermissions(auth, userPermissions);
    }
  };
}
