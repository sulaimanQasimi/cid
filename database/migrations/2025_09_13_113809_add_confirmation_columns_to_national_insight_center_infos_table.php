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
            $table->boolean('confirmed')->default(false)->after('updated_by');
            $table->unsignedBigInteger('confirmed_by')->nullable()->after('confirmed');
            $table->timestamp('confirmed_at')->nullable()->after('confirmed_by');
            
            $table->foreign('confirmed_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('national_insight_center_infos', function (Blueprint $table) {
            $table->dropForeign(['confirmed_by']);
            $table->dropColumn(['confirmed', 'confirmed_by', 'confirmed_at']);
        });
    }
};
