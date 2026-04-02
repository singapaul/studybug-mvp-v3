import { baseTemplate } from './base.ts';

export function contactConfirmationEmail(
  name: string,
  subject: string,
  message: string,
): { subject: string; html: string } {
  const emailSubject = `We received your message!`;

  // Escape HTML entities in user-supplied content
  const safeMessage = message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');

  const safeSubject = subject
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const body = `
    <p style="color:#212121; font-size:16px; line-height:1.6; margin:0 0 20px 0; font-family:'Plus Jakarta Sans',sans-serif;">
      Hi ${name}, thanks for getting in touch! We've received your message and one of our team members will respond within <strong>1–2 business days</strong>.
    </p>

    <!-- Original message blockquote -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
      <tr>
        <td style="background:#F6F1E5; border-radius:10px; padding:20px 24px;">
          <p style="margin:0 0 8px 0; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; font-weight:600; color:#666666; text-transform:uppercase; letter-spacing:0.5px;">Your message</p>
          <p style="margin:0 0 12px 0; font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; font-weight:600; color:#212121;">Subject: ${safeSubject}</p>
          <p style="margin:0; font-family:'Plus Jakarta Sans',sans-serif; font-size:15px; color:#212121; line-height:1.7; border-left:3px solid #8FD462; padding-left:16px;">${safeMessage}</p>
        </td>
      </tr>
    </table>

    <p style="color:#666666; font-size:14px; line-height:1.6; margin:0; font-family:'Plus Jakarta Sans',sans-serif;">
      If you have urgent questions, you can also reach us directly at <a href="mailto:hello@studybug.app" style="color:#2AA0FF; text-decoration:none;">hello@studybug.app</a>.
    </p>
  `;

  const html = baseTemplate({
    heading: `We got your message!`,
    body,
    previewText: `Thanks ${name}, we'll get back to you within 1-2 business days.`,
  });

  return { subject: emailSubject, html };
}
