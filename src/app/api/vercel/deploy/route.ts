import { NextRequest, NextResponse } from 'next/server'
import { getVercelAPI } from '@/lib/vercel-api'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { repoFullName, projectName } = body

        // Validate required fields
        if (!repoFullName || !projectName) {
            console.error('❌ [VERCEL] Missing required fields:', { repoFullName, projectName })
            return NextResponse.json(
                { error: 'Missing required fields: repoFullName, projectName' },
                { status: 400 }
            )
        }

        console.log('🚀 [VERCEL] Starting Vercel deployment...')
        console.log('📋 [VERCEL] Config:', { repoFullName, projectName })

        const vercel = getVercelAPI()

        const deployment = await vercel.deployFromGitHub({
            repoFullName,
            projectName,
        })

        console.log('✅ [VERCEL] Deployment completed successfully')

        return NextResponse.json({
            success: true,
            vercel: {
                deploymentUrl: deployment.deploymentUrl,
                projectUrl: deployment.projectUrl,
                deploymentId: deployment.deploymentId,
            },
        })

    } catch (error) {
        console.error('❌ [VERCEL] Error:', error)
        const errorMessage = error instanceof Error ? error.message : 'Deployment failed'
        const errorStack = error instanceof Error ? error.stack : undefined

        console.error('❌ [VERCEL] Error stack:', errorStack)

        return NextResponse.json(
            {
                error: errorMessage,
                success: false,
                details: process.env.NODE_ENV === 'development' ? errorStack : undefined,
            },
            { status: 500 }
        )
    }
}
