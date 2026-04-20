import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params

    if (!projectId || typeof projectId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Project ID không hợp lệ' },
        { status: 400 }
      )
    }

    const project = await prisma.project.findUnique({
      where: {
        id: projectId
      },
      select: {
        id: true,
        name: true,
        language: true,
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
    console.error('Error fetching project for preview:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Có lỗi xảy ra khi tải project' 
      },
      { status: 500 }
    )
  }
}
