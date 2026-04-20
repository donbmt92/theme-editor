import { NextRequest, NextResponse } from 'next/server'
import { uploadFile } from '@/lib/upload'

export async function POST(request: NextRequest) {
  console.log('Upload API called')
  console.log('Request method:', request.method)
  console.log('Request headers:', Object.fromEntries(request.headers.entries()))
  
  try {
    // Kiểm tra method
    if (request.method !== 'POST') {
      console.log('Method not allowed:', request.method)
      return NextResponse.json(
        { success: false, error: 'Method not allowed' },
        { status: 405 }
      )
    }

    // Parse form data
    console.log('Parsing form data...')
    let formData: FormData
    try {
      formData = await request.formData()
      console.log('Form data parsed successfully')
    } catch (parseError) {
      console.error('Failed to parse form data:', parseError)
      return NextResponse.json(
        { success: false, error: 'Failed to parse form data' },
        { status: 400 }
      )
    }

    const file = formData.get('file') as File
    console.log('File from form data:', file ? {
      name: file.name,
      size: file.size,
      type: file.type
    } : 'No file found')

    if (!file) {
      console.log('No file provided')
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    console.log('File received:', {
      name: file.name,
      size: file.size,
      type: file.type
    })

    // Upload file using utility function
    console.log('Starting file upload...')
    const result = await uploadFile(file)

    if (result.success) {
      console.log('Upload successful:', result.url)
      return NextResponse.json({
        success: true,
        url: result.url,
        fileName: result.fileName,
        size: result.size,
        type: result.type
      })
    } else {
      console.log('Upload failed:', result.error)
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

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
} 