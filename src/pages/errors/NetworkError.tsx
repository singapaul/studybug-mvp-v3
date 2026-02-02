import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WifiOff, RefreshCw, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface NetworkErrorProps {
  onRetry?: () => void | Promise<void>;
  message?: string;
}

export default function NetworkError({ onRetry, message }: NetworkErrorProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);

    try {
      if (onRetry) {
        await onRetry();
        toast.success('Connection restored');
      } else {
        // Default retry: reload the page
        window.location.reload();
      }
    } catch (error) {
      toast.error('Still unable to connect. Please check your internet connection.');
    } finally {
      setIsRetrying(false);
    }
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-lg border-blue-200 shadow-xl">
          <CardContent className="pt-12 pb-8 text-center space-y-6">
            {/* Network Error Icon */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="flex justify-center"
            >
              <div className="bg-blue-100 rounded-full p-6">
                <WifiOff className="h-16 w-16 text-blue-600" />
              </div>
            </motion.div>

            {/* Error Message */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Connection Lost</h1>
              <p className="text-muted-foreground text-lg">
                {message ||
                  "We're having trouble connecting to the internet. Please check your connection and try again."}
              </p>
            </div>

            {/* Troubleshooting Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-left">
              <p className="font-semibold text-blue-900 mb-2">Troubleshooting tips:</p>
              <ul className="space-y-1 text-blue-800">
                <li>• Check your WiFi or mobile data connection</li>
                <li>• Make sure airplane mode is off</li>
                <li>• Try moving to an area with better signal</li>
                <li>• Restart your router if using WiFi</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={handleRetry}
                disabled={isRetrying}
                className="flex-1 gap-2"
                variant="default"
              >
                {isRetrying ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                  </>
                )}
              </Button>
              <Button onClick={handleGoHome} variant="outline" className="flex-1 gap-2">
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            </div>

            <p className="text-xs text-muted-foreground pt-2">
              If the problem persists, please try again later.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
