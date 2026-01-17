import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SignupFormData, PlanType, BillingCycle, AccountType } from '@/types/signup';

interface SignupContextType {
  formData: SignupFormData;
  updateFormData: (data: Partial<SignupFormData>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  resetForm: () => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  processingMessage: string;
  setProcessingMessage: (message: string) => void;
}

const initialFormData: SignupFormData = {
  plan: 'student',
  billingCycle: 'annual',
  accountType: 'student',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  childName: '',
  cardNumber: '',
  cardExpiry: '',
  cardCvc: '',
  cardName: '',
  billingPostcode: '',
  agreedToTerms: false,
};

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export function SignupProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<SignupFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('Processing...');

  const updateFormData = (data: Partial<SignupFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
  };

  return (
    <SignupContext.Provider
      value={{
        formData,
        updateFormData,
        currentStep,
        setCurrentStep,
        resetForm,
        isProcessing,
        setIsProcessing,
        processingMessage,
        setProcessingMessage,
      }}
    >
      {children}
    </SignupContext.Provider>
  );
}

export function useSignup() {
  const context = useContext(SignupContext);
  if (context === undefined) {
    throw new Error('useSignup must be used within a SignupProvider');
  }
  return context;
}
