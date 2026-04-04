import { ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSubscription } from '@/hooks/useSubscription'

interface SubscriptionGateProps {
  children: ReactNode
}

export function SubscriptionGate({ children }: SubscriptionGateProps) {
  const { isLoading, isActive, status } = useSubscription()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && status !== null && !isActive) {
      navigate('/pricing')
    }
  }, [isLoading, isActive, status, navigate])

  if (isLoading) {
    return null
  }

  if (!isActive) {
    return null
  }

  return <>{children}</>
}
