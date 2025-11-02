<?php

use App\Http\Controllers\CriminalController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    // Comprehensive list of criminals - must be before resource route to avoid conflicts
    Route::get('criminals/comprehensive-list', [CriminalController::class, 'comprehensiveList'])
        ->name('criminals.comprehensive_list');

    // Criminal routes
    Route::resource('criminals', CriminalController::class);

    // Print criminal record
    Route::get('criminals/{criminal}/print', [CriminalController::class, 'print'])
        ->name('criminals.print');
});
