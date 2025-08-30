<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Queue;
use Spatie\Backup\BackupDestination\Backup;
use Spatie\Backup\BackupDestination\BackupDestination;
use Spatie\Backup\Tasks\Backup\BackupJob;
use Spatie\Backup\Tasks\Backup\BackupJobFactory;
use Inertia\Inertia;
use App\Jobs\CreateBackupJob;

class BackupController extends Controller
{
    public function __construct()
    {
        $this->middleware('can:manage backups');
    }

    public function index()
    {
        $backups = $this->getBackups();
        
        return Inertia::render('Admin/Backup/Index', [
            'backups' => $backups,
            'backupPath' => config('backup.backup.destination.disks')[0] ?? 'local',
        ]);
    }

    public function create(Request $request)
    {
        $request->validate([
            'name' => 'nullable|string|max:255',
        ]);

        // Dispatch backup job to queue
        CreateBackupJob::dispatch($request->input('name'));

        return redirect()->route('backup.index')
            ->with('success', 'Backup job has been queued and will start shortly.');
    }

    public function download($filename)
    {
        $backupPath = config('backup.backup.destination.disks')[0] ?? 'local';
        $fullPath = "backups/{$filename}";

        if (!Storage::disk($backupPath)->exists($fullPath)) {
            abort(404, 'Backup file not found.');
        }

        return Storage::disk($backupPath)->download($fullPath);
    }

    public function delete($filename)
    {
        $backupPath = config('backup.backup.destination.disks')[0] ?? 'local';
        $fullPath = "backups/{$filename}";

        if (!Storage::disk($backupPath)->exists($fullPath)) {
            abort(404, 'Backup file not found.');
        }

        Storage::disk($backupPath)->delete($fullPath);

        return redirect()->route('backup.index')
            ->with('success', 'Backup file deleted successfully.');
    }

    public function status()
    {
        $backups = $this->getBackups();
        
        return response()->json([
            'backups' => $backups,
            'queue_status' => [
                'pending_jobs' => Queue::size('default'),
                'failed_jobs' => \DB::table('failed_jobs')->count(),
            ],
        ]);
    }

    private function getBackups()
    {
        $backupPath = config('backup.backup.destination.disks')[0] ?? 'local';
        $backups = [];

        if (Storage::disk($backupPath)->exists('backups')) {
            $files = Storage::disk($backupPath)->files('backups');
            
            foreach ($files as $file) {
                $filename = basename($file);
                $size = Storage::disk($backupPath)->size($file);
                $modified = Storage::disk($backupPath)->lastModified($file);
                
                $backups[] = [
                    'filename' => $filename,
                    'size' => $this->formatBytes($size),
                    'size_bytes' => $size,
                    'created_at' => date('Y-m-d H:i:s', $modified),
                    'created_at_timestamp' => $modified,
                ];
            }

            // Sort by creation date (newest first)
            usort($backups, function ($a, $b) {
                return $b['created_at_timestamp'] - $a['created_at_timestamp'];
            });
        }

        return $backups;
    }

    private function formatBytes($bytes, $precision = 2)
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, $precision) . ' ' . $units[$i];
    }
}
