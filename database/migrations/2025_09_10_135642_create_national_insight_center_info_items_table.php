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
            $table->unsignedBigInteger("info_category_id")->nullable();
            $table->unsignedBigInteger("department_id")->nullable();
            $table->string("name")->nullable();
            $table->string("code")->nullable();
            $table->text("description")->nullable();
            $table->json("value")->nullable();
            $table->unsignedBigInteger("user_id")->nullable();
            $table->boolean("confirmed")->default(false);
            $table->unsignedBigInteger("created_by")->nullable();
            $table->unsignedBigInteger("confirmed_by")->nullable();
            $table->timestamps();
            
            $table->foreign('national_insight_center_info_id', 'nic_info_items_nic_info_id_foreign')->references('id')->on('national_insight_center_infos')->onDelete('cascade');
            $table->foreign('info_category_id', 'nic_info_items_category_id_foreign')->references('id')->on('info_categories')->onDelete('set null');
            $table->foreign('department_id', 'nic_info_items_department_id_foreign')->references('id')->on('departments')->onDelete('set null');
            $table->foreign('user_id', 'nic_info_items_user_id_foreign')->references('id')->on('users')->onDelete('set null');
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
