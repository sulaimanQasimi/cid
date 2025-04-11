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
        Schema::create('meeting_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('meeting_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('peer_id')->nullable();
            $table->json('ice_candidates')->nullable();
            $table->json('session_data')->nullable();
            $table->json('peer_connections')->nullable();
            $table->json('offline_data')->nullable();
            $table->dateTime('session_started_at')->nullable();
            $table->dateTime('session_ended_at')->nullable();
            $table->timestamps();
        });

        Schema::create('meeting_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('meeting_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('message');
            $table->boolean('is_offline')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meeting_messages');
        Schema::dropIfExists('meeting_sessions');
    }
};
