import { describe, test, expect } from 'bun:test'
import { Webhook } from 'svix'
import { verifyClerkWebhook } from './clerk-webhook'

describe('verifyClerkWebhook', () => {
  test('returns 400 when svix headers are missing', async () => {
    const req = new Request('http://localhost/api/webhooks/clerk', {
      method: 'POST',
      body: JSON.stringify({ type: 'user.created' }),
      headers: { 'Content-Type': 'application/json' }
    })
    const result = await verifyClerkWebhook(req, 'test-secret')
    expect(result instanceof Response).toBe(true)
    expect((result as Response).status).toBe(400)
  })

  test('returns parsed event when signature is valid', async () => {
    const secret = 'whsec_dGVzdC1zZWNyZXQtdGhhdC1pcy1sb25nLWVub3VnaA=='
    const body = JSON.stringify({ type: 'user.created', data: { id: 'user_123' } })
    const wh = new Webhook(secret)
    const msgId = 'msg_test123'
    const timestamp = new Date()
    const svixSignature = wh.sign(msgId, timestamp, body)

    const req = new Request('http://localhost/api/webhooks/clerk', {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
        'svix-id': msgId,
        'svix-timestamp': Math.floor(timestamp.getTime() / 1000).toString(),
        'svix-signature': svixSignature,
      }
    })

    const result = await verifyClerkWebhook(req, secret)
    expect(result instanceof Response).toBe(false)
    expect((result as any).type).toBe('user.created')
  })
})
