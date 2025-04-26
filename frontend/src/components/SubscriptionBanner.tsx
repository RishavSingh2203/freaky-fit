import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/Button';
import { Zap, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SubscriptionBannerProps {
  type: 'workout' | 'meal';
}

const SubscriptionBanner: React.FC<SubscriptionBannerProps> = ({ type }) => {
  const navigate = useNavigate();

  return (
    <Alert className="mb-6 border-amber-500 bg-amber-50 dark:bg-amber-950/30">
      <AlertCircle className="h-5 w-5 text-amber-500" />
      <AlertTitle className="text-amber-700 dark:text-amber-400">
        Free Plan Limit Reached
      </AlertTitle>
      <AlertDescription className="text-amber-700 dark:text-amber-400">
        <p className="mb-2">
          You've reached the limit of {type === 'workout' ? 'workout' : 'meal'} plans on your free account.
          Upgrade to Premium for unlimited {type === 'workout' ? 'workout' : 'meal'} plan generation.
        </p>
        <Button 
          onClick={() => navigate('/subscription')} 
          variant="outline" 
          className="mt-2 border-amber-500 text-amber-700 hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-amber-950/50"
        >
          <Zap className="mr-2 h-4 w-4" />
          Upgrade to Premium
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default SubscriptionBanner;
