<?php

namespace Database\Seeders;

use App\Models\Visitor;
use App\Models\User;
use App\Models\Criminal;
use App\Models\Incident;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class VisitorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $criminals = Criminal::all();
        $incidents = Incident::all();

        // Sample IP addresses
        $ipAddresses = [
            '192.168.1.100',
            '10.0.0.50',
            '172.16.0.25',
            '203.0.113.1',
            '198.51.100.1',
            '127.0.0.1',
        ];

        // Sample user agents
        $userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
            'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        ];

        // Sample browsers and platforms
        $browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
        $platforms = ['Windows', 'macOS', 'iOS', 'Android', 'Linux'];
        $deviceTypes = ['desktop', 'mobile', 'tablet'];

        // Sample countries and cities
        $locations = [
            ['country' => 'Afghanistan', 'city' => 'Kabul', 'region' => 'Kabul'],
            ['country' => 'Afghanistan', 'city' => 'Kandahar', 'region' => 'Kandahar'],
            ['country' => 'Afghanistan', 'city' => 'Herat', 'region' => 'Herat'],
            ['country' => 'Pakistan', 'city' => 'Islamabad', 'region' => 'Islamabad'],
            ['country' => 'Pakistan', 'city' => 'Lahore', 'region' => 'Punjab'],
            ['country' => 'Iran', 'city' => 'Tehran', 'region' => 'Tehran'],
        ];

        // Create sample visitors for criminals
        if ($criminals->count() > 0) {
            foreach ($criminals->take(5) as $criminal) {
                $this->createSampleVisitors($criminal, $users, $ipAddresses, $userAgents, $browsers, $platforms, $deviceTypes, $locations);
            }
        }

        // Create sample visitors for incidents
        if ($incidents->count() > 0) {
            foreach ($incidents->take(3) as $incident) {
                $this->createSampleVisitors($incident, $users, $ipAddresses, $userAgents, $browsers, $platforms, $deviceTypes, $locations);
            }
        }

        // Create sample page visits
        $this->createPageVisits($users, $ipAddresses, $userAgents, $browsers, $platforms, $deviceTypes, $locations);

        $this->command->info('Visitor data seeded successfully!');
    }

    /**
     * Create sample visitors for a specific model.
     */
    protected function createSampleVisitors($model, $users, $ipAddresses, $userAgents, $browsers, $platforms, $deviceTypes, $locations): void
    {
        $visitorCount = rand(3, 15); // Random number of visitors per model

        for ($i = 0; $i < $visitorCount; $i++) {
            $location = $locations[array_rand($locations)];
            $userAgent = $userAgents[array_rand($userAgents)];
            $browser = $browsers[array_rand($browsers)];
            $platform = $platforms[array_rand($platforms)];
            $deviceType = $deviceTypes[array_rand($deviceTypes)];

            $visitData = [
                'ip_address' => $ipAddresses[array_rand($ipAddresses)],
                'user_agent' => $userAgent,
                'user_id' => $users->count() > 0 ? $users->random()->id : null,
                'session_id' => 'session_' . uniqid(),
                'url' => 'http://localhost/' . strtolower(class_basename($model)) . '/' . $model->id,
                'referrer' => 'http://localhost/dashboard',
                'method' => 'GET',
                'visitable_type' => get_class($model),
                'visitable_id' => $model->id,
                'visited_at' => Carbon::now()->subDays(rand(0, 30))->subHours(rand(0, 23))->subMinutes(rand(0, 59)),
                'duration_seconds' => rand(30, 1800), // 30 seconds to 30 minutes
                'device_type' => $deviceType,
                'browser' => $browser,
                'browser_version' => rand(80, 120) . '.0.' . rand(1000, 9999) . '.' . rand(100, 999),
                'platform' => $platform,
                'platform_version' => rand(10, 15) . '.' . rand(0, 9) . '.' . rand(0, 9),
                'is_bounce' => rand(0, 1) === 1, // 50% chance of being a bounce
                'country' => $location['country'],
                'city' => $location['city'],
                'region' => $location['region'],
                'latitude' => rand(30, 40) + (rand(0, 999999) / 1000000),
                'longitude' => rand(60, 80) + (rand(0, 999999) / 1000000),
                'metadata' => [
                    'language' => 'en-US',
                    'accept_language' => 'en-US,en;q=0.9',
                    'accept_encoding' => 'gzip, deflate, br',
                    'connection' => 'keep-alive',
                    'host' => 'localhost',
                    'user_agent_parsed' => [
                        'is_robot' => false,
                        'is_phone' => $deviceType === 'mobile',
                        'is_desktop' => $deviceType === 'desktop',
                        'is_tablet' => $deviceType === 'tablet',
                        'device' => $deviceType,
                        'languages' => ['en-US', 'en'],
                    ],
                ],
            ];

            Visitor::create($visitData);
        }
    }

    /**
     * Create sample page visits.
     */
    protected function createPageVisits($users, $ipAddresses, $userAgents, $browsers, $platforms, $deviceTypes, $locations): void
    {
        $pages = [
            'dashboard' => 'Dashboard',
            'criminals.index' => 'Criminals List',
            'incidents.index' => 'Incidents List',
            'reports.index' => 'Reports List',
            'users.index' => 'Users List',
        ];

        foreach ($pages as $routeName => $pageName) {
            $visitCount = rand(5, 25); // Random number of page visits

            for ($i = 0; $i < $visitCount; $i++) {
                $location = $locations[array_rand($locations)];
                $userAgent = $userAgents[array_rand($userAgents)];
                $browser = $browsers[array_rand($browsers)];
                $platform = $platforms[array_rand($platforms)];
                $deviceType = $deviceTypes[array_rand($deviceTypes)];

                $visitData = [
                    'ip_address' => $ipAddresses[array_rand($ipAddresses)],
                    'user_agent' => $userAgent,
                    'user_id' => $users->count() > 0 ? $users->random()->id : null,
                    'session_id' => 'session_' . uniqid(),
                    'url' => 'http://localhost/' . str_replace('.', '/', $routeName),
                    'referrer' => 'http://localhost/dashboard',
                    'method' => 'GET',
                    'visitable_type' => 'Page',
                    'visitable_id' => $i + 1, // Use numeric ID for pages
                    'visited_at' => Carbon::now()->subDays(rand(0, 30))->subHours(rand(0, 23))->subMinutes(rand(0, 59)),
                    'duration_seconds' => rand(30, 1800),
                    'device_type' => $deviceType,
                    'browser' => $browser,
                    'browser_version' => rand(80, 120) . '.0.' . rand(1000, 9999) . '.' . rand(100, 999),
                    'platform' => $platform,
                    'platform_version' => rand(10, 15) . '.' . rand(0, 9) . '.' . rand(0, 9),
                    'is_bounce' => rand(0, 1) === 1,
                    'country' => $location['country'],
                    'city' => $location['city'],
                    'region' => $location['region'],
                    'latitude' => rand(30, 40) + (rand(0, 999999) / 1000000),
                    'longitude' => rand(60, 80) + (rand(0, 999999) / 1000000),
                    'metadata' => [
                        'page_name' => $pageName,
                        'route_name' => $routeName,
                        'language' => 'en-US',
                        'accept_language' => 'en-US,en;q=0.9',
                        'accept_encoding' => 'gzip, deflate, br',
                        'connection' => 'keep-alive',
                        'host' => 'localhost',
                        'user_agent_parsed' => [
                            'is_robot' => false,
                            'is_phone' => $deviceType === 'mobile',
                            'is_desktop' => $deviceType === 'desktop',
                            'is_tablet' => $deviceType === 'tablet',
                            'device' => $deviceType,
                            'languages' => ['en-US', 'en'],
                        ],
                    ],
                ];

                Visitor::create($visitData);
            }
        }
    }
}
