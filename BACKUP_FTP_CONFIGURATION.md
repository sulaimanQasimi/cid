# FTP Backup Configuration Guide

## Overview
This guide explains how to configure FTP storage for Laravel backups using the Spatie Laravel Backup package.

## Configuration Steps

### 1. Environment Variables
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
# Uncomment and configure if you prefer SFTP over FTP
# SFTP_HOST=your-sftp-server.com
# SFTP_USERNAME=your-sftp-username
# SFTP_PASSWORD=your-sftp-password
# SFTP_PRIVATE_KEY=/path/to/private/key
# SFTP_PASSPHRASE=your-key-passphrase
# SFTP_PORT=22
# SFTP_ROOT=/backups
# SFTP_TIMEOUT=30
# SFTP_DIRECTORY_PERM=0755

# Backup Archive Password (Optional - for encryption)
BACKUP_ARCHIVE_PASSWORD=your-secure-password

# Email Configuration for Backup Notifications
MAIL_FROM_ADDRESS=backups@yourdomain.com
MAIL_FROM_NAME="Backup System"
```

### 2. Filesystem Configuration
The FTP and SFTP disks have been added to `config/filesystems.php`:

- **FTP Disk**: Basic FTP connection
- **SFTP Disk**: Secure FTP with SSH key support

### 3. Backup Configuration
The backup configuration in `config/backup.php` has been updated to:

- Store backups on both local storage and FTP server
- Monitor backups on both disks
- Support multiple storage destinations for redundancy

## Configuration Options

### FTP Configuration
- `FTP_HOST`: Your FTP server hostname or IP address
- `FTP_USERNAME`: FTP username
- `FTP_PASSWORD`: FTP password
- `FTP_PORT`: FTP port (default: 21)
- `FTP_ROOT`: Root directory on FTP server (default: /)
- `FTP_PASSIVE`: Use passive mode (default: true)
- `FTP_SSL`: Use SSL/TLS (default: false)
- `FTP_TIMEOUT`: Connection timeout in seconds (default: 30)

### SFTP Configuration
- `SFTP_HOST`: Your SFTP server hostname or IP address
- `SFTP_USERNAME`: SFTP username
- `SFTP_PASSWORD`: SFTP password (or use private key)
- `SFTP_PRIVATE_KEY`: Path to private key file
- `SFTP_PASSPHRASE`: Passphrase for private key
- `SFTP_PORT`: SFTP port (default: 22)
- `SFTP_ROOT`: Root directory on SFTP server (default: /)
- `SFTP_TIMEOUT`: Connection timeout in seconds (default: 30)
- `SFTP_DIRECTORY_PERM`: Directory permissions (default: 0755)

## Usage

### Running Backups
```bash
# Create a backup
php artisan backup:run

# Create backup with specific tags
php artisan backup:run --only-db
php artisan backup:run --only-files

# Clean old backups
php artisan backup:clean

# Monitor backup health
php artisan backup:monitor
```

### Testing FTP Connection
```bash
# Test FTP connection
php artisan tinker
>>> Storage::disk('ftp')->put('test.txt', 'Hello World');
>>> Storage::disk('ftp')->get('test.txt');
>>> Storage::disk('ftp')->delete('test.txt');
```

## Security Considerations

1. **Use SFTP instead of FTP** when possible for encrypted transfers
2. **Set strong passwords** for FTP accounts
3. **Use private keys** for SFTP authentication
4. **Enable backup encryption** with `BACKUP_ARCHIVE_PASSWORD`
5. **Restrict FTP user permissions** to backup directory only
6. **Use firewall rules** to limit FTP access

## Troubleshooting

### Common Issues

1. **Connection Timeout**
   - Increase `FTP_TIMEOUT` value
   - Check firewall settings
   - Verify server is accessible

2. **Authentication Failed**
   - Verify username and password
   - Check if account is active
   - Ensure proper permissions

3. **Directory Not Found**
   - Verify `FTP_ROOT` path exists
   - Check directory permissions
   - Create directory if needed

4. **Permission Denied**
   - Check FTP user permissions
   - Verify directory write access
   - Check server-side restrictions

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

The system will monitor backups on both local and FTP storage:
- Maximum age: 1 day
- Maximum storage: 5000 MB
- Email notifications for failed backups

## Cleanup Strategy

Backups are automatically cleaned up based on:
- Keep all backups for 7 days
- Keep daily backups for 16 days
- Keep weekly backups for 8 weeks
- Keep monthly backups for 4 months
- Keep yearly backups for 2 years
- Maximum storage: 5000 MB
