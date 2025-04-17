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
        Schema::create('stat_category_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stat_category_id')->constrained('stat_categories')->cascadeOnDelete();
            $table->string('name');
            $table->string('label');
            $table->string('color')->nullable();
            $table->string('status')->default('active');
            $table->integer('order')->default(0);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            // Ensure name is unique within a category
            $table->unique(['stat_category_id', 'name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stat_category_items');
    }
};
