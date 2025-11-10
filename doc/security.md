# CID System - Security & Permissions Documentation

## Overview

The CID system implements a comprehensive security architecture with role-based access control (RBAC), granular permissions, and multiple security layers.

## Permission System

### Permission Structure

The system uses a granular permission system with 168+ permissions across 19 models.

#### Permission Naming Convention

Permissions follow the pattern: `{model}.{action}`

**Examples:**
- `criminal.view` - View individual criminal record
- `criminal.view_any` - View list of criminals
- `criminal.create` - Create new criminal record
- `criminal.update` - Update existing criminal record
- `criminal.delete` - Delete criminal record
- `criminal.restore` - Restore soft-deleted record
- `criminal.force_delete` - Permanently delete record
- `criminal.confirm` - Confirm/approve criminal record

#### Available Actions

- `view` - View individual records
- `view_any` - View lists of records
- `create` - Create new records
- `update` - Edit existing records
- `delete` - Delete records
- `restore` - Restore soft-deleted records
- `force_delete` - Permanently delete records
- `confirm` - Confirm/approve records (for info-related models)

#### Models with Permissions

1. **criminal** - Criminal records management
2. **department** - Department management
3. **district** - District management
4. **incident** - Incident management
5. **incident_category** - Incident categorization
6. **incident_report** - Incident reporting
7. **info** - Information management
8. **info_category** - Information categorization
9. **info_type** - Information types
10. **language** - Language management
11. **meeting** - Meeting management
12. **meeting_message** - Meeting messaging
13. **meeting_session** - Meeting sessions
14. **province** - Province management
15. **report** - Report management
16. **report_stat** - Report statistics
17. **stat_category** - Statistics categories
18. **stat_category_item** - Statistics items
19. **translation** - Translation management
20. **user** - User management

### Default Roles

#### Admin Role
- Full system access with all permissions
- Can manage users, roles, and system settings
- Full CRUD access to all models
- Can access all features and functions

#### Manager Role
- Limited administrative access
- Can manage operational data
- Cannot access user management or system settings
- Most operational permissions enabled

#### User Role
- Basic user permissions
- Can view criminals, incidents, and information
- Limited create/update permissions
- Restricted access to sensitive features

## Authentication

### Authentication Methods

#### Session Authentication
- Laravel's built-in session authentication
- Secure session handling with timeout controls
- CSRF protection for all forms
- Remember me functionality

#### API Token Authentication
- Laravel Sanctum for API authentication
- Token-based authentication for API requests
- Token expiration and revocation
- Secure token storage

### Password Security

#### Password Requirements
- Minimum length: 8 characters
- Complexity requirements (configurable)
- Password hashing: bcrypt
- Password reset functionality
- Password change enforcement

#### Account Security
- Account lockout after failed login attempts
- Password expiration policies
- Two-factor authentication (planned)
- Email verification

## Authorization

### Policy-Based Authorization

The system uses Laravel Policies for model-level authorization.

#### Policy Structure
- One policy per model
- Methods: `view`, `viewAny`, `create`, `update`, `delete`, `restore`, `forceDelete`
- Permission checks within policies
- Custom authorization logic

#### Policy Examples

**Criminal Policy:**
```php
public function view(User $user, Criminal $criminal): bool
{
    return $user->can('criminal.view') && 
           ($criminal->created_by === $user->id || 
            $criminal->hasAccess($user));
}
```

**Incident Policy:**
```php
public function confirm(User $user, Incident $incident): bool
{
    return $user->can('incident.confirm') && 
           !$incident->confirmed;
}
```

### Access Control Models

#### Criminal Access
- **CriminalAccess Model**: Manages user access to specific criminal records
- **Creator Access**: Record creator always has access
- **Explicit Access**: Additional users can be granted explicit access
- **Time-based Access**: Access can be granted with expiration dates

#### Incident Report Access
- **IncidentReportAccess Model**: Manages user access to specific reports
- **Access Granting**: Super admin can grant access
- **Access Extension**: Extend access periods
- **Access Revocation**: Revoke access when needed

#### National Insight Center Info Access
- **NationalInsightCenterInfoAccess Model**: Manages access to insight center information
- **Granular Control**: Per-user access control
- **Time-based Access**: Access expiration support

## Data Protection

### Encryption

#### Data at Rest
- Sensitive data encryption (planned)
- Database encryption for sensitive fields
- File encryption for sensitive documents

#### Data in Transit
- HTTPS enforcement for all communications
- TLS 1.2+ for secure connections
- Encrypted WebSocket connections (WSS)
- Encrypted API communications

### Secure File Storage

#### File Upload Security
- File type validation
- File size limits
- Virus scanning (planned)
- Secure file naming
- Access control for files

#### File Storage Locations
- Public files: `public/storage/`
- Private files: `storage/app/`
- Encrypted backups: `storage/app/backups/`

## Network Security

### HTTPS Enforcement

#### SSL/TLS Configuration
- Force HTTPS for all connections
- HSTS (HTTP Strict Transport Security)
- Secure cookie flags
- Certificate validation

#### Security Headers
- X-Frame-Options: SAMEORIGIN
- X-XSS-Protection: 1; mode=block
- X-Content-Type-Options: nosniff
- Referrer-Policy: no-referrer-when-downgrade
- Content-Security-Policy: configured per application

### CORS Configuration

#### Cross-Origin Resource Sharing
- Configured CORS policies
- Allowed origins whitelist
- Credential handling
- Preflight request handling

### Rate Limiting

#### API Rate Limiting
- Default: 60 requests per minute per IP
- Authenticated: 120 requests per minute per user
- Custom limits per endpoint
- Rate limit headers in responses

#### Web Rate Limiting
- Login attempt limiting
- Form submission limiting
- API endpoint limiting

## Session Security

### Session Configuration

#### Session Settings
- Secure session cookies
- HttpOnly flag enabled
- SameSite cookie attribute
- Session timeout: 2 hours (configurable)
- Session regeneration on login

#### Session Storage
- Database session driver (default)
- Redis session storage (optional)
- Encrypted session data
- Session cleanup on logout

## Activity Logging

### Comprehensive Audit Trail

#### Logged Activities
- User login/logout
- Model creation/updates/deletions
- Permission changes
- Access grants/revocations
- System configuration changes

#### Activity Log Features
- Spatie Activity Log integration
- Detailed activity descriptions
- User attribution
- Timestamp tracking
- Property changes tracking

#### Activity Log Access
- View activity logs (admin only)
- Filter by user, model, or date
- Export activity logs
- Search activity logs

## Visitor Tracking

### Security Monitoring

#### IP Tracking
- Visitor IP address tracking
- Geolocation detection
- IP-based access restrictions (planned)
- Suspicious activity detection (planned)

#### Access Monitoring
- Track all page visits
- Monitor user behavior
- Detect unusual patterns
- Generate security reports

## Backup Security

### Backup Encryption

#### Encrypted Backups
- Backup archive password protection
- Encrypted backup files
- Secure backup storage
- Backup access control

#### Backup Storage
- Local encrypted storage
- FTP/SFTP secure transfer
- Backup retention policies
- Backup verification

## Security Best Practices

### Development Security

#### Code Security
- Input validation on all inputs
- Output escaping for XSS prevention
- SQL injection prevention (Eloquent ORM)
- CSRF protection on all forms
- Secure password hashing

#### Dependency Security
- Regular dependency updates
- Security vulnerability scanning
- Composer security audit
- NPM security audit

### Deployment Security

#### Server Security
- Firewall configuration
- SSH key authentication
- Disable root login
- Regular security updates
- Intrusion detection

#### Application Security
- Environment variable security
- Secret key management
- Database credential security
- API key protection

## Security Compliance

### Data Protection

#### Privacy Protection
- User data privacy
- Data anonymization (planned)
- GDPR compliance considerations
- Data retention policies

#### Access Control
- Principle of least privilege
- Regular access reviews
- Access revocation procedures
- Audit trail maintenance

### Security Auditing

#### Regular Audits
- Security vulnerability assessments
- Penetration testing (recommended)
- Code security reviews
- Infrastructure security reviews

#### Compliance Checks
- Security policy compliance
- Access control compliance
- Data protection compliance
- Audit trail compliance

## Security Incident Response

### Incident Handling

#### Response Procedures
1. Identify security incident
2. Contain the incident
3. Assess the impact
4. Remediate the issue
5. Document the incident
6. Review and improve

#### Reporting
- Security incident reporting
- User notification procedures
- Regulatory reporting (if applicable)
- Post-incident review

## Security Configuration

### Environment Variables

#### Security Settings
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

SESSION_SECURE_COOKIE=true
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=strict

FORCE_HTTPS=true
```

### Security Middleware

#### Applied Middleware
- `TrustProxies` - Trust proxy headers
- `HandleCors` - CORS handling
- `Authenticate` - Authentication checks
- `VerifyCsrfToken` - CSRF protection
- `RateLimiting` - Rate limiting

---

**Document Version**: 1.0  
**Last Updated**: January 2025

