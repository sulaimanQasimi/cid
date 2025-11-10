# CID System Documentation

Welcome to the CID (Criminal Investigation Database) system documentation. This directory contains comprehensive documentation for all aspects of the system.

## Documentation Index

### Getting Started

- **[Overview](overview.md)** - System introduction, purpose, and key objectives
- **[Architecture](architecture.md)** - Technical architecture, technology stack, and system design

### Core Documentation

- **[Features](features.md)** - Detailed documentation of all system features
- **[API Documentation](api.md)** - RESTful API endpoints, authentication, and usage
- **[Database Schema](database.md)** - Complete database structure, tables, and relationships
- **[Security & Permissions](security.md)** - Security features, permission system, and access control

### Development & Deployment

- **[Development Guide](development.md)** - Development environment setup, workflow, and best practices
- **[Deployment Guide](deployment.md)** - Production deployment instructions and server configuration

### User Documentation

- **[User Guide](user-guide.md)** - End-user documentation and common tasks

### System Components

- **[Translation System](translation.md)** - Internationalization, translation management, and RTL support
- **[Visitor Tracking](visitor-tracking.md)** - Analytics, visitor tracking, and reporting
- **[Meeting System](meetings.md)** - Secure communication, WebRTC, and meeting management
- **[Backup System](backup.md)** - Backup configuration, FTP/SFTP setup, and recovery procedures

## Quick Links

### For Developers

1. Start with [Overview](overview.md) to understand the system
2. Review [Architecture](architecture.md) for technical details
3. Follow [Development Guide](development.md) to set up your environment
4. Refer to [API Documentation](api.md) for API usage
5. Check [Database Schema](database.md) for data structure

### For System Administrators

1. Read [Overview](overview.md) for system overview
2. Review [Deployment Guide](deployment.md) for installation
3. Configure [Backup System](backup.md) for data protection
4. Set up [Security & Permissions](security.md) for access control
5. Monitor [Visitor Tracking](visitor-tracking.md) for analytics

### For End Users

1. Start with [User Guide](user-guide.md) for common tasks
2. Review [Features](features.md) to understand capabilities
3. Check specific component docs for detailed usage

## Documentation Structure

```
doc/
├── README.md              # This file
├── overview.md            # System overview
├── architecture.md         # Technical architecture
├── features.md             # Feature documentation
├── api.md                  # API documentation
├── database.md             # Database schema
├── security.md             # Security & permissions
├── development.md          # Development guide
├── deployment.md           # Deployment guide
├── user-guide.md           # User guide
├── translation.md           # Translation system
├── visitor-tracking.md      # Visitor tracking
├── meetings.md             # Meeting system
└── backup.md               # Backup system
```

## System Overview

The CID (Criminal Investigation Database) is a comprehensive intelligence and investigation management system designed for law enforcement and security agencies. It provides:

- **Criminal Database Management**: Complete criminal record management
- **Incident Management**: Comprehensive incident reporting and tracking
- **Intelligence Operations**: Secure information management
- **Secure Communications**: WebRTC-based video conferencing
- **Analytics & Reporting**: Advanced reporting and statistics
- **Geographic Intelligence**: Location-based analysis
- **User Management**: Role-based access control
- **Multilingual Support**: RTL text support
- **Backup & Recovery**: Automated backup system

## Technology Stack

### Backend
- Laravel 12.x (PHP 8.2+)
- MySQL/PostgreSQL/SQLite
- Laravel Reverb (WebSocket)
- Spatie packages (Permission, Activity Log, Backup)

### Frontend
- React 19.x with TypeScript
- Inertia.js
- Tailwind CSS 4.x
- Radix UI components

## Getting Help

- **Documentation**: Browse this directory for detailed information
- **Development Issues**: Check [Development Guide](development.md) troubleshooting section
- **Deployment Issues**: Review [Deployment Guide](deployment.md) troubleshooting section
- **User Questions**: Refer to [User Guide](user-guide.md)

## Documentation Updates

This documentation is maintained by the CID Development Team. For updates or corrections, please contact the development team or create an issue in the project repository.

---

**Last Updated**: January 2025  
**Documentation Version**: 1.0

