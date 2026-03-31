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

// Map Stripe subscription status to our DB enum
function toSubscriptionStatus(stripeStatus: string): string {
  switch (stripeStatus) {
    case 'trialing': return 'TRIALING';
    case 'active': return 'ACTIVE';
    case 'canceled':
    case 'cancelled': return 'CANCELLED';
    case 'past_due':
    case 'unpaid':
    case 'incomplete_expired': return 'EXPIRED';
    default: return 'FREE';
  }
}

// Update subscription fields on whichever table owns this Stripe customer
async function updateSubscription(
  stripeCustomerId: string,
  fields: Record<string, unknown>,
) {
  // Try Tutor first, then Student
  const { data: tutor } = await supabase
    .from('Tutor')
    .select('id')
    .eq('stripeCustomerId', stripeCustomerId)
    .single();

  if (tutor) {
    await supabase.from('Tutor').update(fields).eq('stripeCustomerId', stripeCustomerId);
    return;
  }

  await supabase.from('Student').update(fields).eq('stripeCustomerId', stripeCustomerId);
}

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;

  let event: Stripe.Event;

  try {
    const body = await req.text();
    event = await stripe.webhooks.constructEventAsync(body, signature!, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return new Response('Invalid signature', { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== 'subscription' || !session.subscription) break;

        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        const customerId = session.customer as string;

        await updateSubscription(customerId, {
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0]?.price.id ?? null,
          subscriptionStatus: toSubscriptionStatus(subscription.status),
          trialEndsAt: subscription.trial_end
            ? new Date(subscription.trial_end * 1000).toISOString()
            : null,
          subscriptionPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
        });
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        await updateSubscription(customerId, {
          stripePriceId: subscription.items.data[0]?.price.id ?? null,
          subscriptionStatus: toSubscriptionStatus(subscription.status),
          trialEndsAt: subscription.trial_end
            ? new Date(subscription.trial_end * 1000).toISOString()
            : null,
          subscriptionPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        await updateSubscription(customerId, {
          subscriptionStatus: 'CANCELLED',
          subscriptionPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
        });
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        if (!invoice.subscription) break;

        const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);

        await updateSubscription(customerId, {
          subscriptionStatus: 'ACTIVE',
          subscriptionPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
        });
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        await updateSubscription(customerId, {
          subscriptionStatus: 'EXPIRED',
        });
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Webhook handler error:', err);
    return new Response('Handler error', { status: 500 });
  }
});
