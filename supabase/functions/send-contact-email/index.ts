import { sendEmail } from '../_shared/email.ts';
import { contactConfirmationEmail } from '../_shared/email-templates/contact-confirmation.ts';
import { baseTemplate } from '../_shared/email-templates/base.ts';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function adminNotificationHtml(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
  type: string;
  schoolName?: string;
}): string {
  const safeMessage = payload.message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');

  const schoolRow = payload.schoolName
    ? `<tr><td style="font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; color:#666666; padding:4px 0; width:120px;">School</td><td style="font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; color:#212121; padding:4px 0;">${payload.schoolName}</td></tr>`
    : '';

  const body = `
    <p style="color:#212121; font-size:16px; line-height:1.6; margin:0 0 20px 0; font-family:'Plus Jakarta Sans',sans-serif;">
      A new <strong>${payload.type === 'demo' ? 'demo request' : 'contact form submission'}</strong> has been received.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
      <tr>
        <td style="background:#F6F1E5; border-radius:10px; padding:20px 24px;">
          <p style="margin:0 0 12px 0; font-family:'Quicksand',sans-serif; font-weight:700; font-size:16px; color:#212121;">Sender details</p>
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; color:#666666; padding:4px 0; width:120px;">Name</td>
              <td style="font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; color:#212121; padding:4px 0;">${payload.name}</td>
            </tr>
            <tr>
              <td style="font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; color:#666666; padding:4px 0;">Email</td>
              <td style="font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; color:#2AA0FF; padding:4px 0;"><a href="mailto:${payload.email}" style="color:#2AA0FF; text-decoration:none;">${payload.email}</a></td>
            </tr>
            <tr>
              <td style="font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; color:#666666; padding:4px 0;">Subject</td>
              <td style="font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; color:#212121; padding:4px 0;">${payload.subject}</td>
            </tr>
            <tr>
              <td style="font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; color:#666666; padding:4px 0;">Type</td>
              <td style="font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; color:#212121; padding:4px 0;">${payload.type}</td>
            </tr>
            ${schoolRow}
          </table>
        </td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="background:#F6F1E5; border-radius:10px; padding:20px 24px;">
          <p style="margin:0 0 12px 0; font-family:'Quicksand',sans-serif; font-weight:700; font-size:16px; color:#212121;">Message</p>
          <p style="margin:0; font-family:'Plus Jakarta Sans',sans-serif; font-size:15px; color:#212121; line-height:1.7; border-left:3px solid #8FD462; padding-left:16px;">${safeMessage}</p>
        </td>
      </tr>
    </table>
  `;

  return baseTemplate({
    heading: `New ${payload.type === 'demo' ? 'Demo Request' : 'Contact Form Submission'}`,
    body,
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  try {
    const payload = await req.json() as {
      name: string;
      email: string;
      subject: string;
      message: string;
      type: 'contact' | 'demo';
      schoolName?: string;
    };

    const { name, email, subject, message, type } = payload;

    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: 'name, email, subject, and message are required' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    const adminEmail = Deno.env.get('ADMIN_EMAIL');

    // Send confirmation to submitter and admin notification in parallel
    const sends: Promise<void>[] = [
      (() => {
        const { subject: confirmSubject, html } = contactConfirmationEmail(name, subject, message);
        return sendEmail(email, confirmSubject, html);
      })(),
    ];

    if (adminEmail) {
      const adminSubject = type === 'demo'
        ? `New demo request from ${name}`
        : `New contact form submission from ${name}`;
      sends.push(sendEmail(adminEmail, adminSubject, adminNotificationHtml(payload)));
    }

    await Promise.all(sends);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('send-contact-email error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }
});
