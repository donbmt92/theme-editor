import { useState } from 'react'

interface UseFileUploadOptions {
  onSuccess?: (url: string) => void
  onError?: (error: string) => void
}

interface UseFileUploadState {
  isUploading: boolean
  error: string | null
  upload: (file: File) => Promise<string | null>
}

export function useFileUpload(options: UseFileUploadOptions = {}): UseFileUploadState {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const upload = async (file: File): Promise<string | null> => {
    setIsUploading(true)
    setError(null)

    try {
      // Basic client-side check for size (20MB)
      if (file.size > 20 * 1024 * 1024) {
        throw new Error('File size should be less than 20MB')
      }

      // Allow PDFs and images; server will validate exact types
      const allowedPrefixes = ['application/pdf', 'image/']
      if (!allowedPrefixes.some((prefix) => file.type === prefix || file.type.startsWith(prefix))) {
        throw new Error('Only PDF or image files are allowed')
      }

      const formData = new FormData()
      formData.append('file', file)

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
        const url = data.url as string
        options.onSuccess?.(url)
        return url
      }
      throw new Error(data.error || 'Upload failed')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed'
      setError(message)
      options.onError?.(message)
      return null
    } finally {
      setIsUploading(false)
    }
  }

  return { isUploading, error, upload }
}