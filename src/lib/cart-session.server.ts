import { getCookie, setCookie, deleteCookie } from '@tanstack/react-start/server'

const CART_SESSION_COOKIE = 'cart_session_id'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

/**
 * Generates a random session ID for guest carts
 */
function generateSessionId(): string {
  return crypto.randomUUID()
}

/**
 * Gets the current cart session ID from cookies, or creates a new one
 */
export function getOrCreateSessionId(): string {
  let sessionId = getCookie(CART_SESSION_COOKIE)

  if (!sessionId) {
    sessionId = generateSessionId()
    setCookie(CART_SESSION_COOKIE, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    })
  }

  return sessionId
}

/**
 * Gets the session ID if it exists (doesn't create a new one)
 */
export function getSessionId(): string | undefined {
  return getCookie(CART_SESSION_COOKIE)
}

/**
 * Clears the cart session cookie (e.g., after merging to user cart)
 */
export function clearSessionId(): void {
  deleteCookie(CART_SESSION_COOKIE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
}
