/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const projects = await prisma.project.findMany({
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
    })

    return NextResponse.json({
      success: true,
      projects
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { success: false, error: 'Có lỗi xảy ra khi tải projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { themeId, name } = body

    if (!themeId || !name) {
      return NextResponse.json(
        { success: false, error: 'Thiếu themeId hoặc name' },
        { status: 400 }
      )
    }

    // Check if theme exists
    const theme = await prisma.theme.findUnique({
      where: { id: themeId }
    })

    if (!theme) {
      return NextResponse.json(
        { success: false, error: 'Theme không tồn tại' },
        { status: 404 }
      )
    }

    // Create new project
    const project = await prisma.project.create({
      data: {
        userId: session.user.id,
        themeId: themeId,
        name: name,
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
    })

    return NextResponse.json({
      success: true,
      project
    })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { success: false, error: 'Có lỗi xảy ra khi tạo project' },
      { status: 500 }
    )
  }
} 