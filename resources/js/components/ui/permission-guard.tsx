import React from 'react';
import { usePage } from '@inertiajs/react';
import { hasPermission, hasAnyPermission, hasAllPermissions, PermissionPatterns } from '@/lib/permissions';

interface PermissionGuardProps {
  children: React.ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

export function PermissionGuard({ 
  children, 
  permission, 
  permissions = [], 
  requireAll = false,
  fallback = null 
}: PermissionGuardProps) {
  const { auth } = usePage().props as any;
  
  let hasAccess = false;
  
  if (permission) {
    hasAccess = hasPermission(auth, permission);
  } else if (permissions.length > 0) {
    hasAccess = requireAll 
      ? hasAllPermissions(auth, permissions)
      : hasAnyPermission(auth, permissions);
  } else {
    // If no permissions specified, show content
    hasAccess = true;
  }
  
  if (!hasAccess) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

// Convenience components for common permission patterns
export function CanView({ children, model, fallback }: { children: React.ReactNode; model: string; fallback?: React.ReactNode }) {
  return (
    <PermissionGuard permission={PermissionPatterns.canView(model)} fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function CanViewAny({ children, model, fallback }: { children: React.ReactNode; model: string; fallback?: React.ReactNode }) {
  return (
    <PermissionGuard permission={PermissionPatterns.canViewAny(model)} fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function CanCreate({ children, model, fallback }: { children: React.ReactNode; model: string; fallback?: React.ReactNode }) {
  return (
    <PermissionGuard permission={PermissionPatterns.canCreate(model)} fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function CanUpdate({ children, model, fallback }: { children: React.ReactNode; model: string; fallback?: React.ReactNode }) {
  return (
    <PermissionGuard permission={PermissionPatterns.canUpdate(model)} fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function CanDelete({ children, model, fallback }: { children: React.ReactNode; model: string; fallback?: React.ReactNode }) {
  return (
    <PermissionGuard permission={PermissionPatterns.canDelete(model)} fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function CanConfirm({ children, model, fallback }: { children: React.ReactNode; model: string; fallback?: React.ReactNode }) {
  return (
    <PermissionGuard permission={PermissionPatterns.canConfirm(model)} fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}
