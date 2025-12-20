<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Inertia\Inertia;

class RoleController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            // Check if user has admin or superadmin role
            if (!auth()->user()->hasAnyRole(['admin', 'superadmin'])) {
                abort(403, 'Access denied. Admin privileges required.');
            }
            
            return $next($request);
        });
    }

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

        // Group permissions by model (format: model.action)
        $groupedPermissions = [];
        foreach ($permissions as $permission) {
            $parts = explode('.', $permission->name);
            if (count($parts) >= 2) {
                $model = $parts[0];
                if (!isset($groupedPermissions[$model])) {
                    $groupedPermissions[$model] = [];
                }
                $groupedPermissions[$model][] = [
                    'id' => $permission->id,
                    'name' => $permission->name,
                    'label' => $permission->label,
                ];
            }
        }

        // Sort permissions within each group
        foreach ($groupedPermissions as $model => &$modelPermissions) {
            usort($modelPermissions, function ($a, $b) {
                $order = [
                    'view_any' => 1,
                    'view' => 2,
                    'create' => 3,
                    'update' => 4,
                    'delete' => 5,
                    'restore' => 6,
                    'force_delete' => 7,
                    'confirm' => 8,
                ];
                
                $aAction = explode('.', $a['name'])[1] ?? '';
                $bAction = explode('.', $b['name'])[1] ?? '';
                
                return ($order[$aAction] ?? 999) - ($order[$bAction] ?? 999);
            });
        }

        return Inertia::render('Role/Create', [
            'permissions' => $permissions,
            'groupedPermissions' => $groupedPermissions,
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
        $role = Role::with('permissions')->findOrFail($id);
        $this->authorize('update', $role);
        
        $permissions = Permission::all();

        // Group permissions by model (format: model.action)
        $groupedPermissions = [];
        foreach ($permissions as $permission) {
            $parts = explode('.', $permission->name);
            if (count($parts) >= 2) {
                $model = $parts[0];
                if (!isset($groupedPermissions[$model])) {
                    $groupedPermissions[$model] = [];
                }
                $groupedPermissions[$model][] = [
                    'id' => $permission->id,
                    'name' => $permission->name,
                    'label' => $permission->label,
                ];
            }
        }

        // Sort permissions within each group
        foreach ($groupedPermissions as $model => &$modelPermissions) {
            usort($modelPermissions, function ($a, $b) {
                $order = [
                    'view_any' => 1,
                    'view' => 2,
                    'create' => 3,
                    'update' => 4,
                    'delete' => 5,
                    'restore' => 6,
                    'force_delete' => 7,
                    'confirm' => 8,
                ];
                
                $aAction = explode('.', $a['name'])[1] ?? '';
                $bAction = explode('.', $b['name'])[1] ?? '';
                
                return ($order[$aAction] ?? 999) - ($order[$bAction] ?? 999);
            });
        }

        return Inertia::render('Role/Edit', [
            'role' => $role,
            'permissions' => $permissions,
            'groupedPermissions' => $groupedPermissions,
        ]);
    }

    /**
     * Update the specified role in storage.
     */
    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);
        $this->authorize('update', $role);

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
        $role = Role::findOrFail($id);
        $this->authorize('delete', $role);

        // Don't allow deleting the admin or superadmin roles
        if (in_array($role->name, ['admin', 'superadmin'])) {
            return redirect()->route('roles.index')
                ->with('error', 'Cannot delete the ' . $role->name . ' role');
        }

        $role->delete();

        return redirect()->route('roles.index')
            ->with('message', 'Role deleted successfully');
    }
}
