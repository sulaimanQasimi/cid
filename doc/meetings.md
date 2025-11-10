# CID System - Meeting System Documentation

## Overview

The CID system includes a comprehensive secure communication system with WebRTC-based video conferencing, encrypted messaging, and meeting management.

## Features

- **Meeting Scheduling**: Schedule meetings with participants
- **WebRTC Video**: Peer-to-peer video communication
- **Screen Sharing**: Share screen during meetings
- **Offline Mode**: Continue meetings with network interruptions
- **Meeting Code**: Unique code for meeting access
- **Participant Management**: Manage meeting participants
- **Meeting Sessions**: Track meeting sessions
- **Meeting Messages**: Encrypted chat during meetings
- **Real-time Events**: WebSocket-based real-time updates

## Meeting Management

### Creating Meetings

#### Via Web Interface

1. Navigate to **Secure Communications** → **Meetings**
2. Click **Create Meeting**
3. Fill in meeting details:
   - Title
   - Description
   - Scheduled date and time
   - Duration
   - Participants
   - Offline mode (optional)
4. Save meeting

#### Via API

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

### Meeting Model

#### Attributes

- `id`: Primary key
- `title`: Meeting title
- `description`: Meeting description
- `meeting_code`: Unique meeting code (auto-generated)
- `scheduled_at`: Scheduled date and time
- `duration_minutes`: Meeting duration in minutes
- `is_recurring`: Recurring meeting flag
- `status`: Meeting status (scheduled, active, completed, cancelled)
- `offline_enabled`: Offline mode enabled flag
- `created_by`: User who created the meeting

#### Relationships

- `creator()`: BelongsTo User (creator)
- `participants()`: BelongsToMany User (participants)
- `sessions()`: HasMany MeetingSession
- `messages()`: HasMany MeetingMessage

## Meeting Room

### Joining a Meeting

#### Via Web Interface

1. Navigate to meeting details page
2. Click **Join Meeting**
3. Allow camera and microphone access
4. Enter meeting room

#### Via Meeting Code

1. Navigate to meeting room page
2. Enter meeting code
3. Join meeting

### Meeting Room Features

#### Video Communication
- WebRTC peer-to-peer video
- Multiple participants support
- Video quality adjustment
- Camera on/off toggle

#### Audio Communication
- Microphone mute/unmute
- Audio quality adjustment
- Speaker selection

#### Screen Sharing
- Share entire screen
- Share specific application window
- Stop sharing

#### Chat
- Real-time encrypted messaging
- Message history
- File sharing (planned)

## WebRTC Implementation

### Signaling

The system uses Laravel Reverb for WebRTC signaling:

```javascript
// Listen for WebRTC signals
Echo.private(`peer.${peerId}`)
  .listen('signal', (data) => {
    handleWebRTCSignal(data);
  });

// Send WebRTC signal
axios.post(`/api/meetings/${meetingId}/signal`, {
  to: peerId,
  signal: offerSignal
});
```

### Peer Connection

```javascript
import SimplePeer from 'simple-peer';

// Create peer connection
const peer = new SimplePeer({
  initiator: true,
  trickle: false
});

// Handle signal
peer.on('signal', (data) => {
  // Send signal to other peer via WebSocket
  sendSignal(data);
});

// Handle stream
peer.on('stream', (stream) => {
  // Display remote video stream
  videoElement.srcObject = stream;
});
```

## Real-time Events

### Meeting Events

#### User Joined Meeting

```javascript
Echo.private(`meeting.${meetingId}`)
  .listen('UserJoinedMeeting', (data) => {
    console.log('User joined:', data.user);
    // Update UI to show new participant
  });
```

#### User Left Meeting

```javascript
Echo.private(`meeting.${meetingId}`)
  .listen('UserLeftMeeting', (data) => {
    console.log('User left:', data.user);
    // Update UI to remove participant
  });
```

#### New Meeting Message

```javascript
Echo.private(`meeting.${meetingId}`)
  .listen('NewMeetingMessage', (data) => {
    console.log('New message:', data.message);
    // Display new message in chat
  });
```

### WebRTC Signaling Events

```javascript
// Listen for incoming signals
Echo.private(`peer.${userId}`)
  .listen('WebRTCSignal', (data) => {
    // Handle WebRTC signal
    peer.signal(data.signal);
  });
```

## Meeting Messages

### Sending Messages

#### Via Web Interface

1. Open chat panel in meeting room
2. Type message
3. Send message

#### Via API

```http
POST /api/meetings/{id}/messages
Authorization: Bearer {token}
Content-Type: application/json

{
  "message": "Hello, everyone!"
}
```

### Message Model

#### Attributes

- `id`: Primary key
- `meeting_id`: Foreign key to meetings
- `user_id`: Foreign key to users (sender)
- `message`: Message content
- `created_at`: Message timestamp

#### Relationships

- `meeting()`: BelongsTo Meeting
- `user()`: BelongsTo User (sender)

## Meeting Sessions

### Session Tracking

The system automatically tracks meeting sessions:

- Session start time
- Session end time
- Participants in session
- Session duration

### Session Model

#### Attributes

- `id`: Primary key
- `meeting_id`: Foreign key to meetings
- `started_at`: Session start time
- `ended_at`: Session end time

#### Relationships

- `meeting()`: BelongsTo Meeting

## Offline Mode

### Features

- Continue meetings with network interruptions
- Local peer connections maintained
- Automatic reconnection when network restored
- Message queuing for offline period

### Configuration

Enable offline mode when creating a meeting:

```php
$meeting = Meeting::create([
    'title' => 'Meeting Title',
    'offline_enabled' => true,
    // ... other attributes
]);
```

## Participant Management

### Adding Participants

#### Via Web Interface

1. Navigate to meeting details
2. Click **Manage Participants**
3. Add users to meeting
4. Save changes

#### Via API

```http
POST /api/meetings/{id}/participants
Authorization: Bearer {token}
Content-Type: application/json

{
  "user_ids": [1, 2, 3]
}
```

### Participant Roles

- **Host**: Meeting creator, full control
- **Participant**: Regular participant, can join and communicate
- **Observer**: View-only access (planned)

## Meeting Status

### Status Types

- **scheduled**: Meeting is scheduled for future
- **active**: Meeting is currently in progress
- **completed**: Meeting has ended
- **cancelled**: Meeting was cancelled

### Status Transitions

```
scheduled → active → completed
scheduled → cancelled
active → cancelled
```

## Security Features

### Encryption

- **WebRTC Encryption**: All video/audio streams encrypted
- **Message Encryption**: Chat messages encrypted
- **HTTPS/WSS**: All communications over secure connections

### Access Control

- **Meeting Access**: Only participants can join
- **Permission Checks**: `meeting.view`, `meeting.create`, etc.
- **Meeting Code**: Unique code for access control

## API Endpoints

### Meeting Endpoints

- `GET /api/meetings` - List meetings
- `POST /api/meetings` - Create meeting
- `GET /api/meetings/{id}` - Get meeting
- `PUT /api/meetings/{id}` - Update meeting
- `DELETE /api/meetings/{id}` - Delete meeting
- `POST /api/meetings/{id}/join` - Join meeting
- `POST /api/meetings/{id}/leave` - Leave meeting

### Message Endpoints

- `GET /api/meetings/{id}/messages` - Get messages
- `POST /api/meetings/{id}/messages` - Send message

### Signal Endpoints

- `POST /api/meetings/{id}/signal` - Send WebRTC signal

## Frontend Components

### Meeting Components

- **MeetingIndex**: List of meetings
- **MeetingCreate**: Create meeting form
- **MeetingEdit**: Edit meeting form
- **MeetingShow**: Meeting details
- **MeetingRoom**: Meeting room interface

### Meeting Room Features

- Video grid for participants
- Chat panel
- Controls (mute, camera, share screen)
- Participant list
- Meeting information

## Troubleshooting

### Common Issues

1. **WebRTC Connection Failed**
   - Check firewall settings
   - Verify STUN/TURN servers (if configured)
   - Check browser WebRTC support

2. **Audio/Video Not Working**
   - Check browser permissions
   - Verify microphone/camera access
   - Check device settings

3. **Messages Not Sending**
   - Check WebSocket connection
   - Verify Reverb server is running
   - Check network connectivity

4. **Meeting Not Joining**
   - Verify meeting code
   - Check user permissions
   - Verify meeting status

---

**Document Version**: 1.0  
**Last Updated**: January 2025

