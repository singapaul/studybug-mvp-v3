import { describe, test, expect } from 'bun:test'
import { verifyAuth } from './auth'

describe('verifyAuth', () => {
  test('returns 401 when Authorization header is missing', async () => {
    const req = new Request('http://localhost/api/games')
    const result = await verifyAuth(req)
    expect(result instanceof Response).toBe(true)
    expect((result as Response).status).toBe(401)
  })

  test('returns 401 when token is invalid', async () => {
    const req = new Request('http://localhost/api/games', {
      headers: { Authorization: 'Bearer invalid-token' }
    })
    const mockVerifier = async (_token: string) => {
      throw new Error('Invalid token')
    }
    const result = await verifyAuth(req, mockVerifier)
    expect(result instanceof Response).toBe(true)
    expect((result as Response).status).toBe(401)
  })

  test('returns userId when token is valid', async () => {
    const req = new Request('http://localhost/api/games', {
      headers: { Authorization: 'Bearer valid-token' }
    })
    const mockVerifier = async (_token: string) => ({ userId: 'user_123' })
    const result = await verifyAuth(req, mockVerifier)
    expect(result instanceof Response).toBe(false)
    expect((result as { userId: string }).userId).toBe('user_123')
  })
})
