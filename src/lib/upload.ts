import { writeFile, mkdir, access, constants } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// Cấu hình upload
export const UPLOAD_CONFIG = {
  UPLOAD_DIR: process.env.UPLOAD_DIR || join(process.cwd(), 'public', 'uploads'),
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
 * Check if upload directory is writable
 */
async function checkUploadDirectory(): Promise<{ exists: boolean; writable: boolean; error?: string }> {
  try {
    console.log('Checking upload directory:', UPLOAD_CONFIG.UPLOAD_DIR)
    const exists = existsSync(UPLOAD_CONFIG.UPLOAD_DIR)
    console.log('Directory exists:', exists)
    
    if (!exists) {
      return { exists: false, writable: false, error: 'Upload directory does not exist' }
    }
    
    await access(UPLOAD_CONFIG.UPLOAD_DIR, constants.W_OK)
    console.log('Directory is writable')
    return { exists: true, writable: true }
  } catch (error) {
    console.error('Directory access error:', error)
    return { 
      exists: true, 
      writable: false, 
      error: `Upload directory is not writable: ${error}` 
    }
  }
}

/**
 * Validate file upload
 */
export function validateFile(file: File): { isValid: boolean; error?: string } {
  console.log('Validating file:', {
    name: file.name,
    type: file.type,
    size: file.size,
    allowedTypes: UPLOAD_CONFIG.ALLOWED_TYPES
  })

  // Check file type by MIME type first
  if (UPLOAD_CONFIG.ALLOWED_TYPES.includes(file.type)) {
    console.log('File type validated by MIME type')
  } else {
    // If MIME type doesn't match, check by file extension
    const fileName = file.name.toLowerCase()
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext))
    
    if (hasValidExtension) {
      console.log('File type validated by extension')
    } else {
      console.log('Invalid file type:', file.type, 'or extension')
      return {
        isValid: false,
        error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed'
      }
    }
  }

  // Check file size
  if (file.size > UPLOAD_CONFIG.MAX_FILE_SIZE) {
    console.log('File too large:', file.size, '>', UPLOAD_CONFIG.MAX_FILE_SIZE)
    return {
      isValid: false,
      error: `File size too large. Maximum size is ${UPLOAD_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`
    }
  }

  console.log('File validation passed')
  return { isValid: true }
}

/**
 * Generate unique filename
 */
export function generateFileName(originalName: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const fileExtension = originalName.split('.').pop() || 'jpg'
  const fileName = `${timestamp}-${randomString}.${fileExtension}`
  console.log('Generated filename:', fileName)
  return fileName
}

/**
 * Upload file to server
 */
export async function uploadFile(file: File): Promise<UploadResult> {
  console.log('Starting upload process...')
  console.log('Current working directory:', process.cwd())
  console.log('Upload directory path:', UPLOAD_CONFIG.UPLOAD_DIR)
  
  try {
    // Check upload directory
    console.log('Checking upload directory...')
    const dirCheck = await checkUploadDirectory()
    console.log('Directory check result:', dirCheck)
    
    if (!dirCheck.exists || !dirCheck.writable) {
      console.log('Directory check failed:', dirCheck.error)
      return {
        success: false,
        error: dirCheck.error || 'Upload directory is not accessible'
      }
    }

    // Validate file
    console.log('Validating file...')
    const validation = validateFile(file)
    if (!validation.isValid) {
      console.log('File validation failed:', validation.error)
      return {
        success: false,
        error: validation.error
      }
    }

    // Create upload directory if it doesn't exist
    console.log('Checking upload directory:', UPLOAD_CONFIG.UPLOAD_DIR)
    if (!existsSync(UPLOAD_CONFIG.UPLOAD_DIR)) {
      console.log('Creating upload directory...')
      try {
        await mkdir(UPLOAD_CONFIG.UPLOAD_DIR, { recursive: true })
        console.log('Upload directory created successfully')
      } catch (mkdirError) {
        console.error('Failed to create upload directory:', mkdirError)
        return {
          success: false,
          error: `Failed to create upload directory: ${mkdirError}`
        }
      }
    } else {
      console.log('Upload directory exists')
    }

    // Generate unique filename
    const fileName = generateFileName(file.name)
    const filePath = join(UPLOAD_CONFIG.UPLOAD_DIR, fileName)
    console.log('File path:', filePath)

    // Convert file to buffer
    console.log('Converting file to buffer...')
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    console.log('Buffer created, size:', buffer.length)

    // Save file
    console.log('Writing file to disk...')
    try {
      await writeFile(filePath, buffer)
      console.log('File written successfully')
    } catch (writeError) {
      console.error('Failed to write file:', writeError)
      return {
        success: false,
        error: `Failed to write file: ${writeError}`
      }
    }

    // Verify file was created
    if (!existsSync(filePath)) {
      console.error('File was not created after write operation')
      return {
        success: false,
        error: 'File was not created after write operation'
      }
    }

    // Return success result
    const result = {
      success: true,
      url: `/uploads/${fileName}`,
      fileName: fileName,
      size: file.size,
      type: file.type
    }
    console.log('Upload result:', result)
    return result

  } catch (error) {
    console.error('Upload error:', error)
    return {
      success: false,
      error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`
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