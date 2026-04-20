import { NextRequest } from 'next/server'
import { generateCacheKey, getCachedResponse } from '@/lib/ai-cache'
import { aiGenerationQueue, calculatePriority, getQueueStats } from '@/lib/request-queue'
import { generateThemeContent, prepareThemeParams } from '@/lib/generate-theme-core'

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder()
  
  // Create a custom stream for real-time updates
  const stream = new ReadableStream({
    async start(controller) {
      const startTime = Date.now()
      
      try {
        // Send initial status
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
          status: 'started',
          message: 'Đang khởi tạo...',
          timestamp: new Date().toISOString()
        })}\n\n`))

        const { businessInfo, currentTheme } = await request.json()
        
        // Check cache first
        const cacheKey = generateCacheKey(businessInfo)
        const cachedResponse = getCachedResponse(cacheKey)
        if (cachedResponse) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
            status: 'cached',
            message: 'Trả về kết quả từ cache',
            data: cachedResponse,
            processingTime: Date.now() - startTime
          })}\n\n`))
          controller.close()
          return
        }

        // Update: Queue health check
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
          status: 'queued',
          message: 'Đang xếp hàng xử lý...',
          queueStats: getQueueStats()
        })}\n\n`))

        // Non-blocking async processing
        const taskId = `stream-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const priority = calculatePriority(businessInfo)
        
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
          status: 'processing',
          message: 'Đang xử lý AI generation...',
          taskId,
          priority: priority.toFixed(3),
          timestamp: new Date().toISOString()
        })}\n\n`))

        const taskResult = await aiGenerationQueue.enqueue(
          taskId,
          async () => {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({
              status: 'ai_selected',
              message: 'Đã chọn API key, đang gọi Gemini...',
              timestamp: new Date().toISOString()
            })}\n\n`))

            // Stream the AI generation progress
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({
              status: 'ai_generating',
              message: 'AI đang tạo nội dung theme...',
              timestamp: new Date().toISOString()
            })}\n\n`))

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

            controller.enqueue(encoder.encode(`data: ${JSON.stringify({
              status: 'ai_completed',
              message: 'AI đã hoàn thành, đang chuẩn bị kết quả...',
              processingTime: result.responseTime,
              timestamp: new Date().toISOString()
            })}\n\n`))

            // Prepare final result
            const themeParams = prepareThemeParams(result.generatedData, currentTheme)
            
            return {
              themeParams,
              generatedData: result.generatedData,
              responseTime: result.responseTime
            }
          },
          priority
        )

        if (taskResult.success) {
          // Send final result
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
            status: 'completed',
            message: 'Hoàn thành thành công!',
            data: taskResult.data,
            totalTime: Date.now() - startTime,
            queueStats: getQueueStats(),
            timestamp: new Date().toISOString()
          })}\n\n`))
        } else {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
            status: 'error',
            message: taskResult.error || 'Có lỗi xảy ra',
            timestamp: new Date().toISOString()
          })}\n\n`))
        }

      } catch (error) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        })}\n\n`))
      } finally {
        controller.close()
      }
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}
