/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server'
import JSZip from 'jszip'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import path from 'path'
import fs from 'fs/promises'
import { ThemeParams } from '@/types'

interface ExportOptions {
  projectName: string
  description: string
  framework: 'react' | 'nextjs' | 'static-html' | 'html'
  typescript: boolean
  cssFramework: 'tailwind' | 'styled-components' | 'css-modules'
  includeAssets: boolean
}

interface ThemeParamsType {
  colors?: Record<string, string>
  content?: Record<string, any>
  sections?: Record<string, any>
  [key: string]: any
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  console.log('🚀 [EXPORT] Starting project export process...')
  
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { 
      projectId, 
      userId,
      projectName, 
      description, 
      framework, 
      typescript, 
      cssFramework, 
      includeAssets,
      createGitHubRepo,
      githubRepoName,
      githubPrivate,
      deployToVercel,
      createUserFolder,
      generateDeployScript,
      serverType,
      themeParams 
    } = await request.json()

    console.log('📋 [EXPORT] Export configuration:', {
      projectId,
      userId,
      projectName,
      framework,
      typescript,
      cssFramework,
      includeAssets,
      createGitHubRepo,
      deployToVercel,
      createUserFolder,
      generateDeployScript,
      serverType
    })

    // Validate required fields
    if (!projectId || !projectName || !themeParams) {
      console.error('❌ [EXPORT] Missing required fields')
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('✅ [EXPORT] Validation passed')

    // Step 1: Generate project files
    console.log('📁 [EXPORT] Step 1: Generating project files...')
    
    let projectFiles: Record<string, string>
    
    if (framework === 'static-html' || framework === 'html') {
      // Generate static HTML files
      console.log('🔄 [EXPORT] Generating static HTML files...')
      projectFiles = await generateStaticHtmlFiles({
        projectName,
        description,
        includeAssets,
        themeParams
      })
    } else {
      // Generate React/Next.js files (existing logic)
      const mappedFramework = framework === 'react' ? 'react-vite' : framework
      console.log('🔄 [EXPORT] Framework mapping:', { original: framework, mapped: mappedFramework })
      
      projectFiles = await generateProjectFiles({
        projectName,
        description,
        framework: mappedFramework,
        typescript,
        cssFramework,
        includeAssets,
        themeParams
      })
    }
    
    console.log(`✅ [EXPORT] Generated ${Object.keys(projectFiles).length} files`)

    // Step 1.5: Add deploy script if requested
    let deployScriptPath = ''
    if (generateDeployScript) {
      console.log('📜 [EXPORT] Adding deploy script...')
      const deployScript = generateDeployScript_func(projectName, serverType, framework)
      const scriptName = getDeployScriptName(serverType)
      projectFiles[scriptName] = deployScript
      deployScriptPath = scriptName
      console.log(`✅ [EXPORT] Deploy script added: ${scriptName}`)
    }

    // Step 2: Create ZIP file (with user folder structure if requested)
    console.log('🗜️ [EXPORT] Step 2: Creating ZIP archive...')
    const zip = new JSZip()
    
    // Create user-specific folder structure if requested
    let userFolderPath = ''
    if (createUserFolder && userId) {
      userFolderPath = `users/${userId}/${projectName}-${Date.now()}/`
      console.log(`📁 [EXPORT] Creating user folder: ${userFolderPath}`)
    }
    
    for (const [filePath, content] of Object.entries(projectFiles)) {
      const finalPath = createUserFolder ? userFolderPath + filePath : filePath
      zip.file(finalPath, content)
      console.log(`📄 [EXPORT] Added to ZIP: ${finalPath}`)
    }

    const zipBuffer = await zip.generateAsync({ type: 'arraybuffer' })
    console.log(`✅ [EXPORT] ZIP created successfully (${zipBuffer.byteLength} bytes)`)

    // Step 3: Store ZIP for download
    console.log('💾 [EXPORT] Step 3: Storing ZIP for download...')
    
    // Tạo thư mục exports nếu chưa có
    const exportsDir = path.join(process.cwd(), 'public', 'exports')
    const userExportsDir = path.join(exportsDir, 'users', userId)
    const projectDir = path.join(userExportsDir, `${projectName}-${Date.now()}`)
    
    try {
      await fs.mkdir(projectDir, { recursive: true })
      console.log(`📁 [EXPORT] Created directory: ${projectDir}`)
      
      // Lưu ZIP file vào filesystem
      const zipPath = path.join(projectDir, `${projectName}.zip`)
      await fs.writeFile(zipPath, Buffer.from(zipBuffer))
      console.log(`💾 [EXPORT] ZIP saved to: ${zipPath}`)
      
      // Lưu metadata
      const metadataPath = path.join(projectDir, 'metadata.json')
      const metadata = {
        projectId,
        userId,
        projectName,
        exportTime: new Date().toISOString(),
        fileSize: zipBuffer.byteLength,
        fileCount: Object.keys(projectFiles).length,
        userFolderPath: userFolderPath || null,
        deployScriptPath: deployScriptPath || null,
        framework,
        serverType: serverType || null
      }
      await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2))
      console.log(`📄 [EXPORT] Metadata saved to: ${metadataPath}`)
      
      // Vẫn lưu trong memory để download
      if (!global.projectExports) {
        global.projectExports = {}
      }
      global.projectExports[projectId] = zipBuffer
      
      console.log(`✅ [EXPORT] ZIP stored for project ${projectId}`)
      console.log(`📂 [EXPORT] Files saved to filesystem: ${projectDir}`)
      
    } catch (error) {
      console.error('❌ [EXPORT] Failed to save to filesystem:', error)
      // Fallback to memory only
      if (!global.projectExports) {
        global.projectExports = {}
      }
      global.projectExports[projectId] = zipBuffer
      console.log(`✅ [EXPORT] ZIP stored in memory only for project ${projectId}`)
    }

    // Step 4: GitHub Integration (skip for static HTML)
    let githubResult = null
    if (createGitHubRepo && framework !== 'static-html' && framework !== 'html') {
      console.log('🐙 [EXPORT] Step 4: Creating GitHub repository...')
      try {
        const githubResponse = await fetch(`${request.nextUrl.origin}/api/create-github-repo`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId,
            repoName: githubRepoName || projectName,
            description,
            private: githubPrivate,
            projectFiles
          })
        })
        githubResult = await githubResponse.json()
        console.log('✅ [EXPORT] GitHub repository created:', githubResult)
      } catch (error) {
        console.error('❌ [EXPORT] GitHub creation failed:', error)
        githubResult = { success: false, error: 'GitHub creation failed' }
      }
    } else {
      console.log('⏭️ [EXPORT] Step 4: Skipping GitHub creation')
    }

    // Step 5: Vercel Deployment (skip for static HTML)
    let vercelResult = null
    if (deployToVercel && githubResult?.success && framework !== 'static-html' && framework !== 'html') {
      console.log('🚀 [EXPORT] Step 5: Deploying to Vercel...')
      try {
        const vercelResponse = await fetch(`${request.nextUrl.origin}/api/deploy-vercel`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId,
            repoUrl: githubResult.repoUrl,
            projectName,
            framework
          })
        })
        vercelResult = await vercelResponse.json()
        console.log('✅ [EXPORT] Vercel deployment successful:', vercelResult)
      } catch (error) {
        console.error('❌ [EXPORT] Vercel deployment failed:', error)
        vercelResult = { success: false, error: 'Vercel deployment failed' }
      }
    } else {
      console.log('⏭️ [EXPORT] Step 5: Skipping Vercel deployment')
    }

    // Calculate total time
    const totalTime = Date.now() - startTime
    console.log(`⏱️ [EXPORT] Total export time: ${totalTime}ms`)

    // Return success response
    const response = {
      success: true,
      projectId,
      projectName,
      downloadUrl: `/api/download-project/${projectId}`,
      fileSize: zipBuffer.byteLength,
      fileCount: Object.keys(projectFiles).length,
      github: githubResult,
      vercel: vercelResult,
      deployScriptPath: deployScriptPath || null,
      userFolderPath: userFolderPath || null,
      filesystemPath: projectDir || null, // Thêm đường dẫn filesystem
      exportTime: totalTime,
      isStaticHtml: framework === 'static-html' || framework === 'html'
    }

    console.log('🎉 [EXPORT] Export completed successfully:', {
      projectName,
      fileSize: `${(zipBuffer.byteLength / 1024).toFixed(2)}KB`,
      fileCount: Object.keys(projectFiles).length,
      githubSuccess: githubResult?.success,
      vercelSuccess: vercelResult?.success,
      isStaticHtml: framework === 'static-html' || framework === 'html'
    })

    return NextResponse.json(response)

  } catch (error) {
    const totalTime = Date.now() - startTime
    console.error('💥 [EXPORT] Export failed after', totalTime, 'ms:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Export failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        exportTime: totalTime
      },
      { status: 500 }
    )
  }
}

// Function to generate React/Next.js project files
async function generateProjectFiles({
  projectName,
  description,
  framework,
  typescript,
  cssFramework,
  includeAssets,
  themeParams
}: {
  projectName: string
  description: string
  framework: string
  typescript: boolean
  cssFramework: string
  includeAssets: boolean
  themeParams: any
}) {
  console.log('🔧 [EXPORT] Generating React/Next.js project files...')

  const files: Record<string, string> = {}
  
  // Package.json
  files['package.json'] = generatePackageJson(projectName, description, framework, typescript, cssFramework)
  
  // Main App component
  if (framework === 'react-vite') {
    files['src/App.tsx'] = generateReactApp(themeParams, typescript)
    files['src/main.tsx'] = generateReactMain()
    files['index.html'] = generateViteHtml(projectName)
    files['vite.config.ts'] = generateViteConfig()
  } else if (framework === 'nextjs') {
    files['src/app/page.tsx'] = generateNextjsPage(themeParams, typescript)
    files['src/app/layout.tsx'] = generateNextjsLayout(projectName, description)
    files['next.config.js'] = generateNextConfig()
  }
  
  // Styles
  if (cssFramework === 'tailwind') {
    files['tailwind.config.js'] = generateTailwindConfig()
    files['src/styles/globals.css'] = generateTailwindCSS(themeParams)
  } else {
    files['src/styles/globals.css'] = generateVanillaCSS(themeParams)
  }
  
  // Components
  files['src/components/VietnamCoffeeTheme.tsx'] = generateThemeComponent(themeParams, typescript)
  
  // TypeScript config
  if (typescript) {
    files['tsconfig.json'] = generateTsConfig(framework)
  }
  
  // README
  files['README.md'] = generateReactReadme(projectName, description, framework)
  
  console.log(`✅ [EXPORT] Generated ${Object.keys(files).length} React/Next.js files`)
  return files
}

// New function to generate static HTML files
async function generateStaticHtmlFiles({
  projectName,
  description,
  includeAssets,
  themeParams
}: {
  projectName: string
  description: string
  includeAssets: boolean
  themeParams: any
}) {
  console.log('🔧 [EXPORT] Generating static HTML files...')

  const files: Record<string, string> = {}
  
  // Generate main HTML file
  console.log('📄 [EXPORT] Generating index.html...')
  files['index.html'] = generateStaticHtml(projectName, description, themeParams)
  
  // Generate separate CSS file
  console.log('🎨 [EXPORT] Generating styles.css...')
  files['assets/css/styles.css'] = generateStaticCss(themeParams)
  
  // Generate JavaScript file for interactivity
  console.log('⚡ [EXPORT] Generating scripts.js...')
  files['assets/js/scripts.js'] = generateStaticJs()
  
  // Generate SEO files
  console.log('🔍 [EXPORT] Generating SEO files...')
  files['sitemap.xml'] = generateSitemapFile(projectName, themeParams)
  files['robots.txt'] = generateRobotsTxtFile()
  files['manifest.json'] = generateManifestFile(projectName, themeParams)
  
  // Generate README
  console.log('📖 [EXPORT] Generating README...')
  files['README.md'] = generateStaticReadme(projectName, description)
  
  // If includeAssets, add placeholder images
  if (includeAssets) {
    console.log('🖼️ [EXPORT] Adding placeholder assets...')
    files['assets/images/hero-coffee.jpg'] = '<!-- Placeholder for hero image -->'
    files['assets/images/logo.png'] = '<!-- Placeholder for logo -->'
    files['assets/images/favicon.ico'] = '<!-- Placeholder for favicon -->'
  }

  console.log(`✅ [EXPORT] Generated ${Object.keys(files).length} static files`)
  return files
}

// Generate main HTML file with embedded CSS
function generateStaticHtml(projectName: string, description: string, themeParams: any) {
  const content = themeParams?.content || {}
  const colors = themeParams?.colors || {}
  
  const metaTitle = content?.meta?.title || projectName
  const metaDescription = content?.meta?.description || description
  const metaKeywords = content?.meta?.keywords || 'business, website, professional'
  const companyName = content?.header?.title || projectName
  
  return `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${metaTitle}</title>
    <meta name="description" content="${metaDescription}">
    <meta name="keywords" content="${metaKeywords}">
    <meta name="author" content="${companyName}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="${metaTitle}">
    <meta property="og:description" content="${metaDescription}">
    <meta property="og:url" content="/">
    <meta property="og:site_name" content="${companyName}">
    <meta property="og:locale" content="vi_VN">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${metaTitle}">
    <meta name="twitter:description" content="${metaDescription}">
    
    <!-- Additional SEO Meta Tags -->
    <meta name="robots" content="index, follow">
    <meta name="googlebot" content="index, follow">
    <meta name="format-detection" content="telephone=no">
    <meta name="theme-color" content="${colors.primary || '#8B4513'}">
    
    <!-- Favicon -->
    <link rel="icon" href="assets/images/favicon.ico">
    <link rel="apple-touch-icon" href="assets/images/favicon.ico">
    <link rel="manifest" href="manifest.json">
    
    <!-- Preconnect to external resources -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Stylesheets -->
    <link rel="stylesheet" href="assets/css/styles.css">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "${companyName}",
      "description": "${metaDescription}",
      "url": "/",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "${content?.footer?.contact?.phone || ''}",
        "email": "${content?.footer?.contact?.email || ''}",
        "contactType": "customer service"
      },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Vietnam",
        "addressCountry": "VN"
      }
    }
    </script>
</head>
<body>
    <!-- Skip to main content for accessibility -->
    <a href="#main-content" class="sr-only">Skip to main content</a>
    
    <!-- Header -->
    ${generateStaticHeader(content, colors)}
    
    <!-- Main Content -->
    <main id="main-content">
        <!-- Hero Section -->
        ${generateStaticHeroSection(content, colors)}
        
        <!-- About Section -->
        ${generateStaticAboutSection(content, colors)}
        
        <!-- Problems Section -->
        ${generateStaticProblemsSection(content, colors)}
        
        <!-- Solutions Section -->
        ${generateStaticSolutionsSection(content, colors)}
        
        <!-- Products Section -->
        ${generateStaticProductsSection(content, colors)}
    </main>
    
    <!-- Footer -->
    ${generateStaticFooter(content, colors)}
    
    <!-- Scripts -->
    <script src="assets/js/scripts.js"></script>
</body>
</html>`
}

// Generate static CSS file
function generateStaticCss(themeParams: any) {
  const colors = themeParams?.colors || {}
  
  return `/* CSS Reset */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* CSS Variables */
:root {
    --color-primary: ${colors.primary || '#8B4513'};
    --color-secondary: ${colors.secondary || '#D2691E'};
    --color-accent: ${colors.accent || '#CD853F'};
    --color-background: ${colors.background || '#F5F5DC'};
    --color-text: ${colors.text || '#2D3748'};
    --color-text-light: ${colors.textLight || '#718096'};
    --color-white: #FFFFFF;
    --color-black: #000000;
    
    --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --font-size-lg: 1.125rem;
    --font-size-xl: 1.25rem;
    --font-size-2xl: 1.5rem;
    --font-size-3xl: 1.875rem;
    --font-size-4xl: 2.25rem;
    --font-size-5xl: 3rem;
    
    --spacing-1: 0.25rem;
    --spacing-2: 0.5rem;
    --spacing-3: 0.75rem;
    --spacing-4: 1rem;
    --spacing-6: 1.5rem;
    --spacing-8: 2rem;
    --spacing-12: 3rem;
    --spacing-16: 4rem;
    --spacing-20: 5rem;
    
    --border-radius: 0.5rem;
    --border-radius-lg: 0.75rem;
    --box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    --box-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Base Styles */
body {
    font-family: var(--font-family);
    line-height: 1.6;
    color: var(--color-text);
    background-color: var(--color-background);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

/* Accessibility */
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

.sr-only:focus {
    position: static;
    width: auto;
    height: auto;
    padding: var(--spacing-2) var(--spacing-4);
    margin: 0;
    overflow: visible;
    clip: auto;
    white-space: normal;
    background-color: var(--color-primary);
    color: var(--color-white);
    text-decoration: none;
    border-radius: var(--border-radius);
    z-index: 1000;
}

/* Container */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--spacing-4);
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: var(--spacing-4);
}

h1 { font-size: var(--font-size-5xl); }
h2 { font-size: var(--font-size-4xl); }
h3 { font-size: var(--font-size-3xl); }
h4 { font-size: var(--font-size-2xl); }
h5 { font-size: var(--font-size-xl); }
h6 { font-size: var(--font-size-lg); }

p {
    margin-bottom: var(--spacing-4);
}

/* Buttons */
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-3) var(--spacing-6);
    border: none;
    border-radius: var(--border-radius);
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: var(--font-size-base);
}

.btn-primary {
    background-color: var(--color-primary);
    color: var(--color-white);
}

.btn-primary:hover {
    background-color: var(--color-secondary);
    transform: translateY(-2px);
}

.btn-secondary {
    background-color: transparent;
    color: var(--color-white);
    border: 2px solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
}

.btn-accent {
    background-color: var(--color-accent);
    color: var(--color-white);
}

.btn-accent:hover {
    background-color: var(--color-secondary);
}

/* Grid System */
.grid {
    display: grid;
    gap: var(--spacing-8);
}

.grid-1 { grid-template-columns: 1fr; }
.grid-2 { grid-template-columns: repeat(2, 1fr); }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.grid-4 { grid-template-columns: repeat(4, 1fr); }

/* Responsive Grid */
@media (max-width: 768px) {
    .grid-2, .grid-3, .grid-4 {
        grid-template-columns: 1fr;
    }
}

@media (min-width: 769px) and (max-width: 1024px) {
    .grid-4 {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* Cards */
.card {
    background: var(--color-white);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--box-shadow);
    padding: var(--spacing-8);
    transition: all 0.3s ease;
}

.card:hover {
    box-shadow: var(--box-shadow-lg);
    transform: translateY(-4px);
}

/* Header Styles */
.header {
    background-color: var(--color-secondary);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: var(--box-shadow);
}

.header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-4) 0;
}

.logo {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    color: var(--color-white);
    text-decoration: none;
}

.logo-icon {
    width: 40px;
    height: 40px;
    background-color: var(--color-accent);
    border-radius: var(--border-radius);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
}

.nav {
    display: flex;
    gap: var(--spacing-8);
}

.nav a {
    color: var(--color-white);
    text-decoration: none;
    font-weight: 500;
    transition: opacity 0.3s ease;
}

.nav a:hover {
    opacity: 0.8;
}

.header-cta {
    display: flex;
    gap: var(--spacing-3);
}

/* Mobile Menu */
.mobile-menu-btn {
    display: none;
    background: none;
    border: none;
    color: var(--color-white);
    font-size: 1.5rem;
    cursor: pointer;
}

.mobile-menu {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: var(--color-secondary);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding: var(--spacing-4);
}

.mobile-menu.active {
    display: block;
}

.mobile-nav {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
    margin-bottom: var(--spacing-4);
}

.mobile-cta {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2);
}

/* Hero Section */
.hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    color: var(--color-white);
    text-align: center;
    overflow: hidden;
}

.hero-content {
    position: relative;
    z-index: 2;
    max-width: 800px;
}

.hero h1 {
    font-size: clamp(2.5rem, 5vw, 4rem);
    margin-bottom: var(--spacing-6);
    animation: fadeInUp 1s ease;
}

.hero .subtitle {
    font-size: var(--font-size-2xl);
    margin-bottom: var(--spacing-8);
    opacity: 0.9;
    animation: fadeInUp 1s ease 0.2s both;
}

.hero-cta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-4);
    justify-content: center;
    margin-bottom: var(--spacing-12);
    animation: fadeInUp 1s ease 0.4s both;
}

.trust-indicators {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: var(--spacing-8);
    margin-top: var(--spacing-12);
    animation: fadeInUp 1s ease 0.6s both;
}

.trust-indicator {
    text-align: center;
}

.trust-number {
    font-size: var(--font-size-3xl);
    font-weight: 700;
    color: var(--color-accent);
    margin-bottom: var(--spacing-2);
}

.trust-label {
    font-size: var(--font-size-sm);
    opacity: 0.8;
}

/* Section Styles */
.section {
    padding: var(--spacing-20) 0;
}

.section-header {
    text-align: center;
    margin-bottom: var(--spacing-12);
}

.section-title {
    font-size: var(--font-size-4xl);
    margin-bottom: var(--spacing-4);
}

.section-description {
    font-size: var(--font-size-xl);
    color: var(--color-text-light);
    max-width: 600px;
    margin: 0 auto;
}

/* About Section */
.about {
    background-color: var(--color-white);
}

.feature {
    text-align: center;
}

.feature-icon {
    width: 64px;
    height: 64px;
    background-color: var(--color-accent);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto var(--spacing-4);
    font-size: 2rem;
    color: var(--color-white);
}

/* Problems Section */
.problems {
    background-color: #F8F8F8;
}

.problem-card {
    position: relative;
}

.problem-number {
    width: 48px;
    height: 48px;
    background-color: var(--color-accent);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto var(--spacing-4);
    font-weight: 700;
    color: var(--color-white);
}

/* Solutions Section */
.solutions {
    background-color: var(--color-white);
}

.solution-card {
    border-left: 4px solid var(--color-accent);
}

.solution-benefit {
    background-color: rgba(205, 133, 63, 0.1);
    color: var(--color-accent);
    padding: var(--spacing-3);
    border-radius: var(--border-radius);
    font-weight: 600;
    text-align: center;
    margin-top: var(--spacing-4);
}

/* Products Section */
.products {
    background-color: #F8F8F8;
}

.product-card {
    overflow: hidden;
}

.product-image {
    height: 200px;
    background: linear-gradient(135deg, rgba(205, 133, 63, 0.2), rgba(139, 69, 19, 0.2));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 4rem;
    margin-bottom: var(--spacing-6);
}

.product-category {
    display: inline-block;
    background-color: var(--color-accent);
    color: var(--color-white);
    padding: var(--spacing-1) var(--spacing-3);
    border-radius: 999px;
    font-size: var(--font-size-sm);
    font-weight: 600;
    margin-bottom: var(--spacing-3);
}

.product-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: var(--spacing-4);
}

.product-price {
    font-size: var(--font-size-xl);
    font-weight: 700;
    color: var(--color-accent);
}

/* Footer */
.footer {
    background-color: var(--color-secondary);
    color: var(--color-white);
    padding: var(--spacing-16) 0 var(--spacing-8);
}

.footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-8);
    margin-bottom: var(--spacing-12);
}

.footer-section h4 {
    margin-bottom: var(--spacing-4);
}

.footer-links {
    list-style: none;
}

.footer-links li {
    margin-bottom: var(--spacing-2);
}

.footer-links a {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    transition: opacity 0.3s ease;
}

.footer-links a:hover {
    opacity: 1;
}

.contact-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    margin-bottom: var(--spacing-3);
}

.social-links {
    display: flex;
    gap: var(--spacing-3);
    margin-top: var(--spacing-4);
}

.social-link {
    width: 40px;
    height: 40px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: var(--border-radius);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-white);
    text-decoration: none;
    transition: background-color 0.3s ease;
}

.social-link:hover {
    background-color: rgba(255, 255, 255, 0.2);
}

.newsletter {
    margin-top: var(--spacing-6);
}

.newsletter-form {
    display: flex;
    gap: var(--spacing-2);
    margin-top: var(--spacing-3);
}

.newsletter-input {
    flex: 1;
    padding: var(--spacing-3);
    border: none;
    border-radius: var(--border-radius);
    background-color: rgba(255, 255, 255, 0.1);
    color: var(--color-white);
}

.newsletter-input::placeholder {
    color: rgba(255, 255, 255, 0.6);
}

.footer-bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    padding-top: var(--spacing-8);
    display: flex;
    justify-content: between;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--spacing-4);
}

.footer-links-bottom {
    display: flex;
    gap: var(--spacing-6);
}

/* Animations */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fadeInUp 1s ease;
}

/* Responsive Design */
@media (max-width: 768px) {
    .nav, .header-cta {
        display: none;
    }
    
    .mobile-menu-btn {
        display: block;
    }
    
    .hero h1 {
        font-size: 2.5rem;
    }
    
    .hero-cta {
        flex-direction: column;
        align-items: center;
    }
    
    .trust-indicators {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .section {
        padding: var(--spacing-12) 0;
    }
    
    .footer-bottom {
        flex-direction: column;
        text-align: center;
    }
    
    .footer-links-bottom {
        justify-content: center;
    }
}

@media (max-width: 480px) {
    .container {
        padding: 0 var(--spacing-2);
    }
    
    .hero h1 {
        font-size: 2rem;
    }
    
    .section-title {
        font-size: var(--font-size-3xl);
    }
    
    .trust-indicators {
        grid-template-columns: 1fr;
    }
}

/* Print Styles */
@media print {
    .header, .footer, .mobile-menu {
        display: none;
    }
    
    .hero {
        min-height: auto;
        page-break-inside: avoid;
    }
    
    .section {
        page-break-inside: avoid;
        padding: var(--spacing-8) 0;
    }
}`
}

// Generate static JavaScript file
function generateStaticJs() {
  return `// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.remove('active');
            }
        });
    }
    
    // Smooth scrolling for anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (mobileMenu) {
                    mobileMenu.classList.remove('active');
                }
            }
        });
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.card, .feature, .trust-indicator');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Contact form submission (placeholder)
    const contactForms = document.querySelectorAll('form');
    contactForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.');
        });
    });
    
    // Newsletter subscription (placeholder)
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('.newsletter-input').value;
            if (email) {
                alert('Cảm ơn bạn đã đăng ký nhận tin! Email: ' + email);
                this.querySelector('.newsletter-input').value = '';
            }
        });
    }
});

// Utility functions
function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
    }
}

// Back to top functionality
function createBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.cssText = \`
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: var(--color-primary);
        color: var(--color-white);
        border: none;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
    \`;
    
    document.body.appendChild(backToTopBtn);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize back to top button
createBackToTop();`
}

// Generate static HTML sections
function generateStaticHeader(content: any, colors: any) {
  const headerContent = content?.header || {}
  
  return `<header class="header">
        <div class="container">
            <div class="header-content">
                <a href="#" class="logo">
                    <div class="logo-icon">☕</div>
                    <div>
                        <div style="font-size: 1.25rem; font-weight: 700;">${headerContent.title || 'Cà Phê Việt'}</div>
                        <div style="font-size: 0.75rem; opacity: 0.8;">${headerContent.subtitle || 'Premium Export Coffee'}</div>
                    </div>
                </a>
                
                <nav class="nav">
                    <a href="#main-content">Trang chủ</a>
                    <a href="#about">Về chúng tôi</a>
                    <a href="#products">Sản phẩm</a>
                    <a href="#contact">Liên hệ</a>
                </nav>
                
                <div class="header-cta">
                    <a href="#contact" class="btn btn-secondary">⬇️ Cẩm nang XNK 2024</a>
                    <a href="#contact" class="btn btn-accent">📞 Tư vấn miễn phí</a>
                </div>
                
                <button class="mobile-menu-btn" onclick="toggleMobileMenu()">☰</button>
            </div>
            
            <div class="mobile-menu">
                <nav class="mobile-nav">
                    <a href="#main-content">Trang chủ</a>
                    <a href="#about">Về chúng tôi</a>
                    <a href="#products">Sản phẩm</a>
                    <a href="#contact">Liên hệ</a>
                </nav>
                <div class="mobile-cta">
                    <a href="#contact" class="btn btn-secondary">⬇️ Cẩm nang XNK 2024</a>
                    <a href="#contact" class="btn btn-accent">📞 Tư vấn miễn phí</a>
                </div>
            </div>
        </div>
    </header>`
}

function generateStaticHeroSection(content: any, colors: any) {
  const heroContent = content?.hero || {}
  
  return `<section class="hero">
        <div class="container">
            <div class="hero-content">
                <h1>
                    ${heroContent.title || 'Cà Phê Việt Nam - Chất Lượng Quốc Tế'}
                    <span class="subtitle" style="display: block; background: linear-gradient(to right, ${colors.accent || '#D2691E'}, ${colors.primary || '#8B4513'}); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">
                        ${heroContent.subtitle || 'Xuất khẩu cà phê chất lượng cao'}
                    </span>
                </h1>
                
                <p class="subtitle">
                    ${heroContent.description || 'Chúng tôi chuyên cung cấp các loại cà phê Việt Nam chất lượng cao cho thị trường quốc tế, đảm bảo hương vị đặc trưng và tiêu chuẩn xuất khẩu.'}
                </p>

                <div class="hero-cta">
                    <a href="#about" class="btn btn-accent">
                        ${heroContent.ctaText || 'Tìm hiểu thêm'} →
                    </a>
                    <a href="#contact" class="btn btn-secondary">
                        ⬇️ Hướng dẫn XNK từ A-Z
                    </a>
                </div>

                <div class="trust-indicators">
                    <div class="trust-indicator">
                        <div class="trust-number">500+</div>
                        <div class="trust-label">Đơn hàng thành công</div>
                    </div>
                    <div class="trust-indicator">
                        <div class="trust-number">15</div>
                        <div class="trust-label">Năm kinh nghiệm</div>
                    </div>
                    <div class="trust-indicator">
                        <div class="trust-number">100+</div>
                        <div class="trust-label">Đối tác Mỹ</div>
                    </div>
                    <div class="trust-indicator">
                        <div class="trust-number">24/7</div>
                        <div class="trust-label">Hỗ trợ khách hàng</div>
                    </div>
                </div>
            </div>
        </div>
    </section>`
}

function generateStaticAboutSection(content: any, colors: any) {
  const aboutContent = content?.about || {}
  
  return `<section id="about" class="section about">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">${aboutContent.title || 'Về Chúng Tôi'}</h2>
                <p class="section-description">
                    ${aboutContent.description || 'Với hơn 20 năm kinh nghiệm trong ngành cà phê, chúng tôi tự hào là một trong những nhà cung cấp cà phê hàng đầu Việt Nam.'}
                </p>
            </div>
            
            <div class="grid grid-3">
                <div class="feature">
                    <div class="feature-icon">🌱</div>
                    <h3>Nguyên Liệu Tự Nhiên</h3>
                    <p>100% hạt cà phê Arabica và Robusta được trồng tại các vùng cao nguyên Việt Nam</p>
                </div>
                
                <div class="feature">
                    <div class="feature-icon">⭐</div>
                    <h3>Chất Lượng Cao</h3>
                    <p>Quy trình sản xuất hiện đại, đạt tiêu chuẩn quốc tế ISO 22000</p>
                </div>
                
                <div class="feature">
                    <div class="feature-icon">🌍</div>
                    <h3>Xuất Khẩu Toàn Cầu</h3>
                    <p>Sản phẩm có mặt tại hơn 20 quốc gia trên thế giới</p>
                </div>
            </div>
        </div>
    </section>`
}

function generateStaticProblemsSection(content: any, colors: any) {
  const problemsContent = content?.problems || {}
  
  return `<section class="section problems">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">${problemsContent.title || 'Thách Thức Của Thị Trường'}</h2>
                <p class="section-description">
                    ${problemsContent.description || 'Những vấn đề mà khách hàng thường gặp phải khi tìm kiếm nhà cung cấp cà phê chất lượng'}
                </p>
            </div>
            
            <div class="grid grid-3">
                <div class="card problem-card">
                    <div class="problem-number">1</div>
                    <h3>Chất lượng không đồng đều</h3>
                    <p>Nhiều nhà cung cấp cà phê không đảm bảo chất lượng ổn định</p>
                </div>
                
                <div class="card problem-card">
                    <div class="problem-number">2</div>
                    <h3>Giá cả không minh bạch</h3>
                    <p>Khó khăn trong việc so sánh giá và chất lượng sản phẩm</p>
                </div>
                
                <div class="card problem-card">
                    <div class="problem-number">3</div>
                    <h3>Dịch vụ hậu mại kém</h3>
                    <p>Thiếu hỗ trợ và tư vấn chuyên nghiệp sau khi mua hàng</p>
                </div>
            </div>
        </div>
    </section>`
}

function generateStaticSolutionsSection(content: any, colors: any) {
  const solutionsContent = content?.solutions || {}
  
  return `<section class="section solutions">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">${solutionsContent.title || 'Giải Pháp Của Chúng Tôi'}</h2>
                <p class="section-description">
                    ${solutionsContent.description || 'Cam kết mang đến giải pháp toàn diện cho mọi nhu cầu cà phê của bạn'}
                </p>
            </div>
            
            <div class="grid grid-3">
                <div class="card solution-card">
                    <div class="feature-icon">✓</div>
                    <h3>Kiểm soát chất lượng nghiêm ngặt</h3>
                    <p>Quy trình 7 bước kiểm tra chất lượng từ khâu thu mua đến sản phẩm hoàn thiện</p>
                    <div class="solution-benefit">
                        Đảm bảo 100% sản phẩm đạt tiêu chuẩn xuất khẩu
                    </div>
                </div>
                
                <div class="card solution-card">
                    <div class="feature-icon">✓</div>
                    <h3>Hệ thống giá minh bạch</h3>
                    <p>Báo giá chi tiết, rõ ràng theo từng loại sản phẩm và số lượng</p>
                    <div class="solution-benefit">
                        Tiết kiệm 15-20% chi phí so với đối thủ cùng chất lượng
                    </div>
                </div>
                
                <div class="card solution-card">
                    <div class="feature-icon">✓</div>
                    <h3>Hỗ trợ 24/7</h3>
                    <p>Đội ngũ chuyên gia tư vấn và hỗ trợ khách hàng mọi lúc</p>
                    <div class="solution-benefit">
                        Giải quyết mọi vấn đề trong vòng 2 giờ
                    </div>
                </div>
            </div>
        </div>
    </section>`
}

function generateStaticProductsSection(content: any, colors: any) {
  const productsContent = content?.products || {}
  
  return `<section id="products" class="section products">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">${productsContent.title || 'Sản Phẩm Của Chúng Tôi'}</h2>
                <p class="section-description">
                    ${productsContent.description || 'Đa dạng các loại cà phê chất lượng cao, phù hợp với mọi nhu cầu'}
                </p>
            </div>
            
            <div class="grid grid-4">
                <div class="card product-card">
                    <div class="product-image">☕</div>
                    <div class="product-category">Rang xay</div>
                    <h3>Cà Phê Arabica Premium</h3>
                    <p>Hạt cà phê Arabica cao cấp từ vùng núi Cầu Đất, Đà Lạt</p>
                    <div class="product-footer">
                        <span class="product-price">350.000 VNĐ/kg</span>
                        <a href="#contact" class="btn btn-accent">Đặt hàng</a>
                    </div>
                </div>
                
                <div class="card product-card">
                    <div class="product-image">☕</div>
                    <div class="product-category">Rang xay</div>
                    <h3>Cà Phê Robusta Đặc Biệt</h3>
                    <p>Robusta thơm đậm từ vùng cao nguyên Kon Tum</p>
                    <div class="product-footer">
                        <span class="product-price">280.000 VNĐ/kg</span>
                        <a href="#contact" class="btn btn-accent">Đặt hàng</a>
                    </div>
                </div>
                
                <div class="card product-card">
                    <div class="product-image">☕</div>
                    <div class="product-category">Pha chế</div>
                    <h3>Blend Coffee House</h3>
                    <p>Hỗn hợp cà phê độc quyền cho quán café</p>
                    <div class="product-footer">
                        <span class="product-price">320.000 VNĐ/kg</span>
                        <a href="#contact" class="btn btn-accent">Đặt hàng</a>
                    </div>
                </div>
                
                <div class="card product-card">
                    <div class="product-image">☕</div>
                    <div class="product-category">Hòa tan</div>
                    <h3>Instant Coffee Premium</h3>
                    <p>Cà phê hòa tan cao cấp, tiện lợi</p>
                    <div class="product-footer">
                        <span class="product-price">450.000 VNĐ/kg</span>
                        <a href="#contact" class="btn btn-accent">Đặt hàng</a>
                    </div>
                </div>
            </div>
        </div>
    </section>`
}

function generateStaticFooter(content: any, colors: any) {
  const footerContent = content?.footer || {}
  const contactInfo = footerContent?.contact || {}
  
  return `<footer id="contact" class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <div class="logo-icon">☕</div>
                        <div>
                            <h3>${footerContent.companyName || 'Cà Phê Việt'}</h3>
                            <p style="font-size: 0.875rem; opacity: 0.8;">Premium Export Coffee</p>
                        </div>
                    </div>
                    <p style="margin-bottom: 1rem; opacity: 0.8;">
                        ${footerContent.description || 'Chuyên cung cấp cà phê chất lượng cao cho thị trường quốc tế với cam kết về chất lượng và bền vững'}
                    </p>
                    <div class="social-links">
                        <a href="#" class="social-link">📘</a>
                        <a href="#" class="social-link">💼</a>
                        <a href="#" class="social-link">🐦</a>
                    </div>
                </div>
                
                <div class="footer-section">
                    <h4>Liên Kết Nhanh</h4>
                    <ul class="footer-links">
                        <li><a href="#about">Về chúng tôi</a></li>
                        <li><a href="#products">Sản phẩm & Dịch vụ</a></li>
                        <li><a href="#contact">Liên hệ</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Tài nguyên</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h4>Dịch Vụ</h4>
                    <ul class="footer-links">
                        <li><a href="#">Xuất khẩu cà phê</a></li>
                        <li><a href="#">Logistics & Vận chuyển</a></li>
                        <li><a href="#">Tư vấn thủ tục</a></li>
                        <li><a href="#">Đào tạo & Phát triển</a></li>
                        <li><a href="#">Kiểm soát chất lượng</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h4>Liên Hệ</h4>
                    <div style="margin-bottom: 1.5rem;">
                        <div class="contact-item">
                            <span>📍</span>
                            <span>${contactInfo.address || '123 Đường ABC, Quận 1, TP.HCM'}</span>
                        </div>
                        <div class="contact-item">
                            <span>📞</span>
                            <span>${contactInfo.phone || '+84 123 456 789'}</span>
                        </div>
                        <div class="contact-item">
                            <span>✉️</span>
                            <span>${contactInfo.email || 'info@capheviet.com'}</span>
                        </div>
                    </div>
                    
                    <div class="newsletter">
                        <h5 style="margin-bottom: 0.75rem;">Nhận tin tức mới nhất</h5>
                        <form class="newsletter-form">
                            <input type="email" placeholder="Email của bạn" class="newsletter-input" required>
                            <button type="submit" class="btn btn-accent">Đăng ký</button>
                        </form>
                    </div>
                </div>
            </div>
            
            <div class="footer-bottom">
                <div style="opacity: 0.8;">
                    © 2024 ${footerContent.companyName || 'Cà Phê Việt'}. Tất cả quyền được bảo lưu.
                </div>
                <div class="footer-links-bottom">
                    <a href="#">Chính sách bảo mật</a>
                    <a href="#">Điều khoản sử dụng</a>
                    <a href="#">Sitemap</a>
                </div>
            </div>
        </div>
    </footer>`
}

// Generate README for static HTML
function generateStaticReadme(projectName: string, description: string) {
  return `# ${projectName}

${description}

## Static HTML Website

This is a static HTML website generated from the theme editor. No build process or server required!

## Getting Started

### Option 1: Direct Browser
Simply open \`index.html\` in your web browser.

### Option 2: Local Server (Recommended)
For better development experience, serve the files through a local server:

#### Using Python:
\`\`\`bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
\`\`\`

#### Using Node.js:
\`\`\`bash
# Install live-server globally
npm install -g live-server

# Run in project directory
live-server
\`\`\`

#### Using PHP:
\`\`\`bash
php -S localhost:8000
\`\`\`

Then open [http://localhost:8000](http://localhost:8000) in your browser.

## File Structure

\`\`\`
/
├── index.html              # Main HTML file
├── assets/
│   ├── css/
│   │   └── styles.css      # All styles
│   ├── js/
│   │   └── scripts.js      # Interactive features
│   └── images/             # Images and assets
├── sitemap.xml             # SEO sitemap
├── robots.txt              # Search engine instructions
├── manifest.json           # PWA manifest
└── README.md               # This file
\`\`\`

## Features

- ✅ **Fully Responsive** - Works on all devices
- ✅ **SEO Optimized** - Meta tags, structured data, sitemap
- ✅ **Fast Loading** - Minimal dependencies, optimized CSS
- ✅ **Accessible** - WCAG compliant, keyboard navigation
- ✅ **Mobile Menu** - Touch-friendly navigation
- ✅ **Smooth Scrolling** - Enhanced user experience
- ✅ **Progressive Enhancement** - Works without JavaScript

## Customization

### Colors
Edit CSS variables in \`assets/css/styles.css\`:
\`\`\`css
:root {
    --color-primary: #8B4513;
    --color-secondary: #D2691E;
    --color-accent: #CD853F;
    /* ... other colors ... */
}
\`\`\`

### Content
Edit the HTML content directly in \`index.html\` or create additional pages by copying the structure.

### Images
Replace placeholder images in \`assets/images/\` with your actual images:
- \`hero-coffee.jpg\` - Hero section background
- \`logo.png\` - Company logo
- \`favicon.ico\` - Browser icon

### JavaScript
Add custom functionality in \`assets/js/scripts.js\`

## SEO Optimization

### Meta Tags
Update meta tags in \`<head>\` section of \`index.html\`:
- Title and description
- Open Graph tags for social sharing
- Twitter Card data

### Sitemap
Update \`sitemap.xml\` with your actual domain and pages.

### Analytics
Add tracking code before closing \`</body>\` tag:
\`\`\`html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
\`\`\`

## Deployment

### GitHub Pages
1. Push code to GitHub repository
2. Go to Settings → Pages
3. Select source branch (main)
4. Your site will be available at \`https://username.github.io/repository-name\`

### Netlify
1. Drag and drop the project folder to [Netlify](https://app.netlify.com)
2. Or connect to GitHub repository for automatic deployments

### Vercel
1. Install Vercel CLI: \`npm i -g vercel\`
2. Run \`vercel\` in project directory
3. Follow the prompts

### Traditional Web Hosting
Upload all files to your web server's public folder (usually \`public_html\` or \`www\`).

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)  
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers
- ⚠️ Internet Explorer (limited support)

## Performance

- **Lighthouse Score**: 95+
- **Page Load Time**: < 2 seconds
- **File Size**: < 100KB (without images)
- **Mobile Friendly**: Yes

## License

MIT License - Feel free to use for commercial and personal projects.

## Support

For customization help or questions, please refer to the documentation or contact support.
`
}

// Helper functions for React/Next.js project generation
function generatePackageJson(projectName: string, description: string, framework: string, typescript: boolean, cssFramework: string) {
  const dependencies: Record<string, string> = {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
  
  const devDependencies: Record<string, string> = {}
  
  if (framework === 'react-vite') {
    dependencies["@vitejs/plugin-react"] = "^4.0.3"
    devDependencies["vite"] = "^4.4.5"
  } else if (framework === 'nextjs') {
    dependencies["next"] = "^14.0.0"
  }
  
  if (typescript) {
    devDependencies["typescript"] = "^5.0.0"
    devDependencies["@types/react"] = "^18.2.0"
    devDependencies["@types/react-dom"] = "^18.2.0"
  }
  
  if (cssFramework === 'tailwind') {
    devDependencies["tailwindcss"] = "^3.3.0"
    devDependencies["postcss"] = "^8.4.24"
    devDependencies["autoprefixer"] = "^10.4.14"
  }
  
  const scripts: Record<string, string> = {}
  if (framework === 'react-vite') {
    scripts.dev = "vite"
    scripts.build = "vite build"
    scripts.preview = "vite preview"
  } else if (framework === 'nextjs') {
    scripts.dev = "next dev"
    scripts.build = "next build"
    scripts.start = "next start"
  }
  
  return JSON.stringify({
    name: projectName.toLowerCase().replace(/\s+/g, '-'),
    version: "0.1.0",
    description,
    private: true,
    scripts,
    dependencies,
    devDependencies
  }, null, 2)
}

function generateReactApp(themeParams: any, typescript: boolean) {
  const ext = typescript ? 'tsx' : 'jsx'
  return `import React from 'react'
import VietnamCoffeeTheme from './components/VietnamCoffeeTheme.${ext}'
import './styles/globals.css'

function App() {
  const themeParams = ${JSON.stringify(themeParams, null, 2)}
  
  return (
    <div className="App">
      <VietnamCoffeeTheme themeParams={themeParams} />
    </div>
  )
}

export default App`
}

function generateReactMain() {
  return `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`
}

function generateViteHtml(projectName: string) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`
}

function generateViteConfig() {
  return `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`
}

function generateNextjsPage(themeParams: any, typescript: boolean) {
  return `import VietnamCoffeeTheme from '../components/VietnamCoffeeTheme'

export default function Home() {
  const themeParams = ${JSON.stringify(themeParams, null, 2)}
  
  return (
    <main>
      <VietnamCoffeeTheme themeParams={themeParams} />
    </main>
  )
}`
}

function generateNextjsLayout(projectName: string, description: string) {
  return `import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '${projectName}',
  description: '${description}',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}`
}

function generateNextConfig() {
  return `/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig`
}

function generateTailwindConfig() {
  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`
}

function generateTailwindCSS(themeParams: any) {
  const colors = themeParams?.colors || {}
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-primary: ${colors.primary || '#8B4513'};
  --color-secondary: ${colors.secondary || '#D2691E'};
  --color-accent: ${colors.accent || '#CD853F'};
  --color-background: ${colors.background || '#F5F5DC'};
  --color-text: ${colors.text || '#2D3748'};
}`
}

function generateVanillaCSS(themeParams: any) {
  const colors = themeParams?.colors || {}
  return `/* Custom CSS Variables */
:root {
  --color-primary: ${colors.primary || '#8B4513'};
  --color-secondary: ${colors.secondary || '#D2691E'};
  --color-accent: ${colors.accent || '#CD853F'};
  --color-background: ${colors.background || '#F5F5DC'};
  --color-text: ${colors.text || '#2D3748'};
}

/* Base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  line-height: 1.6;
  color: var(--color-text);
  background-color: var(--color-background);
}`
}

function generateThemeComponent(themeParams: any, typescript: boolean) {
  const propsType = typescript ? ': { themeParams: any }' : ''
  return `import React from 'react'

export default function VietnamCoffeeTheme({ themeParams }${propsType}) {
  const colors = themeParams?.colors || {}
  const content = themeParams?.content || {}
  
  return (
    <div className="vietnam-coffee-theme">
      {/* Header */}
      <header style={{ backgroundColor: colors.secondary || '#D2691E' }}>
        <div className="container">
          <h1>{content?.header?.title || 'Cà Phê Việt'}</h1>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="hero" style={{ 
        background: \`linear-gradient(135deg, \${colors.primary || '#8B4513'}, \${colors.secondary || '#D2691E'})\`
      }}>
        <div className="container">
          <h1>{content?.hero?.title || 'Cà Phê Việt Nam - Chất Lượng Quốc Tế'}</h1>
          <p>{content?.hero?.description || 'Xuất khẩu cà phê chất lượng cao'}</p>
        </div>
      </section>
      
      {/* Content sections can be added here */}
    </div>
  )
}`
}

function generateTsConfig(framework: string) {
  if (framework === 'nextjs') {
    return JSON.stringify({
      "compilerOptions": {
        "target": "es5",
        "lib": ["dom", "dom.iterable", "es6"],
        "allowJs": true,
        "skipLibCheck": true,
        "strict": true,
        "noEmit": true,
        "esModuleInterop": true,
        "module": "esnext",
        "moduleResolution": "bundler",
        "resolveJsonModule": true,
        "isolatedModules": true,
        "jsx": "preserve",
        "incremental": true,
        "plugins": [{ "name": "next" }],
        "paths": { "@/*": ["./src/*"] }
      },
      "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
      "exclude": ["node_modules"]
    }, null, 2)
  } else {
    return JSON.stringify({
      "compilerOptions": {
        "target": "ES2020",
        "useDefineForClassFields": true,
        "lib": ["ES2020", "DOM", "DOM.Iterable"],
        "module": "ESNext",
        "skipLibCheck": true,
        "moduleResolution": "bundler",
        "allowImportingTsExtensions": true,
        "resolveJsonModule": true,
        "isolatedModules": true,
        "noEmit": true,
        "jsx": "react-jsx",
        "strict": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "noFallthroughCasesInSwitch": true
      },
      "include": ["src"],
      "references": [{ "path": "./tsconfig.node.json" }]
    }, null, 2)
  }
}

function generateReactReadme(projectName: string, description: string, framework: string) {
  return `# ${projectName}

${description}

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Start development server:
\`\`\`bash
npm run dev
\`\`\`

3. Open [http://localhost:${framework === 'nextjs' ? '3000' : '5173'}](http://localhost:${framework === 'nextjs' ? '3000' : '5173'}) in your browser.

## Build for Production

\`\`\`bash
npm run build
\`\`\`

## Framework: ${framework === 'nextjs' ? 'Next.js' : 'React + Vite'}

This project was generated from a theme editor and uses ${framework === 'nextjs' ? 'Next.js' : 'React with Vite'} for development and building.

## Customization

- Edit theme parameters in the component files
- Update colors and content as needed
- Add new components in the \`src/components\` directory

## Learn More

- [${framework === 'nextjs' ? 'Next.js Documentation' : 'Vite Documentation'}](${framework === 'nextjs' ? 'https://nextjs.org/docs' : 'https://vitejs.dev/guide/'})
- [React Documentation](https://reactjs.org/docs)
`
}

// Additional helper functions for static site generation
function generateSitemapFile(projectName: string, themeParams: any) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`
}

function generateRobotsTxtFile() {
  return `User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml`
}

function generateManifestFile(projectName: string, themeParams: any) {
  const colors = themeParams?.colors || {}
  return JSON.stringify({
    "name": projectName,
    "short_name": projectName,
    "description": `${projectName} - Professional Coffee Export Website`,
    "start_url": "/",
    "display": "standalone",
    "background_color": colors.background || "#F5F5DC",
    "theme_color": colors.primary || "#8B4513",
    "icons": [
      {
        "src": "assets/images/favicon.ico",
        "sizes": "any",
        "type": "image/x-icon"
      }
    ]
  }, null, 2)
}

// Helper functions for deploy script generation
function generateDeployScript_func(projectName: string, serverType: string, framework: string): string {
  switch (serverType) {
    case 'nginx':
      return generateNginxDeployScript(projectName, framework)
    case 'apache':
      return generateApacheDeployScript(projectName, framework)
    case 'node':
      return generateNodeDeployScript(projectName, framework)
    case 'docker':
      return generateDockerDeployScript(projectName, framework)
    default:
      return generateNginxDeployScript(projectName, framework)
  }
}

function getDeployScriptName(serverType: string): string {
  switch (serverType) {
    case 'nginx':
      return 'deploy-nginx.sh'
    case 'apache':
      return 'deploy-apache.sh'
    case 'node':
      return 'deploy-node.sh'
    case 'docker':
      return 'deploy-docker.sh'
    default:
      return 'deploy.sh'
  }
}

function generateNginxDeployScript(projectName: string, framework: string): string {
  const isStatic = framework === 'html' || framework === 'static-html'
  const buildCommand = framework === 'nextjs' ? 'npm run build' : framework === 'react' ? 'npm run build' : ''
  const buildDir = framework === 'nextjs' ? 'out' : framework === 'react' ? 'dist' : '.'
  
  return `#!/bin/bash

# Deploy script cho ${projectName} trên Nginx
# Tạo bởi Theme Editor

set -e

echo "🚀 Bắt đầu deploy ${projectName}..."

# Cấu hình
PROJECT_NAME="${projectName}"
DOMAIN="your-domain.com"  # Thay đổi domain của bạn
NGINX_ROOT="/var/www/\$PROJECT_NAME"
NGINX_CONFIG="/etc/nginx/sites-available/\$PROJECT_NAME"
USER_ID=\$(id -u)

# Kiểm tra quyền sudo
if [ "\$EUID" -ne 0 ]; then
    echo "❌ Script cần chạy với quyền sudo"
    echo "Sử dụng: sudo ./deploy-nginx.sh"
    exit 1
fi

echo "📦 Cài đặt dependencies..."
${!isStatic ? `
# Cài đặt Node.js dependencies (chỉ cho React/Next.js)
npm install

echo "🔨 Build project..."
${buildCommand}` : ''}

echo "📁 Tạo thư mục web root..."
mkdir -p \$NGINX_ROOT
chown www-data:www-data \$NGINX_ROOT

echo "📋 Copy files to web directory..."
${isStatic ? 
  'cp -r * $NGINX_ROOT/' : 
  `cp -r ${buildDir}/* \$NGINX_ROOT/`
}

# Set quyền cho files
chown -R www-data:www-data \$NGINX_ROOT
chmod -R 755 \$NGINX_ROOT

echo "⚙️ Tạo cấu hình Nginx..."
cat > \$NGINX_CONFIG << 'EOF'
server {
    listen 80;
    server_name \$DOMAIN www.\$DOMAIN;
    root \$NGINX_ROOT;
    index index.html index.htm;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss;

    # Cache static assets
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
}
EOF

echo "🔗 Kích hoạt site..."
ln -sf \$NGINX_CONFIG /etc/nginx/sites-enabled/

echo "🔄 Test cấu hình Nginx..."
nginx -t

if [ \$? -eq 0 ]; then
    echo "✅ Cấu hình Nginx hợp lệ"
    echo "🔄 Reload Nginx..."
    systemctl reload nginx
    echo "✅ Deploy thành công!"
    echo ""
    echo "🌐 Website của bạn có thể truy cập tại:"
    echo "   http://\$DOMAIN"
    echo ""
    echo "📝 Bước tiếp theo:"
    echo "   1. Cập nhật DNS để trỏ \$DOMAIN về server này"
    echo "   2. Cài đặt SSL certificate với Let's Encrypt:"
    echo "      sudo certbot --nginx -d \$DOMAIN -d www.\$DOMAIN"
else
    echo "❌ Cấu hình Nginx có lỗi!"
    exit 1
fi`
}

function generateApacheDeployScript(projectName: string, framework: string): string {
  const isStatic = framework === 'html' || framework === 'static-html'
  const buildCommand = framework === 'nextjs' ? 'npm run build' : framework === 'react' ? 'npm run build' : ''
  const buildDir = framework === 'nextjs' ? 'out' : framework === 'react' ? 'dist' : '.'
  
  return `#!/bin/bash

# Deploy script cho ${projectName} trên Apache
# Tạo bởi Theme Editor

set -e

echo "🚀 Bắt đầu deploy ${projectName}..."

# Cấu hình
PROJECT_NAME="${projectName}"
DOMAIN="your-domain.com"  # Thay đổi domain của bạn
APACHE_ROOT="/var/www/html/\$PROJECT_NAME"
APACHE_CONFIG="/etc/apache2/sites-available/\$PROJECT_NAME.conf"

# Kiểm tra quyền sudo
if [ "\$EUID" -ne 0 ]; then
    echo "❌ Script cần chạy với quyền sudo"
    echo "Sử dụng: sudo ./deploy-apache.sh"
    exit 1
fi

echo "📦 Cài đặt dependencies..."
${!isStatic ? `
# Cài đặt Node.js dependencies
npm install

echo "🔨 Build project..."
${buildCommand}` : ''}

echo "📁 Tạo thư mục web root..."
mkdir -p \$APACHE_ROOT

echo "📋 Copy files to web directory..."
${isStatic ? 
  'cp -r * $APACHE_ROOT/' : 
  `cp -r ${buildDir}/* \$APACHE_ROOT/`
}

# Set quyền cho files
chown -R www-data:www-data \$APACHE_ROOT
chmod -R 755 \$APACHE_ROOT

echo "⚙️ Tạo cấu hình Apache..."
cat > \$APACHE_CONFIG << 'EOF'
<VirtualHost *:80>
    ServerName \$DOMAIN
    ServerAlias www.\$DOMAIN
    DocumentRoot \$APACHE_ROOT
    
    <Directory \$APACHE_ROOT>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    # Rewrite for SPA
    <IfModule mod_rewrite.c>
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\\.html\$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </IfModule>
    
    ErrorLog \${APACHE_LOG_DIR}/\$PROJECT_NAME_error.log
    CustomLog \${APACHE_LOG_DIR}/\$PROJECT_NAME_access.log combined
</VirtualHost>
EOF

echo "🔗 Kích hoạt site..."
a2ensite \$PROJECT_NAME.conf
a2enmod rewrite

echo "🔄 Test cấu hình Apache..."
apache2ctl configtest

if [ \$? -eq 0 ]; then
    echo "✅ Cấu hình Apache hợp lệ"
    echo "🔄 Reload Apache..."
    systemctl reload apache2
    echo "✅ Deploy thành công!"
    echo ""
    echo "🌐 Website của bạn có thể truy cập tại:"
    echo "   http://\$DOMAIN"
else
    echo "❌ Cấu hình Apache có lỗi!"
    exit 1
fi`
}

function generateNodeDeployScript(projectName: string, framework: string): string {
  const isNextJs = framework === 'nextjs'
  
  return `#!/bin/bash

# Deploy script cho ${projectName} trên Node.js Server
# Tạo bởi Theme Editor

set -e

echo "🚀 Bắt đầu deploy ${projectName}..."

# Cấu hình
PROJECT_NAME="${projectName}"
PORT="3000"  # Thay đổi port nếu cần
PM2_APP_NAME="\$PROJECT_NAME"

echo "📦 Cài đặt dependencies..."
npm install

${isNextJs ? `
echo "🔨 Build Next.js project..."
npm run build

echo "📝 Tạo ecosystem file cho PM2..."
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: '\$PM2_APP_NAME',
    script: 'npm',
    args: 'start',
    cwd: process.cwd(),
    env: {
      NODE_ENV: 'production',
      PORT: '\$PORT'
    }
  }]
}
EOF` : `
echo "🔨 Build React project..."
npm run build

echo "📦 Cài đặt serve để host static files..."
npm install -g serve

echo "📝 Tạo ecosystem file cho PM2..."
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: '\$PM2_APP_NAME',
    script: 'serve',
    args: '-s dist -l \$PORT',
    cwd: process.cwd(),
    env: {
      NODE_ENV: 'production'
    }
  }]
}
EOF`}

echo "🚀 Start/Restart với PM2..."
# Cài đặt PM2 nếu chưa có
if ! command -v pm2 &> /dev/null; then
    echo "📦 Cài đặt PM2..."
    npm install -g pm2
fi

# Stop app cũ nếu đang chạy
pm2 stop \$PM2_APP_NAME 2>/dev/null || true
pm2 delete \$PM2_APP_NAME 2>/dev/null || true

# Start app mới
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup

echo "✅ Deploy thành công!"
echo ""
echo "🌐 Website của bạn đang chạy tại:"
echo "   http://localhost:\$PORT"
echo ""
echo "📝 PM2 Commands:"
echo "   pm2 list                 # Xem apps đang chạy"
echo "   pm2 logs \$PM2_APP_NAME  # Xem logs"
echo "   pm2 stop \$PM2_APP_NAME  # Stop app"
echo "   pm2 restart \$PM2_APP_NAME # Restart app"`
}

function generateDockerDeployScript(projectName: string, framework: string): string {
  const isNextJs = framework === 'nextjs'
  const isStatic = framework === 'html' || framework === 'static-html'
  
  return `#!/bin/bash

# Deploy script cho ${projectName} với Docker
# Tạo bởi Theme Editor

set -e

echo "🚀 Bắt đầu deploy ${projectName} với Docker..."

# Cấu hình
PROJECT_NAME="${projectName}"
CONTAINER_NAME="\$PROJECT_NAME-container"
IMAGE_NAME="\$PROJECT_NAME:latest"
PORT="3000"

echo "📝 Tạo Dockerfile..."
${isStatic ? `
cat > Dockerfile << 'EOF'
FROM nginx:alpine

# Copy static files
COPY . /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
EOF

echo "📝 Tạo nginx.conf..."
cat > nginx.conf << 'EOF'
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
EOF` : isNextJs ? `
cat > Dockerfile << 'EOF'
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE \$PORT
ENV PORT \$PORT

CMD ["node", "server.js"]
EOF` : `
cat > Dockerfile << 'EOF'
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
EOF

echo "📝 Tạo nginx.conf..."
cat > nginx.conf << 'EOF'
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF`}

echo "📝 Tạo docker-compose.yml..."
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  app:
    build: .
    container_name: \$CONTAINER_NAME
    ports:
      - "\$PORT:${isStatic || !isNextJs ? '80' : '$PORT'}"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
EOF

echo "🐳 Build Docker image..."
docker build -t \$IMAGE_NAME .

echo "🛑 Stop và remove container cũ nếu có..."
docker stop \$CONTAINER_NAME 2>/dev/null || true
docker rm \$CONTAINER_NAME 2>/dev/null || true

echo "🚀 Start container mới..."
docker-compose up -d

echo "✅ Deploy thành công!"
echo ""
echo "🌐 Website của bạn đang chạy tại:"
echo "   http://localhost:\$PORT"
echo ""
echo "🐳 Docker Commands:"
echo "   docker-compose logs -f    # Xem logs"
echo "   docker-compose stop       # Stop container"
echo "   docker-compose restart    # Restart container"
echo "   docker-compose down       # Stop và remove container"`
}