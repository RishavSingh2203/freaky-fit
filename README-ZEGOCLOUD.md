# ZegoCloud Integration for Video Calls

This document explains how to set up and use ZegoCloud for video calls in the Freaky Fit application.

## Setup Instructions

### 1. Create a ZegoCloud Account

- Go to [ZegoCloud Console](https://console.zegocloud.com/)
- Sign up for an account
- Create a new project

### 2. Get Your Credentials

After creating a project, you'll receive:
- App ID
- Server Secret

### 3. Configure Environment Variables

#### Backend Configuration (.env file)

Add these variables to your backend `.env` file:

```
ZEGO_APP_ID=your_app_id_here
ZEGO_SERVER_SECRET=your_server_secret_here
```

#### Frontend Configuration (.env file)

Add this variable to your frontend `.env` file:

```
NEXT_PUBLIC_ZEGO_APP_ID=your_app_id_here
```

## How It Works

1. When a user books a training session:
   - A unique room ID is generated
   - The backend creates a secure token using the ZegoCloud credentials
   - A meeting link is created that includes the token, room ID, and user information

2. This link is saved with the booking in the database

3. When the user or trainer wants to join the video call:
   - They can use the saved link to join the ZegoCloud meeting
   - The token ensures secure access to the video call

## Implementation Details

### Backend

- Token generation logic in `utils/zegoToken.js`
- API endpoint for token generation at `POST /api/user/training/generateMeetingToken`

### Frontend

- Meeting link generation in `TrainerBooking.tsx`
- The generated meeting link is sent to the backend with the booking information

## Troubleshooting

- If you're getting authentication errors, make sure your App ID and Server Secret are correctly set in the environment variables
- If the video call doesn't establish, check if your browser has camera and microphone permissions
- For connection issues, check if your network allows WebRTC traffic

## Additional Resources

- [ZegoCloud Documentation](https://docs.zegocloud.com/)
- [ZegoCloud API Reference](https://docs.zegocloud.com/article/13670) 