import { createClient } from 'https://esm.sh/@supabase/supabase-js@2?target=deno';
import { sendEmail } from '../_shared/email.ts';
import { welcomeTutorEmail } from '../_shared/email-templates/welcome-tutor.ts';
import { welcomeStudentEmail } from '../_shared/email-templates/welcome-student.ts';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  try {
    const { userId } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: 'userId is required' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    // Get user email from auth
    const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(userId);

    if (userError || !user?.email) {
      console.error('send-welcome-email: failed to get user', userError);
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    // Try Tutor first
    const { data: tutor } = await supabase
      .from('Tutor')
      .select('firstName')
      .eq('userId', userId)
      .single();

    if (tutor) {
      const name = tutor.firstName ?? 'there';
      const { subject, html } = welcomeTutorEmail(name);
      await sendEmail(user.email, subject, html);
      return new Response(JSON.stringify({ sent: true, role: 'TUTOR' }), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    // Try Student
    const { data: student } = await supabase
      .from('Student')
      .select('firstName')
      .eq('userId', userId)
      .single();

    if (student) {
      const name = student.firstName ?? 'there';
      const { subject, html } = welcomeStudentEmail(name);
      await sendEmail(user.email, subject, html);
      return new Response(JSON.stringify({ sent: true, role: 'STUDENT' }), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Profile not found for user' }), {
      status: 404,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('send-welcome-email error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }
});
