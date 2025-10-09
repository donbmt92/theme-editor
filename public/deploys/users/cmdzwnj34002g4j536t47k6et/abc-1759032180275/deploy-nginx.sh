#!/bin/bash
# Optimized deploy script cho abc trên Nginx (Static HTML)
# Tạo bởi Theme Editor v2.0 - Fixed version

set -e

echo "🚀 Bắt đầu deploy abc..."

# Cấu hình
PROJECT_NAME="abc"
DOMAIN="vn.tptmarketing.info"
NGINX_ROOT="/var/www/$PROJECT_NAME"
NGINX_CONFIG="/etc/nginx/sites-available/$PROJECT_NAME"

# Kiểm tra quyền sudo
if [ "$EUID" -ne 0 ]; then
    echo "❌ Script cần chạy với quyền sudo"
    echo "Sử dụng: sudo ./deploy-nginx.sh"
    exit 1
fi

# Kiểm tra conflict domain
echo "🔍 Kiểm tra conflict domain..."
if [ -f "/etc/nginx/sites-enabled/$PROJECT_NAME" ]; then
    echo "⚠️  Site $PROJECT_NAME đã tồn tại, sẽ ghi đè..."
    sudo rm -f /etc/nginx/sites-enabled/$PROJECT_NAME
fi

echo "📁 Tạo thư mục web root..."
mkdir -p $NGINX_ROOT
chown www-data:www-data $NGINX_ROOT

echo "📋 Copy files to web directory..."
cp -r * $NGINX_ROOT/

# Loại bỏ file script khỏi web directory
rm -f $NGINX_ROOT/*.sh
rm -f $NGINX_ROOT/deploy-metadata.json

# Set quyền cho files
chown -R www-data:www-data $NGINX_ROOT
chmod -R 755 $NGINX_ROOT

echo "⚙️ Tạo cấu hình Nginx..."
cat > $NGINX_CONFIG << 'NGINX_EOF'
server {
    listen 80;
    server_name vn.tptmarketing.info www.vn.tptmarketing.info;
    root /var/www/abc;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
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
ln -sf $NGINX_CONFIG /etc/nginx/sites-enabled/

echo "🔄 Test cấu hình Nginx..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Cấu hình Nginx hợp lệ"
    echo "🔄 Reload Nginx..."
    systemctl reload nginx
    echo "✅ Deploy thành công!"
    echo ""
    echo "🌐 Website của bạn có thể truy cập tại:"
    echo "   http://vn.tptmarketing.info"
    echo ""
    echo "📝 Bước tiếp theo:"
    echo "   1. Cập nhật DNS để trỏ vn.tptmarketing.info về server này"
    echo "   2. Cài đặt SSL certificate với Let's Encrypt:"
    echo "      sudo certbot --nginx -d vn.tptmarketing.info -d www.vn.tptmarketing.info"
else
    echo "❌ Cấu hình Nginx có lỗi!"
    echo "🔍 Kiểm tra lỗi chi tiết:"
    echo "   - sudo nginx -T | grep nginx_root"
    echo "   - sudo grep -r 'nginx_root' /etc/nginx/"
    echo "   - sudo ls -la /etc/nginx/sites-enabled/"
    echo "   - sudo cat /etc/nginx/sites-available/$PROJECT_NAME"
    exit 1
fi