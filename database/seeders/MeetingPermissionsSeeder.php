<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Str;

class MeetingPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Meeting permissions
        $meetingPermissions = [
            'create-meeting' => 'Create meeting',
            'view-meeting' => 'View meeting',
            'update-meeting' => 'Update meeting',
            'delete-meeting' => 'Delete meeting',
            'list-meeting' => 'List meetings',
            'join-meeting' => 'Join meeting',
            'leave-meeting' => 'Leave meeting',
            'invite-to-meeting' => 'Invite to meeting',
            'remove-from-meeting' => 'Remove from meeting',
            'share-screen-meeting' => 'Share screen in meeting',
            'record-meeting' => 'Record meeting',
            'chat-in-meeting' => 'Chat in meeting',
            'manage-participants-meeting' => 'Manage meeting participants',
            'start-offline-meeting' => 'Start offline meeting',
            'join-offline-meeting' => 'Join offline meeting'
        ];

        foreach ($meetingPermissions as $name => $label) {
            Permission::firstOrCreate(
                ['name' => $name],
                ['label' => $label]
            );
        }

        // Get admin role and assign all meeting permissions
        $adminRole = Role::where('name', 'admin')->first();
        if ($adminRole) {
            foreach ($meetingPermissions as $name => $label) {
                $permission = Permission::where('name', $name)->first();
                if ($permission) {
                    $adminRole->givePermissionTo($permission);
                }
            }
        }

        // Create Meeting Host role with specific permissions
        $hostRole = Role::firstOrCreate(['name' => 'meeting-host']);
        $hostPermissions = [
            'create-meeting',
            'view-meeting',
            'update-meeting',
            'delete-meeting',
            'list-meeting',
            'join-meeting',
            'leave-meeting',
            'invite-to-meeting',
            'remove-from-meeting',
            'share-screen-meeting',
            'record-meeting',
            'chat-in-meeting',
            'manage-participants-meeting',
            'start-offline-meeting',
        ];

        foreach ($hostPermissions as $permName) {
            $permission = Permission::where('name', $permName)->first();
            if ($permission) {
                $hostRole->givePermissionTo($permission);
            }
        }

        // Create Meeting Participant role with limited permissions
        $participantRole = Role::firstOrCreate(['name' => 'meeting-participant']);
        $participantPermissions = [
            'view-meeting',
            'list-meeting',
            'join-meeting',
            'leave-meeting',
            'share-screen-meeting',
            'chat-in-meeting',
            'join-offline-meeting',
        ];

        foreach ($participantPermissions as $permName) {
            $permission = Permission::where('name', $permName)->first();
            if ($permission) {
                $participantRole->givePermissionTo($permission);
            }
        }

        $this->command->info('Meeting permissions created and assigned to roles.');
    }
}
