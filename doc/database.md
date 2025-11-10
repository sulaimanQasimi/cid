# CID System - Database Schema Documentation

## Overview

This document describes the complete database schema for the CID system, including all tables, relationships, and indexes.

## Database Structure

### Core Tables

#### Users & Authentication

##### users
User accounts and profiles.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| name | varchar(255) | User full name |
| email | varchar(255) | Email address (unique) |
| email_verified_at | timestamp | Email verification timestamp |
| password | varchar(255) | Hashed password |
| department_id | bigint | Foreign key to departments |
| remember_token | varchar(100) | Remember me token |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Update timestamp |

**Relationships:**
- `belongsTo(Department)`
- `hasMany(Criminal)` (as creator)
- `hasMany(Meeting)` (as creator)
- `belongsToMany(Role)` (via model_has_roles)
- `belongsToMany(Permission)` (via model_has_permissions)

##### roles
User roles.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| name | varchar(255) | Role name (unique) |
| guard_name | varchar(255) | Guard name (default: web) |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Update timestamp |

**Relationships:**
- `belongsToMany(User)` (via model_has_roles)
- `belongsToMany(Permission)` (via role_has_permissions)

##### permissions
System permissions.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| name | varchar(255) | Permission name (unique) |
| guard_name | varchar(255) | Guard name (default: web) |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Update timestamp |

**Permission Naming Pattern:**
`{model}.{action}`

**Examples:**
- `criminal.view`
- `criminal.create`
- `criminal.update`
- `criminal.delete`

##### model_has_permissions
Permission assignments to models.

| Column | Type | Description |
|--------|------|-------------|
| permission_id | bigint | Foreign key to permissions |
| model_type | varchar(255) | Model class name |
| model_id | bigint | Model ID |

##### model_has_roles
Role assignments to models.

| Column | Type | Description |
|--------|------|-------------|
| role_id | bigint | Foreign key to roles |
| model_type | varchar(255) | Model class name |
| model_id | bigint | Model ID |

##### role_has_permissions
Permission assignments to roles.

| Column | Type | Description |
|--------|------|-------------|
| permission_id | bigint | Foreign key to permissions |
| role_id | bigint | Foreign key to roles |

### Criminal Management

##### criminals
Criminal records.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| photo | varchar(255) | Photo file path |
| number | varchar(255) | Criminal record number |
| name | varchar(255) | Full name |
| father_name | varchar(255) | Father's name |
| grandfather_name | varchar(255) | Grandfather's name |
| id_card_number | varchar(255) | National ID card number |
| phone_number | varchar(255) | Contact phone number |
| original_residence | text | Original place of residence |
| current_residence | text | Current place of residence |
| crime_type | varchar(255) | Type of crime |
| arrest_location | varchar(255) | Arrest location |
| arrested_by | varchar(255) | Officer/unit who made arrest |
| arrest_date | date | Date of arrest |
| referred_to | varchar(255) | Department/authority referred to |
| final_verdict | text | Final court verdict |
| notes | text | Additional notes |
| department_id | bigint | Foreign key to departments |
| created_by | bigint | Foreign key to users (creator) |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Update timestamp |

**Relationships:**
- `belongsTo(Department)`
- `belongsTo(User)` (as creator)
- `hasMany(CriminalAccess)`
- `morphMany(Report)`
- `morphMany(Visitor)`

##### criminal_accesses
Criminal record access control.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| criminal_id | bigint | Foreign key to criminals |
| user_id | bigint | Foreign key to users |
| granted_by | bigint | Foreign key to users (who granted access) |
| expires_at | timestamp | Access expiration date |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Update timestamp |

**Relationships:**
- `belongsTo(Criminal)`
- `belongsTo(User)`

##### departments
Department information.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| name | varchar(255) | Department name |
| description | text | Department description |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Update timestamp |

**Relationships:**
- `hasMany(User)`
- `hasMany(Criminal)`

### Incident Management

##### incidents
Incident records.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| title | varchar(255) | Incident title |
| description | text | Detailed description |
| location | varchar(255) | Incident location |
| incident_category_id | bigint | Foreign key to incident_categories |
| status | varchar(255) | Incident status |
| confirmed | boolean | Confirmation status |
| confirmed_by | bigint | Foreign key to users (who confirmed) |
| confirmed_at | timestamp | Confirmation timestamp |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Update timestamp |

**Relationships:**
- `belongsTo(IncidentCategory)`
- `belongsTo(User)` (as confirmer)
- `belongsToMany(IncidentReport)` (via incident_incident_report)

##### incident_categories
Incident categorization.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| name | varchar(255) | Category name |
| description | text | Category description |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Update timestamp |

**Relationships:**
- `hasMany(Incident)`

##### incident_reports
Incident reports.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| title | varchar(255) | Report title |
| description | text | Report description |
| created_by | bigint | Foreign key to users (creator) |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Update timestamp |

**Relationships:**
- `belongsTo(User)` (as creator)
- `belongsToMany(Incident)` (via incident_incident_report)
- `hasMany(IncidentReportAccess)`
- `hasMany(ReportStat)`

##### incident_incident_report
Pivot table for incidents and reports.

| Column | Type | Description |
|--------|------|-------------|
| incident_id | bigint | Foreign key to incidents |
| incident_report_id | bigint | Foreign key to incident_reports |

##### incident_report_accesses
Incident report access control.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| incident_report_id | bigint | Foreign key to incident_reports |
| user_id | bigint | Foreign key to users |
| granted_by | bigint | Foreign key to users (who granted access) |
| expires_at | timestamp | Access expiration date |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Update timestamp |

**Relationships:**
- `belongsTo(IncidentReport)`
- `belongsTo(User)`

### Intelligence Operations

##### infos
Intelligence information.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| name | varchar(255) | Information name |
| description | text | Detailed description |
| info_category_id | bigint | Foreign key to info_categories |
| info_type_id | bigint | Foreign key to info_types |
| confirmed | boolean | Confirmation status |
| confirmed_by | bigint | Foreign key to users (who confirmed) |
| confirmed_at | timestamp | Confirmation timestamp |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Update timestamp |

**Relationships:**
- `belongsTo(InfoCategory)`
- `belongsTo(InfoType)`
- `belongsTo(User)` (as confirmer)

##### info_categories
Information categories.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| name | varchar(255) | Category name |
| description | text | Category description |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Update timestamp |

**Relationships:**
- `hasMany(Info)`

##### info_types
Information types.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| name | varchar(255) | Type name |
| description | text | Type description |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Update timestamp |

**Relationships:**
- `hasMany(Info)`

##### national_insight_center_infos
National insight center information.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| name | varchar(255) | Information name |
| description | text | Description |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Update timestamp |

**Relationships:**
- `hasMany(NationalInsightCenterInfoItem)`
- `hasMany(NationalInsightCenterInfoAccess)`

##### national_insight_center_info_items
Insight center information items.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| national_insight_center_info_id | bigint | Foreign key to national_insight_center_infos |
| name | varchar(255) | Item name |
| description | text | Description |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Update timestamp |

**Relationships:**
- `belongsTo(NationalInsightCenterInfo)`
- `hasMany(NationalInsightCenterInfoItemStat)`

##### national_insight_center_info_accesses
Access control for insight center info.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| national_insight_center_info_id | bigint | Foreign key to national_insight_center_infos |
| user_id | bigint | Foreign key to users |
| granted_by | bigint | Foreign key to users |
| expires_at | timestamp | Access expiration |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Update timestamp |

### Communication System

##### meetings
Meeting records.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| title | varchar(255) | Meeting title |
| description | text | Meeting description |
| meeting_code | varchar(255) | Unique meeting code |
| scheduled_at | timestamp | Scheduled date and time |
| duration_minutes | integer | Meeting duration in minutes |
| is_recurring | boolean | Recurring meeting flag |
| status | varchar(255) | Meeting status |
| offline_enabled | boolean | Offline mode enabled |
| created_by | bigint | Foreign key to users (creator) |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Update timestamp |

**Relationships:**
- `belongsTo(User)` (as creator)
- `belongsToMany(User)` (as participants via meeting_participants)
- `hasMany(MeetingSession)`
- `hasMany(MeetingMessage)`

##### meeting_participants
Meeting participants pivot table.

| Column | Type | Description |
|--------|------|-------------|
| meeting_id | bigint | Foreign key to meetings |
| user_id | bigint | Foreign key to users |
| role | varchar(255) | Participant role |
| joined_at | timestamp | Join timestamp |
| left_at | timestamp | Leave timestamp |
| status | varchar(255) | Participant status |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Update timestamp |

##### meeting_sessions
Meeting sessions.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| meeting_id | bigint | Foreign key to meetings |
| started_at | timestamp | Session start time |
| ended_at | timestamp | Session end time |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Update timestamp |

**Relationships:**
- `belongsTo(Meeting)`

##### meeting_messages
Meeting messages.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| meeting_id | bigint | Foreign key to meetings |
| user_id | bigint | Foreign key to users (sender) |
| message | text | Message content |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Update timestamp |

**Relationships:**
- `belongsTo(Meeting)`
- `belongsTo(User)` (as sender)

### Geographic Intelligence

##### provinces
Province data.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| name | varchar(255) | Province name |
| code | varchar(255) | Province code |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Update timestamp |

**Relationships:**
- `hasMany(District)`

##### districts
District information.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| name | varchar(255) | District name |
| code | varchar(255) | District code |
| province_id | bigint | Foreign key to provinces |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Update timestamp |

**Relationships:**
- `belongsTo(Province)`

### Analytics & Reporting

##### reports
System reports.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| reportable_type | varchar(255) | Polymorphic model type |
| reportable_id | bigint | Polymorphic model ID |
| title | varchar(255) | Report title |
| description | text | Report description |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Update timestamp |

**Relationships:**
- `morphTo(reportable)`

##### report_stats
Report statistics.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| incident_report_id | bigint | Foreign key to incident_reports |
| stat_category_item_id | bigint | Foreign key to stat_category_items |
| value | decimal(10,2) | Statistic value |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Update timestamp |

**Relationships:**
- `belongsTo(IncidentReport)`
- `belongsTo(StatCategoryItem)`

##### stat_categories
Statistics categories.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| name | varchar(255) | Category name |
| description | text | Category description |
| order | integer | Display order |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Update timestamp |

**Relationships:**
- `hasMany(StatCategoryItem)`

##### stat_category_items
Statistics category items.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| stat_category_id | bigint | Foreign key to stat_categories |
| name | varchar(255) | Item name |
| description | text | Item description |
| order | integer | Display order |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Update timestamp |

**Relationships:**
- `belongsTo(StatCategory)`
- `hasMany(ReportStat)`

##### visitors
Visitor tracking data.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| ip_address | varchar(45) | IPv6 compatible IP address |
| user_agent | text | Full user agent string |
| country | varchar(255) | Country from geolocation |
| city | varchar(255) | City from geolocation |
| region | varchar(255) | Region/State from geolocation |
| latitude | decimal(10,8) | Latitude coordinate |
| longitude | decimal(11,8) | Longitude coordinate |
| user_id | bigint | Foreign key to users (nullable) |
| session_id | varchar(255) | Session identifier |
| url | text | Full URL visited |
| referrer | text | Referrer URL |
| method | varchar(10) | HTTP method |
| visitable_type | varchar(255) | Polymorphic model type |
| visitable_id | bigint | Polymorphic model ID |
| visited_at | timestamp | When the visit occurred |
| duration_seconds | integer | Time spent on page |
| device_type | varchar(255) | mobile/desktop/tablet |
| browser | varchar(255) | Browser name |
| browser_version | varchar(255) | Browser version |
| platform | varchar(255) | Operating system |
| platform_version | varchar(255) | OS version |
| is_bounce | boolean | Single page visit |
| metadata | json | Additional data |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Update timestamp |

**Relationships:**
- `belongsTo(User)` (nullable)
- `morphTo(visitable)`

### System Management

##### languages
Language definitions.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| name | varchar(255) | Language name |
| code | varchar(10) | Language code (ISO 639-1) |
| direction | varchar(3) | Text direction (ltr/rtl) |
| default | boolean | Default language flag |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Update timestamp |

##### translations
Translation data.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| language_id | bigint | Foreign key to languages |
| key | varchar(255) | Translation key |
| value | text | Translation value |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Update timestamp |

**Relationships:**
- `belongsTo(Language)`

##### activity_log
Activity logging (Spatie Activity Log).

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| log_name | varchar(255) | Log name |
| description | text | Activity description |
| subject_type | varchar(255) | Subject model type |
| subject_id | bigint | Subject model ID |
| event | varchar(255) | Event name |
| causer_type | varchar(255) | Causer model type |
| causer_id | bigint | Causer model ID |
| properties | json | Additional properties |
| created_at | timestamp | Creation timestamp |
| updated_at | timestamp | Update timestamp |

## Key Relationships

### Criminal Records
```
criminals
├── department_id → departments.id
├── created_by → users.id
└── criminal_accesses (many-to-many with users)
```

### Incident Management
```
incidents
├── incident_category_id → incident_categories.id
├── confirmed_by → users.id
└── incident_reports (many-to-many)
    ├── incident_report_accesses
    └── report_stats
```

### Intelligence System
```
infos
├── info_category_id → info_categories.id
├── info_type_id → info_types.id
└── confirmed_by → users.id
```

### Communication System
```
meetings
├── created_by → users.id
├── meeting_participants (many-to-many with users)
├── meeting_sessions
└── meeting_messages
```

## Indexes

### Primary Indexes
All tables have primary key indexes on `id` column.

### Foreign Key Indexes
All foreign key columns are indexed for performance.

### Composite Indexes
- `visitors`: `(visitable_type, visitable_id)`
- `visitors`: `(user_id, visited_at)`
- `visitors`: `(ip_address, visited_at)`
- `activity_log`: `(subject_type, subject_id)`
- `model_has_permissions`: `(model_type, model_id)`
- `model_has_roles`: `(model_type, model_id)`

### Search Indexes
- `criminals`: `name`, `id_card_number`
- `incidents`: `title`, `status`
- `infos`: `name`
- `users`: `email`

---

**Document Version**: 1.0  
**Last Updated**: January 2025

