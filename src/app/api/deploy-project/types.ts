export interface DeployOptions {
  projectName: string
  description: string
  includeAssets: boolean
  createUserFolder: boolean
  generateDeployScript: boolean
  serverType: 'nginx' | 'apache' | 'node' | 'docker'
  domain: string
}

export interface DeployProgress {
  status: 'queued' | 'processing' | 'completed' | 'failed'
  progress: number
  totalFiles: number
  processedFiles: number
  startTime: number
  endTime?: number
  error?: string
}

export interface DeployData {
  projectId: string
  userId: string
  projectName: string
  description: string
  includeAssets: boolean
  createUserFolder: boolean
  generateDeployScript: boolean
  serverType: 'nginx' | 'apache' | 'node' | 'docker'
  domain: string
  themeParams?: any // Made optional since it will be loaded from project
}

export interface FileManifestItem {
  path: string
  type: 'template' | 'placeholder' | 'copy' | 'download'
  template?: string
  content?: string
  serverType?: string
  domain?: string
  sourcePath?: string
  sourceUrl?: string
}

export interface DeployProcessorParams {
  deployData: DeployData
  userId: string
  projectId: string
  startTime: number
}

export interface DeployResult {
  success: boolean
  projectId: string
  projectName: string
  folderPath: string
  fileCount: number
  deployScriptPath: string | null
  userFolderPath: string | null
  filesystemPath: string
  deployTime: number
  optimized: boolean
  vpsOptimized: string
}

export interface ThemeParams {
  content?: any
  colors?: any
  typography?: any
  layout?: any
  sections?: any
  components?: any
  projectLanguage?: string
}

export interface HtmlParams {
  projectName: string
  description: string
  themeParams: ThemeParams
}

export interface HeaderParams {
  content: any
  colors: any
  themeParams: ThemeParams
}

export interface HeroParams {
  content: any
  colors: any
  themeParams: ThemeParams
}

export interface LeadMagnetParams {
  content: any
  colors?: any
  themeParams: ThemeParams
}

export interface WhyChooseUsParams {
  content: any
  colors?: any
  themeParams: ThemeParams
}

export interface ProblemsParams {
  content: any
  colors: any
  themeParams: ThemeParams
}

export interface ProductsParams {
  content: any
  colors: any
  themeParams: ThemeParams
}

export interface TestimonialsParams {
  content: any
  colors: any
  themeParams: ThemeParams
}

export interface BlogParams {
  content: any
  colors?: any
  themeParams: ThemeParams
}

export interface DeployScriptParams {
  projectName: string
  serverType: string
  domain?: string
  timestamp?: number
}

export interface NginxParams {
  projectName: string
  domain: string
}

export interface ApacheParams {
  projectName: string
  domain: string
}

export interface NodeParams {
  projectName: string
}

export interface DockerParams {
  projectName: string
  domain: string
}
