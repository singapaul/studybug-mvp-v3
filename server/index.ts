/**
 * StudyBug Bun Backend Server (Scaffold)
 *
 * This server is a placeholder scaffold. All API routes are stubbed and
 * return 501 Not Implemented until the real implementation is wired up.
 *
 * Run with:   bun run server/index.ts
 * Dev mode:   bun run dev:server (uses --watch)
 */

import Stripe from 'stripe'
import { verifyAuth } from './middleware/auth'
import { verifyClerkWebhook } from './middleware/clerk-webhook'
import { handleClerkWebhook } from './webhooks/clerk-handler'
import { handleStripeWebhook } from './webhooks/stripe-handler'
import { checkTrialEndingSoon } from './jobs/trial-reminder'
import { subscriptionGuard } from './middleware/subscription-guard'
import {
  sendWelcomeEmail,
  sendGroupInviteEmail,
  sendAssignmentNotificationEmail,
  sendPaymentFailedEmail,
  sendSubscriptionCancelledEmail,
  sendPaymentSuccessfulEmail,
  sendTrialEndingSoonEmail,
} from './emails/send'
import { db } from './db/index'
import { getUserByClerkId, getTutorByUserId, getStudentByUserId } from './db/queries/index'
import { getSubscriptionStatus } from './db/queries/subscriptions'
import {
  getGamesByTutorId,
  getGameById,
  getGamesByType,
  createGame,
  updateGame,
  deleteGame,
  duplicateGame,
  type GameRow,
} from './db/queries/games'
import {
  createAssignment,
  deleteAssignment,
  updateAssignment,
  getGroupAssignments,
  isGameAssignedToGroup,
  getStudentAssignments,
  getStudentAssignmentById,
  getStudentStats,
  getStudentPersonalBests,
  getStudentProgressTrends,
} from './db/queries/assignments'
import {
  createAttempt,
  getAttemptsByStudent,
  getAttemptById,
  getAssignmentAttempts,
  getBestAttempt,
} from './db/queries/game-attempts'
import {
  getGroupsByTutorId,
  getGroupById,
  getGroupByJoinCode,
  createGroup,
  updateGroup,
  deleteGroup,
  addStudentToGroup,
  removeStudentFromGroup,
  getGroupsByStudentId,
  getGroupMemberEmails,
  type GroupRow,
  type GroupWithDetailsRow,
} from './db/queries/groups'

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.FRONTEND_URL ?? 'http://localhost:5173',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
    },
  });
}

function notImplemented(route: string): Response {
  return json({ error: 'Not implemented', route }, 501);
}

async function resolveTutor(userId: string): Promise<{ id: string } | Response> {
  const user = await getUserByClerkId(db, userId)
  if (!user) return json({ error: 'User not found' }, 404)
  const tutor = await getTutorByUserId(db, user.id)
  if (!tutor) return json({ error: 'Forbidden' }, 403)

  const guard = await subscriptionGuard(db, user.id)
  if (!guard.allowed) return json({ error: guard.reason }, 403)

  return tutor
}

async function resolveStudent(userId: string): Promise<{ id: string } | Response> {
  const user = await getUserByClerkId(db, userId)
  if (!user) return json({ error: 'User not found' }, 404)
  const student = await getStudentByUserId(db, user.id)
  if (!student) return json({ error: 'Forbidden' }, 403)

  const guard = await subscriptionGuard(db, user.id)
  if (!guard.allowed) return json({ error: guard.reason }, 403)

  return student
}

async function resolveProfile(userId: string): Promise<{ id: string; role: 'TUTOR' | 'STUDENT' } | Response> {
  const user = await getUserByClerkId(db, userId)
  if (!user) return json({ error: 'User not found' }, 404)

  const tutor = await getTutorByUserId(db, user.id)
  if (tutor) return { id: tutor.id, role: 'TUTOR' }

  const student = await getStudentByUserId(db, user.id)
  if (student) return { id: student.id, role: 'STUDENT' }

  return json({ error: 'Forbidden' }, 403)
}

const VALID_GAME_TYPES = new Set(['PAIRS', 'FLASHCARDS', 'MULTIPLE_CHOICE', 'SPLAT', 'SWIPE'])

function mapGame(row: GameRow, clerkId: string) {
  return {
    id: row.id,
    userId: clerkId,
    name: row.name,
    gameType: row.gameType,
    gameData: JSON.stringify(row.gameData),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    _count: { assignments: row.assignmentCount },
  }
}

function mapGroup(row: GroupRow) {
  return {
    id: row.id,
    tutorId: row.tutorId,
    name: row.name,
    joinCode: row.joinCode,
    ageRange: row.ageRange,
    subjectArea: row.subjectArea,
    createdAt: row.createdAt,
    updatedAt: row.createdAt,
    _count: { members: row.memberCount, assignments: row.assignmentCount },
  }
}

function mapGroupWithDetails(row: GroupWithDetailsRow) {
  return {
    ...mapGroup(row),
    members: row.members,
    assignments: row.assignments,
  }
}

function mapGameWithData(row: GameRow, clerkId: string) {
  return {
    id: row.id,
    userId: clerkId,
    name: row.name,
    gameType: row.gameType,
    gameData: row.gameData,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    _count: { assignments: row.assignmentCount },
  }
}

async function handleApiRoutes(
  path: string,
  method: string,
  req: Request,
  userId: string
): Promise<Response> {
  // ── Auth routes ──────────────────────────────────────────────
  if (path === '/api/auth/login' && method === 'POST') {
    return notImplemented('POST /api/auth/login');
  }
  if (path === '/api/auth/logout' && method === 'POST') {
    return notImplemented('POST /api/auth/logout');
  }
  if (path === '/api/auth/me' && method === 'GET') {
    return notImplemented('GET /api/auth/me');
  }

  // ── Subscription routes ──────────────────────────────────────
  if (path === '/api/subscription/status' && method === 'GET') {
    const user = await getUserByClerkId(db, userId)
    if (!user) return json({ error: 'User not found' }, 404)
    const result = await getSubscriptionStatus(db, user.id)
    if (!result) return json({ error: 'User not found' }, 404)
    return json(result)
  }

  // ── Game routes ──────────────────────────────────────────────
  if (path === '/api/games' && method === 'GET') {
    const tutor = await resolveTutor(userId)
    if (tutor instanceof Response) return tutor
    const rows = await getGamesByTutorId(db, tutor.id)
    return json(rows.map(r => mapGame(r, userId)))
  }
  if (path === '/api/games' && method === 'POST') {
    const tutor = await resolveTutor(userId)
    if (tutor instanceof Response) return tutor
    const body = await req.json().catch(() => null)
    if (!body || typeof body.name !== 'string' || !body.name.trim()) {
      return json({ error: 'Bad request', details: 'name is required' }, 400)
    }
    if (!VALID_GAME_TYPES.has(body.gameType)) {
      return json({ error: 'Bad request', details: 'invalid gameType' }, 400)
    }
    if (!body.gameData || typeof body.gameData !== 'object') {
      return json({ error: 'Bad request', details: 'gameData is required' }, 400)
    }
    const row = await createGame(db, {
      tutorId: tutor.id,
      name: body.name.trim(),
      gameType: body.gameType,
      gameData: body.gameData,
    })
    return json(mapGameWithData(row, userId), 201)
  }
  if (path.match(/^\/api\/games\/[^/]+\/duplicate$/) && method === 'POST') {
    const tutor = await resolveTutor(userId)
    if (tutor instanceof Response) return tutor
    const gameId = path.match(/^\/api\/games\/([^/]+)\/duplicate$/)?.[1]!
    const row = await duplicateGame(db, gameId, tutor.id)
    if (!row) return json({ error: 'Not found' }, 404)
    return json(mapGameWithData(row, userId), 201)
  }
  if (path.match(/^\/api\/games\/[^/]+$/) && method === 'GET') {
    const tutor = await resolveTutor(userId)
    if (tutor instanceof Response) return tutor
    const gameId = path.match(/^\/api\/games\/([^/]+)$/)?.[1]!
    const row = await getGameById(db, gameId, tutor.id)
    if (!row) return json({ error: 'Not found' }, 404)
    return json(mapGameWithData(row, userId))
  }
  if (path.match(/^\/api\/games\/[^/]+$/) && method === 'PATCH') {
    const tutor = await resolveTutor(userId)
    if (tutor instanceof Response) return tutor
    const gameId = path.match(/^\/api\/games\/([^/]+)$/)?.[1]!
    const body = await req.json().catch(() => null)
    if (!body) return json({ error: 'Bad request' }, 400)
    const row = await updateGame(db, gameId, tutor.id, {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.gameData !== undefined && { gameData: body.gameData }),
    })
    if (!row) return json({ error: 'Not found' }, 404)
    return json(mapGameWithData(row, userId))
  }
  if (path.match(/^\/api\/games\/[^/]+$/) && method === 'DELETE') {
    const tutor = await resolveTutor(userId)
    if (tutor instanceof Response) return tutor
    const gameId = path.match(/^\/api\/games\/([^/]+)$/)?.[1]!
    const deleted = await deleteGame(db, gameId, tutor.id)
    if (!deleted) return json({ error: 'Not found' }, 404)
    return new Response(null, { status: 204, headers: CORS_HEADERS })
  }

  // ── Group routes ─────────────────────────────────────────────
  if (path === '/api/groups' && method === 'GET') {
    const tutor = await resolveTutor(userId)
    if (tutor instanceof Response) return tutor
    const rows = await getGroupsByTutorId(db, tutor.id)
    return json(rows.map(mapGroup))
  }
  if (path === '/api/groups' && method === 'POST') {
    const tutor = await resolveTutor(userId)
    if (tutor instanceof Response) return tutor
    const body = await req.json().catch(() => null)
    if (!body || typeof body.name !== 'string' || !body.name.trim()) {
      return json({ error: 'Bad request', details: 'name is required' }, 400)
    }
    const row = await createGroup(db, {
      tutorId: tutor.id,
      name: body.name,
      ageRange: body.ageRange,
      subjectArea: body.subjectArea,
    })
    return json(mapGroup(row), 201)
  }
  if (path === '/api/groups/join' && method === 'POST') {
    const user = await getUserByClerkId(db, userId)
    if (!user) return json({ error: 'User not found' }, 404)
    const student = await getStudentByUserId(db, user.id)
    if (!student) return json({ error: 'Forbidden' }, 403)
    const body = await req.json().catch(() => null)
    if (!body?.joinCode) return json({ error: 'Bad request', details: 'joinCode is required' }, 400)
    const group = await getGroupByJoinCode(db, body.joinCode)
    if (!group) return json({ success: false, error: 'Invalid join code. Please check and try again.' })
    const added = await addStudentToGroup(db, group.id, student.id)
    if (!added) return json({ success: false, error: "You're already a member of this group." })
    return json({ success: true, groupName: group.name })
  }
  if (path.match(/^\/api\/groups\/[^/]+\/members\/[^/]+$/) && method === 'DELETE') {
    const tutor = await resolveTutor(userId)
    if (tutor instanceof Response) return tutor
    const match = path.match(/^\/api\/groups\/([^/]+)\/members\/([^/]+)$/)!
    const [, groupId, studentId] = match
    const group = await getGroupById(db, groupId, tutor.id)
    if (!group) return json({ error: 'Not found' }, 404)
    const removed = await removeStudentFromGroup(db, groupId, studentId)
    if (!removed) return json({ error: 'Not found' }, 404)
    return new Response(null, { status: 204, headers: CORS_HEADERS })
  }
  if (path.match(/^\/api\/groups\/[^/]+\/invite$/) && method === 'POST') {
    const tutor = await resolveTutor(userId)
    if (tutor instanceof Response) return tutor
    const groupId = path.match(/^\/api\/groups\/([^/]+)\/invite$/)?.[1]!
    const group = await getGroupById(db, groupId, tutor.id)
    if (!group) return json({ error: 'Not found' }, 404)
    const body = await req.json().catch(() => null)
    if (!body?.email || typeof body.email !== 'string') {
      return json({ error: 'Bad request', details: 'email is required' }, 400)
    }
    await sendGroupInviteEmail(body.email, group.name, group.joinCode)
    return json({ sent: true })
  }
  if (path.match(/^\/api\/groups\/[^/]+$/) && method === 'GET') {
    const tutor = await resolveTutor(userId)
    if (tutor instanceof Response) return tutor
    const groupId = path.match(/^\/api\/groups\/([^/]+)$/)?.[1]!
    const row = await getGroupById(db, groupId, tutor.id)
    if (!row) return json({ error: 'Not found' }, 404)
    return json(mapGroupWithDetails(row))
  }
  if (path.match(/^\/api\/groups\/[^/]+$/) && method === 'PATCH') {
    const tutor = await resolveTutor(userId)
    if (tutor instanceof Response) return tutor
    const groupId = path.match(/^\/api\/groups\/([^/]+)$/)?.[1]!
    const body = await req.json().catch(() => null)
    if (!body) return json({ error: 'Bad request' }, 400)
    const row = await updateGroup(db, groupId, tutor.id, {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.ageRange !== undefined && { ageRange: body.ageRange }),
      ...(body.subjectArea !== undefined && { subjectArea: body.subjectArea }),
    })
    if (!row) return json({ error: 'Not found' }, 404)
    return json(mapGroup(row))
  }
  if (path.match(/^\/api\/groups\/[^/]+$/) && method === 'DELETE') {
    const tutor = await resolveTutor(userId)
    if (tutor instanceof Response) return tutor
    const groupId = path.match(/^\/api\/groups\/([^/]+)$/)?.[1]!
    const deleted = await deleteGroup(db, groupId, tutor.id)
    if (!deleted) return json({ error: 'Not found' }, 404)
    return new Response(null, { status: 204, headers: CORS_HEADERS })
  }

  // ── Student group routes ─────────────────────────────────────
  if (path === '/api/student/groups' && method === 'GET') {
    const user = await getUserByClerkId(db, userId)
    if (!user) return json({ error: 'User not found' }, 404)
    const student = await getStudentByUserId(db, user.id)
    if (!student) return json({ error: 'Forbidden' }, 403)
    const rows = await getGroupsByStudentId(db, student.id)
    return json(rows.map(mapGroupWithDetails))
  }

  // ── Assignment routes ────────────────────────────────────────
  if (path === '/api/assignments' && method === 'POST') {
    const tutor = await resolveTutor(userId)
    if (tutor instanceof Response) return tutor
    const body = await req.json().catch(() => null)
    if (!body?.gameId || !body?.groupId) {
      return json({ error: 'Bad request', details: 'gameId and groupId are required' }, 400)
    }
    const row = await createAssignment(db, {
      gameId: body.gameId,
      groupId: body.groupId,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      passPercentage: body.passPercentage ?? null,
    })
    // Fire-and-forget email notifications to group members
    getGroupMemberEmails(db, body.groupId).then(members => {
      for (const { email } of members) {
        sendAssignmentNotificationEmail(email, row.game.name, row.group.name).catch(() => {})
      }
    }).catch(() => {})
    return json(row, 201)
  }
  if (path.match(/^\/api\/assignments\/[^/]+$/) && method === 'PATCH') {
    const tutor = await resolveTutor(userId)
    if (tutor instanceof Response) return tutor
    const assignmentId = path.match(/^\/api\/assignments\/([^/]+)$/)?.[1]!
    const body = await req.json().catch(() => null)
    if (!body) return json({ error: 'Bad request' }, 400)
    const row = await updateAssignment(db, assignmentId, tutor.id, {
      ...(body.dueDate !== undefined && { dueDate: body.dueDate ? new Date(body.dueDate) : null }),
      ...(body.passPercentage !== undefined && { passPercentage: body.passPercentage }),
    })
    if (!row) return json({ error: 'Not found' }, 404)
    return json(row)
  }
  if (path.match(/^\/api\/assignments\/[^/]+$/) && method === 'DELETE') {
    const tutor = await resolveTutor(userId)
    if (tutor instanceof Response) return tutor
    const assignmentId = path.match(/^\/api\/assignments\/([^/]+)$/)?.[1]!
    const deleted = await deleteAssignment(db, assignmentId, tutor.id)
    if (!deleted) return json({ error: 'Not found' }, 404)
    return new Response(null, { status: 204, headers: CORS_HEADERS })
  }
  if (path === '/api/student/assignments' && method === 'GET') {
    const user = await getUserByClerkId(db, userId)
    if (!user) return json({ error: 'User not found' }, 404)
    const student = await getStudentByUserId(db, user.id)
    if (!student) return json({ error: 'Forbidden' }, 403)
    const rows = await getStudentAssignments(db, student.id)
    return json(rows)
  }
  if (path.match(/^\/api\/student\/assignments\/[^/]+$/) && method === 'GET') {
    const user = await getUserByClerkId(db, userId)
    if (!user) return json({ error: 'User not found' }, 404)
    const student = await getStudentByUserId(db, user.id)
    if (!student) return json({ error: 'Forbidden' }, 403)
    const assignmentId = path.match(/^\/api\/student\/assignments\/([^/]+)$/)?.[1]!
    const row = await getStudentAssignmentById(db, student.id, assignmentId)
    if (!row) return json({ error: 'Not found' }, 404)
    return json(row)
  }
  if (path === '/api/student/stats' && method === 'GET') {
    const user = await getUserByClerkId(db, userId)
    if (!user) return json({ error: 'User not found' }, 404)
    const student = await getStudentByUserId(db, user.id)
    if (!student) return json({ error: 'Forbidden' }, 403)
    const stats = await getStudentStats(db, student.id)
    return json(stats)
  }
  if (path === '/api/student/personal-bests' && method === 'GET') {
    const user = await getUserByClerkId(db, userId)
    if (!user) return json({ error: 'User not found' }, 404)
    const student = await getStudentByUserId(db, user.id)
    if (!student) return json({ error: 'Forbidden' }, 403)
    const bests = await getStudentPersonalBests(db, student.id)
    return json(bests)
  }
  if (path === '/api/student/progress-trends' && method === 'GET') {
    const user = await getUserByClerkId(db, userId)
    if (!user) return json({ error: 'User not found' }, 404)
    const student = await getStudentByUserId(db, user.id)
    if (!student) return json({ error: 'Forbidden' }, 403)
    const url2 = new URL(req.url)
    const days = parseInt(url2.searchParams.get('days') ?? '30', 10)
    const trends = await getStudentProgressTrends(db, student.id, days)
    return json(trends)
  }

  // ── Group assignments (tutor view) ───────────────────────────
  if (path.match(/^\/api\/groups\/[^/]+\/assignments$/) && method === 'GET') {
    const tutor = await resolveTutor(userId)
    if (tutor instanceof Response) return tutor
    const groupId = path.match(/^\/api\/groups\/([^/]+)\/assignments$/)?.[1]!
    const rows = await getGroupAssignments(db, groupId, tutor.id)
    return json(rows)
  }

  // ── Game attempt routes ──────────────────────────────────────
  if (path === '/api/attempts' && method === 'POST') {
    const user = await getUserByClerkId(db, userId)
    if (!user) return json({ error: 'User not found' }, 404)
    const student = await getStudentByUserId(db, user.id)
    if (!student) return json({ error: 'Forbidden' }, 403)
    const body = await req.json().catch(() => null)
    if (!body?.assignmentId || body.scorePercentage === undefined || body.timeTaken === undefined) {
      return json({ error: 'Bad request', details: 'assignmentId, scorePercentage, timeTaken are required' }, 400)
    }
    const row = await createAttempt(db, {
      studentId: student.id,
      assignmentId: body.assignmentId,
      scorePercentage: body.scorePercentage,
      timeTaken: body.timeTaken,
      attemptData: body.attemptData ?? {},
    })
    return json(row, 201)
  }
  if (path === '/api/attempts' && method === 'GET') {
    const user = await getUserByClerkId(db, userId)
    if (!user) return json({ error: 'User not found' }, 404)
    const student = await getStudentByUserId(db, user.id)
    if (!student) return json({ error: 'Forbidden' }, 403)
    const rows = await getAttemptsByStudent(db, student.id)
    return json(rows)
  }
  if (path.match(/^\/api\/attempts\/[^/]+$/) && method === 'GET') {
    const user = await getUserByClerkId(db, userId)
    if (!user) return json({ error: 'User not found' }, 404)
    const student = await getStudentByUserId(db, user.id)
    if (!student) return json({ error: 'Forbidden' }, 403)
    const attemptId = path.match(/^\/api\/attempts\/([^/]+)$/)?.[1]!
    const row = await getAttemptById(db, attemptId, student.id)
    if (!row) return json({ error: 'Not found' }, 404)
    return json(row)
  }

  // ── Payment routes ───────────────────────────────────────────
  if (path === '/api/payments/create-checkout' && method === 'POST') {
    const profile = await resolveProfile(userId)
    if (profile instanceof Response) return profile
    const body = await req.json().catch(() => null)
    if (!body?.planType || !body?.interval) {
      return json({ error: 'Bad request', details: 'planType and interval are required' }, 400)
    }
    const priceIds: Record<string, string | undefined> = {
      'tutor_monthly': process.env.STRIPE_TUTOR_MONTHLY_PRICE_ID,
      'tutor_annual': process.env.STRIPE_TUTOR_ANNUAL_PRICE_ID,
      'student_monthly': process.env.STRIPE_STUDENT_MONTHLY_PRICE_ID,
      'student_annual': process.env.STRIPE_STUDENT_ANNUAL_PRICE_ID,
    }
    const priceId = priceIds[`${body.planType}_${body.interval}`]
    if (!priceId) return json({ error: 'Invalid plan or interval' }, 400)

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    const user = await getUserByClerkId(db, userId)
    const stripeRole = body.planType === 'tutor' ? 'TUTOR' : 'STUDENT'
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: { trial_period_days: 14 },
      success_url: `${process.env.FRONTEND_URL}/dashboard?checkout=success`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing`,
      metadata: { clerkUserId: userId, role: stripeRole },
      customer_email: user?.email,
    })
    return json({ url: session.url })
  }

  if (path === '/api/payments/create-portal' && method === 'POST') {
    const user = await getUserByClerkId(db, userId)
    if (!user) return json({ error: 'User not found' }, 404)
    const tutor = await getTutorByUserId(db, user.id)
    const student = await getStudentByUserId(db, user.id)
    const customerId = tutor?.stripeCustomerId ?? student?.stripeCustomerId
    if (!customerId) return json({ error: 'No subscription found' }, 404)

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.FRONTEND_URL}/settings`,
    })
    return json({ url: portalSession.url })
  }

  return json({ error: 'Not found', path }, 404);
}

const server = Bun.serve({
  port: PORT,

  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // Health check
    if (path === '/health' && method === 'GET') {
      return json({ status: 'ok', timestamp: new Date().toISOString() });
    }

    // Webhook routes — no JWT auth
    if (path === '/api/webhooks/clerk' && method === 'POST') {
      const event = await verifyClerkWebhook(req, process.env.CLERK_WEBHOOK_SECRET!)
      if (event instanceof Response) return event
      await handleClerkWebhook(event, db, sendWelcomeEmail)
      return json({ received: true })
    }

    if (path === '/api/webhooks/stripe' && method === 'POST') {
      const secret = process.env.STRIPE_WEBHOOK_SECRET
      if (!secret) return json({ error: 'Stripe webhook secret not configured' }, 500)
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
      const sig = req.headers.get('stripe-signature') ?? ''
      const body = await req.text()
      let event: Stripe.Event
      try {
        event = stripe.webhooks.constructEvent(body, sig, secret)
      } catch {
        return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 400, headers: CORS_HEADERS })
      }
      await handleStripeWebhook(
        { type: event.type, data: { object: (event.data.object as Record<string, unknown>) } },
        db,
        {
          sendPaymentFailed: sendPaymentFailedEmail,
          sendSubscriptionCancelled: sendSubscriptionCancelledEmail,
          sendPaymentSuccessful: sendPaymentSuccessfulEmail,
        }
      )
      return json({ received: true })
    }

    // Cron routes — secret header auth
    if (path === '/api/cron/trial-check' && method === 'POST') {
      const cronSecret = req.headers.get('x-cron-secret')
      if (!cronSecret || cronSecret !== process.env.CRON_SECRET) {
        return json({ error: 'Unauthorized' }, 401)
      }
      await checkTrialEndingSoon(db, {
        sendTrialEndingSoon: (to, firstName, trialEndsAt) =>
          sendTrialEndingSoonEmail(to, firstName, trialEndsAt),
      })
      return json({ ok: true })
    }

    // Auth guard for all other /api/* routes
    if (path.startsWith('/api/')) {
      const auth = await verifyAuth(req)
      if (auth instanceof Response) return auth
      const { userId } = auth
      return handleApiRoutes(path, method, req, userId)
    }

    return json({ error: 'Not found', path }, 404);
  },
});

console.log(`StudyBug server running at http://localhost:${server.port}`);
