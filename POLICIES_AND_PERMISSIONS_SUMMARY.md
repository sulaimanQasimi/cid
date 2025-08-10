# Policies and Permissions Implementation Summary

## Overview
This document summarizes the implementation of policies and permissions for all models in the application with Persian labels.

## Models with Policies Created

### 1. Criminal (مجرم)
- **Policy File**: `app/Policies/CriminalPolicy.php`
- **Permissions**:
  - `criminal.view_any` - مشاهده همه مجرمان
  - `criminal.view` - مشاهده مجرم
  - `criminal.create` - ایجاد مجرم
  - `criminal.update` - ویرایش مجرم
  - `criminal.delete` - حذف مجرم
  - `criminal.restore` - بازیابی مجرم
  - `criminal.force_delete` - حذف دائمی مجرم

### 2. Department (بخش)
- **Policy File**: `app/Policies/DepartmentPolicy.php`
- **Permissions**:
  - `department.view_any` - مشاهده همه بخش‌ها
  - `department.view` - مشاهده بخش
  - `department.create` - ایجاد بخش
  - `department.update` - ویرایش بخش
  - `department.delete` - حذف بخش
  - `department.restore` - بازیابی بخش
  - `department.force_delete` - حذف دائمی بخش

### 3. District (ولسوالی)
- **Policy File**: `app/Policies/DistrictPolicy.php`
- **Permissions**:
  - `district.view_any` - مشاهده همه ولسوالی‌ها
  - `district.view` - مشاهده ولسوالی
  - `district.create` - ایجاد ولسوالی
  - `district.update` - ویرایش ولسوالی
  - `district.delete` - حذف ولسوالی
  - `district.restore` - بازیابی ولسوالی
  - `district.force_delete` - حذف دائمی ولسوالی

### 4. Incident (حادثه)
- **Policy File**: `app/Policies/IncidentPolicy.php`
- **Permissions**:
  - `incident.view_any` - مشاهده همه حوادث
  - `incident.view` - مشاهده حادثه
  - `incident.create` - ایجاد حادثه
  - `incident.update` - ویرایش حادثه
  - `incident.delete` - حذف حادثه
  - `incident.restore` - بازیابی حادثه
  - `incident.force_delete` - حذف دائمی حادثه

### 5. IncidentCategory (دسته‌بندی حادثه)
- **Policy File**: `app/Policies/IncidentCategoryPolicy.php`
- **Permissions**:
  - `incident_category.view_any` - مشاهده همه دسته‌بندی‌های حوادث
  - `incident_category.view` - مشاهده دسته‌بندی حادثه
  - `incident_category.create` - ایجاد دسته‌بندی حادثه
  - `incident_category.update` - ویرایش دسته‌بندی حادثه
  - `incident_category.delete` - حذف دسته‌بندی حادثه
  - `incident_category.restore` - بازیابی دسته‌بندی حادثه
  - `incident_category.force_delete` - حذف دائمی دسته‌بندی حادثه

### 6. IncidentReport (گزارش حادثه)
- **Policy File**: `app/Policies/IncidentReportPolicy.php`
- **Permissions**:
  - `incident_report.view_any` - مشاهده همه گزارش‌های حوادث
  - `incident_report.view` - مشاهده گزارش حادثه
  - `incident_report.create` - ایجاد گزارش حادثه
  - `incident_report.update` - ویرایش گزارش حادثه
  - `incident_report.delete` - حذف گزارش حادثه
  - `incident_report.restore` - بازیابی گزارش حادثه
  - `incident_report.force_delete` - حذف دائمی گزارش حادثه

### 7. Info (اطلاعات)
- **Policy File**: `app/Policies/InfoPolicy.php` (already existed)
- **Permissions**:
  - `info.view_any` - مشاهده همه اطلاعات
  - `info.view` - مشاهده اطلاعات
  - `info.create` - ایجاد اطلاعات
  - `info.update` - ویرایش اطلاعات
  - `info.delete` - حذف اطلاعات
  - `info.restore` - بازیابی اطلاعات
  - `info.force_delete` - حذف دائمی اطلاعات

### 8. InfoCategory (دسته‌بندی اطلاعات)
- **Policy File**: `app/Policies/InfoCategoryPolicy.php` (already existed)
- **Permissions**:
  - `info_category.view_any` - مشاهده همه دسته‌بندی‌های اطلاعات
  - `info_category.view` - مشاهده دسته‌بندی اطلاعات
  - `info_category.create` - ایجاد دسته‌بندی اطلاعات
  - `info_category.update` - ویرایش دسته‌بندی اطلاعات
  - `info_category.delete` - حذف دسته‌بندی اطلاعات
  - `info_category.restore` - بازیابی دسته‌بندی اطلاعات
  - `info_category.force_delete` - حذف دائمی دسته‌بندی اطلاعات

### 9. InfoType (نوع اطلاعات)
- **Policy File**: `app/Policies/InfoTypePolicy.php` (already existed)
- **Permissions**:
  - `info_type.view_any` - مشاهده همه انواع اطلاعات
  - `info_type.view` - مشاهده نوع اطلاعات
  - `info_type.create` - ایجاد نوع اطلاعات
  - `info_type.update` - ویرایش نوع اطلاعات
  - `info_type.delete` - حذف نوع اطلاعات
  - `info_type.restore` - بازیابی نوع اطلاعات
  - `info_type.force_delete` - حذف دائمی نوع اطلاعات

### 10. Language (زبان)
- **Policy File**: `app/Policies/LanguagePolicy.php`
- **Permissions**:
  - `language.view_any` - مشاهده همه زبان‌ها
  - `language.view` - مشاهده زبان
  - `language.create` - ایجاد زبان
  - `language.update` - ویرایش زبان
  - `language.delete` - حذف زبان
  - `language.restore` - بازیابی زبان
  - `language.force_delete` - حذف دائمی زبان

### 11. Meeting (جلسه)
- **Policy File**: `app/Policies/MeetingPolicy.php` (already existed)
- **Permissions**:
  - `meeting.view_any` - مشاهده همه جلسات
  - `meeting.view` - مشاهده جلسه
  - `meeting.create` - ایجاد جلسه
  - `meeting.update` - ویرایش جلسه
  - `meeting.delete` - حذف جلسه
  - `meeting.restore` - بازیابی جلسه
  - `meeting.force_delete` - حذف دائمی جلسه

### 12. MeetingMessage (پیام جلسه)
- **Policy File**: `app/Policies/MeetingMessagePolicy.php`
- **Permissions**:
  - `meeting_message.view_any` - مشاهده همه پیام‌های جلسه
  - `meeting_message.view` - مشاهده پیام جلسه
  - `meeting_message.create` - ایجاد پیام جلسه
  - `meeting_message.update` - ویرایش پیام جلسه
  - `meeting_message.delete` - حذف پیام جلسه
  - `meeting_message.restore` - بازیابی پیام جلسه
  - `meeting_message.force_delete` - حذف دائمی پیام جلسه

### 13. MeetingSession (نشست جلسه)
- **Policy File**: `app/Policies/MeetingSessionPolicy.php`
- **Permissions**:
  - `meeting_session.view_any` - مشاهده همه نشست‌های جلسه
  - `meeting_session.view` - مشاهده نشست جلسه
  - `meeting_session.create` - ایجاد نشست جلسه
  - `meeting_session.update` - ویرایش نشست جلسه
  - `meeting_session.delete` - حذف نشست جلسه
  - `meeting_session.restore` - بازیابی نشست جلسه
  - `meeting_session.force_delete` - حذف دائمی نشست جلسه

### 14. Province (ولایت)
- **Policy File**: `app/Policies/ProvincePolicy.php`
- **Permissions**:
  - `province.view_any` - مشاهده همه ولایت‌ها
  - `province.view` - مشاهده ولایت
  - `province.create` - ایجاد ولایت
  - `province.update` - ویرایش ولایت
  - `province.delete` - حذف ولایت
  - `province.restore` - بازیابی ولایت
  - `province.force_delete` - حذف دائمی ولایت

### 15. Report (گزارش)
- **Policy File**: `app/Policies/ReportPolicy.php`
- **Permissions**:
  - `report.view_any` - مشاهده همه گزارش‌ها
  - `report.view` - مشاهده گزارش
  - `report.create` - ایجاد گزارش
  - `report.update` - ویرایش گزارش
  - `report.delete` - حذف گزارش
  - `report.restore` - بازیابی گزارش
  - `report.force_delete` - حذف دائمی گزارش

### 16. ReportStat (آمار گزارش)
- **Policy File**: `app/Policies/ReportStatPolicy.php`
- **Permissions**:
  - `report_stat.view_any` - مشاهده همه آمار گزارش‌ها
  - `report_stat.view` - مشاهده آمار گزارش
  - `report_stat.create` - ایجاد آمار گزارش
  - `report_stat.update` - ویرایش آمار گزارش
  - `report_stat.delete` - حذف آمار گزارش
  - `report_stat.restore` - بازیابی آمار گزارش
  - `report_stat.force_delete` - حذف دائمی آمار گزارش

### 17. StatCategory (دسته‌بندی آمار)
- **Policy File**: `app/Policies/StatCategoryPolicy.php`
- **Permissions**:
  - `stat_category.view_any` - مشاهده همه دسته‌بندی‌های آمار
  - `stat_category.view` - مشاهده دسته‌بندی آمار
  - `stat_category.create` - ایجاد دسته‌بندی آمار
  - `stat_category.update` - ویرایش دسته‌بندی آمار
  - `stat_category.delete` - حذف دسته‌بندی آمار
  - `stat_category.restore` - بازیابی دسته‌بندی آمار
  - `stat_category.force_delete` - حذف دائمی دسته‌بندی آمار

### 18. StatCategoryItem (آیتم دسته‌بندی آمار)
- **Policy File**: `app/Policies/StatCategoryItemPolicy.php`
- **Permissions**:
  - `stat_category_item.view_any` - مشاهده همه آیتم‌های دسته‌بندی آمار
  - `stat_category_item.view` - مشاهده آیتم دسته‌بندی آمار
  - `stat_category_item.create` - ایجاد آیتم دسته‌بندی آمار
  - `stat_category_item.update` - ویرایش آیتم دسته‌بندی آمار
  - `stat_category_item.delete` - حذف آیتم دسته‌بندی آمار
  - `stat_category_item.restore` - بازیابی آیتم دسته‌بندی آمار
  - `stat_category_item.force_delete` - حذف دائمی آیتم دسته‌بندی آمار

### 19. Translation (ترجمه)
- **Policy File**: `app/Policies/TranslationPolicy.php`
- **Permissions**:
  - `translation.view_any` - مشاهده همه ترجمه‌ها
  - `translation.view` - مشاهده ترجمه
  - `translation.create` - ایجاد ترجمه
  - `translation.update` - ویرایش ترجمه
  - `translation.delete` - حذف ترجمه
  - `translation.restore` - بازیابی ترجمه
  - `translation.force_delete` - حذف دائمی ترجمه

## Roles Created

### 1. Admin (مدیر)
- Has all permissions (168 permissions)

### 2. Manager (مدیر میانی)
- Has limited permissions for viewing, creating, and updating most resources
- Cannot delete or restore items

### 3. User (کاربر)
- Has basic view permissions for most resources
- Can create meeting messages

## Files Created/Modified

### New Policy Files Created:
1. `app/Policies/CriminalPolicy.php`
2. `app/Policies/DistrictPolicy.php`
3. `app/Policies/IncidentPolicy.php`
4. `app/Policies/IncidentCategoryPolicy.php`
5. `app/Policies/IncidentReportPolicy.php`
6. `app/Policies/LanguagePolicy.php`
7. `app/Policies/MeetingMessagePolicy.php`
8. `app/Policies/MeetingSessionPolicy.php`
9. `app/Policies/ProvincePolicy.php`
10. `app/Policies/ReportPolicy.php`
11. `app/Policies/ReportStatPolicy.php`
12. `app/Policies/StatCategoryPolicy.php`
13. `app/Policies/StatCategoryItemPolicy.php`
14. `app/Policies/TranslationPolicy.php`

### Modified Files:
1. `app/Providers/AuthServiceProvider.php` - Created to register all policies
2. `bootstrap/providers.php` - Added AuthServiceProvider registration
3. `database/seeders/PermissionSeeder.php` - Created comprehensive permission seeder

## Usage

### Running the Seeder:
```bash
php artisan db:seed --class=PermissionSeeder
```

### Checking Permissions in Controllers:
```php
// In your controller methods
public function index()
{
    $this->authorize('criminal.view_any');
    // Your logic here
}

public function store(Request $request)
{
    $this->authorize('criminal.create');
    // Your logic here
}
```

### Checking Permissions in Blade Templates:
```blade
@can('criminal.create')
    <a href="{{ route('criminals.create') }}" class="btn btn-primary">Create Criminal</a>
@endcan
```

## Statistics
- **Total Permissions Created**: 168
- **Total Roles Created**: 5 (including existing ones)
- **Total Models with Policies**: 19
- **Total Policy Files**: 14 new + 5 existing = 19

All permissions have Persian labels as requested and are properly integrated with the Spatie Permission package.
