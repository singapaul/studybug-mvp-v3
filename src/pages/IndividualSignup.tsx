import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { SignupProvider, useSignup } from '@/context/SignupContext';
import { ProgressIndicator } from '@/components/signup/ProgressIndicator';
import { PlanSummary } from '@/components/signup/PlanSummary';
import { ChoosePlanStep } from '@/components/signup/steps/ChoosePlanStep';
import { AccountDetailsStep } from '@/components/signup/steps/AccountDetailsStep';
import { PaymentStep } from '@/components/signup/steps/PaymentStep';
import { SuccessStep } from '@/components/signup/steps/SuccessStep';
import { ProcessingOverlay } from '@/components/signup/ProcessingOverlay';
import { PlanSelectionSkeleton, SignupStepSkeleton, PaymentSkeleton, PlanSummarySkeleton } from '@/components/signup/SignupSkeletons';
import { PlanType, BillingCycle } from '@/types/signup';

const steps = [
  { number: 1, title: 'Choose Plan' },
  { number: 2, title: 'Account' },
  { number: 3, title: 'Payment' },
  { number: 4, title: 'Complete' },
];

function SignupContent() {
  const [searchParams] = useSearchParams();
  const { currentStep, setCurrentStep, updateFormData, isProcessing, processingMessage } = useSignup();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const plan = searchParams.get('plan') as PlanType | null;
    const billing = searchParams.get('billing') as BillingCycle | null;
    if (plan && (plan === 'student' || plan === 'teacher')) {
      updateFormData({ plan });
    }
    if (billing && (billing === 'monthly' || billing === 'annual')) {
      updateFormData({ billingCycle: billing });
    }
    
    // Simulate initial loading
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [searchParams, updateFormData]);

  const renderStepContent = () => {
    if (isLoading) {
      switch (currentStep) {
        case 1:
          return <PlanSelectionSkeleton />;
        case 2:
          return <SignupStepSkeleton />;
        case 3:
          return <PaymentSkeleton />;
        default:
          return <SignupStepSkeleton />;
      }
    }

    switch (currentStep) {
      case 1:
        return <ChoosePlanStep onNext={() => setCurrentStep(2)} />;
      case 2:
        return (
          <AccountDetailsStep
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        );
      case 3:
        return (
          <PaymentStep
            onNext={() => setCurrentStep(4)}
            onBack={() => setCurrentStep(2)}
          />
        );
      case 4:
        return <SuccessStep />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-1 py-8">
        <div className="container">
          {/* Progress */}
          {currentStep < 4 && (
            <div className="max-w-2xl mx-auto mb-8">
              <ProgressIndicator steps={steps} currentStep={currentStep} />
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className={currentStep === 4 ? 'lg:col-span-3' : 'lg:col-span-2'}>
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
                {renderStepContent()}
              </div>
            </div>

            {/* Sidebar */}
            {currentStep < 4 && (
              <div className="lg:col-span-1">
                {isLoading ? <PlanSummarySkeleton /> : <PlanSummary />}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Processing Overlay */}
      <ProcessingOverlay 
        isVisible={isProcessing} 
        message={processingMessage}
        submessage="Please wait while we set up your account"
      />
    </div>
  );
}

export default function IndividualSignup() {
  return (
    <SignupProvider>
      <SignupContent />
    </SignupProvider>
  );
}
