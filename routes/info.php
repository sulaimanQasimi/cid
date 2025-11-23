<?php

use App\Http\Controllers\InfoController;
use App\Http\Controllers\InfoTypeController;
use App\Http\Controllers\InfoCategoryController;
use App\Http\Controllers\NationalInsightCenterInfoController;
use App\Http\Controllers\NationalInsightCenterInfoItemController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    // Info Types routes
    Route::resource('info-types', InfoTypeController::class);
    Route::get('info-types/{infoType}/print', [InfoTypeController::class, 'print'])->name('info-types.print');

    // Info Categories routes
    Route::resource('info-categories', InfoCategoryController::class);

    // Info routes (without index and create)
    Route::resource('infos', InfoController::class)->except(['index', 'create']);
    Route::patch('infos/{info}/confirm', [InfoController::class, 'confirm'])->name('infos.confirm');

    // National Insight Center Info routes
    // IMPORTANT: Specific routes must come BEFORE resource routes to avoid conflicts
    Route::get('national-insight-center-infos/report', [NationalInsightCenterInfoController::class, 'report'])->name('national-insight-center-infos.report');
    Route::get('national-insight-center-infos/dates', [NationalInsightCenterInfoController::class, 'dates'])->name('national-insight-center-infos.dates');
    Route::get('national-insight-center-infos/print-dates', [NationalInsightCenterInfoController::class, 'printDates'])->name('national-insight-center-infos.print-dates')->middleware('can:printDates,App\Models\NationalInsightCenterInfo');
    Route::resource('national-insight-center-infos', NationalInsightCenterInfoController::class);
    Route::patch('national-insight-center-infos/{nationalInsightCenterInfo}/confirm', [NationalInsightCenterInfoController::class, 'confirm'])->name('national-insight-center-infos.confirm');
    Route::get('national-insight-center-infos/{nationalInsightCenterInfo}/stats', [NationalInsightCenterInfoController::class, 'manageStats'])->name('national-insight-center-infos.stats');
    Route::put('national-insight-center-infos/{nationalInsightCenterInfo}/stats', [NationalInsightCenterInfoController::class, 'updateStats'])->name('national-insight-center-infos.stats.update');
    Route::get('national-insight-center-infos/{nationalInsightCenterInfo}/print', [NationalInsightCenterInfoController::class, 'print'])->name('national-insight-center-infos.print')->middleware('can:print,nationalInsightCenterInfo');
    Route::get('national-insight-center-infos/{nationalInsightCenterInfo}/weekly-report', [NationalInsightCenterInfoController::class, 'weeklyReport'])->name('national-insight-center-infos.weekly-report');

    // National Insight Center Info Item routes
    // Nested route for creating items within a parent info
    Route::get('national-insight-center-infos/{nationalInsightCenterInfo}/national-insight-center-info-items/create', [NationalInsightCenterInfoItemController::class, 'create'])->name('national-insight-center-info-items.create');
    Route::resource('national-insight-center-info-items', NationalInsightCenterInfoItemController::class)
        ->parameters(['national-insight-center-info-items' => 'item'])
        ->except(['create']);
    Route::patch('national-insight-center-info-items/{item}/confirm', [NationalInsightCenterInfoItemController::class, 'confirm'])->name('national-insight-center-info-items.confirm');
});
