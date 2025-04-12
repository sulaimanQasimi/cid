<?php

use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public route for creating reports (no authentication required)
Route::post('reports', [ReportController::class, 'store'])->name('reports.store')
    ->withoutMiddleware(['auth', 'verified']);

// Protected route for viewing reports
Route::middleware(['auth', 'verified'])->group(function () {
    // API route for finding reports by code
    Route::get('api/reports/code/{code}', [ReportController::class, 'findByCode']);

    // Report scan page (must come before the dynamic parameter route)
    Route::get('reports/scan', function () {
        return Inertia::render('Reports/Scan');
    })->name('reports.scan');

    // Show report by ID
    Route::get('reports/{report}', [ReportController::class, 'show'])->name('reports.show');
});
