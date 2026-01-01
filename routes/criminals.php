<?php

use App\Http\Controllers\CriminalController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    // Comprehensive list of criminals - must be before resource route to avoid conflicts
    Route::get('criminals/comprehensive-list', [CriminalController::class, 'comprehensiveList'])
        ->name('criminals.comprehensive_list');
    
    // Print comprehensive list
    Route::get('criminals/comprehensive-list/print', [CriminalController::class, 'comprehensiveListPrint'])
        ->name('criminals.comprehensive_list.print');

    // Criminal routes
    Route::resource('criminals', CriminalController::class);

    // Print criminal record
    Route::get('criminals/{criminal}/print', [CriminalController::class, 'print'])
        ->name('criminals.print');

    // Fingerprint capture page
    Route::get('criminals/{criminal}/fingerprints', [CriminalController::class, 'fingerprints'])
        ->name('criminals.fingerprints');

    // Fingerprint API routes (using web middleware for session auth)
    Route::prefix('api/criminals/{criminal}/fingerprints')->group(function () {
        Route::get('/', [App\Http\Controllers\Api\FingerprintController::class, 'index'])
            ->name('api.criminals.fingerprints.index');
        Route::post('/', [App\Http\Controllers\Api\FingerprintController::class, 'store'])
            ->name('api.criminals.fingerprints.store');
        Route::get('/{fingerPosition}', [App\Http\Controllers\Api\FingerprintController::class, 'show'])
            ->name('api.criminals.fingerprints.show');
        Route::delete('/{fingerPosition}', [App\Http\Controllers\Api\FingerprintController::class, 'destroy'])
            ->name('api.criminals.fingerprints.destroy');
        Route::get('/{fingerPosition}/template', [App\Http\Controllers\Api\FingerprintController::class, 'getTemplateForVerify'])
            ->name('api.criminals.fingerprints.template');
    });
});
