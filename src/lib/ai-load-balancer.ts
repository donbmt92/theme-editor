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

    // If no good keys available, use fallback selection
    const keysToUse = availableKeys.length > 0 ? availableKeys : this.apiKeys

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
      for (const keyInfo of this.apiKeys) {
        if (now >= keyInfo.resetTime) {
          keyInfo.usageToday = 0
          keyInfo.errors = 0
          keyInfo.resetTime = this.getNextMidnight()
        }
      }
      console.log('🔄 Reset daily API key usage limits')
    }, 60 * 1000) // Check every minute
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
