#!/bin/bash

# Script sửa lỗi deploy script
echo "🔧 Sửa lỗi deploy script..."

# Cập nhật domain
sed -i 's/DOMAIN="your-domain.com"/DOMAIN="test.dreaktech.xyz"/' deploy-nginx.sh

# Sửa lỗi heredoc - thay đổi từ 'EOF' thành EOF để expand variables
sed -i "s/cat > \$NGINX_CONFIG << 'EOF'/cat > \$NGINX_CONFIG << EOF/" deploy-nginx.sh

echo "✅ Đã sửa deploy script"
echo "🔄 Chạy lại deploy script..."
sudo ./deploy-nginx.sh 