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
        Schema::table('national_insight_center_infos', function (Blueprint $table) {
            $table->dropUnique('national_insight_center_infos_date_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('national_insight_center_infos', function (Blueprint $table) {
            $table->unique('date', 'national_insight_center_infos_date_unique');
        });
    }
};

