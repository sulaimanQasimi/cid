<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\User;
use Illuminate\Support\Str;

class PermissionSeeder extends Seeder
{
    // Define models to generate permissions for
    protected $models = [
        'User' => 'Users',
        'Info' => 'Info Records',
        'InfoType' => 'Info Types',
        'InfoCategory' => 'Info Categories',
    ];

    // Define CRUD actions with friendly labels
    protected $actions = [
        'view' => 'View',
        'create' => 'Create',
        'edit' => 'Edit',
        'delete' => 'Delete',
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin role if it doesn't exist
        $adminRole = Role::firstOrCreate(['name' => 'admin']);

        $allPermissions = [];

        // Generate permissions for each model
        foreach ($this->models as $model => $label) {
            foreach ($this->actions as $action => $actionLabel) {
                $permissionName = Str::kebab($action) . '-' . Str::kebab($model);

                // Create permission with label
                $permission = Permission::firstOrCreate(
                    ['name' => $permissionName],
                    ['label' => $actionLabel . ' ' . $label]
                );

                $allPermissions[] = $permission->name;

                // Assign to admin role
                $adminRole->givePermissionTo($permission);
            }

            // Also create a list permission
            $listPermissionName = 'list-' . Str::kebab($model);
            $listPermission = Permission::firstOrCreate(
                ['name' => $listPermissionName],
                ['label' => 'List ' . $label]
            );

            $allPermissions[] = $listPermission->name;
            $adminRole->givePermissionTo($listPermission);
        }

        // Get the user with ID 1
        $user = User::find(1);

        if ($user) {
            // Assign admin role to user
            $user->assignRole($adminRole);

            // Also assign individual permissions to the user
            $user->syncPermissions($allPermissions);

            $this->command->info('Admin role and permissions assigned to user ID 1');
        } else {
            $this->command->error('User with ID 1 not found. Permissions were created but not assigned to any user.');
        }
    }
}
