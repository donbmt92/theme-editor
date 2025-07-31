// Centralized error handling utilities

export interface AppError {
  message: string
  code?: string
  status?: number
  details?: unknown
  timestamp: Date
  type: 'validation' | 'authentication' | 'authorization' | 'database' | 'network' | 'api' | 'unknown'
}

export class CustomError extends Error {
  public code?: string
  public status?: number
  public type: AppError['type']
  public details?: unknown

  constructor(
    message: string,
    type: AppError['type'] = 'unknown',
    status?: number,
    code?: string,
    details?: unknown
  ) {
    super(message)
    this.name = 'CustomError'
    this.type = type
    this.status = status
    this.code = code
    this.details = details
  }
}

// Error type detection
export const getErrorType = (error: unknown): AppError['type'] => {
  if (error instanceof CustomError) {
    return error.type
  }

  const errorMessage = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase()

  if (errorMessage.includes('unauthorized') || errorMessage.includes('authentication')) {
    return 'authentication'
  }
  if (errorMessage.includes('forbidden') || errorMessage.includes('permission')) {
    return 'authorization'
  }
  if (errorMessage.includes('validation') || errorMessage.includes('required') || errorMessage.includes('invalid')) {
    return 'validation'
  }
  if (errorMessage.includes('database') || errorMessage.includes('prisma') || errorMessage.includes('connection')) {
    return 'database'
  }
  if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('timeout')) {
    return 'network'
  }
  if (errorMessage.includes('api') || errorMessage.includes('service')) {
    return 'api'
  }

  return 'unknown'
}

// Create standardized error response
export const createErrorResponse = (
  error: unknown,
  defaultMessage: string = 'Có lỗi xảy ra'
): AppError => {
  const type = getErrorType(error)
  const timestamp = new Date()

  if (error instanceof CustomError) {
    return {
      message: error.message,
      code: error.code,
      status: error.status,
      details: process.env.NODE_ENV === 'development' ? error.details : undefined,
      timestamp,
      type: error.type
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message || defaultMessage,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp,
      type
    }
  }

  return {
    message: defaultMessage,
    details: process.env.NODE_ENV === 'development' ? error : undefined,
    timestamp,
    type
  }
}

// Get user-friendly error message
export const getUserFriendlyMessage = (error: unknown): string => {
  const type = getErrorType(error)

  switch (type) {
    case 'authentication':
      return 'Bạn cần đăng nhập để thực hiện thao tác này.'
    case 'authorization':
      return 'Bạn không có quyền thực hiện thao tác này.'
    case 'validation':
      return 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.'
    case 'database':
      return 'Có lỗi kết nối cơ sở dữ liệu. Vui lòng thử lại sau.'
    case 'network':
      return 'Có lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.'
    case 'api':
      return 'Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.'
    default:
      if (error instanceof Error) {
        return error.message
      }
      return 'Có lỗi không xác định xảy ra. Vui lòng thử lại.'
  }
}

// Log error with context
export const logError = (
  error: unknown,
  context?: string,
  additionalInfo?: Record<string, unknown>
) => {
  const errorInfo = createErrorResponse(error)
  
  console.error(`[ERROR${context ? ` - ${context}` : ''}]:`, {
    message: errorInfo.message,
    type: errorInfo.type,
    timestamp: errorInfo.timestamp,
    ...additionalInfo,
    ...(process.env.NODE_ENV === 'development' && { details: errorInfo.details })
  })

  // In production, you might want to send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Example: sendToErrorTracking(errorInfo, context, additionalInfo)
  }
}

// Database error helpers
export const isDatabaseError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return error.message.includes('Prisma') || 
           error.message.includes('database') ||
           error.message.includes('connection')
  }
  return false
}

export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return error.name === 'TypeError' && error.message.includes('fetch') ||
           error.name === 'AbortError' ||
           error.message.includes('timeout') ||
           error.message.includes('network')
  }
  return false
}

export const isValidationError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return error.message.includes('validation') ||
           error.message.includes('required') ||
           error.message.includes('invalid')
  }
  return false
}

// Retry logic with exponential backoff
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> => {
  let lastError: unknown

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      
      if (attempt === maxRetries) {
        throw error
      }

      // Don't retry on certain error types
      if (getErrorType(error) === 'validation' || getErrorType(error) === 'authorization') {
        throw error
      }

      const delay = initialDelay * Math.pow(2, attempt - 1)
      console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError
}

// Timeout wrapper
export const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMs: number = 10000,
  timeoutMessage: string = 'Operation timed out'
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => 
      setTimeout(() => reject(new CustomError(timeoutMessage, 'network')), timeoutMs)
    )
  ])
} 