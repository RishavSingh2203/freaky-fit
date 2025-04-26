import dotenv from 'dotenv';

dotenv.config();

export const zegoCloudConfig = {
  appID: process.env.ZEGO_APP_ID,
  serverSecret: process.env.ZEGO_SERVER_SECRET
};

export const validateZegoCloudConfig = () => {
  if (!zegoCloudConfig.appID) {
    console.error('ZEGO_APP_ID is not defined in environment variables');
    return false;
  }
  if (!zegoCloudConfig.serverSecret) {
    console.error('ZEGO_SERVER_SECRET is not defined in environment variables');
    return false;
  }
  return true;
};
