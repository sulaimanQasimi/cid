<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Str;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create permissions for all models with Persian labels
        $permissions = [
            // Criminal permissions
            ['name' => 'criminal.view_any', 'label' => 'مشاهده همه مجرمان'],
            ['name' => 'criminal.view', 'label' => 'مشاهده مجرم'],
            ['name' => 'criminal.create', 'label' => 'ایجاد مجرم'],
            ['name' => 'criminal.update', 'label' => 'ویرایش مجرم'],
            ['name' => 'criminal.delete', 'label' => 'حذف مجرم'],
            ['name' => 'criminal.restore', 'label' => 'بازیابی مجرم'],
            ['name' => 'criminal.force_delete', 'label' => 'حذف دائمی مجرم'],
            ['name' => 'criminal.view_comprehensive_list', 'label' => 'مشاهده فهرست مجرمین'],

            // Department permissions
            ['name' => 'department.view_any', 'label' => 'مشاهده همه بخش‌ها'],
            ['name' => 'department.view', 'label' => 'مشاهده بخش'],
            ['name' => 'department.create', 'label' => 'ایجاد بخش'],
            ['name' => 'department.update', 'label' => 'ویرایش بخش'],
            ['name' => 'department.delete', 'label' => 'حذف بخش'],
            ['name' => 'department.restore', 'label' => 'بازیابی بخش'],
            ['name' => 'department.force_delete', 'label' => 'حذف دائمی بخش'],

            // District permissions
            ['name' => 'district.view_any', 'label' => 'مشاهده همه ولسوالی‌ها'],
            ['name' => 'district.view', 'label' => 'مشاهده ولسوالی'],
            ['name' => 'district.create', 'label' => 'ایجاد ولسوالی'],
            ['name' => 'district.update', 'label' => 'ویرایش ولسوالی'],
            ['name' => 'district.delete', 'label' => 'حذف ولسوالی'],
            ['name' => 'district.restore', 'label' => 'بازیابی ولسوالی'],
            ['name' => 'district.force_delete', 'label' => 'حذف دائمی ولسوالی'],

            // Incident permissions
            ['name' => 'incident.view_any', 'label' => 'مشاهده همه حوادث'],
            ['name' => 'incident.view', 'label' => 'مشاهده حادثه'],
            ['name' => 'incident.create', 'label' => 'ایجاد حادثه'],
            ['name' => 'incident.update', 'label' => 'ویرایش حادثه'],
            ['name' => 'incident.delete', 'label' => 'حذف حادثه'],
            ['name' => 'incident.confirm', 'label' => 'تایید حادثه'],
            ['name' => 'incident.restore', 'label' => 'بازیابی حادثه'],
            ['name' => 'incident.force_delete', 'label' => 'حذف دائمی حادثه'],

            // Incident Category permissions
            ['name' => 'incident_category.view_any', 'label' => 'مشاهده همه دسته‌بندی‌های حوادث'],
            ['name' => 'incident_category.view', 'label' => 'مشاهده دسته‌بندی حادثه'],
            ['name' => 'incident_category.create', 'label' => 'ایجاد دسته‌بندی حادثه'],
            ['name' => 'incident_category.update', 'label' => 'ویرایش دسته‌بندی حادثه'],
            ['name' => 'incident_category.delete', 'label' => 'حذف دسته‌بندی حادثه'],
            ['name' => 'incident_category.restore', 'label' => 'بازیابی دسته‌بندی حادثه'],
            ['name' => 'incident_category.force_delete', 'label' => 'حذف دائمی دسته‌بندی حادثه'],

            // Incident Report permissions
            ['name' => 'incident_report.view_any', 'label' => 'مشاهده همه گزارش‌های حوادث'],
            ['name' => 'incident_report.view', 'label' => 'مشاهده گزارش حادثه'],
            ['name' => 'incident_report.create', 'label' => 'ایجاد گزارش حادثه'],
            ['name' => 'incident_report.update', 'label' => 'ویرایش گزارش حادثه'],
            ['name' => 'incident_report.delete', 'label' => 'حذف گزارش حادثه'],
            ['name' => 'incident_report.restore', 'label' => 'بازیابی گزارش حادثه'],
            ['name' => 'incident_report.force_delete', 'label' => 'حذف دائمی گزارش حادثه'],

            // Info permissions
            ['name' => 'info.view_any', 'label' => 'مشاهده همه اطلاعات'],
            ['name' => 'info.view', 'label' => 'مشاهده اطلاعات'],
            ['name' => 'info.create', 'label' => 'ایجاد اطلاعات'],
            ['name' => 'info.update', 'label' => 'ویرایش اطلاعات'],
            ['name' => 'info.delete', 'label' => 'حذف اطلاعات'],
            ['name' => 'info.confirm', 'label' => 'تایید اطلاعات'],
            ['name' => 'info.restore', 'label' => 'بازیابی اطلاعات'],
            ['name' => 'info.force_delete', 'label' => 'حذف دائمی اطلاعات'],

            // Info Category permissions
            ['name' => 'info_category.view_any', 'label' => 'مشاهده همه دسته‌بندی‌های اطلاعات'],
            ['name' => 'info_category.view', 'label' => 'مشاهده دسته‌بندی اطلاعات'],
            ['name' => 'info_category.create', 'label' => 'ایجاد دسته‌بندی اطلاعات'],
            ['name' => 'info_category.update', 'label' => 'ویرایش دسته‌بندی اطلاعات'],
            ['name' => 'info_category.delete', 'label' => 'حذف دسته‌بندی اطلاعات'],
            ['name' => 'info_category.confirm', 'label' => 'تایید دسته‌بندی اطلاعات'],
            ['name' => 'info_category.restore', 'label' => 'بازیابی دسته‌بندی اطلاعات'],
            ['name' => 'info_category.force_delete', 'label' => 'حذف دائمی دسته‌بندی اطلاعات'],

            // Info Type permissions
            ['name' => 'info_type.view_any', 'label' => 'مشاهده همه انواع اطلاعات'],
            ['name' => 'info_type.view', 'label' => 'مشاهده نوع اطلاعات'],
            ['name' => 'info_type.create', 'label' => 'ایجاد نوع اطلاعات'],
            ['name' => 'info_type.update', 'label' => 'ویرایش نوع اطلاعات'],
            ['name' => 'info_type.delete', 'label' => 'حذف نوع اطلاعات'],
            ['name' => 'info_type.confirm', 'label' => 'تایید نوع اطلاعات'],
            ['name' => 'info_type.restore', 'label' => 'بازیابی نوع اطلاعات'],
            ['name' => 'info_type.force_delete', 'label' => 'حذف دائمی نوع اطلاعات'],

            // National Insight Center Info permissions
            ['name' => 'national_insight_center_info.view_any', 'label' => 'مشاهده همه اطلاعات مرکز ملی بصیر'],
            ['name' => 'national_insight_center_info.view', 'label' => 'مشاهده اطلاعات مرکز ملی بصیر'],
            ['name' => 'national_insight_center_info.create', 'label' => 'ایجاد اطلاعات مرکز ملی بصیر'],
            ['name' => 'national_insight_center_info.update', 'label' => 'ویرایش اطلاعات مرکز ملی بصیر'],
            ['name' => 'national_insight_center_info.delete', 'label' => 'حذف اطلاعات مرکز ملی بصیر'],
            ['name' => 'national_insight_center_info.confirm', 'label' => 'تایید اطلاعات مرکز ملی بصیر'],
            ['name' => 'national_insight_center_info.print', 'label' => 'چاپ اطلاعات مرکز ملی بصیر'],
            ['name' => 'national_insight_center_info.restore', 'label' => 'بازیابی اطلاعات مرکز ملی بصیر'],
            ['name' => 'national_insight_center_info.force_delete', 'label' => 'حذف دائمی اطلاعات مرکز ملی بصیر'],

            // National Insight Center Info Item permissions
            ['name' => 'national_insight_center_info_item.view_any', 'label' => 'مشاهده همه آیتم‌های اطلاعات مرکز ملی بصیر'],
            ['name' => 'national_insight_center_info_item.view', 'label' => 'مشاهده آیتم اطلاعات مرکز ملی بصیر'],
            ['name' => 'national_insight_center_info_item.create', 'label' => 'ایجاد آیتم اطلاعات مرکز ملی بصیر'],
            ['name' => 'national_insight_center_info_item.update', 'label' => 'ویرایش آیتم اطلاعات مرکز ملی بصیر'],
            ['name' => 'national_insight_center_info_item.delete', 'label' => 'حذف آیتم اطلاعات مرکز ملی بصیر'],
            ['name' => 'national_insight_center_info_item.confirm', 'label' => 'تایید آیتم اطلاعات مرکز ملی بصیر'],
            ['name' => 'national_insight_center_info_item.restore', 'label' => 'بازیابی آیتم اطلاعات مرکز ملی بصیر'],
            ['name' => 'national_insight_center_info_item.force_delete', 'label' => 'حذف دائمی آیتم اطلاعات مرکز ملی بصیر'],

            // Language permissions
            ['name' => 'language.view_any', 'label' => 'مشاهده همه زبان‌ها'],
            ['name' => 'language.view', 'label' => 'مشاهده زبان'],
            ['name' => 'language.create', 'label' => 'ایجاد زبان'],
            ['name' => 'language.update', 'label' => 'ویرایش زبان'],
            ['name' => 'language.delete', 'label' => 'حذف زبان'],
            ['name' => 'language.restore', 'label' => 'بازیابی زبان'],
            ['name' => 'language.force_delete', 'label' => 'حذف دائمی زبان'],

            // Province permissions
            ['name' => 'province.view_any', 'label' => 'مشاهده همه ولایت‌ها'],
            ['name' => 'province.view', 'label' => 'مشاهده ولایت'],
            ['name' => 'province.create', 'label' => 'ایجاد ولایت'],
            ['name' => 'province.update', 'label' => 'ویرایش ولایت'],
            ['name' => 'province.delete', 'label' => 'حذف ولایت'],
            ['name' => 'province.restore', 'label' => 'بازیابی ولایت'],
            ['name' => 'province.force_delete', 'label' => 'حذف دائمی ولایت'],

            // Report permissions
            ['name' => 'report.view_any', 'label' => 'مشاهده همه گزارش‌ها'],
            ['name' => 'report.view', 'label' => 'مشاهده گزارش'],
            ['name' => 'report.create', 'label' => 'ایجاد گزارش'],
            ['name' => 'report.update', 'label' => 'ویرایش گزارش'],
            ['name' => 'report.delete', 'label' => 'حذف گزارش'],
            ['name' => 'report.restore', 'label' => 'بازیابی گزارش'],
            ['name' => 'report.force_delete', 'label' => 'حذف دائمی گزارش'],

            // Report Stat permissions
            ['name' => 'report_stat.view_any', 'label' => 'مشاهده همه آمار گزارش‌ها'],
            ['name' => 'report_stat.view', 'label' => 'مشاهده آمار گزارش'],
            ['name' => 'report_stat.create', 'label' => 'ایجاد آمار گزارش'],
            ['name' => 'report_stat.update', 'label' => 'ویرایش آمار گزارش'],
            ['name' => 'report_stat.delete', 'label' => 'حذف آمار گزارش'],
            ['name' => 'report_stat.restore', 'label' => 'بازیابی آمار گزارش'],
            ['name' => 'report_stat.force_delete', 'label' => 'حذف دائمی آمار گزارش'],

            // Stat Category permissions
            ['name' => 'stat_category.view_any', 'label' => 'مشاهده همه دسته‌بندی‌های آمار'],
            ['name' => 'stat_category.view', 'label' => 'مشاهده دسته‌بندی آمار'],
            ['name' => 'stat_category.create', 'label' => 'ایجاد دسته‌بندی آمار'],
            ['name' => 'stat_category.update', 'label' => 'ویرایش دسته‌بندی آمار'],
            ['name' => 'stat_category.delete', 'label' => 'حذف دسته‌بندی آمار'],
            ['name' => 'stat_category.restore', 'label' => 'بازیابی دسته‌بندی آمار'],
            ['name' => 'stat_category.force_delete', 'label' => 'حذف دائمی دسته‌بندی آمار'],

            // Stat Category Item permissions
            ['name' => 'stat_category_item.view_any', 'label' => 'مشاهده همه آیتم‌های دسته‌بندی آمار'],
            ['name' => 'stat_category_item.view', 'label' => 'مشاهده آیتم دسته‌بندی آمار'],
            ['name' => 'stat_category_item.create', 'label' => 'ایجاد آیتم دسته‌بندی آمار'],
            ['name' => 'stat_category_item.update', 'label' => 'ویرایش آیتم دسته‌بندی آمار'],
            ['name' => 'stat_category_item.delete', 'label' => 'حذف آیتم دسته‌بندی آمار'],
            ['name' => 'stat_category_item.restore', 'label' => 'بازیابی آیتم دسته‌بندی آمار'],
            ['name' => 'stat_category_item.force_delete', 'label' => 'حذف دائمی آیتم دسته‌بندی آمار'],

            // Translation permissions
            ['name' => 'translation.view_any', 'label' => 'مشاهده همه ترجمه‌ها'],
            ['name' => 'translation.view', 'label' => 'مشاهده ترجمه'],
            ['name' => 'translation.create', 'label' => 'ایجاد ترجمه'],
            ['name' => 'translation.update', 'label' => 'ویرایش ترجمه'],
            ['name' => 'translation.delete', 'label' => 'حذف ترجمه'],
            ['name' => 'translation.restore', 'label' => 'بازیابی ترجمه'],
            ['name' => 'translation.force_delete', 'label' => 'حذف دائمی ترجمه'],

            // User permissions
            ['name' => 'user.view_any', 'label' => 'مشاهده همه کاربران'],
            ['name' => 'user.view', 'label' => 'مشاهده کاربر'],
            ['name' => 'user.create', 'label' => 'ایجاد کاربر'],
            ['name' => 'user.update', 'label' => 'ویرایش کاربر'],
            ['name' => 'user.delete', 'label' => 'حذف کاربر'],
            ['name' => 'user.restore', 'label' => 'بازیابی کاربر'],
            ['name' => 'user.force_delete', 'label' => 'حذف دائمی کاربر'],

            // Role permissions
            ['name' => 'role.view_any', 'label' => 'مشاهده همه نقش‌ها'],
            ['name' => 'role.view', 'label' => 'مشاهده نقش'],
            ['name' => 'role.create', 'label' => 'ایجاد نقش'],
            ['name' => 'role.update', 'label' => 'ویرایش نقش'],
            ['name' => 'role.delete', 'label' => 'حذف نقش'],
            ['name' => 'role.restore', 'label' => 'بازیابی نقش'],
            ['name' => 'role.force_delete', 'label' => 'حذف دائمی نقش'],

            // Permission permissions
            ['name' => 'permission.view_any', 'label' => 'مشاهده همه مجوزها'],
            ['name' => 'permission.view', 'label' => 'مشاهده مجوز'],
            ['name' => 'permission.create', 'label' => 'ایجاد مجوز'],
            ['name' => 'permission.update', 'label' => 'ویرایش مجوز'],
            ['name' => 'permission.delete', 'label' => 'حذف مجوز'],
            ['name' => 'permission.restore', 'label' => 'بازیابی مجوز'],
            ['name' => 'permission.force_delete', 'label' => 'حذف دائمی مجوز'],

            // Backup permissions
            ['name' => 'manage backups', 'label' => 'مدیریت پشتیبان‌گیری'],
        ];

        // Create permissions
        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission['name'],
                'guard_name' => 'web',
            ], [
                'label' => $permission['label'],
            ]);
        }

        // Create roles
        $superadminRole = Role::firstOrCreate(['name' => 'superadmin', 'guard_name' => 'web']);
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $userRole = Role::firstOrCreate(['name' => 'user', 'guard_name' => 'web']);
        $managerRole = Role::firstOrCreate(['name' => 'manager', 'guard_name' => 'web']);

        // Assign all permissions to superadmin role
        $superadminRole->givePermissionTo(Permission::all());

        // Assign all permissions to admin role
        $adminRole->givePermissionTo(Permission::all());

        // Assign basic permissions to user role
        $userRole->givePermissionTo([
            'criminal.view_any', 'criminal.view',
            'incident.view_any', 'incident.view',
            'incident_report.view_any', 'incident_report.view',
            'info.view_any', 'info.view', 'info.confirm',
                  'report.view_any', 'report.view',
        ]);

        // Assign manager permissions
        $managerRole->givePermissionTo([
            'criminal.view_any', 'criminal.view', 'criminal.create', 'criminal.update', 'criminal.view_comprehensive_list',
            'incident.view_any', 'incident.view', 'incident.create', 'incident.update', 'incident.confirm',
            'incident_report.view_any', 'incident_report.view', 'incident_report.create', 'incident_report.update',
            'info.view_any', 'info.view', 'info.create', 'info.update', 'info.confirm',
            'info_category.view_any', 'info_category.view', 'info_category.confirm',
            'info_type.view_any', 'info_type.view', 'info_type.confirm',
            'national_insight_center_info.view_any', 'national_insight_center_info.view', 'national_insight_center_info.confirm',
            'national_insight_center_info_item.view_any', 'national_insight_center_info_item.view', 'national_insight_center_info_item.create', 'national_insight_center_info_item.update', 'national_insight_center_info_item.confirm',
           
            'report.view_any', 'report.view', 'report.create', 'report.update',
            'report_stat.view_any', 'report_stat.view', 'report_stat.create', 'report_stat.update',
        ]);
    }
}
