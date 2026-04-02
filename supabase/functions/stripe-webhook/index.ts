import Stripe from 'https://esm.sh/stripe@14?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2?target=deno';
import { sendEmail } from '../_shared/email.ts';
import { trialStartedEmail } from '../_shared/email-templates/trial-started.ts';
import { paymentSuccessfulEmail } from '../_shared/email-templates/payment-successful.ts';
import { paymentFailedEmail } from '../_shared/email-templates/payment-failed.ts';
import { subscriptionCancelledEmail } from '../_shared/email-templates/subscription-cancelled.ts';

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

/**
 * Looks up the user record (email + profile) associated with a Stripe customer ID.
 * Returns null if not found.
 */
async function getUserByStripeCustomerId(
  customerId: string,
): Promise<{ email: string; firstName: string; planName?: string } | null> {
  // Try Tutor
  const { data: tutor } = await supabase
    .from('Tutor')
    .select('userId, firstName, stripePriceId')
    .eq('stripeCustomerId', customerId)
    .single();

  if (tutor) {
    const { data: { user } } = await supabase.auth.admin.getUserById(tutor.userId);
    if (user?.email) {
      return { email: user.email, firstName: tutor.firstName ?? 'there' };
    }
  }

  // Try Student
  const { data: student } = await supabase
    .from('Student')
    .select('userId, firstName')
    .eq('stripeCustomerId', customerId)
    .single();

  if (student) {
    const { data: { user } } = await supabase.auth.admin.getUserById(student.userId);
    if (user?.email) {
      return { email: user.email, firstName: student.firstName ?? 'there' };
    }
  }

  return null;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
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

        // Send trial started email (fire-and-forget)
        if (subscription.status === 'trialing' && subscription.trial_end) {
          const userInfo = await getUserByStripeCustomerId(customerId);
          if (userInfo) {
            const trialEndDate = formatDate(subscription.trial_end);
            const planName = subscription.items.data[0]?.price.nickname ?? 'StudyBug';
            const { subject, html } = trialStartedEmail(userInfo.firstName, trialEndDate, planName);
            sendEmail(userInfo.email, subject, html);
          }
        }
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

        // Send cancellation email (fire-and-forget)
        const userInfo = await getUserByStripeCustomerId(customerId);
        if (userInfo) {
          const periodEnd = formatDate(subscription.current_period_end);
          const { subject, html } = subscriptionCancelledEmail(userInfo.firstName, periodEnd);
          sendEmail(userInfo.email, subject, html);
        }
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

        // Send payment successful email (fire-and-forget)
        // Skip if this is the first invoice for a trialing subscription (avoid double email)
        if (invoice.billing_reason !== 'subscription_create') {
          const userInfo = await getUserByStripeCustomerId(customerId);
          if (userInfo) {
            const periodEnd = formatDate(subscription.current_period_end);
            const { subject, html } = paymentSuccessfulEmail(userInfo.firstName, periodEnd);
            sendEmail(userInfo.email, subject, html);
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        await updateSubscription(customerId, {
          subscriptionStatus: 'EXPIRED',
        });

        // Send payment failed email (fire-and-forget)
        const userInfo = await getUserByStripeCustomerId(customerId);
        if (userInfo) {
          const { subject, html } = paymentFailedEmail(userInfo.firstName);
          sendEmail(userInfo.email, subject, html);
        }
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
