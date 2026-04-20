import { NextRequest, NextResponse } from 'next/server'
import { getThemePhoto } from '@/lib/unsplash'

export async function POST(request: NextRequest) {
  try {
    const { themeName } = await request.json()
    
    if (!themeName) {
      return NextResponse.json(
        { error: 'Theme name is required' },
        { status: 400 }
      )
    }

    // Get theme-specific image from Unsplash
    const imageUrl = await getThemePhoto(themeName)
    
    if (imageUrl) {
      return NextResponse.json({ 
        success: true, 
        imageUrl 
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to fetch image from Unsplash' 
      })
    }
  } catch (error) {
    console.error('Error in theme-image API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
} 