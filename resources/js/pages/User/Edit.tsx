import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  roles?: {
    id: number;
    name: string;
  }[];
}

interface Role {
  id: number;
  name: string;
}

interface Props {
  user: User;
  roles: Role[];
  userRoles: number[];
}

export default function UserEdit({ user, roles = [], userRoles = [] }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'User Management',
      href: '#',
    },
    {
      title: 'Users',
      href: route('users.index'),
    },
    {
      title: 'Edit User',
      href: route('users.edit', user.id),
    },
  ];

  const { data, setData, put, processing, errors } = useForm({
    name: user.name,
    email: user.email,
    password: '',
    password_confirmation: '',
    roles: userRoles,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('users.update', user.id));
  };

  const toggleRole = (roleId: number) => {
    const currentRoles = [...data.roles];
    const index = currentRoles.indexOf(roleId);

    if (index === -1) {
      // Add role
      currentRoles.push(roleId);
    } else {
      // Remove role
      currentRoles.splice(index, 1);
    }

    setData('roles', currentRoles);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit User: ${user.name}`} />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Edit User</CardTitle>
                <Button variant="outline" onClick={() => window.history.back()}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </div>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    required
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                  />
                  {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                  <p className="text-xs text-gray-500">
                    Leave blank to keep the current password. New password must be at least 8 characters.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password_confirmation">Confirm Password</Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                  />
                </div>

                {roles.length > 0 && (
                  <div className="space-y-2">
                    <Label>Roles</Label>
                    <div className="border rounded-md p-3 space-y-2">
                      {roles.map(role => (
                        <div key={role.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`role-${role.id}`}
                            checked={data.roles.includes(role.id)}
                            onCheckedChange={() => toggleRole(role.id)}
                          />
                          <Label
                            htmlFor={`role-${role.id}`}
                            className="cursor-pointer font-normal"
                          >
                            {role.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {errors.roles && <p className="text-sm text-red-500">{errors.roles}</p>}
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={processing}>Update User</Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
