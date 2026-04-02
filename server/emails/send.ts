import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWelcomeEmail(to: string, firstName: string): Promise<void> {
  await resend.emails.send({
    from: 'StudyBug <hello@studybug.app>',
    to,
    subject: 'Welcome to StudyBug!',
    html: `<h1>Welcome, ${firstName}!</h1><p>Your account is ready. Start exploring StudyBug.</p>`,
  })
}
