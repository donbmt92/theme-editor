#!/bin/bash

# Usage: sudo ./add-tenant.sh example.com

DOMAIN=$1
APP_PORT=3033

if [ -z "$DOMAIN" ]; then
    echo "Usage: sudo ./add-tenant.sh <domain>"
    exit 1
fi

echo "Adding tenant: $DOMAIN"

# 1. Create Nginx Config
cat > /etc/nginx/sites-available/$DOMAIN <<EOF
server {
    server_name $DOMAIN www.$DOMAIN;

    # Serve uploaded files directly
    location /uploads/ {
        alias /var/www/theme-editor/public/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    location / {
        proxy_pass http://localhost:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# 2. Enable Site
ln -s /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/

# 3. Test Config
nginx -t

if [ $? -eq 0 ]; then
    # 4. Reload Nginx
    systemctl reload nginx
    
    # 5. Request SSL
    certbot --nginx -d $DOMAIN -d www.$DOMAIN
    
    echo "Success! https://$DOMAIN should be active."
else
    echo "Nginx config error. Rolling back..."
    rm /etc/nginx/sites-enabled/$DOMAIN
    rm /etc/nginx/sites-available/$DOMAIN
fi
