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
        Schema::table('visitors', function (Blueprint $table) {
            // Add missing columns if they don't exist
            if (!Schema::hasColumn('visitors', 'ip_address')) {
                $table->string('ip_address', 45)->nullable()->index();
            }
            
            if (!Schema::hasColumn('visitors', 'user_agent')) {
                $table->text('user_agent')->nullable();
            }
            
            if (!Schema::hasColumn('visitors', 'country')) {
                $table->string('country')->nullable();
            }
            
            if (!Schema::hasColumn('visitors', 'city')) {
                $table->string('city')->nullable();
            }
            
            if (!Schema::hasColumn('visitors', 'region')) {
                $table->string('region')->nullable();
            }
            
            if (!Schema::hasColumn('visitors', 'latitude')) {
                $table->decimal('latitude', 10, 8)->nullable();
            }
            
            if (!Schema::hasColumn('visitors', 'longitude')) {
                $table->decimal('longitude', 11, 8)->nullable();
            }
            
            if (!Schema::hasColumn('visitors', 'user_id')) {
                $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            }
            
            if (!Schema::hasColumn('visitors', 'session_id')) {
                $table->string('session_id')->nullable()->index();
            }
            
            if (!Schema::hasColumn('visitors', 'url')) {
                $table->text('url')->nullable();
            }
            
            if (!Schema::hasColumn('visitors', 'referrer')) {
                $table->text('referrer')->nullable();
            }
            
            if (!Schema::hasColumn('visitors', 'method')) {
                $table->string('method', 10)->default('GET');
            }
            
            if (!Schema::hasColumn('visitors', 'visitable_type')) {
                $table->string('visitable_type');
            }
            
            if (!Schema::hasColumn('visitors', 'visitable_id')) {
                $table->unsignedBigInteger('visitable_id');
            }
            
            if (!Schema::hasColumn('visitors', 'visited_at')) {
                $table->timestamp('visited_at')->useCurrent();
            }
            
            if (!Schema::hasColumn('visitors', 'duration_seconds')) {
                $table->integer('duration_seconds')->nullable();
            }
            
            if (!Schema::hasColumn('visitors', 'device_type')) {
                $table->string('device_type')->nullable();
            }
            
            if (!Schema::hasColumn('visitors', 'browser')) {
                $table->string('browser')->nullable();
            }
            
            if (!Schema::hasColumn('visitors', 'browser_version')) {
                $table->string('browser_version')->nullable();
            }
            
            if (!Schema::hasColumn('visitors', 'platform')) {
                $table->string('platform')->nullable();
            }
            
            if (!Schema::hasColumn('visitors', 'platform_version')) {
                $table->string('platform_version')->nullable();
            }
            
            if (!Schema::hasColumn('visitors', 'is_bounce')) {
                $table->boolean('is_bounce')->default(false);
            }
            
            if (!Schema::hasColumn('visitors', 'metadata')) {
                $table->json('metadata')->nullable();
            }
        });

        // Add indexes if they don't exist
        Schema::table('visitors', function (Blueprint $table) {
            // Check if indexes exist before adding them
            $indexes = $this->getIndexes('visitors');
            
            if (!in_array('visitors_visited_at_index', $indexes)) {
                $table->index(['visited_at']);
            }
            
            if (!in_array('visitors_user_id_visited_at_index', $indexes)) {
                $table->index(['user_id', 'visited_at']);
            }
            
            if (!in_array('visitors_ip_address_visited_at_index', $indexes)) {
                $table->index(['ip_address', 'visited_at']);
            }
            
            if (!in_array('visitors_visitable_type_visitable_id_index', $indexes)) {
                $table->index(['visitable_type', 'visitable_id']);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('visitors', function (Blueprint $table) {
            // Remove indexes
            $table->dropIndex(['visited_at']);
            $table->dropIndex(['user_id', 'visited_at']);
            $table->dropIndex(['ip_address', 'visited_at']);
            $table->dropIndex(['visitable_type', 'visitable_id']);
            
            // Remove columns
            $table->dropColumn([
                'ip_address', 'user_agent', 'country', 'city', 'region',
                'latitude', 'longitude', 'user_id', 'session_id', 'url',
                'referrer', 'method', 'visitable_type', 'visitable_id',
                'visited_at', 'duration_seconds', 'device_type', 'browser',
                'browser_version', 'platform', 'platform_version', 'is_bounce', 'metadata'
            ]);
        });
    }

    /**
     * Get existing indexes for a table
     */
    private function getIndexes(string $tableName): array
    {
        $indexes = [];
        $results = \DB::select("SHOW INDEX FROM {$tableName}");
        
        foreach ($results as $result) {
            $indexes[] = $result->Key_name;
        }
        
        return array_unique($indexes);
    }
};
