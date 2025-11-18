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
        // Drop all procedures first to avoid conflicts
        DB::unprepared("
            DROP PROCEDURE IF EXISTS `sp_get_ids_by_date`;
        ");
        DB::unprepared("
            DROP PROCEDURE IF EXISTS `sp_get_sub_items_by_ids`;
        ");
        DB::unprepared("
            DROP PROCEDURE IF EXISTS `sp_sum_integer_values_by_category`;
        ");

        // Create sp_get_ids_by_date
        DB::unprepared("
            CREATE PROCEDURE `sp_get_ids_by_date` (
                IN p_from_date DATE,
                IN p_to_date DATE
            )
            BEGIN
                SELECT 
                    id
                FROM national_insight_center_infos
                WHERE date BETWEEN p_from_date AND p_to_date
                ORDER BY date ASC;
            END;
        ");

        // Create sp_get_sub_items_by_ids
        DB::unprepared("
            CREATE PROCEDURE `sp_get_sub_items_by_ids` (
                IN p_info_ids TEXT
            )
            BEGIN
                -- Clean up the input CSV (remove spaces) and set collation
                SET @ids := REPLACE(p_info_ids, ' ', '') COLLATE utf8mb4_unicode_ci;

                SELECT
                    sci.id,
                    sci.national_insight_center_info_id,
                    sci.title,
                    sci.registration_number,
                    sci.info_category_id,
                    sci.department_id,
                    sci.province_id,
                    sci.district_id,
                    sci.description,
                    sci.date,
                    sci.created_by,
                    sci.confirmed,
                    sci.confirmed_by,
                    sci.created_at,
                    sci.updated_at,
                    p.name AS province_name,
                    d.name AS district_name,
                    dept.name AS department_name
                FROM national_insight_center_info_items AS sci
                LEFT JOIN national_insight_center_infos AS ni
                    ON sci.national_insight_center_info_id = ni.id
                LEFT JOIN provinces AS p
                    ON sci.province_id = p.id
                LEFT JOIN districts AS d
                    ON sci.district_id = d.id
                LEFT JOIN departments AS dept
                    ON sci.department_id = dept.id
                WHERE FIND_IN_SET(CAST(sci.national_insight_center_info_id AS CHAR) COLLATE utf8mb4_unicode_ci, @ids);
            END;
        ");

        // Create sp_sum_integer_values_by_category
        DB::unprepared("
            CREATE PROCEDURE `sp_sum_integer_values_by_category` (
                IN p_info_ids TEXT
            )
            BEGIN
                -- Clean up the input CSV (remove spaces) and set collation
                SET @ids := REPLACE(p_info_ids, ' ', '') COLLATE utf8mb4_unicode_ci;

                SELECT
                    sci.stat_category_item_id,

                    -- Stat Category Item Data
                    MAX(sci2.stat_category_id) AS stat_category_id,
                    MAX(sci2.parent_id) AS parent_id,
                    MAX(sci2.name) AS item_name,
                    MAX(sci2.label) AS item_label,
                    MAX(sci2.color) AS item_color,
                    MAX(sci2.status) AS item_status,
                    MAX(sci2.`order`) AS item_order,

                    -- Stat Category Data
                    MAX(sc.id) AS category_id,
                    MAX(sc.name) AS category_name,
                    MAX(sc.label) AS category_label,
                    MAX(sc.color) AS category_color,
                    MAX(sc.status) AS category_status,

                    -- Aggregated Metric
                    SUM(sci.string_value) AS total_integer_value

                FROM info_stats AS sci
                INNER JOIN stat_category_items AS sci2
                    ON sci.stat_category_item_id = sci2.id
                LEFT JOIN stat_categories AS sc
                    ON sci2.stat_category_id = sc.id
                WHERE FIND_IN_SET(CAST(sci.national_insight_center_info_id AS CHAR) COLLATE utf8mb4_unicode_ci, @ids)
                GROUP BY sci.stat_category_item_id;
            END;
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared("
        DROP PROCEDURE IF EXISTS `sp_get_ids_by_date`;
        DROP PROCEDURE IF EXISTS `sp_get_sub_items_by_ids`;
        DROP PROCEDURE IF EXISTS `sp_sum_integer_values_by_category`;
        ");
    }
};
