<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Inertia\Inertia;

class PermissionController extends Controller
{
    /**
     * Display the user permission management page
     */
    public function index()
    {
        $users = User::with('roles', 'permissions')->paginate(10);
        $roles = Role::all();
        $permissions = Permission::all();

        return Inertia::render('Permission/Index', [
            'users' => $users,
            'roles' => $roles,
            'permissions' => $permissions
        ]);
    }

    /**
     * Show the form for editing a user's permissions and roles.
     */
    public function edit($id)
    {
        $user = User::with('roles', 'permissions')->findOrFail($id);
        $roles = Role::all();
        $permissions = Permission::all();

        return Inertia::render('Permission/Edit', [
            'user' => $user,
            'roles' => $roles,
            'permissions' => $permissions
        ]);
    }

    /**
     * Update the user's roles and permissions.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'roles' => 'array',
            'permissions' => 'array',
        ]);

        $user = User::findOrFail($id);

        // Sync roles
        if (isset($validated['roles'])) {
            $user->syncRoles($validated['roles']);
        }

        // Sync permissions
        if (isset($validated['permissions'])) {
            $user->syncPermissions($validated['permissions']);
        }

        return redirect()->route('permissions.index')
            ->with('message', 'User permissions updated successfully');
    }

    /**
     * Get all available roles and permissions.
     */
    public function getRolesAndPermissions()
    {
        $roles = Role::all();
        $permissions = Permission::all();

        return response()->json([
            'roles' => $roles,
            'permissions' => $permissions
        ]);
    }
}
