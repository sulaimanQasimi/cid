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
        Schema::create('report_stats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('incident_report_id')->constrained('incident_reports')->cascadeOnDelete();
            $table->foreignId('stat_category_item_id')->constrained('stat_category_items');
            $table->integer('integer_value')->nullable();
            $table->string('string_value')->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users');
            $table->timestamps();
            $table->softDeletes();

            // Create a unique constraint to ensure each incident report has only one entry per stat item
            $table->unique(['incident_report_id', 'stat_category_item_id'], 'unique_report_stat_item');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('report_stats');
    }
};
