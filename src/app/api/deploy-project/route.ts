import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DeployProcessor } from './deploy-processor'
import { initializeCleanupInterval } from './utils/cleanup'
import { VPS_CONFIG } from './constants'
import { DeployData } from './types'

// Deploy queue management
const deployQueue = new Map<string, Promise<any>>()

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
    const { projectId, userId, projectName, themeParams } = deployData

    // Validation
    if (!projectId || !projectName || !themeParams) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
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
    const deployPromise = processDeploy(deployData, userId, projectId, startTime)
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