import { NextRequest, NextResponse } from 'next/server'
import { uploadFile } from '@/lib/upload'

export async function POST(request: NextRequest) {
  try {
    // Kiểm tra method
    if (request.method !== 'POST') {
      return NextResponse.json(
        { success: false, error: 'Method not allowed' },
        { status: 405 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Upload file using utility function
    const result = await uploadFile(file)

    if (result.success) {
      return NextResponse.json({
        success: true,
        url: result.url,
        fileName: result.fileName,
        size: result.size,
        type: result.type
      })
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Upload error:', error)
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