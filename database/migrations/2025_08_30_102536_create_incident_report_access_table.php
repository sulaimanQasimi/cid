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
        Schema::create('incident_report_access', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('granted_by')->constrained('users')->onDelete('cascade');
            $table->enum('access_type', ['full', 'read_only', 'incidents_only'])->default('read_only');
            $table->text('notes')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            // Ensure a user can only have one active access record
            $table->unique(['user_id', 'is_active'], 'unique_active_user_access');
            
            // Indexes for better performance
            $table->index(['user_id', 'is_active']);
            $table->index(['granted_by']);
            $table->index(['expires_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('incident_report_access');
    }
};
