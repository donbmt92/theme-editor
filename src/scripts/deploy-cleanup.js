#!/usr/bin/env node

/**
 * Deploy Cleanup Script
 * Quản lý disk space và cleanup old deploys
 * 
 * Usage:
 * node deploy-cleanup.js --dry-run       # Preview only
 * node deploy-cleanup.js --force         # Execute cleanup
 * node deploy-cleanup.js --stats         # Show statistics only
 */

const fs = require('fs').promises
const path = require('path')

const CONFIG = {
  // Cleanup policies
  MAX_DEPLOY_AGE_DAYS: 7,           // Remove deploys older than 7 days
  MAX_DEPLOYS_PER_USER: 50,         // Keep max 50 deploys per user
  MAX_TOTAL_SIZE_GB: 10,            // Alert if total size > 10GB
  MIN_FREE_SPACE_GB: 2,             // Alert if free space < 2GB
  
  // Paths
  DEPLOY_DIR: path.join(__dirname, '../../public/deploys'),
  LOG_FILE: path.join(__dirname, '../../logs/deploy-cleanup.log'),
}

class DeployCleanup {
  constructor() {
    this.stats = {
      totalScanned: 0,
      totalDeleted: 0,
      totalSize: 0,
      sizeCleaned: 0,
      errors: [],
      userStats: new Map()
    }
  }

  async run(options = {}) {
    const { dryRun = false, force = false, showStats = false } = options
    
    console.log('🧹 Deploy Cleanup Script v2.0')
    console.log('================================')
    
    try {
      await this.collectStats()
      
      if (showStats) {
        this.displayStats()
        return
      }
      
      if (!force && !dryRun) {
        console.log('⚠️  Use --dry-run to preview or --force to execute')
        return
      }
      
      if (dryRun) {
        console.log('📊 DRY RUN MODE - No files will be deleted')
      }
      
      await this.performCleanup(dryRun)
      await this.logResults()
      
      console.log('\n✅ Cleanup completed!')
      this.displayCleanupSummary()
      
    } catch (error) {
      console.error('❌ Cleanup failed:', error)
      process.exit(1)
    }
  }

  async collectStats() {
    console.log('📊 Collecting deploy statistics...')
    
    try {
      await this.scanDirectory(CONFIG.DEPLOY_DIR)
      
      console.log(`📈 Found ${this.stats.totalScanned} deploys`)
      console.log(`💾 Total size: ${this.formatBytes(this.stats.totalSize)}`)
      console.log(`👥 Active users: ${this.stats.userStats.size}`)
      
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('📁 Deploy directory not found, creating...')
        await fs.mkdir(CONFIG.DEPLOY_DIR, { recursive: true })
      } else {
        throw error
      }
    }
  }

  async scanDirectory(dir) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true })
      
      for (const entry of entries) {
        const entryPath = path.join(dir, entry.name)
        
        if (entry.isDirectory()) {
          const timestampMatch = entry.name.match(/-(\d+)$/)
          
          if (timestampMatch) {
            // This is a deploy folder
            await this.processDeployFolder(entryPath, parseInt(timestampMatch[1]))
          } else {
            // Recurse into subdirectories
            await this.scanDirectory(entryPath)
          }
        }
      }
    } catch (error) {
      this.stats.errors.push(`Scan error in ${dir}: ${error.message}`)
    }
  }

  async processDeployFolder(deployPath, timestamp) {
    try {
      const userId = this.getUserIdFromPath(deployPath)
      const deployDate = new Date(timestamp)
      const size = await this.getFolderSize(deployPath)
      
      this.stats.totalScanned++
      this.stats.totalSize += size
      
      // Track per-user stats
      if (!this.stats.userStats.has(userId)) {
        this.stats.userStats.set(userId, {
          deploys: [],
          totalSize: 0
        })
      }
      
      const userStats = this.stats.userStats.get(userId)
      userStats.deploys.push({
        path: deployPath,
        timestamp,
        date: deployDate,
        size
      })
      userStats.totalSize += size
      
    } catch (error) {
      this.stats.errors.push(`Process error for ${deployPath}: ${error.message}`)
    }
  }

  async performCleanup(dryRun) {
    console.log('\n🧹 Starting cleanup process...')
    
    const now = Date.now()
    const maxAge = CONFIG.MAX_DEPLOY_AGE_DAYS * 24 * 60 * 60 * 1000
    
    for (const [userId, userStats] of this.stats.userStats) {
      // Sort deploys by date (newest first)
      userStats.deploys.sort((a, b) => b.timestamp - a.timestamp)
      
      let deletedCount = 0
      
      for (let i = 0; i < userStats.deploys.length; i++) {
        const deploy = userStats.deploys[i]
        const age = now - deploy.timestamp
        const isOld = age > maxAge
        const exceedsLimit = i >= CONFIG.MAX_DEPLOYS_PER_USER
        
        if (isOld || exceedsLimit) {
          const reason = isOld ? 'too old' : 'exceeds limit'
          console.log(`  🗑️  ${dryRun ? '[DRY RUN] ' : ''}Deleting deploy: ${path.basename(deploy.path)} (${reason})`)
          
          if (!dryRun) {
            try {
              await fs.rm(deploy.path, { recursive: true, force: true })
              this.stats.totalDeleted++
              this.stats.sizeCleaned += deploy.size
            } catch (error) {
              this.stats.errors.push(`Delete error for ${deploy.path}: ${error.message}`)
            }
          } else {
            this.stats.totalDeleted++
            this.stats.sizeCleaned += deploy.size
          }
          
          deletedCount++
        }
      }
      
      if (deletedCount > 0) {
        console.log(`    📊 User ${userId}: removed ${deletedCount} deploys`)
      }
    }
    
    // Check disk space warnings
    await this.checkDiskSpace()
  }

  async checkDiskSpace() {
    console.log('\n💾 Checking disk space...')
    
    // Check total size warning
    const totalSizeGB = this.stats.totalSize / (1024 * 1024 * 1024)
    if (totalSizeGB > CONFIG.MAX_TOTAL_SIZE_GB) {
      console.log(`⚠️  WARNING: Total deploy size (${this.formatBytes(this.stats.totalSize)}) exceeds limit (${CONFIG.MAX_TOTAL_SIZE_GB}GB)`)
    }
    
    // Check disk space (Unix/Linux only)
    try {
      const { exec } = require('child_process')
      const { promisify } = require('util')
      const execAsync = promisify(exec)
      
      const { stdout } = await execAsync(`df -h ${CONFIG.DEPLOY_DIR}`)
      const lines = stdout.trim().split('\n')
      if (lines.length > 1) {
        const diskInfo = lines[1].split(/\s+/)
        const available = diskInfo[3]
        console.log(`💾 Available disk space: ${available}`)
      }
    } catch (error) {
      // Ignore disk space check errors
    }
  }

  displayStats() {
    console.log('\n📊 Deploy Statistics')
    console.log('===================')
    console.log(`Total deploys: ${this.stats.totalScanned}`)
    console.log(`Total size: ${this.formatBytes(this.stats.totalSize)}`)
    console.log(`Active users: ${this.stats.userStats.size}`)
    
    // Top users by size
    const topUsers = Array.from(this.stats.userStats.entries())
      .sort((a, b) => b[1].totalSize - a[1].totalSize)
      .slice(0, 10)
    
    console.log('\n👥 Top Users by Size:')
    topUsers.forEach(([userId, stats], index) => {
      console.log(`  ${index + 1}. ${userId}: ${stats.deploys.length} deploys, ${this.formatBytes(stats.totalSize)}`)
    })
    
    if (this.stats.errors.length > 0) {
      console.log('\n❌ Errors:')
      this.stats.errors.forEach(error => console.log(`  - ${error}`))
    }
  }

  displayCleanupSummary() {
    console.log('\n📊 Cleanup Summary')
    console.log('==================')
    console.log(`Deploys deleted: ${this.stats.totalDeleted}`)
    console.log(`Space cleaned: ${this.formatBytes(this.stats.sizeCleaned)}`)
    console.log(`Errors: ${this.stats.errors.length}`)
    
    if (this.stats.errors.length > 0) {
      console.log('\n❌ Errors encountered:')
      this.stats.errors.forEach(error => console.log(`  - ${error}`))
    }
  }

  async logResults() {
    const logEntry = {
      timestamp: new Date().toISOString(),
      stats: {
        totalScanned: this.stats.totalScanned,
        totalDeleted: this.stats.totalDeleted,
        sizeCleaned: this.stats.sizeCleaned,
        errors: this.stats.errors.length
      }
    }
    
    try {
      await fs.mkdir(path.dirname(CONFIG.LOG_FILE), { recursive: true })
      await fs.appendFile(CONFIG.LOG_FILE, JSON.stringify(logEntry) + '\n')
    } catch (error) {
      console.warn('⚠️  Failed to write log:', error.message)
    }
  }

  getUserIdFromPath(deployPath) {
    const pathParts = deployPath.split(path.sep)
    const usersIndex = pathParts.findIndex(part => part === 'users')
    
    if (usersIndex !== -1 && usersIndex + 1 < pathParts.length) {
      return pathParts[usersIndex + 1]
    }
    
    return 'unknown'
  }

  async getFolderSize(folderPath) {
    let totalSize = 0
    
    try {
      const entries = await fs.readdir(folderPath, { withFileTypes: true })
      
      for (const entry of entries) {
        const entryPath = path.join(folderPath, entry.name)
        
        if (entry.isFile()) {
          const stat = await fs.stat(entryPath)
          totalSize += stat.size
        } else if (entry.isDirectory()) {
          totalSize += await this.getFolderSize(entryPath)
        }
      }
    } catch (error) {
      // Ignore errors
    }
    
    return totalSize
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2)
  const options = {
    dryRun: args.includes('--dry-run'),
    force: args.includes('--force'),
    showStats: args.includes('--stats')
  }
  
  const cleanup = new DeployCleanup()
  cleanup.run(options)
}

module.exports = DeployCleanup