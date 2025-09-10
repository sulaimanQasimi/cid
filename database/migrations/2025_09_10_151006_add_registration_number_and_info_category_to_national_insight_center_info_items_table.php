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
        Schema::table('national_insight_center_info_items', function (Blueprint $table) {
            $table->string('registration_number')->unique()->after('title');
            $table->unsignedBigInteger('info_category_id')->nullable()->after('registration_number');
            
            $table->foreign('info_category_id', 'nic_info_items_category_id_foreign')->references('id')->on('info_categories')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('national_insight_center_info_items', function (Blueprint $table) {
            $table->dropForeign('nic_info_items_category_id_foreign');
            $table->dropColumn(['registration_number', 'info_category_id']);
        });
    }
};
