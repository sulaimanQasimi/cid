<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Change template and image_base64 from TEXT to LONGTEXT
        // Using raw SQL because Laravel's change() method doesn't support TEXT to LONGTEXT conversion directly
        DB::statement('ALTER TABLE criminal_fingerprints MODIFY COLUMN template LONGTEXT');
        DB::statement('ALTER TABLE criminal_fingerprints MODIFY COLUMN image_base64 LONGTEXT');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back to TEXT (note: this may fail if data exceeds TEXT limit)
        DB::statement('ALTER TABLE criminal_fingerprints MODIFY COLUMN template TEXT');
        DB::statement('ALTER TABLE criminal_fingerprints MODIFY COLUMN image_base64 TEXT');
    }
};
