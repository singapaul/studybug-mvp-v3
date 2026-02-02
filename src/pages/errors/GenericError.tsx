import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface GenericErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showDetails?: boolean;
  error?: Error;
}

export default function GenericError({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  showDetails = false,
  error,
}: GenericErrorProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-orange-50 to-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-lg border-red-200 shadow-xl">
          <CardContent className="pt-12 pb-8 text-center space-y-6">
            {/* Error Icon */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="flex justify-center"
            >
              <div className="bg-red-100 rounded-full p-6">
                <AlertCircle className="h-16 w-16 text-red-600" />
              </div>
            </motion.div>

            {/* Error Message */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">{title}</h1>
              <p className="text-muted-foreground text-lg">{message}</p>
            </div>

            {/* Error Details (Development Only) */}
            {showDetails && error && process.env.NODE_ENV === 'development' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-left">
                <p className="font-semibold text-red-800 mb-2">Error Details:</p>
                <p className="text-red-700 font-mono text-xs break-all">
                  {error.message}
                </p>
                {error.stack && (
                  <details className="mt-2">
                    <summary className="text-red-800 font-semibold cursor-pointer">
                      Stack Trace
                    </summary>
                    <pre className="text-xs text-red-700 mt-2 overflow-auto max-h-32">
                      {error.stack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button onClick={handleRetry} className="flex-1 gap-2" variant="default">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              <Button onClick={handleGoHome} variant="outline" className="flex-1 gap-2">
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            </div>

            <p className="text-xs text-muted-foreground pt-2">
              If this problem persists, please contact support.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
