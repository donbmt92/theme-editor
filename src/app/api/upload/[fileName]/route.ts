import { NextRequest, NextResponse } from 'next/server'
import { deleteFile } from '@/lib/upload'

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ fileName: string }> }
) {
  try {
    const { fileName } = await context.params

    if (!fileName) {
      return NextResponse.json(
        { success: false, error: 'File name is required' },
        { status: 400 }
      )
    }

    // Delete file
    const result = await deleteFile(fileName)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'File deleted successfully'
      })
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Delete file error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
} 