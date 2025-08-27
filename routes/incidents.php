<?php

use App\Http\Controllers\IncidentController;
use App\Http\Controllers\IncidentReportController;
use App\Http\Controllers\IncidentCategoryController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    // Incident Categories
    Route::resource('incident-categories', IncidentCategoryController::class);

    // Incident Reports
    Route::resource('incident-reports', IncidentReportController::class);

    // Incidents
    Route::resource('incidents', IncidentController::class);

    // Additional route for linking incidents to reports
    Route::post('incidents/{incident}/link-to-report/{report}', [IncidentController::class, 'linkToReport'])
        ->name('incidents.link-to-report');

    // Confirmation routes for incidents
    Route::post('incidents/{incident}/confirm', [IncidentController::class, 'confirm'])
        ->name('incidents.confirm');
    Route::post('incidents/{incident}/unconfirm', [IncidentController::class, 'unconfirm'])
        ->name('incidents.unconfirm');

    // Route for viewing incidents within a report
    Route::get('incident-reports/{incident_report}/incidents', [IncidentReportController::class, 'showIncidents'])
        ->name('incident-reports.incidents');

    // Route for printing incident reports
    Route::get('incident-reports/{incident_report}/print', [IncidentReportController::class, 'print'])
        ->name('incident-reports.print');
});
