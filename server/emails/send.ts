import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendAssignmentNotificationEmail(
  to: string,
  gameName: string,
  groupName: string
): Promise<void> {
  await resend.emails.send({
    from: 'StudyBug <hello@studybug.app>',
    to,
    subject: `New assignment: ${gameName}`,
    html: `<h1>New Assignment!</h1><p>Your teacher has assigned <strong>${gameName}</strong> for the group <strong>${groupName}</strong>.</p>`,
  })
}

export async function sendGroupInviteEmail(to: string, groupName: string, joinCode: string): Promise<void> {
  await resend.emails.send({
    from: 'StudyBug <hello@studybug.app>',
    to,
    subject: `You've been invited to join ${groupName} on StudyBug`,
    html: `<h1>You're invited!</h1><p>Join the group <strong>${groupName}</strong> using code: <strong>${joinCode}</strong></p>`,
  })
}

export async function sendWelcomeEmail(to: string, firstName: string): Promise<void> {
  await resend.emails.send({
    from: 'StudyBug <hello@studybug.app>',
    to,
    subject: 'Welcome to StudyBug!',
    html: `<h1>Welcome, ${firstName}!</h1><p>Your account is ready. Start exploring StudyBug.</p>`,
  })
}

export async function sendPaymentSuccessfulEmail(
  to: string,
  planName: string,
  amount: string,
  nextBillingDate: Date
): Promise<void> {
  await resend.emails.send({
    from: 'StudyBug <hello@studybug.app>',
    to,
    subject: 'Payment successful — StudyBug',
    html: `<h1>Payment received!</h1><p>Thanks for subscribing to <strong>${planName}</strong>. Amount charged: <strong>${amount}</strong>. Next billing date: <strong>${nextBillingDate.toLocaleDateString()}</strong>.</p>`,
  })
}

export async function sendPaymentFailedEmail(to: string, userName: string): Promise<void> {
  await resend.emails.send({
    from: 'StudyBug <hello@studybug.app>',
    to,
    subject: 'Payment failed — action required',
    html: `<h1>Hi ${userName},</h1><p>We couldn't process your payment. Please update your payment details to keep your StudyBug subscription active.</p>`,
  })
}

export async function sendSubscriptionCancelledEmail(
  to: string,
  userName: string,
  expiryDate: Date
): Promise<void> {
  await resend.emails.send({
    from: 'StudyBug <hello@studybug.app>',
    to,
    subject: 'Your StudyBug subscription has been cancelled',
    html: `<h1>Hi ${userName},</h1><p>Your subscription has been cancelled. You'll have access until <strong>${expiryDate.toLocaleDateString()}</strong>.</p>`,
  })
}

export async function sendTrialEndingSoonEmail(
  to: string,
  userName: string,
  trialExpiryDate: Date
): Promise<void> {
  await resend.emails.send({
    from: 'StudyBug <hello@studybug.app>',
    to,
    subject: 'Your StudyBug trial is ending soon',
    html: `<h1>Hi ${userName},</h1><p>Your free trial ends on <strong>${trialExpiryDate.toLocaleDateString()}</strong>. Subscribe now to keep full access to StudyBug.</p>`,
  })
}
