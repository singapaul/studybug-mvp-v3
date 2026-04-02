/**
 * Cron function to send trial-ending-soon emails.
 *
 * REQUIRED MIGRATION — run this before deploying:
 *   ALTER TABLE "Tutor" ADD COLUMN IF NOT EXISTS "trialReminderSentAt" timestamptz;
 *   ALTER TABLE "Student" ADD COLUMN IF NOT EXISTS "trialReminderSentAt" timestamptz;
 *
 * Schedule this function to run daily via Supabase cron or an external scheduler.
 * Protect it with a CRON_SECRET header.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2?target=deno';
import { sendEmail } from '../_shared/email.ts';
import { trialEndingSoonEmail } from '../_shared/email-templates/trial-ending-soon.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

interface TrialingRow {
  id: string;
  userId: string;
  firstName: string;
  trialEndsAt: string;
}

async function processTable(tableName: 'Tutor' | 'Student'): Promise<number> {
  const now = new Date();
  const inThreeDays = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  const { data: rows, error } = await supabase
    .from(tableName)
    .select('id, userId, firstName, trialEndsAt')
    .eq('subscriptionStatus', 'TRIALING')
    .is('trialReminderSentAt', null)
    .gte('trialEndsAt', now.toISOString())
    .lte('trialEndsAt', inThreeDays.toISOString());

  if (error) {
    console.error(`check-trial-expiry: failed to query ${tableName}`, error);
    return 0;
  }

  if (!rows || rows.length === 0) return 0;

  let processedCount = 0;

  for (const row of rows as TrialingRow[]) {
    const { data: { user } } = await supabase.auth.admin.getUserById(row.userId);

    if (!user?.email) {
      console.warn(`check-trial-expiry: no email for ${tableName} user ${row.userId}`);
      continue;
    }

    const trialEnd = new Date(row.trialEndsAt);
    const msLeft = trialEnd.getTime() - now.getTime();
    const daysLeft = Math.max(1, Math.ceil(msLeft / (24 * 60 * 60 * 1000)));
    const trialEndDate = trialEnd.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const name = row.firstName ?? 'there';
    const { subject, html } = trialEndingSoonEmail(name, daysLeft, trialEndDate);

    await sendEmail(user.email, subject, html);

    // Mark reminder as sent
    await supabase
      .from(tableName)
      .update({ trialReminderSentAt: now.toISOString() })
      .eq('id', row.id);

    processedCount++;
  }

  return processedCount;
}

Deno.serve(async (req) => {
  // Validate cron secret
  const cronSecret = Deno.env.get('CRON_SECRET');
  const providedSecret = req.headers.get('x-cron-secret');

  if (!cronSecret || providedSecret !== cronSecret) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const [tutorCount, studentCount] = await Promise.all([
      processTable('Tutor'),
      processTable('Student'),
    ]);

    const processed = tutorCount + studentCount;
    console.log(`check-trial-expiry: processed ${processed} (tutors: ${tutorCount}, students: ${studentCount})`);

    return new Response(JSON.stringify({ processed }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('check-trial-expiry error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
