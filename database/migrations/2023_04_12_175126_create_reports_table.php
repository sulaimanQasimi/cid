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
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->morphs('reportable'); // Polymorphic relationship (model_type, model_id fields)
            $table->foreignId('created_by')->constrained('users');
            $table->json('properties')->nullable(); // JSON column to store date, created_by and other properties
            $table->timestamps();

            // Index to improve query performance
            $table->index('code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
