interface APIKeyInfo {
  key: string
  usageToday: number
  lastUsed: number
  errors: number
  successRate: number
  resetTime: number
}

interface APIPerformanceMetrics {
  key: string
  totalRequests: number
  successfulRequests: number
  averageResponseTime: number
  lastError?: string
  lastUsed: number
}

class AILoadBalancer {
  private apiKeys: APIKeyInfo[] = []
  private metrics = new Map<string, APIPerformanceMetrics>()

  constructor() {
    this.initializeAPIKeys()
    this.startMetricsCleanup()
  }

  private initializeAPIKeys(): void {
    // Load all available API keys
    const keyCount = 50 // Optimized for 500 concurrent users (non-blocking processing)
    for (let i = 0; i < keyCount; i++) {
      const keyIndex = i === 0 ? '' : `_${i + 1}`
      const key = process.env[`GOOGLE_GEMINI_API_KEY${keyIndex}`]

      if (key && key.trim()) {
        this.apiKeys.push({
          key,
          usageToday: 0,
          lastUsed: 0,
          errors: 0,
          successRate: 1.0,
          resetTime: this.getNextMidnight() + (24 * 60 * 60 * 1000) // Next day reset
        })

        this.metrics.set(key, {
          key,
          totalRequests: 0,
          successfulRequests: 0,
          averageResponseTime: 5000,
          lastUsed: 0
        })

        console.log(`🔑 Loaded API key ${i + 1}: ${key.substring(0, 10)}...`)
      }
    }

    console.log(`📊 Initialized ${this.apiKeys.length} API keys`)
  }

  /**
   * Select best API key based on performance metrics and usage
   */
  selectBestKey(): string | never {
    if (this.apiKeys.length === 0) {
      throw new Error('Không có API key nào khả dụng')
    }

    // Filter out keys that have reached daily limits or high error rates
    const availableKeys = this.apiKeys.filter(keyInfo => {
      return keyInfo.errors < 10 && // Less than 10 errors
        keyInfo.successRate > 0.7 && // Success rate above 70%
        (Date.now() - keyInfo.lastUsed) > 1000 // Used more than 1 second ago
    })

    // Check if all keys are quota exceeded
    const quotaExceededKeys = this.apiKeys.filter(keyInfo => keyInfo.errors >= 999)
    console.log(`🔍 Key status check: ${quotaExceededKeys.length}/${this.apiKeys.length} keys quota exceeded`)

    if (quotaExceededKeys.length === this.apiKeys.length) {
      console.log(`🚨 All ${this.apiKeys.length} API keys have exceeded quota limits!`)
      throw new Error('Tất cả API keys đều đã hết quota')
    }

    // If no good keys available, check if we can use any non-quota-exceeded keys
    let keysToUse = availableKeys
    if (keysToUse.length === 0) {
      // Try to use keys that are not quota exceeded but might have other issues
      const nonQuotaExceededKeys = this.apiKeys.filter(keyInfo => keyInfo.errors < 999)
      if (nonQuotaExceededKeys.length > 0) {
        keysToUse = nonQuotaExceededKeys
        console.log(`⚠️ No perfect keys available, using ${nonQuotaExceededKeys.length} non-quota-exceeded keys`)
      } else {
        console.log(`🚨 No usable keys available - all keys are quota exceeded or heavily errored`)
        throw new Error('Tất cả API keys đều đã hết quota hoặc có lỗi nghiêm trọng')
      }
    }
    console.log(`🎯 Using ${keysToUse.length} keys for selection (${availableKeys.length} available, ${this.apiKeys.length} total)`)

    // Score keys based on multiple factors
    const scoredKeys = keysToUse.map(keyInfo => {
      const metrics = this.metrics.get(keyInfo.key)!
      const score = this.calculateKeyScore(keyInfo, metrics)
      return { ...keyInfo, score }
    })

    // Sort by score (highest first) and select best one
    scoredKeys.sort((a, b) => b.score - a.score)

    const selectedKey = scoredKeys[0].key
    this.updateKeyUsage(selectedKey)

    console.log(`🎯 Selected API key: ${selectedKey.substring(0, 10)}... (Score: ${scoredKeys[0].score.toFixed(3)})`)

    return selectedKey
  }

  private calculateKeyScore(keyInfo: APIKeyInfo, metrics: APIPerformanceMetrics): number {
    let score = 1.0

    // Success rate factor (most important)
    score *= keyInfo.successRate

    // Response time factor (faster is better)
    const responseTimeScore = Math.max(0.1, 1 - (metrics.averageResponseTime / 10000))
    score *= responseTimeScore

    // Usage freshness factor (least recently used gets boost)
    const timeSinceLastUse = Date.now() - keyInfo.lastUsed
    const freshnessScore = timeSinceLastUse > 60000 ? 1.2 : 1.0 // 1+ minute gives bonus
    score *= freshnessScore

    // Error rate penalty
    const errorPenalty = Math.max(0.3, 1 - (keyInfo.usageToday === 0 ? 0 : keyInfo.errors / keyInfo.usageToday))
    score *= errorPenalty

    return score
  }

  /**
   * Update key usage stats after successful request
   */
  updateKeySuccess(key: string, responseTime: number): void {
    const keyInfo = this.apiKeys.find(k => k.key === key)
    const metrics = this.metrics.get(key)

    if (keyInfo && metrics) {
      keyInfo.lastUsed = Date.now()
      keyInfo.usageToday++
      keyInfo.successRate = (keyInfo.usageToday + keyInfo.errors) > 0
        ? (keyInfo.usageToday) / (keyInfo.usageToday + keyInfo.errors)
        : 1.0

      metrics.totalRequests++
      metrics.successfulRequests++
      metrics.lastUsed = Date.now()

      // Update average response time (exponential moving average)
      const alpha = 0.1
      metrics.averageResponseTime = alpha * responseTime + (1 - alpha) * metrics.averageResponseTime
    }
  }

  /**
   * Update key stats after failed request
   */
  updateKeyError(key: string, error: string): void {
    const keyInfo = this.apiKeys.find(k => k.key === key)
    const metrics = this.metrics.get(key)

    if (keyInfo && metrics) {
      keyInfo.errors++
      keyInfo.lastUsed = Date.now()
      keyInfo.successRate = (keyInfo.usageToday + keyInfo.errors) > 0
        ? (keyInfo.usageToday) / (keyInfo.usageToday + keyInfo.errors)
        : 0

      metrics.totalRequests++
      metrics.lastUsed = Date.now()
      metrics.lastError = error

      // Reduce response time estimate for failed requests
      metrics.averageResponseTime *= 0.9

      // If it's a quota error, mark this key as temporarily unavailable
      if (error.includes('quota') || error.includes('429')) {
        console.log(`🚫 Marking API key ${key.substring(0, 10)}... as quota exceeded`)
        keyInfo.errors = 999 // Mark as heavily errored to avoid selection
      }
    }
  }

  private updateKeyUsage(key: string): void {
    const keyInfo = this.apiKeys.find(k => k.key === key)
    if (keyInfo) {
      keyInfo.lastUsed = Date.now()
    }
  }

  private getNextMidnight(): number {
    const now = new Date()
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0)
    return midnight.getTime()
  }

  private startMetricsCleanup(): void {
    // Reset daily usage at midnight
    setInterval(() => {
      const now = Date.now()
      let quotaResetCount = 0
      for (const keyInfo of this.apiKeys) {
        if (now >= keyInfo.resetTime) {
          const wasQuotaExceeded = keyInfo.errors >= 999
          keyInfo.usageToday = 0
          keyInfo.errors = 0
          keyInfo.successRate = 1.0
          keyInfo.resetTime = this.getNextMidnight()

          if (wasQuotaExceeded) {
            quotaResetCount++
          }
        }
      }

      if (quotaResetCount > 0) {
        console.log(`🔄 Reset quota for ${quotaResetCount} API keys (quota exceeded)`)
      }
      console.log('🔄 Reset hourly API key usage limits')
    }, 60 * 60 * 1000) // Check every hour
  }

  // Get all API keys
  getAllKeys(): string[] {
    return this.apiKeys.map(keyInfo => keyInfo.key)
  }

  // Select best key from a specific list of available keys
  selectBestKeyFromAvailable(availableKeys: string[]): string {
    if (availableKeys.length === 0) {
      throw new Error('No available keys provided')
    }

    // Get key info for available keys
    const availableKeyInfos = this.apiKeys.filter(keyInfo =>
      availableKeys.includes(keyInfo.key)
    )

    // Score keys based on multiple factors
    const scoredKeys = availableKeyInfos.map(keyInfo => {
      const metrics = this.metrics.get(keyInfo.key)!
      const score = this.calculateKeyScore(keyInfo, metrics)
      return { ...keyInfo, score }
    })

    // Sort by score (highest first) and select best one
    scoredKeys.sort((a, b) => b.score - a.score)

    const selectedKey = scoredKeys[0].key
    this.updateKeyUsage(selectedKey)

    console.log(`🎯 Selected API key from available: ${selectedKey.substring(0, 10)}... (Score: ${scoredKeys[0].score.toFixed(3)})`)

    return selectedKey
  }

  getStats(): {
    totalKeys: number
    availableKeys: number
    totalRequestsToday: number
    averageSuccessRate: number
    keysByPerformance: Array<{
      shortKey: string
      requests: number
      successRate: number
      avgResponseTime: number
    }>
  } {
    const totalRequestsToday = this.apiKeys.reduce((sum, key) => sum + key.usageToday, 0)
    const averageSuccessRate = this.apiKeys.length > 0
      ? this.apiKeys.reduce((sum, key) => sum + key.successRate, 0) / this.apiKeys.length
      : 0

    const keysByPoorformance = this.apiKeys.map(keyInfo => {
      const metrics = this.metrics.get(keyInfo.key)!
      return {
        shortKey: keyInfo.key.substring(0, 10) + '...',
        requests: metrics.totalRequests,
        successRate: Math.round(keyInfo.successRate * 100) / 100,
        avgResponseTime: Math.round(metrics.averageResponseTime)
      }
    }).sort((a, b) => b.successRate - a.successRate)

    return {
      totalKeys: this.apiKeys.length,
      availableKeys: this.apiKeys.filter(k => k.errors < 10 && k.successRate > 0.7).length,
      totalRequestsToday,
      averageSuccessRate: Math.round(averageSuccessRate * 100) / 100,
      keysByPerformance: keysByPoorformance
    }
  }
}

// Global instance
export type { APIKeyInfo, APIPerformanceMetrics }
export const aiLoadBalancer = new AILoadBalancer()
export default AILoadBalancer

