import { NextRequest, NextResponse } from 'next/server'
import { getVercelAPI } from '@/lib/vercel-api'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { repoFullName, projectName, customDomain } = body

        // Validate required fields
        if (!repoFullName || !projectName) {
            console.error('❌ [VERCEL] Missing required fields:', { repoFullName, projectName })
            return NextResponse.json(
                { error: 'Missing required fields: repoFullName, projectName' },
                { status: 400 }
            )
        }

        console.log('🚀 [VERCEL] Starting Vercel deployment...')

        // Sanitize project name for Vercel (remove Vietnamese & special chars)
        const sanitizedProjectName = projectName
            .normalize('NFD') // Decompose Vietnamese chars
            .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .toLowerCase()
            .replace(/[^a-z0-9._-]/g, '-') // Replace invalid chars with dash
            .replace(/--+/g, '-') // Remove multiple dashes
            .replace(/^-|-$/g, '') // Remove leading/trailing dashes
            .substring(0, 100) // Max 100 chars

        console.log('📋 [VERCEL] Config:', { repoFullName, projectName, sanitizedProjectName, customDomain })

        const vercel = getVercelAPI()

        const deployment = await vercel.deployFromGitHub({
            repoFullName,
            projectName: sanitizedProjectName,
            customDomain, // Pass custom domain if provided
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
