/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logError, getUserFriendlyMessage, isDatabaseError, createErrorResponse, withTimeout } from '@/lib/error-handler'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      logError(new Error('Unauthorized access to projects'), 'GET /api/projects', { 
        sessionExists: !!session,
        hasUserId: !!session?.user?.id 
      })
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Add timeout to database query
    const projects = await withTimeout(
      prisma.project.findMany({
        where: {
          userId: session.user.id
        },
        include: {
          theme: {
            select: {
              id: true,
              name: true,
              description: true
            }
          },
          versions: {
            orderBy: {
              versionNumber: 'desc'
            },
            take: 1
          }
        },
        orderBy: {
          updatedAt: 'desc'
        },
        take: 10 // Limit to 10 most recent projects
      }),
      8000, // 8 seconds timeout
      'Database query timeout while fetching projects'
    )

    return NextResponse.json({
      success: true,
      projects
    })
  } catch (error) {
    logError(error, 'GET /api/projects', { userId: (await getServerSession(authOptions))?.user?.id })
    
    const errorResponse = createErrorResponse(error, 'Có lỗi xảy ra khi tải projects')
    const status = isDatabaseError(error) ? 503 : 500
    
    return NextResponse.json(
      { 
        success: false, 
        error: getUserFriendlyMessage(error),
        type: errorResponse.type,
        ...(process.env.NODE_ENV === 'development' && { details: errorResponse.details })
      },
      { status }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      logError(new Error('Unauthorized project creation'), 'POST /api/projects')
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    let body
    try {
      body = await withTimeout(request.json(), 5000, 'Request body parsing timeout')
    } catch (error) {
      logError(error, 'POST /api/projects - Body parsing', { userId: session.user.id })
      return NextResponse.json(
        { success: false, error: 'Invalid request format' },
        { status: 400 }
      )
    }

    const { themeId, name } = body

    // Validation
    if (!themeId || !name) {
      logError(new Error('Missing required fields'), 'POST /api/projects - Validation', { 
        themeId: !!themeId, 
        name: !!name,
        userId: session.user.id 
      })
      return NextResponse.json(
        { success: false, error: 'Thiếu themeId hoặc name' },
        { status: 400 }
      )
    }

    if (typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Tên project không hợp lệ' },
        { status: 400 }
      )
    }

    if (name.trim().length > 100) {
      return NextResponse.json(
        { success: false, error: 'Tên project quá dài (tối đa 100 ký tự)' },
        { status: 400 }
      )
    }

    // Check if theme exists with timeout
    const theme = await withTimeout(
      prisma.theme.findUnique({
        where: { id: themeId }
      }),
      5000,
      'Database timeout while checking theme'
    )

    if (!theme) {
      logError(new Error('Theme not found'), 'POST /api/projects - Theme check', { 
        themeId, 
        userId: session.user.id 
      })
      return NextResponse.json(
        { success: false, error: 'Theme không tồn tại' },
        { status: 404 }
      )
    }

    // Create new project with timeout
    const project = await withTimeout(
      prisma.project.create({
        data: {
          userId: session.user.id,
          themeId: themeId,
          name: name.trim(),
          status: 'EDITING'
        },
        include: {
          theme: {
            select: {
              id: true,
              name: true,
              description: true,
              defaultParams: true
            }
          }
        }
      }),
      10000,
      'Database timeout while creating project'
    )

    return NextResponse.json({
      success: true,
      project
    })
  } catch (error) {
    logError(error, 'POST /api/projects', { 
      userId: (await getServerSession(authOptions))?.user?.id 
    })
    
    const errorResponse = createErrorResponse(error, 'Có lỗi xảy ra khi tạo project')
    const status = isDatabaseError(error) ? 503 : 500
    
    return NextResponse.json(
      { 
        success: false, 
        error: getUserFriendlyMessage(error),
        type: errorResponse.type,
        ...(process.env.NODE_ENV === 'development' && { details: errorResponse.details })
      },
      { status }
    )
  }
} 