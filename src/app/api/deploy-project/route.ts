import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DeployProcessor } from './deploy-processor'
import { initializeCleanupInterval } from './utils/cleanup'
import { VPS_CONFIG } from './constants'
import { DeployData } from './types'

// Deploy queue management
const deployQueue = new Map<string, Promise<unknown>>()

// Background cleanup job
let cleanupInterval: NodeJS.Timeout | null = null
if (!cleanupInterval) {
  cleanupInterval = initializeCleanupInterval()
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Rate limiting check
    if (deployQueue.size >= VPS_CONFIG.MAX_CONCURRENT_DEPLOYS) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Server is busy. Too many deploys in progress. Please try again later.' 
        },
        { status: 429 }
      )
    }

    // Authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const deployData: DeployData = await request.json()
    const { projectId, userId, projectName } = deployData

    // Validation
    if (!projectId || !projectName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Load project data to get latest themeParams
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id
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
        { success: false, error: 'Project không tồn tại hoặc bạn không có quyền truy cập' },
        { status: 404 }
      )
    }

    // Get latest themeParams from project
    let themeParams: unknown
    const latestVersion = project.versions[0]
    
    if (latestVersion && latestVersion.snapshot) {
      themeParams = latestVersion.snapshot
    } else if (project.theme.defaultParams) {
      try {
        themeParams = typeof project.theme.defaultParams === 'string' 
          ? JSON.parse(project.theme.defaultParams) 
          : project.theme.defaultParams
      } catch {
        return NextResponse.json(
          { success: false, error: 'Dữ liệu theme không hợp lệ' },
          { status: 400 }
        )
      }
    } else {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy dữ liệu theme' },
        { status: 400 }
      )
    }

    // Merge projectLanguage into themeParams
    const themeWithLanguage = {
      ...(themeParams as Record<string, unknown>),
      projectLanguage: project.language || 'vietnamese'
    }

    // Update deployData with loaded themeParams
    const updatedDeployData: DeployData = {
      ...deployData,
      themeParams: themeWithLanguage,
      userId: session.user.id
    }

    // Check if this deploy is already in progress
    const deployKey = `${userId}-${projectId}`
    if (deployQueue.has(deployKey)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Deploy already in progress for this project' 
        },
        { status: 409 }
      )
    }

    // Add to queue and start processing
    const deployPromise = processDeploy(updatedDeployData, userId, projectId, startTime)
    deployQueue.set(deployKey, deployPromise)

    try {
      const result = await deployPromise
      deployQueue.delete(deployKey)
      return NextResponse.json(result)
    } catch (error) {
      deployQueue.delete(deployKey)
      throw error
    }

  } catch (error) {
    const totalTime = Date.now() - startTime
    console.error('💥 [DEPLOY] Deploy failed after', totalTime, 'ms:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Deploy failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        deployTime: totalTime
      },
      { status: 500 }
    )
  }
}

/**
 * Process deployment using the DeployProcessor
 */
async function processDeploy(
  deployData: DeployData,
  userId: string,
  projectId: string,
  startTime: number
) {
  const processor = new DeployProcessor({
    deployData,
      userId,
      projectId,
    startTime
  })

  return await processor.process()
}