import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, AlertCircle, Zap, Lock, Unlock } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

interface SubscriptionData {
  plan: 'FREE' | 'PREMIUM';
  startDate?: Date;
  endDate?: Date;
  workoutPlansGenerated: number;
  mealPlansGenerated: number;
  active: boolean;
}

const Subscription = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          resolve(true);
        };
        script.onerror = () => {
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, []);

  // Fetch subscription details
  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/subscription/details`, {
        withCredentials: true
      });

      if (response.data.success) {
        setSubscription(response.data.data.subscription);
      } else {
        toast({
          title: 'Error',
          description: response.data.message || 'Failed to fetch subscription details',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch subscription details',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  // Handle subscription purchase
  const handleSubscribe = async () => {
    try {
      setPaymentProcessing(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/subscription/create-order`,
        { plan: 'PREMIUM' },
        { withCredentials: true }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create order');
      }

      const { order, planDetails, key } = response.data.data;
      console.log('Order created:', order);
      console.log('Using key:', key);

      // For development testing without Razorpay
      if (import.meta.env.DEV && import.meta.env.VITE_MOCK_PAYMENTS === 'true') {
        console.log('Using mock payment flow in development');
        // Simulate successful payment
        setTimeout(async () => {
          try {
            // Mock verification response
            toast({
              title: 'Development Mode',
              description: 'Mock payment successful! Your premium subscription is now active.',
              variant: 'default'
            });
            fetchSubscription();
          } finally {
            setPaymentProcessing(false);
          }
        }, 2000);
        return;
      }

      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: 'Freaky Fit',
        description: planDetails.description || 'Premium Subscription',
        order_id: order.id,
        handler: async function (response: any) {
          try {
            console.log('Payment response:', response);
            const verifyResponse = await axios.post(
              `${import.meta.env.VITE_API_URL}/api/user/subscription/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              },
              { withCredentials: true }
            );

            if (verifyResponse.data.success) {
              toast({
                title: 'Success',
                description: 'Payment successful! Your premium subscription is now active.',
                variant: 'default'
              });
              fetchSubscription();
            } else {
              toast({
                title: 'Error',
                description: verifyResponse.data.message || 'Payment verification failed',
                variant: 'destructive'
              });
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast({
              title: 'Error',
              description: 'Payment verification failed',
              variant: 'destructive'
            });
          } finally {
            setPaymentProcessing(false);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || ''
        },
        theme: {
          color: '#6366F1'
        }
      };

      // Check if Razorpay is loaded
      if ((window as any).Razorpay) {
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        toast({
          title: 'Error',
          description: 'Razorpay failed to load. Please refresh the page and try again.',
          variant: 'destructive'
        });
      }
    } catch (error: any) {
      console.error('Error creating subscription order:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to process subscription',
        variant: 'destructive'
      });
      setPaymentProcessing(false);
    }
  };

  const formatDate = (dateString?: Date) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container max-w-6xl py-8 mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">Subscription Plans</h1>
        <p className="text-lg text-muted-foreground">
          Choose the right plan to unlock unlimited workout and meal plan generation
        </p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading subscription details...</span>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {/* Free Plan */}
          <Card className={`border-2 ${subscription?.plan === 'FREE' ? 'border-primary' : 'border-transparent'}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">Free Plan</CardTitle>
                  <CardDescription>Basic access to Freaky Fit</CardDescription>
                </div>
                <Badge variant="outline" className="ml-2">
                  {subscription?.plan === 'FREE' ? 'Current Plan' : 'Basic'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-3xl font-bold">₹0 <span className="text-sm font-normal text-muted-foreground">/ forever</span></p>
              </div>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Limited to 2 workout plans</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Limited to 2 meal plans</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Basic AI features</span>
                </li>
                <li className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-muted-foreground">No premium features</span>
                </li>
              </ul>

              {subscription?.plan === 'FREE' && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Your Usage</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Workout Plans</p>
                      <p className="font-medium">{subscription.workoutPlansGenerated} / 2</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Meal Plans</p>
                      <p className="font-medium">{subscription.mealPlansGenerated} / 2</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button disabled variant="outline" className="w-full">
                <Lock className="h-4 w-4 mr-2" />
                Current Plan
              </Button>
            </CardFooter>
          </Card>

          {/* Premium Plan */}
          <Card className={`border-2 ${subscription?.plan === 'PREMIUM' ? 'border-primary' : 'border-transparent'}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">Premium Plan</CardTitle>
                  <CardDescription>Unlimited access to all features</CardDescription>
                </div>
                <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0 ml-2">
                  {subscription?.plan === 'PREMIUM' ? 'Current Plan' : 'Recommended'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-3xl font-bold">₹499 <span className="text-sm font-normal text-muted-foreground">/ month</span></p>
              </div>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span><strong>Unlimited</strong> workout plans</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span><strong>Unlimited</strong> meal plans</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Advanced AI features</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Priority support</span>
                </li>
              </ul>

              {subscription?.plan === 'PREMIUM' && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Your Premium Subscription</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Start Date</p>
                      <p className="font-medium">{formatDate(subscription.startDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Expiry Date</p>
                      <p className="font-medium">{formatDate(subscription.endDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-medium flex items-center">
                        {subscription.active ? (
                          <><CheckCircle className="h-4 w-4 text-green-500 mr-1" /> Active</>
                        ) : (
                          <><AlertCircle className="h-4 w-4 text-red-500 mr-1" /> Inactive</>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {subscription?.plan === 'PREMIUM' ? (
                <Button disabled variant="default" className="w-full">
                  <Zap className="h-4 w-4 mr-2" />
                  Current Plan
                </Button>
              ) : (
                <Button
                  onClick={handleSubscribe}
                  disabled={paymentProcessing}
                  variant="default"
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                >
                  {paymentProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing
                    </>
                  ) : (
                    <>
                      <Unlock className="h-4 w-4 mr-2" /> Upgrade to Premium
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Subscription;
