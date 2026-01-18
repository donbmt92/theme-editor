import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, checkTieredRateLimit } from '@/lib/rate-limiter'
import { getCachedResponse, setBusinessCachedResponse, generateCacheKey, getCacheStats } from '@/lib/ai-cache'
import { aiGenerationQueue, calculatePriority, getQueueStats, isQueueHealthy } from '@/lib/request-queue'
import { aiLoadBalancer } from '@/lib/ai-load-balancer'
import { generateThemeContent, prepareThemeParams } from '@/lib/generate-theme-core'

// Non-blocking async processing for maximum concurrency
export const maxDuration = 120 // 2 minutes (optimized for parallel processing)

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Enhanced rate limiting for high-volume traffic
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const identifier = `${clientIP}:${userAgent}` // More specific identification

    // Check queue health first
    const queueStats = getQueueStats()
    if (!isQueueHealthy()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Hệ thống đang bận với khối lượng truy cập cao. Vui lòng thử lại sau.',
          errorType: 'QUEUE_OVERLOADED',
          retryAfter: 300,
          queueStats: {
            activeTasks: queueStats.activeTasks,
            queuedTasks: queueStats.queuedTasks
          }
        },
        { status: 503 }
      )
    }

    // Tiered rate limiting - get user tier from session/database
    let userTier: 'FREE' | 'STANDARD' | 'PRO' = 'FREE'

    // TODO: Get user from session when auth is implemented
    // For now, try to get from request or default to FREE
    try {
      const body = await request.clone().json()
      const userEmail = body.userEmail // Optional: client can pass email

      if (userEmail) {
        const user = await (await import('@/lib/prisma')).prisma.user.findUnique({
          where: { email: userEmail },
          select: { tier: true }
        })
        userTier = user?.tier || 'FREE'
      }
    } catch {
      // No user info, default to FREE tier
      userTier = 'FREE'
    }

    const rateLimit = checkTieredRateLimit(identifier, userTier)

    if (!rateLimit.allowed) {
      const resetTime = new Date(rateLimit.resetTime).toISOString()
      return NextResponse.json(
        {
          success: false,
          error: 'Bạn đã vượt quá giới hạn yêu cầu. Vui lòng thử lại sau.',
          errorType: 'RATE_LIMIT_EXCEEDED',
          resetTime,
          retryAfter: rateLimit.retryAfter,
          tier: userTier
        },
        {
          status: 429,
          headers: {
            'Retry-After': rateLimit.retryAfter?.toString() || '60',
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': Math.ceil(rateLimit.resetTime / 1000).toString(),
            'X-Queue-Status': isQueueHealthy() ? 'healthy' : 'overloaded'
          }
        }
      )
    }

    const { businessInfo, currentTheme } = await request.json()

    // Enhanced cache checking
    const cacheKey = generateCacheKey(businessInfo)
    const cachedResponse = getCachedResponse(cacheKey)
    if (cachedResponse) {
      console.log('🚀 Returning cached AI response')

      // Add performance metrics to cached response
      const cachedWithMetrics = {
        ...cachedResponse,
        cacheHit: true,
        responseTime: Date.now() - startTime,
        servedAt: new Date().toISOString(),
        queueStats: getQueueStats()
      }

      return NextResponse.json(cachedWithMetrics)
    }

    // Validate required fields
    if (!businessInfo?.companyName || !businessInfo?.industry || !businessInfo?.description) {
      return NextResponse.json(
        { success: false, error: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      )
    }

    // Queue the AI generation task
    const taskId = `generate-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const priority = calculatePriority(businessInfo)

    console.log(`📋 Queuing AI generation task: ${taskId} (Priority: ${priority.toFixed(3)})`)

    // Non-blocking async enqueue for maximum parallelism
    console.log(`🚀 Enqueueing task ${taskId} for async processing...`)

    const taskResult = await aiGenerationQueue.enqueue(
      taskId,
      async () => {
        try {
          console.log(`🔄 [ASYNC] Starting non-blocking AI generation for task: ${taskId}`)

          // Async theme generation (doesn't block other requests)
          console.log(`⚡ [NON-BLOCKING] Generating theme content in parallel...`)
          const result = await Promise.race([
            generateThemeContent(businessInfo),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Generation timeout')), 120000)
            )
          ]) as {
            generatedData: any
            rawText: string
            responseTime: number
          }
          console.log(`✅ [ASYNC] Theme content generated successfully`)

          // Async parameter preparation
          console.log(`⚙️  [PARALLEL] Preparing theme parameters async...`)
          const themeParams = prepareThemeParams(result.generatedData, currentTheme)
          console.log(`✅ [ASYNC] Theme parameters prepared successfully`)

          return {
            themeParams,
            generatedData: result.generatedData,
            responseTime: result.responseTime,
            processedAsync: true
          }
        } catch (error) {
          console.error(`❌ [ASYNC ERROR] Error in task ${taskId}:`, error)
          throw error
        }
      },
      priority
    )

    if (!taskResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: taskResult.error,
          errorType: 'TASK_FAILED',
          taskId
        },
        { status: 500 }
      )
    }

    // Process successful task result
    const { themeParams, generatedData, responseTime } = taskResult.data

    // Enhanced caching with business context - increased TTL for high volume traffic
    setBusinessCachedResponse(businessInfo, taskResult.data, 30 * 60 * 1000) // 30 minutes TTL for better cache hit rate

    const response = {
      success: true,
      themeParams,
      generatedData,
      taskId,
      cached: false,
      queueStats: getQueueStats(),
      performance: {
        totalTime: Date.now() - startTime,
        priority,
        cacheStats: getCacheStats(),
        loadBalancerStats: aiLoadBalancer.getStats()
      }
    }

    console.log(`✅ Task ${taskId} completed successfully in ${response.performance.totalTime}ms`)

    return NextResponse.json(response)

  } catch (error) {
    console.error('Theme generation error:', error)

    let errorMessage = 'Có lỗi xảy ra khi tạo nội dung'
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = 'Lỗi xác thực API. Vui lòng kiểm tra cấu hình.'
      } else if (error.message.includes('quota') || error.message.includes('limit')) {
        errorMessage = 'Đã vượt quá giới hạn API. Vui lòng thử lại sau.'
      } else {
        errorMessage = error.message
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        errorType: 'GENERATION_ERROR',
        responseTime: Date.now() - startTime,
        queueStats: getQueueStats()
      },
      { status: 500 }
    )
  }
}

// GET endpoint for queue and system monitoring
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const action = url.searchParams.get('action')

  switch (action) {
    case 'stats':
      return NextResponse.json({
        success: true,
        stats: {
          queue: getQueueStats(),
          cache: getCacheStats(),
          loadBalancer: aiLoadBalancer.getStats(),
          timestamp: new Date().toISOString()
        }
      })

    case 'health':
      return NextResponse.json({
        success: true,
        healthy: isQueueHealthy(),
        queueStats: getQueueStats(),
        timestamp: new Date().toISOString()
      })

    case 'debug':
      return NextResponse.json({
        success: true,
        debug: {
          apiKeys: {
            total: aiLoadBalancer.getStats().totalKeys,
            available: aiLoadBalancer.getStats().availableKeys,
            stats: aiLoadBalancer.getStats()
          },
          cache: getCacheStats(),
          queue: getQueueStats(),
          queueHealthy: isQueueHealthy(),
          timestamp: new Date().toISOString()
        }
      })

    default:
      return NextResponse.json({
        success: true,
        message: 'AI Generate Theme API',
        endpoints: {
          'POST /': 'Generate theme content',
          'GET ?action=stats': 'Get system statistics',
          'GET ?action=health': 'Check system health',
          'GET ?action=debug': 'Debug system information'
        },
        timestamp: new Date().toISOString()
      })
  }
}
