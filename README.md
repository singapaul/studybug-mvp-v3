# StudyBug — Running in Dev Mode

## Prerequisites

Make sure you have these installed:

```bash
node --version      # v18+
npm --version
supabase --version  # Supabase CLI
stripe --version    # Stripe CLI
```

Install Stripe CLI if needed: `brew install stripe/stripe-cli/stripe`

---

## 1. Environment Setup

Create `studybug-mvp-v3/.env.local` (frontend env vars):

```env
# Supabase — get these from https://supabase.com/dashboard/project/qjqlillerghqnrwppeei/settings/api
VITE_SUPABASE_URL=https://qjqlillerghqnrwppeei.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>

# Set to true to skip auth entirely and use hardcoded mock users
VITE_MOCK_USER_MODE=false
```

> Set `VITE_MOCK_USER_MODE=true` if you want to develop UI without hitting Supabase auth.

Create `supabase/functions/.env` (Edge Function secrets — never commit this):

```env
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxx   # from `stripe listen` output

# Price IDs from https://dashboard.stripe.com/test/products
STRIPE_PRICE_STUDENT_MONTHLY=price_xxxxxxxxxxxxxxxx
STRIPE_PRICE_STUDENT_ANNUAL=price_xxxxxxxxxxxxxxxx
STRIPE_PRICE_TEACHER_MONTHLY=price_xxxxxxxxxxxxxxxx
STRIPE_PRICE_TEACHER_ANNUAL=price_xxxxxxxxxxxxxxxx

APP_URL=http://localhost:8080
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Start the Vite Dev Server

```bash
npm run dev
```

App runs at **http://localhost:8080**

---

## 4. Supabase Edge Functions

The project points at Supabase Cloud, so functions run remotely. To serve them locally during development:

```bash
# From the repo root (where /supabase lives)
supabase functions serve --env-file supabase/functions/.env
```

> This serves all functions in `supabase/functions/` on **http://localhost:54321/functions/v1/**.

If you need to deploy a function to the remote project:

```bash
supabase functions deploy <function-name>
# Set secrets on the remote project
supabase secrets set --env-file supabase/functions/.env
```

---

## 5. Stripe Webhook (Local Forwarding)

Log in to Stripe CLI (one-time setup):

```bash
stripe login
```

Forward webhook events to the `stripe-webhook` Edge Function:

```bash
stripe listen --forward-to http://localhost:54321/functions/v1/stripe-webhook
```

The CLI will print a **webhook signing secret** like:
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxxxxx
```

Add this to `supabase/functions/.env`:
```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxx
```

> This secret changes each time you run `stripe listen`, so don't commit it.

---

## 6. Full Dev Startup (All Together)

Open three terminal tabs:

**Tab 1 — App**
```bash
cd studybug-mvp-v3 && npm run dev
```

**Tab 2 — Supabase Functions**
```bash
supabase functions serve --env-file supabase/functions/.env
```

**Tab 3 — Stripe Webhook Forwarding**
```bash
stripe listen --forward-to http://localhost:54321/functions/v1/stripe-webhook
```

---

## Quick Reference

| What | URL |
|------|-----|
| App | http://localhost:8080 |
| Supabase Studio | https://supabase.com/dashboard/project/qjqlillerghqnrwppeei |
| Supabase Functions (local) | http://localhost:54321/functions/v1/ |
| Stripe Dashboard | https://dashboard.stripe.com/test/webhooks |

---

## Switching Auth Modes

| Mode | `.env.local` value | Use when |
|------|--------------------|----------|
| Mock users | `VITE_MOCK_USER_MODE=true` | UI dev, no Supabase needed |
| Real auth | `VITE_MOCK_USER_MODE=false` | Testing full auth flows |

After changing `.env.local`, restart the dev server.
