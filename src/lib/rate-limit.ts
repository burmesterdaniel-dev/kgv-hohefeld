/**
 * Simple in-memory rate limiter.
 * Tracks request counts per IP with automatic TTL cleanup.
 */

type RateLimitEntry = {
  count: number
  resetTime: number
}

const ipMap = new Map<string, RateLimitEntry>()

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of ipMap) {
    if (now > entry.resetTime) {
      ipMap.delete(key)
    }
  }
}, 5 * 60 * 1000)

/**
 * Check if a request from this IP is allowed.
 * @param ip - The IP address
 * @param limit - Max requests allowed in the window
 * @param windowMs - Time window in milliseconds (default: 60s)
 * @returns { allowed: boolean, remaining: number }
 */
export function rateLimit(
  ip: string,
  limit: number,
  windowMs: number = 60_000
): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const key = ip

  const entry = ipMap.get(key)

  if (!entry || now > entry.resetTime) {
    // First request or window expired
    ipMap.set(key, { count: 1, resetTime: now + windowMs })
    return { allowed: true, remaining: limit - 1 }
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 }
  }

  entry.count++
  return { allowed: true, remaining: limit - entry.count }
}

/**
 * Extract client IP from request headers.
 * Works with Vercel (x-forwarded-for) and local dev.
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  const realIp = req.headers.get('x-real-ip')
  if (realIp) return realIp
  return '127.0.0.1'
}

/**
 * Check for honeypot field. Returns true if the request is likely spam.
 * The honeypot field is a hidden field named "website" — real users won't fill it.
 */
export function isHoneypotTriggered(body: Record<string, unknown>): boolean {
  return typeof body.website === 'string' && body.website.length > 0
}
