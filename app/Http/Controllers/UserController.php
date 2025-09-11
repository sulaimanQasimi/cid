<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\Department;

class UserController extends Controller
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
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', User::class);
        
        // Validate query parameters
        $validated = $request->validate([
            'per_page' => 'nullable|integer|min:5|max:100',
            'search' => 'nullable|string|max:100',
            'sort' => [
                'nullable',
                'string',
                Rule::in(['name', 'email', 'created_at', 'updated_at'])
            ],
            'direction' => ['nullable', 'string', Rule::in(['asc', 'desc'])],
            'page' => 'nullable|integer|min:1',
        ]);

        $perPage = $validated['per_page'] ?? 10;
        $search = $validated['search'] ?? '';
        $sort = $validated['sort'] ?? 'name';
        $direction = $validated['direction'] ?? 'asc';

        // Apply search and filters
        $query = User::with('department');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $query->orderBy($sort, $direction);

        // Get paginated results
        $users = $query->paginate($perPage)->withQueryString();

        return Inertia::render('User/Index', [
            'users' => $users,
            'filters' => [
                'search' => $search,
                'sort' => $sort,
                'direction' => $direction,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', User::class);
        
        $roles = Role::all();
        $permissions = Permission::all();
        $departments = Department::orderBy('name')->get();

        // Group permissions by model
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

        return Inertia::render('User/Create', [
            'roles' => $roles,
            'groupedPermissions' => $groupedPermissions,
            'departments' => $departments,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', User::class);
        
        $validated = $request->validate([
            'name' => 'required|string|min:2|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'department_id' => 'nullable|exists:departments,id',
            'roles' => 'nullable|array',
            'roles.*' => 'exists:roles,id',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id',
        ], [
            'name.required' => 'The name field is required.',
            'email.required' => 'The email field is required.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email is already registered.',
            'password.min' => 'The password must be at least 8 characters.',
            'password.confirmed' => 'The password confirmation does not match.',
            'roles.*.exists' => 'One or more selected roles do not exist.',
            'permissions.*.exists' => 'One or more selected permissions do not exist.',
        ]);

        // Create the user
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'department_id' => $validated['department_id'],
        ]);

        // Assign roles if provided
        if (!empty($validated['roles'])) {
            $user->syncRoles($validated['roles']);
        }

        // Assign permissions if provided
        if (!empty($validated['permissions'])) {
            $user->syncPermissions($validated['permissions']);
        }

        return Redirect::route('users.index')->with('success', 'User created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        $this->authorize('view', $user);
        
        $user->load('roles', 'department');
        return Inertia::render('User/Show', [
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        $this->authorize('update', $user);
        
        $user->load('roles', 'permissions', 'department');
        $roles = Role::all();
        $permissions = Permission::all();
        $departments = Department::orderBy('name')->get();

        // Group permissions by model
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

        return Inertia::render('User/Edit', [
            'user' => $user,
            'userRoles' => $user->roles->pluck('id')->toArray(),
            'userPermissions' => $user->permissions->pluck('id')->toArray(),
            'roles' => $roles,
            'groupedPermissions' => $groupedPermissions,
            'departments' => $departments,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $this->authorize('update', $user);
        
        $validated = $request->validate([
            'name' => 'required|string|min:2|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'password' => 'nullable|string|min:8|confirmed',
            'department_id' => 'nullable|exists:departments,id',
            'roles' => 'nullable|array',
            'roles.*' => 'exists:roles,id',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id',
        ], [
            'name.required' => 'The name field is required.',
            'email.required' => 'The email field is required.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email is already registered.',
            'password.min' => 'The password must be at least 8 characters.',
            'password.confirmed' => 'The password confirmation does not match.',
            'roles.*.exists' => 'One or more selected roles do not exist.',
            'permissions.*.exists' => 'One or more selected permissions do not exist.',
        ]);

        // Update user details
        $userData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'department_id' => $validated['department_id'],
        ];

        // Update password if provided
        if (!empty($validated['password'])) {
            $userData['password'] = Hash::make($validated['password']);
        }

        $user->update($userData);

        // Sync roles if provided
        if (isset($validated['roles'])) {
            $user->syncRoles($validated['roles']);
        }

        // Sync permissions if provided
        if (isset($validated['permissions'])) {
            $user->syncPermissions($validated['permissions']);
        }

        return Redirect::route('users.index')->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $this->authorize('delete', $user);
        
        $user->delete();

        return Redirect::route('users.index')->with('success', 'User deleted successfully.');
    }
}
