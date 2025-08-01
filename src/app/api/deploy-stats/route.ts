/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import path from 'path'
import fs from 'fs/promises'

// Deploy statistics and monitoring
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const deployDir = path.join(process.cwd(), 'public', 'deploys')
    const stats = await collectDeployStats(deployDir)

    return NextResponse.json({
      success: true,
      stats
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to collect stats' },
      { status: 500 }
    )
  }
}

async function collectDeployStats(deployDir: string) {
  const stats = {
    totalDeploys: 0,
    totalSize: 0,
    activeUsers: new Set<string>(),
    deploysByHour: {} as Record<string, number>,
    oldestDeploy: null as Date | null,
    newestDeploy: null as Date | null,
    averageFileCount: 0,
    diskUsageByUser: {} as Record<string, { deploys: number, size: number }>,
    performance: {
      averageDeployTime: 0,
      fastest: { time: Infinity, project: '' },
      slowest: { time: 0, project: '' }
    }
  }

  try {
    await collectStatsRecursive(deployDir, stats)
    
    // Calculate averages
    if (stats.totalDeploys > 0) {
      stats.averageFileCount = Math.round(stats.averageFileCount / stats.totalDeploys)
    }

    return {
      ...stats,
      activeUsers: stats.activeUsers.size,
      diskUsageFormatted: formatBytes(stats.totalSize),
      topUsers: Object.entries(stats.diskUsageByUser)
        .sort((a, b) => b[1].size - a[1].size)
        .slice(0, 10)
        .map(([userId, data]) => ({
          userId,
          deploys: data.deploys,
          size: formatBytes(data.size)
        }))
    }
  } catch (error) {
    return { error: 'Failed to collect stats', details: error }
  }
}

async function collectStatsRecursive(dir: string, stats: any) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      const entryPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        // Check if it's a deploy folder
        const timestampMatch = entry.name.match(/-(\d+)$/)
        if (timestampMatch) {
          // This is a deploy folder
          const timestamp = parseInt(timestampMatch[1])
          const deployDate = new Date(timestamp)
          const userId = getUserIdFromPath(entryPath)

          // Update stats
          stats.totalDeploys++
          stats.activeUsers.add(userId)

          // Track deploy times
          const hour = `${deployDate.getFullYear()}-${deployDate.getMonth()}-${deployDate.getDate()}-${deployDate.getHours()}`
          stats.deploysByHour[hour] = (stats.deploysByHour[hour] || 0) + 1

          // Track oldest/newest
          if (!stats.oldestDeploy || deployDate < stats.oldestDeploy) {
            stats.oldestDeploy = deployDate
          }
          if (!stats.newestDeploy || deployDate > stats.newestDeploy) {
            stats.newestDeploy = deployDate
          }

          // Calculate folder size and file count
          const folderStats = await getFolderStats(entryPath)
          stats.totalSize += folderStats.size
          stats.averageFileCount += folderStats.fileCount

          // Track by user
          if (!stats.diskUsageByUser[userId]) {
            stats.diskUsageByUser[userId] = { deploys: 0, size: 0 }
          }
          stats.diskUsageByUser[userId].deploys++
          stats.diskUsageByUser[userId].size += folderStats.size

          // Check performance metadata
          const metadataPath = path.join(entryPath, 'deploy-metadata.json')
          try {
            const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'))
            if (metadata.deployTime) {
              stats.performance.averageDeployTime += metadata.deployTime
              
              if (metadata.deployTime < stats.performance.fastest.time) {
                stats.performance.fastest = {
                  time: metadata.deployTime,
                  project: metadata.projectName || entry.name
                }
              }
              
              if (metadata.deployTime > stats.performance.slowest.time) {
                stats.performance.slowest = {
                  time: metadata.deployTime,
                  project: metadata.projectName || entry.name
                }
              }
            }
          } catch {
            // Ignore metadata errors
          }
        } else {
          // Recurse into subdirectories
          await collectStatsRecursive(entryPath, stats)
        }
      }
    }

    // Calculate average deploy time
    if (stats.totalDeploys > 0) {
      stats.performance.averageDeployTime = Math.round(stats.performance.averageDeployTime / stats.totalDeploys)
    }

  } catch (error) {
    // Ignore directory access errors
  }
}

function getUserIdFromPath(deployPath: string): string {
  const pathParts = deployPath.split(path.sep)
  const usersIndex = pathParts.findIndex(part => part === 'users')
  
  if (usersIndex !== -1 && usersIndex + 1 < pathParts.length) {
    return pathParts[usersIndex + 1]
  }
  
  return 'unknown'
}

async function getFolderStats(folderPath: string): Promise<{ size: number, fileCount: number }> {
  let totalSize = 0
  let fileCount = 0

  try {
    const entries = await fs.readdir(folderPath, { withFileTypes: true })

    for (const entry of entries) {
      const entryPath = path.join(folderPath, entry.name)
      
      if (entry.isFile()) {
        const stat = await fs.stat(entryPath)
        totalSize += stat.size
        fileCount++
      } else if (entry.isDirectory()) {
        const subStats = await getFolderStats(entryPath)
        totalSize += subStats.size
        fileCount += subStats.fileCount
      }
    }
  } catch {
    // Ignore errors
  }

  return { size: totalSize, fileCount }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}