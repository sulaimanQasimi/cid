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

// Language management
Route::get('languages', [LanguageController::class, 'index']);
Route::get('languages/{id}', [LanguageController::class, 'show']);
Route::post('languages', [LanguageController::class, 'store']);
Route::put('languages/{id}', [LanguageController::class, 'update']);
Route::delete('languages/{id}', [LanguageController::class, 'destroy']);

// Translation management
Route::get('translations/lang/{languageCode}', [TranslationController::class, 'getLanguageTranslations']);
Route::post('translations/import', [TranslationController::class, 'import']);
Route::post('translations/export', [TranslationController::class, 'export']);

// General translation resource routes
Route::get('translations', [TranslationController::class, 'index']);
Route::get('translations/{id}', [TranslationController::class, 'show']);
Route::post('translations', [TranslationController::class, 'store']);
Route::put('translations/{id}', [TranslationController::class, 'update']);
Route::delete('translations/{id}', [TranslationController::class, 'destroy']);
