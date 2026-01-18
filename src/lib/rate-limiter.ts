interface RateLimitInfo {
  count: number
  resetTime: number
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
  retryAfter?: number
}

class RateLimiter {
  private store = new Map<string, RateLimitInfo>()
  private cleanupInterval: NodeJS.Timeout

  constructor(private defaultLimit: { requests: number, windowMs: number }) {
    // Cleanup expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 60000)
  }

  check(identifier: string, limit?: { requests: number, windowMs: number }): RateLimitResult {
    const config = limit || this.defaultLimit
    const now = Date.now()
    const windowStart = now - config.windowMs

    const current = this.store.get(identifier) || { count: 0, resetTime: now + config.windowMs }

    // Reset if window has expired
    if (now > current.resetTime) {
      current.count = 1
      current.resetTime = now + config.windowMs
      this.store.set(identifier, current)

      return {
        allowed: true,
        remaining: config.requests - 1,
        resetTime: current.resetTime
      }
    }

    // Check if limit exceeded
    if (current.count >= config.requests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: current.resetTime,
        retryAfter: Math.ceil((current.resetTime - now) / 1000)
      }
    }

    // Increment counter
    current.count++
    this.store.set(identifier, current)

    return {
      allowed: true,
      remaining: config.requests - current.count,
      resetTime: current.resetTime
    }
  }

  private cleanup(): void {
    const now = Date.now()

    for (const [key, info] of this.store.entries()) {
      if (now > info.resetTime) {
        this.store.delete(key)
      }
    }
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
    this.store.clear()
  }

  getStats(): { totalKeys: number, oldestResetTime: number, newestResetTime: number } {
    let oldest = Number.MAX_SAFE_INTEGER
    let newest = 0

    for (const info of this.store.values()) {
      oldest = Math.min(oldest, info.resetTime)
      newest = Math.max(newest, info.resetTime)
    }

    return {
      totalKeys: this.store.size,
      oldestResetTime: oldest,
      newestResetTime: newest
    }
  }
}

// Global instance for high-volume scenarios
export const globalRateLimiter = new RateLimiter({
  requests: 600, // Allow more requests initially
  windowMs: 60 * 1000 // 1 minute window
})

// Tiered rate limiting for different user types
export const tierLimits = {
  FREE: { requests: 10, windowMs: 60 * 1000 },         // 10 req/min
  STANDARD: { requests: 50, windowMs: 60 * 1000 },     // 50 req/min  
  PRO: { requests: 200, windowMs: 60 * 1000 }          // 200 req/min
} as const

export function checkRateLimit(
  identifier: string,
  requests?: number,
  windowMinutes?: number
): RateLimitResult {
  const limit = requests && windowMinutes ?
    { requests, windowMs: windowMinutes * 60 * 1000 } :
    undefined

  return globalRateLimiter.check(identifier, limit)
}

export function checkTieredRateLimit(
  identifier: string,
  tier: keyof typeof tierLimits
): RateLimitResult {
  const config = tierLimits[tier]

  return globalRateLimiter.check(identifier, {
    requests: config.requests,
    windowMs: config.windowMs
  })
}

export default RateLimiter
