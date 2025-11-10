# CID System - Features Documentation

## Overview

This document provides detailed documentation of all features available in the CID system.

## 1. Criminal Database Management

### 1.1 Criminal Records

The criminal database is the core feature of the system, providing comprehensive management of criminal records.

#### Features
- **Complete Criminal Profiles**: Store detailed information about criminals including:
  - Personal information (name, father's name, grandfather's name)
  - Identification (ID card number, photo)
  - Contact information (phone number, addresses)
  - Crime details (crime type, arrest information)
  - Case information (verdict, notes, dates)
- **Photo Management**: Upload and manage criminal photographs
- **Access Control**: Granular access permissions for viewing/editing records
- **Search & Filter**: Advanced search capabilities across all fields
- **Print Functionality**: Generate printable criminal records
- **Comprehensive List**: View all criminals in a comprehensive list format

#### Data Fields
- `number`: Criminal record number
- `name`: Full name
- `father_name`: Father's name
- `grandfather_name`: Grandfather's name
- `id_card_number`: National ID card number
- `photo`: Criminal photograph
- `phone_number`: Contact phone number
- `original_residence`: Original place of residence
- `current_residence`: Current place of residence
- `crime_type`: Type of crime committed
- `arrest_location`: Location where arrested
- `arrested_by`: Officer/unit who made the arrest
- `arrest_date`: Date of arrest (with Persian date support)
- `referred_to`: Department/authority referred to
- `final_verdict`: Final court verdict
- `notes`: Additional notes and information
- `department_id`: Associated department
- `created_by`: User who created the record

#### Access Control
- **CriminalAccess Model**: Manages user access to specific criminal records
- **Permission-based**: Uses `criminal.view`, `criminal.create`, `criminal.update`, `criminal.delete` permissions
- **Creator Access**: Record creator always has access
- **Explicit Access**: Additional users can be granted explicit access

#### Visitor Tracking
- Tracks visits to criminal records
- Provides analytics on record views
- Shows visit counts and unique visitors

## 2. Incident Management System

### 2.1 Incidents

Comprehensive incident reporting and tracking system.

#### Features
- **Incident Reporting**: Create detailed incident reports
- **Status Tracking**: Track incident status from occurrence to resolution
- **Category Management**: Organize incidents by type and severity
- **Location Mapping**: Geographic intelligence with province and district mapping
- **Confirmation System**: Multi-level approval process for incidents
- **Report Linking**: Link incidents to incident reports

#### Data Fields
- `title`: Incident title
- `description`: Detailed description
- `location`: Incident location
- `incident_category_id`: Category classification
- `status`: Current status (active, resolved, closed, etc.)
- `confirmed`: Confirmation status
- `confirmed_by`: User who confirmed
- `confirmed_at`: Confirmation timestamp

### 2.2 Incident Categories

Organize incidents by type and severity.

#### Features
- **Category Hierarchy**: Organize categories hierarchically
- **Category Management**: Create, edit, and manage categories
- **Filtering**: Filter incidents by category

### 2.3 Incident Reports

Comprehensive reporting system for incidents.

#### Features
- **Report Creation**: Create detailed incident reports
- **Report Statistics**: Track statistics within reports
- **Access Control**: Granular access control for reports
- **Print Functionality**: Generate printable reports
- **Incident Linking**: Link multiple incidents to a report

#### Access Control
- **IncidentReportAccess Model**: Manages user access to specific reports
- **Time-based Access**: Access can be granted with expiration dates
- **Access Extension**: Extend access periods
- **Access Revocation**: Revoke access when needed

## 3. Intelligence Operations

### 3.1 Information Management

Secure information management and analysis system.

#### Features
- **Information Records**: Store and organize intelligence data
- **Category System**: Hierarchical information categorization
- **Type Classification**: Multiple information types for different sources
- **Confirmation System**: Multi-level approval process
- **Statistics Tracking**: Detailed analytics on information collection

#### Data Fields
- `name`: Information name/title
- `description`: Detailed description
- `info_category_id`: Category classification
- `info_type_id`: Type classification
- `confirmed`: Confirmation status
- `confirmed_by`: User who confirmed
- `confirmed_at`: Confirmation timestamp

### 3.2 Information Categories

Organize information by category.

#### Features
- **Category Hierarchy**: Hierarchical category structure
- **Category Management**: Create, edit, and manage categories

### 3.3 Information Types

Classify information by type.

#### Features
- **Type Classification**: Classify information by source type
- **Type Management**: Create, edit, and manage types

### 3.4 National Insight Center Info

Specialized information management for national insight center.

#### Features
- **Info Management**: Store and manage insight center information
- **Item Management**: Manage information items
- **Statistics**: Track statistics for items
- **Weekly Reports**: Generate weekly reports
- **Print Functionality**: Generate printable reports

## 4. Secure Communication System

### 4.1 Meetings

WebRTC-based video conferencing system.

#### Features
- **Meeting Scheduling**: Schedule meetings with participants
- **WebRTC Video**: Peer-to-peer video communication
- **Screen Sharing**: Share screen during meetings
- **Offline Mode**: Continue meetings with network interruptions
- **Meeting Code**: Unique code for meeting access
- **Participant Management**: Manage meeting participants
- **Meeting Sessions**: Track meeting sessions
- **Meeting Messages**: Encrypted chat during meetings

#### Data Fields
- `title`: Meeting title
- `description`: Meeting description
- `meeting_code`: Unique meeting code
- `scheduled_at`: Scheduled date and time
- `duration_minutes`: Meeting duration
- `is_recurring`: Recurring meeting flag
- `status`: Meeting status (scheduled, active, completed, cancelled)
- `offline_enabled`: Offline mode enabled flag
- `created_by`: User who created the meeting

#### Real-time Features
- **WebRTC Signaling**: Real-time signaling for peer connections
- **User Events**: Track user join/leave events
- **Message Broadcasting**: Real-time message broadcasting
- **Session Tracking**: Track active meeting sessions

### 4.2 Meeting Messages

Encrypted messaging system for meetings.

#### Features
- **Real-time Messaging**: Send messages during meetings
- **Message History**: View message history
- **Encryption**: Encrypted message transmission

## 5. Geographic Intelligence

### 5.1 Provinces

Province management system.

#### Features
- **Province Database**: Complete province information
- **Province Management**: Create, edit, and manage provinces
- **Location Analytics**: Geographic analysis of data

### 5.2 Districts

District management system.

#### Features
- **District Database**: Complete district information
- **District Management**: Create, edit, and manage districts
- **Province Linking**: Link districts to provinces
- **Location Analytics**: Geographic analysis of data

## 6. Analytics & Reporting

### 6.1 Visitor Analytics

Comprehensive visitor tracking and analytics.

#### Features
- **Visit Tracking**: Track visits to models and pages
- **Analytics Dashboard**: View analytics for different models
- **Time-based Analytics**: View analytics by time period
- **Device Analytics**: Track device types and browsers
- **Geographic Analytics**: Track visitor locations
- **Bounce Rate**: Track bounce rates
- **Duration Tracking**: Track time spent on pages

#### Analytics Types
- **Overall Analytics**: System-wide analytics
- **Model Analytics**: Analytics for specific models (Criminal, Incident, etc.)
- **Page Analytics**: Analytics for specific pages
- **User Analytics**: Analytics for specific users

### 6.2 Reports

Report generation and management system.

#### Features
- **Report Generation**: Generate various types of reports
- **Report Scanner**: Scan and view reports
- **Report Statistics**: Track report statistics
- **Report Categories**: Organize reports by category
- **Report Items**: Manage report items and statistics

### 6.3 Statistics

Statistical analysis and reporting.

#### Features
- **Stat Categories**: Organize statistics by category
- **Stat Category Items**: Manage statistics items
- **Report Statistics**: Link statistics to reports
- **Batch Updates**: Batch update statistics

## 7. User Management & Security

### 7.1 User Management

Complete user lifecycle management.

#### Features
- **User Creation**: Create new user accounts
- **User Editing**: Edit user information
- **Role Assignment**: Assign roles to users
- **Permission Management**: Manage user permissions
- **Department Assignment**: Assign users to departments
- **User Profiles**: View and manage user profiles

### 7.2 Role Management

Role-based access control system.

#### Features
- **Role Creation**: Create new roles
- **Role Editing**: Edit role information
- **Permission Assignment**: Assign permissions to roles
- **Role Hierarchy**: Manage role hierarchy

### 7.3 Permission Management

Granular permission system.

#### Features
- **Permission Viewing**: View all available permissions
- **Permission Assignment**: Assign permissions to roles
- **Permission Patterns**: Standardized permission patterns
- **168+ Permissions**: Comprehensive permission set across 19 models

#### Permission Structure
- **Model Permissions**: `{model}.{action}` pattern
- **Actions**: `view`, `view_any`, `create`, `update`, `delete`, `restore`, `force_delete`, `confirm`
- **Models**: 19 models with permissions

### 7.4 Department Management

Organizational structure management.

#### Features
- **Department Creation**: Create new departments
- **Department Editing**: Edit department information
- **User Assignment**: Assign users to departments
- **Department Hierarchy**: Manage department structure

## 8. Multilingual Support

### 8.1 Language Management

Multi-language support system.

#### Features
- **Language Management**: Create, edit, and manage languages
- **Default Language**: Set default language
- **Language Switching**: Switch between languages
- **RTL Support**: Right-to-Left text support

### 8.2 Translation System

Comprehensive translation management.

#### Features
- **Translation Management**: Manage translations for all languages
- **Translation Import**: Import translations from files
- **Translation Export**: Export translations to files
- **JSON Export**: Export translations to JSON format
- **Dynamic Loading**: Load translations dynamically
- **Fallback Support**: Fallback to default language

#### Translation Structure
- **Namespaced Keys**: `{namespace}.{key}` pattern
- **Parameter Replacement**: Support for dynamic content
- **JSON Storage**: Translations stored in JSON files
- **Database Storage**: Translations also stored in database

## 9. Backup & Recovery

### 9.1 Backup System

Automated backup system.

#### Features
- **Automated Backups**: Scheduled database and file backups
- **FTP/SFTP Support**: Remote backup storage
- **Backup Monitoring**: Health monitoring of backups
- **Backup Management**: View and manage backups
- **Backup Encryption**: Encrypted backup archives
- **Backup Retention**: Automated retention policies

#### Backup Configuration
- **Local Storage**: Backups stored locally
- **Remote Storage**: Backups stored on FTP/SFTP servers
- **Multiple Destinations**: Support for multiple backup destinations
- **Backup Scheduling**: Automated backup scheduling

## 10. System Administration

### 10.1 Settings

System configuration and settings.

#### Features
- **Profile Settings**: Manage user profile
- **Password Settings**: Change password
- **Appearance Settings**: Configure appearance (dark mode disabled)

### 10.2 Activity Logging

Comprehensive activity logging.

#### Features
- **Activity Tracking**: Track all system activities
- **User Activities**: Track user-specific activities
- **Model Activities**: Track model-specific activities
- **Activity History**: View activity history

### 10.3 System Monitoring

System health and performance monitoring.

#### Features
- **Performance Monitoring**: Monitor system performance
- **Resource Monitoring**: Monitor server resources
- **Error Tracking**: Track system errors
- **Log Management**: Manage system logs

## 11. Additional Features

### 11.1 Print Functionality

Print various documents and reports.

#### Supported Print Types
- Criminal records
- Incident reports
- National Insight Center reports
- Weekly reports

### 11.2 Search & Filter

Advanced search and filtering capabilities.

#### Features
- **Full-text Search**: Search across multiple fields
- **Advanced Filters**: Filter by multiple criteria
- **Date Range Filtering**: Filter by date ranges
- **Category Filtering**: Filter by categories

### 11.3 Export Functionality

Export data in various formats.

#### Supported Formats
- JSON export
- CSV export (planned)
- PDF export (planned)

---

**Document Version**: 1.0  
**Last Updated**: January 2025

