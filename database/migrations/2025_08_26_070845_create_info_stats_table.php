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

            // Ensure only one value type is set
            $table->check('(integer_value IS NOT NULL AND string_value IS NULL) OR (integer_value IS NULL AND string_value IS NOT NULL)');
            
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
