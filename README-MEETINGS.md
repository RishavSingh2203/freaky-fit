# Meeting Implementation in Freaky Fit

This document explains how video meetings are implemented in the Freaky Fit application.

## Overview

The application uses a frontend-only approach for generating meeting rooms and creating video calls, without relying on external APIs like ZegoCloud. Instead, we use:

- WebRTC for peer-to-peer video communication
- Frontend-generated unique room IDs
- Clean URLs in the format: `/meeting/join/:roomId`

## How It Works

1. When a user or trainer initiates a meeting:
   - A unique room ID is generated on the frontend
   - A meeting link is created in the format: `https://yourapp.com/meeting/join/[roomId]`
   - This link and room ID are saved in the database with the session information

2. When a user wants to join a meeting:
   - They navigate to the link which loads the VideoMeeting component
   - The component retrieves the room ID from the URL parameters
   - It establishes a WebRTC connection for video/audio communication
   - Users can control their audio/video/sharing settings and communicate

## Implementation Details

### Room ID Generation

Room IDs are generated on the frontend using this format:
```javascript
const roomID = `meeting_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
```

### Database Schema

The TrainingSession model includes these fields for meetings:
- `meetingLink`: The full URL to join the meeting
- `roomId`: The unique identifier for the meeting room

### Video Implementation

The video meeting interface is built using:
- WebRTC API for peer connections
- HTML5 Media APIs for camera/microphone access
- Custom UI controls for meeting interaction

## Getting Started

To test the meeting functionality:
1. Navigate to the test meeting page
2. Generate a test meeting link
3. Share the link with another user
4. Both users can join the meeting and communicate

## Troubleshooting

- If video/audio isn't working, check browser permissions for camera and microphone
- For connection issues, ensure both users are on compatible browsers that support WebRTC
- If the connection fails to establish, try using a different network

## Future Improvements

- Implement WebSocket signaling for more reliable peer discovery
- Add screen sharing functionality
- Support for recording meetings
- Support for multi-participant meetings 