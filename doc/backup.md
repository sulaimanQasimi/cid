# CID System - Backup System Documentation

## Overview

The CID system includes a comprehensive automated backup system using Spatie Laravel Backup with support for local storage and remote FTP/SFTP storage.

## Features

- **Automated Backups**: Scheduled database and file backups
- **FTP/SFTP Support**: Remote backup storage with encryption
- **Backup Monitoring**: Health monitoring of backup processes
- **Backup Management**: View and manage backups
- **Backup Encryption**: Encrypted backup archives
- **Backup Retention**: Automated retention policies
- **Multiple Destinations**: Support for multiple backup destinations

## Configuration

### Environment Variables

Add the following variables to your `.env` file:

```env
# FTP Server Configuration
FTP_HOST=your-ftp-server.com
FTP_USERNAME=your-ftp-username
FTP_PASSWORD=your-ftp-password
FTP_PORT=21
FTP_ROOT=/backups
FTP_PASSIVE=true
FTP_SSL=false
FTP_TIMEOUT=30

# SFTP Configuration (Alternative to FTP)
SFTP_HOST=your-sftp-server.com
SFTP_USERNAME=your-sftp-username
SFTP_PASSWORD=your-sftp-password
SFTP_PRIVATE_KEY=/path/to/private/key
SFTP_PASSPHRASE=your-key-passphrase
SFTP_PORT=22
SFTP_ROOT=/backups
SFTP_TIMEOUT=30
SFTP_DIRECTORY_PERM=0755

# Backup Archive Password (Optional - for encryption)
BACKUP_ARCHIVE_PASSWORD=your-secure-password

# Email Configuration for Backup Notifications
MAIL_FROM_ADDRESS=backups@yourdomain.com
MAIL_FROM_NAME="Backup System"
```

### Filesystem Configuration

The FTP and SFTP disks are configured in `config/filesystems.php`:

#### FTP Disk Configuration

```php
'ftp' => [
    'driver' => 'ftp',
    'host' => env('FTP_HOST'),
    'username' => env('FTP_USERNAME'),
    'password' => env('FTP_PASSWORD'),
    'port' => env('FTP_PORT', 21),
    'root' => env('FTP_ROOT', '/'),
    'passive' => env('FTP_PASSIVE', true),
    'ssl' => env('FTP_SSL', false),
    'timeout' => env('FTP_TIMEOUT', 30),
],
```

#### SFTP Disk Configuration

```php
'sftp' => [
    'driver' => 'sftp',
    'host' => env('SFTP_HOST'),
    'username' => env('SFTP_USERNAME'),
    'password' => env('SFTP_PASSWORD'),
    'privateKey' => env('SFTP_PRIVATE_KEY'),
    'passphrase' => env('SFTP_PASSPHRASE'),
    'port' => env('SFTP_PORT', 22),
    'root' => env('SFTP_ROOT', '/'),
    'timeout' => env('SFTP_TIMEOUT', 30),
    'directoryPerm' => env('SFTP_DIRECTORY_PERM', 0755),
],
```

### Backup Configuration

The backup configuration in `config/backup.php`:

```php
'backup' => [
    'name' => env('APP_NAME', 'CID System'),
    
    'source' => [
        'databases' => [
            'mysql',
        ],
        'files' => [
            'include' => [
                base_path('storage'),
            ],
            'exclude' => [
                base_path('storage/app/backups'),
            ],
        ],
    ],
    
    'destination' => [
        'disks' => [
            'local',
            'ftp', // or 'sftp'
        ],
    ],
    
    'monitor_backups' => [
        [
            'name' => env('APP_NAME', 'CID System'),
            'disks' => ['local', 'ftp'],
            'health_checks' => [
                \Spatie\Backup\Tasks\Monitor\HealthChecks\MaximumAgeInDays::class => 1,
                \Spatie\Backup\Tasks\Monitor\HealthChecks\MaximumStorageInMegabytes::class => 5000,
            ],
        ],
    ],
],
```

## Usage

### Running Backups

#### Manual Backup

```bash
# Create a backup
php artisan backup:run

# Create backup with specific tags
php artisan backup:run --only-db
php artisan backup:run --only-files
```

#### Scheduled Backups

Add to crontab:

```bash
sudo crontab -e
```

```cron
# Daily backup at 2 AM
0 2 * * * cd /var/www/cid-database && php artisan backup:run

# Clean old backups weekly
0 3 * * 0 cd /var/www/cid-database && php artisan backup:clean
```

### Backup Management

#### List Backups

```bash
# List local backups
php artisan backup:list

# List FTP backups (via tinker)
php artisan tinker
>>> Storage::disk('ftp')->files('/backups');
```

#### Clean Old Backups

```bash
php artisan backup:clean
```

#### Monitor Backup Health

```bash
php artisan backup:monitor
```

### Testing FTP Connection

```bash
php artisan tinker
```

```php
// Test FTP connection
Storage::disk('ftp')->put('test.txt', 'Hello World');
Storage::disk('ftp')->get('test.txt');
Storage::disk('ftp')->delete('test.txt');

// List FTP directory contents
Storage::disk('ftp')->files('/');

// Check if file exists
Storage::disk('ftp')->exists('test.txt');
```

## Backup Structure

### Backup Contents

Each backup archive contains:

1. **Database Dump**: SQL dump of all databases
2. **Files**: All files from configured directories
3. **Manifest**: Backup metadata and manifest file

### Backup Naming

Backups are named with timestamp:
```
backup-YYYY-MM-DD-HH-MM-SS.zip
```

Example:
```
backup-2024-01-15-14-30-00.zip
```

## Backup Retention

### Retention Policy

The system automatically manages backup retention:

- **Keep all backups**: 7 days
- **Keep daily backups**: 16 days
- **Keep weekly backups**: 8 weeks
- **Keep monthly backups**: 4 months
- **Keep yearly backups**: 2 years
- **Maximum storage**: 5000 MB

### Cleanup Process

The cleanup process:
1. Identifies backups older than retention periods
2. Removes backups exceeding storage limits
3. Maintains backup history according to policy
4. Logs cleanup activities

## Backup Encryption

### Encrypted Backups

Enable backup encryption by setting:

```env
BACKUP_ARCHIVE_PASSWORD=your-secure-password
```

Encrypted backups require the password to restore.

### Encryption Method

- Uses ZIP encryption
- Password-protected archives
- Secure encryption algorithm

## Backup Monitoring

### Health Checks

#### Maximum Age
- Checks if backups are older than 1 day
- Sends notification if backup is too old

#### Maximum Storage
- Checks if backup storage exceeds 5000 MB
- Sends notification if storage limit exceeded

### Email Notifications

Configure email notifications in `.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your-username
MAIL_PASSWORD=your-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=backups@yourdomain.com
MAIL_FROM_NAME="Backup System"
```

## Backup Restoration

### Restore from Backup

#### Manual Restoration

1. Download backup file
2. Extract backup archive
3. Restore database:
   ```bash
   mysql -u username -p database_name < backup.sql
   ```
4. Restore files:
   ```bash
   tar -xzf backup-files.tar.gz -C /path/to/restore
   ```

#### Automated Restoration (Planned)

Future version will include automated restoration commands.

## Backup Jobs

### CreateBackupJob

The system includes a queue job for creating backups:

```php
use App\Jobs\CreateBackupJob;

// Dispatch backup job
CreateBackupJob::dispatch();
```

### Queue Configuration

Ensure queue worker is running:

```bash
php artisan queue:work
```

Or via Supervisor (see deployment guide).

## Security Considerations

### Best Practices

1. **Use SFTP instead of FTP** when possible for encrypted transfers
2. **Set strong passwords** for FTP accounts
3. **Use private keys** for SFTP authentication
4. **Enable backup encryption** with `BACKUP_ARCHIVE_PASSWORD`
5. **Restrict FTP user permissions** to backup directory only
6. **Use firewall rules** to limit FTP access
7. **Regularly test backups** to ensure they can be restored
8. **Store backups off-site** for disaster recovery

### Access Control

- Limit FTP/SFTP access to backup server only
- Use dedicated backup user account
- Restrict backup directory permissions
- Monitor backup access logs

## Troubleshooting

### Common Issues

#### Connection Timeout
- Increase `FTP_TIMEOUT` value
- Check firewall settings
- Verify server is accessible
- Test connection manually

#### Authentication Failed
- Verify username and password
- Check if account is active
- Ensure proper permissions
- Test with FTP client

#### Directory Not Found
- Verify `FTP_ROOT` path exists
- Check directory permissions
- Create directory if needed
- Test directory access

#### Permission Denied
- Check FTP user permissions
- Verify directory write access
- Check server-side restrictions
- Review file permissions

### Testing Commands

```bash
# Test FTP connection
php artisan tinker
>>> Storage::disk('ftp')->exists('/');

# List FTP directory contents
>>> Storage::disk('ftp')->files('/');

# Test file upload
>>> Storage::disk('ftp')->put('test.txt', 'test content');
>>> Storage::disk('ftp')->get('test.txt');
>>> Storage::disk('ftp')->delete('test.txt');
```

## Backup Monitoring

### Monitoring Dashboard

Access backup management via web interface:
- View backup status
- Monitor backup health
- View backup history
- Download backups

### Backup Logs

Check backup logs:

```bash
tail -f storage/logs/laravel.log | grep backup
```

## Backup Best Practices

### Regular Backups

- Schedule daily backups
- Test backups regularly
- Monitor backup health
- Review backup logs

### Backup Storage

- Store backups in multiple locations
- Use remote storage for off-site backups
- Encrypt sensitive backups
- Maintain backup history

### Disaster Recovery

- Document restoration procedures
- Test restoration process
- Maintain backup documentation
- Keep backup passwords secure

---

**Document Version**: 1.0  
**Last Updated**: January 2025

