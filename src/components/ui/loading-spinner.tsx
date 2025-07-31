'use client'

import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  text?: string
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6', 
  lg: 'h-8 w-8',
  xl: 'h-12 w-12'
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className,
  text 
}) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
          sizeClasses[size],
          className
        )}
      />
      {text && (
        <p className="text-sm text-gray-600 animate-pulse">{text}</p>
      )}
    </div>
  )
}

// Page level loading component
export const PageLoader: React.FC<{ text?: string }> = ({ text = 'Đang tải...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoadingSpinner size="xl" text={text} />
    </div>
  )
}

// Inline loading component
export const InlineLoader: React.FC<{ text?: string }> = ({ text = 'Đang tải...' }) => {
  return (
    <div className="flex items-center justify-center py-8">
      <LoadingSpinner size="lg" text={text} />
    </div>
  )
}

// Button loading state
export const ButtonSpinner: React.FC = () => {
  return (
    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-white" />
  )
}

export default LoadingSpinner 