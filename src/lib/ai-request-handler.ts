import { GoogleGenerativeAI } from '@google/generative-ai'

export interface AIRequestResult {
  success: boolean
  result?: any
  response?: any
  text?: string
  responseTime: number
  error?: string
}

export async function executeAIRequestWithRetry(prompt: string, apiKey: string): Promise<AIRequestResult> {
  const startTime = Date.now()
  let retryCount = 0
  const maxRetries = 3

  while (retryCount < maxRetries) {
    try {
      console.log(`🔄 Executing AI request (attempt ${retryCount + 1}/${maxRetries}) with API key: ${apiKey.substring(0, 10)}...`)
      
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        generationConfig: {
          maxOutputTokens: 8192,
          temperature: 0.7,
          topP: 0.9,
          topK: 40
        }
      })
      
      // Add timeout wrapper for the API call
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout after 120 seconds')), 120000)
      })
      
      const apiCallPromise = model.generateContent(prompt)
      
      const result = await Promise.race([apiCallPromise, timeoutPromise]) as any
      const response = await result.response
      const text = response.text()

      const responseTime = Date.now() - startTime
      console.log(`✅ AI request completed in ${responseTime}ms`)
      
      return {
        success: true,
        result,
        response,
        text,
        responseTime
      }
    } catch (aiError: unknown) {
      retryCount++
      console.error(`❌ AI request error (attempt ${retryCount}):`, aiError)
      
      if (retryCount >= maxRetries) {
        const error = aiError as { status?: number; message?: string }
        
        // Determine error type and return appropriate result
        if (error?.status === 503 || error?.message?.includes('overloaded') || error?.message?.includes('Service Unavailable')) {
          return {
            success: false,
            error: 'AI_SERVICE_UNAVAILABLE',
            responseTime: Date.now() - startTime
          }
        } else if (error?.status === 429 || error?.message?.includes('quota')) {
          return {
            success: false,
            error: 'QUOTA_EXCEEDED',
            responseTime: Date.now() - startTime
          }
        } else {
          return {
            success: false,
            error: error?.message || 'AI_REQUEST_FAILED',
            responseTime: Date.now() - startTime
          }
        }
      }
      
      // Wait before retry (exponential backoff)
      const waitTime = Math.pow(2, retryCount) * 1000
      console.log(`⏰ Waiting ${waitTime}ms before retry...`)
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
  }

  return {
    success: false,
    error: 'MAX_RETRIES_EXCEEDED',
    responseTime: Date.now() - startTime
  }
}
