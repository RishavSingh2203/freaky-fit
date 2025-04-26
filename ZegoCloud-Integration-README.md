# ZegoCloud Video Meeting Integration for Freaky Fit

## Overview

This integration adds video meeting capabilities to the Freaky Fit application using ZegoCloud. Trainers can schedule sessions with users, and both parties can join the video meetings at the scheduled time.

## Features

- Automatic creation of video meetings when a trainer accepts a booking
- Upcoming meetings display for both trainers and users
- Countdown timer showing time remaining until meetings
- Secure meeting links with authentication tokens
- Real-time video meetings with screen sharing capabilities

## Setup Instructions

### 1. Create a ZegoCloud Account

1. Go to [ZegoCloud Console](https://console.zegocloud.com/) and create an account
2. Create a new project in the ZegoCloud console
3. Get your App ID and Server Secret from the project settings

### 2. Configure Environment Variables

#### Backend (.env)

Add the following to your backend `.env` file:

```
# ZegoCloud Configuration
ZEGO_APP_ID=your_zego_app_id
ZEGO_SERVER_SECRET=your_zego_server_secret
```

#### Frontend (.env)

Add the following to your frontend `.env` file:

```
# ZegoCloud Configuration
VITE_ZEGO_APP_ID=your_zego_app_id
VITE_ZEGO_SERVER_SECRET=your_zego_server_secret
```

### 3. Install Dependencies

#### Backend

```bash
cd backend
npm install zego-express-engine-webrtc --save
```

#### Frontend

```bash
cd frontend
npm install @zegocloud/zego-uikit-prebuilt --save
```

## Usage

### For Trainers

1. Navigate to the Trainer Dashboard
2. View pending session requests
3. Accept a session request and set a scheduled time
4. A ZegoCloud meeting will be automatically created
5. When it's time for the meeting, click "Join Meeting" from the Upcoming Meetings section

### For Users

1. Book a training session through the Trainer Booking page
2. Once a trainer accepts your booking, you'll see it in the Upcoming Sessions section
3. When it's time for the meeting, click "Join Meeting" to join the video call

## Troubleshooting

- If you encounter authentication errors, make sure your ZegoCloud App ID and Server Secret are correctly set in the environment variables
- If the video meeting doesn't load, check your browser console for errors
- Make sure you have granted camera and microphone permissions to the application

## Security Considerations

- Meeting tokens are generated on the server side for security
- Tokens have a limited expiration time (default: 1 hour)
- Only authenticated users can join meetings
