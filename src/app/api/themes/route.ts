import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const themes = await prisma.theme.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        previewUrl: true,
        defaultParams: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      themes
    })
  } catch (error) {
    console.error('Error fetching themes:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Có lỗi xảy ra khi tải templates' 
      },
      { status: 500 }
    )
  }
} 