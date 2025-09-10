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
    Route::get('info-types/{infoType}/stats', [InfoTypeController::class, 'manageStats'])->name('info-types.stats');
    Route::put('info-types/{infoType}/stats', [InfoTypeController::class, 'updateStats'])->name('info-types.stats.update');
    Route::get('info-types/{infoType}/print', [InfoTypeController::class, 'print'])->name('info-types.print');

    // Info Categories routes
    Route::resource('info-categories', InfoCategoryController::class);

    // Info routes (without index and create)
    Route::resource('infos', InfoController::class)->except(['index', 'create']);
    Route::patch('infos/{info}/confirm', [InfoController::class, 'confirm'])->name('infos.confirm');

    // National Insight Center Info routes
    Route::resource('national-insight-center-infos', NationalInsightCenterInfoController::class);
    Route::get('national-insight-center-infos/{nationalInsightCenterInfo}/stats', [NationalInsightCenterInfoController::class, 'manageStats'])->name('national-insight-center-infos.stats');
    Route::put('national-insight-center-infos/{nationalInsightCenterInfo}/stats', [NationalInsightCenterInfoController::class, 'updateStats'])->name('national-insight-center-infos.stats.update');
    Route::get('national-insight-center-infos/{nationalInsightCenterInfo}/print', [NationalInsightCenterInfoController::class, 'print'])->name('national-insight-center-infos.print');

    // National Insight Center Info Item routes
    Route::resource('national-insight-center-info-items', NationalInsightCenterInfoItemController::class);
    Route::patch('national-insight-center-info-items/{nationalInsightCenterInfoItem}/confirm', [NationalInsightCenterInfoItemController::class, 'confirm'])->name('national-insight-center-info-items.confirm');
    Route::get('national-insight-center-info-items/{nationalInsightCenterInfoItem}/stats', [NationalInsightCenterInfoItemController::class, 'manageStats'])->name('national-insight-center-info-items.stats');
    Route::put('national-insight-center-info-items/{nationalInsightCenterInfoItem}/stats', [NationalInsightCenterInfoItemController::class, 'updateStats'])->name('national-insight-center-info-items.stats.update');
});
