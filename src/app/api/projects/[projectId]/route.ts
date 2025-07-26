import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id
      },
      include: {
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
    })

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project không tồn tại' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      project
    })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { success: false, error: 'Có lỗi xảy ra khi tải project' },
      { status: 500 }
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
    const { themeParams, name } = body

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

      await prisma.projectVersion.create({
        data: {
          projectId: projectId,
          versionNumber: newVersionNumber,
          snapshot: themeParams
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