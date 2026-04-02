import { createClerkClient } from '@clerk/backend'

export type TokenVerifier = (token: string) => Promise<{ userId: string }>

function defaultVerifier(token: string): Promise<{ userId: string }> {
  const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! })
  return clerk.verifyToken(token).then(payload => ({ userId: payload.sub }))
}

export async function verifyAuth(
  req: Request,
  verifier: TokenVerifier = defaultVerifier
): Promise<{ userId: string } | Response> {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  const token = authHeader.slice(7)
  try {
    const { userId } = await verifier(token)
    return { userId }
  } catch {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
