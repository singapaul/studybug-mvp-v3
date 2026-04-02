import { baseTemplate } from './base.ts';

const APP_URL = Deno.env.get('APP_URL') ?? 'https://studybug.app';

export function trialStartedEmail(
  name: string,
  trialEndDate: string,
  planName: string,
): { subject: string; html: string } {
  const subject = `Your 14-day free trial has started!`;

  const body = `
    <p style="color:#212121; font-size:16px; line-height:1.6; margin:0 0 20px 0; font-family:'Plus Jakarta Sans',sans-serif;">
      Hi ${name}, your <strong>${planName}</strong> trial is now active and runs until <strong>${trialEndDate}</strong>.
      No payment will be taken until your trial ends.
    </p>

    <!-- Trial period box -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
      <tr>
        <td style="background:#F6F1E5; border-left:4px solid #8FD462; border-radius:0 10px 10px 0; padding:16px 20px;">
          <p style="margin:0 0 6px 0; font-family:'Quicksand',sans-serif; font-weight:700; font-size:16px; color:#212121;">Your trial period</p>
          <p style="margin:0; font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; color:#666666;">Expires: <strong style="color:#212121;">${trialEndDate}</strong></p>
        </td>
      </tr>
    </table>

    <p style="color:#212121; font-size:16px; line-height:1.6; margin:0 0 16px 0; font-family:'Plus Jakarta Sans',sans-serif;">
      Here's what you have full access to during your trial:
    </p>

    <!-- Feature list -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8px;">
      <tr>
        <td style="padding:6px 0;">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="width:24px; vertical-align:top; padding-top:2px;">
                <span style="color:#8FD462; font-size:18px; line-height:1;">&#10003;</span>
              </td>
              <td style="font-family:'Plus Jakarta Sans',sans-serif; font-size:15px; color:#212121; padding-left:8px;">Unlimited game creation</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:6px 0;">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="width:24px; vertical-align:top; padding-top:2px;">
                <span style="color:#8FD462; font-size:18px; line-height:1;">&#10003;</span>
              </td>
              <td style="font-family:'Plus Jakarta Sans',sans-serif; font-size:15px; color:#212121; padding-left:8px;">Create and manage student groups</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:6px 0;">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="width:24px; vertical-align:top; padding-top:2px;">
                <span style="color:#8FD462; font-size:18px; line-height:1;">&#10003;</span>
              </td>
              <td style="font-family:'Plus Jakarta Sans',sans-serif; font-size:15px; color:#212121; padding-left:8px;">Assign games with due dates</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:6px 0;">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="width:24px; vertical-align:top; padding-top:2px;">
                <span style="color:#8FD462; font-size:18px; line-height:1;">&#10003;</span>
              </td>
              <td style="font-family:'Plus Jakarta Sans',sans-serif; font-size:15px; color:#212121; padding-left:8px;">Track student progress and results</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  const html = baseTemplate({
    heading: `Your free trial has started!`,
    body,
    ctaText: 'Explore Your Plan',
    ctaUrl: `${APP_URL}/dashboard`,
    previewText: `Your ${planName} trial is active until ${trialEndDate}. Start exploring!`,
  });

  return { subject, html };
}
