# CID System - API Documentation

## Overview

The CID system provides a RESTful API for accessing system resources. All API endpoints require authentication via Laravel Sanctum.

## Base URL

```
https://your-domain.com/api
```

## Authentication

### Authentication Method

The API uses Laravel Sanctum for authentication. Include the authentication token in the request header:

```
Authorization: Bearer {token}
```

### Obtaining a Token

Tokens are obtained through the web interface after login. API tokens are managed through the user settings.

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "errors": {
    "field": ["Validation error message"]
  }
}
```

## Endpoints

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

**Response:**
```json
{
  "success": true,
  "user": { ... },
  "token": "auth_token_here"
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

**Query Parameters:**
- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 15)
- `search`: Search query
- `department_id`: Filter by department
- `crime_type`: Filter by crime type

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "number": "CR-001",
        "name": "John Doe",
        "father_name": "Robert Doe",
        "id_card_number": "123456789",
        "crime_type": "Theft",
        "department": { ... },
        "created_at": "2024-01-01T00:00:00.000000Z"
      }
    ],
    "current_page": 1,
    "total": 100,
    "per_page": 15
  }
}
```

#### Get Criminal
```http
GET /api/criminals/{id}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "number": "CR-001",
    "name": "John Doe",
    "photo": "/storage/photos/criminal-1.jpg",
    "crime_type": "Theft",
    "department": { ... },
    "visits_count": 45,
    "unique_visitors_count": 12
  }
}
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
  "department_id": 1,
  "arrest_date": "2024-01-15",
  "phone_number": "+1234567890"
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

**Query Parameters:**
- `page`: Page number
- `per_page`: Items per page
- `search`: Search query
- `category_id`: Filter by category
- `status`: Filter by status
- `confirmed`: Filter by confirmation status

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

#### Update Incident
```http
PUT /api/incidents/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "resolved",
  "description": "Updated description"
}
```

#### Confirm Incident
```http
POST /api/incidents/{id}/confirm
Authorization: Bearer {token}
```

#### Unconfirm Incident
```http
POST /api/incidents/{id}/unconfirm
Authorization: Bearer {token}
```

### Incident Report API

#### List Incident Reports
```http
GET /api/incident-reports
Authorization: Bearer {token}
```

#### Create Incident Report
```http
POST /api/incident-reports
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Monthly Incident Report",
  "description": "Report for January 2024",
  "incident_ids": [1, 2, 3]
}
```

#### Get Incident Report
```http
GET /api/incident-reports/{id}
Authorization: Bearer {token}
```

### Intelligence API

#### List Information
```http
GET /api/infos
Authorization: Bearer {token}
```

**Query Parameters:**
- `category_id`: Filter by category
- `info_type_id`: Filter by type
- `confirmed`: Filter by confirmation status

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

#### Confirm Information
```http
POST /api/infos/{id}/confirm
Authorization: Bearer {token}
```

### Meeting API

#### List Meetings
```http
GET /api/meetings
Authorization: Bearer {token}
```

**Query Parameters:**
- `status`: Filter by status
- `scheduled_at`: Filter by scheduled date

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
  "offline_enabled": true,
  "participant_ids": [1, 2, 3]
}
```

#### Get Meeting
```http
GET /api/meetings/{id}
Authorization: Bearer {token}
```

#### Join Meeting
```http
POST /api/meetings/{id}/join
Authorization: Bearer {token}
```

#### Leave Meeting
```http
POST /api/meetings/{id}/leave
Authorization: Bearer {token}
```

### Analytics API

#### Visitor Analytics
```http
GET /api/analytics
Authorization: Bearer {token}
```

**Query Parameters:**
- `period`: Time period (today, week, month, year)
- `model_type`: Filter by model type

**Response:**
```json
{
  "success": true,
  "data": {
    "total_visits": 1000,
    "unique_visitors": 250,
    "today_visits": 50,
    "this_week_visits": 200,
    "this_month_visits": 800,
    "device_distribution": {
      "mobile": 600,
      "desktop": 350,
      "tablet": 50
    },
    "browser_distribution": {
      "Chrome": 700,
      "Firefox": 200,
      "Safari": 100
    }
  }
}
```

#### Model Analytics
```http
GET /api/analytics/{modelType}
Authorization: Bearer {token}
```

**Query Parameters:**
- `period`: Time period
- `model_id`: Specific model ID

#### Model Detail Analytics
```http
GET /api/analytics/{modelType}/{modelId}
Authorization: Bearer {token}
```

### Language API

#### Get Translations
```http
GET /api/languages/translations?language={code}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "translations": {
    "common.save": "ذخیره",
    "common.cancel": "لغو",
    "criminal.page_title": "مدیریت مجرمان"
  },
  "language": "fa"
}
```

#### List Languages
```http
GET /api/languages
Authorization: Bearer {token}
```

### User Management API

#### List Users
```http
GET /api/users
Authorization: Bearer {token}
```

#### Get User
```http
GET /api/users/{id}
Authorization: Bearer {token}
```

#### Create User
```http
POST /api/users
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure_password",
  "role_ids": [1, 2]
}
```

### Department API

#### List Departments
```http
GET /api/departments
Authorization: Bearer {token}
```

#### Create Department
```http
POST /api/departments
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Investigation Department",
  "description": "Criminal investigation unit"
}
```

### Location API

#### List Provinces
```http
GET /api/provinces
Authorization: Bearer {token}
```

#### List Districts
```http
GET /api/districts
Authorization: Bearer {token}
```

**Query Parameters:**
- `province_id`: Filter by province

## Real-time Events

### WebSocket Connection

The system uses Laravel Reverb for real-time communication. Connect to the WebSocket server:

```javascript
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Echo = new Echo({
  broadcaster: 'reverb',
  key: process.env.MIX_REVERB_APP_KEY,
  wsHost: process.env.MIX_REVERB_HOST,
  wsPort: process.env.MIX_REVERB_PORT ?? 80,
  wssPort: process.env.MIX_REVERB_PORT ?? 443,
  forceTLS: (process.env.MIX_REVERB_SCHEME ?? 'https') === 'https',
  enabledTransports: ['ws', 'wss'],
});
```

### WebRTC Signaling

Listen for WebRTC signals:

```javascript
Echo.private(`peer.${peerId}`)
  .listen('signal', (data) => {
    handleWebRTCSignal(data);
  });
```

### Meeting Events

Listen for meeting events:

```javascript
Echo.private(`meeting.${meetingId}`)
  .listen('UserJoinedMeeting', (data) => {
    handleUserJoined(data);
  })
  .listen('UserLeftMeeting', (data) => {
    handleUserLeft(data);
  })
  .listen('NewMeetingMessage', (data) => {
    handleNewMessage(data);
  });
```

### Report Events

Listen for report events:

```javascript
Echo.private(`report.${reportId}`)
  .listen('ReportCreated', (data) => {
    handleReportCreated(data);
  });
```

## Error Codes

### HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Validation Error
- `500`: Server Error

### Error Response Format

```json
{
  "success": false,
  "error": "Error message",
  "errors": {
    "field": ["Validation error"]
  },
  "code": "ERROR_CODE"
}
```

## Rate Limiting

API requests are rate-limited to prevent abuse:

- **Default**: 60 requests per minute per IP
- **Authenticated**: 120 requests per minute per user

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1640000000
```

## Pagination

List endpoints support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 15, max: 100)

**Response Format:**
```json
{
  "data": [...],
  "current_page": 1,
  "last_page": 10,
  "per_page": 15,
  "total": 150,
  "from": 1,
  "to": 15
}
```

## Filtering

Many endpoints support filtering:

**Query Parameters:**
- `search`: Full-text search
- `filter[field]`: Filter by specific field
- `sort`: Sort field
- `order`: Sort order (asc/desc)

**Example:**
```
GET /api/criminals?search=john&filter[crime_type]=Theft&sort=created_at&order=desc
```

## File Uploads

### Upload Criminal Photo

```http
POST /api/criminals/{id}/photo
Authorization: Bearer {token}
Content-Type: multipart/form-data

photo: [file]
```

**Response:**
```json
{
  "success": true,
  "data": {
    "photo_url": "/storage/photos/criminal-1.jpg"
  }
}
```

## Webhooks

Webhooks are not currently implemented but planned for future releases.

---

**Document Version**: 1.0  
**Last Updated**: January 2025

