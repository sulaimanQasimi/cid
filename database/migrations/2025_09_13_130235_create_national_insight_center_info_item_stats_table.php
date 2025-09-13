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
        Schema::create('national_insight_center_info_item_stats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('national_insight_center_info_item_id')
                  ->constrained('national_insight_center_info_items', 'id')
                  ->onDelete('cascade')
                  ->name('nicii_stats_item_id_foreign');
            $table->foreignId('stat_category_item_id')
                  ->constrained()
                  ->onDelete('cascade')
                  ->name('nicii_stats_category_item_id_foreign');
            $table->string('string_value');
            $table->text('notes')->nullable();
            $table->foreignId('created_by')
                  ->constrained('users', 'id')
                  ->onDelete('cascade')
                  ->name('nicii_stats_created_by_foreign');
            $table->timestamps();

            $table->index(['national_insight_center_info_item_id', 'stat_category_item_id'], 'nicii_stats_item_category_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('national_insight_center_info_item_stats');
    }
};