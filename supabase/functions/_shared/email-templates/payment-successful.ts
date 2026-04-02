import { baseTemplate } from './base.ts';

const APP_URL = Deno.env.get('APP_URL') ?? 'https://studybug.app';

export function paymentSuccessfulEmail(
  name: string,
  periodEnd: string,
): { subject: string; html: string } {
  const subject = `Payment confirmed — you're all set!`;

  const body = `
    <p style="color:#212121; font-size:16px; line-height:1.6; margin:0 0 20px 0; font-family:'Plus Jakarta Sans',sans-serif;">
      Hi ${name}, thank you for your payment! Your subscription is active and you have full access to all StudyBug features.
    </p>

    <!-- Subscription info box -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
      <tr>
        <td style="background:#F6F1E5; border-left:4px solid #8FD462; border-radius:0 10px 10px 0; padding:16px 20px;">
          <p style="margin:0 0 8px 0; font-family:'Quicksand',sans-serif; font-weight:700; font-size:16px; color:#212121;">Subscription details</p>
          <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td style="font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; color:#666666; padding:3px 0;">Status</td>
              <td style="font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; color:#8FD462; font-weight:600; text-align:right; padding:3px 0;">Active</td>
            </tr>
            <tr>
              <td style="font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; color:#666666; padding:3px 0;">Next billing date</td>
              <td style="font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; color:#212121; font-weight:600; text-align:right; padding:3px 0;">${periodEnd}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <p style="color:#212121; font-size:16px; line-height:1.6; margin:0; font-family:'Plus Jakarta Sans',sans-serif;">
      You can manage your subscription, view invoices, and update payment details at any time from your account settings.
    </p>
  `;

  const html = baseTemplate({
    heading: `Payment confirmed!`,
    body,
    ctaText: 'Go to Dashboard',
    ctaUrl: `${APP_URL}/dashboard`,
    previewText: `Your StudyBug subscription is active until ${periodEnd}.`,
  });

  return { subject, html };
}
