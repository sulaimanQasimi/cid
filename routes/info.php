<?php

use App\Http\Controllers\InfoController;
use App\Http\Controllers\InfoTypeController;
use App\Http\Controllers\InfoCategoryController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    // Info Types routes
    Route::resource('info-types', InfoTypeController::class);

    // Info Categories routes
    Route::resource('info-categories', InfoCategoryController::class);

    // Info routes
    Route::resource('infos', InfoController::class);
    Route::patch('infos/{info}/confirm', [InfoController::class, 'confirm'])->name('infos.confirm');
});
