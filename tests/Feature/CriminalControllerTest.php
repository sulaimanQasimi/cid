<?php

namespace Tests\Feature;

use App\Models\Criminal;
use App\Models\Department;
use App\Models\User;
use App\Services\VisitorTrackingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class CriminalControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $admin;
    protected $superadmin;
    protected $department;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create roles
        Role::create(['name' => 'admin', 'guard_name' => 'web']);
        Role::create(['name' => 'superadmin', 'guard_name' => 'web']);
        Role::create(['name' => 'user', 'guard_name' => 'web']);

        // Create permissions
        $permissions = [
            'criminal.view_any',
            'criminal.view',
            'criminal.create',
            'criminal.update',
            'criminal.delete',
            'criminal.restore',
            'criminal.force_delete'
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission, 'guard_name' => 'web']);
        }

        // Create users
        $this->user = User::factory()->create();
        $this->user->assignRole('user');

        $this->admin = User::factory()->create();
        $this->admin->assignRole('admin');
        $this->admin->givePermissionTo($permissions);

        $this->superadmin = User::factory()->create();
        $this->superadmin->assignRole('superadmin');
        $this->superadmin->givePermissionTo($permissions);

        // Create a department
        $this->department = Department::create([
            'name' => 'Test Department',
            'code' => 'TD001'
        ]);

        // Mock the VisitorTrackingService
        $this->mock(VisitorTrackingService::class, function ($mock) {
            $visitor = new \App\Models\Visitor();
            $visitor->id = 1;
            $visitor->ip_address = '127.0.0.1';
            $visitor->user_agent = 'Test Agent';
            $visitor->visited_at = now();
            $mock->shouldReceive('trackVisit')->andReturn($visitor);
        });
    }

    /** @test */
    public function unauthenticated_user_cannot_access_criminal_index()
    {
        $response = $this->get(route('criminals.index'));

        $response->assertRedirect(route('login'));
    }

    /** @test */
    public function user_without_permission_cannot_access_criminal_index()
    {
        $response = $this->actingAs($this->user)->get(route('criminals.index'));

        $response->assertStatus(403);
    }

    /** @test */
    public function admin_can_access_criminal_index()
    {
        $response = $this->actingAs($this->admin)->get(route('criminals.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Criminal/Index')
            ->has('criminals')
            ->has('departments')
            ->has('filters')
        );
    }

    /** @test */
    public function criminal_index_shows_paginated_criminals()
    {
        // Create some criminals
        Criminal::factory()->count(15)->create([
            'department_id' => $this->department->id,
            'created_by' => $this->admin->id
        ]);

        $response = $this->actingAs($this->admin)->get(route('criminals.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Criminal/Index')
            ->has('criminals.data', 10) // Default per_page is 10
            ->has('criminals.links')
            ->has('criminals')
        );
    }

    /** @test */
    public function criminal_index_can_filter_by_search()
    {
        $criminal1 = Criminal::factory()->create([
            'name' => 'John Doe',
            'created_by' => $this->admin->id
        ]);
        $criminal2 = Criminal::factory()->create([
            'name' => 'Jane Smith',
            'created_by' => $this->admin->id
        ]);

        $response = $this->actingAs($this->admin)->get(route('criminals.index', ['search' => 'John']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Criminal/Index')
            ->has('criminals.data', 1)
            ->where('criminals.data.0.name', 'John Doe')
        );
    }

    /** @test */
    public function criminal_index_can_filter_by_department()
    {
        $department2 = Department::create(['name' => 'Department 2', 'code' => 'D002']);
        
        $criminal1 = Criminal::factory()->create([
            'department_id' => $this->department->id,
            'created_by' => $this->admin->id
        ]);
        $criminal2 = Criminal::factory()->create([
            'department_id' => $department2->id,
            'created_by' => $this->admin->id
        ]);

        $response = $this->actingAs($this->admin)->get(route('criminals.index', ['department_id' => $this->department->id]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Criminal/Index')
            ->has('criminals.data', 1)
            ->where('criminals.data.0.department_id', $this->department->id)
        );
    }

    /** @test */
    public function criminal_index_can_sort_by_different_fields()
    {
        $criminal1 = Criminal::factory()->create([
            'name' => 'Zebra',
            'created_by' => $this->admin->id
        ]);
        $criminal2 = Criminal::factory()->create([
            'name' => 'Alpha',
            'created_by' => $this->admin->id
        ]);

        $response = $this->actingAs($this->admin)->get(route('criminals.index', [
            'sort' => 'name',
            'direction' => 'asc'
        ]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Criminal/Index')
            ->where('criminals.data.0.name', 'Alpha')
            ->where('criminals.data.1.name', 'Zebra')
        );
    }

    /** @test */
    public function user_without_permission_cannot_access_criminal_create()
    {
        $response = $this->actingAs($this->user)->get(route('criminals.create'));

        $response->assertStatus(403);
    }

    /** @test */
    public function admin_can_access_criminal_create()
    {
        $response = $this->actingAs($this->admin)->get(route('criminals.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Criminal/Create')
            ->has('departments')
        );
    }

    /** @test */
    public function user_without_permission_cannot_store_criminal()
    {
        $criminalData = [
            'name' => 'Test Criminal',
            'father_name' => 'Test Father',
            'department_id' => $this->department->id
        ];

        $response = $this->actingAs($this->user)->post(route('criminals.store'), $criminalData);

        $response->assertStatus(403);
        $this->assertDatabaseMissing('criminals', ['name' => 'Test Criminal']);
    }

    /** @test */
    public function admin_can_store_criminal_with_valid_data()
    {
        $criminalData = [
            'name' => 'Test Criminal',
            'father_name' => 'Test Father',
            'grandfather_name' => 'Test Grandfather',
            'id_card_number' => '1234567890',
            'phone_number' => '1234567890',
            'original_residence' => 'Original Address',
            'current_residence' => 'Current Address',
            'crime_type' => 'Theft',
            'arrest_location' => 'City Center',
            'arrested_by' => 'Officer Smith',
            'arrest_date' => '2023-01-01',
            'referred_to' => 'Court',
            'final_verdict' => 'Guilty',
            'notes' => 'Test notes',
            'department_id' => (string) $this->department->id
        ];

        $response = $this->actingAs($this->admin)->post(route('criminals.store'), $criminalData);

        $response->assertRedirect(route('criminals.index'));
        $response->assertSessionHas('success', 'Criminal record created successfully.');
        
        $this->assertDatabaseHas('criminals', [
            'name' => 'Test Criminal',
            'created_by' => $this->admin->id
        ]);
    }

    /** @test */
    public function criminal_store_validates_required_fields()
    {
        $response = $this->actingAs($this->admin)->post(route('criminals.store'), []);

        $response->assertSessionHasErrors(['name']);
    }

    /** @test */
    public function criminal_store_validates_field_lengths()
    {
        $criminalData = [
            'name' => str_repeat('a', 256), // Too long
            'number' => str_repeat('a', 51), // Too long
            'id_card_number' => str_repeat('a', 51), // Too long
            'phone_number' => str_repeat('a', 51), // Too long
            'crime_type' => str_repeat('a', 256), // Too long
            'arrest_location' => str_repeat('a', 256), // Too long
            'arrested_by' => str_repeat('a', 256), // Too long
            'referred_to' => str_repeat('a', 256), // Too long
        ];

        $response = $this->actingAs($this->admin)->post(route('criminals.store'), $criminalData);

        $response->assertSessionHasErrors([
            'name',
            'number',
            'id_card_number',
            'phone_number',
            'crime_type',
            'arrest_location',
            'arrested_by',
            'referred_to'
        ]);
    }

    /** @test */
    public function criminal_store_validates_department_exists()
    {
        $criminalData = [
            'name' => 'Test Criminal',
            'department_id' => 999 // Non-existent department
        ];

        $response = $this->actingAs($this->admin)->post(route('criminals.store'), $criminalData);

        $response->assertSessionHasErrors(['department_id']);
    }

    /** @test */
    public function criminal_store_handles_none_department_value()
    {
        $criminalData = [
            'name' => 'Test Criminal',
            'department_id' => 'none'
        ];

        $response = $this->actingAs($this->admin)->post(route('criminals.store'), $criminalData);

        $response->assertRedirect(route('criminals.index'));
        
        $this->assertDatabaseHas('criminals', [
            'name' => 'Test Criminal',
            'department_id' => null
        ]);
    }

    /** @test */
    public function criminal_store_can_upload_photo()
    {
        Storage::fake('public');

        $file = UploadedFile::fake()->image('criminal.jpg', 100, 100);

        $criminalData = [
            'name' => 'Test Criminal',
            'photo' => $file
        ];

        $response = $this->actingAs($this->admin)->post(route('criminals.store'), $criminalData);

        $response->assertRedirect(route('criminals.index'));
        
        $criminal = Criminal::where('name', 'Test Criminal')->first();
        $this->assertNotNull($criminal->photo);
        $this->assertTrue(Storage::disk('public')->exists($criminal->photo));
    }

    /** @test */
    public function criminal_store_validates_photo_file_type()
    {
        Storage::fake('public');

        $file = UploadedFile::fake()->create('document.pdf', 1000);

        $criminalData = [
            'name' => 'Test Criminal',
            'photo' => $file
        ];

        $response = $this->actingAs($this->admin)->post(route('criminals.store'), $criminalData);

        $response->assertSessionHasErrors(['photo']);
    }

    /** @test */
    public function criminal_store_validates_photo_file_size()
    {
        Storage::fake('public');

        $file = UploadedFile::fake()->image('large.jpg')->size(3000); // 3MB

        $criminalData = [
            'name' => 'Test Criminal',
            'photo' => $file
        ];

        $response = $this->actingAs($this->admin)->post(route('criminals.store'), $criminalData);

        $response->assertSessionHasErrors(['photo']);
    }

    /** @test */
    public function user_without_permission_cannot_view_criminal()
    {
        $criminal = Criminal::factory()->create(['created_by' => $this->admin->id]);

        $response = $this->actingAs($this->user)->get(route('criminals.show', $criminal));

        $response->assertStatus(403);
    }

    /** @test */
    public function admin_can_view_criminal()
    {
        $criminal = Criminal::factory()->create([
            'department_id' => $this->department->id,
            'created_by' => $this->admin->id
        ]);

        $response = $this->actingAs($this->admin)->get(route('criminals.show', $criminal));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Criminal/Show')
            ->has('criminal')
            ->where('criminal.id', $criminal->id)
        );
    }

    /** @test */
    public function user_without_permission_cannot_access_criminal_edit()
    {
        $criminal = Criminal::factory()->create(['created_by' => $this->admin->id]);

        $response = $this->actingAs($this->user)->get(route('criminals.edit', $criminal));

        $response->assertStatus(403);
    }

    /** @test */
    public function admin_can_access_criminal_edit()
    {
        $criminal = Criminal::factory()->create([
            'department_id' => $this->department->id,
            'created_by' => $this->admin->id
        ]);

        $response = $this->actingAs($this->admin)->get(route('criminals.edit', $criminal));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Criminal/Edit')
            ->has('criminal')
            ->has('departments')
            ->where('criminal.id', $criminal->id)
        );
    }

    /** @test */
    public function user_without_permission_cannot_update_criminal()
    {
        $criminal = Criminal::factory()->create(['created_by' => $this->admin->id]);

        $updateData = ['name' => 'Updated Name'];

        $response = $this->actingAs($this->user)->put(route('criminals.update', $criminal), $updateData);

        $response->assertStatus(403);
        $this->assertDatabaseMissing('criminals', ['name' => 'Updated Name']);
    }

    /** @test */
    public function admin_can_update_criminal()
    {
        $criminal = Criminal::factory()->create([
            'name' => 'Original Name',
            'department_id' => $this->department->id,
            'created_by' => $this->admin->id
        ]);

        $updateData = [
            'name' => 'Updated Name',
            'father_name' => 'Updated Father',
            'department_id' => (string) $this->department->id
        ];

        $response = $this->actingAs($this->admin)->put(route('criminals.update', $criminal), $updateData);

        $response->assertRedirect(route('criminals.index'));
        $response->assertSessionHas('success', 'Criminal record updated successfully.');
        
        $this->assertDatabaseHas('criminals', [
            'id' => $criminal->id,
            'name' => 'Updated Name',
            'father_name' => 'Updated Father'
        ]);
    }

    /** @test */
    public function criminal_update_can_replace_photo()
    {
        Storage::fake('public');

        $criminal = Criminal::factory()->create([
            'photo' => 'photos/old-photo.jpg',
            'created_by' => $this->admin->id
        ]);

        // Create the old photo file
        Storage::disk('public')->put('photos/old-photo.jpg', 'fake content');

        $newFile = UploadedFile::fake()->image('new-criminal.jpg', 100, 100);

        $updateData = [
            'name' => $criminal->name,
            'photo' => $newFile
        ];

        $response = $this->actingAs($this->admin)->put(route('criminals.update', $criminal), $updateData);

        $response->assertRedirect(route('criminals.index'));
        
        $criminal->refresh();
        $this->assertNotEquals('photos/old-photo.jpg', $criminal->photo);
        $this->assertFalse(Storage::disk('public')->exists('photos/old-photo.jpg'));
        $this->assertTrue(Storage::disk('public')->exists($criminal->photo));
    }

    /** @test */
    public function user_without_permission_cannot_delete_criminal()
    {
        $criminal = Criminal::factory()->create(['created_by' => $this->admin->id]);

        $response = $this->actingAs($this->user)->delete(route('criminals.destroy', $criminal));

        $response->assertStatus(403);
        $this->assertDatabaseHas('criminals', ['id' => $criminal->id]);
    }

    /** @test */
    public function admin_can_delete_criminal()
    {
        $criminal = Criminal::factory()->create(['created_by' => $this->admin->id]);

        $response = $this->actingAs($this->admin)->delete(route('criminals.destroy', $criminal));

        $response->assertRedirect(route('criminals.index'));
        $response->assertSessionHas('success', 'Criminal record deleted successfully.');
        
        $this->assertDatabaseMissing('criminals', ['id' => $criminal->id]);
    }

    /** @test */
    public function criminal_delete_removes_photo_file()
    {
        Storage::fake('public');

        $criminal = Criminal::factory()->create([
            'photo' => 'photos/criminal-photo.jpg',
            'created_by' => $this->admin->id
        ]);

        // Create the photo file
        Storage::disk('public')->put('photos/criminal-photo.jpg', 'fake content');

        $response = $this->actingAs($this->admin)->delete(route('criminals.destroy', $criminal));

        $response->assertRedirect(route('criminals.index'));
        
        $this->assertFalse(Storage::disk('public')->exists('photos/criminal-photo.jpg'));
    }

    /** @test */
    public function user_without_permission_cannot_access_criminal_print()
    {
        $criminal = Criminal::factory()->create(['created_by' => $this->admin->id]);

        $response = $this->actingAs($this->user)->get(route('criminals.print', $criminal));

        $response->assertStatus(403);
    }

    /** @test */
    public function admin_can_access_criminal_print()
    {
        $criminal = Criminal::factory()->create([
            'department_id' => $this->department->id,
            'created_by' => $this->admin->id
        ]);

        $response = $this->actingAs($this->admin)->get(route('criminals.print', $criminal));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Criminal/Print')
            ->has('criminal')
            ->where('criminal.id', $criminal->id)
            ->where('criminal.report', null)
        );
    }

    /** @test */
    public function criminal_index_pagination_works_correctly()
    {
        // Create 25 criminals
        Criminal::factory()->count(25)->create([
            'department_id' => $this->department->id,
            'created_by' => $this->admin->id
        ]);

        // Test first page
        $response = $this->actingAs($this->admin)->get(route('criminals.index', ['per_page' => 10, 'page' => 1]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Criminal/Index')
            ->has('criminals.data', 10)
            ->where('criminals.current_page', 1)
            ->where('criminals.last_page', 3)
        );

        // Test second page
        $response = $this->actingAs($this->admin)->get(route('criminals.index', ['per_page' => 10, 'page' => 2]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Criminal/Index')
            ->has('criminals.data', 10)
            ->where('criminals.current_page', 2)
        );

        // Test last page
        $response = $this->actingAs($this->admin)->get(route('criminals.index', ['per_page' => 10, 'page' => 3]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Criminal/Index')
            ->has('criminals.data', 5)
            ->where('criminals.current_page', 3)
        );
    }

    /** @test */
    public function criminal_index_validates_pagination_parameters()
    {
        $response = $this->actingAs($this->admin)->get(route('criminals.index', [
            'per_page' => 200, // Too high
            'page' => 0 // Too low
        ]));

        $response->assertStatus(302); // Laravel redirects with validation errors
        $response->assertSessionHasErrors(['per_page', 'page']);
    }

    /** @test */
    public function criminal_index_validates_sort_parameters()
    {
        $response = $this->actingAs($this->admin)->get(route('criminals.index', [
            'sort' => 'invalid_field',
            'direction' => 'invalid_direction'
        ]));

        $response->assertStatus(302); // Laravel redirects with validation errors
        $response->assertSessionHasErrors(['sort', 'direction']);
    }

    /** @test */
    public function criminal_search_works_with_multiple_fields()
    {
        $criminal1 = Criminal::factory()->create([
            'name' => 'John Doe',
            'number' => 'CR001',
            'father_name' => 'Robert Doe',
            'id_card_number' => '1234567890',
            'crime_type' => 'Theft',
            'created_by' => $this->admin->id
        ]);

        $criminal2 = Criminal::factory()->create([
            'name' => 'Jane Smith',
            'number' => 'CR002',
            'father_name' => 'John Smith',
            'id_card_number' => '0987654321',
            'crime_type' => 'Fraud',
            'created_by' => $this->admin->id
        ]);

        // Search by name
        $response = $this->actingAs($this->admin)->get(route('criminals.index', ['search' => 'John']));
        $response->assertInertia(fn ($page) => $page->has('criminals.data', 2));

        // Search by number
        $response = $this->actingAs($this->admin)->get(route('criminals.index', ['search' => 'CR001']));
        $response->assertInertia(fn ($page) => $page->has('criminals.data', 1));

        // Search by father name
        $response = $this->actingAs($this->admin)->get(route('criminals.index', ['search' => 'Robert']));
        $response->assertInertia(fn ($page) => $page->has('criminals.data', 1));

        // Search by ID card number
        $response = $this->actingAs($this->admin)->get(route('criminals.index', ['search' => '1234567890']));
        $response->assertInertia(fn ($page) => $page->has('criminals.data', 1));

        // Search by crime type
        $response = $this->actingAs($this->admin)->get(route('criminals.index', ['search' => 'Theft']));
        $response->assertInertia(fn ($page) => $page->has('criminals.data', 1));
    }
}
