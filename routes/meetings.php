<?php

use App\Http\Controllers\MeetingController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::resource('meetings', MeetingController::class);
    Route::get('meetings/{meeting}/print', [MeetingController::class, 'print'])->name('meetings.print');
});
