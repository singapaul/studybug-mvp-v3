import { baseTemplate } from './base.ts';

const APP_URL = Deno.env.get('APP_URL') ?? 'https://studybug.app';

export function newAssignmentEmail(
  studentName: string,
  tutorName: string,
  gameName: string,
  groupName: string,
): { subject: string; html: string } {
  const subject = `New assignment: ${gameName}`;

  const body = `
    <p style="color:#212121; font-size:16px; line-height:1.6; margin:0 0 20px 0; font-family:'Plus Jakarta Sans',sans-serif;">
      Hi ${studentName}, you have a new assignment waiting for you!
    </p>

    <!-- Assignment card -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
      <tr>
        <td style="background:#F6F1E5; border-radius:10px; padding:20px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:600; color:#666666; text-transform:uppercase; letter-spacing:0.5px; padding-bottom:8px;">New Assignment</td>
            </tr>
            <tr>
              <td style="font-family:'Quicksand',sans-serif; font-weight:700; font-size:22px; color:#212121; padding-bottom:12px;">${gameName}</td>
            </tr>
            <tr>
              <td>
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td style="font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; color:#666666; padding:4px 0; width:80px;">Posted by</td>
                    <td style="font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; color:#212121; font-weight:500; padding:4px 0;">${tutorName}</td>
                  </tr>
                  <tr>
                    <td style="font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; color:#666666; padding:4px 0;">Group</td>
                    <td style="font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; color:#212121; font-weight:500; padding:4px 0;">${groupName}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <p style="color:#212121; font-size:16px; line-height:1.6; margin:0; font-family:'Plus Jakarta Sans',sans-serif;">
      Head to your dashboard to play the game and submit your results.
    </p>
  `;

  const html = baseTemplate({
    heading: `New assignment posted`,
    body,
    ctaText: 'Play Now',
    ctaUrl: `${APP_URL}/student/dashboard`,
    previewText: `${tutorName} posted "${gameName}" in ${groupName}.`,
  });

  return { subject, html };
}
