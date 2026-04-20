#!/bin/bash

echo "🔧 Fixing Nginx Configuration for Uploads..."

# Check if we're running as root or with sudo
if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run as root or with sudo"
    echo "💡 Run: sudo bash fix-nginx-uploads.sh"
    exit 1
fi

# Backup current nginx config
echo "📦 Backing up current Nginx config..."
cp /etc/nginx/sites-available/onghoangdohieu.com /etc/nginx/sites-available/onghoangdohieu.com.backup.$(date +%Y%m%d_%H%M%S)

echo "✅ Backup created"

# Check if uploads location already exists
if grep -q "location /uploads/" /etc/nginx/sites-available/onghoangdohieu.com; then
    echo "⚠️  Uploads location already exists in Nginx config"
    echo "💡 Checking current configuration..."
    grep -A 20 "location /uploads/" /etc/nginx/sites-available/onghoangdohieu.com
else
    echo "📝 Adding uploads location to Nginx config..."
    
    # Find the right place to insert (after the main location / block)
    # Insert before the closing brace of the server block
    sed -i '/^    }$/i\
    # Serve uploaded files directly from Nginx\
    location /uploads/ {\
        alias /home/deploy/theme-editor/theme-editor/public/uploads/;\
        \
        # Security: only allow image and PDF files\
        location ~* \.(jpg|jpeg|png|gif|webp|pdf)$ {\
            expires 30d;\
            add_header Cache-Control "public, no-transform";\
            add_header X-Content-Type-Options "nosniff";\
            \
            # Optional: Add CORS headers if needed\
            add_header Access-Control-Allow-Origin "*";\
            add_header Access-Control-Allow-Methods "GET, HEAD";\
            add_header Access-Control-Allow-Headers "Accept, Accept-Encoding, Accept-Language, Cache-Control";\
        }\
        \
        # Block access to other file types\
        location ~* \.(php|js|html|txt|log|env|git|sql)$ {\
            deny all;\
            return 404;\
        }\
        \
        # Block access to hidden files\
        location ~ /\. {\
            deny all;\
            return 404;\
        }\
    }' /etc/nginx/sites-available/onghoangdohieu.com
    
    echo "✅ Uploads location added to Nginx config"
fi

# Test Nginx configuration
echo "🧪 Testing Nginx configuration..."
if nginx -t; then
    echo "✅ Nginx configuration is valid"
    
    # Reload Nginx
    echo "🔄 Reloading Nginx..."
    systemctl reload nginx
    
    if [ $? -eq 0 ]; then
        echo "✅ Nginx reloaded successfully"
    else
        echo "❌ Failed to reload Nginx"
        echo "💡 Check Nginx status: systemctl status nginx"
        exit 1
    fi
else
    echo "❌ Nginx configuration is invalid"
    echo "💡 Please check the configuration manually"
    exit 1
fi

# Check uploads directory permissions
echo "📁 Checking uploads directory..."
UPLOADS_DIR="/home/deploy/theme-editor/theme-editor/public/uploads"

if [ -d "$UPLOADS_DIR" ]; then
    echo "✅ Uploads directory exists: $UPLOADS_DIR"
    
    # Check permissions
    if [ -r "$UPLOADS_DIR" ] && [ -x "$UPLOADS_DIR" ]; then
        echo "✅ Uploads directory is readable and executable"
    else
        echo "⚠️  Uploads directory permissions need fixing..."
        chmod 755 "$UPLOADS_DIR"
        echo "✅ Permissions fixed"
    fi
    
    # Check if nginx user can read the directory
    NGINX_USER=$(ps aux | grep nginx | grep -v grep | head -1 | awk '{print $1}')
    if [ -n "$NGINX_USER" ]; then
        echo "ℹ️  Nginx running as user: $NGINX_USER"
        
        # Test if nginx can access the directory
        if sudo -u "$NGINX_USER" test -r "$UPLOADS_DIR"; then
            echo "✅ Nginx can read uploads directory"
        else
            echo "⚠️  Nginx cannot read uploads directory"
            echo "💡 Fixing permissions..."
            chmod 755 "$UPLOADS_DIR"
            chown -R deploy:deploy "$UPLOADS_DIR"
            echo "✅ Permissions and ownership fixed"
        fi
    fi
else
    echo "❌ Uploads directory does not exist: $UPLOADS_DIR"
    echo "💡 Creating uploads directory..."
    mkdir -p "$UPLOADS_DIR"
    chmod 755 "$UPLOADS_DIR"
    chown deploy:deploy "$UPLOADS_DIR"
    echo "✅ Uploads directory created"
fi

echo ""
echo "🎉 Nginx uploads configuration fixed!"
echo ""
echo "📝 Next steps:"
echo "1. Test upload functionality in your application"
echo "2. Try accessing: https://onghoangdohieu.com/uploads/1755768060756-xxo36j86sy.png"
echo "3. Check Nginx error logs if issues persist:"
echo "   tail -f /var/log/nginx/onghoangdohieu.com.error.log"
echo ""
echo "🔍 If still not working, check:"
echo "- File exists: ls -la $UPLOADS_DIR"
echo "- Nginx status: systemctl status nginx"
echo "- Nginx logs: journalctl -u nginx -f"
