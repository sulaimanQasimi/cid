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
        Schema::create('criminal_fingerprints', function (Blueprint $table) {
            $table->id();
            $table->foreignId('criminal_id')->constrained('criminals')->onDelete('cascade');
            $table->enum('finger_position', [
                'right_thumb',
                'right_index',
                'right_middle',
                'right_ring',
                'right_pinky',
                'left_thumb',
                'left_index',
                'left_middle',
                'left_ring',
                'left_pinky'
            ]);
            $table->text('template'); // Base64 encoded template
            $table->text('image_base64'); // Base64 encoded image
            $table->integer('quality_score')->nullable();
            $table->timestamp('captured_at')->nullable();
            $table->foreignId('captured_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            
            // Ensure one fingerprint per position per criminal
            $table->unique(['criminal_id', 'finger_position']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('criminal_fingerprints');
    }
};
