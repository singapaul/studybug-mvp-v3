import type { DB } from '../db/index'
import { getTutorByUserId, getStudentByUserId } from '../db/queries/index'

export async function subscriptionGuard(
  db: DB,
  userId: string
): Promise<{ allowed: boolean; reason?: string }> {
  const tutor = await getTutorByUserId(db, userId)
  if (tutor) {
    return checkStatus(tutor.subscriptionStatus)
  }

  const student = await getStudentByUserId(db, userId)
  if (student) {
    return checkStatus(student.subscriptionStatus)
  }

  return { allowed: false, reason: 'user_not_found' }
}

function checkStatus(
  status: 'FREE' | 'TRIALING' | 'ACTIVE' | 'CANCELLED' | 'EXPIRED'
): { allowed: boolean; reason?: string } {
  if (status === 'ACTIVE' || status === 'TRIALING') {
    return { allowed: true }
  }
  if (status === 'FREE') {
    return { allowed: false, reason: 'subscription_required' }
  }
  return { allowed: false, reason: 'subscription_inactive' }
}
