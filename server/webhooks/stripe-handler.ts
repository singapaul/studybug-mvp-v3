import type { DB } from '../db/index'
import {
  getProfileByStripeCustomerId,
  updateTutorSubscription,
  updateStudentSubscription,
  linkStripeCustomer,
} from '../db/queries/subscriptions'

export type StripeEmailDeps = {
  sendPaymentFailed: (to: string, userName: string) => Promise<void>
  sendSubscriptionCancelled: (to: string, userName: string, expiryDate: Date) => Promise<void>
  sendPaymentSuccessful: (to: string, planName: string, amount: string, nextBillingDate: Date) => Promise<void>
}

type StripeEvent = {
  type: string
  data: { object: Record<string, any> }
}

async function updateProfile(
  db: DB,
  customerId: string,
  update: Parameters<typeof updateTutorSubscription>[2]
): Promise<void> {
  const profile = await getProfileByStripeCustomerId(db, customerId)
  if (!profile) return
  if (profile.role === 'TUTOR') {
    await updateTutorSubscription(db, profile.id, update)
  } else {
    await updateStudentSubscription(db, profile.id, update)
  }
}

export async function handleStripeWebhook(
  event: StripeEvent,
  db: DB,
  emails: StripeEmailDeps
): Promise<void> {
  const obj = event.data.object

  switch (event.type) {
    case 'checkout.session.completed': {
      const clerkUserId = obj.metadata?.clerkUserId as string | undefined
      const role = (obj.metadata?.role ?? 'TUTOR') as 'TUTOR' | 'STUDENT'
      if (!clerkUserId || !obj.customer) break

      const trialEnd = obj.subscription_details?.trial_end
        ? new Date(obj.subscription_details.trial_end * 1000)
        : null

      await linkStripeCustomer(
        db,
        clerkUserId,
        obj.customer as string,
        obj.subscription as string,
        role,
        trialEnd
      )
      break
    }

    case 'invoice.payment_succeeded': {
      const customerId = obj.customer as string
      const periodEnd = obj.lines?.data?.[0]?.period?.end
        ? new Date(obj.lines.data[0].period.end * 1000)
        : null

      await updateProfile(db, customerId, {
        subscriptionStatus: 'ACTIVE',
        subscriptionPeriodEnd: periodEnd,
      })

      const profile = await getProfileByStripeCustomerId(db, customerId)
      if (profile) {
        const amount = obj.amount_paid
          ? `$${(obj.amount_paid / 100).toFixed(2)}`
          : 'unknown'
        await emails.sendPaymentSuccessful(
          profile.email,
          'StudyBug',
          amount,
          periodEnd ?? new Date()
        )
      }
      break
    }

    case 'invoice.payment_failed': {
      const customerId = obj.customer as string
      const profile = await getProfileByStripeCustomerId(db, customerId)
      if (profile) {
        await emails.sendPaymentFailed(profile.email, profile.firstName ?? 'there')
      }
      break
    }

    case 'customer.subscription.deleted': {
      const customerId = obj.customer as string
      const expiryDate = obj.current_period_end
        ? new Date(obj.current_period_end * 1000)
        : new Date()

      await updateProfile(db, customerId, { subscriptionStatus: 'CANCELLED' })

      const profile = await getProfileByStripeCustomerId(db, customerId)
      if (profile) {
        await emails.sendSubscriptionCancelled(
          profile.email,
          profile.firstName ?? 'there',
          expiryDate
        )
      }
      break
    }

    case 'customer.subscription.updated': {
      const customerId = obj.customer as string
      const stripeStatus = obj.status as string
      const statusMap: Record<string, 'TRIALING' | 'ACTIVE' | 'CANCELLED' | 'EXPIRED'> = {
        trialing: 'TRIALING',
        active: 'ACTIVE',
        canceled: 'CANCELLED',
        unpaid: 'EXPIRED',
        past_due: 'EXPIRED',
      }
      const subscriptionStatus = statusMap[stripeStatus]
      if (subscriptionStatus) {
        await updateProfile(db, customerId, { subscriptionStatus })
      }
      break
    }
  }
}
