<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * This is a fix to ensure that the proper order of migrations is maintained.
     * Since we changed the relationship direction, we need to ensure
     * that incident_reports table is created before incidents table references it.
     */
    public function up(): void
    {
        // This migration doesn't actually do anything, it just serves
        // to fix the order of migrations in case we need to re-run them
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No changes need to be reverted
    }
};
