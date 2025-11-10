# CID System - Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the CID system to a production environment.

## System Requirements

### Minimum Requirements

- **PHP**: 8.2 or higher
- **Node.js**: 18.x or higher
- **Database**: MySQL 8.0+ or PostgreSQL 13+
- **Web Server**: Nginx 1.18+ or Apache 2.4+
- **Memory**: 2GB RAM minimum
- **Storage**: 10GB available space

### Recommended Requirements

- **PHP**: 8.3 with OPcache enabled
- **Node.js**: 20.x LTS
- **Database**: MySQL 8.0+ or PostgreSQL 15+
- **Web Server**: Nginx with HTTP/2
- **Memory**: 8GB RAM
- **Storage**: 50GB SSD
- **Cache**: Redis 7.0+

## Pre-Deployment Checklist

- [ ] Server provisioned and configured
- [ ] Domain name configured
- [ ] SSL certificate obtained
- [ ] Database server ready
- [ ] Backup storage configured
- [ ] Environment variables prepared
- [ ] DNS records configured
- [ ] Firewall rules configured

## Server Setup

### 1. Update System

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install PHP 8.3

```bash
sudo apt install software-properties-common
sudo add-apt-repository ppa:ondrej/php
sudo apt update
sudo apt install php8.3 php8.3-fpm php8.3-mysql php8.3-xml php8.3-mbstring \
  php8.3-curl php8.3-zip php8.3-gd php8.3-bcmath php8.3-intl php8.3-redis
```

### 3. Install Node.js 20.x

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs
```

### 4. Install Composer

```bash
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

### 5. Install Database

#### MySQL
```bash
sudo apt install mysql-server
sudo mysql_secure_installation
```

#### PostgreSQL
```bash
sudo apt install postgresql postgresql-contrib
sudo -u postgres createuser --interactive
sudo -u postgres createdb cid_database
```

### 6. Install Redis

```bash
sudo apt install redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server
```

### 7. Install Nginx

```bash
sudo apt install nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

## Application Deployment

### 1. Clone Repository

```bash
cd /var/www
sudo git clone https://github.com/your-org/cid-database.git
sudo chown -R www-data:www-data cid-database
cd cid-database
```

### 2. Install Dependencies

```bash
# PHP dependencies
composer install --optimize-autoloader --no-dev

# Node.js dependencies
npm ci --production
```

### 3. Build Frontend Assets

```bash
npm run build
```

### 4. Environment Configuration

```bash
# Copy environment file
cp .env.example .env

# Edit environment file
nano .env
```

### 5. Configure Environment Variables

```env
APP_NAME="CID System"
APP_ENV=production
APP_KEY=base64:...
APP_DEBUG=false
APP_URL=https://your-domain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=cid_database
DB_USERNAME=cid_user
DB_PASSWORD=secure_password

BROADCAST_DRIVER=reverb
REVERB_APP_ID=your-app-id
REVERB_APP_KEY=your-app-key
REVERB_APP_SECRET=your-app-secret
REVERB_HOST=your-domain.com
REVERB_PORT=8080
REVERB_SCHEME=https

CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

FTP_HOST=your-ftp-server.com
FTP_USERNAME=backup_user
FTP_PASSWORD=secure_password
FTP_PORT=21
FTP_ROOT=/backups
```

### 6. Generate Application Key

```bash
php artisan key:generate
```

### 7. Run Migrations

```bash
php artisan migrate --force
```

### 8. Seed Database

```bash
php artisan db:seed --force
```

### 9. Set Permissions

```bash
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

### 10. Optimize Application

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

## Web Server Configuration

### Nginx Configuration

Create Nginx configuration file:

```bash
sudo nano /etc/nginx/sites-available/cid-database
```

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    root /var/www/cid-database/public;
    index index.php;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Logging
    access_log /var/log/nginx/cid-database-access.log;
    error_log /var/log/nginx/cid-database-error.log;

    # PHP Handling
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    # Static Files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Deny access to hidden files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    # Main application
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/cid-database /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## SSL Certificate Setup

### Using Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal (already configured via cron)
```

## Queue Worker Setup

### Supervisor Configuration

Create supervisor configuration:

```bash
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

Reload supervisor:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start cid-queue:*
```

## Reverb WebSocket Server

### Supervisor Configuration

```bash
sudo nano /etc/supervisor/conf.d/cid-reverb.conf
```

```ini
[program:cid-reverb]
command=php /var/www/cid-database/artisan reverb:start --host=0.0.0.0 --port=8080
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
redirect_stderr=true
stdout_logfile=/var/www/cid-database/storage/logs/reverb.log
```

Reload supervisor:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start cid-reverb:*
```

## Backup Configuration

### FTP Backup Setup

Configure FTP backup in `.env`:

```env
FTP_HOST=your-ftp-server.com
FTP_USERNAME=backup_user
FTP_PASSWORD=secure_password
FTP_PORT=21
FTP_ROOT=/backups
FTP_PASSIVE=true
FTP_SSL=false
```

### Backup Scheduling

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

## PHP Optimization

### OPcache Configuration

Edit PHP-FPM configuration:

```bash
sudo nano /etc/php/8.3/fpm/php.ini
```

```ini
opcache.enable=1
opcache.memory_consumption=256
opcache.interned_strings_buffer=16
opcache.max_accelerated_files=20000
opcache.validate_timestamps=0
opcache.revalidate_freq=0
opcache.fast_shutdown=1
```

Restart PHP-FPM:

```bash
sudo systemctl restart php8.3-fpm
```

## Database Optimization

### MySQL Optimization

Edit MySQL configuration:

```bash
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
```

```ini
[mysqld]
innodb_buffer_pool_size = 2G
query_cache_size = 256M
max_connections = 200
```

Restart MySQL:

```bash
sudo systemctl restart mysql
```

## Monitoring

### Application Monitoring

#### Laravel Logs
```bash
tail -f /var/www/cid-database/storage/logs/laravel.log
```

#### Queue Logs
```bash
tail -f /var/www/cid-database/storage/logs/queue.log
```

#### Reverb Logs
```bash
tail -f /var/www/cid-database/storage/logs/reverb.log
```

### System Monitoring

#### System Resources
```bash
htop
```

#### Disk Usage
```bash
df -h
```

#### Database Connections
```bash
mysqladmin processlist
```

## Maintenance

### Regular Maintenance Tasks

#### Clear Cache
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

#### Optimize Application
```bash
php artisan optimize
```

#### Update Dependencies
```bash
composer update --no-dev
npm update
npm run build
```

#### Run Migrations
```bash
php artisan migrate --force
```

## Troubleshooting

### Common Issues

#### 500 Internal Server Error
- Check Laravel logs: `tail -f storage/logs/laravel.log`
- Check PHP-FPM logs: `tail -f /var/log/php8.3-fpm.log`
- Check Nginx error logs: `tail -f /var/log/nginx/error.log`
- Verify file permissions
- Check `.env` configuration

#### Database Connection Error
- Verify database credentials in `.env`
- Check database server is running
- Verify database exists
- Check user permissions

#### WebSocket Connection Failed
- Verify Reverb server is running
- Check REVERB configuration
- Verify firewall allows port 8080
- Check SSL certificate for WSS

#### Queue Jobs Not Processing
- Check supervisor status: `sudo supervisorctl status`
- Check queue logs
- Verify Redis is running
- Check queue connection in `.env`

## Security Hardening

### Firewall Configuration

```bash
# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow WebSocket (if needed)
sudo ufw allow 8080/tcp

# Enable firewall
sudo ufw enable
```

### File Permissions

```bash
# Set correct ownership
sudo chown -R www-data:www-data /var/www/cid-database

# Set correct permissions
sudo find /var/www/cid-database -type f -exec chmod 644 {} \;
sudo find /var/www/cid-database -type d -exec chmod 755 {} \;
sudo chmod -R 775 storage bootstrap/cache
```

---

**Document Version**: 1.0  
**Last Updated**: January 2025

