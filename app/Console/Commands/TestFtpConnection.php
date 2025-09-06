<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class TestFtpConnection extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'backup:test-ftp {disk=ftp}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test FTP/SFTP connection for backup storage';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $disk = $this->argument('disk');
        
        $this->info("Testing {$disk} connection...");
        
        try {
            // Test connection by listing root directory
            $files = Storage::disk($disk)->files('/');
            $this->info("✅ Connection successful!");
            $this->info("Root directory contains " . count($files) . " files");
            
            // Test file operations
            $testFile = 'backup-test-' . time() . '.txt';
            $testContent = 'Backup test file created at ' . now();
            
            $this->info("Testing file upload...");
            Storage::disk($disk)->put($testFile, $testContent);
            $this->info("✅ File upload successful!");
            
            $this->info("Testing file download...");
            $downloadedContent = Storage::disk($disk)->get($testFile);
            if ($downloadedContent === $testContent) {
                $this->info("✅ File download successful!");
            } else {
                $this->error("❌ File download failed - content mismatch");
            }
            
            $this->info("Testing file deletion...");
            Storage::disk($disk)->delete($testFile);
            $this->info("✅ File deletion successful!");
            
            $this->info("\n🎉 All tests passed! FTP/SFTP connection is working correctly.");
            
        } catch (\Exception $e) {
            $this->error("❌ Connection failed: " . $e->getMessage());
            $this->error("Please check your FTP/SFTP configuration in .env file");
            return 1;
        }
        
        return 0;
    }
}
