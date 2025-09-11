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
            $table->unsignedBigInteger('department_id')->nullable()->after('info_category_id');
            $table->foreign('department_id', 'nic_info_items_department_id_foreign')->references('id')->on('departments')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('national_insight_center_info_items', function (Blueprint $table) {
            $table->dropForeign('nic_info_items_department_id_foreign');
            $table->dropColumn('department_id');
        });
    }
};
