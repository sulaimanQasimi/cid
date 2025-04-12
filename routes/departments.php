<?php

use App\Http\Controllers\DepartmentController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    // Department routes
    Route::resource('departments', DepartmentController::class);
});
