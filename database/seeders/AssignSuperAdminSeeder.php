<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AssignSuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create superadmin role if it doesn't exist
        $superAdminRole = Role::firstOrCreate([
            'name' => 'superadmin',
            'guard_name' => 'web'
        ]);

        // Get all permissions
        $allPermissions = Permission::all();

        // Assign all permissions to superadmin role
        $superAdminRole->syncPermissions($allPermissions);

        $this->command->info('Superadmin role created with all permissions: ' . $allPermissions->count() . ' permissions');

        // Check if admin user exists, if not create one
        $adminUser = User::where('email', 'admin@mod.af')->first();
        
        if (!$adminUser) {
            $adminUser = User::create([
                'name' => 'Super Admin',
                'email' => 'admin@mod.af',
                'password' => Hash::make('123'),
                'email_verified_at' => now(),
            ]);
            
            $this->command->info('Created new admin user: admin@mod.af with password: 123');
        }

        // Assign superadmin role to admin user
        $adminUser->syncRoles([$superAdminRole]);
        
        $this->command->info('Superadmin role assigned to user: ' . $adminUser->email);

        // List all permissions assigned to superadmin
        $this->command->info('Superadmin permissions:');
        foreach ($allPermissions as $permission) {
            $this->command->line('- ' . $permission->name . ' (' . $permission->label . ')');
        }
    }
}
