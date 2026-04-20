'use client'

import { AlertCircle, RefreshCw, AlertTriangle, Info, XCircle } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface ErrorMessageProps {
  title?: string
  message: string
  type?: 'error' | 'warning' | 'info'
  onRetry?: () => void
  retryText?: string
  className?: string
  showIcon?: boolean
}

const typeConfig = {
  error: {
    icon: AlertCircle,
    className: 'border-red-200 bg-red-50 text-red-800',
    iconClassName: 'text-red-500'
  },
  warning: {
    icon: AlertTriangle,
    className: 'border-yellow-200 bg-yellow-50 text-yellow-800',
    iconClassName: 'text-yellow-500'
  },
  info: {
    icon: Info,
    className: 'border-blue-200 bg-blue-50 text-blue-800',
    iconClassName: 'text-blue-500'
  }
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title,
  message,
  type = 'error',
  onRetry,
  retryText = 'Thử lại',
  className,
  showIcon = true
}) => {
  const config = typeConfig[type]
  const Icon = config.icon

  return (
    <div className={cn(
      'border rounded-lg p-4',
      config.className,
      className
    )}>
      <div className="flex items-start space-x-3">
        {showIcon && (
          <Icon className={cn('h-5 w-5 mt-0.5 flex-shrink-0', config.iconClassName)} />
        )}
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className="text-sm font-semibold mb-1">{title}</h3>
          )}
          <p className="text-sm">{message}</p>
          {onRetry && (
            <div className="mt-3">
              <Button
                onClick={onRetry}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                {retryText}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Inline error for forms
export const InlineError: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="flex items-center space-x-1 text-red-600 text-sm mt-1">
      <XCircle className="h-4 w-4" />
      <span>{message}</span>
    </div>
  )
}

// Page level error
export const PageError: React.FC<{
  title?: string
  message: string
  onRetry?: () => void
  onGoHome?: () => void
}> = ({ 
  title = 'Có lỗi xảy ra', 
  message, 
  onRetry,
  onGoHome
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {title}
          </h1>
          
          <p className="text-gray-600 mb-6">
            {message}
          </p>

          <div className="space-y-3">
            {onRetry && (
              <Button onClick={onRetry} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Thử lại
              </Button>
            )}
            
            {onGoHome && (
              <Button onClick={onGoHome} variant="outline" className="w-full">
                Về trang chủ
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ErrorMessage 