import { createClient } from 'https://esm.sh/@supabase/supabase-js@2?target=deno';
import { sendEmail } from '../_shared/email.ts';
import { newAssignmentEmail } from '../_shared/email-templates/new-assignment.ts';

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
    const { assignmentId } = await req.json();

    if (!assignmentId) {
      return new Response(JSON.stringify({ error: 'assignmentId is required' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    // Fetch assignment with game and group info
    const { data: assignment, error: assignmentError } = await supabase
      .from('Assignment')
      .select(`
        id,
        groupId,
        Game ( id, name ),
        Group ( id, name, tutorId )
      `)
      .eq('id', assignmentId)
      .single();

    if (assignmentError || !assignment) {
      console.error('send-assignment-notification: assignment not found', assignmentError);
      return new Response(JSON.stringify({ error: 'Assignment not found' }), {
        status: 404,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    const gameName = (assignment.Game as { name: string } | null)?.name ?? 'a game';
    const groupName = (assignment.Group as { name: string } | null)?.name ?? 'your group';
    const tutorId = (assignment.Group as { tutorId: string } | null)?.tutorId;

    // Get tutor name
    let tutorName = 'Your teacher';
    if (tutorId) {
      const { data: tutor } = await supabase
        .from('Tutor')
        .select('firstName, lastName')
        .eq('id', tutorId)
        .single();
      if (tutor) {
        tutorName = [tutor.firstName, tutor.lastName].filter(Boolean).join(' ') || 'Your teacher';
      }
    }

    // Get all students in this group
    const { data: memberships, error: membershipsError } = await supabase
      .from('GroupMember')
      .select('studentId, Student ( userId, firstName )')
      .eq('groupId', assignment.groupId);

    if (membershipsError) {
      console.error('send-assignment-notification: failed to get group members', membershipsError);
      return new Response(JSON.stringify({ error: 'Failed to get group members' }), {
        status: 500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    if (!memberships || memberships.length === 0) {
      return new Response(JSON.stringify({ sent: 0 }), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    // Collect userIds and names
    const studentEntries = memberships
      .map((m) => {
        const student = m.Student as { userId: string; firstName: string } | null;
        return student ? { userId: student.userId, firstName: student.firstName } : null;
      })
      .filter((s): s is { userId: string; firstName: string } => s !== null);

    // Fetch emails for all students from auth.users
    const emailSends: Promise<void>[] = [];
    let sentCount = 0;

    for (const student of studentEntries) {
      const { data: { user } } = await supabase.auth.admin.getUserById(student.userId);
      if (user?.email) {
        const name = student.firstName ?? 'there';
        const { subject, html } = newAssignmentEmail(name, tutorName, gameName, groupName);
        emailSends.push(sendEmail(user.email, subject, html));
        sentCount++;
      }
    }

    await Promise.all(emailSends);

    return new Response(JSON.stringify({ sent: sentCount }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('send-assignment-notification error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }
});
