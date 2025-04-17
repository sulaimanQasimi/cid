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
        // Drop existing foreign key from incident_reports table
        Schema::table('incident_reports', function (Blueprint $table) {
            $table->dropForeign(['incident_id']);
            $table->dropColumn('incident_id');
        });

        // Add incident_report_id to incidents table
        Schema::table('incidents', function (Blueprint $table) {
            $table->unsignedBigInteger('incident_report_id')->nullable()->after('incident_category_id');
            $table->foreign('incident_report_id')->references('id')->on('incident_reports')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove incident_report_id from incidents
        Schema::table('incidents', function (Blueprint $table) {
            $table->dropForeign(['incident_report_id']);
            $table->dropColumn('incident_report_id');
        });

        // Add incident_id back to incident_reports
        Schema::table('incident_reports', function (Blueprint $table) {
            $table->unsignedBigInteger('incident_id')->after('id');
            $table->foreign('incident_id')->references('id')->on('incidents')->onDelete('cascade');
        });
    }
};
