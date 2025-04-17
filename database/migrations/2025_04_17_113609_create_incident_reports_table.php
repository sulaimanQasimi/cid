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
        Schema::create('incident_reports', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('incident_id');
            $table->foreign('incident_id')->references('id')->on('incidents')->onDelete('cascade');
            $table->string('report_number')->nullable();
            $table->text('details');
            $table->text('action_taken')->nullable();
            $table->text('recommendation')->nullable();
            $table->string('security_level')->default('normal'); // classified, restricted, normal, etc.
            $table->date('report_date');
            $table->string('report_status')->default('submitted'); // submitted, reviewed, approved, etc.
            $table->string('source')->nullable();
            $table->string('attachments')->nullable(); // JSON encoded array of file paths
            $table->unsignedBigInteger('submitted_by')->nullable();
            $table->foreign('submitted_by')->references('id')->on('users')->onDelete('set null');
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->foreign('approved_by')->references('id')->on('users')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('incident_reports');
    }
};
