/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server'
import JSZip from 'jszip'
import { ThemeParams } from '@/types'

interface ExportOptions {
  projectName: string
  description: string
  framework: 'react' | 'nextjs'
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
    const { 
      projectId, 
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
      themeParams 
    } = await request.json()

    console.log('📋 [EXPORT] Export configuration:', {
      projectId,
      projectName,
      framework,
      typescript,
      cssFramework,
      includeAssets,
      createGitHubRepo,
      deployToVercel
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
    // Map 'react' to 'react-vite' for backward compatibility
    const mappedFramework = framework === 'react' ? 'react-vite' : framework
    console.log('🔄 [EXPORT] Framework mapping:', { original: framework, mapped: mappedFramework })
    
    const projectFiles = await generateProjectFiles({
      projectName,
      description,
      framework: mappedFramework,
      typescript,
      cssFramework,
      includeAssets,
      themeParams
    })
    console.log(`✅ [EXPORT] Generated ${Object.keys(projectFiles).length} files`)

    // Step 2: Create ZIP file
    console.log('🗜️ [EXPORT] Step 2: Creating ZIP archive...')
    const zip = new JSZip()
    
    for (const [filePath, content] of Object.entries(projectFiles)) {
      zip.file(filePath, content)
      console.log(`📄 [EXPORT] Added to ZIP: ${filePath}`)
    }

    const zipBuffer = await zip.generateAsync({ type: 'arraybuffer' })
    console.log(`✅ [EXPORT] ZIP created successfully (${zipBuffer.byteLength} bytes)`)

    // Step 3: Store ZIP for download
    console.log('💾 [EXPORT] Step 3: Storing ZIP for download...')
    if (!global.projectExports) {
      global.projectExports = {}
    }
    global.projectExports[projectId] = zipBuffer
    console.log(`✅ [EXPORT] ZIP stored for project ${projectId}`)

    // Step 4: GitHub Integration (if requested)
    let githubResult = null
    if (createGitHubRepo) {
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

    // Step 5: Vercel Deployment (if requested)
    let vercelResult = null
    if (deployToVercel && githubResult?.success) {
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
      exportTime: totalTime
    }

    console.log('🎉 [EXPORT] Export completed successfully:', {
      projectName,
      fileSize: `${(zipBuffer.byteLength / 1024).toFixed(2)}KB`,
      fileCount: Object.keys(projectFiles).length,
      githubSuccess: githubResult?.success,
      vercelSuccess: vercelResult?.success
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
  framework: 'react-vite' | 'nextjs'
  typescript: boolean
  cssFramework: 'tailwind' | 'styled-components' | 'css-modules'
  includeAssets: boolean
  themeParams: any
}) {
  console.log('🔧 [EXPORT] Generating project files with config:', {
    framework,
    typescript,
    cssFramework,
    includeAssets
  })

  const files: Record<string, string> = {}
  const ext = typescript ? 'tsx' : 'jsx'
  const configExt = typescript ? 'ts' : 'js'

  // Generate package.json
  console.log('📦 [EXPORT] Generating package.json...')
  files['package.json'] = generatePackageJson({
    projectName,
    description,
    framework,
    typescript,
    cssFramework
  })
  
  // SEO Functions
function generateSitemapFile(projectName: string, themeParams?: any) {
  const baseUrl = 'https://your-domain.com' // This should be updated by user
  const lastmod = new Date().toISOString().split('T')[0]
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`
}

function generateRobotsTxtFile() {
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: https://your-domain.com/sitemap.xml

# Block access to admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /static/`
}

function generateManifestFile(projectName: string, themeParams?: any) {
  const name = themeParams?.content?.meta?.title || projectName
  const description = themeParams?.content?.meta?.description || `${projectName} - Professional business website`
  const themeColor = themeParams?.colors?.primary || '#8B4513'
  
  return JSON.stringify({
    "name": name,
    "short_name": projectName,
    "description": description,
    "start_url": "/",
    "display": "standalone",
    "theme_color": themeColor,
    "background_color": "#ffffff",
    "icons": [
      {
        "src": "/favicon.ico",
        "sizes": "64x64 32x32 24x24 16x16",
        "type": "image/x-icon"
      },
      {
        "src": "/logo-192.png",
        "type": "image/png",
        "sizes": "192x192"
      },
      {
        "src": "/logo-512.png",
        "type": "image/png",
        "sizes": "512x512"
      }
    ]
  }, null, 2)
}

// Generate SEO files
  console.log('🔍 [EXPORT] Generating SEO files...')
  files['public/sitemap.xml'] = generateSitemapFile(projectName, themeParams)
  files['public/robots.txt'] = generateRobotsTxtFile()
  files['public/manifest.json'] = generateManifestFile(projectName, themeParams)

  // Generate framework-specific configs
  if (framework === 'react-vite') {
    console.log('⚡ [EXPORT] Generating Vite config...')
    files[`vite.config.${configExt}`] = generateViteConfig(typescript)
    files['index.html'] = generateIndexHtml(projectName, themeParams)
  } else {
    console.log('⚡ [EXPORT] Generating Next.js config...')
    files['next.config.js'] = generateNextConfig()
  }

  // Generate TypeScript config
  if (typescript) {
    console.log('📝 [EXPORT] Generating TypeScript config...')
    files['tsconfig.json'] = generateTsConfig(framework)
    if (framework === 'react-vite') {
      files['tsconfig.node.json'] = generateTsConfigNode()
    }
  }

  // Generate CSS framework configs
  console.log('🎨 [EXPORT] Generating CSS framework configs...')
  if (cssFramework === 'tailwind') {
    files['tailwind.config.js'] = generateTailwindConfig()
    files['postcss.config.js'] = generatePostcssConfig()
  }

  // Generate source files
  console.log('📁 [EXPORT] Generating source files...')
  if (framework === 'react-vite') {
    files[`src/main.${ext}`] = generateMainFile(typescript, cssFramework)
    files[`src/App.${ext}`] = generateAppComponent(typescript, cssFramework, themeParams)
    files['src/index.css'] = generateIndexCss(cssFramework, themeParams)
  } else {
    files['src/app/layout.tsx'] = generateLayoutComponent(typescript, cssFramework, themeParams)
    files['src/app/page.tsx'] = generatePageComponent(typescript, cssFramework, themeParams)
    files['src/app/globals.css'] = generateGlobalsCss(cssFramework, themeParams)
  }

  // Generate components
  console.log('🧩 [EXPORT] Generating components...')
  const components = [
    'Header',
    'HeroSection', 
    'About',
    'Problems',
    'Solutions',
    'Products',
    'Footer'
  ]

  for (const component of components) {
    console.log(`📄 [EXPORT] Generating ${component} component...`)
    files[`src/components/${component}.${ext}`] = generateComponent(
      component,
      typescript,
      cssFramework,
      themeParams
    )
  }

  // Generate README
  console.log('📖 [EXPORT] Generating README...')
  files['README.md'] = generateReadme({
    projectName,
    description,
    framework,
    typescript,
    cssFramework
  })

  // Generate gitignore
  console.log('🚫 [EXPORT] Generating .gitignore...')
  files['.gitignore'] = generateGitignore(framework)

  console.log(`✅ [EXPORT] Generated ${Object.keys(files).length} files`)
  return files
}

// Helper functions for generating specific files
function generatePackageJson({ projectName, description, framework, typescript, cssFramework }: any) {
  const dependencies: Record<string, string> = {
    'react': '^18.2.0',
    'react-dom': '^18.2.0'
  }

  const devDependencies: Record<string, string> = {}

  if (framework === 'react-vite') {
    dependencies['vite'] = '^5.0.0'
    dependencies['@vitejs/plugin-react'] = '^4.2.0'
  } else {
    dependencies['next'] = '^14.0.0'
  }

  if (typescript) {
    devDependencies['typescript'] = '^5.0.0'
    if (framework === 'react-vite') {
      devDependencies['@types/react'] = '^18.2.0'
      devDependencies['@types/react-dom'] = '^18.2.0'
    }
  }

  if (cssFramework === 'tailwind') {
    dependencies['tailwindcss'] = '^3.4.0'
    dependencies['autoprefixer'] = '^10.4.0'
    dependencies['postcss'] = '^8.4.0'
  } else if (cssFramework === 'styled-components') {
    dependencies['styled-components'] = '^6.1.0'
    if (typescript) {
      devDependencies['@types/styled-components'] = '^5.1.0'
    }
  }

  return JSON.stringify({
    name: projectName.toLowerCase().replace(/\s+/g, '-'),
    version: '1.0.0',
    description,
    private: true,
    scripts: {
      dev: framework === 'react-vite' ? 'vite' : 'next dev',
      build: framework === 'react-vite' ? 'vite build' : 'next build',
      preview: framework === 'react-vite' ? 'vite preview' : 'next start',
      lint: 'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0'
    },
    dependencies,
    devDependencies
  }, null, 2)
}

function generateViteConfig(typescript: boolean) {
  return `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
})`
}

function generateNextConfig() {
  return `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  }
}

module.exports = nextConfig`
}

function generateTsConfig(framework: string) {
  return JSON.stringify({
    compilerOptions: {
      target: 'ES2020',
      useDefineForClassFields: true,
      lib: ['ES2020', 'DOM', 'DOM.Iterable'],
      module: 'ESNext',
      skipLibCheck: true,
      moduleResolution: 'bundler',
      allowImportingTsExtensions: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: 'react-jsx',
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noFallthroughCasesInSwitch: true
    },
    include: ['src'],
    references: framework === 'react-vite' ? [{ path: './tsconfig.node.json' }] : []
  }, null, 2)
}

function generateTsConfigNode() {
  return JSON.stringify({
    compilerOptions: {
      composite: true,
      skipLibCheck: true,
      module: 'ESNext',
      moduleResolution: 'bundler',
      allowSyntheticDefaultImports: true
    },
    include: ['vite.config.ts']
  }, null, 2)
}

function generateTailwindConfig() {
  return `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
      }
    },
  },
  plugins: [],
}`
}

function generatePostcssConfig() {
  return `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`
}

function generateIndexHtml(projectName: string, themeParams?: any) {
  const metaTitle = themeParams?.content?.meta?.title || projectName
  const metaDescription = themeParams?.content?.meta?.description || `${projectName} - Professional business website`
  const metaKeywords = themeParams?.content?.meta?.keywords || 'business, website, professional'
  const favicon = themeParams?.content?.meta?.favicon || '/favicon.ico'
  const companyName = themeParams?.content?.header?.title || projectName
  const logo = themeParams?.content?.header?.logo || '/logo.png'
  const analyticsId = themeParams?.content?.meta?.analyticsId || ''
  
  return `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    
    <!-- Basic Meta Tags -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${metaTitle}</title>
    <meta name="description" content="${metaDescription}" />
    <meta name="keywords" content="${metaKeywords}" />
    <meta name="author" content="${companyName}" />
    <link rel="canonical" href="/" />
    
    <!-- Favicon -->
    <link rel="icon" href="${favicon}" />
    <link rel="apple-touch-icon" href="${favicon}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${metaTitle}" />
    <meta property="og:description" content="${metaDescription}" />
    <meta property="og:image" content="${logo}" />
    <meta property="og:url" content="/" />
    <meta property="og:site_name" content="${companyName}" />
    <meta property="og:locale" content="vi_VN" />
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${metaTitle}" />
    <meta name="twitter:description" content="${metaDescription}" />
    <meta name="twitter:image" content="${logo}" />
    
    <!-- Additional SEO Meta Tags -->
    <meta name="robots" content="index, follow" />
    <meta name="googlebot" content="index, follow" />
    <meta name="format-detection" content="telephone=no" />
    <meta name="theme-color" content="${themeParams?.colors?.primary || '#8B4513'}" />
    
    <!-- Preload Critical Resources -->
    <link rel="preload" href="/src/main.tsx" as="script" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "${companyName}",
      "description": "${metaDescription}",
      "url": "/",
      "logo": "${logo}",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "${themeParams?.content?.footer?.contact?.phone || ''}",
        "email": "${themeParams?.content?.footer?.contact?.email || ''}",
        "contactType": "customer service"
      },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Vietnam",
        "addressCountry": "VN"
      }
    }
    </script>
    
    ${analyticsId ? `
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${analyticsId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${analyticsId}');
    </script>
    ` : ''}
  </head>
  <body>
    <!-- Skip to main content for accessibility -->
    <a href="#main-content" class="sr-only focus:not-sr-only">Skip to main content</a>
    
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`
}

function generateMainFile(typescript: boolean, cssFramework: string) {
  const ext = typescript ? 'tsx' : 'jsx'
  return `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.${ext}'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`
}

function generateAppComponent(typescript: boolean, cssFramework: string, themeParams: any) {
  const ext = typescript ? 'tsx' : 'jsx'
  return `import React from 'react'
import Header from './components/Header.${ext}'
import HeroSection from './components/HeroSection.${ext}'
import About from './components/About.${ext}'
import Problems from './components/Problems.${ext}'
import Solutions from './components/Solutions.${ext}'
import Products from './components/Products.${ext}'
import Footer from './components/Footer.${ext}'

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <About />
        <Problems />
        <Solutions />
        <Products />
      </main>
      <Footer />
    </div>
  )
}

export default App`
}

function generateLayoutComponent(typescript: boolean, cssFramework: string, themeParams: any) {
  return `import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Generated Website',
  description: 'A website generated from theme editor',
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

function generatePageComponent(typescript: boolean, cssFramework: string, themeParams: any) {
  const ext = typescript ? 'tsx' : 'jsx'
  return `import Header from '../components/Header.${ext}'
import HeroSection from '../components/HeroSection.${ext}'
import About from '../components/About.${ext}'
import Problems from '../components/Problems.${ext}'
import Solutions from '../components/Solutions.${ext}'
import Products from '../components/Products.${ext}'
import Footer from '../components/Footer.${ext}'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <About />
        <Problems />
        <Solutions />
        <Products />
      </main>
      <Footer />
    </div>
  )
}`
}

function generateIndexCss(cssFramework: string, themeParams: any) {
  if (cssFramework === 'tailwind') {
    return `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-primary: ${themeParams?.colors?.primary || '#8B4513'};
  --color-secondary: ${themeParams?.colors?.secondary || '#D2691E'};
  --color-accent: ${themeParams?.colors?.accent || '#CD853F'};
}

body {
  font-family: Inter, system-ui, sans-serif;
  color: #2D3748;
}`
  }
  
  return `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`
}

function generateGlobalsCss(cssFramework: string, themeParams: any) {
  return generateIndexCss(cssFramework, themeParams)
}

function generateComponent(componentName: string, typescript: boolean, cssFramework: string, themeParams: any) {
  const ext = typescript ? 'tsx' : 'jsx'
  
  switch (componentName) {
    case 'Header':
      return generateHeaderComponent(typescript, cssFramework, themeParams)
    case 'HeroSection':
      return generateHeroSectionComponent(typescript, cssFramework, themeParams)
    case 'About':
      return generateAboutComponent(typescript, cssFramework, themeParams)
    case 'Problems':
      return generateProblemsComponent(typescript, cssFramework, themeParams)
    case 'Solutions':
      return generateSolutionsComponent(typescript, cssFramework, themeParams)
    case 'Products':
      return generateProductsComponent(typescript, cssFramework, themeParams)
    case 'Footer':
      return generateFooterComponent(typescript, cssFramework, themeParams)
    default:
      return generateGenericComponent(componentName, typescript, cssFramework, themeParams)
  }
}

function generateGenericComponent(componentName: string, typescript: boolean, cssFramework: string, themeParams: any) {
  const ext = typescript ? 'tsx' : 'jsx'
  const propsType = typescript ? `: React.FC` : ''
  
  return `import React from 'react'

const ${componentName}${propsType} = () => {
  return (
    <section className="${componentName.toLowerCase()}-section">
      <div className="container mx-auto px-4 py-8">
        <h2>${componentName}</h2>
        <p>This is the ${componentName} component generated from your theme.</p>
      </div>
    </section>
  )
}

export default ${componentName}`
}

function generateHeaderComponent(typescript: boolean, cssFramework: string, themeParams: any) {
  const content = themeParams?.content?.header || {}
  const colors = themeParams?.colors || {}
  
  return `'use client'

import React, { useState } from 'react'

// Simple icon components to replace Lucide icons
const Menu = ({ size = 20 }) => <span style={{ fontSize: size }}>☰</span>
const Phone = ({ size = 16 }) => <span style={{ fontSize: size }}>📞</span>
const Download = ({ size = 16 }) => <span style={{ fontSize: size }}>⬇️</span>
const Globe = ({ size = 16 }) => <span style={{ fontSize: size }}>🌐</span>
const Coffee = ({ size = 24 }) => <span style={{ fontSize: size }}>☕</span>

interface HeaderContent {
  title?: string;
  subtitle?: string;
  logo?: string;
  backgroundColor?: string;
  textColor?: string;
}

interface HeaderProps {
  theme: any;
  content: HeaderContent;
}

const Header = ({ theme = ${JSON.stringify(themeParams)}, content = ${JSON.stringify(content)} }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header 
      className="backdrop-blur-sm border-b sticky top-0 z-50 shadow-lg"
      style={{ 
        backgroundColor: content.backgroundColor || theme?.colors?.secondary || '${colors.secondary || '#8B4513'}',
        color: content.textColor || theme?.colors?.text || '${colors.text || '#FFFFFF'}',
        borderColor: theme?.colors?.border
      }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            {content.logo ? (
              <img 
                src={content.logo} 
                alt="Logo"
                className="w-10 h-10 rounded-lg object-cover"
              />
            ) : (
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: theme?.colors?.accent || '${colors.accent || '#D2691E'}' }}
              >
                <Coffee size={24} />
              </div>
            )}
            <div>
              <h1 
                className="text-xl font-bold" 
                style={{ color: content.textColor || theme?.colors?.text || '${colors.text || '#FFFFFF'}' }}
              >
                {content.title || "${content.title || 'Cà Phê Việt + Plus'}"}
              </h1>
              <p 
                className="text-xs opacity-80" 
                style={{ color: content.textColor || theme?.colors?.text || '${colors.text || '#FFFFFF'}' }}
              >
                {content.subtitle || "${content.subtitle || 'Premium Export Coffee'}"}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#" 
              className="hover:opacity-80 transition-colors"
              style={{ color: content.textColor || theme?.colors?.text || '${colors.text || '#FFFFFF'}' }}
            >
              Trang chủ
            </a>
            <a 
              href="#about" 
              className="hover:opacity-80 transition-colors"
              style={{ color: content.textColor || theme?.colors?.text || '${colors.text || '#FFFFFF'}' }}
            >
              Về chúng tôi
            </a>
            <div className="relative group">
              <a 
                href="#products" 
                className="hover:opacity-80 transition-colors"
                style={{ color: content.textColor || theme?.colors?.text || '${colors.text || '#FFFFFF'}' }}
              >
                Sản phẩm
              </a>
            </div>
            <a 
              href="#resources" 
              className="hover:opacity-80 transition-colors"
              style={{ color: content.textColor || theme?.colors?.text || '${colors.text || '#FFFFFF'}' }}
            >
              Tài nguyên
            </a>
            <a 
              href="#contact" 
              className="hover:opacity-80 transition-colors"
              style={{ color: content.textColor || theme?.colors?.text || '${colors.text || '#FFFFFF'}' }}
            >
              Liên hệ
            </a>
            <div className="flex items-center space-x-1" style={{ color: theme?.colors?.muted }}>
              <Globe size={16} />
              <span className="text-sm">VI | EN</span>
            </div>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-3">
            <button 
              className="flex items-center space-x-2 px-4 py-2 rounded border hover:opacity-80 transition-colors"
              style={{
                borderColor: theme?.colors?.border,
                color: content.textColor || theme?.colors?.text || '${colors.text || '#FFFFFF'}'
              }}
            >
              <Download size={16} />
              <span>Cẩm nang XNK 2024</span>
            </button>
            <button 
              className="flex items-center space-x-2 px-4 py-2 rounded hover:opacity-90 transition-colors"
              style={{
                backgroundColor: theme?.colors?.accent || '${colors.accent || '#D2691E'}',
                color: theme?.colors?.text || '${colors.text || '#FFFFFF'}'
              }}
            >
              <Phone size={16} />
              <span>Tư vấn miễn phí</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{ color: content.textColor || theme?.colors?.text || '${colors.text || '#FFFFFF'}' }}
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div 
            className="md:hidden mt-4 pb-4 space-y-4 border-t pt-4"
            style={{ borderColor: theme?.colors?.border }}
          >
            <nav className="flex flex-col space-y-3">
              <a 
                href="#" 
                className="hover:opacity-80 transition-colors"
                style={{ color: content.textColor || theme?.colors?.text || '${colors.text || '#FFFFFF'}' }}
              >
                Trang chủ
              </a>
              <a 
                href="#about" 
                className="hover:opacity-80 transition-colors"
                style={{ color: content.textColor || theme?.colors?.text || '${colors.text || '#FFFFFF'}' }}
              >
                Về chúng tôi
              </a>
              <a 
                href="#products" 
                className="hover:opacity-80 transition-colors"
                style={{ color: content.textColor || theme?.colors?.text || '${colors.text || '#FFFFFF'}' }}
              >
                Sản phẩm
              </a>
              <a 
                href="#resources" 
                className="hover:opacity-80 transition-colors"
                style={{ color: content.textColor || theme?.colors?.text || '${colors.text || '#FFFFFF'}' }}
              >
                Tài nguyên
              </a>
              <a 
                href="#contact" 
                className="hover:opacity-80 transition-colors"
                style={{ color: content.textColor || theme?.colors?.text || '${colors.text || '#FFFFFF'}' }}
              >
                Liên hệ
              </a>
            </nav>
            <div 
              className="flex flex-col space-y-2 pt-3 border-t"
              style={{ borderColor: theme?.colors?.border }}
            >
              <button 
                className="flex items-center justify-center space-x-2 w-full px-4 py-2 rounded border hover:opacity-80 transition-colors"
                style={{
                  borderColor: theme?.colors?.border,
                  color: content.textColor || theme?.colors?.text || '${colors.text || '#FFFFFF'}'
                }}
              >
                <Download size={16} />
                <span>Cẩm nang XNK 2024</span>
              </button>
              <button 
                className="flex items-center justify-center space-x-2 w-full px-4 py-2 rounded hover:opacity-90 transition-colors"
                style={{
                  backgroundColor: theme?.colors?.accent || '${colors.accent || '#D2691E'}',
                  color: theme?.colors?.text || '${colors.text || '#FFFFFF'}'
                }}
              >
                <Phone size={16} />
                <span>Tư vấn miễn phí</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header`
}

function generateHeroSectionComponent(typescript: boolean, cssFramework: string, themeParams: any) {
  const content = themeParams?.content?.hero || {}
  const colors = themeParams?.colors || {}
  
  return `'use client'

import React from 'react'

// Simple icon components to replace Lucide icons
const ArrowRight = ({ size = 20 }) => <span style={{ fontSize: size }}>→</span>
const Download = ({ size = 20 }) => <span style={{ fontSize: size }}>⬇️</span>

interface HeroContent {
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  image?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  textColor?: string;
  overlayColor?: string;
  overlayOpacity?: number;
}

interface HeroSectionProps {
  theme: any;
  content: HeroContent;
}

const HeroSection = ({ theme = ${JSON.stringify(themeParams)}, content = ${JSON.stringify(content)} }: HeroSectionProps) => {
  // Convert overlayOpacity to overlayColor if needed
  const getOverlayColor = () => {
    if (content.overlayColor) {
      // If it's already a hex color, convert to rgba with opacity
      if (content.overlayColor.startsWith('#')) {
        const opacity = content.overlayOpacity || 0.7;
        return \`\${content.overlayColor}\${Math.round(opacity * 255).toString(16).padStart(2, '0')}\`;
      }
      return content.overlayColor;
    }
    if (content.overlayOpacity !== undefined) {
      // Convert hex color to rgba with opacity
      const baseColor = theme?.colors?.primary || '${colors.primary || '#8B4513'}';
      const opacity = content.overlayOpacity;
      return \`\${baseColor}\${Math.round(opacity * 255).toString(16).padStart(2, '0')}\`;
    }
    return theme?.sections?.hero?.overlayColor || 'rgba(139, 69, 19, 0.7)';
  };
  
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: content.backgroundColor || theme?.sections?.hero?.backgroundColor || theme?.colors?.background || '${colors.background || '#F5F5DC'}' }}
    >
      {/* Background Image */}
      {(content.image || content.backgroundImage) && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: \`url(\${content.backgroundImage || content.image})\` }}
        >
          {/* Only show overlay if there's a background image and overlay settings */}
          {(content.overlayColor || content.overlayOpacity !== undefined) && (
            <div 
              className="absolute inset-0"
              style={{ backgroundColor: getOverlayColor() }}
            ></div>
          )}
        </div>
      )}

      {/* Content */}
      <div 
        className="relative z-10 container mx-auto px-4 text-center"
        style={{ color: content.textColor || theme?.sections?.hero?.textColor || theme?.colors?.text || '${colors.text || '#8B4513'}' }}
      >
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            {content.title || "${content.title || 'Cà Phê Việt Nam - Chất Lượng Quốc Tế'}"}
            <span 
              className="block bg-gradient-to-r bg-clip-text text-transparent"
              style={{ 
                backgroundImage: \`linear-gradient(to right, \${theme?.colors?.accent || '${colors.accent || '#D2691E'}'}, \${theme?.colors?.primary || '${colors.primary || '#8B4513'}'})\`
              }}
            >
              {content.subtitle || "${content.subtitle || 'Xuất khẩu cà phê chất lượng cao'}"}
            </span>
          </h1>
          
          <p 
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed"
            style={{ color: \`\${content.textColor || '#FFFFFF'}E6\` }}
          >
            {content.description || "${content.description || 'Chúng tôi chuyên cung cấp các loại cà phê Việt Nam chất lượng cao cho thị trường quốc tế, đảm bảo hương vị đặc trưng và tiêu chuẩn xuất khẩu.'}"}
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
            <button 
              className="group flex items-center space-x-2 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: theme?.colors?.accent || '${colors.accent || '#D2691E'}',
                color: theme?.colors?.text || '${colors.text || '#FFFFFF'}'
              }}
            >
              <span>{content.ctaText || "${content.ctaText || 'Tìm hiểu thêm'}"}</span>
              <ArrowRight size={20} />
            </button>
            <button 
              className="flex items-center space-x-2 px-8 py-4 rounded-lg font-semibold text-lg border-2 transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderColor: 'rgba(255,255,255,0.3)',
                color: content.textColor || '#FFFFFF'
              }}
            >
              <Download size={20} />
              <span>Hướng dẫn XNK từ A-Z</span>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div 
                className="text-3xl font-bold mb-2"
                style={{ color: theme?.colors?.accent || '${colors.accent || '#D2691E'}' }}
              >
                500+
              </div>
              <div 
                className="text-sm"
                style={{ color: \`\${content.textColor || '#FFFFFF'}CC\` }}
              >
                Đơn hàng thành công
              </div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div 
                className="text-3xl font-bold mb-2"
                style={{ color: theme?.colors?.accent || '${colors.accent || '#D2691E'}' }}
              >
                15
              </div>
              <div 
                className="text-sm"
                style={{ color: \`\${content.textColor || '#FFFFFF'}CC\` }}
              >
                Năm kinh nghiệm
              </div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div 
                className="text-3xl font-bold mb-2"
                style={{ color: theme?.colors?.accent || '${colors.accent || '#D2691E'}' }}
              >
                100+
              </div>
              <div 
                className="text-sm"
                style={{ color: \`\${content.textColor || '#FFFFFF'}CC\` }}
              >
                Đối tác Mỹ
              </div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.8s' }}>
              <div 
                className="text-3xl font-bold mb-2"
                style={{ color: theme?.colors?.accent || '${colors.accent || '#D2691E'}' }}
              >
                24/7
              </div>
              <div 
                className="text-sm"
                style={{ color: \`\${content.textColor || '#FFFFFF'}CC\` }}
              >
                Hỗ trợ khách hàng
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
        style={{ color: \`\${content.textColor || '#FFFFFF'}99\` }}
      >
        <div className="w-6 h-10 border-2 rounded-full flex justify-center" style={{ borderColor: \`\${content.textColor || '#FFFFFF'}4D\` }}>
          <div 
            className="w-1 h-3 rounded-full mt-2 animate-pulse"
            style={{ backgroundColor: \`\${content.textColor || '#FFFFFF'}99\` }}
          ></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection`
}

function generateAboutComponent(typescript: boolean, cssFramework: string, themeParams: any) {
  const content = themeParams?.content?.about || {}
  const colors = themeParams?.colors || {}
  
  return `'use client'

import React from 'react'

interface AboutProps {}

const About: React.FC<AboutProps> = () => {
  return (
    <section 
      className="py-20"
      style={{ 
        backgroundColor: '${content.backgroundColor || colors.background || '#FFFFFF'}',
        color: '${content.textColor || colors.text || '#8B4513'}'
      }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            ${content.title || 'Về Chúng Tôi'}
          </h2>
          <p className="text-xl leading-relaxed mb-8">
            ${content.description || 'Với hơn 20 năm kinh nghiệm trong ngành cà phê, chúng tôi tự hào là một trong những nhà cung cấp cà phê hàng đầu Việt Nam. Từ việc tuyển chọn những hạt cà phê tốt nhất đến quy trình rang xay hiện đại, chúng tôi cam kết mang đến cho khách hàng những sản phẩm chất lượng cao nhất.'}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl"
                style={{ backgroundColor: '${colors.accent || '#D2691E'}', color: 'white' }}
              >
                🌱
              </div>
              <h3 className="text-xl font-semibold mb-2">Nguyên Liệu Tự Nhiên</h3>
              <p className="opacity-80">100% hạt cà phê Arabica và Robusta được trồng tại các vùng cao nguyên Việt Nam</p>
            </div>
            
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl"
                style={{ backgroundColor: '${colors.accent || '#D2691E'}', color: 'white' }}
              >
                ⭐
              </div>
              <h3 className="text-xl font-semibold mb-2">Chất Lượng Cao</h3>
              <p className="opacity-80">Quy trình sản xuất hiện đại, đạt tiêu chuẩn quốc tế ISO 22000</p>
            </div>
            
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl"
                style={{ backgroundColor: '${colors.accent || '#D2691E'}', color: 'white' }}
              >
                🌍
              </div>
              <h3 className="text-xl font-semibold mb-2">Xuất Khẩu Toàn Cầu</h3>
              <p className="opacity-80">Sản phẩm có mặt tại hơn 20 quốc gia trên thế giới</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About`
}

function generateProblemsComponent(typescript: boolean, cssFramework: string, themeParams: any) {
  const content = themeParams?.content?.problems || {}
  const colors = themeParams?.colors || {}
  
  return `import React from 'react'

interface ProblemsProps {}

const Problems: React.FC<ProblemsProps> = () => {
  const problems = [
    {
      title: "Chất lượng không đồng đều",
      description: "Nhiều nhà cung cấp cà phê không đảm bảo chất lượng ổn định"
    },
    {
      title: "Giá cả không minh bạch", 
      description: "Khó khăn trong việc so sánh giá và chất lượng sản phẩm"
    },
    {
      title: "Dịch vụ hậu mại kém",
      description: "Thiếu hỗ trợ và tư vấn chuyên nghiệp sau khi mua hàng"
    }
  ]

  return (
    <section 
      className="py-20"
      style={{ 
        backgroundColor: '${content.backgroundColor || '#F8F8F8'}',
        color: '${content.textColor || colors.text || '#8B4513'}'
      }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            ${content.title || 'Thách Thức Của Thị Trường'}
          </h2>
          <p className="text-xl">
            ${content.description || 'Những vấn đề mà khách hàng thường gặp phải khi tìm kiếm nhà cung cấp cà phê chất lượng'}
          </p>
        </div>
        
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="bg-white p-8 rounded-lg shadow-lg">
             <div 
               className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold"
               style={{ backgroundColor: '${colors.accent || '#D2691E'}' }}
             >
               1
             </div>
             <h3 className="text-xl font-semibold mb-4 text-center">Chất lượng không đồng đều</h3>
             <p className="text-center opacity-80">Nhiều nhà cung cấp cà phê không đảm bảo chất lượng ổn định</p>
           </div>
           
           <div className="bg-white p-8 rounded-lg shadow-lg">
             <div 
               className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold"
               style={{ backgroundColor: '${colors.accent || '#D2691E'}' }}
             >
               2
             </div>
             <h3 className="text-xl font-semibold mb-4 text-center">Giá cả không minh bạch</h3>
             <p className="text-center opacity-80">Khó khăn trong việc so sánh giá và chất lượng sản phẩm</p>
           </div>
           
           <div className="bg-white p-8 rounded-lg shadow-lg">
             <div 
               className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold"
               style={{ backgroundColor: '${colors.accent || '#D2691E'}' }}
             >
               3
             </div>
             <h3 className="text-xl font-semibold mb-4 text-center">Dịch vụ hậu mại kém</h3>
             <p className="text-center opacity-80">Thiếu hỗ trợ và tư vấn chuyên nghiệp sau khi mua hàng</p>
           </div>
        </div>
      </div>
    </section>
  )
}

export default Problems`
}

function generateSolutionsComponent(typescript: boolean, cssFramework: string, themeParams: any) {
  const content = themeParams?.content?.solutions || {}
  const colors = themeParams?.colors || {}
  
  return `import React from 'react'

interface SolutionsProps {}

const Solutions: React.FC<SolutionsProps> = () => {
  const solutions = [
    {
      title: "Kiểm soát chất lượng nghiêm ngặt",
      description: "Quy trình 7 bước kiểm tra chất lượng từ khâu thu mua đến sản phẩm hoàn thiện",
      benefit: "Đảm bảo 100% sản phẩm đạt tiêu chuẩn xuất khẩu"
    },
    {
      title: "Hệ thống giá minh bạch",
      description: "Báo giá chi tiết, rõ ràng theo từng loại sản phẩm và số lượng",
      benefit: "Tiết kiệm 15-20% chi phí so với đối thủ cùng chất lượng"
    },
    {
      title: "Hỗ trợ 24/7",
      description: "Đội ngũ chuyên gia tư vấn và hỗ trợ khách hàng mọi lúc",
      benefit: "Giải quyết mọi vấn đề trong vòng 2 giờ"
    }
  ]

  return (
    <section 
      className="py-20"
      style={{ 
        backgroundColor: '${content.backgroundColor || colors.background || '#FFFFFF'}',
        color: '${content.textColor || colors.text || '#8B4513'}'
      }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            ${content.title || 'Giải Pháp Của Chúng Tôi'}
          </h2>
          <p className="text-xl">
            ${content.description || 'Cam kết mang đến giải pháp toàn diện cho mọi nhu cầu cà phê của bạn'}
          </p>
        </div>
        
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="bg-white p-8 rounded-lg shadow-lg border-l-4" style={{ borderLeftColor: '${colors.accent || '#D2691E'}' }}>
             <div 
               className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl"
               style={{ backgroundColor: '${colors.accent || '#D2691E'}', color: 'white' }}
             >
               ✓
             </div>
             <h3 className="text-xl font-semibold mb-4 text-center">Kiểm soát chất lượng nghiêm ngặt</h3>
             <p className="text-center mb-4 opacity-80">Quy trình 7 bước kiểm tra chất lượng từ khâu thu mua đến sản phẩm hoàn thiện</p>
             <div 
               className="text-center font-semibold p-3 rounded"
               style={{ backgroundColor: '${colors.accent || '#D2691E'}20', color: '${colors.accent || '#D2691E'}' }}
             >
               Đảm bảo 100% sản phẩm đạt tiêu chuẩn xuất khẩu
             </div>
           </div>
           
           <div className="bg-white p-8 rounded-lg shadow-lg border-l-4" style={{ borderLeftColor: '${colors.accent || '#D2691E'}' }}>
             <div 
               className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl"
               style={{ backgroundColor: '${colors.accent || '#D2691E'}', color: 'white' }}
             >
               ✓
             </div>
             <h3 className="text-xl font-semibold mb-4 text-center">Hệ thống giá minh bạch</h3>
             <p className="text-center mb-4 opacity-80">Báo giá chi tiết, rõ ràng theo từng loại sản phẩm và số lượng</p>
             <div 
               className="text-center font-semibold p-3 rounded"
               style={{ backgroundColor: '${colors.accent || '#D2691E'}20', color: '${colors.accent || '#D2691E'}' }}
             >
               Tiết kiệm 15-20% chi phí so với đối thủ cùng chất lượng
             </div>
           </div>
           
           <div className="bg-white p-8 rounded-lg shadow-lg border-l-4" style={{ borderLeftColor: '${colors.accent || '#D2691E'}' }}>
             <div 
               className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl"
               style={{ backgroundColor: '${colors.accent || '#D2691E'}', color: 'white' }}
             >
               ✓
             </div>
             <h3 className="text-xl font-semibold mb-4 text-center">Hỗ trợ 24/7</h3>
             <p className="text-center mb-4 opacity-80">Đội ngũ chuyên gia tư vấn và hỗ trợ khách hàng mọi lúc</p>
             <div 
               className="text-center font-semibold p-3 rounded"
               style={{ backgroundColor: '${colors.accent || '#D2691E'}20', color: '${colors.accent || '#D2691E'}' }}
             >
               Giải quyết mọi vấn đề trong vòng 2 giờ
             </div>
           </div>
        </div>
      </div>
    </section>
  )
}

export default Solutions`
}

function generateProductsComponent(typescript: boolean, cssFramework: string, themeParams: any) {
  const content = themeParams?.content?.products || {}
  const colors = themeParams?.colors || {}
  
  return `import React from 'react'

interface ProductsProps {}

const Products: React.FC<ProductsProps> = () => {
  const products = [
    {
      name: "Cà Phê Arabica Premium",
      description: "Hạt cà phê Arabica cao cấp từ vùng núi Cầu Đất, Đà Lạt",
      price: "350.000 VNĐ/kg",
      category: "Rang xay"
    },
    {
      name: "Cà Phê Robusta Đặc Biệt", 
      description: "Robusta thơm đậm từ vùng cao nguyên Kon Tum",
      price: "280.000 VNĐ/kg",
      category: "Rang xay"
    },
    {
      name: "Blend Coffee House",
      description: "Hỗn hợp cà phê độc quyền cho quán café",
      price: "320.000 VNĐ/kg", 
      category: "Pha chế"
    },
    {
      name: "Instant Coffee Premium",
      description: "Cà phê hòa tan cao cấp, tiện lợi",
      price: "450.000 VNĐ/kg",
      category: "Hòa tan"
    }
  ]

  return (
    <section 
      className="py-20"
      style={{ 
        backgroundColor: '${content.backgroundColor || '#F8F8F8'}',
        color: '${content.textColor || colors.text || '#8B4513'}'
      }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            ${content.title || 'Sản Phẩm Của Chúng Tôi'}
          </h2>
          <p className="text-xl">
            ${content.description || 'Đa dạng các loại cà phê chất lượng cao, phù hợp với mọi nhu cầu'}
          </p>
        </div>
        
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
             <div 
               className="h-48 flex items-center justify-center text-6xl"
               style={{ backgroundColor: '${colors.accent || '#D2691E'}20' }}
             >
               ☕
             </div>
             <div className="p-6">
               <div 
                 className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3"
                 style={{ backgroundColor: '${colors.accent || '#D2691E'}', color: 'white' }}
               >
                 Rang xay
               </div>
               <h3 className="text-xl font-semibold mb-3">Cà Phê Arabica Premium</h3>
               <p className="opacity-80 mb-4">Hạt cà phê Arabica cao cấp từ vùng núi Cầu Đất, Đà Lạt</p>
               <div className="flex justify-between items-center">
                 <span className="text-xl font-bold" style={{ color: '${colors.accent || '#D2691E'}' }}>
                   350.000 VNĐ/kg
                 </span>
                 <button 
                   className="px-4 py-2 rounded font-semibold hover:opacity-90 transition-opacity"
                   style={{ backgroundColor: '${colors.accent || '#D2691E'}', color: 'white' }}
                 >
                   Đặt hàng
                 </button>
               </div>
             </div>
           </div>
           
           <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
             <div 
               className="h-48 flex items-center justify-center text-6xl"
               style={{ backgroundColor: '${colors.accent || '#D2691E'}20' }}
             >
               ☕
             </div>
             <div className="p-6">
               <div 
                 className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3"
                 style={{ backgroundColor: '${colors.accent || '#D2691E'}', color: 'white' }}
               >
                 Rang xay
               </div>
               <h3 className="text-xl font-semibold mb-3">Cà Phê Robusta Đặc Biệt</h3>
               <p className="opacity-80 mb-4">Robusta thơm đậm từ vùng cao nguyên Kon Tum</p>
               <div className="flex justify-between items-center">
                 <span className="text-xl font-bold" style={{ color: '${colors.accent || '#D2691E'}' }}>
                   280.000 VNĐ/kg
                 </span>
                 <button 
                   className="px-4 py-2 rounded font-semibold hover:opacity-90 transition-opacity"
                   style={{ backgroundColor: '${colors.accent || '#D2691E'}', color: 'white' }}
                 >
                   Đặt hàng
                 </button>
               </div>
             </div>
           </div>
           
           <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
             <div 
               className="h-48 flex items-center justify-center text-6xl"
               style={{ backgroundColor: '${colors.accent || '#D2691E'}20' }}
             >
               ☕
             </div>
             <div className="p-6">
               <div 
                 className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3"
                 style={{ backgroundColor: '${colors.accent || '#D2691E'}', color: 'white' }}
               >
                 Pha chế
               </div>
               <h3 className="text-xl font-semibold mb-3">Blend Coffee House</h3>
               <p className="opacity-80 mb-4">Hỗn hợp cà phê độc quyền cho quán café</p>
               <div className="flex justify-between items-center">
                 <span className="text-xl font-bold" style={{ color: '${colors.accent || '#D2691E'}' }}>
                   320.000 VNĐ/kg
                 </span>
                 <button 
                   className="px-4 py-2 rounded font-semibold hover:opacity-90 transition-opacity"
                   style={{ backgroundColor: '${colors.accent || '#D2691E'}', color: 'white' }}
                 >
                   Đặt hàng
                 </button>
               </div>
             </div>
           </div>
           
           <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
             <div 
               className="h-48 flex items-center justify-center text-6xl"
               style={{ backgroundColor: '${colors.accent || '#D2691E'}20' }}
             >
               ☕
             </div>
             <div className="p-6">
               <div 
                 className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3"
                 style={{ backgroundColor: '${colors.accent || '#D2691E'}', color: 'white' }}
               >
                 Hòa tan
               </div>
               <h3 className="text-xl font-semibold mb-3">Instant Coffee Premium</h3>
               <p className="opacity-80 mb-4">Cà phê hòa tan cao cấp, tiện lợi</p>
               <div className="flex justify-between items-center">
                 <span className="text-xl font-bold" style={{ color: '${colors.accent || '#D2691E'}' }}>
                   450.000 VNĐ/kg
                 </span>
                 <button 
                   className="px-4 py-2 rounded font-semibold hover:opacity-90 transition-opacity"
                   style={{ backgroundColor: '${colors.accent || '#D2691E'}', color: 'white' }}
                 >
                   Đặt hàng
                 </button>
               </div>
             </div>
           </div>
        </div>
      </div>
    </section>
  )
}

export default Products`
}

function generateFooterComponent(typescript: boolean, cssFramework: string, themeParams: any) {
  const content = themeParams?.content?.footer || {}
  const colors = themeParams?.colors || {}
  
  return `import React from 'react'

// Simple icon components to replace Lucide icons
const Facebook = ({ size = 20 }) => <span style={{ fontSize: size }}>📘</span>
const Linkedin = ({ size = 20 }) => <span style={{ fontSize: size }}>💼</span>
const Twitter = ({ size = 20 }) => <span style={{ fontSize: size }}>🐦</span>
const Mail = ({ size = 16 }) => <span style={{ fontSize: size }}>✉️</span>
const Phone = ({ size = 16 }) => <span style={{ fontSize: size }}>📞</span>
const MapPin = ({ size = 16 }) => <span style={{ fontSize: size }}>📍</span>
const Coffee = ({ size = 24 }) => <span style={{ fontSize: size }}>☕</span>

interface FooterContent {
  companyName?: string;
  description?: string;
  backgroundColor?: string;
  textColor?: string;
  contact?: {
    phone?: string;
    email?: string;
    address?: string;
  };
}

interface FooterProps {
  theme: any;
  content: FooterContent;
}

const Footer = ({ theme = ${JSON.stringify(themeParams)}, content = ${JSON.stringify(content)} }: FooterProps) => {
  return (
    <footer 
      id="contact"
      style={{ 
        backgroundColor: content.backgroundColor || theme?.sections?.footer?.backgroundColor || theme?.colors?.secondary || '${colors.secondary || '#8B4513'}',
        color: content.textColor || theme?.sections?.footer?.textColor || '${content.textColor || '#F9FAFB'}'
      }}
    >
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: theme?.colors?.accent || '${colors.accent || '#D2691E'}' }}
              >
                <Coffee size={24} />
              </div>
              <div>
                <h3 
                  className="text-xl font-bold"
                  style={{ color: content.textColor || '${content.textColor || '#F9FAFB'}' }}
                >
                  {content.companyName || "${content.companyName || 'Cà Phê Việt'}"}
                </h3>
                <p 
                  className="text-sm"
                  style={{ color: \`\${content.textColor || '${content.textColor || '#F9FAFB'}'}CC\` }}
                >
                  Premium Export Coffee
                </p>
              </div>
            </div>
            <p 
              className="text-sm leading-relaxed"
              style={{ color: \`\${content.textColor || '${content.textColor || '#F9FAFB'}'}CC\` }}
            >
              {content.description || "${content.description || 'Chuyên cung cấp cà phê chất lượng cao cho thị trường quốc tế với cam kết về chất lượng và bền vững'}"}
            </p>
            <div className="flex space-x-3">
              <button 
                className="p-2 rounded hover:opacity-80 transition-colors"
                style={{ 
                  color: content.textColor || '${content.textColor || '#F9FAFB'}',
                  backgroundColor: \`\${content.textColor || '${content.textColor || '#F9FAFB'}'}1A\`
                }}
              >
                <Facebook size={20} />
              </button>
              <button 
                className="p-2 rounded hover:opacity-80 transition-colors"
                style={{ 
                  color: content.textColor || '${content.textColor || '#F9FAFB'}',
                  backgroundColor: \`\${content.textColor || '${content.textColor || '#F9FAFB'}'}1A\`
                }}
              >
                <Linkedin size={20} />
              </button>
              <button 
                className="p-2 rounded hover:opacity-80 transition-colors"
                style={{ 
                  color: content.textColor || '${content.textColor || '#F9FAFB'}',
                  backgroundColor: \`\${content.textColor || '${content.textColor || '#F9FAFB'}'}1A\`
                }}
              >
                <Twitter size={20} />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 
              className="text-lg font-semibold mb-4"
              style={{ color: content.textColor || '${content.textColor || '#F9FAFB'}' }}
            >
              Liên Kết Nhanh
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a 
                  href="#about" 
                  className="hover:opacity-80 transition-colors"
                  style={{ color: \`\${content.textColor || '${content.textColor || '#F9FAFB'}'}CC\` }}
                >
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a 
                  href="#products" 
                  className="hover:opacity-80 transition-colors"
                  style={{ color: \`\${content.textColor || '${content.textColor || '#F9FAFB'}'}CC\` }}
                >
                  Sản phẩm & Dịch vụ
                </a>
              </li>
              <li>
                <a 
                  href="#resources" 
                  className="hover:opacity-80 transition-colors"
                  style={{ color: \`\${content.textColor || '${content.textColor || '#F9FAFB'}'}CC\` }}
                >
                  Tài nguyên
                </a>
              </li>
              <li>
                <a 
                  href="#blog" 
                  className="hover:opacity-80 transition-colors"
                  style={{ color: \`\${content.textColor || '${content.textColor || '#F9FAFB'}'}CC\` }}
                >
                  Blog
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  className="hover:opacity-80 transition-colors"
                  style={{ color: \`\${content.textColor || '${content.textColor || '#F9FAFB'}'}CC\` }}
                >
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 
              className="text-lg font-semibold mb-4"
              style={{ color: content.textColor || '${content.textColor || '#F9FAFB'}' }}
            >
              Dịch Vụ
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a 
                  href="#" 
                  className="hover:opacity-80 transition-colors"
                  style={{ color: \`\${content.textColor || '${content.textColor || '#F9FAFB'}'}CC\` }}
                >
                  Xuất khẩu cà phê
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="hover:opacity-80 transition-colors"
                  style={{ color: \`\${content.textColor || '${content.textColor || '#F9FAFB'}'}CC\` }}
                >
                  Logistics & Vận chuyển
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="hover:opacity-80 transition-colors"
                  style={{ color: \`\${content.textColor || '${content.textColor || '#F9FAFB'}'}CC\` }}
                >
                  Tư vấn thủ tục
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="hover:opacity-80 transition-colors"
                  style={{ color: \`\${content.textColor || '${content.textColor || '#F9FAFB'}'}CC\` }}
                >
                  Đào tạo & Phát triển
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="hover:opacity-80 transition-colors"
                  style={{ color: \`\${content.textColor || '${content.textColor || '#F9FAFB'}'}CC\` }}
                >
                  Kiểm soát chất lượng
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 
              className="text-lg font-semibold mb-4"
              style={{ color: content.textColor || '${content.textColor || '#F9FAFB'}' }}
            >
              Liên Hệ
            </h4>
            <div className="space-y-3 text-sm mb-6">
              <div className="flex items-center space-x-3">
                <MapPin size={16} />
                <span style={{ color: \`\${content.textColor || '${content.textColor || '#F9FAFB'}'}CC\` }}>
                  {content.contact?.address || "${content.contact?.address || '123 Đường ABC, Quận 1, TP.HCM'}"}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} />
                <span style={{ color: \`\${content.textColor || '${content.textColor || '#F9FAFB'}'}CC\` }}>
                  {content.contact?.phone || "${content.contact?.phone || '+84 123 456 789'}"}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} />
                <span style={{ color: \`\${content.textColor || '${content.textColor || '#F9FAFB'}'}CC\` }}>
                  {content.contact?.email || "${content.contact?.email || 'info@capheviet.com'}"}
                </span>
              </div>
            </div>

            <div>
              <h5 
                className="font-semibold mb-3"
                style={{ color: content.textColor || '${content.textColor || '#F9FAFB'}' }}
              >
                Nhận tin tức mới nhất
              </h5>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="flex-1 px-3 py-2 rounded border-0 placeholder:opacity-60"
                  style={{ 
                    backgroundColor: \`\${content.textColor || '${content.textColor || '#F9FAFB'}'}1A\`,
                    color: content.textColor || '${content.textColor || '#F9FAFB'}'
                  }}
                />
                <button 
                  className="px-4 py-2 rounded font-semibold hover:opacity-90 transition-colors"
                  style={{
                    backgroundColor: theme?.colors?.accent || '${colors.accent || '#D2691E'}',
                    color: theme?.colors?.text || '${colors.text || '#FFFFFF'}'
                  }}
                >
                  Đăng ký
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          className="border-t mt-12 pt-8"
          style={{ borderColor: \`\${content.textColor || '${content.textColor || '#F9FAFB'}'}33\` }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div 
              className="text-sm"
              style={{ color: \`\${content.textColor || '${content.textColor || '#F9FAFB'}'}CC\` }}
            >
              © 2024 {content.companyName || "${content.companyName || 'Cà Phê Việt'}"}. Tất cả quyền được bảo lưu.
            </div>
            <div className="flex space-x-6 text-sm">
              <a 
                href="#" 
                className="hover:opacity-80 transition-colors"
                style={{ color: \`\${content.textColor || '${content.textColor || '#F9FAFB'}'}CC\` }}
              >
                Chính sách bảo mật
              </a>
              <a 
                href="#" 
                className="hover:opacity-80 transition-colors"
                style={{ color: \`\${content.textColor || '${content.textColor || '#F9FAFB'}'}CC\` }}
              >
                Điều khoản sử dụng
              </a>
              <a 
                href="#" 
                className="hover:opacity-80 transition-colors"
                style={{ color: \`\${content.textColor || '${content.textColor || '#F9FAFB'}'}CC\` }}
              >
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer`
}

function generateReadme({ projectName, description, framework, typescript, cssFramework }: any) {
  return `# ${projectName}

${description}

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

\`\`\`bash
npm install
\`\`\`

### Development

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:${framework === 'react-vite' ? '5173' : '3000'}] to view it in the browser.

### Build

\`\`\`bash
npm run build
\`\`\`

### Preview

\`\`\`bash
npm run preview
\`\`\`

## Tech Stack

- **Framework:** ${framework === 'react-vite' ? 'React + Vite' : 'Next.js'}
- **Language:** ${typescript ? 'TypeScript' : 'JavaScript'}
- **Styling:** ${cssFramework === 'tailwind' ? 'Tailwind CSS' : cssFramework === 'styled-components' ? 'Styled Components' : 'CSS Modules'}

## Project Structure

\`\`\`
src/
├── components/     # React components
├── ${framework === 'react-vite' ? 'App.tsx' : 'app/'}      # Main app files
└── ${framework === 'react-vite' ? 'index.css' : 'app/globals.css'}  # Global styles
\`\`\`

## Generated from Theme Editor

This project was automatically generated from the theme editor with the following features:

- Responsive design
- Theme-based styling
- Component-based architecture
- Production-ready configuration

## Customization

You can customize this project by:

1. Modifying component files in \`src/components/\`
2. Updating theme colors in CSS variables
3. Adding new sections or features
4. Customizing the styling approach

## License

MIT
`
}

function generateGitignore(framework: string) {
  return `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
dist/
build/
.next/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port`

// SEO Functions
function generateSitemapFile(projectName: string, themeParams?: any) {
  const baseUrl = 'https://your-domain.com' // This should be updated by user
  const lastmod = new Date().toISOString().split('T')[0]
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`
}

function generateRobotsTxtFile() {
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: https://your-domain.com/sitemap.xml

# Block access to admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /static/`
}

function generateManifestFile(projectName: string, themeParams?: any) {
  const name = themeParams?.content?.meta?.title || projectName
  const description = themeParams?.content?.meta?.description || `${projectName} - Professional business website`
  const themeColor = themeParams?.colors?.primary || '#8B4513'
  
  return JSON.stringify({
    "name": name,
    "short_name": projectName,
    "description": description,
    "start_url": "/",
    "display": "standalone",
    "theme_color": themeColor,
    "background_color": "#ffffff",
    "icons": [
      {
        "src": "/favicon.ico",
        "sizes": "64x64 32x32 24x24 16x16",
        "type": "image/x-icon"
      },
      {
        "src": "/logo-192.png",
        "type": "image/png",
        "sizes": "192x192"
      },
      {
        "src": "/logo-512.png",
        "type": "image/png",
        "sizes": "512x512"
      }
    ]
  }, null, 2)
}
}

// Declare global for temporary storage
declare global {
  var projectExports: Record<string, ArrayBuffer> | undefined
} 