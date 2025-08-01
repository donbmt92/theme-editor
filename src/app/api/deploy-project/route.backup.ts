/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import path from 'path'
import fs from 'fs/promises'
import { createWriteStream } from 'fs'
import { pipeline } from 'stream/promises'
import { Readable } from 'stream'
import { ThemeParams } from '@/types'

// Rate limiting và caching cho VPS: 4 vCPU, 16GB RAM, 200GB NVMe
const deployQueue = new Map<string, Promise<any>>()
const templateCache = new Map<string, string>()
const MAX_CONCURRENT_DEPLOYS = 50          // Optimized for 16GB RAM
const CLEANUP_INTERVAL = 6 * 60 * 60 * 1000 // 6 hours cho 200GB disk
const MAX_DEPLOY_AGE = 14 * 24 * 60 * 60 * 1000 // 14 days retention

interface DeployOptions {
  projectName: string
  description: string
  includeAssets: boolean
  createUserFolder: boolean
  generateDeployScript: boolean
  serverType: 'nginx' | 'apache' | 'node' | 'docker'
  domain: string
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  console.log('🚀 [DEPLOY] Starting project deploy process...')
  
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
      includeAssets,
      createUserFolder,
      generateDeployScript,
      serverType,
      domain,
      themeParams 
    } = await request.json()

    console.log('📋 [DEPLOY] Deploy configuration:', {
      projectId,
      userId,
      projectName,
      includeAssets,
      createUserFolder,
      generateDeployScript,
      serverType,
      domain
    })

    // Validate required fields
    if (!projectId || !projectName || !themeParams) {
      console.error('❌ [DEPLOY] Missing required fields')
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('✅ [DEPLOY] Validation passed')

    // Step 1: Generate Static HTML files
    console.log('📁 [DEPLOY] Step 1: Generating static HTML files...')
    
    const projectFiles = await generateStaticHtmlFiles({
      projectName,
      description,
      includeAssets,
      themeParams
    })
    
    console.log(`✅ [DEPLOY] Generated ${Object.keys(projectFiles).length} files`)

    // Step 1.5: Add deploy script if requested
    let deployScriptPath = ''
    if (generateDeployScript) {
      console.log('📜 [DEPLOY] Adding deploy script...')
      const deployScript = generateDeployScript_func(projectName, serverType, domain)
      const scriptName = getDeployScriptName(serverType)
      projectFiles[scriptName] = deployScript
      deployScriptPath = scriptName
      console.log(`✅ [DEPLOY] Deploy script added: ${scriptName}`)
    }

    // Step 2: Create folder structure directly on filesystem
    console.log('📂 [DEPLOY] Step 2: Creating folder structure...')
    
    const timestamp = Date.now()
    const baseDir = path.join(process.cwd(), 'public', 'deploys')
    let projectDir: string
    let userFolderPath = ''
    
    if (createUserFolder && userId) {
      userFolderPath = `users/${userId}/${projectName}-${timestamp}/`
      projectDir = path.join(baseDir, 'users', userId, `${projectName}-${timestamp}`)
      console.log(`📁 [DEPLOY] Creating user folder: ${userFolderPath}`)
    } else {
      projectDir = path.join(baseDir, `${projectName}-${timestamp}`)
    }
    
    try {
      await fs.mkdir(projectDir, { recursive: true })
      console.log(`📁 [DEPLOY] Created directory: ${projectDir}`)
      
      // Write all files to the folder
      for (const [filePath, content] of Object.entries(projectFiles)) {
        const fullPath = path.join(projectDir, filePath)
        const dir = path.dirname(fullPath)
        
        // Create subdirectories if needed
        await fs.mkdir(dir, { recursive: true })
        
        // Write file
        await fs.writeFile(fullPath, content, 'utf8')
        console.log(`📄 [DEPLOY] Created: ${filePath}`)
      }
      
      // Save metadata
      const metadataPath = path.join(projectDir, 'deploy-metadata.json')
      const metadata = {
        projectId,
        userId,
        projectName,
        deployTime: new Date().toISOString(),
        fileCount: Object.keys(projectFiles).length,
        userFolderPath: userFolderPath || null,
        deployScriptPath: deployScriptPath || null,
        serverType: serverType || null,
        domain: domain || null,
        includeAssets
      }
      await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2))
      console.log(`📄 [DEPLOY] Metadata saved to: ${metadataPath}`)
      
    } catch (error) {
      console.error('❌ [DEPLOY] Failed to create folder structure:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to create project folder' },
        { status: 500 }
      )
    }

    // Calculate total time
    const totalTime = Date.now() - startTime
    console.log(`⏱️ [DEPLOY] Total deploy time: ${totalTime}ms`)

    // Return success response
    const response = {
      success: true,
      projectId,
      projectName,
      folderPath: projectDir,
      fileCount: Object.keys(projectFiles).length,
      deployScriptPath: deployScriptPath || null,
      userFolderPath: userFolderPath || null,
      filesystemPath: projectDir,
      deployTime: totalTime
    }

    console.log('🎉 [DEPLOY] Deploy completed successfully:', {
      projectName,
      folderPath: projectDir,
      fileCount: Object.keys(projectFiles).length,
      deployScriptPath: deployScriptPath || null,
      userFolderPath: userFolderPath || null
    })

    return NextResponse.json(response)

  } catch (error) {
    const totalTime = Date.now() - startTime
    console.error('💥 [DEPLOY] Deploy failed after', totalTime, 'ms:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Deploy failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        deployTime: totalTime
      },
      { status: 500 }
    )
  }
}

// Function to generate static HTML files
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
  console.log('🔧 [DEPLOY] Generating static HTML files...')

  const files: Record<string, string> = {}
  
  // Generate main HTML file
  console.log('📄 [DEPLOY] Generating index.html...')
  files['index.html'] = generateStaticHtml(projectName, description, themeParams)
  
  // Generate separate CSS file
  console.log('🎨 [DEPLOY] Generating styles.css...')
  files['assets/css/styles.css'] = generateStaticCss(themeParams)
  
  // Generate JavaScript file for interactivity
  console.log('⚡ [DEPLOY] Generating scripts.js...')
  files['assets/js/scripts.js'] = generateStaticJs()
  
  // Generate SEO files
  console.log('🔍 [DEPLOY] Generating SEO files...')
  files['sitemap.xml'] = generateSitemapFile(projectName, themeParams)
  files['robots.txt'] = generateRobotsTxtFile()
  files['manifest.json'] = generateManifestFile(projectName, themeParams)
  
  // Generate README
  console.log('📖 [DEPLOY] Generating README...')
  files['README.md'] = generateStaticReadme(projectName, description)
  
  // If includeAssets, add placeholder images
  if (includeAssets) {
    console.log('🖼️ [DEPLOY] Adding placeholder assets...')
    files['assets/images/hero-coffee.jpg'] = '<!-- Placeholder for hero image -->'
    files['assets/images/logo.png'] = '<!-- Placeholder for logo -->'
    files['assets/images/favicon.ico'] = '<!-- Placeholder for favicon -->'
  }

  console.log(`✅ [DEPLOY] Generated ${Object.keys(files).length} static files`)
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

// Helper functions for deploy script generation
function generateDeployScript_func(projectName: string, serverType: string, domain?: string): string {
  const finalDomain = domain || 'your-domain.com'
  switch (serverType) {
    case 'nginx':
      return generateNginxDeployScript(projectName, finalDomain)
    case 'apache':
      return generateApacheDeployScript(projectName, finalDomain)
    case 'node':
      return generateNodeDeployScript(projectName)
    case 'docker':
      return generateDockerDeployScript(projectName, finalDomain)
    default:
      return generateNginxDeployScript(projectName, finalDomain)
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

function generateNginxDeployScript(projectName: string, domain: string): string {
  return `#!/bin/bash

# Deploy script cho ${projectName} trên Nginx (Static HTML)
# Tạo bởi Theme Editor

set -e

echo "🚀 Bắt đầu deploy ${projectName}..."

# Cấu hình
PROJECT_NAME="${projectName}"
DOMAIN="${domain}"
NGINX_ROOT="/var/www/\$PROJECT_NAME"
NGINX_CONFIG="/etc/nginx/sites-available/\$PROJECT_NAME"

# Kiểm tra quyền sudo
if [ "\$EUID" -ne 0 ]; then
    echo "❌ Script cần chạy với quyền sudo"
    echo "Sử dụng: sudo ./deploy-nginx.sh"
    exit 1
fi

echo "📁 Tạo thư mục web root..."
mkdir -p \$NGINX_ROOT
chown www-data:www-data \$NGINX_ROOT

echo "📋 Copy files to web directory..."
cp -r * \$NGINX_ROOT/

# Loại bỏ file script khỏi web directory
rm -f \$NGINX_ROOT/*.sh
rm -f \$NGINX_ROOT/deploy-metadata.json

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

function generateApacheDeployScript(projectName: string, domain: string): string {
  return `#!/bin/bash

# Deploy script cho ${projectName} trên Apache (Static HTML)
# Tạo bởi Theme Editor

set -e

echo "🚀 Bắt đầu deploy ${projectName}..."

# Cấu hình
PROJECT_NAME="${projectName}"
DOMAIN="${domain}"
APACHE_ROOT="/var/www/html/\$PROJECT_NAME"
APACHE_CONFIG="/etc/apache2/sites-available/\$PROJECT_NAME.conf"

# Kiểm tra quyền sudo
if [ "\$EUID" -ne 0 ]; then
    echo "❌ Script cần chạy với quyền sudo"
    echo "Sử dụng: sudo ./deploy-apache.sh"
    exit 1
fi

echo "📁 Tạo thư mục web root..."
mkdir -p \$APACHE_ROOT

echo "📋 Copy files to web directory..."
cp -r * \$APACHE_ROOT/

# Loại bỏ file script khỏi web directory
rm -f \$APACHE_ROOT/*.sh
rm -f \$APACHE_ROOT/deploy-metadata.json

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
    
    ErrorLog \${APACHE_LOG_DIR}/\$PROJECT_NAME_error.log
    CustomLog \${APACHE_LOG_DIR}/\$PROJECT_NAME_access.log combined
</VirtualHost>
EOF

echo "🔗 Kích hoạt site..."
a2ensite \$PROJECT_NAME.conf

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

function generateNodeDeployScript(projectName: string): string {
  return `#!/bin/bash

# Deploy script cho ${projectName} với Node.js (Static HTML)
# Tạo bởi Theme Editor

set -e

echo "🚀 Bắt đầu deploy ${projectName}..."

# Cấu hình
PROJECT_NAME="${projectName}"
PORT="3000"
PM2_APP_NAME="\$PROJECT_NAME"

echo "📦 Cài đặt serve để host static files..."
npm install -g serve

echo "📝 Tạo ecosystem file cho PM2..."
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: '\$PM2_APP_NAME',
    script: 'serve',
    args: '-s . -l \$PORT',
    cwd: process.cwd(),
    env: {
      NODE_ENV: 'production'
    }
  }]
}
EOF

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

function generateDockerDeployScript(projectName: string, domain: string): string {
  return `#!/bin/bash

# Deploy script cho ${projectName} với Docker (Static HTML)
# Tạo bởi Theme Editor

set -e

echo "🚀 Bắt đầu deploy ${projectName} với Docker..."

# Cấu hình
PROJECT_NAME="${projectName}"
CONTAINER_NAME="\$PROJECT_NAME-container"
IMAGE_NAME="\$PROJECT_NAME:latest"
DOMAIN="${domain}"

echo "📝 Tạo Dockerfile..."
cat > Dockerfile << 'EOF'
FROM nginx:alpine

# Copy static files
COPY . /usr/share/nginx/html

# Remove scripts from web directory
RUN rm -f /usr/share/nginx/html/*.sh
RUN rm -f /usr/share/nginx/html/deploy-metadata.json

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
EOF

echo "📝 Tạo docker-compose.yml..."
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  app:
    build: .
    container_name: \$CONTAINER_NAME
    ports:
      - "80:80"
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
echo "   http://localhost"
echo ""
echo "🐳 Docker Commands:"
echo "   docker-compose logs -f    # Xem logs"
echo "   docker-compose stop       # Stop container"
echo "   docker-compose restart    # Restart container"
echo "   docker-compose down       # Stop và remove container"`
}

// Import and use helper functions from export-project route for consistency
function generateStaticCss(themeParams: any) {
  // Same implementation as export-project route
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

/* Add more CSS here as needed */`
}

// Add other helper functions for generating static content...
function generateStaticJs() {
  return `// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    console.log('Static HTML website loaded successfully');
    
    // Add any interactive functionality here
});`
}

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
    "description": `${projectName} - Professional Website`,
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

function generateStaticReadme(projectName: string, description: string) {
  return `# ${projectName}

${description}

## Static HTML Website

This is a static HTML website deployed from the theme editor.

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

## Deployment

Use the provided deploy script for your server type (Nginx, Apache, Node.js, or Docker).

## License

MIT License - Feel free to use for commercial and personal projects.
`
}

// Add the HTML section generation functions (simplified versions)
function generateStaticHeader(content: any, colors: any) {
  const headerContent = content?.header || {}
  
  return `<header style="background-color: ${colors.secondary || '#D2691E'}; padding: 1rem 0;">
    <div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem; display: flex; justify-content: space-between; align-items: center;">
      <div style="color: white; font-size: 1.5rem; font-weight: bold;">
        ${headerContent.title || 'Your Website'}
      </div>
      <nav style="display: flex; gap: 2rem;">
        <a href="#about" style="color: white; text-decoration: none;">About</a>
        <a href="#products" style="color: white; text-decoration: none;">Products</a>
        <a href="#contact" style="color: white; text-decoration: none;">Contact</a>
      </nav>
    </div>
  </header>`
}

function generateStaticHeroSection(content: any, colors: any) {
  const heroContent = content?.hero || {}
  
  return `<section style="background: linear-gradient(135deg, ${colors.primary || '#8B4513'}, ${colors.secondary || '#D2691E'}); color: white; padding: 5rem 0; text-align: center;">
    <div style="max-width: 800px; margin: 0 auto; padding: 0 1rem;">
      <h1 style="font-size: 3rem; margin-bottom: 1rem;">
        ${heroContent.title || 'Welcome to Our Website'}
      </h1>
      <p style="font-size: 1.25rem; margin-bottom: 2rem;">
        ${heroContent.description || 'Professional services for your business'}
      </p>
      <a href="#contact" style="background-color: ${colors.accent || '#CD853F'}; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 0.5rem; display: inline-block;">
        Get Started
      </a>
    </div>
  </section>`
}

function generateStaticAboutSection(content: any, colors: any) {
  return `<section id="about" style="padding: 5rem 0; background: white;">
    <div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem; text-align: center;">
      <h2 style="font-size: 2.5rem; margin-bottom: 1rem;">About Us</h2>
      <p style="font-size: 1.25rem; color: #666; max-width: 600px; margin: 0 auto;">
        We provide professional services with quality and dedication.
      </p>
    </div>
  </section>`
}

function generateStaticProblemsSection(content: any, colors: any) {
  return `<section style="padding: 5rem 0; background: #f8f9fa;">
    <div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem; text-align: center;">
      <h2 style="font-size: 2.5rem; margin-bottom: 3rem;">Challenges We Solve</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
        <div style="background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h3>Problem 1</h3>
          <p>Description of the first problem we solve.</p>
        </div>
        <div style="background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h3>Problem 2</h3>
          <p>Description of the second problem we solve.</p>
        </div>
        <div style="background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h3>Problem 3</h3>
          <p>Description of the third problem we solve.</p>
        </div>
      </div>
    </div>
  </section>`
}

function generateStaticSolutionsSection(content: any, colors: any) {
  return `<section style="padding: 5rem 0; background: white;">
    <div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem; text-align: center;">
      <h2 style="font-size: 2.5rem; margin-bottom: 3rem;">Our Solutions</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
        <div style="background: #f8f9fa; padding: 2rem; border-radius: 0.5rem; border-left: 4px solid ${colors.accent || '#CD853F'};">
          <h3>Solution 1</h3>
          <p>How we solve the first problem effectively.</p>
        </div>
        <div style="background: #f8f9fa; padding: 2rem; border-radius: 0.5rem; border-left: 4px solid ${colors.accent || '#CD853F'};">
          <h3>Solution 2</h3>
          <p>How we solve the second problem effectively.</p>
        </div>
        <div style="background: #f8f9fa; padding: 2rem; border-radius: 0.5rem; border-left: 4px solid ${colors.accent || '#CD853F'};">
          <h3>Solution 3</h3>
          <p>How we solve the third problem effectively.</p>
        </div>
      </div>
    </div>
  </section>`
}

function generateStaticProductsSection(content: any, colors: any) {
  return `<section id="products" style="padding: 5rem 0; background: #f8f9fa;">
    <div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem; text-align: center;">
      <h2 style="font-size: 2.5rem; margin-bottom: 3rem;">Our Products</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
        <div style="background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="height: 200px; background: ${colors.accent || '#CD853F'}; margin-bottom: 1rem; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; font-size: 3rem;">📦</div>
          <h3>Product 1</h3>
          <p>Description of our first product.</p>
        </div>
        <div style="background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="height: 200px; background: ${colors.accent || '#CD853F'}; margin-bottom: 1rem; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; font-size: 3rem;">📦</div>
          <h3>Product 2</h3>
          <p>Description of our second product.</p>
        </div>
        <div style="background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="height: 200px; background: ${colors.accent || '#CD853F'}; margin-bottom: 1rem; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; font-size: 3rem;">📦</div>
          <h3>Product 3</h3>
          <p>Description of our third product.</p>
        </div>
      </div>
    </div>
  </section>`
}

function generateStaticFooter(content: any, colors: any) {
  const footerContent = content?.footer || {}
  
  return `<footer id="contact" style="background-color: ${colors.secondary || '#D2691E'}; color: white; padding: 3rem 0;">
    <div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
        <div>
          <h3 style="margin-bottom: 1rem;">${footerContent.companyName || 'Your Company'}</h3>
          <p style="opacity: 0.8;">Professional services for your business needs.</p>
        </div>
        <div>
          <h3 style="margin-bottom: 1rem;">Quick Links</h3>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <a href="#about" style="color: rgba(255,255,255,0.8); text-decoration: none;">About</a>
            <a href="#products" style="color: rgba(255,255,255,0.8); text-decoration: none;">Products</a>
            <a href="#contact" style="color: rgba(255,255,255,0.8); text-decoration: none;">Contact</a>
          </div>
        </div>
        <div>
          <h3 style="margin-bottom: 1rem;">Contact Info</h3>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <div>📍 123 Business St, City</div>
            <div>📞 +1 (555) 123-4567</div>
            <div>✉️ info@yourbusiness.com</div>
          </div>
        </div>
      </div>
      <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 2rem; text-align: center; opacity: 0.8;">
        © 2024 ${footerContent.companyName || 'Your Company'}. All rights reserved.
      </div>
    </div>
  </footer>`
}