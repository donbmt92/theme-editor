import { GoogleGenerativeAI } from '@google/generative-ai'
import { aiLoadBalancer } from './ai-load-balancer'

export interface AIRequestResult {
  success: boolean
  result?: any
  response?: any
  text?: string
  responseTime: number
  error?: string
}

export async function executeAIRequestWithRetry(prompt: string, initialApiKey?: string): Promise<AIRequestResult> {
  const startTime = Date.now()
  let attemptCount = 0
  let currentApiKey = initialApiKey || aiLoadBalancer.selectBestKey()
  const usedKeys = new Set<string>() // Track keys đã thử

  while (true) {
    attemptCount++
    try {
      console.log(`🔄 Executing AI request (attempt ${attemptCount}) with API key: ${currentApiKey.substring(0, 10)}...`)

      const genAI = new GoogleGenerativeAI(currentApiKey)
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash-lite-preview-09-2025',
        generationConfig: {
          maxOutputTokens: 32768, // Tăng lên 32K tokens để đảm bảo đủ chỗ cho response dài
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

      // Update success metrics
      aiLoadBalancer.updateKeySuccess(currentApiKey, responseTime)

      return {
        success: true,
        result,
        response,
        text,
        responseTime
      }
    } catch (aiError: unknown) {
      console.error(`❌ AI request error (attempt ${attemptCount}):`, aiError)

      const error = aiError as { status?: number; message?: string }

      // Update error metrics
      aiLoadBalancer.updateKeyError(currentApiKey, error?.message || 'Unknown error')

      // Mark this key as used
      usedKeys.add(currentApiKey)

      // If it's a quota error (429), try next available key
      if (error?.status === 429 || error?.message?.includes('quota')) {
        console.log(`🚫 API key ${currentApiKey.substring(0, 10)}... hit quota limit, trying next key...`)
        try {
          // Get all available keys that haven't been used
          const allKeys = aiLoadBalancer.getAllKeys()
          const availableKeys = allKeys.filter(key => !usedKeys.has(key))

          if (availableKeys.length === 0) {
            console.log('🚨 All API keys have been tried and exceeded quota limits!')
            return {
              success: false,
              error: 'QUOTA_EXCEEDED',
              responseTime: Date.now() - startTime
            }
          }

          // Select next best key from available ones
          currentApiKey = aiLoadBalancer.selectBestKeyFromAvailable(availableKeys)
          console.log(`🔄 Switching to API key: ${currentApiKey.substring(0, 10)}...`)
          continue // Try again with new key
        } catch (keyError) {
          console.error('❌ No more API keys available:', keyError)
          return {
            success: false,
            error: 'QUOTA_EXCEEDED',
            responseTime: Date.now() - startTime
          }
        }
      }

      // For non-quota errors, check if we should retry
      if (attemptCount >= 10) { // Max 10 attempts for non-quota errors
        console.log(`🚨 Max attempts (${attemptCount}) reached for non-quota errors`)
        if (error?.status === 503 || error?.message?.includes('overloaded') || error?.message?.includes('Service Unavailable')) {
          return {
            success: false,
            error: 'AI_SERVICE_UNAVAILABLE',
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
      const waitTime = Math.pow(2, Math.min(attemptCount, 5)) * 1000
      console.log(`⏰ Waiting ${waitTime}ms before retry...`)
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
  }
}
