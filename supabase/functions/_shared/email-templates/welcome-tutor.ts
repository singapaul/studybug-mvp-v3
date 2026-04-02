import { baseTemplate } from './base.ts';

const APP_URL = Deno.env.get('APP_URL') ?? 'https://studybug.app';

export function welcomeTutorEmail(name: string): { subject: string; html: string } {
  const subject = `Welcome to StudyBug, ${name}!`;

  const body = `
    <p style="color:#212121; font-size:16px; line-height:1.6; margin:0 0 20px 0; font-family:'Plus Jakarta Sans',sans-serif;">
      We're thrilled to have you join StudyBug! You're all set to start creating engaging learning games for your students.
    </p>
    <p style="color:#212121; font-size:16px; line-height:1.6; margin:0 0 24px 0; font-family:'Plus Jakarta Sans',sans-serif;">
      Here are three steps to get you started:
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
                <p style="margin:0 0 4px 0; font-family:'Quicksand',sans-serif; font-weight:700; font-size:16px; color:#212121;">Create your first game</p>
                <p style="margin:0; font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; color:#666666; line-height:1.5;">Build a custom flashcard, quiz, or matching game with your own content.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Step 2 -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;">
      <tr>
        <td style="background:#F6F1E5; border-radius:10px; padding:16px 20px;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td style="width:40px; vertical-align:top;">
                <div style="width:32px; height:32px; background:#2AA0FF; border-radius:50%; text-align:center; line-height:32px; font-family:'Quicksand',sans-serif; font-weight:700; font-size:16px; color:#ffffff;">2</div>
              </td>
              <td style="padding-left:12px; vertical-align:top;">
                <p style="margin:0 0 4px 0; font-family:'Quicksand',sans-serif; font-weight:700; font-size:16px; color:#212121;">Create a group</p>
                <p style="margin:0; font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; color:#666666; line-height:1.5;">Organise your students into classes or groups for easy assignment management.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Step 3 -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8px;">
      <tr>
        <td style="background:#F6F1E5; border-radius:10px; padding:16px 20px;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td style="width:40px; vertical-align:top;">
                <div style="width:32px; height:32px; background:#8FD462; border-radius:50%; text-align:center; line-height:32px; font-family:'Quicksand',sans-serif; font-weight:700; font-size:16px; color:#ffffff;">3</div>
              </td>
              <td style="padding-left:12px; vertical-align:top;">
                <p style="margin:0 0 4px 0; font-family:'Quicksand',sans-serif; font-weight:700; font-size:16px; color:#212121;">Invite your students</p>
                <p style="margin:0; font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; color:#666666; line-height:1.5;">Share a join code or link so your students can join your group and start playing.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  const html = baseTemplate({
    heading: `Welcome aboard, ${name}!`,
    body,
    ctaText: 'Go to Dashboard',
    ctaUrl: `${APP_URL}/tutor/dashboard`,
    previewText: `Welcome to StudyBug, ${name}! Here's how to get started.`,
  });

  return { subject, html };
}
