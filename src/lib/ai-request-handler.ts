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

function isRetryableWithNextKey(error: { status?: number; message?: string }): boolean {
  const message = error?.message || ''

  return error?.status === 401 ||
    error?.status === 403 ||
    error?.status === 429 ||
    message.includes('quota') ||
    message.includes('API key not valid') ||
    message.includes('PERMISSION_DENIED') ||
    message.includes('CONSUMER_SUSPENDED') ||
    message.includes('has been suspended')
}

function getKeyFailureCode(error: { status?: number; message?: string }): string {
  const message = error?.message || ''

  if (error?.status === 429 || message.includes('quota')) {
    return 'QUOTA_EXCEEDED'
  }

  if (error?.status === 401 || error?.status === 403 || message.includes('PERMISSION_DENIED') || message.includes('CONSUMER_SUSPENDED')) {
    return 'API_KEY_UNAVAILABLE'
  }

  return 'AI_REQUEST_FAILED'
}

export async function executeAIRequestWithRetry(prompt: string, initialApiKey?: string): Promise<AIRequestResult> {
  const startTime = Date.now()
  let attemptCount = 0
  let currentApiKey = initialApiKey || aiLoadBalancer.selectBestKey()
  const usedKeys = new Set<string>()

  while (true) {
    attemptCount++
    try {
      console.log(`Executing AI request (attempt ${attemptCount}) with API key: ${currentApiKey.substring(0, 10)}...`)

      const genAI = new GoogleGenerativeAI(currentApiKey)
      const model = genAI.getGenerativeModel({
        model: 'gemini-3.1-flash-lite',
        generationConfig: {
          maxOutputTokens: 32768
        }
      })

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout after 120 seconds')), 120000)
      })

      const apiCallPromise = model.generateContent(prompt)
      const result = await Promise.race([apiCallPromise, timeoutPromise]) as any
      const response = await result.response
      const text = response.text()

      const responseTime = Date.now() - startTime
      console.log(`AI request completed in ${responseTime}ms`)

      aiLoadBalancer.updateKeySuccess(currentApiKey, responseTime)

      return {
        success: true,
        result,
        response,
        text,
        responseTime
      }
    } catch (aiError: unknown) {
      console.error(`AI request error (attempt ${attemptCount}):`, aiError)

      const error = aiError as { status?: number; message?: string }
      aiLoadBalancer.updateKeyError(currentApiKey, error?.message || 'Unknown error')
      usedKeys.add(currentApiKey)

      if (isRetryableWithNextKey(error)) {
        const failureCode = getKeyFailureCode(error)
        console.log(`API key ${currentApiKey.substring(0, 10)}... unavailable (${failureCode}), trying next key...`)

        try {
          const allKeys = aiLoadBalancer.getAllKeys()
          const availableKeys = allKeys.filter(key => !usedKeys.has(key))

          if (availableKeys.length === 0) {
            console.log('All API keys have been tried and are unavailable')
            return {
              success: false,
              error: failureCode,
              responseTime: Date.now() - startTime
            }
          }

          currentApiKey = aiLoadBalancer.selectBestKeyFromAvailable(availableKeys)
          console.log(`Switching to API key: ${currentApiKey.substring(0, 10)}...`)
          continue
        } catch (keyError) {
          console.error('No more API keys available:', keyError)
          return {
            success: false,
            error: failureCode,
            responseTime: Date.now() - startTime
          }
        }
      }

      if (attemptCount >= 10) {
        console.log(`Max attempts (${attemptCount}) reached for non-key errors`)
        if (error?.status === 503 || error?.message?.includes('overloaded') || error?.message?.includes('Service Unavailable')) {
          return {
            success: false,
            error: 'AI_SERVICE_UNAVAILABLE',
            responseTime: Date.now() - startTime
          }
        }

        return {
          success: false,
          error: error?.message || 'AI_REQUEST_FAILED',
          responseTime: Date.now() - startTime
        }
      }

      const waitTime = Math.pow(2, Math.min(attemptCount, 5)) * 1000
      console.log(`Waiting ${waitTime}ms before retry...`)
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
  }
}
