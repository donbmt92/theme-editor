import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { themeId: string } }
) {
  try {
    const theme = await prisma.theme.findUnique({
      where: {
        id: params.themeId
      },
      select: {
        id: true,
        name: true,
        description: true,
        previewUrl: true,
        defaultParams: true,
        createdAt: true,
      }
    })

    if (!theme) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Theme không tồn tại' 
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      theme
    })
  } catch (error) {
    console.error('Error fetching theme:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Có lỗi xảy ra khi tải theme' 
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { themeId: string } }
) {
  try {
    const body = await request.json()
    const { themeParams } = body

    if (!themeParams) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Thiếu dữ liệu theme' 
        },
        { status: 400 }
      )
    }

    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Chỉ admin mới có thể chỉnh sửa themes' }, { status: 403 })
    }

    // Check if theme exists
    const theme = await prisma.theme.findUnique({
      where: { id: params.themeId },
      select: { createdBy: true }
    })

    if (!theme) {
      return NextResponse.json({ success: false, error: 'Theme không tồn tại' }, { status: 404 })
    }

    if (theme.createdBy !== session.user.id) {
      return NextResponse.json({ success: false, error: 'Bạn không có quyền chỉnh sửa theme này' }, { status: 403 })
    }

    const updatedTheme = await prisma.theme.update({
      where: {
        id: params.themeId
      },
      data: {
        defaultParams: themeParams
      },
      select: {
        id: true,
        name: true,
        description: true,
        previewUrl: true,
        defaultParams: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    return NextResponse.json({
      success: true,
      theme: updatedTheme,
      message: 'Theme đã được lưu thành công'
    })
  } catch (error) {
    console.error('Error updating theme:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Có lỗi xảy ra khi lưu theme' 
      },
      { status: 500 }
    )
  }
} 