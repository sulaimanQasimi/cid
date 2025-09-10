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
            $table->unsignedBigInteger('national_insight_center_info_item_id')->nullable()->after('info_type_id');
            $table->foreign('national_insight_center_info_item_id', 'info_stats_nic_item_id_foreign')->references('id')->on('national_insight_center_info_items')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('info_stats', function (Blueprint $table) {
            $table->dropForeign('info_stats_nic_item_id_foreign');
            $table->dropColumn('national_insight_center_info_item_id');
        });
    }
};
