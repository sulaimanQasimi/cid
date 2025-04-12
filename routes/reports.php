<?php

use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

// Public route for creating reports (no authentication required)
Route::post('reports', [ReportController::class, 'store'])->name('reports.store')
    ->withoutMiddleware(['auth', 'verified']);

// Protected route for viewing reports
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('reports/{report}', [ReportController::class, 'show'])->name('reports.show');
});
