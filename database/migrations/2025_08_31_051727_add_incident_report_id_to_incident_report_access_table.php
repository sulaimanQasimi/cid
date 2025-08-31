<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('incident_report_access', function (Blueprint $table) {
            // Add incident_report_id foreign key
            $table->foreignId('incident_report_id')->nullable()->constrained('incident_reports')->onDelete('cascade');
            
            // Drop the old unique constraint
            $table->dropUnique('unique_active_user_access');
            
            // Add new unique constraint that includes incident_report_id
            $table->unique(['user_id', 'incident_report_id', 'is_active'], 'unique_active_user_report_access');
            
            // Add index for incident_report_id
            $table->index(['incident_report_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('incident_report_access', function (Blueprint $table) {
            // Drop the new unique constraint
            $table->dropUnique('unique_active_user_report_access');
            
            // Drop the incident_report_id index
            $table->dropIndex(['incident_report_id']);
            
            // Drop the incident_report_id foreign key
            $table->dropForeign(['incident_report_id']);
            $table->dropColumn('incident_report_id');
            
            // Restore the old unique constraint
            $table->unique(['user_id', 'is_active'], 'unique_active_user_access');
        });
    }
};
