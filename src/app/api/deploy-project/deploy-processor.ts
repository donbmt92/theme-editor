import path from 'path'
import fs from 'fs/promises'
import { 
  DeployProcessorParams, 
  DeployResult, 
  DeployProgress, 
  FileManifestItem 
} from './types'
import { VPS_CONFIG, FILE_PATHS } from './constants'
import { TemplateEngine } from './template-engine'
import { 
  createDirectoriesBatch, 
  writeFilesInChunks,
  generateUniqueProjectName,
  generateUniqueDomain 
} from './utils/file-utils'
import { sanitizeDomain } from './utils/file-utils'

/**
 * Core deploy processor for handling project deployment
 */
export class DeployProcessor {
  private progress: DeployProgress
  private startTime: number

  constructor(private params: DeployProcessorParams) {
    this.startTime = params.startTime
    this.progress = {
      status: 'processing',
      progress: 0,
      totalFiles: 0,
      processedFiles: 0,
      startTime: this.startTime
    }
  }

  /**
   * Process the deployment
   */
  async process(): Promise<DeployResult> {
    try {
      // Step 1: Generate file list
      const fileManifest = await this.generateFileManifest()
      this.progress.totalFiles = fileManifest.length
      this.progress.progress = 10

      // Step 2: Create directory structure
      const { projectDir, userFolderPath } = await this.createDirectoryStructure()
      this.progress.progress = 20

      // Step 3: Create all subdirectories first
      await createDirectoriesBatch(projectDir, fileManifest.map(f => f.path))
      this.progress.progress = 30

      // Step 4: Write files in parallel chunks
      await this.writeFilesInChunks(projectDir, fileManifest)
      this.progress.progress = 90

      // Step 5: Save metadata
      await this.saveMetadata(projectDir, fileManifest, userFolderPath)
      this.progress.progress = 100
      this.progress.status = 'completed'
      this.progress.endTime = Date.now()

      const totalTime = this.progress.endTime - this.startTime

      // Log success
      console.log(`✅ [DEPLOY-VPS] ${this.params.deployData.projectName}: ${fileManifest.length} files, ${totalTime}ms, ${Math.round(fileManifest.length / (totalTime / 1000))} files/sec`)

      return {
        success: true,
        projectId: this.params.projectId,
        projectName: this.params.deployData.projectName,
        folderPath: projectDir,
        fileCount: fileManifest.length,
        deployScriptPath: this.params.deployData.generateDeployScript ? this.getDeployScriptName() : null,
        userFolderPath: userFolderPath || null,
        filesystemPath: projectDir,
        deployTime: totalTime,
        optimized: true,
        vpsOptimized: VPS_CONFIG.VPS_SPECS
      }

    } catch (error) {
      this.progress.status = 'failed'
      this.progress.error = error instanceof Error ? error.message : 'Unknown error'
      this.progress.endTime = Date.now()
      throw error
    }
  }

  /**
   * Generate file manifest without loading content into memory
   */
  private async generateFileManifest(): Promise<FileManifestItem[]> {
    const { 
      projectName, 
      description, 
      includeAssets, 
      generateDeployScript, 
      serverType, 
      domain,
      themeParams
    } = this.params.deployData

    const manifest: FileManifestItem[] = [
      { path: 'index.html', type: 'template', template: 'html' },
      { path: 'assets/css/styles.css', type: 'template', template: 'css' },
      { path: 'assets/js/scripts.js', type: 'template', template: 'js' },
      { path: 'sitemap.xml', type: 'template', template: 'sitemap' },
      { path: 'robots.txt', type: 'template', template: 'robots' },
      { path: 'manifest.json', type: 'template', template: 'manifest' },
      { path: 'README.md', type: 'template', template: 'readme' }
    ]

    if (includeAssets) {
      // Add real images from theme content
      await this.addImageAssetsToManifest(manifest, themeParams)
      
      // Add placeholder images if no real images found
      if (!this.hasRealImages(manifest)) {
        manifest.push(
          { path: 'assets/images/hero-coffee.jpg', type: 'placeholder', content: '<!-- Placeholder for hero image -->' },
          { path: 'assets/images/logo.png', type: 'placeholder', content: '<!-- Placeholder for logo -->' },
          { path: 'assets/images/favicon.ico', type: 'placeholder', content: '<!-- Placeholder for favicon -->' }
        )
      }
    }

    if (generateDeployScript) {
      manifest.push({
        path: this.getDeployScriptName(),
        type: 'template',
        template: 'deploy-script',
        serverType,
        domain
      })
    }

    return manifest
  }

  /**
   * Create directory structure for the project
   */
  private async createDirectoryStructure(): Promise<{ projectDir: string, userFolderPath: string }> {
    const timestamp = Date.now()
    const baseDir = path.join(process.cwd(), FILE_PATHS.DEPLOY_BASE)
    let projectDir: string
    let userFolderPath = ''

    if (this.params.deployData.createUserFolder && this.params.userId) {
      userFolderPath = `${FILE_PATHS.USER_FOLDER_PREFIX}/${this.params.userId}/${this.params.deployData.projectName}-${timestamp}/`
      projectDir = path.join(baseDir, FILE_PATHS.USER_FOLDER_PREFIX, this.params.userId, `${this.params.deployData.projectName}-${timestamp}`)
    } else {
      projectDir = path.join(baseDir, `${this.params.deployData.projectName}-${timestamp}`)
    }

    await fs.mkdir(projectDir, { recursive: true })
    return { projectDir, userFolderPath }
  }

  /**
   * Write files in parallel chunks for optimal performance
   */
  private async writeFilesInChunks(projectDir: string, fileManifest: FileManifestItem[]): Promise<void> {
    await writeFilesInChunks(
      projectDir,
      fileManifest,
      this.generateFileContent.bind(this),
      (processed, total) => {
        this.progress.processedFiles = processed
        this.progress.progress = 30 + Math.floor((processed / total) * 60)
      },
      this.params.deployData.themeParams,
      this.params.deployData.projectName,
      this.params.deployData.description,
      this.params.deployData.serverType,
      this.params.deployData.domain,
      Date.now()
    )
  }

  /**
   * Generate content for a specific file
   */
  private async generateFileContent(
    fileInfo: FileManifestItem, 
    themeParams: any, 
    projectName: string, 
    description: string, 
    serverType?: string, 
    domain?: string, 
    timestamp?: number
  ): Promise<string> {
    return TemplateEngine.generateFileContent(
      fileInfo,
      themeParams,
      projectName,
      description,
      serverType,
      domain,
      timestamp
    )
  }

  /**
   * Save deployment metadata
   */
  private async saveMetadata(projectDir: string, fileManifest: FileManifestItem[], userFolderPath: string): Promise<void> {
    const metadataPath = path.join(projectDir, 'deploy-metadata.json')
    const metadata = {
      projectId: this.params.projectId,
      userId: this.params.userId,
      projectName: this.params.deployData.projectName,
      deployTime: new Date().toISOString(),
      fileCount: fileManifest.length,
      userFolderPath: userFolderPath || null,
      deployScriptPath: this.params.deployData.generateDeployScript ? this.getDeployScriptName() : null,
      serverType: this.params.deployData.serverType || null,
      domain: this.params.deployData.domain || null,
      includeAssets: this.params.deployData.includeAssets,
      version: '2.0-vps-optimized',
      vpsSpecs: VPS_CONFIG.VPS_SPECS,
      optimized: true
    }
    
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2))
  }

  /**
   * Add image assets to manifest from theme content
   */
  private async addImageAssetsToManifest(manifest: FileManifestItem[], themeParams: any): Promise<void> {
    const content = themeParams?.content || {}
    
    // Hero images
    if (content?.hero) {
      await this.addImageToManifest(manifest, content.hero.backgroundImage, 'assets/images/hero-bg.jpg')
      await this.addImageToManifest(manifest, content.hero.heroImage, 'assets/images/hero.jpg')
      await this.addImageToManifest(manifest, content.hero.image, 'assets/images/hero-alt.jpg')
      await this.addImageToManifest(manifest, content.hero.unsplashImageUrl, 'assets/images/hero-unsplash.jpg')
    }
    
    // Header logo
    if (content?.header?.logo) {
      await this.addImageToManifest(manifest, content.header.logo, 'assets/images/logo.png')
    }
    
    // Product images
    if (content?.products?.items) {
      for (let i = 0; i < content.products.items.length; i++) {
        const item = content.products.items[i]
        if (item.image) {
          await this.addImageToManifest(manifest, item.image, `assets/images/product-${i + 1}.jpg`)
        }
      }
    }
  }

  /**
   * Add single image to manifest
   */
  private async addImageToManifest(manifest: FileManifestItem[], imageUrl: string | undefined, targetPath: string): Promise<void> {
    if (!imageUrl) return
    
    // Check if it's an upload file
    if (imageUrl.startsWith('/uploads/')) {
      const sourcePath = path.join(process.cwd(), 'public', imageUrl)
      try {
        await fs.access(sourcePath)
        manifest.push({
          path: targetPath,
          type: 'copy',
          sourcePath: sourcePath
        })
      } catch (error) {
        console.warn(`Upload file not found: ${sourcePath}`)
      }
    }
    // Check if it's an external URL (Unsplash, etc.)
    else if (imageUrl.startsWith('http')) {
      manifest.push({
        path: targetPath,
        type: 'download',
        sourceUrl: imageUrl
      })
    }
  }

  /**
   * Check if manifest has real images
   */
  private hasRealImages(manifest: FileManifestItem[]): boolean {
    return manifest.some(item => item.type === 'copy' || item.type === 'download')
  }

  /**
   * Get deploy script name for server type
   */
  private getDeployScriptName(): string {
    const serverType = this.params.deployData.serverType || 'nginx'
    switch (serverType) {
      case 'nginx': return 'deploy-nginx.sh'
      case 'apache': return 'deploy-apache.sh'
      case 'node': return 'deploy-node.sh'
      case 'docker': return 'deploy-docker.sh'
      default: return 'deploy.sh'
    }
  }

  /**
   * Get current progress
   */
  getProgress(): DeployProgress {
    return { ...this.progress }
  }
}
