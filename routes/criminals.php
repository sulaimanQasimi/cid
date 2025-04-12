<?php

use App\Http\Controllers\CriminalController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    // Criminal routes
    Route::resource('criminals', CriminalController::class);
});
