interface CacheEntry<T> {
  data: T
  timestamp: number
  expiry: number
}

interface CacheConfig {
  ttl: number        // Time to live in milliseconds
  maxSize: number    // Maximum number of entries
  cleanupInterval: number // Cleanup interval in milliseconds
}

class AICache<T = any> {
  private store = new Map<string, CacheEntry<T>>()
  private stats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    errors: 0
  }
  private cleanupTimer?: NodeJS.Timeout

  constructor(private config: CacheConfig) {
    this.startCleanupTimer()
  }

  set(key: string, data: T, customTTL?: number): void {
    try {
      const ttl = customTTL || this.config.ttl
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        expiry: Date.now() + ttl
      }

      // Remove oldest entries if cache is full
      if (this.store.size >= this.config.maxSize) {
        this.evictOldest()
      }

      this.store.set(key, entry)
      this.stats.sets++

      console.log(`📦 Cached response for key: ${key.substring(0, 20)}... (TTL: ${ttl}ms)`)
    } catch (error) {
      console.error('Cache set error:', error)
      this.stats.errors++
    }
  }

  get(key: string): T | null {
    try {
      const entry = this.store.get(key)
      
      if (!entry) {
        this.stats.misses++
        return null
      }

      // Check if entry is expired
      if (Date.now() > entry.expiry) {
        this.store.delete(key)
        this.stats.misses++
        return null
      }

      this.stats.hits++
      return entry.data
    } catch (error) {
      console.error('Cache get error:', error)
      this.stats.errors++
      return null
    }
  }

  delete(key: string): boolean {
    try {
      const deleted = this.store.delete(key)
      if (deleted) {
        this.stats.deletes++
      }
      return deleted
    } catch (error) {
      console.error('Cache delete error:', error)
      this.stats.errors++
      return false
    }
  }

  clear(): void {
    this.store.clear()
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      errors: 0
    }
  }

  private evictOldest(): void {
    let oldestKey = ''
    let oldestTime = Number.MAX_SAFE_INTEGER

    for (const [key, entry] of this.store.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp
        oldestKey = key
      }
    }

    if (oldestKey) {
      this.store.delete(oldestKey)
    }
  }

  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup()
    }, this.config.cleanupInterval)
  }

  private cleanup(): void {
    const now = Date.now()
    let cleanedCount = 0

    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiry) {
        this.store.delete(key)
        cleanedCount++
      }
    }

    if (cleanedCount > 0) {
      console.log(`🧹 Cache cleanup: removed ${cleanedCount} expired entries`)
    }
  }

  getStats(): typeof this.stats & { 
    size: number
    hitRate: number 
  } {
    const totalRequests = this.stats.hits + this.stats.misses
    const hitRate = totalRequests > 0 ? (this.stats.hits / totalRequests) : 0

    return {
      ...this.stats,
      size: this.store.size,
      hitRate: Math.round(hitRate * 100) / 100
    }
  }

  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
    }
    this.clear()
  }
}

// Global AI response cache with optimized settings for high volume
export const aiResponseCache = new AICache({
  ttl: 10 * 60 * 1000,      // 10 minutes TTL
  maxSize: 1000,            // Store up to 1000 entries
  cleanupInterval: 60 * 1000 // Cleanup every minute
})

// Generate cache key from business info
export function generateCacheKey(businessInfo: any): string {
  const keyData = {
    companyName: businessInfo?.companyName,
    industry: businessInfo?.industry,
    description: businessInfo?.description,
    language: businessInfo?.language,
    services: businessInfo?.services,
    targetAudience: businessInfo?.targetAudience,
    tone: businessInfo?.tone
  }
  
  // Create deterministic hash of the business info using Buffer (Node.js only)
  try {
    const jsonString = JSON.stringify(keyData)
    const buffer = Buffer.from(jsonString, 'utf8')
    return buffer.toString('base64')
      .replace(/[+/=]/g, '')
      .substring(0, 32)
  } catch (error) {
    // Fallback: simple string hash for browser environments
    const jsonString = JSON.stringify(keyData)
    let hash = 0
    for (let i = 0; i < jsonString.length; i++) {
      const char = jsonString.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36).substring(0, 32)
  }
}

// Cache response
export function setCachedResponse(key: string, data: any, customTTL?: number): void {
  aiResponseCache.set(key, data, customTTL)
}

// Get cached response  
export function getCachedResponse(key: string): any | null {
  return aiResponseCache.get(key)
}

// Enhanced caching with business context
export function setBusinessCachedResponse(
  businessInfo: any, 
  generatedData: any, 
  customTTL?: number
): void {
  const key = generateCacheKey(businessInfo)
  const enrichedResponse = {
    ...generatedData,
    cached: true,
    cachedAt: new Date().toISOString(),
    businessContext: {
      industry: businessInfo.industry,
      language: businessInfo.language,
      companyName: businessInfo.companyName
    }
  }
  
  setCachedResponse(key, enrichedResponse, customTTL)
}

// Get cache statistics for monitoring
export function getCacheStats() {
  return aiResponseCache.getStats()
}

export default AICache
