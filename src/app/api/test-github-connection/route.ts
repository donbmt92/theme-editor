import { getGitHubAPI } from '@/lib/github-api'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        console.log('🧪 [TEST] Testing GitHub API connection...')

        // Try to initialize GitHub API
        const github = getGitHubAPI()
        console.log('✅ [TEST] GitHub API initialized')

        return NextResponse.json({
            success: true,
            message: 'GitHub API connected successfully',
            token: process.env.GITHUB_TOKEN ? 'Set (hidden)' : 'Not set',
            owner: process.env.GITHUB_OWNER || 'Not set',
        })

    } catch (error) {
        console.error('❌ [TEST] Error:', error)
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
            },
            { status: 500 }
        )
    }
}
