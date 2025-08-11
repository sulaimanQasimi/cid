<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Database\Seeders\AssignSuperAdminSeeder;

class AssignSuperAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:super {email? : Email of the user to assign superadmin role}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Assign superadmin role with all permissions to a user';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Assigning superadmin role with all permissions...');
        
        // Run the seeder
        $seeder = new AssignSuperAdminSeeder();
        $seeder->setCommand($this);
        $seeder->run();
        
        $this->info('Superadmin role assignment completed successfully!');
        
        return Command::SUCCESS;
    }
}
