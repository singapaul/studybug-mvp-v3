import { baseTemplate } from './base.ts';

const APP_URL = Deno.env.get('APP_URL') ?? 'https://studybug.app';

export function trialEndingSoonEmail(
  name: string,
  daysLeft: number,
  trialEndDate: string,
): { subject: string; html: string } {
  const dayLabel = daysLeft !== 1 ? 'days' : 'day';
  const subject = `Your trial ends in ${daysLeft} ${dayLabel}`;

  const body = `
    <p style="color:#212121; font-size:16px; line-height:1.6; margin:0 0 20px 0; font-family:'Plus Jakarta Sans',sans-serif;">
      Hi ${name}, your StudyBug trial ends in <strong>${daysLeft} ${dayLabel}</strong> (${trialEndDate}). Upgrade now to keep access to everything you've built.
    </p>

    <!-- Urgency box -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
      <tr>
        <td style="background:#FFF8E1; border-left:4px solid #F59E0B; border-radius:0 10px 10px 0; padding:16px 20px;">
          <p style="margin:0 0 6px 0; font-family:'Quicksand',sans-serif; font-weight:700; font-size:16px; color:#212121;">Trial expiry: ${trialEndDate}</p>
          <p style="margin:0; font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; color:#666666;">After this date, you'll lose access to premium features until you subscribe.</p>
        </td>
      </tr>
    </table>

    <p style="color:#212121; font-size:16px; line-height:1.6; margin:0 0 16px 0; font-family:'Plus Jakarta Sans',sans-serif;">
      If your trial ends without upgrading, you'll lose access to:
    </p>

    <!-- What they'll lose -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
      <tr>
        <td style="padding:6px 0;">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="width:24px; vertical-align:top; padding-top:2px;">
                <span style="color:#EF4444; font-size:18px; line-height:1;">&#10007;</span>
              </td>
              <td style="font-family:'Plus Jakarta Sans',sans-serif; font-size:15px; color:#212121; padding-left:8px;">Creating and assigning new games</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:6px 0;">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="width:24px; vertical-align:top; padding-top:2px;">
                <span style="color:#EF4444; font-size:18px; line-height:1;">&#10007;</span>
              </td>
              <td style="font-family:'Plus Jakarta Sans',sans-serif; font-size:15px; color:#212121; padding-left:8px;">Managing student groups</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:6px 0;">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="width:24px; vertical-align:top; padding-top:2px;">
                <span style="color:#EF4444; font-size:18px; line-height:1;">&#10007;</span>
              </td>
              <td style="font-family:'Plus Jakarta Sans',sans-serif; font-size:15px; color:#212121; padding-left:8px;">Viewing student progress and scores</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <p style="color:#212121; font-size:16px; line-height:1.6; margin:0; font-family:'Plus Jakarta Sans',sans-serif;">
      Upgrade in seconds — no long-term commitment required.
    </p>
  `;

  const html = baseTemplate({
    heading: `Only ${daysLeft} ${dayLabel} left on your trial`,
    body,
    ctaText: 'Upgrade Now',
    ctaUrl: `${APP_URL}/pricing`,
    previewText: `${name}, your trial ends on ${trialEndDate}. Upgrade to keep access.`,
  });

  return { subject, html };
}
