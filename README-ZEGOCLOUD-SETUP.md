# ZegoCloud Setup for Freaky Fit

This document explains how to set up and configure ZegoCloud for video meetings in the Freaky Fit application.

## Overview

Freaky Fit uses ZegoCloud for video meetings between trainers and users. The implementation:

- Generates room IDs on the frontend
- Uses the format `/meeting/join/:roomId` for meeting URLs
- Utilizes ZegoCloud's prebuilt UI kit for an out-of-the-box video meeting experience

## Setup Instructions

### 1. Create a ZegoCloud Account

1. Go to [ZegoCloud Console](https://console.zegocloud.com/)
2. Sign up for an account
3. Create a new project

### 2. Get Your Credentials

After creating a project, you'll need:
- App ID (a numeric value)
- Server Secret (a string)

### 3. Configure Environment Variables

Add these variables to your frontend `.env` file:

```
VITE_ZEGO_APP_ID=your_app_id_here
VITE_ZEGO_SERVER_SECRET=your_server_secret_here
```

## How It Works

1. When a user books a training session:
   - A unique room ID is generated on the frontend
   - A meeting link is created in the format: `https://yourapp.com/meeting/join/[roomId]`
   - This link and room ID are saved in the database with the session details

2. When a user wants to join the meeting:
   - They navigate to the link which loads the VideoMeeting component
   - The component uses the ZegoCloud UI Kit to create a full-featured video call interface
   - ZegoCloud handles all the WebRTC connections and UI components

## Customization

The ZegoCloud UI can be customized by modifying the configuration options in the `VideoMeeting.tsx` file:

```typescript
zp.joinRoom({
  container,
  sharedLinks: [
    {
      name: 'Copy meeting link',
      url: `${window.location.origin}/meeting/join/${roomId}`,
    },
  ],
  scenario: {
    mode: ZegoUIKitPrebuilt.OneONoneCall,
  },
  turnOnCameraWhenJoining: true,
  turnOnMicrophoneWhenJoining: true,
  showPreJoinView: true,
  preJoinViewConfig: {
    title: 'Freaky Fit Training Session',
  },
});
```

For more configuration options, refer to the [ZegoCloud UI Kit documentation](https://docs.zegocloud.com/article/14866).

## Troubleshooting

- If you get errors about missing credentials, make sure your `.env` file has the correct values
- If the video call doesn't load, check your browser console for errors
- For camera/microphone issues, ensure your browser has permission to access these devices

## Additional Resources

- [ZegoCloud Documentation](https://docs.zegocloud.com/)
- [ZegoCloud UI Kit API Reference](https://docs.zegocloud.com/article/14866)

# ZegoCloud Setup Guide

## Configuration

To use the video meeting functionality with ZegoCloud, you need to set up the proper environment variables:

1. Create a `.env` file in the frontend directory if you don't already have one
2. Add the following environment variables:

```
VITE_ZEGO_APP_ID=your_app_id_here
VITE_ZEGO_SERVER_SECRET=your_server_secret_here
```

## Troubleshooting the "Meeting container not found" Error

If you encounter the "Meeting container not found" error when joining meetings, follow these steps:

### 1. Check ZegoCloud Credentials

Ensure your ZegoCloud credentials are correctly set in the `.env` file:

```
VITE_ZEGO_APP_ID=your_app_id_here
VITE_ZEGO_SERVER_SECRET=your_server_secret_here
```

### 2. Verify Container Rendering

The error typically happens when ZegoCloud tries to initialize before the container element is fully rendered in the DOM. We've implemented several fixes for this:

- Added a delay before initialization to ensure the container is fully rendered
- Implemented container dimension checking
- Added forced visibility and dimensions to the container
- Added retry capability if initialization fails

### 3. Check Browser Compatibility

ZegoCloud works best with:
- Chrome (recommended)
- Firefox
- Safari (latest versions)
- Edge (Chromium-based)

### 4. Allow Camera and Microphone Permissions

Make sure you've granted camera and microphone permissions to the website.

### 5. Clear Browser Cache

If you continue to experience issues, try clearing your browser cache and cookies.

### 6. Network Connectivity

ZegoCloud requires a stable internet connection. Check your network connection and try again.

## Implementation Details

Our implementation uses:

1. React `useRef` to create a direct reference to the container DOM element
2. A delayed initialization approach to ensure the DOM is ready
3. Explicit dimension setting for the container
4. CSS improvements to ensure proper rendering
5. Error handling with retry capabilities

If you're still experiencing issues, check the browser console for specific error messages which can provide more details about what's going wrong. 