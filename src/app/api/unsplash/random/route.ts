import { NextRequest, NextResponse } from 'next/server'
import { getRandomPhoto, searchPhotos } from '@/lib/unsplash'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || undefined
    const count = parseInt(searchParams.get('count') || '1')
    
    if (count > 1) {
      // If requesting multiple photos, use search instead
      const photos = await searchPhotos(query || 'business', count)
      return NextResponse.json({ 
        success: true, 
        photos 
      })
    } else {
      // Single random photo
      const photo = await getRandomPhoto(query)
      
      if (photo) {
        return NextResponse.json({ 
          success: true, 
          photo 
        })
      } else {
        return NextResponse.json({ 
          success: false, 
          error: 'Failed to fetch photo from Unsplash' 
        })
      }
    }
  } catch (error) {
    console.error('Error in random photo API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query, count = 1 } = await request.json()
    
    if (count > 1) {
      // If requesting multiple photos, use search instead
      const photos = await searchPhotos(query || 'business', count)
      return NextResponse.json({ 
        success: true, 
        photos 
      })
    } else {
      // Single random photo
      const photo = await getRandomPhoto(query)
      
      if (photo) {
        return NextResponse.json({ 
          success: true, 
          photo 
        })
      } else {
        return NextResponse.json({ 
          success: false, 
          error: 'Failed to fetch photo from Unsplash' 
        })
      }
    }
  } catch (error) {
    console.error('Error in random photo API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
} 