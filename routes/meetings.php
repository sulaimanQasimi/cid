<?php

use App\Http\Controllers\MeetingController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    // Print route must be before resource route to avoid conflicts
    Route::get('meetings/print', [MeetingController::class, 'print'])->name('meetings.print');
    Route::resource('meetings', MeetingController::class);
});
