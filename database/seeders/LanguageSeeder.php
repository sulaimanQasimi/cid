<?php

namespace Database\Seeders;

use App\Models\Language;
use Illuminate\Database\Seeder;

class LanguageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Add English as default language
        Language::create([
            'code' => 'en',
            'name' => 'English',
            'direction' => 'ltr',
            'active' => true,
            'default' => true,
        ]);

        // Add Pashto
        Language::create([
            'code' => 'ps',
            'name' => 'پښتو',
            'direction' => 'rtl',
            'active' => true,
            'default' => false,
        ]);

        // Add Dari/Persian
        Language::create([
            'code' => 'fa',
            'name' => 'دری',
            'direction' => 'rtl',
            'active' => true,
            'default' => false,
        ]);
    }
}