# CID Database System - Comprehensive Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Core Features](#core-features)
4. [Technical Stack](#technical-stack)
5. [Security & Permissions](#security--permissions)
6. [Database Schema](#database-schema)
7. [API Documentation](#api-documentation)
8. [Deployment Guide](#deployment-guide)
9. [User Guide](#user-guide)
10. [Development Guide](#development-guide)
11. [Troubleshooting](#troubleshooting)

---

## System Overview

The CID (Criminal Investigation Database) is a comprehensive intelligence and investigation management system designed for law enforcement and security agencies. It provides a centralized platform for managing criminal records, incident reports, intelligence gathering, secure communications, and analytical reporting.

### Key Objectives
- **Centralized Intelligence Management**: Store and organize criminal records, incident reports, and intelligence data
- **Secure Communication**: Enable encrypted real-time meetings and messaging
- **Analytical Reporting**: Generate comprehensive reports and analytics
- **Multi-language Support**: Support for multiple languages with RTL (Right-to-Left) text support
- **Role-based Access Control**: Granular permissions system for different user roles
- **Visitor Tracking**: Monitor system usage and access patterns
- **Backup & Recovery**: Automated backup system with FTP/SFTP support

---

## Architecture

### Technology Stack

#### Backend
- **Framework**: Laravel 12.x (PHP 8.2+)
- **Database**: SQLite (development) / MySQL/PostgreSQL (production)
- **Authentication**: Laravel Sanctum
- **Permissions**: Spatie Laravel Permission
- **Activity Logging**: Spatie Activity Log
- **Backup**: Spatie Laravel Backup
- **Real-time**: Laravel Reverb (WebSocket)
- **Queue**: Laravel Queue System

#### Frontend
- **Framework**: React 19.x with TypeScript
- **UI Library**: Radix UI + Tailwind CSS 4.x
- **State Management**: Inertia.js
- **Real-time**: Laravel Echo + Pusher
- **Charts**: AmCharts 5
- **Date Handling**: Moment.js with Jalali calendar support

#### Infrastructure
- **Web Server**: Nginx/Apache
- **Process Manager**: Supervisor
- **Cache**: Redis/Memcached
- **File Storage**: Local + FTP/SFTP
- **SSL**: Let's Encrypt

### System Architecture Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React/TS)    │◄──►│   (Laravel)     │◄──►│   (SQLite/MySQL)│
│                 │    │                 │    │                 │
│ • Inertia.js    │    │ • API Routes    │    │ • Criminal Data │
│ • Tailwind CSS  │    │ • Controllers   │    │ • User Data     │
│ • Radix UI      │    │ • Models        │    │ • Permissions   │
│ • Real-time     │    │ • Policies      │    │ • Analytics    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Real-time     │    │   File Storage  │    │   Backup        │
│   (WebSocket)   │    │   (FTP/SFTP)    │    │   System        │
│                 │    │                 │    │                 │
│ • Laravel Echo  │    │ • Local Storage │    │ • Automated     │
│ • Pusher        │    │ • FTP Server    │    │ • Encrypted     │
│ • WebRTC        │    │ • SFTP Server   │    │ • Scheduled     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## Core Features

### 1. Criminal Database Management
- **Criminal Records**: Complete criminal profiles with photos, personal details, and case information
- **Access Control**: Granular permissions for viewing and editing criminal records
- **Search & Filter**: Advanced search capabilities across all criminal data
- **Photo Management**: Secure storage and display of criminal photographs
- **Case Tracking**: Track criminal cases from arrest to final verdict

### 2. Incident Management System
- **Incident Reporting**: Comprehensive incident reporting with categorization
- **Status Tracking**: Track incident status from occurrence to resolution
- **Location Mapping**: Geographic intelligence with province and district mapping
- **Category Management**: Organize incidents by type and severity
- **Report Generation**: Automated report creation with statistics

### 3. Intelligence Operations
- **Information Management**: Store and organize intelligence data
- **Category System**: Hierarchical information categorization
- **Type Classification**: Multiple information types for different intelligence sources
- **Confirmation System**: Multi-level approval process for sensitive information
- **Statistics Tracking**: Detailed analytics on information collection and processing

### 4. Secure Communication System
- **Real-time Meetings**: WebRTC-based video conferencing with screen sharing
- **Encrypted Messaging**: Secure chat system with message history
- **Offline Capability**: Continue meetings even with network interruptions
- **Meeting Management**: Schedule, manage, and track meeting sessions
- **Participant Control**: Manage meeting participants and permissions

### 5. Geographic Intelligence
- **Province Management**: Complete province database with administrative details
- **District Mapping**: Detailed district information with geographic boundaries
- **Location Analytics**: Geographic analysis of incidents and criminal activities
- **Map Integration**: Interactive maps for visualization

### 6. Analytics & Reporting
- **Visitor Analytics**: Track system usage and user behavior
- **Report Generation**: Automated report creation with customizable templates
- **Statistical Analysis**: Comprehensive statistics on all system data
- **Dashboard**: Real-time dashboard with key metrics and KPIs
- **Export Capabilities**: Export reports in multiple formats

### 7. User Management & Security
- **Role-based Access Control**: Granular permission system with 168+ permissions
- **User Management**: Complete user lifecycle management
- **Department Management**: Organizational structure management
- **Activity Logging**: Comprehensive audit trail of all system activities
- **Session Management**: Secure session handling with timeout controls

### 8. Multilingual Support
- **Language Management**: Support for multiple languages
- **Translation System**: Comprehensive translation management
- **RTL Support**: Right-to-Left text support for Arabic/Persian languages
- **Dynamic Language Switching**: Real-time language switching without page reload
- **Translation Import/Export**: Bulk translation management

### 9. Backup & Recovery
- **Automated Backups**: Scheduled database and file backups
- **FTP/SFTP Support**: Remote backup storage with encryption
- **Backup Monitoring**: Health monitoring of backup processes
- **Recovery Procedures**: Documented recovery processes
- **Retention Policies**: Automated backup retention and cleanup

### 10. System Administration
- **System Monitoring**: Health monitoring and performance metrics
- **Configuration Management**: Centralized system configuration
- **Log Management**: Comprehensive logging and log analysis
- **Update Management**: System update and maintenance procedures
- **Security Auditing**: Regular security audits and compliance checks

---

## Technical Stack

### Backend Technologies

#### Laravel Framework
- **Version**: Laravel 12.x
- **PHP Version**: 8.2+
- **Features Used**:
  - Eloquent ORM for database operations
  - Blade templating engine
  - Artisan command-line interface
  - Middleware for request processing
  - Service providers for dependency injection
  - Event system for real-time features

#### Database Layer
- **Primary Database**: SQLite (development) / MySQL/PostgreSQL (production)
- **Migrations**: 56+ database migrations for schema management
- **Seeders**: 8 seeders for initial data population
- **Factories**: Model factories for testing data generation

#### Authentication & Authorization
- **Laravel Sanctum**: API token authentication
- **Spatie Laravel Permission**: Role and permission management
- **Policies**: 24+ policy files for authorization
- **Middleware**: Custom middleware for access control

#### Real-time Features
- **Laravel Reverb**: WebSocket server for real-time communication
- **Laravel Echo**: Frontend real-time library
- **Pusher**: WebSocket connection management
- **WebRTC**: Peer-to-peer video communication

#### Additional Packages
- **Spatie Activity Log**: Comprehensive activity logging
- **Spatie Laravel Backup**: Automated backup system
- **Jenssegers Agent**: User agent parsing for analytics
- **Namu Wirechat**: Chat system integration

### Frontend Technologies

#### React Ecosystem
- **React**: 19.x with TypeScript
- **Inertia.js**: Server-side rendering with React
- **React Router**: Client-side routing
- **React Hooks**: Custom hooks for state management

#### UI Framework
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: 4.x utility-first CSS framework
- **Lucide React**: Icon library
- **Class Variance Authority**: Component variant management

#### Data Visualization
- **AmCharts 5**: Interactive charts and maps
- **AmCharts Geodata**: Geographic data for maps
- **AmCharts Fonts**: Custom font support

#### Utilities
- **Moment.js**: Date manipulation with Jalali calendar support
- **Date-fns**: Modern date utility library
- **QRCode**: QR code generation
- **Simple Peer**: WebRTC peer connection management

### Development Tools

#### Build Tools
- **Vite**: Modern build tool and development server
- **TypeScript**: Type-safe JavaScript development
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting

#### Testing
- **Pest**: Modern PHP testing framework
- **Laravel Testing**: Built-in testing utilities
- **Factory**: Model factories for test data

#### Code Quality
- **Laravel Pint**: PHP code style fixer
- **PHPStan**: Static analysis tool
- **Collision**: Beautiful error reporting

---

## Security & Permissions

### Permission System

The system implements a comprehensive role-based access control (RBAC) system with 168+ granular permissions across 19 models.

#### Permission Structure
```
{model}.{action}
```

#### Available Actions
- `view` - View individual records
- `view_any` - View lists of records
- `create` - Create new records
- `update` - Edit existing records
- `delete` - Delete records
- `restore` - Restore soft-deleted records
- `force_delete` - Permanently delete records
- `confirm` - Confirm/approve records

#### Models with Permissions
1. **Criminal** (مجرم) - Criminal records management
2. **Department** (بخش) - Department management
3. **District** (ولسوالی) - District management
4. **Incident** (حادثه) - Incident management
5. **IncidentCategory** (دسته‌بندی حادثه) - Incident categorization
6. **IncidentReport** (گزارش حادثه) - Incident reporting
7. **Info** (اطلاعات) - Information management
8. **InfoCategory** (دسته‌بندی اطلاعات) - Information categorization
9. **InfoType** (نوع اطلاعات) - Information types
10. **Language** (زبان) - Language management
11. **Meeting** (جلسه) - Meeting management
12. **MeetingMessage** (پیام جلسه) - Meeting messaging
13. **MeetingSession** (نشست جلسه) - Meeting sessions
14. **Province** (ولایت) - Province management
15. **Report** (گزارش) - Report management
16. **ReportStat** (آمار گزارش) - Report statistics
17. **StatCategory** (دسته‌بندی آمار) - Statistics categories
18. **StatCategoryItem** (آیتم دسته‌بندی آمار) - Statistics items
19. **Translation** (ترجمه) - Translation management

#### Default Roles
- **Admin**: Full system access with all permissions
- **Manager**: Limited administrative access
- **User**: Basic user permissions

### Security Features

#### Authentication
- **Multi-factor Authentication**: Support for 2FA
- **Session Management**: Secure session handling with timeout
- **Password Policies**: Enforced password complexity requirements
- **Account Lockout**: Protection against brute force attacks

#### Data Protection
- **Encryption**: Sensitive data encryption at rest and in transit
- **Access Logging**: Comprehensive audit trail
- **Data Anonymization**: Privacy protection for sensitive information
- **Secure File Storage**: Encrypted file storage with access controls

#### Network Security
- **HTTPS Enforcement**: All communications encrypted
- **CORS Configuration**: Cross-origin resource sharing controls
- **Rate Limiting**: API rate limiting to prevent abuse
- **IP Whitelisting**: Optional IP-based access restrictions

---

## Database Schema

### Core Tables

#### Users & Authentication
- `users` - User accounts and profiles
- `roles` - User roles
- `permissions` - System permissions
- `model_has_permissions` - Permission assignments
- `model_has_roles` - Role assignments

#### Criminal Management
- `criminals` - Criminal records
- `criminal_accesses` - Criminal record access control
- `departments` - Department information
- `provinces` - Province data
- `districts` - District information

#### Incident Management
- `incidents` - Incident records
- `incident_categories` - Incident categorization
- `incident_reports` - Incident reports
- `incident_report_accesses` - Report access control

#### Intelligence Operations
- `infos` - Intelligence information
- `info_categories` - Information categories
- `info_types` - Information types
- `national_insight_center_infos` - National insight center data
- `national_insight_center_info_items` - Insight center items
- `national_insight_center_info_accesses` - Access control

#### Communication System
- `meetings` - Meeting records
- `meeting_sessions` - Meeting sessions
- `meeting_messages` - Meeting messages
- `wirechat_conversations` - Chat conversations
- `wirechat_messages` - Chat messages
- `wirechat_participants` - Chat participants

#### Analytics & Reporting
- `reports` - System reports
- `report_stats` - Report statistics
- `stat_categories` - Statistics categories
- `stat_category_items` - Statistics items
- `visitors` - Visitor tracking data

#### System Management
- `languages` - Language definitions
- `translations` - Translation data
- `activity_log` - Activity logging
- `backups` - Backup records

### Key Relationships

#### Criminal Records
```sql
criminals
├── department_id → departments.id
├── created_by → users.id
└── criminal_accesses (many-to-many with users)
```

#### Incident Management
```sql
incidents
├── incident_categories
└── incident_reports
    ├── incident_report_accesses
    └── report_stats
```

#### Intelligence System
```sql
infos
├── info_categories
├── info_types
└── national_insight_center_infos
    └── national_insight_center_info_items
        └── national_insight_center_info_accesses
```

#### Communication System
```sql
meetings
├── meeting_sessions
├── meeting_messages
└── wirechat_conversations
    ├── wirechat_messages
    └── wirechat_participants
```

---

## API Documentation

### Authentication Endpoints

#### Login
```http
POST /login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password"
}
```

#### Logout
```http
POST /logout
Authorization: Bearer {token}
```

### Criminal Management API

#### List Criminals
```http
GET /api/criminals
Authorization: Bearer {token}
```

#### Create Criminal
```http
POST /api/criminals
Authorization: Bearer {token}
Content-Type: application/json

{
    "name": "John Doe",
    "father_name": "Robert Doe",
    "id_card_number": "123456789",
    "crime_type": "Theft",
    "department_id": 1
}
```

#### Update Criminal
```http
PUT /api/criminals/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
    "name": "John Smith",
    "crime_type": "Robbery"
}
```

#### Delete Criminal
```http
DELETE /api/criminals/{id}
Authorization: Bearer {token}
```

### Incident Management API

#### List Incidents
```http
GET /api/incidents
Authorization: Bearer {token}
```

#### Create Incident
```http
POST /api/incidents
Authorization: Bearer {token}
Content-Type: application/json

{
    "title": "Robbery at Bank",
    "description": "Armed robbery at downtown bank",
    "location": "Downtown",
    "incident_category_id": 1,
    "status": "active"
}
```

### Intelligence API

#### List Information
```http
GET /api/infos
Authorization: Bearer {token}
```

#### Create Information
```http
POST /api/infos
Authorization: Bearer {token}
Content-Type: application/json

{
    "name": "Intelligence Report",
    "description": "Sensitive intelligence data",
    "info_category_id": 1,
    "info_type_id": 1,
    "confirmed": false
}
```

### Meeting API

#### List Meetings
```http
GET /api/meetings
Authorization: Bearer {token}
```

#### Create Meeting
```http
POST /api/meetings
Authorization: Bearer {token}
Content-Type: application/json

{
    "title": "Security Briefing",
    "description": "Weekly security briefing",
    "scheduled_at": "2024-01-15 10:00:00",
    "duration_minutes": 60,
    "offline_enabled": true
}
```

#### Join Meeting
```http
POST /api/meetings/{id}/join
Authorization: Bearer {token}
```

### Analytics API

#### Visitor Analytics
```http
GET /api/analytics
Authorization: Bearer {token}
```

#### Model Analytics
```http
GET /api/analytics/{modelType}
Authorization: Bearer {token}
```

### Real-time Events

#### WebRTC Signaling
```javascript
// Listen for WebRTC signals
Echo.private(`peer.${peerId}`)
    .listen('signal', (data) => {
        handleWebRTCSignal(data);
    });
```

#### Meeting Events
```javascript
// Listen for meeting events
Echo.private(`meeting.${meetingId}`)
    .listen('UserJoinedMeeting', (data) => {
        handleUserJoined(data);
    })
    .listen('UserLeftMeeting', (data) => {
        handleUserLeft(data);
    });
```

---

## Deployment Guide

### System Requirements

#### Minimum Requirements
- **PHP**: 8.2 or higher
- **Node.js**: 18.x or higher
- **Database**: SQLite/MySQL 8.0/PostgreSQL 13+
- **Web Server**: Nginx 1.18+ or Apache 2.4+
- **Memory**: 2GB RAM minimum
- **Storage**: 10GB available space

#### Recommended Requirements
- **PHP**: 8.3 with OPcache enabled
- **Node.js**: 20.x LTS
- **Database**: MySQL 8.0+ or PostgreSQL 15+
- **Web Server**: Nginx with HTTP/2
- **Memory**: 8GB RAM
- **Storage**: 50GB SSD
- **Cache**: Redis 7.0+

### Installation Steps

#### 1. Server Setup
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install PHP 8.3
sudo apt install php8.3 php8.3-fpm php8.3-mysql php8.3-xml php8.3-mbstring php8.3-curl php8.3-zip php8.3-gd php8.3-bcmath php8.3-intl

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install Redis
sudo apt install redis-server

# Install Nginx
sudo apt install nginx
```

#### 2. Database Setup
```bash
# For MySQL
sudo apt install mysql-server
sudo mysql_secure_installation

# For PostgreSQL
sudo apt install postgresql postgresql-contrib
sudo -u postgres createuser --interactive
sudo -u postgres createdb cid_database
```

#### 3. Application Deployment
```bash
# Clone repository
git clone https://github.com/your-org/cid-database.git
cd cid-database

# Install PHP dependencies
composer install --optimize-autoloader --no-dev

# Install Node.js dependencies
npm install

# Build frontend assets
npm run build

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=cid_database
DB_USERNAME=cid_user
DB_PASSWORD=secure_password

# Run migrations
php artisan migrate

# Seed database
php artisan db:seed

# Set permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

#### 4. Web Server Configuration

##### Nginx Configuration
```nginx
server {
    listen 80;
    listen 443 ssl http2;
    server_name your-domain.com;
    root /var/www/cid-database/public;
    index index.php;

    # SSL Configuration
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # PHP handling
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Static files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Main application
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
}
```

#### 5. Queue Worker Setup
```bash
# Create supervisor configuration
sudo nano /etc/supervisor/conf.d/cid-queue.conf
```

```ini
[program:cid-queue]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/cid-database/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/cid-database/storage/logs/queue.log
stopwaitsecs=3600
```

#### 6. Backup Configuration
```bash
# Configure FTP backup
# Add to .env file
FTP_HOST=your-ftp-server.com
FTP_USERNAME=backup_user
FTP_PASSWORD=secure_password
FTP_PORT=21
FTP_ROOT=/backups

# Test backup
php artisan backup:run

# Schedule backups
crontab -e
# Add: 0 2 * * * cd /var/www/cid-database && php artisan backup:run
```

#### 7. SSL Certificate Setup
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Production Optimization

#### PHP Optimization
```ini
; /etc/php/8.3/fpm/php.ini
opcache.enable=1
opcache.memory_consumption=256
opcache.max_accelerated_files=20000
opcache.validate_timestamps=0
```

#### Database Optimization
```sql
-- MySQL optimization
SET GLOBAL innodb_buffer_pool_size = 2G;
SET GLOBAL query_cache_size = 256M;
SET GLOBAL max_connections = 200;
```

#### Application Optimization
```bash
# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize

# Enable OPcache
sudo systemctl restart php8.3-fpm
```

---

## User Guide

### Getting Started

#### 1. First Login
1. Navigate to the application URL
2. Use the provided admin credentials
3. Change the default password immediately
4. Configure your profile information

#### 2. Dashboard Overview
The dashboard provides:
- **System Statistics**: Overview of records and activities
- **Recent Activity**: Latest system activities
- **Quick Actions**: Common tasks and shortcuts
- **Notifications**: System alerts and updates

### Criminal Database Management

#### Adding Criminal Records
1. Navigate to **Criminal Database** → **Criminal Records**
2. Click **Add New Criminal**
3. Fill in required information:
   - Personal details (name, father's name, ID card number)
   - Contact information (phone, addresses)
   - Crime details (type, arrest information)
   - Case information (verdict, notes)
4. Upload criminal photograph
5. Assign to appropriate department
6. Set access permissions
7. Save record

#### Searching Criminals
1. Use the search bar for quick searches
2. Apply filters for specific criteria:
   - Crime type
   - Department
   - Date range
   - Status
3. Export search results if needed

#### Managing Access
1. Select criminal record
2. Go to **Access Control**
3. Add/remove users with access
4. Set access expiration dates
5. Monitor access logs

### Incident Management

#### Creating Incident Reports
1. Navigate to **Incident Management** → **Incidents**
2. Click **Create New Incident**
3. Fill incident details:
   - Title and description
   - Location and coordinates
   - Category and severity
   - Involved parties
4. Attach relevant documents
5. Assign to responsible department
6. Set incident status
7. Save and notify relevant personnel

#### Tracking Incident Status
1. View incident list with status indicators
2. Update status as investigation progresses
3. Add notes and updates
4. Generate status reports
5. Close incidents when resolved

### Intelligence Operations

#### Information Management
1. Navigate to **Intelligence Operations** → **Information**
2. Create new information record
3. Categorize information appropriately
4. Set confidentiality level
5. Add supporting documents
6. Submit for approval
7. Monitor approval status

#### Information Categories
- **Operational Intelligence**: Active operations
- **Strategic Intelligence**: Long-term planning
- **Tactical Intelligence**: Immediate actions
- **Counter-Intelligence**: Security threats

### Secure Communications

#### Scheduling Meetings
1. Navigate to **Secure Communications** → **Meetings**
2. Click **Schedule Meeting**
3. Set meeting details:
   - Title and agenda
   - Date and time
   - Duration
   - Participants
4. Enable offline mode if needed
5. Send invitations
6. Monitor attendance

#### Joining Meetings
1. Click on meeting invitation
2. Allow camera and microphone access
3. Join meeting room
4. Use chat for text communication
5. Share screen if needed
6. Record meeting if authorized

#### Chat System
1. Access chat from meeting room
2. Send encrypted messages
3. Share files securely
4. View message history
5. Export chat logs if needed

### Analytics & Reporting

#### Viewing Analytics
1. Navigate to **Analytics** → **Visitor Analytics**
2. Select time period
3. Choose data type to analyze
4. View charts and statistics
5. Export reports

#### Generating Reports
1. Navigate to **Analysis Reports** → **Report Scanner**
2. Select report type
3. Choose data range
4. Apply filters
5. Generate report
6. Export in desired format

### System Administration

#### User Management
1. Navigate to **System Administration** → **User Management**
2. Create new users
3. Assign roles and permissions
4. Set department assignments
5. Monitor user activity
6. Manage user access

#### Permission Management
1. Navigate to **System Administration** → **Security Permissions**
2. View all permissions
3. Assign permissions to roles
4. Create custom permissions
5. Audit permission usage

#### Backup Management
1. Navigate to **System Administration** → **Backup Management**
2. View backup status
3. Create manual backups
4. Configure backup schedules
5. Monitor backup health
6. Restore from backups

---

## Development Guide

### Development Environment Setup

#### Prerequisites
- PHP 8.2+ with extensions
- Node.js 18+ and npm
- Composer
- Git
- Database (SQLite/MySQL/PostgreSQL)

#### Local Development Setup
```bash
# Clone repository
git clone https://github.com/your-org/cid-database.git
cd cid-database

# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database
# Edit .env file with your database settings

# Run migrations
php artisan migrate

# Seed database
php artisan db:seed

# Start development server
php artisan serve

# In another terminal, start Vite
npm run dev
```

### Code Structure

#### Backend Structure
```
app/
├── Console/Commands/          # Artisan commands
├── Events/                    # Event classes
├── Http/
│   ├── Controllers/          # Controller classes
│   ├── Middleware/           # Middleware classes
│   └── Requests/             # Form request classes
├── Jobs/                     # Queue job classes
├── Models/                   # Eloquent models
├── Policies/                 # Authorization policies
├── Providers/                # Service providers
└── Services/                  # Service classes
```

#### Frontend Structure
```
resources/js/
├── components/               # Reusable components
├── hooks/                    # Custom React hooks
├── layouts/                  # Layout components
├── lib/                      # Utility libraries
├── pages/                    # Page components
└── types/                    # TypeScript type definitions
```

### Development Workflow

#### 1. Feature Development
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
# Test changes
npm run test
php artisan test

# Commit changes
git add .
git commit -m "Add new feature"

# Push to remote
git push origin feature/new-feature
```

#### 2. Database Changes
```bash
# Create migration
php artisan make:migration create_new_table

# Run migration
php artisan migrate

# Create model
php artisan make:model NewModel

# Create policy
php artisan make:policy NewModelPolicy
```

#### 3. Frontend Development
```bash
# Create new component
# Add to components directory
# Import and use in pages

# Add new page
# Create in pages directory
# Add route in web.php
```

### Testing

#### Backend Testing
```bash
# Run all tests
php artisan test

# Run specific test
php artisan test --filter=UserTest

# Run with coverage
php artisan test --coverage
```

#### Frontend Testing
```bash
# Run frontend tests
npm test

# Run with coverage
npm run test:coverage
```

### Code Quality

#### PHP Code Quality
```bash
# Run Pint (code style fixer)
./vendor/bin/pint

# Run PHPStan (static analysis)
./vendor/bin/phpstan analyse
```

#### JavaScript Code Quality
```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Run Prettier
npm run format
```

### Deployment

#### Staging Deployment
```bash
# Deploy to staging
git checkout staging
git merge feature/new-feature
git push origin staging

# Run deployment script
./deploy.sh staging
```

#### Production Deployment
```bash
# Deploy to production
git checkout main
git merge feature/new-feature
git tag v1.0.0
git push origin main --tags

# Run deployment script
./deploy.sh production
```

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Issues
**Problem**: Cannot connect to database
**Solution**:
```bash
# Check database configuration
php artisan config:show database

# Test database connection
php artisan tinker
>>> DB::connection()->getPdo();

# Check database service
sudo systemctl status mysql
```

#### 2. Permission Issues
**Problem**: File permission errors
**Solution**:
```bash
# Set correct permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache

# Clear cache
php artisan cache:clear
php artisan config:clear
```

#### 3. Real-time Features Not Working
**Problem**: WebSocket connections failing
**Solution**:
```bash
# Check Reverb server
php artisan reverb:start

# Check WebSocket configuration
php artisan config:show broadcasting

# Test WebSocket connection
# Check browser console for errors
```

#### 4. Backup Issues
**Problem**: Backup failures
**Solution**:
```bash
# Check backup configuration
php artisan config:show backup

# Test backup manually
php artisan backup:run

# Check FTP connection
php artisan tinker
>>> Storage::disk('ftp')->put('test.txt', 'test');
```

#### 5. Performance Issues
**Problem**: Slow application performance
**Solution**:
```bash
# Optimize application
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Check database performance
php artisan tinker
>>> DB::select('SHOW PROCESSLIST');

# Monitor system resources
htop
```

### Log Files

#### Application Logs
```bash
# View Laravel logs
tail -f storage/logs/laravel.log

# View specific log
tail -f storage/logs/laravel-$(date +%Y-%m-%d).log
```

#### System Logs
```bash
# View Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# View PHP-FPM logs
sudo tail -f /var/log/php8.3-fpm.log
```

#### Database Logs
```bash
# MySQL logs
sudo tail -f /var/log/mysql/error.log

# PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-*.log
```

### Performance Monitoring

#### Application Performance
```bash
# Monitor queue workers
php artisan queue:monitor

# Check cache performance
php artisan cache:table
php artisan cache:show

# Monitor database queries
php artisan tinker
>>> DB::enableQueryLog();
>>> // Run your queries
>>> DB::getQueryLog();
```

#### System Performance
```bash
# Monitor system resources
htop
iotop
nethogs

# Monitor database performance
mysqladmin processlist
mysqladmin status
```

### Security Issues

#### Security Audit
```bash
# Check for security vulnerabilities
composer audit

# Run security scan
php artisan security:scan

# Check file permissions
find . -type f -perm 777
```

#### Access Control Issues
```bash
# Check user permissions
php artisan tinker
>>> $user = User::find(1);
>>> $user->getAllPermissions();

# Check role assignments
>>> $user->roles;
```

### Backup and Recovery

#### Backup Verification
```bash
# List available backups
php artisan backup:list

# Test backup integrity
php artisan backup:monitor

# Restore from backup
php artisan backup:restore backup-name
```

#### Data Recovery
```bash
# Restore database
mysql -u username -p database_name < backup.sql

# Restore files
tar -xzf backup-files.tar.gz -C /path/to/restore
```

---

## Conclusion

The CID Database System is a comprehensive intelligence and investigation management platform designed to meet the complex needs of law enforcement and security agencies. With its robust architecture, advanced security features, and user-friendly interface, it provides a complete solution for managing criminal records, incident reports, intelligence operations, and secure communications.

The system's modular design allows for easy customization and extension, while its comprehensive permission system ensures data security and access control. The real-time communication features enable secure collaboration, and the analytics capabilities provide valuable insights into system usage and operational effectiveness.

For technical support, feature requests, or bug reports, please contact the development team or create an issue in the project repository.

---

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Maintained By**: CID Development Team
