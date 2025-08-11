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
        Schema::create('visitors', function (Blueprint $table) {
            $table->id();
            
            // IP and location information
            $table->string('ip_address', 45)->nullable()->index(); // IPv6 compatible
            $table->string('user_agent')->nullable();
            $table->string('country')->nullable();
            $table->string('city')->nullable();
            $table->string('region')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            
            // User information
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('session_id')->nullable()->index();
            
            // Page/Route information
            $table->string('url')->nullable();
            $table->string('referrer')->nullable();
            $table->string('method', 10)->default('GET'); // HTTP method
            
            // Morphable relationships
            $table->morphs('visitable'); // Creates visitable_type and visitable_id
            
            // Timing information
            $table->timestamp('visited_at')->useCurrent();
            $table->integer('duration_seconds')->nullable(); // Time spent on page
            
            // Additional tracking
            $table->string('device_type')->nullable(); // mobile, desktop, tablet
            $table->string('browser')->nullable();
            $table->string('browser_version')->nullable();
            $table->string('platform')->nullable(); // OS
            $table->string('platform_version')->nullable();
            
            // Status and metadata
            $table->boolean('is_bounce')->default(false); // Single page visit
            $table->json('metadata')->nullable(); // Additional data
            
            $table->timestamps();
            
            // Indexes for better performance
            $table->index(['visited_at']);
            $table->index(['user_id', 'visited_at']);
            $table->index(['ip_address', 'visited_at']);
            // Note: morphs('visitable') already creates an index on visitable_type and visitable_id
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visitors');
    }
};
