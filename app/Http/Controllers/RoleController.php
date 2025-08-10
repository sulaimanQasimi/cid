<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Inertia\Inertia;

class RoleController extends Controller
{
    /**
     * Display a listing of the roles.
     */
    public function index()
    {
        $this->authorize('viewAny', Role::class);
        
        $roles = Role::with('permissions')->paginate(10);
        $permissions = Permission::all();

        return Inertia::render('Role/Index', [
            'roles' => $roles,
            'permissions' => $permissions
        ]);
    }

    /**
     * Show the form for creating a new role.
     */
    public function create()
    {
        $this->authorize('create', Role::class);
        
        $permissions = Permission::all();

        return Inertia::render('Role/Create', [
            'permissions' => $permissions
        ]);
    }

    /**
     * Store a newly created role in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Role::class);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'permissions' => 'array',
        ]);

        $role = Role::create(['name' => $validated['name']]);

        if (isset($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        return redirect()->route('roles.index')
            ->with('message', 'Role created successfully');
    }

    /**
     * Show the form for editing the specified role.
     */
    public function edit($id)
    {
        $this->authorize('update', Role::class);
        
        $role = Role::with('permissions')->findOrFail($id);
        $permissions = Permission::all();

        return Inertia::render('Role/Edit', [
            'role' => $role,
            'permissions' => $permissions
        ]);
    }

    /**
     * Update the specified role in storage.
     */
    public function update(Request $request, $id)
    {
        $this->authorize('update', Role::class);
        
        $role = Role::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            'permissions' => 'array',
        ]);

        $role->update(['name' => $validated['name']]);

        if (isset($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        return redirect()->route('roles.index')
            ->with('message', 'Role updated successfully');
    }

    /**
     * Remove the specified role from storage.
     */
    public function destroy($id)
    {
        $this->authorize('delete', Role::class);
        
        $role = Role::findOrFail($id);

        // Don't allow deleting the admin role
        if ($role->name === 'admin') {
            return redirect()->route('roles.index')
                ->with('error', 'Cannot delete the admin role');
        }

        $role->delete();

        return redirect()->route('roles.index')
            ->with('message', 'Role deleted successfully');
    }
}
