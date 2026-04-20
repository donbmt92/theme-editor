import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import path from 'path'
import fs from 'fs/promises'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { projectId, domain, serverType, filesystemPath } = await request.json()

    if (!projectId || !domain || !serverType || !filesystemPath) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate new deploy script with updated domain
    const projectName = path.basename(filesystemPath)
    const newDeployScript = generateDeployScript_func(projectName, serverType, domain)
    const scriptName = getDeployScriptName(serverType)
    
    // Write updated script to filesystem
    const scriptPath = path.join(filesystemPath, scriptName)
    await fs.writeFile(scriptPath, newDeployScript, 'utf8')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update deploy script:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update deploy script' },
      { status: 500 }
    )
  }
}

// Helper functions for deploy script generation
function generateDeployScript_func(projectName: string, serverType: string, domain: string): string {
  switch (serverType) {
    case 'nginx':
      return generateNginxDeployScript(projectName, domain)
    case 'apache':
      return generateApacheDeployScript(projectName, domain)
    case 'node':
      return generateNodeDeployScript(projectName)
    case 'docker':
      return generateDockerDeployScript(projectName, domain)
    default:
      return generateNginxDeployScript(projectName, domain)
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
# Tạo bởi Theme Editor - Updated with domain: ${domain}

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
# Tạo bởi Theme Editor - Updated with domain: ${domain}

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
echo "   http://localhost:\$PORT"`
}

function generateDockerDeployScript(projectName: string, domain: string): string {
  return `#!/bin/bash

# Deploy script cho ${projectName} với Docker (Static HTML)
# Tạo bởi Theme Editor - Updated with domain: ${domain}

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