import { useState, useEffect } from 'react'

interface UseUnsplashImageOptions {
  query?: string
  fallbackImage?: string
  skipFetch?: boolean
}

interface UnsplashImageState {
  imageUrl: string | null
  isLoading: boolean
  error: string | null
}

export function useUnsplashImage(
  providedImage: string | undefined,
  options: UseUnsplashImageOptions = {}
): UnsplashImageState {
  const { query = 'coffee business', fallbackImage, skipFetch = false } = options
  
  const [imageUrl, setImageUrl] = useState<string | null>(providedImage || null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // If image is provided or should skip fetch, don't fetch from Unsplash
    if (providedImage || skipFetch) {
      setImageUrl(providedImage || fallbackImage || null)
      setIsLoading(false)
      return
    }

    // Fetch from Unsplash
    const fetchUnsplashImage = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await fetch('/api/unsplash/random', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query })
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.photo) {
            setImageUrl(data.photo.urls.regular)
          } else {
            setImageUrl(fallbackImage || null)
            setError(data.error || 'No image data received')
          }
        } else {
          setImageUrl(fallbackImage || null)
          
          // Handle specific HTTP status codes
          if (response.status === 429) {
            setError('Rate limit exceeded. Please try again later.')
          } else if (response.status === 503) {
            setError('Unsplash service temporarily unavailable.')
          } else if (response.status === 401) {
            setError('Unsplash API authentication failed.')
          } else {
            setError(`Failed to fetch image (HTTP ${response.status})`)
          }
        }
      } catch (err: any) {
        console.error('Error fetching Unsplash image:', err)
        setImageUrl(fallbackImage || null)
        
        // Provide specific error messages
        if (err.name === 'TypeError' && err.message.includes('fetch')) {
          setError('Network connection failed')
        } else if (err.name === 'AbortError') {
          setError('Request was cancelled')
        } else if (err.message?.includes('timeout')) {
          setError('Request timed out')
        } else {
          setError('Failed to load image')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchUnsplashImage()
  }, [providedImage, query, fallbackImage, skipFetch])

  return {
    imageUrl,
    isLoading,
    error
  }
}

// Hook specifically for product images
export function useProductImage(productImage?: string, productName?: string) {
  const query = productName ? `${productName} coffee` : 'coffee product'
  return useUnsplashImage(productImage, { query })
}

// Hook specifically for hero background images
export function useHeroImage(heroImage?: string, businessType: string = 'coffee shop') {
  const query = `${businessType} interior`
  return useUnsplashImage(heroImage, { query })
}

// Hook for logo/brand images
export function useLogoImage(logoImage?: string, brandName?: string) {
  // For logos, we usually don't want to fetch from Unsplash as they should be specific
  // But we can provide this hook for consistency
  return useUnsplashImage(logoImage, { skipFetch: true })
} 