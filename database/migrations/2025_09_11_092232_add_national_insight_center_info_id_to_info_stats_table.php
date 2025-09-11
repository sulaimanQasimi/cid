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
        Schema::table('info_stats', function (Blueprint $table) {
            $table->foreignId('national_insight_center_info_id')->nullable()->constrained()->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('info_stats', function (Blueprint $table) {
            $table->dropForeign(['national_insight_center_info_id']);
            $table->dropColumn('national_insight_center_info_id');
        });
    }
};
