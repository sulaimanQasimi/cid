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

// Language Management
Route::group(['middleware' => ['auth']], function () {
    Route::resource('languages', App\Http\Controllers\Admin\LanguageController::class);

    Route::resource('translations', App\Http\Controllers\Admin\TranslationController::class);
    Route::post('translations/import', [App\Http\Controllers\Admin\TranslationController::class, 'import'])->name('translations.import');
    Route::get('translations/export', [App\Http\Controllers\Admin\TranslationController::class, 'export'])->name('translations.export');

    // Add route for exporting translations to JSON files
    Route::get('translations/export-json', [App\Http\Controllers\Admin\TranslationController::class, 'exportToJson'])->name('translations.export-json');

    // Language test page
    Route::get('language-test', function () {
        return Inertia::render('language-test');
    })->name('language-test');

    // Temporary API routes until we fix the actual API routes
    Route::get('api/languages', function () {
        $languages = App\Models\Language::orderBy('default', 'desc')->orderBy('name')->get();
        return response()->json(['languages' => $languages]);
    });

    Route::get('api/translations/lang/{code}', function ($code) {
        $language = App\Models\Language::where('code', $code)->first();
        if (!$language) {
            return response()->json(['message' => 'Language not found'], 404);
        }
        $translations = App\Models\Translation::getTranslations($code);
        return response()->json([
            'language' => $language,
            'translations' => $translations,
        ]);
    });

    // Add the following routes for StatCategory and StatCategoryItem management
    Route::resource('stat-categories', \App\Http\Controllers\Admin\StatCategoryController::class);

    // Stat Category Item routes
    Route::resource('stat-category-items', \App\Http\Controllers\Admin\StatCategoryItemController::class);
    Route::post('stat-category-items/reorder', [\App\Http\Controllers\Admin\StatCategoryItemController::class, 'reorder'])
        ->name('stat-category-items.reorder');
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
require __DIR__.'/incidents.php';
require __DIR__.'/locations.php';
