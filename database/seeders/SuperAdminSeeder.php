<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\User;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create superadmin role
        $superAdminRole = Role::firstOrCreate([
            'name' => 'superadmin',
            'guard_name' => 'web'
        ]);

        // Get all permissions
        $allPermissions = Permission::all();

        // Assign all permissions to superadmin role
        $superAdminRole->syncPermissions($allPermissions);

        // Find the admin user and assign superadmin role
        $adminUser = User::where('email', 'admin@mod.af')->first();
        
        if ($adminUser) {
            // Remove any existing roles and assign superadmin role
            $adminUser->syncRoles([$superAdminRole]);
            
            $this->command->info('Superadmin role created and assigned to admin user (admin@mod.af)');
            $this->command->info('Superadmin role has been assigned all permissions: ' . $allPermissions->count() . ' permissions');
        } else {
            $this->command->warn('Admin user not found. Please run AdminUserSeeder first.');
        }

        // Also assign superadmin role to any existing admin role users
        $adminRole = Role::where('name', 'admin')->first();
        if ($adminRole) {
            $adminUsers = User::role('admin')->get();
            foreach ($adminUsers as $user) {
                $user->assignRole($superAdminRole);
            }
            
            if ($adminUsers->count() > 0) {
                $this->command->info('Superadmin role also assigned to ' . $adminUsers->count() . ' existing admin users');
            }
        }
    }
}
