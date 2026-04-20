import fs from 'fs/promises'
import path from 'path'
import { VPS_CONFIG } from '../constants'
import { getFolderSize, formatBytes } from './file-utils'

/**
 * Background cleanup for old deploys (VPS disk optimized)
 */
export async function cleanupOldDeploys(): Promise<void> {
  try {
    const deployDir = path.join(process.cwd(), 'public', 'deploys')
    const now = Date.now()
    let cleanedCount = 0
    let cleanedSize = 0
    
    const cleanupRecursive = async (dir: string) => {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true })
        
        for (const entry of entries) {
          const entryPath = path.join(dir, entry.name)
          
          if (entry.isDirectory()) {
            // Check if it's a deploy folder (has timestamp)
            const timestampMatch = entry.name.match(/-(\d+)$/)
            if (timestampMatch) {
              const timestamp = parseInt(timestampMatch[1])
              if (now - timestamp > VPS_CONFIG.MAX_DEPLOY_AGE) {
                const size = await getFolderSize(entryPath)
                await fs.rm(entryPath, { recursive: true, force: true })
                cleanedCount++
                cleanedSize += size
              }
            } else {
              // Recurse into subdirectories
              await cleanupRecursive(entryPath)
            }
          }
        }
      } catch (error) {
        // Ignore errors in cleanup
      }
    }
    
    await cleanupRecursive(deployDir)
    
    if (cleanedCount > 0) {
      console.log(`🧹 [CLEANUP-VPS] Removed ${cleanedCount} old deploys, freed ${formatBytes(cleanedSize)}`)
    }
  } catch (error) {
    console.error('🧹 [CLEANUP] Cleanup failed:', error)
  }
}

/**
 * Initialize cleanup interval
 */
export function initializeCleanupInterval(): NodeJS.Timeout {
  return setInterval(cleanupOldDeploys, VPS_CONFIG.CLEANUP_INTERVAL)
}

/**
 * Stop cleanup interval
 */
export function stopCleanupInterval(interval: NodeJS.Timeout | null): void {
  if (interval) {
    clearInterval(interval)
  }
}
