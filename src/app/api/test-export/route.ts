import { generateReactProject } from '@/lib/export-react-project'
import { NextRequest, NextResponse } from 'next/server'
import { ThemeParams } from '@/types'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { themeName, themeParams, projectName, userId } = body

        // Validate required fields
        if (!themeName || !themeParams || !projectName || !userId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        console.log('🚀 [EXPORT] Starting React project generation...')
        console.log('📋 [EXPORT] Config:', { themeName, projectName, userId })

        // Generate project files
        const files = await generateReactProject({
            themeName,
            themeParams: themeParams as ThemeParams,
            projectName,
            userId
        })

        console.log(`✅ [EXPORT] Generated ${Object.keys(files).length} files`)

        return NextResponse.json({
            success: true,
            files: Object.keys(files), // Return file list for preview
            fileCount: Object.keys(files).length,
            projectData: {
                themeName,
                projectName,
                userId
            }
        })

    } catch (error) {
        console.error('❌ [EXPORT] Error:', error)
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Export failed',
                success: false
            },
            { status: 500 }
        )
    }
}
