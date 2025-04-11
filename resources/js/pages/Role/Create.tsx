import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface Permission {
  id: number;
  name: string;
  label: string;
}

interface RoleCreateProps {
  auth: {
    user: any;
  };
  permissions: Permission[];
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'User Management',
    href: '#',
  },
  {
    title: 'Roles',
    href: route('roles.index'),
  },
  {
    title: 'Create',
    href: route('roles.create'),
  },
];

export default function Create({ auth, permissions }: RoleCreateProps) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    permissions: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('roles.store'));
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
      <Head title="Create Role" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Create New Role</h2>
                <Link href={route('roles.index')} className="text-gray-600 hover:text-gray-900">
                  Back to List
                </Link>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <Label htmlFor="name" className="text-gray-900 mb-2 block">Role Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="w-full md:w-1/2"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                  )}
                </div>

                <div className="mb-6">
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

                  {errors.permissions && (
                    <p className="text-sm text-red-600 mt-1">{errors.permissions}</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={processing}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {processing ? 'Creating...' : 'Create Role'}
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
