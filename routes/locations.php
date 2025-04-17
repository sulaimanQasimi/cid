<?php

use App\Http\Controllers\ProvinceController;
use App\Http\Controllers\DistrictController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    // Provinces
    Route::resource('provinces', ProvinceController::class);

    // Districts
    Route::resource('districts', DistrictController::class);
});
