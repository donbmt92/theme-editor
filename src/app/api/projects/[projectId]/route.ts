import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logError, getUserFriendlyMessage, isDatabaseError, createErrorResponse, withTimeout } from '@/lib/error-handler'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      logError(new Error('Unauthorized project access'), 'GET /api/projects/[projectId]', { projectId })
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    if (!projectId || typeof projectId !== 'string') {
      logError(new Error('Invalid project ID'), 'GET /api/projects/[projectId]', { projectId, userId: session.user.id })
      return NextResponse.json(
        { success: false, error: 'Project ID không hợp lệ' },
        { status: 400 }
      )
    }

    const project = await withTimeout(
      prisma.project.findFirst({
        where: {
          id: projectId,
          userId: session.user.id
        },
        select: {
          id: true,
          name: true,
          language: true,
          customDomain: true,
          subdomain: true,
          theme: {
            select: {
              id: true,
              name: true,
              description: true,
              defaultParams: true
            }
          },
          versions: {
            orderBy: { versionNumber: 'desc' },
            take: 1
          }
        }
      }),
      8000,
      'Database timeout while fetching project'
    )

    if (!project) {
      logError(new Error('Project not found'), 'GET /api/projects/[projectId]', {
        projectId,
        userId: session.user.id
      })
      return NextResponse.json(
        { success: false, error: 'Project không tồn tại hoặc bạn không có quyền truy cập' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      project
    })
  } catch (error) {
    logError(error, 'GET /api/projects/[projectId]', {
      projectId: (await params).projectId,
      userId: (await getServerSession(authOptions))?.user?.id
    })

    const errorResponse = createErrorResponse(error, 'Có lỗi xảy ra khi tải project')
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { themeParams, name, language } = body

    console.log('Received update request:', { themeParams: !!themeParams, name, language })

    // Check if project exists and user owns it
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id
      }
    })

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project không tồn tại hoặc bạn không có quyền truy cập' },
        { status: 404 }
      )
    }

    // Update project
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        name: name || project.name,
        language: language || project.language,
        updatedAt: new Date()
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
    })

    // Create new version if themeParams provided
    if (themeParams) {
      const latestVersion = await prisma.projectVersion.findFirst({
        where: { projectId: projectId },
        orderBy: { versionNumber: 'desc' }
      })

      const newVersionNumber = (latestVersion?.versionNumber || 0) + 1

      // Parse themeParams if it's a string
      let parsedThemeParams = themeParams
      if (typeof themeParams === 'string') {
        try {
          parsedThemeParams = JSON.parse(themeParams)
        } catch (error) {
          console.error('Failed to parse themeParams:', error)
          return NextResponse.json(
            { success: false, error: 'Invalid themeParams format' },
            { status: 400 }
          )
        }
      }

      // console.log('Creating new version with params:', parsedThemeParams)

      await prisma.projectVersion.create({
        data: {
          projectId: projectId,
          versionNumber: newVersionNumber,
          snapshot: parsedThemeParams
        }
      })
    }

    return NextResponse.json({
      success: true,
      project: updatedProject,
      message: 'Project đã được cập nhật thành công'
    })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { success: false, error: 'Có lỗi xảy ra khi cập nhật project' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Check if project exists and user owns it
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id
      }
    })

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project không tồn tại hoặc bạn không có quyền truy cập' },
        { status: 404 }
      )
    }

    // Delete project and all related data
    await prisma.projectVersion.deleteMany({
      where: { projectId: projectId }
    })

    await prisma.project.delete({
      where: { id: projectId }
    })

    return NextResponse.json({
      success: true,
      message: 'Project đã được xóa thành công'
    })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { success: false, error: 'Có lỗi xảy ra khi xóa project' },
      { status: 500 }
    )
  }
} 