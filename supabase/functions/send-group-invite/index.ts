import { sendEmail } from '../_shared/email.ts';
import { groupInviteEmail } from '../_shared/email-templates/group-invite.ts';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  try {
    const { emails, tutorName, groupName, joinCode } = await req.json();

    if (!Array.isArray(emails) || emails.length === 0) {
      return new Response(JSON.stringify({ error: 'emails array is required' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    if (!tutorName || !groupName || !joinCode) {
      return new Response(JSON.stringify({ error: 'tutorName, groupName, and joinCode are required' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    const { subject, html } = groupInviteEmail(tutorName, groupName, joinCode);

    // Send to each address individually so each recipient doesn't see others
    const sends = emails.map((email: string) => sendEmail(email, subject, html));
    await Promise.all(sends);

    return new Response(JSON.stringify({ sent: emails.length }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('send-group-invite error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }
});
