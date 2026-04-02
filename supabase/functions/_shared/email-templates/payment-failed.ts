import { baseTemplate } from './base.ts';

const APP_URL = Deno.env.get('APP_URL') ?? 'https://studybug.app';

export function paymentFailedEmail(name: string): { subject: string; html: string } {
  const subject = `Action required: your payment failed`;

  const body = `
    <p style="color:#212121; font-size:16px; line-height:1.6; margin:0 0 20px 0; font-family:'Plus Jakarta Sans',sans-serif;">
      Hi ${name}, unfortunately we were unable to process your latest payment. This may be due to an expired card, insufficient funds, or a billing issue with your bank.
    </p>

    <!-- Alert box -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
      <tr>
        <td style="background:#FFF1F0; border-left:4px solid #FF705D; border-radius:0 10px 10px 0; padding:16px 20px;">
          <p style="margin:0 0 6px 0; font-family:'Quicksand',sans-serif; font-weight:700; font-size:16px; color:#FF705D;">Payment failed</p>
          <p style="margin:0; font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; color:#666666; line-height:1.5;">
            To avoid interruption to your account, please update your payment method as soon as possible. We may retry the payment automatically.
          </p>
        </td>
      </tr>
    </table>

    <p style="color:#212121; font-size:16px; line-height:1.6; margin:0; font-family:'Plus Jakarta Sans',sans-serif;">
      Visit your account settings to update your card details and restore full access. If you continue to have trouble, please contact our support team.
    </p>
  `;

  // Use coral/red accent for the heading to signal urgency (override default)
  const baseHtml = baseTemplate({
    heading: `Action required: payment failed`,
    body,
    ctaText: 'Update Payment Method',
    ctaUrl: `${APP_URL}/settings`,
    previewText: `Your payment failed. Please update your payment method to keep access.`,
  });

  // Inject the red heading colour — replace the first h1 color in the output
  const html = baseHtml.replace(
    'color:#212121; margin:0 0 16px 0; line-height:1.3;">Action required: payment failed',
    'color:#FF705D; margin:0 0 16px 0; line-height:1.3;">Action required: payment failed',
  );

  return { subject, html };
}
