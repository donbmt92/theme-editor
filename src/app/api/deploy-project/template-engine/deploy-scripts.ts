import { DEPLOY_SCRIPT_NAMES, SERVER_TYPES } from '../constants'
import { NginxParams, ApacheParams, NodeParams, DockerParams } from '../types'

/**
 * Get deploy script name for server type
 */
export function getDeployScriptName(serverType: string): string {
  return DEPLOY_SCRIPT_NAMES[serverType as keyof typeof DEPLOY_SCRIPT_NAMES] || 'deploy.sh'
}

/**
 * Generate Nginx deploy script
 */
export function generateNginxDeployScript({ projectName, domain }: NginxParams): string {
  return `#!/bin/bash
# Optimized deploy script cho ${projectName} trên Nginx (Static HTML)
# Tạo bởi Theme Editor v2.0 - Fixed version

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

# Kiểm tra conflict domain
echo "🔍 Kiểm tra conflict domain..."
if [ -f "/etc/nginx/sites-enabled/\$PROJECT_NAME" ]; then
    echo "⚠️  Site \$PROJECT_NAME đã tồn tại, sẽ ghi đè..."
    sudo rm -f /etc/nginx/sites-enabled/\$PROJECT_NAME
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
cat > \$NGINX_CONFIG << 'NGINX_EOF'
server {
    listen 80;
    server_name ${domain} www.${domain};
    root /var/www/${projectName};
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
NGINX_EOF

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
    echo "   http://${domain}"
    echo ""
    echo "📝 Bước tiếp theo:"
    echo "   1. Cập nhật DNS để trỏ ${domain} về server này"
    echo "   2. Cài đặt SSL certificate với Let's Encrypt:"
    echo "      sudo certbot --nginx -d ${domain} -d www.${domain}"
else
    echo "❌ Cấu hình Nginx có lỗi!"
    echo "🔍 Kiểm tra lỗi chi tiết:"
    echo "   - sudo nginx -T | grep nginx_root"
    echo "   - sudo grep -r 'nginx_root' /etc/nginx/"
    echo "   - sudo ls -la /etc/nginx/sites-enabled/"
    echo "   - sudo cat /etc/nginx/sites-available/\$PROJECT_NAME"
    exit 1
fi`
}

/**
 * Generate Apache deploy script
 */
export function generateApacheDeployScript({ projectName, domain }: ApacheParams): string {
  return `#!/bin/bash
# Optimized Apache deploy script cho ${projectName}
# Tạo bởi Theme Editor v2.0

set -e

echo "🚀 Bắt đầu deploy ${projectName} trên Apache..."

# Cấu hình
PROJECT_NAME="${projectName}"
DOMAIN="${domain}"
APACHE_ROOT="/var/www/\$PROJECT_NAME"
APACHE_CONFIG="/etc/apache2/sites-available/\$PROJECT_NAME.conf"

# Kiểm tra quyền sudo
if [ "\$EUID" -ne 0 ]; then
    echo "❌ Script cần chạy với quyền sudo"
    exit 1
fi

echo "📁 Tạo thư mục web root..."
mkdir -p \$APACHE_ROOT
chown www-data:www-data \$APACHE_ROOT

echo "📋 Copy files to web directory..."
cp -r * \$APACHE_ROOT/

# Loại bỏ file script
rm -f \$APACHE_ROOT/*.sh
rm -f \$APACHE_ROOT/deploy-metadata.json

# Set quyền
chown -R www-data:www-data \$APACHE_ROOT
chmod -R 755 \$APACHE_ROOT

echo "⚙️ Tạo cấu hình Apache..."
cat > \$APACHE_CONFIG << 'APACHE_EOF'
<VirtualHost *:80>
    ServerName ${domain}
    ServerAlias www.${domain}
    DocumentRoot /var/www/${projectName}
    
    <Directory /var/www/${projectName}>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    # Enable compression
    LoadModule deflate_module modules/mod_deflate.so
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/plain
        AddOutputFilterByType DEFLATE text/html
        AddOutputFilterByType DEFLATE text/xml
        AddOutputFilterByType DEFLATE text/css
        AddOutputFilterByType DEFLATE application/xml
        AddOutputFilterByType DEFLATE application/xhtml+xml
        AddOutputFilterByType DEFLATE application/rss+xml
        AddOutputFilterByType DEFLATE application/javascript
        AddOutputFilterByType DEFLATE application/x-javascript
    </IfModule>
    
    # Security headers
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set X-Content-Type-Options "nosniff"
</VirtualHost>
APACHE_EOF

echo "🔗 Kích hoạt site..."
a2ensite \$PROJECT_NAME

echo "🔄 Test cấu hình Apache..."
apache2ctl configtest

if [ \$? -eq 0 ]; then
    echo "✅ Cấu hình Apache hợp lệ"
    echo "🔄 Reload Apache..."
    systemctl reload apache2
    echo "✅ Deploy thành công!"
    echo ""
    echo "🌐 Website: http://${domain}"
else
    echo "❌ Cấu hình Apache có lỗi!"
    exit 1
fi`
}

/**
 * Generate Node.js deploy script
 */
export function generateNodeDeployScript({ projectName }: NodeParams): string {
  return `#!/bin/bash
# Optimized Node.js deploy script cho ${projectName}
# Tạo bởi Theme Editor v2.0

set -e

echo "🚀 Bắt đầu deploy ${projectName} trên Node.js..."

# Cấu hình
PROJECT_NAME="${projectName}"
APP_DIR="/opt/\$PROJECT_NAME"
SERVICE_NAME="\$PROJECT_NAME"
USER="node"

# Kiểm tra quyền sudo
if [ "\$EUID" -ne 0 ]; then
    echo "❌ Script cần chạy với quyền sudo"
    exit 1
fi

echo "📁 Tạo thư mục ứng dụng..."
mkdir -p \$APP_DIR
chown \$USER:\$USER \$APP_DIR

echo "📋 Copy files to app directory..."
cp -r * \$APP_DIR/

# Loại bỏ file script
rm -f \$APP_DIR/*.sh
rm -f \$APP_DIR/deploy-metadata.json

# Set quyền
chown -R \$USER:\$USER \$APP_DIR
chmod -R 755 \$APP_DIR

echo "📦 Cài đặt dependencies..."
cd \$APP_DIR
if [ -f "package.json" ]; then
    npm install --production
else
    echo "⚠️  Không tìm thấy package.json"
fi

echo "⚙️ Tạo systemd service..."
cat > /etc/systemd/system/\$SERVICE_NAME.service << 'SERVICE_EOF'
[Unit]
Description=${projectName} Node.js App
After=network.target

[Service]
Type=simple
User=node
WorkingDirectory=/opt/${projectName}
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
SERVICE_EOF

echo "🔄 Reload systemd và kích hoạt service..."
systemctl daemon-reload
systemctl enable \$SERVICE_NAME

echo "🚀 Khởi động service..."
systemctl start \$SERVICE_NAME

if systemctl is-active --quiet \$SERVICE_NAME; then
    echo "✅ Deploy thành công!"
    echo "🌐 Service: \$SERVICE_NAME"
    echo "📊 Status: \$(systemctl status \$SERVICE_NAME --no-pager -l)"
else
    echo "❌ Service khởi động thất bại!"
    systemctl status \$SERVICE_NAME --no-pager -l
    exit 1
fi`
}

/**
 * Generate Docker deploy script
 */
export function generateDockerDeployScript({ projectName, domain }: DockerParams): string {
  return `#!/bin/bash
# Optimized Docker deploy script cho ${projectName}
# Tạo bởi Theme Editor v2.0

set -e

echo "🚀 Bắt đầu deploy ${projectName} với Docker..."

# Cấu hình
PROJECT_NAME="${projectName}"
DOMAIN="${domain}"
DOCKER_IMAGE="\$PROJECT_NAME:latest"
CONTAINER_NAME="\$PROJECT_NAME"
PORT="80"

# Kiểm tra Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker chưa được cài đặt"
    exit 1
fi

echo "📁 Tạo Dockerfile..."
cat > Dockerfile << 'DOCKERFILE_EOF'
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
DOCKERFILE_EOF

echo "🐳 Build Docker image..."
docker build -t \$DOCKER_IMAGE .

echo "🔄 Dừng container cũ nếu có..."
docker stop \$CONTAINER_NAME 2>/dev/null || true
docker rm \$CONTAINER_NAME 2>/dev/null || true

echo "🚀 Khởi động container mới..."
docker run -d \\
  --name \$CONTAINER_NAME \\
  -p \$PORT:80 \\
  --restart unless-stopped \\
  \$DOCKER_IMAGE

if docker ps | grep -q \$CONTAINER_NAME; then
    echo "✅ Deploy thành công!"
    echo "🐳 Container: \$CONTAINER_NAME"
    echo "🌐 Port: \$PORT"
    echo "📊 Status: \$(docker ps --filter name=\$CONTAINER_NAME --format 'table {{.Names}}\\t{{.Status}}\\t{{.Ports}}')"
    
    # Setup reverse proxy nếu cần
    if [ ! -z "${domain}" ] && [ "${domain}" != "localhost" ]; then
        echo "📝 Lưu ý: Cần cấu hình reverse proxy để trỏ ${domain} về port \$PORT"
    fi
else
    echo "❌ Container khởi động thất bại!"
    docker logs \$CONTAINER_NAME
    exit 1
fi`
}

/**
 * Generate deploy script based on server type
 */
export function generateDeployScript(params: {
  projectName: string
  serverType: string
  domain?: string
  timestamp?: number
}): string {
  const { projectName, serverType, domain, timestamp } = params
  
  switch (serverType) {
    case SERVER_TYPES.NGINX:
      return generateNginxDeployScript({ projectName, domain: domain || 'localhost' })
    case SERVER_TYPES.APACHE:
      return generateApacheDeployScript({ projectName, domain: domain || 'localhost' })
    case SERVER_TYPES.NODE:
      return generateNodeDeployScript({ projectName })
    case SERVER_TYPES.DOCKER:
      return generateDockerDeployScript({ projectName, domain: domain || 'localhost' })
    default:
      return generateNginxDeployScript({ projectName, domain: domain || 'localhost' })
  }
}
