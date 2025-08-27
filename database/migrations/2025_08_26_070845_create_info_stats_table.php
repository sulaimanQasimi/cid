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
        Schema::create('info_stats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('info_type_id')->constrained()->onDelete('cascade');
            $table->foreignId('stat_category_item_id')->constrained()->onDelete('cascade');
            $table->integer('integer_value')->nullable();
            $table->string('string_value')->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();

            // Ensure unique combination of info_type and stat_category_item
            $table->unique(['info_type_id', 'stat_category_item_id'], 'info_stats_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('info_stats');
    }
};
