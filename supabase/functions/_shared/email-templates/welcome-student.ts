import { baseTemplate } from './base.ts';

const APP_URL = Deno.env.get('APP_URL') ?? 'https://studybug.app';

export function welcomeStudentEmail(name: string): { subject: string; html: string } {
  const subject = `You're in! Welcome to StudyBug`;

  const body = `
    <p style="color:#212121; font-size:16px; line-height:1.6; margin:0 0 20px 0; font-family:'Plus Jakarta Sans',sans-serif;">
      Hey ${name}! Welcome to StudyBug — the fun way to study and revise with games created by your teachers.
    </p>
    <p style="color:#212121; font-size:16px; line-height:1.6; margin:0 0 24px 0; font-family:'Plus Jakarta Sans',sans-serif;">
      Getting started is easy:
    </p>

    <!-- Step 1 -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;">
      <tr>
        <td style="background:#F6F1E5; border-radius:10px; padding:16px 20px;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td style="width:40px; vertical-align:top;">
                <div style="width:32px; height:32px; background:#8FD462; border-radius:50%; text-align:center; line-height:32px; font-family:'Quicksand',sans-serif; font-weight:700; font-size:16px; color:#ffffff;">1</div>
              </td>
              <td style="padding-left:12px; vertical-align:top;">
                <p style="margin:0 0 4px 0; font-family:'Quicksand',sans-serif; font-weight:700; font-size:16px; color:#212121;">Join a group</p>
                <p style="margin:0; font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; color:#666666; line-height:1.5;">Ask your teacher for a join code, then enter it from your dashboard to join their group.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Step 2 -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8px;">
      <tr>
        <td style="background:#F6F1E5; border-radius:10px; padding:16px 20px;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td style="width:40px; vertical-align:top;">
                <div style="width:32px; height:32px; background:#2AA0FF; border-radius:50%; text-align:center; line-height:32px; font-family:'Quicksand',sans-serif; font-weight:700; font-size:16px; color:#ffffff;">2</div>
              </td>
              <td style="padding-left:12px; vertical-align:top;">
                <p style="margin:0 0 4px 0; font-family:'Quicksand',sans-serif; font-weight:700; font-size:16px; color:#212121;">Start playing</p>
                <p style="margin:0; font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; color:#666666; line-height:1.5;">Play assigned games or browse the library to revise any topic at your own pace.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  const html = baseTemplate({
    heading: `Welcome to StudyBug, ${name}!`,
    body,
    ctaText: 'Go to Dashboard',
    ctaUrl: `${APP_URL}/student/dashboard`,
    previewText: `You're in! Let's get you set up on StudyBug.`,
  });

  return { subject, html };
}
