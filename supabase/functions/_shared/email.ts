/**
 * Helper to send email via Resend REST API.
 * Logs errors but does not throw — safe to use in fire-and-forget webhook contexts.
 */
export async function sendEmail(
  to: string | string[],
  subject: string,
  html: string,
): Promise<void> {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  const from = Deno.env.get('FROM_EMAIL') ?? 'hello@studybug.app';

  if (!apiKey) {
    console.error('sendEmail: RESEND_API_KEY is not set');
    return;
  }

  const recipients = Array.isArray(to) ? to : [to];

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: recipients,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`sendEmail: Resend API error ${response.status}: ${body}`);
    }
  } catch (err) {
    console.error('sendEmail: fetch failed', err);
  }
}
