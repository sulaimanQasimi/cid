# CID System - Architecture

## System Architecture Overview

The CID system follows a modern, scalable architecture pattern with clear separation of concerns between frontend and backend components.

## Technology Stack

### Backend Stack

#### Framework
- **Laravel 12.x**: Modern PHP framework with elegant syntax
- **PHP 8.2+**: Latest PHP features and performance improvements
- **Composer**: Dependency management for PHP packages

#### Core Packages
- **Inertia.js Laravel**: Server-side rendering bridge
- **Spatie Laravel Permission**: Role and permission management
- **Spatie Activity Log**: Comprehensive activity logging
- **Spatie Laravel Backup**: Automated backup system
- **Laravel Reverb**: WebSocket server for real-time features
- **Laravel Sanctum**: API token authentication
- **Jenssegers Agent**: User agent parsing
- **Namu Wirechat**: Chat system integration
- **Morilog Jalali**: Persian/Jalali date support

#### Database
- **SQLite**: Development database (file-based)
- **MySQL/PostgreSQL**: Production database options
- **Eloquent ORM**: Database abstraction layer
- **Migrations**: Version-controlled database schema

### Frontend Stack

#### Core Framework
- **React 19.x**: Modern UI library with hooks
- **TypeScript**: Type-safe JavaScript development
- **Inertia.js React**: Server-side rendering with React
- **Vite**: Modern build tool and dev server

#### UI Components
- **Radix UI**: Accessible component primitives
- **Tailwind CSS 4.x**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Class Variance Authority**: Component variant management
- **Headless UI**: Unstyled, accessible UI components

#### Data Visualization
- **AmCharts 5**: Interactive charts and maps
- **AmCharts Geodata**: Geographic data for maps
- **AmCharts Fonts**: Custom font support

#### Utilities
- **Moment.js**: Date manipulation with Jalali support
- **Date-fns**: Modern date utility library
- **QRCode**: QR code generation
- **Simple Peer**: WebRTC peer connection management
- **Laravel Echo**: Real-time event broadcasting
- **Pusher JS**: WebSocket client library

### Development Tools

#### Build Tools
- **Vite**: Fast build tool with HMR
- **TypeScript**: Type checking and compilation
- **ESLint**: Code linting
- **Prettier**: Code formatting

#### Testing
- **Pest**: Modern PHP testing framework
- **Laravel Testing**: Built-in testing utilities
- **Factory**: Model factories for test data

#### Code Quality
- **Laravel Pint**: PHP code style fixer
- **PHPStan**: Static analysis tool
- **Collision**: Beautiful error reporting

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Browser                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   React UI   │  │  WebSocket   │  │   WebRTC     │      │
│  │  Components  │  │   Client     │  │   Client     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                          │              │              │
                          │              │              │
        ┌─────────────────┘              │              └─────────┐
        │                                │                          │
        ▼                                ▼                          ▼
┌──────────────┐              ┌──────────────┐          ┌──────────────┐
│   Nginx      │              │   Laravel    │          │   Reverb     │
│   Web Server │              │   Backend    │          │  WebSocket   │
│              │              │              │          │   Server     │
└──────────────┘              └──────────────┘          └──────────────┘
        │                                │                          │
        │                                │                          │
        └────────────────────────────────┴──────────────────────────┘
                                         │
                                         ▼
                              ┌─────────────────┐
                              │    Database     │
                              │  (SQLite/MySQL) │
                              └─────────────────┘
                                         │
                                         ▼
                              ┌─────────────────┐
                              │  File Storage   │
                              │  (Local/FTP)    │
                              └─────────────────┘
```

## Application Structure

### Backend Structure

```
app/
├── Console/
│   ├── Commands/          # Artisan commands
│   └── Kernel.php         # Command scheduling
├── Events/                 # Event classes
│   ├── NewMeetingMessage.php
│   ├── ReportCreated.php
│   ├── UserJoinedMeeting.php
│   ├── UserLeftMeeting.php
│   └── WebRTCSignal.php
├── Http/
│   ├── Controllers/       # Controller classes
│   │   ├── Admin/         # Admin controllers
│   │   ├── Api/           # API controllers
│   │   ├── Auth/          # Authentication controllers
│   │   └── Settings/      # Settings controllers
│   ├── Middleware/        # Middleware classes
│   └── Requests/          # Form request validation
├── Jobs/                   # Queue job classes
│   └── CreateBackupJob.php
├── Models/                 # Eloquent models
│   ├── Traits/            # Model traits
│   └── [29 model files]
├── Policies/              # Authorization policies
│   └── [24 policy files]
├── Providers/             # Service providers
│   ├── AppServiceProvider.php
│   ├── AuthServiceProvider.php
│   └── BroadcastServiceProvider.php
├── Rules/                  # Custom validation rules
│   └── PersianDate.php
└── Services/               # Service classes
    ├── PersianDateService.php
    └── VisitorTrackingService.php
```

### Frontend Structure

```
resources/js/
├── components/            # Reusable React components
│   ├── ui/               # UI primitives (Radix UI)
│   └── [feature components]
├── hooks/                 # Custom React hooks
│   ├── use-permissions.ts
│   └── [other hooks]
├── layouts/               # Layout components
│   ├── AppLayout.tsx
│   └── GuestLayout.tsx
├── lib/                   # Utility libraries
│   ├── i18n/             # Internationalization
│   │   ├── translate.ts
│   │   ├── language-context.tsx
│   │   └── translations/
│   ├── permissions.ts    # Permission utilities
│   └── [other utilities]
├── pages/                 # Page components (Inertia)
│   ├── Admin/
│   ├── Criminal/
│   ├── Incidents/
│   ├── Meeting/
│   └── [other pages]
└── types/                 # TypeScript type definitions
```

## Request Flow

### Standard HTTP Request Flow

```
1. Client Request
   ↓
2. Nginx/Apache (Web Server)
   ↓
3. Laravel Middleware Stack
   ├── TrustProxies
   ├── HandleCors
   ├── Authenticate
   └── VerifyCsrfToken
   ↓
4. Route Resolution
   ↓
5. Controller Method
   ├── Authorization (Policy Check)
   ├── Validation (Form Request)
   ├── Business Logic
   └── Data Processing
   ↓
6. Model/Database Interaction
   ↓
7. Response Generation
   ├── Inertia Response (for pages)
   └── JSON Response (for API)
   ↓
8. Frontend Rendering
   └── React Component Update
```

### Real-time Event Flow

```
1. Event Triggered (Backend)
   ↓
2. Laravel Event Broadcasting
   ↓
3. Reverb WebSocket Server
   ↓
4. Laravel Echo (Frontend)
   ↓
5. React Component Update
```

## Data Flow

### Database Layer

```
┌─────────────┐
│   Models    │  ← Eloquent ORM
└─────────────┘
      │
      ▼
┌─────────────┐
│ Migrations  │  ← Schema Definition
└─────────────┘
      │
      ▼
┌─────────────┐
│  Database   │  ← SQLite/MySQL/PostgreSQL
└─────────────┘
```

### State Management

The system uses Inertia.js for state management:

- **Server State**: Managed by Laravel backend
- **Client State**: Managed by React components
- **Shared State**: Passed via Inertia props
- **Real-time State**: Updated via WebSocket events

## Security Architecture

### Authentication Flow

```
1. User Login Request
   ↓
2. AuthenticatedSessionController
   ↓
3. Credential Validation
   ↓
4. Session Creation
   ↓
5. CSRF Token Generation
   ↓
6. Permission Loading
   ↓
7. Response with Auth Data
```

### Authorization Flow

```
1. Request to Protected Resource
   ↓
2. Policy Check (via authorize() method)
   ↓
3. Permission Verification
   ├── Role Check
   ├── Permission Check
   └── Model Policy Check
   ↓
4. Access Granted/Denied
   ↓
5. Response Generation
```

## Real-time Architecture

### WebSocket Connection

```
Client Browser
    │
    ├── Laravel Echo (Frontend)
    │       │
    │       └── Pusher Protocol
    │               │
    └───────────────┴───────────────► Reverb Server
                                            │
                                            ▼
                                    Laravel Backend
                                            │
                                            ▼
                                    Event Broadcasting
```

### WebRTC Architecture

```
Peer 1                    Signaling Server                Peer 2
  │                            │                            │
  │─── Offer ──────────────────►                            │
  │                            │                            │
  │                            │─── Offer ────────────────►│
  │                            │                            │
  │◄── Answer ─────────────────│                            │
  │                            │                            │
  │                            │◄── Answer ────────────────│
  │                            │                            │
  │◄───────────────────────────┼───────────────────────────►│
  │      Direct P2P Connection (via WebRTC)                │
```

## Caching Strategy

### Cache Layers

1. **Application Cache**: Laravel cache for queries and computed data
2. **OPcache**: PHP bytecode caching
3. **Database Query Cache**: Database-level query caching
4. **CDN Cache**: Static asset caching (if using CDN)
5. **Browser Cache**: Client-side caching for static assets

### Cache Invalidation

- **Time-based**: Automatic expiration
- **Event-based**: Invalidation on data changes
- **Manual**: Explicit cache clearing

## Queue System

### Queue Architecture

```
Job Creation
    │
    ▼
Queue Driver (Database/Redis)
    │
    ▼
Queue Worker
    │
    ▼
Job Processing
    │
    ▼
Result Storage
```

### Queue Jobs

- **CreateBackupJob**: Automated backup creation
- **Email Notifications**: Async email sending
- **Report Generation**: Heavy report processing
- **Data Processing**: Batch data operations

## File Storage

### Storage Architecture

```
Application
    │
    ├── Local Storage (Default)
    │       └── storage/app/
    │
    └── Remote Storage (FTP/SFTP)
            └── Backup Storage
```

### File Organization

- **Public Files**: `public/storage/` (symlinked)
- **Private Files**: `storage/app/`
- **Backups**: `storage/app/backups/`
- **Uploads**: `storage/app/uploads/`

## Performance Optimization

### Backend Optimization

- **OPcache**: PHP bytecode caching
- **Query Optimization**: Eager loading, query caching
- **Database Indexing**: Strategic index placement
- **Response Caching**: Cache API responses
- **Asset Optimization**: Minification and compression

### Frontend Optimization

- **Code Splitting**: Route-based code splitting
- **Lazy Loading**: Component lazy loading
- **Asset Optimization**: Vite build optimization
- **Image Optimization**: Responsive images
- **Bundle Optimization**: Tree shaking and minification

## Monitoring & Logging

### Logging Strategy

- **Application Logs**: Laravel log files
- **Error Tracking**: Exception logging
- **Activity Logs**: User activity tracking
- **Access Logs**: Web server access logs
- **Performance Logs**: Query and performance metrics

### Monitoring Points

- **Application Performance**: Response times, memory usage
- **Database Performance**: Query times, connection pool
- **Server Resources**: CPU, memory, disk usage
- **Queue Performance**: Job processing times
- **Real-time Connections**: WebSocket connection count

## Scalability Considerations

### Horizontal Scaling

- **Load Balancing**: Multiple application servers
- **Database Replication**: Read replicas for scaling reads
- **Session Storage**: Centralized session storage (Redis)
- **Queue Workers**: Multiple queue worker processes

### Vertical Scaling

- **Server Resources**: CPU, memory, storage upgrades
- **Database Optimization**: Query optimization, indexing
- **Caching**: Increased cache memory
- **OPcache**: Larger OPcache memory

## Deployment Architecture

### Production Environment

```
┌──────────────┐
│   Load       │
│   Balancer   │
└──────┬───────┘
       │
   ┌───┴───┐
   │       │
┌──▼──┐ ┌──▼──┐
│ App │ │ App │  Application Servers
│  1  │ │  2  │
└──┬──┘ └──┬──┘
   │       │
   └───┬───┘
       │
   ┌───▼───┐
   │  DB   │  Database Server (Master)
   │Master │
   └───┬───┘
       │
   ┌───▼───┐
   │  DB   │  Database Server (Replica)
   │Replica│
   └───────┘
```

---

**Document Version**: 1.0  
**Last Updated**: January 2025

