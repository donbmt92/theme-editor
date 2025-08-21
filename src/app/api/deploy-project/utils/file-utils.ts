import fs from 'fs/promises'
import { createWriteStream } from 'fs'
import { pipeline } from 'stream/promises'
import { Readable } from 'stream'
import path from 'path'
import { VPS_CONFIG } from '../constants'

/**
 * Write file content using streaming for large files
 */
export async function writeFileStream(filePath: string, content: string): Promise<void> {
  const readable = Readable.from([content])
  const writable = createWriteStream(filePath)
  await pipeline(readable, writable)
}

/**
 * Get folder size recursively
 */
export async function getFolderSize(folderPath: string): Promise<number> {
  let totalSize = 0
  
  try {
    const entries = await fs.readdir(folderPath, { withFileTypes: true })
    
    for (const entry of entries) {
      const entryPath = path.join(folderPath, entry.name)
      
      if (entry.isFile()) {
        const stat = await fs.stat(entryPath)
        totalSize += stat.size
      } else if (entry.isDirectory()) {
        totalSize += await getFolderSize(entryPath)
      }
    }
  } catch (error) {
    // Ignore errors
    console.error('🧹 [CLEANUP] Error getting folder size:', error)
  }
  
  return totalSize
}

/**
 * Format bytes to human readable format
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Create directories recursively in batch
 */
export async function createDirectoriesBatch(projectDir: string, filePaths: string[]): Promise<void> {
  const uniqueDirs = new Set<string>()
  
  filePaths.forEach(file => {
    const dir = path.dirname(path.join(projectDir, file))
    uniqueDirs.add(dir)
  })

  await Promise.all(
    Array.from(uniqueDirs).map(dir => fs.mkdir(dir, { recursive: true }))
  )
}

/**
 * Write files in parallel chunks for optimal performance
 */
export async function writeFilesInChunks(
  projectDir: string,
  fileManifest: any[],
  generateContent: (file: any, ...args: any[]) => Promise<string>,
  onProgress?: (processed: number, total: number) => void,
  ...args: any[]
): Promise<void> {
  const chunks = []
  for (let i = 0; i < fileManifest.length; i += VPS_CONFIG.CHUNK_SIZE) {
    chunks.push(fileManifest.slice(i, i + VPS_CONFIG.CHUNK_SIZE))
  }

  let processedFiles = 0
  
  for (const chunk of chunks) {
    await Promise.all(
      chunk.map(async (file) => {
        const fullPath = path.join(projectDir, file.path)
        
        // Handle different file types
        if (file.type === 'copy') {
          // Copy file from source path
          await fs.copyFile(file.sourcePath, fullPath)
        } else if (file.type === 'download') {
          // Download file from URL
          await downloadFile(file.sourceUrl, fullPath)
        } else {
          // Generate content for template/placeholder files
          const content = await generateContent(file, ...args)
          
          // Use streaming for large files (NVMe optimized)
          if (content.length > VPS_CONFIG.STREAM_THRESHOLD) {
            await writeFileStream(fullPath, content)
          } else {
            await fs.writeFile(fullPath, content, 'utf8')
          }
        }
        
        processedFiles++
        onProgress?.(processedFiles, fileManifest.length)
      })
    )
  }
}

/**
 * Sanitize domain name
 */
export function sanitizeDomain(domain?: string): string {
  if (!domain || domain === 'null') {
    return 'test.dreaktech.xyz'
  }
  
  // Remove protocols and www
  const cleanDomain = domain
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '')
  
  // Basic domain validation
  if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/.test(cleanDomain)) {
    console.warn(`Invalid domain format: ${domain}, using test.dreaktech.xyz`)
    return 'test.dreaktech.xyz'
  }
  
  return cleanDomain
}

/**
 * Generate unique domain to avoid conflicts
 */
export function generateUniqueDomain(baseDomain: string, projectName: string, timestamp: number): string {
  // If domain is test.dreaktech.xyz, create unique subdomain
  if (baseDomain === 'test.dreaktech.xyz') {
    const subdomain = `${projectName}-${timestamp}`.toLowerCase().replace(/[^a-z0-9-]/g, '-')
    return `${subdomain}.${baseDomain}`
  }
  
  return baseDomain
}

/**
 * Generate unique project name to avoid conflicts
 */
export function generateUniqueProjectName(projectName: string, timestamp: number): string {
  return `${projectName}-${timestamp}`
}

/**
 * Download file from URL
 */
export async function downloadFile(url: string, filePath: string): Promise<void> {
  try {
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Failed to download ${url}: ${response.statusText}`)
    }
    
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    await fs.writeFile(filePath, buffer)
  } catch (error) {
    console.error(`Failed to download image from ${url}:`, error)
    // Create placeholder file if download fails
    await fs.writeFile(filePath, '<!-- Image download failed -->')
  }
}
