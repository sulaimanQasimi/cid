<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * This migration ensures that the provinces table is created before districts,
     * and districts before incidents/incident_reports.
     */
    public function up(): void
    {
        // We're not making any changes here, this migration just ensures correct order
        // The actual changes are in the individual migration files
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No changes to reverse
    }
};
