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
        Schema::create('incidents', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->date('incident_date');
            $table->time('incident_time')->nullable();
            $table->unsignedBigInteger('district_id');
            $table->foreign('district_id')->references('id')->on('districts')->onDelete('cascade');
            $table->string('location')->nullable();
            $table->string('coordinates')->nullable(); // lat,long format
            $table->integer('casualties')->default(0);
            $table->integer('injuries')->default(0);
            $table->string('incident_type'); // can be enum if we define specific types
            $table->string('status')->default('reported'); // reported, investigating, resolved, etc.
            $table->unsignedBigInteger('reported_by')->nullable();
            $table->foreign('reported_by')->references('id')->on('users')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('incidents');
    }
};
