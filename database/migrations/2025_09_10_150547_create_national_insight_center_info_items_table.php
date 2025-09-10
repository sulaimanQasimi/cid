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
        Schema::create('national_insight_center_info_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("national_insight_center_info_id");
            $table->string("title")->nullable();
            $table->unsignedBigInteger("province_id")->nullable();
            $table->unsignedBigInteger("district_id")->nullable();
            $table->text("description")->nullable();
            $table->date("date")->nullable();
            $table->unsignedBigInteger("created_by")->nullable();
            $table->boolean("confirmed")->default(false);
            $table->unsignedBigInteger("confirmed_by")->nullable();
            $table->timestamps();
            
            $table->foreign('national_insight_center_info_id', 'nic_info_items_nic_info_id_foreign')->references('id')->on('national_insight_center_infos')->onDelete('cascade');
            $table->foreign('province_id', 'nic_info_items_province_id_foreign')->references('id')->on('provinces')->onDelete('set null');
            $table->foreign('district_id', 'nic_info_items_district_id_foreign')->references('id')->on('districts')->onDelete('set null');
            $table->foreign('created_by', 'nic_info_items_created_by_foreign')->references('id')->on('users')->onDelete('set null');
            $table->foreign('confirmed_by', 'nic_info_items_confirmed_by_foreign')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('national_insight_center_info_items');
    }
};
