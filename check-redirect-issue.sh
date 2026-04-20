#!/bin/bash

# Script kiểm tra và khắc phục vấn đề redirect domain
# Tạo bởi Theme Editor

set -e

echo "🔍 Kiểm tra vấn đề redirect domain..."

# Kiểm tra quyền sudo
if [ "$EUID" -ne 0 ]; then
    echo "❌ Script cần chạy với quyền sudo"
    echo "Sử dụng: sudo ./check-redirect-issue.sh"
    exit 1
fi

# Kiểm tra các vấn đề có thể gây redirect
echo "📋 Kiểm tra các vấn đề có thể gây redirect..."

# 1. Kiểm tra default site
echo ""
echo "1️⃣ Kiểm tra default site..."
if [ -f "/etc/nginx/sites-enabled/default" ]; then
    echo "⚠️  Default site đang được enable - có thể gây conflict"
    echo "Nội dung default site:"
    cat /etc/nginx/sites-enabled/default
    echo ""
    read -p "Bạn có muốn disable default site không? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm /etc/nginx/sites-enabled/default
        echo "✅ Đã disable default site"
    fi
else
    echo "✅ Default site đã được disable"
fi

# 2. Kiểm tra các server block có server_name catch-all
echo ""
echo "2️⃣ Kiểm tra server_name catch-all..."
for config in /etc/nginx/sites-enabled/*; do
    if [ -f "$config" ]; then
        echo "Kiểm tra file: $config"
        if grep -q "server_name _" "$config" || grep -q "server_name \*" "$config"; then
            echo "⚠️  Tìm thấy server_name catch-all trong $config"
            echo "Nội dung:"
            cat "$config"
            echo ""
        fi
    fi
done

# 3. Kiểm tra redirect rules
echo ""
echo "3️⃣ Kiểm tra redirect rules..."
for config in /etc/nginx/sites-enabled/*; do
    if [ -f "$config" ]; then
        echo "Kiểm tra redirect trong: $config"
        if grep -q "return 301" "$config" || grep -q "return 302" "$config"; then
            echo "Tìm thấy redirect rules:"
            grep -n "return 30[12]" "$config"
            echo ""
        fi
    fi
done

# 4. Kiểm tra server_name conflicts
echo ""
echo "4️⃣ Kiểm tra server_name conflicts..."
echo "Các server_name hiện tại:"
for config in /etc/nginx/sites-enabled/*; do
    if [ -f "$config" ]; then
        echo "File: $config"
        grep -n "server_name" "$config" || echo "Không có server_name"
        echo ""
    fi
done

# 5. Tạo config HTTP-only cho test.dreaktech.xyz (tạm thời)
echo ""
echo "5️⃣ Tạo config HTTP-only cho test.dreaktech.xyz..."

cat > /etc/nginx/sites-available/test.dreaktech.xyz << 'EOF'
# HTTP server for test.dreaktech.xyz
server {
    listen 80;
    server_name test.dreaktech.xyz www.test.dreaktech.xyz;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript;

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

    # API
    location /api/ {
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

    # Static Files
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 1y;
        add_header Cache-Control "public, immutable";
    }

    # Logging
    access_log /var/log/nginx/test.dreaktech.xyz.access.log;
    error_log /var/log/nginx/test.dreaktech.xyz.error.log;
}
EOF

echo "✅ Đã tạo config HTTP-only cho test.dreaktech.xyz"

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

# 6. Kiểm tra logs
echo ""
echo "6️⃣ Kiểm tra Nginx logs..."
echo "Error log cuối cùng:"
tail -n 20 /var/log/nginx/error.log

echo ""
echo "Access log cuối cùng:"
tail -n 10 /var/log/nginx/access.log

# 7. Test domain
echo ""
echo "7️⃣ Test domain..."
echo "Kiểm tra DNS resolution:"
nslookup test.dreaktech.xyz

echo ""
echo "Test HTTP response:"
curl -I http://test.dreaktech.xyz

echo ""
echo "🎯 Kết quả kiểm tra:"
echo "✅ Đã tạo config riêng cho test.dreaktech.xyz"
echo "✅ Đã reload Nginx"
echo ""
echo "📝 Các bước tiếp theo:"
echo "1. Kiểm tra DNS: nslookup test.dreaktech.xyz"
echo "2. Test domain: curl -I http://test.dreaktech.xyz"
echo "3. Nếu vẫn redirect, kiểm tra logs: tail -f /var/log/nginx/error.log"
echo "4. Tạo SSL certificate khi cần: sudo certbot certonly --standalone -d test.dreaktech.xyz" 