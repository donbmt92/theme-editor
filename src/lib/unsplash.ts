import { createApi } from 'unsplash-js'

// Create Unsplash API instance
const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY || '',
})

// Cache for storing fetched images to avoid repeated API calls
const imageCache = new Map<string, string>()

export interface UnsplashPhoto {
  id: string
  urls: {
    raw: string
    full: string
    regular: string
    small: string
    thumb: string
  }
  alt_description: string | null
  user: {
    name: string
    username: string
  }
  links: {
    download_location: string
  }
}

/**
 * Get a random photo from Unsplash based on query
 */
export async function getRandomPhoto(query?: string): Promise<UnsplashPhoto | null> {
  try {
    // Check if API key is configured
    if (!process.env.UNSPLASH_ACCESS_KEY) {
      console.warn('Unsplash API key not configured')
      return null
    }

    const result = await unsplash.photos.getRandom({
      query: query || 'coffee business',
      orientation: 'landscape',
      count: 1,
    })

    if (result.errors) {
      console.error('Unsplash API error:', result.errors)
      
      // Handle specific error types
      if (result.errors.some(error => error.includes('rate limit'))) {
        console.warn('Unsplash rate limit exceeded')
      } else if (result.errors.some(error => error.includes('unauthorized'))) {
        console.error('Unsplash API unauthorized - check access key')
      }
      
      return null
    }

    const photo = Array.isArray(result.response) ? result.response[0] : result.response
    return photo as UnsplashPhoto
  } catch (error: any) {
    console.error('Error fetching random photo:', error)
    
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.error('Network error when fetching from Unsplash')
    } else if (error.status === 403) {
      console.error('Unsplash API access forbidden - check permissions')
    } else if (error.status === 429) {
      console.error('Unsplash rate limit exceeded')
    }
    
    return null
  }
}

/**
 * Search photos on Unsplash
 */
export async function searchPhotos(query: string, perPage: number = 10): Promise<UnsplashPhoto[]> {
  try {
    // Check if API key is configured
    if (!process.env.UNSPLASH_ACCESS_KEY) {
      console.warn('Unsplash API key not configured')
      return []
    }

    const result = await unsplash.search.getPhotos({
      query,
      page: 1,
      perPage,
      orientation: 'landscape',
    })

    if (result.errors) {
      console.error('Unsplash search API error:', result.errors)
      return []
    }

    return result.response?.results as UnsplashPhoto[] || []
  } catch (error: any) {
    console.error('Error searching photos:', error)
    
    // Handle specific error types
    if (error.status === 429) {
      console.error('Unsplash search rate limit exceeded')
    } else if (error.status === 403) {
      console.error('Unsplash search access forbidden')
    }
    
    return []
  }
}

/**
 * Get theme-specific photo with caching
 */
export async function getThemePhoto(themeName: string): Promise<string | null> {
  // Check cache first
  if (imageCache.has(themeName)) {
    return imageCache.get(themeName)!
  }

  let query = 'business website'
  
  // Map theme names to relevant search queries
  const themeQueries: Record<string, string> = {
    'vietnam-coffee': 'coffee shop vietnam',
    'restaurant': 'restaurant food',
    'business': 'modern business',
    'portfolio': 'creative portfolio',
    'ecommerce': 'online store shopping',
    'blog': 'blog writing content',
    'agency': 'digital agency office',
    'landing': 'startup business',
  }

  // Try to match theme name with predefined queries
  const lowerThemeName = themeName.toLowerCase()
  for (const [key, value] of Object.entries(themeQueries)) {
    if (lowerThemeName.includes(key)) {
      query = value
      break
    }
  }

  const photo = await getRandomPhoto(query)
  if (photo) {
    const imageUrl = photo.urls.regular
    imageCache.set(themeName, imageUrl)
    return imageUrl
  }

  return null
}

/**
 * Track download (required by Unsplash API guidelines)
 */
export async function trackDownload(downloadLocation: string): Promise<void> {
  try {
    await unsplash.photos.trackDownload({
      downloadLocation,
    })
  } catch (error) {
    console.error('Error tracking download:', error)
  }
}

/**
 * Get multiple photos for a theme gallery
 */
export async function getThemeGallery(themeName: string, count: number = 6): Promise<UnsplashPhoto[]> {
  let query = 'business website'
  
  // Map theme names to relevant search queries
  const themeQueries: Record<string, string> = {
    'vietnam-coffee': 'coffee shop',
    'restaurant': 'restaurant',
    'business': 'business',
    'portfolio': 'creative',
    'ecommerce': 'shopping',
    'blog': 'content',
    'agency': 'office',
    'landing': 'startup',
  }

  const lowerThemeName = themeName.toLowerCase()
  for (const [key, value] of Object.entries(themeQueries)) {
    if (lowerThemeName.includes(key)) {
      query = value
      break
    }
  }

  return await searchPhotos(query, count)
} 