import { NextRequest, NextResponse } from 'next/server'
import { getGitHubAPI } from '@/lib/github-api'
import { generateReactProject } from '@/lib/export-react-project'
import { ThemeParams } from '@/types'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            projectName,
            description,
            themeName,
            themeParams,
            userId,
            isPrivate = false,
        } = body

        // Validate required fields
        if (!projectName || !themeName || !themeParams || !userId) {
            console.error('❌ [EXPORT] Missing required fields:', { projectName, themeName, userId })
            return NextResponse.json(
                { error: 'Missing required fields: projectName, themeName, themeParams, userId' },
                { status: 400 }
            )
        }

        // Validate themeParams structure
        if (!themeParams.colors || !themeParams.typography || !themeParams.layout) {
            console.error('❌ [EXPORT] Invalid themeParams structure:', Object.keys(themeParams))
            return NextResponse.json(
                { error: 'Invalid themeParams: must include colors, typography, and layout' },
                { status: 400 }
            )
        }

        console.log('🚀 [EXPORT] Starting GitHub export...')
        console.log('📋 [EXPORT] Config:', { projectName, themeName, userId })

        // Step 1: Generate project files
        console.log('📁 [EXPORT] Generating project files...')
        const files = await generateReactProject({
            themeName,
            themeParams: themeParams as ThemeParams,
            projectName,
            userId,
        })

        console.log(`✅ [EXPORT] Generated ${Object.keys(files).length} files`)

        // Step 2: Create GitHub repo and push files
        console.log('🐙 [GITHUB] Creating repository and pushing code...')

        const github = getGitHubAPI()

        // Generate unique repo name
        const repoName = `${projectName}-${userId.slice(0, 8)}`.toLowerCase().replace(/\s+/g, '-')

        const repo = await github.createRepoWithFiles(
            {
                name: repoName,
                description: description || `${projectName} - Built with Theme Editor`,
                isPrivate,
            },
            files,
            `Initial commit: ${projectName}`
        )

        console.log('✅ [EXPORT] GitHub export completed successfully')

        return NextResponse.json({
            success: true,
            github: {
                repoUrl: repo.repoUrl,
                repoName: repoName,
                repoFullName: repo.repoFullName,
            },
            fileCount: Object.keys(files).length,
        })

    } catch (error) {
        console.error('❌ [EXPORT] Error:', error)
        const errorMessage = error instanceof Error ? error.message : 'Export failed'
        const errorStack = error instanceof Error ? error.stack : undefined

        console.error('❌ [EXPORT] Error stack:', errorStack)

        return NextResponse.json(
            {
                error: errorMessage,
                success: false,
                details: process.env.NODE_ENV === 'development' ? errorStack : undefined
            },
            { status: 500 }
        )
    }
}
