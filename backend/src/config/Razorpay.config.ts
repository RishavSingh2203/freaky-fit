import Razorpay from 'razorpay';

// Check if Razorpay keys are available in environment variables
const hasValidKeys = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET;

if (!hasValidKeys) {
  console.error('WARNING: Razorpay API keys are missing in environment variables');
}

// Initialize Razorpay with API keys
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || ''
});

export default instance;