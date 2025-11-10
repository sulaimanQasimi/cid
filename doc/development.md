# CID System - Development Guide

## Overview

This guide provides comprehensive instructions for setting up and developing the CID system.

## Prerequisites

### Required Software

- **PHP**: 8.2 or higher
- **Composer**: Latest version
- **Node.js**: 18.x or higher
- **npm**: Comes with Node.js
- **Git**: Version control
- **Database**: SQLite (development) or MySQL/PostgreSQL

### Recommended Tools

- **IDE**: VS Code, PhpStorm, or similar
- **Database Client**: TablePlus, DBeaver, or similar
- **API Client**: Postman, Insomnia, or similar
- **Version Control**: Git

## Development Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-org/cid-database.git
cd cid-database
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Install Node.js Dependencies

```bash
npm install
```

### 4. Environment Configuration

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 5. Configure Environment Variables

Edit `.env` file:

```env
APP_NAME="CID System"
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
# Or for MySQL:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=cid_database
# DB_USERNAME=root
# DB_PASSWORD=

BROADCAST_DRIVER=reverb
REVERB_APP_ID=your-app-id
REVERB_APP_KEY=your-app-key
REVERB_APP_SECRET=your-app-secret
REVERB_HOST=localhost
REVERB_PORT=8080
REVERB_SCHEME=http
```

### 6. Database Setup

#### SQLite (Development)
```bash
# Create database file
touch database/database.sqlite

# Update .env
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database/database.sqlite
```

#### MySQL (Development)
```bash
# Create database
mysql -u root -p
CREATE DATABASE cid_database;
EXIT;

# Update .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=cid_database
DB_USERNAME=root
DB_PASSWORD=your_password
```

### 7. Run Migrations

```bash
php artisan migrate
```

### 8. Seed Database

```bash
php artisan db:seed
```

This will create:
- Default admin user
- Roles and permissions
- Sample data (if seeders exist)

### 9. Start Development Servers

#### Option 1: Separate Terminals

```bash
# Terminal 1: Laravel server
php artisan serve

# Terminal 2: Vite dev server
npm run dev

# Terminal 3: Queue worker
php artisan queue:work

# Terminal 4: Reverb WebSocket server
php artisan reverb:start
```

#### Option 2: Concurrent (Recommended)

```bash
composer run dev
```

This runs all servers concurrently:
- Laravel server (port 8000)
- Queue worker
- Vite dev server (port 5173)
- Reverb WebSocket server (port 8080)

### 10. Access Application

- **Web Application**: http://localhost:8000
- **Vite Dev Server**: http://localhost:5173

## Code Structure

### Backend Structure

```
app/
├── Console/Commands/     # Artisan commands
├── Events/              # Event classes
├── Http/
│   ├── Controllers/    # Controller classes
│   ├── Middleware/      # Middleware classes
│   └── Requests/        # Form request validation
├── Jobs/                # Queue job classes
├── Models/              # Eloquent models
├── Policies/            # Authorization policies
├── Providers/           # Service providers
├── Rules/               # Custom validation rules
└── Services/            # Service classes
```

### Frontend Structure

```
resources/js/
├── components/         # Reusable React components
│   ├── ui/            # UI primitives
│   └── [features]/    # Feature-specific components
├── hooks/              # Custom React hooks
├── layouts/            # Layout components
├── lib/                # Utility libraries
│   ├── i18n/          # Translation system
│   └── permissions.ts # Permission utilities
├── pages/              # Page components (Inertia)
└── types/              # TypeScript definitions
```

## Development Workflow

### 1. Feature Development

#### Create Feature Branch
```bash
git checkout -b feature/new-feature
```

#### Make Changes
- Create/update models
- Create/update controllers
- Create/update frontend components
- Write tests

#### Test Changes
```bash
# Run PHP tests
php artisan test

# Run frontend tests (if configured)
npm test

# Check code style
./vendor/bin/pint
npm run lint
```

#### Commit Changes
```bash
git add .
git commit -m "Add new feature"
```

#### Push to Remote
```bash
git push origin feature/new-feature
```

### 2. Database Changes

#### Create Migration
```bash
php artisan make:migration create_new_table
```

#### Edit Migration
Edit the migration file in `database/migrations/`

#### Run Migration
```bash
php artisan migrate
```

#### Rollback Migration
```bash
php artisan migrate:rollback
```

### 3. Model Development

#### Create Model
```bash
php artisan make:model ModelName
```

#### Create Model with Migration
```bash
php artisan make:model ModelName -m
```

#### Create Model with Migration, Factory, and Seeder
```bash
php artisan make:model ModelName -mfs
```

#### Create Policy
```bash
php artisan make:policy ModelNamePolicy --model=ModelName
```

### 4. Controller Development

#### Create Controller
```bash
php artisan make:controller ControllerName
```

#### Create Resource Controller
```bash
php artisan make:controller ControllerName --resource
```

#### Create API Controller
```bash
php artisan make:controller Api/ControllerName --api
```

### 5. Frontend Development

#### Create Component
Create new component in `resources/js/components/`

#### Create Page
Create new page in `resources/js/pages/`

#### Add Route
Add route in `routes/web.php` or feature route file

#### Use Translation
```typescript
import { useTranslation } from '@/lib/i18n/translate';

function MyComponent() {
  const { t } = useTranslation();
  return <div>{t('namespace.key')}</div>;
}
```

#### Use Permissions
```typescript
import { usePermissions } from '@/hooks/use-permissions';

function MyComponent() {
  const { canCreate, canView } = usePermissions();
  
  return (
    <div>
      {canCreate('criminal') && <Button>Create</Button>}
      {canView('criminal') && <Button>View</Button>}
    </div>
  );
}
```

## Testing

### PHP Testing

#### Run All Tests
```bash
php artisan test
```

#### Run Specific Test
```bash
php artisan test --filter=UserTest
```

#### Run with Coverage
```bash
php artisan test --coverage
```

### Frontend Testing

#### Run Tests (if configured)
```bash
npm test
```

#### Run with Coverage
```bash
npm run test:coverage
```

## Code Quality

### PHP Code Style

#### Run Pint (Code Style Fixer)
```bash
./vendor/bin/pint
```

#### Check Specific Path
```bash
./vendor/bin/pint app/Models
```

### JavaScript/TypeScript Code Quality

#### Run ESLint
```bash
npm run lint
```

#### Fix ESLint Issues
```bash
npm run lint -- --fix
```

#### Run Prettier
```bash
npm run format
```

#### Check Formatting
```bash
npm run format:check
```

#### Type Checking
```bash
npm run types
```

## Debugging

### Laravel Debugging

#### Enable Debug Mode
```env
APP_DEBUG=true
```

#### View Logs
```bash
tail -f storage/logs/laravel.log
```

#### Use Tinker
```bash
php artisan tinker
```

#### Use Pail (Laravel Pail)
```bash
php artisan pail
```

### Frontend Debugging

#### Browser DevTools
- Use React DevTools extension
- Use browser console
- Use Network tab for API calls

#### Vite DevTools
- Hot Module Replacement (HMR)
- Fast Refresh
- Error overlay

## Database Management

### Migrations

#### Create Migration
```bash
php artisan make:migration migration_name
```

#### Run Migrations
```bash
php artisan migrate
```

#### Rollback Last Migration
```bash
php artisan migrate:rollback
```

#### Rollback All Migrations
```bash
php artisan migrate:reset
```

#### Refresh Database
```bash
php artisan migrate:fresh
```

#### Refresh with Seeding
```bash
php artisan migrate:fresh --seed
```

### Seeders

#### Create Seeder
```bash
php artisan make:seeder SeederName
```

#### Run Seeder
```bash
php artisan db:seed
```

#### Run Specific Seeder
```bash
php artisan db:seed --class=SeederName
```

### Factories

#### Create Factory
```bash
php artisan make:factory ModelNameFactory --model=ModelName
```

#### Use Factory
```php
// In seeder or test
Criminal::factory()->create();
Criminal::factory()->count(10)->create();
```

## Real-time Development

### WebSocket Development

#### Start Reverb Server
```bash
php artisan reverb:start
```

#### Test WebSocket Connection
Use browser console or WebSocket client

### Frontend Real-time

#### Use Laravel Echo
```typescript
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Echo = new Echo({
  broadcaster: 'reverb',
  key: process.env.MIX_REVERB_APP_KEY,
  wsHost: process.env.MIX_REVERB_HOST,
  wsPort: process.env.MIX_REVERB_PORT,
});
```

## Performance Optimization

### Backend Optimization

#### Cache Configuration
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

#### Clear Cache
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### Frontend Optimization

#### Build for Production
```bash
npm run build
```

#### Build with SSR
```bash
npm run build:ssr
```

## Common Tasks

### Add New Permission

1. Add permission to `PermissionSeeder`
2. Run seeder: `php artisan db:seed --class=PermissionSeeder`
3. Assign permission to roles
4. Use in frontend with permission guards

### Add New Translation

1. Add key to `resources/js/lib/i18n/translations/fa.json`
2. Use in component: `t('namespace.key')`
3. Optionally add to database via admin interface

### Add New Model

1. Create migration: `php artisan make:migration`
2. Create model: `php artisan make:model`
3. Create policy: `php artisan make:policy`
4. Create controller: `php artisan make:controller`
5. Add routes
6. Create frontend pages
7. Add permissions to seeder

## Troubleshooting

### Common Issues

#### Database Connection Error
- Check `.env` database configuration
- Verify database exists
- Check database credentials
- Test connection: `php artisan tinker` then `DB::connection()->getPdo()`

#### Permission Denied Errors
- Check file permissions: `chmod -R 775 storage bootstrap/cache`
- Check ownership: `chown -R www-data:www-data storage bootstrap/cache`

#### Vite HMR Not Working
- Check Vite server is running
- Verify port 5173 is available
- Check browser console for errors

#### WebSocket Connection Failed
- Verify Reverb server is running
- Check REVERB configuration in `.env`
- Verify firewall allows WebSocket connections

---

**Document Version**: 1.0  
**Last Updated**: January 2025

