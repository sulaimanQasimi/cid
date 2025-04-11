<?php

use App\Http\Controllers\PermissionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('permissions', [PermissionController::class, 'index'])->name('permissions.index');
    Route::get('permissions/{user}/edit', [PermissionController::class, 'edit'])->name('permissions.edit');
    Route::put('permissions/{user}', [PermissionController::class, 'update'])->name('permissions.update');
    Route::get('roles-permissions', [PermissionController::class, 'getRolesAndPermissions'])->name('permissions.roles-permissions');
});
