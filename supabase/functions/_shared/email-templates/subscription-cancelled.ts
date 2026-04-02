import { baseTemplate } from './base.ts';

const APP_URL = Deno.env.get('APP_URL') ?? 'https://studybug.app';

export function subscriptionCancelledEmail(
  name: string,
  periodEnd: string,
): { subject: string; html: string } {
  const subject = `Your subscription has been cancelled`;

  const body = `
    <p style="color:#212121; font-size:16px; line-height:1.6; margin:0 0 20px 0; font-family:'Plus Jakarta Sans',sans-serif;">
      Hi ${name}, we've received your cancellation request. We're sorry to see you go!
    </p>

    <!-- Access info box -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
      <tr>
        <td style="background:#F6F1E5; border-left:4px solid #2AA0FF; border-radius:0 10px 10px 0; padding:16px 20px;">
          <p style="margin:0 0 6px 0; font-family:'Quicksand',sans-serif; font-weight:700; font-size:16px; color:#212121;">Your access continues until</p>
          <p style="margin:0; font-family:'Plus Jakarta Sans',sans-serif; font-size:18px; font-weight:600; color:#2AA0FF;">${periodEnd}</p>
          <p style="margin:8px 0 0 0; font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; color:#666666;">You can continue to use all features until this date.</p>
        </td>
      </tr>
    </table>

    <p style="color:#212121; font-size:16px; line-height:1.6; margin:0 0 16px 0; font-family:'Plus Jakarta Sans',sans-serif;">
      Changed your mind? You can resubscribe at any time from our pricing page and pick up right where you left off.
    </p>

    <p style="color:#212121; font-size:16px; line-height:1.6; margin:0; font-family:'Plus Jakarta Sans',sans-serif;">
      If there's anything we could have done better, we'd love to hear from you — just reply to this email.
    </p>
  `;

  const html = baseTemplate({
    heading: `Your subscription has been cancelled`,
    body,
    ctaText: 'Resubscribe',
    ctaUrl: `${APP_URL}/pricing`,
    previewText: `Your subscription is cancelled, but your access continues until ${periodEnd}.`,
  });

  return { subject, html };
}
