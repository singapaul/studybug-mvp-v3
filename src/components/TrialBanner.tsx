import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSubscription } from '@/hooks/useSubscription'

function getDismissKey(trialEndsAt: Date | null): string {
  const date = trialEndsAt
    ? trialEndsAt.toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0]
  return `trial_banner_dismissed_${date}`
}

export function TrialBanner() {
  const { status, trialEndsAt, daysUntilTrialEnd, isLoading } = useSubscription()

  const dismissKey = getDismissKey(trialEndsAt)
  const [dismissed, setDismissed] = useState<boolean>(
    () => localStorage.getItem(dismissKey) === 'true'
  )

  if (isLoading) return null
  if (status !== 'TRIALING') return null
  if (daysUntilTrialEnd === null || daysUntilTrialEnd > 7) return null
  if (dismissed) return null

  function handleDismiss() {
    localStorage.setItem(dismissKey, 'true')
    setDismissed(true)
  }

  return (
    <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-900">
      <span>
        Your trial ends in {daysUntilTrialEnd} {daysUntilTrialEnd === 1 ? 'day' : 'days'}.{' '}
        <Link to="/pricing" className="font-semibold underline hover:text-amber-700">
          Upgrade now.
        </Link>
      </span>
      <button
        onClick={handleDismiss}
        className="ml-4 text-amber-600 hover:text-amber-800 font-semibold"
        aria-label="Dismiss trial banner"
      >
        &times;
      </button>
    </div>
  )
}
