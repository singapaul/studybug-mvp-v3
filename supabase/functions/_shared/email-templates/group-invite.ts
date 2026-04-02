import { baseTemplate } from './base.ts';

const APP_URL = Deno.env.get('APP_URL') ?? 'https://studybug.app';

export function groupInviteEmail(
  tutorName: string,
  groupName: string,
  joinCode: string,
): { subject: string; html: string } {
  const subject = `${tutorName} invited you to join ${groupName} on StudyBug`;

  // Format code for readability: insert hyphen in middle if 6 chars
  const formattedCode =
    joinCode.length === 6
      ? `${joinCode.slice(0, 3)}-${joinCode.slice(3)}`
      : joinCode;

  const body = `
    <p style="color:#212121; font-size:16px; line-height:1.6; margin:0 0 20px 0; font-family:'Plus Jakarta Sans',sans-serif;">
      <strong>${tutorName}</strong> has invited you to join <strong>${groupName}</strong> on StudyBug — the fun way to study with games and interactive flashcards created by your teacher.
    </p>

    <!-- Join code box -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
      <tr>
        <td align="center" style="background:#F6F1E5; border:2px solid #8FD462; border-radius:12px; padding:24px 20px;">
          <p style="margin:0 0 8px 0; font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; color:#666666; text-transform:uppercase; letter-spacing:0.8px;">Your Join Code</p>
          <p style="margin:0; font-family:'Quicksand',sans-serif; font-weight:700; font-size:36px; color:#212121; letter-spacing:6px;">${formattedCode}</p>
          <p style="margin:12px 0 0 0; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; color:#666666;">Enter this code after signing up to join ${groupName}</p>
        </td>
      </tr>
    </table>

    <p style="color:#212121; font-size:16px; line-height:1.6; margin:0 0 8px 0; font-family:'Plus Jakarta Sans',sans-serif; font-weight:600;">How to join:</p>
    <ol style="color:#212121; font-size:15px; line-height:1.8; margin:0 0 20px 0; padding-left:20px; font-family:'Plus Jakarta Sans',sans-serif;">
      <li>Sign up for a free StudyBug account</li>
      <li>Go to your dashboard and click "Join a Group"</li>
      <li>Enter the join code above</li>
      <li>Start playing your teacher's games!</li>
    </ol>
  `;

  const html = baseTemplate({
    heading: `You've been invited to join ${groupName}!`,
    body,
    ctaText: 'Sign Up & Join',
    ctaUrl: `${APP_URL}/signup`,
    previewText: `${tutorName} invited you to ${groupName} on StudyBug. Your join code: ${formattedCode}`,
  });

  return { subject, html };
}
