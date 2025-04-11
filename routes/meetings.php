<?php

use App\Http\Controllers\MeetingController;
use App\Http\Controllers\WebRTCControllerNew;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    // Meeting management routes
    Route::get('meetings', [MeetingController::class, 'index'])->name('meetings.index');
    Route::get('meetings/create', [MeetingController::class, 'create'])->name('meetings.create');
    Route::post('meetings', [MeetingController::class, 'store'])->name('meetings.store');
    Route::get('meetings/{id}', [MeetingController::class, 'show'])->name('meetings.show');
    Route::get('meetings/{id}/edit', [MeetingController::class, 'edit'])->name('meetings.edit');
    Route::put('meetings/{id}', [MeetingController::class, 'update'])->name('meetings.update');
    Route::delete('meetings/{id}', [MeetingController::class, 'destroy'])->name('meetings.destroy');

    // Start an instant meeting
    Route::post('meetings/start', [MeetingController::class, 'start'])->name('meetings.start');

    // Join and leave meeting
    Route::get('join/{meetingCode}', [MeetingController::class, 'join'])->name('meetings.join');
    Route::post('meetings/{id}/leave', [MeetingController::class, 'leave'])->name('meetings.leave');

    // WebRTC related routes
    Route::prefix('webrtc')->group(function () {
        Route::post('session/meeting/{meetingId}', [WebRTCControllerNew::class, 'initSession'])->name('webrtc.init-session');
        Route::post('session/{sessionId}/ice-candidates', [WebRTCControllerNew::class, 'saveIceCandidates'])->name('webrtc.ice-candidates');
        Route::post('signal', [WebRTCControllerNew::class, 'signal'])->name('webrtc.signal');
        Route::post('session/{sessionId}/end', [WebRTCControllerNew::class, 'endSession'])->name('webrtc.end-session');
        Route::post('meeting/{meetingId}/message', [WebRTCControllerNew::class, 'sendMessage'])->name('webrtc.send-message');
        Route::get('meeting/{meetingId}/messages', [WebRTCControllerNew::class, 'getMessages'])->name('webrtc.get-messages');
        Route::post('session/{sessionId}/sync-offline', [WebRTCControllerNew::class, 'syncOfflineData'])->name('webrtc.sync-offline');
    });
});
