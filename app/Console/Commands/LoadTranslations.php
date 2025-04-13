<?php

namespace App\Console\Commands;

use App\Models\Language;
use App\Models\Translation;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class LoadTranslations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'translations:load {--group=general} {--force : Overwrite existing translations}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Load translations from JSON files into the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Loading translations from JSON files...');

        $translationsPath = resource_path('js/lib/i18n/translations');

        if (!File::exists($translationsPath)) {
            $this->error("Translations directory does not exist: $translationsPath");
            return Command::FAILURE;
        }

        $files = File::files($translationsPath);
        $group = $this->option('group');
        $force = $this->option('force');

        $total = 0;

        foreach ($files as $file) {
            $filename = $file->getFilename();
            $langCode = pathinfo($filename, PATHINFO_FILENAME);

            // Skip non-JSON files
            if (pathinfo($filename, PATHINFO_EXTENSION) !== 'json') {
                continue;
            }

            // Find or create language
            $language = Language::where('code', $langCode)->first();

            if (!$language) {
                $this->warn("Language with code '$langCode' not found, skipping...");
                continue;
            }

            $this->info("Processing translations for language: {$language->name} ({$language->code})");

            try {
                $translations = json_decode(File::get($file->getPathname()), true);

                if (!is_array($translations)) {
                    $this->error("Invalid JSON format in file: {$filename}");
                    continue;
                }

                $count = $this->loadTranslationsRecursive($translations, $language->id, $group, '', $force);
                $total += $count;

                $this->info("Added/updated $count translations for {$language->name}");

            } catch (\Exception $e) {
                $this->error("Error processing file {$filename}: " . $e->getMessage());
            }
        }

        $this->info("Finished! Total translations added/updated: $total");

        return Command::SUCCESS;
    }

    /**
     * Recursively load translations from a nested array
     */
    private function loadTranslationsRecursive(array $translations, int $languageId, string $group, string $prefix = '', bool $force = false): int
    {
        $count = 0;

        foreach ($translations as $key => $value) {
            $fullKey = $prefix ? "$prefix.$key" : $key;

            if (is_array($value)) {
                // If value is an array, use the key as a namespace and recurse
                $count += $this->loadTranslationsRecursive($value, $languageId, $group, $fullKey, $force);
            } else {
                // Check if translation already exists
                $translation = Translation::where('language_id', $languageId)
                    ->where('key', $fullKey)
                    ->where('group', $group)
                    ->first();

                if (!$translation) {
                    // Create new translation if it doesn't exist
                    Translation::create([
                        'language_id' => $languageId,
                        'key' => $fullKey,
                        'value' => $value,
                        'group' => $group,
                    ]);
                    $count++;
                } elseif ($force) {
                    // Update translation if force option is provided
                    $translation->update(['value' => $value]);
                    $count++;
                }
            }
        }

        return $count;
    }
}
