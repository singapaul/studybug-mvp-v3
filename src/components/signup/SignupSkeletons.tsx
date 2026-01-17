import { Skeleton } from '@/components/ui/skeleton';

export function SignupStepSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-3">
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-5 w-64 mx-auto" />
      </div>

      {/* Form Fields */}
      <div className="space-y-6 max-w-md mx-auto">
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <Skeleton className="h-10 flex-1 rounded-lg" />
          <Skeleton className="h-10 flex-1 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function PlanSelectionSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-3">
        <Skeleton className="h-8 w-56 mx-auto" />
        <Skeleton className="h-5 w-72 mx-auto" />
      </div>

      {/* Toggle */}
      <div className="flex justify-center">
        <Skeleton className="h-10 w-64 rounded-full" />
      </div>

      {/* Plan Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-2xl border-2 border-border p-6 space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-4 flex-1" />
                </div>
              ))}
            </div>
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PaymentSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-3">
        <Skeleton className="h-8 w-40 mx-auto" />
        <Skeleton className="h-5 w-64 mx-auto" />
      </div>

      <div className="space-y-6 max-w-md mx-auto">
        {/* Trial Banner */}
        <Skeleton className="h-20 w-full rounded-xl" />

        {/* Card Input Section */}
        <div className="p-6 rounded-xl border border-border space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-24" />
          </div>
          
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>

        {/* Terms */}
        <div className="flex items-start gap-3">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-4 flex-1" />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <Skeleton className="h-10 flex-1 rounded-lg" />
          <Skeleton className="h-10 flex-1 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function PlanSummarySkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-6 sticky top-24">
      <Skeleton className="h-6 w-32" />
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    </div>
  );
}
