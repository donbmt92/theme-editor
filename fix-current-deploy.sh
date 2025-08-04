#!/bin/bash

echo "🔧 Sửa deploy script hiện tại..."

# Tìm file deploy-nginx.sh trong thư mục hiện tại
if [ -f "deploy-nginx.sh" ]; then
    echo "📁 Tìm thấy deploy-nginx.sh"
    
    # Sửa domain từ your-domain.com thành test.dreaktech.xyz
    echo "🔧 Sửa domain..."
    sed -i 's/DOMAIN="your-domain.com"/DOMAIN="test.dreaktech.xyz"/g' deploy-nginx.sh
    
    # Sửa heredoc syntax từ 'EOF' thành EOF
    echo "🔧 Sửa heredoc syntax..."
    sed -i "s/<< 'EOF'/<< EOF/g" deploy-nginx.sh
    
    echo "✅ Đã sửa xong deploy-nginx.sh"
    echo ""
    echo "📋 Kiểm tra kết quả:"
    echo "Domain:"
    grep "DOMAIN=" deploy-nginx.sh
    echo ""
    echo "Heredoc:"
    grep "cat >.*<<.*EOF" deploy-nginx.sh
    echo ""
    echo "🚀 Bây giờ bạn có thể chạy: sudo ./deploy-nginx.sh"
else
    echo "❌ Không tìm thấy deploy-nginx.sh trong thư mục hiện tại"
    echo "Hãy chạy script này trong thư mục chứa deploy-nginx.sh"
fi 