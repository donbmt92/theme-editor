import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const startTime = Date.now()
  console.log('📥 [DOWNLOAD] Starting project download...')
  
  try {
    const { projectId } = await params
    console.log('📋 [DOWNLOAD] Download request for project:', projectId)
    
    // Get the stored ZIP file (in production, use proper storage)
    const storedFiles = global.projectExports
    
    if (!storedFiles || !storedFiles[projectId]) {
      console.error('❌ [DOWNLOAD] Project file not found:', projectId)
      return NextResponse.json(
        { error: 'Project file not found' },
        { status: 404 }
      )
    }

    const zipBuffer = storedFiles[projectId]
    console.log(`✅ [DOWNLOAD] Found project file (${zipBuffer.byteLength} bytes)`)
    
    // Return the ZIP file
    const response = new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${projectId}-export.zip"`,
        'Content-Length': zipBuffer.byteLength.toString(),
      },
    })

    const totalTime = Date.now() - startTime
    console.log('🎉 [DOWNLOAD] Download completed successfully:', {
      projectId,
      fileSize: `${(zipBuffer.byteLength / 1024).toFixed(2)}KB`,
      totalTime: `${totalTime}ms`
    })

    return response

  } catch (error) {
    const totalTime = Date.now() - startTime
    console.error('💥 [DOWNLOAD] Download failed after', totalTime, 'ms:', error)
    
    return NextResponse.json(
      { 
        error: 'Download failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        downloadTime: totalTime
      },
      { status: 500 }
    )
  }
}

// Declare global for temporary storage
declare global {
  var projectExports: Record<string, ArrayBuffer> | undefined
} 