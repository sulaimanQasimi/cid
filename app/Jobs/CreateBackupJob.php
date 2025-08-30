<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;

class CreateBackupJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 3600; // 1 hour timeout
    public $tries = 3;

    protected $backupName;

    /**
     * Create a new job instance.
     */
    public function __construct($backupName = null)
    {
        $this->backupName = $backupName;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            Log::info('Starting backup job', ['name' => $this->backupName]);

            // Create backup using Spatie Backup
            $command = 'backup:run';
            $params = [];

            if ($this->backupName) {
                $params['--filename'] = $this->backupName;
            }

            Artisan::call($command, $params);

            Log::info('Backup job completed successfully', [
                'name' => $this->backupName,
                'output' => Artisan::output()
            ]);

        } catch (\Exception $e) {
            Log::error('Backup job failed', [
                'name' => $this->backupName,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Backup job failed permanently', [
            'name' => $this->backupName,
            'error' => $exception->getMessage(),
            'trace' => $exception->getTraceAsString()
        ]);
    }
}
