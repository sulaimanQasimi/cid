<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\LanguageController;
use App\Http\Controllers\Api\TranslationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Language translations - more specific route
Route::put('languages/translations/{key}', [LanguageController::class, 'updateTranslation']);

// Translation management - specific routes first
Route::get('translations/lang/{languageCode}', [TranslationController::class, 'getLanguageTranslations']);
Route::post('translations/import', [TranslationController::class, 'import']);
Route::post('translations/export', [TranslationController::class, 'export']);

// General translation resource routes - generic routes last
Route::get('translations', [TranslationController::class, 'index']);
Route::get('translations/{id}', [TranslationController::class, 'show']);
Route::post('translations', [TranslationController::class, 'store']);
Route::put('translations/{id}', [TranslationController::class, 'update']);
Route::delete('translations/{id}', [TranslationController::class, 'destroy']);
