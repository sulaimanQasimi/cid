<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create roles
        Role::create(['name' => 'admin', 'guard_name' => 'web']);
        Role::create(['name' => 'superadmin', 'guard_name' => 'web']);
        Role::create(['name' => 'user', 'guard_name' => 'web']);
    }

    /** @test */
    public function non_admin_users_cannot_access_user_index()
    {
        $user = User::factory()->create();
        $user->assignRole('user');

        $response = $this->actingAs($user)->get(route('users.index'));

        $response->assertStatus(403);
    }

    /** @test */
    public function admin_users_can_access_user_index()
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $response = $this->actingAs($admin)->get(route('users.index'));

        $response->assertStatus(200);
    }

    /** @test */
    public function superadmin_users_can_access_user_index()
    {
        $superadmin = User::factory()->create();
        $superadmin->assignRole('superadmin');

        $response = $this->actingAs($superadmin)->get(route('users.index'));

        $response->assertStatus(200);
    }

    /** @test */
    public function non_admin_users_cannot_create_users()
    {
        $user = User::factory()->create();
        $user->assignRole('user');

        $response = $this->actingAs($user)->get(route('users.create'));

        $response->assertStatus(403);
    }

    /** @test */
    public function admin_users_can_create_users()
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $response = $this->actingAs($admin)->get(route('users.create'));

        $response->assertStatus(200);
    }

    /** @test */
    public function users_cannot_delete_themselves()
    {
        $user = User::factory()->create();
        $user->assignRole('admin');

        $response = $this->actingAs($user)->delete(route('users.destroy', $user));

        $response->assertRedirect();
        $response->assertSessionHas('error', 'You cannot delete your own account.');
    }

    /** @test */
    public function non_superadmin_cannot_delete_superadmin()
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $superadmin = User::factory()->create();
        $superadmin->assignRole('superadmin');

        $response = $this->actingAs($admin)->delete(route('users.destroy', $superadmin));

        $response->assertRedirect();
        $response->assertSessionHas('error', 'Only superadmin users can delete superadmin accounts.');
    }

    /** @test */
    public function superadmin_can_delete_admin()
    {
        $superadmin = User::factory()->create();
        $superadmin->assignRole('superadmin');

        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $response = $this->actingAs($superadmin)->delete(route('users.destroy', $admin));

        $response->assertRedirect(route('users.index'));
        $response->assertSessionHas('success', 'User deleted successfully.');
    }
}
