<?php

namespace App\Console\Commands;

use App\Models\Language;
use App\Models\Translation;
use Illuminate\Console\Command;

class ExportTranslations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'translations:export {language?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Export translations to JSON files for frontend use';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $languageCode = $this->argument('language');

        // Get languages to export
        $query = Language::where('active', true);
        if ($languageCode) {
            $query->where('code', $languageCode);
        }
        $languages = $query->get();

        $this->info('Exporting translations for languages: ' . $languages->pluck('code')->implode(', '));

        foreach ($languages as $language) {
            $this->info("Processing language: {$language->code}");

            // Get all translations for this language
            $translations = Translation::getTranslations($language->code);

            // Ensure the directory exists
            $dir = resource_path('js/lib/i18n/translations');
            if (!file_exists($dir)) {
                mkdir($dir, 0755, true);
            }

            // Write the JSON file
            $filePath = $dir . '/' . $language->code . '.json';
            file_put_contents(
                $filePath,
                json_encode($translations, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
            );

            $this->info("Exported " . count($translations) . " translations to {$filePath}");
        }

        $this->info('Translations exported successfully!');

        return Command::SUCCESS;
    }
}
