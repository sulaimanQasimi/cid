<?php

namespace App\Http\Controllers;

use App\Models\Incident;
use App\Models\IncidentReport;
use App\Models\Info;
use App\Models\Department;
use App\Models\District;
use App\Models\Province;
use App\Models\Meeting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{

    /**
     * Display the dashboard with comprehensive statistics.
     */
    public function index(Request $request)
    {
        // Get basic counts (non-sensitive)
        $stats = $this->getBasicStats();
        
        // Get location-based statistics
        $locationStats = $this->getLocationStats();
        
        // Get incident statistics by location
        $incidentStats = $this->getIncidentStats();
        
        // Get system health data (non-sensitive)
        $systemHealth = $this->getSystemHealth();

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'locationStats' => $locationStats,
            'incidentStats' => $incidentStats,
            'systemHealth' => $systemHealth,
        ]);
    }

    /**
     * Get basic statistics for the dashboard (non-sensitive data only).
     */
    protected function getBasicStats(): array
    {
        return [
            'total_incidents' => Incident::count(),
            'total_departments' => Department::count(),
            'total_districts' => District::count(),
            'total_provinces' => Province::count(),
            'total_meetings' => Meeting::count(),
            'total_info_items' => Info::count(),
            'total_reports' => IncidentReport::count(),
            'active_incidents' => Incident::where('status', '!=', 'resolved')->count(),
            'pending_reports' => IncidentReport::where('report_status', 'submitted')->count(),
        ];
    }

    /**
     * Get location-based statistics for the map visualization.
     */
    protected function getLocationStats(): array
    {
        // Get province statistics
        $provinceStats = Province::withCount(['districts', 'incidents'])
            ->get()
            ->map(function ($province) {
                return [
                    'id' => $province->id,
                    'name' => $province->name,
                    'code' => $province->code,
                    'capital' => $province->capital,
                    'districts_count' => $province->districts_count,
                    'incidents_count' => $province->incidents_count,
                    'status' => $province->status,
                ];
            })
            ->toArray();

        // Get district statistics
        $districtStats = District::withCount(['incidents'])
            ->with('province:id,name,code')
            ->get()
            ->map(function ($district) {
                return [
                    'id' => $district->id,
                    'name' => $district->name,
                    'code' => $district->code,
                    'province_id' => $district->province_id,
                    'province_name' => $district->province->name ?? 'Unknown',
                    'province_code' => $district->province->code ?? '',
                    'incidents_count' => $district->incidents_count,
                    'status' => $district->status,
                ];
            })
            ->toArray();

        // Get incidents by location for map data
        $incidentsByLocation = Incident::select('district_id', 'status', DB::raw('count(*) as count'))
            ->whereNotNull('district_id')
            ->with('district:id,name,province_id')
            ->with('district.province:id,name')
            ->groupBy('district_id', 'status')
            ->get()
            ->groupBy('district_id')
            ->map(function ($districtIncidents) {
                $total = $districtIncidents->sum('count');
                $resolved = $districtIncidents->where('status', 'resolved')->sum('count');
                $active = $total - $resolved;
                
                return [
                    'total' => $total,
                    'resolved' => $resolved,
                    'active' => $active,
                    'district_name' => $districtIncidents->first()->district->name ?? 'Unknown',
                    'province_name' => $districtIncidents->first()->district->province->name ?? 'Unknown',
                ];
            })
            ->toArray();

        return [
            'provinces' => $provinceStats,
            'districts' => $districtStats,
            'incidents_by_location' => $incidentsByLocation,
        ];
    }



    /**
     * Get incident statistics (non-sensitive data only).
     */
    protected function getIncidentStats(): array
    {
        $today = Carbon::today();
        $thisWeek = Carbon::now()->startOfWeek();
        $thisMonth = Carbon::now()->startOfMonth();

        return [
            'total_incidents' => Incident::count(),
            'today_incidents' => Incident::whereDate('incident_date', $today)->count(),
            'this_week_incidents' => Incident::where('incident_date', '>=', $thisWeek)->count(),
            'this_month_incidents' => Incident::where('incident_date', '>=', $thisMonth)->count(),
            'resolved_incidents' => Incident::where('status', 'resolved')->count(),
            'pending_incidents' => Incident::where('status', 'reported')->count(),
            'investigating_incidents' => Incident::where('status', 'investigating')->count(),
            'incidents_by_status' => Incident::select('status', DB::raw('count(*) as count'))
                ->whereNotNull('status')
                ->groupBy('status')
                ->pluck('count', 'status')
                ->toArray(),
        ];
    }



    /**
     * Get system health information (non-sensitive data only).
     */
    protected function getSystemHealth(): array
    {
        return [
            'system_status' => 'operational',
            'database_size' => $this->getDatabaseSize(),
            'storage_usage' => $this->getStorageUsage(),
        ];
    }

    /**
     * Get database size information.
     */
    protected function getDatabaseSize(): string
    {
        try {
            $connection = DB::connection();
            $driver = $connection->getDriverName();
            
            if ($driver === 'pgsql') {
                $size = DB::select('SELECT pg_size_pretty(pg_database_size(current_database())) as size')[0]->size ?? 'Unknown';
                return $size;
            } elseif ($driver === 'mysql') {
                $size = DB::select('SELECT ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS size FROM information_schema.tables WHERE table_schema = DATABASE()')[0]->size ?? 'Unknown';
                return $size . ' MB';
            } else {
                return 'Unknown';
            }
        } catch (\Exception $e) {
            return 'Unknown';
        }
    }

    /**
     * Get storage usage information.
     */
    protected function getStorageUsage(): array
    {
        $storagePath = storage_path();
        $totalSpace = disk_total_space($storagePath);
        $freeSpace = disk_free_space($storagePath);
        $usedSpace = $totalSpace - $freeSpace;
        $usagePercentage = $totalSpace > 0 ? round(($usedSpace / $totalSpace) * 100, 2) : 0;

        return [
            'total' => $this->formatBytes($totalSpace),
            'used' => $this->formatBytes($usedSpace),
            'free' => $this->formatBytes($freeSpace),
            'usage_percentage' => $usagePercentage,
        ];
    }

    /**
     * Format bytes to human readable format.
     */
    protected function formatBytes($bytes, $precision = 2): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, $precision) . ' ' . $units[$i];
    }
}
