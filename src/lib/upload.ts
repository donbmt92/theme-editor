import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// Cấu hình upload
export const UPLOAD_CONFIG = {
  UPLOAD_DIR: join(process.cwd(), 'public', 'uploads'),
  MAX_FILE_SIZE: 20 * 1024 * 1024, // 20MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],
  MAX_FILES_PER_REQUEST: 1
}

export interface UploadResult {
  success: boolean
  url?: string
  fileName?: string
  size?: number
  type?: string
  error?: string
}

/**
 * Validate file upload
 */
export function validateFile(file: File): { isValid: boolean; error?: string } {
  // Check file type
  if (!UPLOAD_CONFIG.ALLOWED_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed'
    }
  }

  // Check file size
  if (file.size > UPLOAD_CONFIG.MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size too large. Maximum size is ${UPLOAD_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`
    }
  }

  return { isValid: true }
}

/**
 * Generate unique filename
 */
export function generateFileName(originalName: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const fileExtension = originalName.split('.').pop() || 'jpg'
  return `${timestamp}-${randomString}.${fileExtension}`
}

/**
 * Upload file to server
 */
export async function uploadFile(file: File): Promise<UploadResult> {
  try {
    // Validate file
    const validation = validateFile(file)
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error
      }
    }

    // Create upload directory if it doesn't exist
    if (!existsSync(UPLOAD_CONFIG.UPLOAD_DIR)) {
      await mkdir(UPLOAD_CONFIG.UPLOAD_DIR, { recursive: true })
    }

    // Generate unique filename
    const fileName = generateFileName(file.name)
    const filePath = join(UPLOAD_CONFIG.UPLOAD_DIR, fileName)

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save file
    await writeFile(filePath, buffer)

    // Return success result
    return {
      success: true,
      url: `/uploads/${fileName}`,
      fileName: fileName,
      size: file.size,
      type: file.type
    }

  } catch (error) {
    console.error('Upload error:', error)
    return {
      success: false,
      error: 'Internal server error'
    }
  }
}

/**
 * Delete uploaded file
 */
export async function deleteFile(fileName: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { unlink } = await import('fs/promises')
    const filePath = join(UPLOAD_CONFIG.UPLOAD_DIR, fileName)
    
    if (existsSync(filePath)) {
      await unlink(filePath)
      return { success: true }
    } else {
      return { success: false, error: 'File not found' }
    }
  } catch (error) {
    console.error('Delete file error:', error)
    return {
      success: false,
      error: 'Failed to delete file'
    }
  }
} 