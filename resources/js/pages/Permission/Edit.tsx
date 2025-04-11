import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/Components/ui/button';
import { Switch } from '@/Components/ui/switch';
import { Label } from '@/Components/ui/label';
import { Checkbox } from '@/Components/ui/checkbox';

interface User {
  id: number;
  name: string;
  email: string;
  roles: {
    id: number;
    name: string;
  }[];
  permissions: {
    id: number;
    name: string;
    label: string;
  }[];
}

interface Permission {
  id: number;
  name: string;
  label: string;
}

interface Role {
  id: number;
  name: string;
}

interface PermissionEditProps {
  auth: {
    user: any;
  };
  user: User;
  roles: Role[];
  permissions: Permission[];
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'User Management',
    href: '#',
  },
  {
    title: 'Permissions',
    href: route('permissions.index'),
  },
  {
    title: 'Edit Permissions',
    href: '#',
  },
];

export default function Edit({ auth, user, roles, permissions }: PermissionEditProps) {
  const { data, setData, errors, put, processing } = useForm({
    roles: user.roles.map(role => role.name),
    permissions: user.permissions.map(permission => permission.name),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('permissions.update', user.id));
  };

  const toggleRole = (roleName: string) => {
    const updatedRoles = data.roles.includes(roleName)
      ? data.roles.filter(role => role !== roleName)
      : [...data.roles, roleName];

    setData('roles', updatedRoles);
  };

  const togglePermission = (permissionName: string) => {
    const updatedPermissions = data.permissions.includes(permissionName)
      ? data.permissions.filter(permission => permission !== permissionName)
      : [...data.permissions, permissionName];

    setData('permissions', updatedPermissions);
  };

  // Group permissions by model
  const groupedPermissions: Record<string, Permission[]> = {};
  permissions.forEach(permission => {
    // Extract model name from permission (assuming format: action-model)
    const parts = permission.name.split('-');
    if (parts.length > 1) {
      const model = parts[parts.length - 1];
      if (!groupedPermissions[model]) {
        groupedPermissions[model] = [];
      }
      groupedPermissions[model].push(permission);
    }
  });

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Permissions for ${user.name}`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Edit Permissions for {user.name}</h2>
                <Link href={route('permissions.index')} className="text-gray-600 hover:text-gray-900">
                  Back to List
                </Link>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Roles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {roles.map((role) => (
                      <div key={role.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`role-${role.id}`}
                          checked={data.roles.includes(role.name)}
                          onCheckedChange={() => toggleRole(role.name)}
                        />
                        <Label htmlFor={`role-${role.id}`} className="font-medium">
                          {role.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Permissions</h3>

                  {Object.entries(groupedPermissions).map(([model, modelPermissions]) => (
                    <div key={model} className="mb-6">
                      <h4 className="text-md font-medium mb-2 capitalize">{model} Permissions</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {modelPermissions.map((permission) => (
                          <div key={permission.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`permission-${permission.id}`}
                              checked={data.permissions.includes(permission.name)}
                              onCheckedChange={() => togglePermission(permission.name)}
                            />
                            <Label htmlFor={`permission-${permission.id}`} className="font-medium">
                              {permission.label || permission.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={processing}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {processing ? 'Saving...' : 'Save Permissions'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
