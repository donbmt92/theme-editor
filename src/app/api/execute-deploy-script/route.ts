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

    const { scriptPath, projectName, serverType, domain, filesystemPath } = await request.json()

    if (!scriptPath) {
      return NextResponse.json(
        { success: false, error: 'Script path is required' },
        { status: 400 }
      )
    }

    // Kiểm tra file script có tồn tại không
    let fullScriptPath: string
    
    // Nếu scriptPath chỉ là tên file (không có đường dẫn), tìm trong thư mục project
    if (!scriptPath.includes('/') && !scriptPath.includes('\\')) {
      // Ưu tiên tìm trong filesystemPath nếu có
      if (filesystemPath) {
        fullScriptPath = path.join(filesystemPath, scriptPath)
        try {
          await fs.access(fullScriptPath)
        } catch (error) {
          // Thử tìm trong thư mục hiện tại
          const currentDir = process.cwd()
          fullScriptPath = path.join(currentDir, scriptPath)
          
          try {
            await fs.access(fullScriptPath)
          } catch (currentError) {
            // Thử tìm trong thư mục public/deploys
            const publicPath = path.join(process.cwd(), 'public', 'deploys', scriptPath)
            try {
              await fs.access(publicPath)
              fullScriptPath = publicPath
            } catch (publicError) {
              return NextResponse.json(
                { success: false, error: `Script file not found: ${scriptPath}. Searched in: ${filesystemPath}, ${currentDir}, public/deploys` },
                { status: 404 }
              )
            }
          }
        }
      } else {
        // Tìm file script trong thư mục hiện tại
        const currentDir = process.cwd()
        fullScriptPath = path.join(currentDir, scriptPath)
        
        try {
          await fs.access(fullScriptPath)
        } catch (error) {
          // Thử tìm trong thư mục public/deploys
          const publicPath = path.join(process.cwd(), 'public', 'deploys', scriptPath)
          try {
            await fs.access(publicPath)
            fullScriptPath = publicPath
          } catch (publicError) {
            return NextResponse.json(
              { success: false, error: `Script file not found: ${scriptPath}` },
              { status: 404 }
            )
          }
        }
      }
    } else {
      // Nếu scriptPath có đường dẫn đầy đủ
      fullScriptPath = path.join(process.cwd(), 'public', scriptPath)
      
      try {
        await fs.access(fullScriptPath)
      } catch (error) {
        return NextResponse.json(
          { success: false, error: `Script file not found: ${scriptPath}` },
          { status: 404 }
        )
      }
    }
    
    console.log('Script execution details:', {
      scriptPath,
      filesystemPath,
      fullScriptPath,
      projectName,
      serverType,
      domain
    });

    // Cấp quyền thực thi cho script
    await execAsync(`chmod +x "${fullScriptPath}"`)

    // Chạy script với sudo (vì script deploy cần quyền admin)
    const scriptDir = path.dirname(fullScriptPath)
    const scriptName = path.basename(fullScriptPath)
    
    console.log(`Executing script: ${scriptName} in directory: ${scriptDir}`)
    
    // Kiểm tra xem có file index.html trong thư mục không
    try {
      const indexPath = path.join(scriptDir, 'index.html')
      await fs.access(indexPath)
      console.log('✅ Found index.html in script directory')
    } catch (error) {
      console.log('⚠️ index.html not found in script directory')
    }
    
    const { stdout, stderr } = await execAsync(`sudo "${fullScriptPath}"`, {
      cwd: scriptDir,
      timeout: 60000, // 60 giây timeout
      env: {
        ...process.env,
        PROJECT_NAME: projectName || 'my-project',
        DOMAIN: domain || '',
        SERVER_TYPE: serverType || 'nginx',
        PWD: scriptDir
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