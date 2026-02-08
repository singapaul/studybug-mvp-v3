import { useSignup } from '@/context/SignupContext';
import { PLANS } from '@/types/signup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, CreditCard, Lock, Calendar } from 'lucide-react';
import { z } from 'zod';

const paymentSchema = z.object({
  cardNumber: z.string().min(16, 'Card number must be 16 digits').max(19),
  cardExpiry: z.string().regex(/^\d{2}\/\d{2}$/, 'Use MM/YY format'),
  cardCvc: z.string().min(3, 'CVC must be 3 digits').max(4),
  cardName: z.string().min(1, 'Name on card is required'),
  billingPostcode: z.string().min(1, 'Postcode is required'),
  agreedToTerms: z.boolean().refine((val) => val === true, 'You must agree to the terms'),
});

interface PaymentStepProps {
  onNext: () => void;
  onBack: () => void;
}

import { useState } from 'react';

export function PaymentStep({ onNext, onBack }: PaymentStepProps) {
  const { formData, updateFormData, isProcessing, setIsProcessing, setProcessingMessage } =
    useSignup();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedPlan = PLANS.find((p) => p.id === formData.plan);
  const price =
    formData.billingCycle === 'monthly' ? selectedPlan?.monthlyPrice : selectedPlan?.annualPrice;
  const trialEndDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const formatted = digits.match(/.{1,4}/g)?.join(' ') || digits;
    return formatted.slice(0, 19);
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length >= 2) {
      return digits.slice(0, 2) + '/' + digits.slice(2, 4);
    }
    return digits;
  };

  const detectCardType = (number: string) => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'Visa';
    if (/^5[1-5]/.test(cleaned)) return 'Mastercard';
    if (/^3[47]/.test(cleaned)) return 'Amex';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = paymentSchema.safeParse({
      cardNumber: formData.cardNumber.replace(/\s/g, ''),
      cardExpiry: formData.cardExpiry,
      cardCvc: formData.cardCvc,
      cardName: formData.cardName,
      billingPostcode: formData.billingPostcode,
      agreedToTerms: formData.agreedToTerms,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsProcessing(true);
    setProcessingMessage('Processing payment...');

    // Simulate payment processing with multiple steps
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setProcessingMessage('Verifying card details...');
    await new Promise((resolve) => setTimeout(resolve, 800));
    setProcessingMessage('Creating your account...');
    await new Promise((resolve) => setTimeout(resolve, 700));

    setIsProcessing(false);
    onNext();
  };

  const cardType = detectCardType(formData.cardNumber);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Payment details</h2>
        <p className="text-muted-foreground">You won't be charged until your 14-day trial ends</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
        {/* Trial Info Banner */}
        <div className="p-4 rounded-xl bg-success/10 border border-success/20 flex items-start gap-3">
          <Calendar className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-foreground">14-day free trial</p>
            <p className="text-sm text-muted-foreground">
              You'll be charged £{price} on{' '}
              {trialEndDate.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Mock Card Input */}
        <div className="p-6 rounded-xl border border-border bg-muted/30">
          <div className="flex items-center gap-2 mb-6">
            <CreditCard className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">Card Details</span>
            <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
              <Lock className="w-3 h-3" />
              Secured
            </div>
          </div>

          <div className="space-y-4">
            {/* Card Number */}
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card number</Label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  value={formData.cardNumber}
                  onChange={(e) => updateFormData({ cardNumber: formatCardNumber(e.target.value) })}
                  placeholder="1234 5678 9012 3456"
                  className={errors.cardNumber ? 'border-destructive pr-16' : 'pr-16'}
                />
                {cardType && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                    {cardType}
                  </span>
                )}
              </div>
              {errors.cardNumber && <p className="text-xs text-destructive">{errors.cardNumber}</p>}
            </div>

            {/* Expiry & CVC */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cardExpiry">Expiry</Label>
                <Input
                  id="cardExpiry"
                  value={formData.cardExpiry}
                  onChange={(e) => updateFormData({ cardExpiry: formatExpiry(e.target.value) })}
                  placeholder="MM/YY"
                  maxLength={5}
                  className={errors.cardExpiry ? 'border-destructive' : ''}
                />
                {errors.cardExpiry && (
                  <p className="text-xs text-destructive">{errors.cardExpiry}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardCvc">CVC</Label>
                <Input
                  id="cardCvc"
                  value={formData.cardCvc}
                  onChange={(e) =>
                    updateFormData({
                      cardCvc: e.target.value.replace(/\D/g, '').slice(0, 4),
                    })
                  }
                  placeholder="123"
                  maxLength={4}
                  className={errors.cardCvc ? 'border-destructive' : ''}
                />
                {errors.cardCvc && <p className="text-xs text-destructive">{errors.cardCvc}</p>}
              </div>
            </div>

            {/* Name on Card */}
            <div className="space-y-2">
              <Label htmlFor="cardName">Name on card</Label>
              <Input
                id="cardName"
                value={formData.cardName}
                onChange={(e) => updateFormData({ cardName: e.target.value })}
                placeholder="John Doe"
                className={errors.cardName ? 'border-destructive' : ''}
              />
              {errors.cardName && <p className="text-xs text-destructive">{errors.cardName}</p>}
            </div>

            {/* Billing Postcode */}
            <div className="space-y-2">
              <Label htmlFor="billingPostcode">Billing postcode</Label>
              <Input
                id="billingPostcode"
                value={formData.billingPostcode}
                onChange={(e) => updateFormData({ billingPostcode: e.target.value.toUpperCase() })}
                placeholder="SW1A 1AA"
                className={errors.billingPostcode ? 'border-destructive' : ''}
              />
              {errors.billingPostcode && (
                <p className="text-xs text-destructive">{errors.billingPostcode}</p>
              )}
            </div>
          </div>
        </div>

        {/* Terms Checkbox */}
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={formData.agreedToTerms}
              onCheckedChange={(checked) => updateFormData({ agreedToTerms: checked === true })}
              className={errors.agreedToTerms ? 'border-destructive' : ''}
            />
            <label
              htmlFor="terms"
              className="text-sm text-muted-foreground cursor-pointer leading-relaxed"
            >
              I agree to the{' '}
              <a
                href="#"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href="#"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
            </label>
          </div>
          {errors.agreedToTerms && (
            <p className="text-xs text-destructive">{errors.agreedToTerms}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1"
            disabled={isProcessing}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-primary text-white hover:bg-primary/90"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              'Start Free Trial'
            )}
          </Button>
        </div>

        {/* Cancel note */}
        <p className="text-xs text-muted-foreground text-center">
          Cancel anytime. No charge if you cancel before{' '}
          {trialEndDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}.
        </p>
      </form>
    </div>
  );
}
