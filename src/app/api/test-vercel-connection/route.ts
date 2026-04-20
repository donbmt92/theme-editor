import { getVercelAPI } from '@/lib/vercel-api'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        console.log('🧪 [TEST] Testing Vercel API connection...')

        // Try to initialize Vercel API
        const vercel = getVercelAPI()
        console.log('✅ [TEST] Vercel API initialized')

        return NextResponse.json({
            success: true,
            message: 'Vercel API connected successfully',
            token: process.env.VERCEL_TOKEN ? 'Set (hidden)' : 'Not set',
            teamId: process.env.VERCEL_TEAM_ID || 'Not set',
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
