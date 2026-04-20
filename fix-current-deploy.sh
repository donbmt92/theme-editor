#!/bin/bash
# Script sửa lỗi deploy script hiện tại

echo "🔧 Sửa lỗi deploy script..."

# Tìm và sửa lỗi trong deploy-nginx.sh
if [ -f "deploy-nginx.sh" ]; then
    echo "📝 Sửa lỗi trong deploy-nginx.sh..."
    
    # Sửa lỗi: thay thế $NGINX_ROOT bằng đường dẫn thực tế
    sed -i 's/\$NGINX_ROOT/\/var\/www\/csv-1754471205258/g' deploy-nginx.sh
    
    # Sửa lỗi: escape các biến trong try_files
    sed -i 's/try_files \$uri \$uri\/ \/index.html;/try_files \$uri \$uri\/ \/index.html;/g' deploy-nginx.sh
    
    echo "✅ Đã sửa deploy script"
    echo "🔄 Chạy lại deploy script..."
    sudo ./deploy-nginx.sh
else
    echo "❌ Không tìm thấy file deploy-nginx.sh"
    echo "📝 Tạo script deploy mới..."
    
    cat > deploy-nginx-fixed.sh << 'EOF'
#!/bin/bash
# Fixed deploy script cho Nginx (Static HTML)

set -e

echo "🚀 Bắt đầu deploy csv-1754471205258..."

# Cấu hình
PROJECT_NAME="csv-1754471205258"
DOMAIN="test.dreaktech.xyz"
NGINX_ROOT="/var/www/$PROJECT_NAME"
NGINX_CONFIG="/etc/nginx/sites-available/$PROJECT_NAME"

# Kiểm tra quyền sudo
if [ "$EUID" -ne 0 ]; then
    echo "❌ Script cần chạy với quyền sudo"
    echo "Sử dụng: sudo ./deploy-nginx-fixed.sh"
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
cat > $NGINX_CONFIG << 'NGINX_EOF'
server {
    listen 80;
    server_name test.dreaktech.xyz www.test.dreaktech.xyz;
    root /var/www/csv-1754471205258;
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
    echo "   http://test.dreaktech.xyz"
    echo ""
    echo "📝 Bước tiếp theo:"
    echo "   1. Cập nhật DNS để trỏ test.dreaktech.xyz về server này"
    echo "   2. Cài đặt SSL certificate với Let's Encrypt:"
    echo "      sudo certbot --nginx -d test.dreaktech.xyz -d www.test.dreaktech.xyz"
else
    echo "❌ Cấu hình Nginx có lỗi!"
    exit 1
fi
EOF

    chmod +x deploy-nginx-fixed.sh
    echo "✅ Đã tạo script deploy mới: deploy-nginx-fixed.sh"
    echo "🔄 Chạy script deploy mới..."
    sudo ./deploy-nginx-fixed.sh
fi 