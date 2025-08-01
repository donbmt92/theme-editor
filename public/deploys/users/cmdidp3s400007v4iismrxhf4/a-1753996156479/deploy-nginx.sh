#!/bin/bash
# Optimized deploy script cho a trên Nginx (Static HTML)
# Tạo bởi Theme Editor v2.0

set -e

echo "🚀 Bắt đầu deploy a..."

# Cấu hình
PROJECT_NAME="a"
DOMAIN="https://www.facebook.com"
NGINX_ROOT="/var/www/$PROJECT_NAME"
NGINX_CONFIG="/etc/nginx/sites-available/$PROJECT_NAME"

# Kiểm tra quyền sudo
if [ "$EUID" -ne 0 ]; then
    echo "❌ Script cần chạy với quyền sudo"
    echo "Sử dụng: sudo ./deploy-nginx.sh"
    exit 1
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
cat > $NGINX_CONFIG << 'EOF'
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    root $NGINX_ROOT;
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
EOF

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
    echo "   http://$DOMAIN"
    echo ""
    echo "📝 Bước tiếp theo:"
    echo "   1. Cập nhật DNS để trỏ $DOMAIN về server này"
    echo "   2. Cài đặt SSL certificate với Let's Encrypt:"
    echo "      sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
else
    echo "❌ Cấu hình Nginx có lỗi!"
    exit 1
fi