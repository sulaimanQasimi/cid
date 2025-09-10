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
        Schema::create('national_insight_center_info_accesses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("national_insight_center_info_id");
            $table->unsignedBigInteger("user_id");
            $table->timestamps();
            
            $table->foreign('national_insight_center_info_id', 'nic_info_accesses_nic_info_id_foreign')->references('id')->on('national_insight_center_infos')->onDelete('cascade');
            $table->foreign('user_id', 'nic_info_accesses_user_id_foreign')->references('id')->on('users')->onDelete('cascade');
            
            $table->unique(['national_insight_center_info_id', 'user_id'], 'nic_info_accesses_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('national_insight_center_info_accesses');
    }
};
