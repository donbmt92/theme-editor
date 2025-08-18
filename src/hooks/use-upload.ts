import { useState } from 'react'

interface UseUploadOptions {
  onSuccess?: (url: string) => void
  onError?: (error: string) => void
}

interface UseUploadState {
  isUploading: boolean
  error: string | null
  upload: (file: File) => Promise<string | null>
}

export function useUpload(options: UseUploadOptions = {}): UseUploadState {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const upload = async (file: File): Promise<string | null> => {
    setIsUploading(true)
    setError(null)

    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file')
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size should be less than 5MB')
      }

      // Create form data
      const formData = new FormData()
      formData.append('file', file)

      // Upload to server
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await response.json()
      
      if (data.success) {
        const url = data.url
        options.onSuccess?.(url)
        return url
      } else {
        throw new Error(data.error || 'Upload failed')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed'
      setError(errorMessage)
      options.onError?.(errorMessage)
      return null
    } finally {
      setIsUploading(false)
    }
  }

  return {
    isUploading,
    error,
    upload
  }
} 