import Stripe from 'https://esm.sh/stripe@14?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

const PRICE_MAP: Record<string, string> = {
  'student:monthly': Deno.env.get('STRIPE_PRICE_STUDENT_MONTHLY')!,
  'student:annual': Deno.env.get('STRIPE_PRICE_STUDENT_ANNUAL')!,
  'teacher:monthly': Deno.env.get('STRIPE_PRICE_TEACHER_MONTHLY')!,
  'teacher:annual': Deno.env.get('STRIPE_PRICE_TEACHER_ANNUAL')!,
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type, x-client-info, apikey',
      },
    });
  }

  try {
    // Authenticate caller
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', ''),
    );

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { plan, billingCycle } = await req.json();
    const priceKey = `${plan}:${billingCycle}`;
    const priceId = PRICE_MAP[priceKey];

    if (!priceId) {
      return new Response(JSON.stringify({ error: `Unknown plan: ${priceKey}` }), { status: 400 });
    }

    // Look up or create Stripe Customer for this user
    const role = user.user_metadata?.role === 'TUTOR' ? 'Tutor' : 'Student';
    const table = role === 'Tutor' ? 'Tutor' : 'Student';

    const { data: profile } = await supabase
      .from(table)
      .select('id, stripeCustomerId')
      .eq('userId', user.id)
      .single();

    let stripeCustomerId = profile?.stripeCustomerId as string | null;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id, role },
      });
      stripeCustomerId = customer.id;

      await supabase
        .from(table)
        .update({ stripeCustomerId })
        .eq('userId', user.id);
    }

    const origin = req.headers.get('origin') ?? 'https://studybug.app';

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: { trial_period_days: 14 },
      success_url: `${origin}/signup/complete`,
      cancel_url: `${origin}/signup?step=3`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err) {
    console.error('create-checkout-session error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
});
