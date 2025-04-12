<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Broadcast;

// Add broadcasting auth route for Reverb websockets
Broadcast::routes(['middleware' => ['web', 'auth']]);

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/info.php';
require __DIR__.'/users.php';
require __DIR__.'/permissions.php';
require __DIR__.'/roles.php';
require __DIR__.'/meetings.php';
require __DIR__.'/departments.php';
require __DIR__.'/criminals.php';
require __DIR__.'/reports.php';
