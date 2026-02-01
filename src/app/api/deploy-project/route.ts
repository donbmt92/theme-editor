import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
// import { DeployProcessor } from './deploy-processor' // No longer needed directly
import { VPS_CONFIG } from './constants'
import { DeployData } from './types'
import { deployQueue } from '@/lib/queue/queues'

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
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

    // Check query params if we want to force rebuild, etc. 
    // (Old logic didn't seem to use them extensively in the route, but passed them to processor)

    // Check if themeParams is provided in the request (from Editor)
    // If so, save it as a new version and use it
    let themeParams: unknown;
    let projectLanguage = 'vietnamese'; // Default

    if (deployData.themeParams) {
      console.log('📝 [DEPLOY] Saving temporary snapshot as new version...');

      // Create new version
      try {
        const lastVersion = await prisma.projectVersion.findFirst({
          where: { projectId },
          orderBy: { versionNumber: 'desc' }
        });

        const newVersionNumber = (lastVersion?.versionNumber || 0) + 1;

        await prisma.projectVersion.create({
          data: {
            projectId,
            versionNumber: newVersionNumber,
            snapshot: deployData.themeParams as any, // Store the JSON content
          }
        });

        // Update project timestamp
        await prisma.project.update({
          where: { id: projectId },
          data: { updatedAt: new Date() }
        });

        themeParams = deployData.themeParams;

      } catch (err) {
        console.error('⚠️ [DEPLOY] Failed to auto-save version:', err);
        themeParams = deployData.themeParams;
      }

    } else {
      // Fallback: Load project data to get latest themeParams from DB
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          userId: session.user.id
        },
        select: {
          id: true,
          language: true,
          theme: {
            select: {
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

      if (project.language) {
        projectLanguage = project.language;
      }

      // Get latest themeParams from project
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
    }

    // Update custom domain if provided
    if (deployData.domain && deployData.domain !== 'localhost') {
      try {
        // Check if domain is already used by another project (excluding this one)
        const existingProject = await prisma.project.findFirst({
          where: {
            customDomain: deployData.domain,
            NOT: { id: projectId }
          }
        });

        if (existingProject) {
          console.warn(`⚠️ [DEPLOY] Domain ${deployData.domain} is already in use by project ${existingProject.id}`);
        } else {
          await prisma.project.update({
            where: { id: projectId },
            data: { customDomain: deployData.domain }
          });
          console.log(`✅ [DEPLOY] Updated custom domain for project ${projectId} to ${deployData.domain}`);

          // Add to queue for host script to process (Nginx/SSL)
          try {
            const queueDir = '/app/queue';
            const queueFile = `${queueDir}/pending_domains.txt`;

            // Ensure directory exists
            if (!fs.existsSync(queueDir)) {
              fs.mkdirSync(queueDir, { recursive: true });
            }

            // Append domain to file (one per line)
            fs.appendFileSync(queueFile, `${deployData.domain}\n`);
            console.log(`📝 [DEPLOY] Added ${deployData.domain} to pending queue`);
          } catch (queueError) {
            console.error('⚠️ [DEPLOY] Failed to write to queue file:', queueError);
          }
        }
      } catch (err) {
        console.error('⚠️ [DEPLOY] Failed to update custom domain:', err);
      }
    }

    // We need project language for correct template localization
    if (deployData.themeParams && projectId) {
      const proj = await prisma.project.findUnique({
        where: { id: projectId },
        select: { language: true }
      });
      if (proj?.language) projectLanguage = proj.language;
    }

    // Merge projectLanguage into themeParams
    const themeWithLanguage = {
      ...(themeParams as Record<string, unknown>),
      projectLanguage: projectLanguage
    }

    // Update deployData with loaded themeParams
    const updatedDeployData = {
      ...deployData,
      themeParams: themeWithLanguage,
      userId: session.user.id
    }

    // Add job to BullMQ queue
    const job = await deployQueue.add(
      "deploy-project",
      updatedDeployData,
      {
        jobId: `deploy-${projectId}-${Date.now()}`,
        priority: deployData.domain ? 1 : 5, // Higher priority for custom domains
        removeOnComplete: true,
      }
    );

    console.log(`✅ [API] Deploy job ${job.id} queued for ${deployData.projectName}`);

    return NextResponse.json({
      success: true,
      jobId: job.id,
      message: "Deployment queued successfully",
      estimatedTime: "2-5 minutes",
    });

  } catch (error) {
    const totalTime = Date.now() - startTime
    console.error('💥 [DEPLOY] Deploy queue failed:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to queue deployment',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}