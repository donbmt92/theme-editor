#!/bin/bash

# Script khắc phục vấn đề redirect domain
# Tạo bởi Theme Editor

set -e

echo "🔍 Kiểm tra cấu hình domain redirect..."

# Kiểm tra quyền sudo
if [ "$EUID" -ne 0 ]; then
    echo "❌ Script cần chạy với quyền sudo"
    echo "Sử dụng: sudo ./fix-domain-redirect.sh"
    exit 1
fi

# Kiểm tra các file cấu hình Nginx
echo "📋 Kiểm tra các file cấu hình Nginx..."

# Liệt kê tất cả các site đã enable
echo "Sites đã enable:"
ls -la /etc/nginx/sites-enabled/

echo ""
echo "Sites có sẵn:"
ls -la /etc/nginx/sites-available/

# Kiểm tra nội dung các file config
echo ""
echo "🔍 Kiểm tra nội dung các file config..."

for config in /etc/nginx/sites-enabled/*; do
    if [ -f "$config" ]; then
        echo ""
        echo "📄 File: $config"
        echo "Nội dung:"
        cat "$config"
        echo "----------------------------------------"
    fi
done

# Kiểm tra default config
if [ -f "/etc/nginx/sites-available/default" ]; then
    echo ""
    echo "📄 Default config:"
    cat /etc/nginx/sites-available/default
    echo "----------------------------------------"
fi

# Tạo config cho test.dreaktech.xyz
echo ""
echo "⚙️ Tạo cấu hình cho test.dreaktech.xyz..."

cat > /etc/nginx/sites-available/test.dreaktech.xyz << 'EOF'
# HTTP redirect to HTTPS
server {
    listen 80;
    server_name test.dreaktech.xyz www.test.dreaktech.xyz;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name test.dreaktech.xyz www.test.dreaktech.xyz;

    # SSL Configuration (sẽ cần tạo certificate sau)
    # ssl_certificate /etc/letsencrypt/live/test.dreaktech.xyz/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/test.dreaktech.xyz/privkey.pem;
    
    # SSL Security
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    
    # Main application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # API Rate Limiting
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static Files Caching
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 1y;
        add_header Cache-Control "public, immutable";
    }

    # Error Pages
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /var/www/html;
    }

    # Logging
    access_log /var/log/nginx/test.dreaktech.xyz.access.log;
    error_log /var/log/nginx/test.dreaktech.xyz.error.log;
}
EOF

echo "✅ Đã tạo config cho test.dreaktech.xyz"

# Enable site
echo "🔗 Enable site..."
ln -sf /etc/nginx/sites-available/test.dreaktech.xyz /etc/nginx/sites-enabled/

# Test config
echo "🔄 Test cấu hình Nginx..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Cấu hình Nginx hợp lệ"
    echo "🔄 Reload Nginx..."
    systemctl reload nginx
    echo "✅ Đã reload Nginx thành công!"
else
    echo "❌ Cấu hình Nginx có lỗi"
    exit 1
fi

echo ""
echo "🎯 Các bước tiếp theo:"
echo "1. Kiểm tra DNS: Đảm bảo test.dreaktech.xyz trỏ về IP VPS"
echo "2. Tạo SSL certificate: sudo certbot certonly --standalone -d test.dreaktech.xyz"
echo "3. Cập nhật config SSL trong file /etc/nginx/sites-available/test.dreaktech.xyz"
echo "4. Reload Nginx: sudo systemctl reload nginx"
echo ""
echo "🌐 Test domain: http://test.dreaktech.xyz" 