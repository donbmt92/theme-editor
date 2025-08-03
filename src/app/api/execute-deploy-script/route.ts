import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs/promises'

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    // Authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { scriptPath, projectName, serverType, domain } = await request.json()

    if (!scriptPath) {
      return NextResponse.json(
        { success: false, error: 'Script path is required' },
        { status: 400 }
      )
    }

    // Kiểm tra file script có tồn tại không
    const fullScriptPath = path.join(process.cwd(), 'public', scriptPath)
    
    try {
      await fs.access(fullScriptPath)
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Script file not found' },
        { status: 404 }
      )
    }

    // Cấp quyền thực thi cho script
    await execAsync(`chmod +x "${fullScriptPath}"`)

    // Chạy script với sudo (vì script deploy cần quyền admin)
    const { stdout, stderr } = await execAsync(`sudo "${fullScriptPath}"`, {
      cwd: path.dirname(fullScriptPath),
      timeout: 60000, // 60 giây timeout
      env: {
        ...process.env,
        PROJECT_NAME: projectName || 'my-project',
        DOMAIN: domain || '',
        SERVER_TYPE: serverType || 'nginx'
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Script executed successfully',
      stdout,
      stderr,
      scriptPath: fullScriptPath
    })

  } catch (error) {
    console.error('Execute script error:', error)
    
    if (error instanceof Error) {
      // Kiểm tra nếu lỗi timeout
      if (error.message.includes('timeout')) {
        return NextResponse.json(
          { success: false, error: 'Script execution timeout. Please check server logs.' },
          { status: 408 }
        )
      }
      
      // Kiểm tra nếu lỗi permission
      if (error.message.includes('permission') || error.message.includes('sudo')) {
        return NextResponse.json(
          { success: false, error: 'Permission denied. Script needs sudo access.' },
          { status: 403 }
        )
      }
    }

    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 