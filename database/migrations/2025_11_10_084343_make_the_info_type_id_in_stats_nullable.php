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

Schema::table('info_stats', function (Blueprint $table) {
    $table->unsignedBigInteger('info_type_id')->nullable()->change();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
Schema::table('info_stats', function (Blueprint $table) {
    $table->unsignedBigInteger('info_type_id')->change();
});

    }
};
