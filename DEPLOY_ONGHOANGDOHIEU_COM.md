# 🚀 HƯỚNG DẪN DEPLOY THEME EDITOR LÊN ONGHOANGDOHIEU.COM

## 📋 **THÔNG TIN DOMAIN**
- **Domain chính:** onghoangdohieu.com
- **Subdomain:** www.onghoangdohieu.com
- **SSL:** Let's Encrypt (miễn phí)
- **CDN:** Cloudflare (tùy chọn)

---

## 🖥️ **YÊU CẦU VPS**

### **Cấu hình đề xuất:**
- **CPU:** 4 cores
- **RAM:** 8GB
- **Storage:** 50GB SSD
- **OS:** Ubuntu 22.04 LTS
- **Bandwidth:** 1000Mbps
- **Provider:** DigitalOcean, Vultr, hoặc Linode

---

## 🔧 **BƯỚC 1: CHUẨN BỊ VPS**

### **1. Kết nối VPS:**
```bash
# SSH vào VPS với IP của bạn
ssh root@YOUR_VPS_IP

# Ví dụ:
# ssh root@159.223.45.123
```

### **2. Update hệ thống:**
```bash
# Update toàn bộ packages
sudo apt update && sudo apt upgrade -y

# Cài đặt packages cần thiết
sudo apt install -y curl wget git unzip software-properties-common htop ufw fail2ban
```

### **3. Tạo user deploy cho onghoangdohieu.com:**
```bash
# Tạo user deploy
sudo adduser deploy
# Nhập password an toàn

# Thêm vào sudo group
sudo usermod -aG sudo deploy

# Copy SSH keys (nếu có)
sudo cp -r /root/.ssh /home/deploy/
sudo chown -R deploy:deploy /home/deploy/.ssh

# Chuyển sang user deploy
su - deploy
```

### **4. Cấu hình Firewall:**
```bash
# Enable firewall
sudo ufw enable

# Cho phép SSH
sudo ufw allow 22

# Cho phép HTTP và HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Check status
sudo ufw status
```

---

## 🛠️ **BƯỚC 2: CÀI ĐẶT MÔI TRƯỜNG**

### **1. Cài đặt Node.js v20:**
```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Cài đặt Node.js
sudo apt-get install -y nodejs

# Verify versions
node --version  # Should be v20.x.x
npm --version   # Should be 10.x.x
```

### **2. Cài đặt PM2 Process Manager:**
```bash
# Install PM2 globally
sudo npm install -g pm2

# Setup PM2 startup
pm2 startup
# Copy và chạy command được suggest

# Ví dụ output sẽ là:
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u deploy --hp /home/deploy
```

### **3. Cài đặt Nginx Web Server:**
```bash
# Install Nginx
sudo apt install -y nginx

# Start và enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx

# Test: http://YOUR_VPS_IP should show Nginx welcome page
```

### **4. Cài đặt PostgreSQL Database:**
```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start và enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database for onghoangdohieu.com
sudo -u postgres psql

-- Trong PostgreSQL console:
CREATE DATABASE onghoangdohieu_theme_editor;
CREATE USER deploy WITH PASSWORD 'SECURE_PASSWORD_HERE_123!@#';
GRANT ALL PRIVILEGES ON DATABASE onghoangdohieu_theme_editor TO deploy;
\q
```

---

## 🚀 **BƯỚC 3: DEPLOY ỨNG DỤNG**

### **1. Clone repository:**
```bash
# Chuyển về home directory
cd /home/deploy

# Clone theme editor repository
git clone https://github.com/donbmt92/theme-editor.git
cd theme-editor/theme-editor

# Install dependencies
npm install
```

### **2. Cấu hình Environment cho onghoangdohieu.com:**
```bash
# Copy env example
cp env.example .env

# Edit .env file
nano .env
```

#### **Nội dung file .env cho onghoangdohieu.com:**
```env
# Database for onghoangdohieu.com
DATABASE_URL="postgresql://deploy:SECURE_PASSWORD_HERE_123!@#@localhost:5432/theme_editor"

# Next Auth for onghoangdohieu.com
NEXTAUTH_URL="https://onghoangdohieu.com"
NEXTAUTH_SECRET="your_very_long_random_secret_key_for_onghoangdohieu_com_2025"

# Google AI API
GOOGLE_AI_API_KEY="your_google_gemini_api_key_here"

# GitHub Integration
GITHUB_TOKEN="your_github_personal_access_token"

# Environment
NODE_ENV="production"
PORT=3080

# Optional: Analytics
GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"

# Optional: Sentry Error Tracking
SENTRY_DSN="your_sentry_dsn_if_using"
```

### **3. Setup Database:**
```bash
# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Optional: Seed với sample data
npx prisma db seed
```

### **4. Build ứng dụng:**
```bash
# Build Next.js application
npm run build

# Test production build locally
npm start
# Ctrl+C để dừng sau khi test
```

### **5. Cấu hình PM2 cho onghoangdohieu.com:**
```bash
# Tạo PM2 ecosystem config
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'onghoangdohieu-theme-editor',
    script: 'npm',
    args: 'start',
    cwd: '/home/deploy/theme-editor/theme-editor',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3080
    },
    error_file: '/home/deploy/logs/onghoangdohieu-error.log',
    out_file: '/home/deploy/logs/onghoangdohieu-out.log',
    log_file: '/home/deploy/logs/onghoangdohieu.log',
    time: true,
    max_memory_restart: '1G'
  }]
}
EOF

# Tạo thư mục logs
mkdir -p /home/deploy/logs

# Start application với PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Check status
pm2 list
pm2 logs onghoangdohieu-theme-editor
```

---

## 🌐 **BƯỚC 4: CẤU HÌNH NGINX CHO ONGHOANGDOHIEU.COM**

### **1. Tạo Nginx configuration:**
```bash
# Create nginx config file
sudo nano /etc/nginx/sites-available/onghoangdohieu.com
```

#### **Nginx config cho onghoangdohieu.com:**
```nginx
# HTTP to HTTPS redirect
server {
    listen 80;
    server_name onghoangdohieu.com www.onghoangdohieu.com;
    
    # Redirect all HTTP traffic to HTTPS
    return 301 https://onghoangdohieu.com$request_uri;
}

# Main HTTPS server
server {
    listen 443 ssl http2;
    server_name onghoangdohieu.com www.onghoangdohieu.com;

    # SSL Configuration (will be added after SSL setup)
    ssl_certificate /etc/letsencrypt/live/onghoangdohieu.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/onghoangdohieu.com/privkey.pem;
    
    # SSL Security Best Practices
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_stapling on;
    ssl_stapling_verify on;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https:; img-src 'self' data: https:; font-src 'self' data: https:;" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json
        application/ld+json
        image/svg+xml;

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=onghoangdohieu_api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=onghoangdohieu_general:10m rate=30r/s;
    
    # Main application
    location / {
        limit_req zone=onghoangdohieu_general burst=50 nodelay;
        
        proxy_pass http://localhost:3080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
        
        # Add security headers for application
        proxy_set_header X-Frame-Options SAMEORIGIN;
        proxy_set_header X-Content-Type-Options nosniff;
    }

    # API endpoints with stricter rate limiting
    location /api/ {
        limit_req zone=onghoangdohieu_api burst=20 nodelay;
        
        proxy_pass http://localhost:3080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 30;
    }

    # Next.js static assets with aggressive caching
    location /_next/static/ {
        proxy_pass http://localhost:3080;
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
    }

    # Images and media
    location ~* \.(jpg|jpeg|png|gif|ico|svg|webp)$ {
        proxy_pass http://localhost:3080;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # Favicon
    location = /favicon.ico {
        proxy_pass http://localhost:3080;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Robots.txt
    location = /robots.txt {
        proxy_pass http://localhost:3080;
        expires 1d;
        add_header Cache-Control "public";
        access_log off;
    }

    # Sitemap
    location = /sitemap.xml {
        proxy_pass http://localhost:3080;
        expires 1h;
        add_header Cache-Control "public";
    }

    # Block common attack patterns
    location ~* /\.(?!well-known\/) {
        deny all;
        access_log off;
        log_not_found off;
    }

    # Block access to sensitive files
    location ~* \.(env|log|git)$ {
        deny all;
        access_log off;
        log_not_found off;
    }

    # Custom error pages
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /var/www/html;
    }

    # Logging
    access_log /var/log/nginx/onghoangdohieu.com.access.log;
    error_log /var/log/nginx/onghoangdohieu.com.error.log;
}
```

### **2. Enable site:**
```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/onghoangdohieu.com /etc/nginx/sites-enabled/

# Disable default site
sudo rm /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

---

## 🔒 **BƯỚC 5: CÀI ĐẶT SSL CHO ONGHOANGDOHIEU.COM**

### **1. Cài đặt Certbot:**
```bash
# Install snapd
sudo apt install -y snapd

# Install certbot
sudo snap install --classic certbot

# Create symlink
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

### **2. Tạo SSL Certificate cho onghoangdohieu.com:**
```bash
# Stop nginx temporarily
sudo systemctl stop nginx

# Generate SSL certificate for onghoangdohieu.com
sudo certbot certonly --standalone \
  -d onghoangdohieu.com \
  -d www.onghoangdohieu.com \
  --email your-email@onghoangdohieu.com \
  --agree-tos \
  --no-eff-email

# Start nginx again
sudo systemctl start nginx

# Test SSL
curl -I https://onghoangdohieu.com
```

### **3. Auto-renewal:**
```bash
# Test renewal
sudo certbot renew --dry-run

# Setup automatic renewal
sudo crontab -e

# Add this line for auto-renewal:
0 12 * * * /usr/bin/certbot renew --quiet --post-hook "systemctl reload nginx"
```

---

## 🗄️ **BƯỚC 6: DATABASE BACKUP & MONITORING**

### **1. Database Backup Script cho onghoangdohieu.com:**
```bash
# Create backup script
cat > /home/deploy/backup_onghoangdohieu_db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/deploy/backups/onghoangdohieu"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="onghoangdohieu_theme_editor_backup_$DATE.sql"

mkdir -p $BACKUP_DIR

# Create database backup
pg_dump -h localhost -U deploy -d onghoangdohieu_theme_editor > $BACKUP_DIR/$BACKUP_FILE

# Compress backup
gzip $BACKUP_DIR/$BACKUP_FILE

# Keep only last 14 backups
find $BACKUP_DIR -name "onghoangdohieu_theme_editor_backup_*.sql.gz" -type f -mtime +14 -delete

echo "$(date): Database backup completed for onghoangdohieu.com: $BACKUP_FILE.gz"
EOF

chmod +x /home/deploy/backup_onghoangdohieu_db.sh
```

### **2. Auto Backup Schedule:**
```bash
# Edit crontab
crontab -e

# Add daily backup at 3:00 AM
0 3 * * * /home/deploy/backup_onghoangdohieu_db.sh >> /home/deploy/logs/backup.log 2>&1
```

### **3. Monitoring Script:**
```bash
# Create monitoring script
cat > /home/deploy/monitor_onghoangdohieu.sh << 'EOF'
#!/bin/bash
HEALTH_URL="https://onghoangdohieu.com/api/health"
APP_NAME="onghoangdohieu-theme-editor"

# Check if application is responding
if curl -f -s --max-time 10 $HEALTH_URL > /dev/null; then
    echo "$(date): onghoangdohieu.com is healthy ✅"
else
    echo "$(date): onghoangdohieu.com is down! Restarting... ❌"
    pm2 restart $APP_NAME
    
    # Send notification (optional - setup email/slack webhook)
    echo "$(date): onghoangdohieu.com was restarted due to health check failure" >> /home/deploy/logs/incidents.log
fi

# Check disk space
DISK_USAGE=$(df / | grep -vE '^Filesystem|tmpfs|cdrom' | awk '{ print $5 }' | sed 's/%//g')
if [ $DISK_USAGE -gt 80 ]; then
    echo "$(date): ⚠️  Disk usage is ${DISK_USAGE}% for onghoangdohieu.com"
fi

# Check memory usage
MEMORY_USAGE=$(free | grep Mem | awk '{printf("%.0f", $3/$2 * 100.0)}')
if [ $MEMORY_USAGE -gt 85 ]; then
    echo "$(date): ⚠️  Memory usage is ${MEMORY_USAGE}% for onghoangdohieu.com"
fi
EOF

chmod +x /home/deploy/monitor_onghoangdohieu.sh

# Schedule monitoring every 5 minutes
crontab -e

# Add monitoring:
*/5 * * * * /home/deploy/monitor_onghoangdohieu.sh >> /home/deploy/logs/monitoring.log 2>&1
```

---

## 🚀 **BƯỚC 7: DEPLOYMENT SCRIPT**

### **Tạo script deploy tự động:**
```bash
cat > /home/deploy/deploy_onghoangdohieu.sh << 'EOF'
#!/bin/bash
set -e

APP_DIR="/home/deploy/theme-editor/theme-editor"
APP_NAME="onghoangdohieu-theme-editor"
BACKUP_DIR="/home/deploy/backups/deployments"
DATE=$(date +%Y%m%d_%H%M%S)

echo "🚀 Starting deployment for onghoangdohieu.com - $DATE"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup current application
echo "📦 Creating backup..."
tar -czf $BACKUP_DIR/onghoangdohieu_backup_$DATE.tar.gz -C /home/deploy theme-editor

# Navigate to app directory
cd $APP_DIR

# Backup database before deployment
echo "🗄️  Backing up database..."
pg_dump -h localhost -U deploy -d onghoangdohieu_theme_editor > $BACKUP_DIR/db_pre_deploy_$DATE.sql

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Install/update dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Run database migrations
echo "🗄️  Running database migrations..."
npx prisma generate
npx prisma db push

# Build application
echo "🔨 Building application..."
npm run build

# Reload PM2 without downtime
echo "🔄 Reloading application..."
pm2 reload $APP_NAME

# Wait for app to start
sleep 10

# Health check
echo "🏥 Running health check..."
if curl -f -s --max-time 30 https://onghoangdohieu.com/api/health > /dev/null; then
    echo "✅ Deployment successful for onghoangdohieu.com!"
    echo "✅ Application is responding at https://onghoangdohieu.com"
    
    # Clean old backups (keep last 7)
    find $BACKUP_DIR -name "onghoangdohieu_backup_*.tar.gz" -type f -mtime +7 -delete
    find $BACKUP_DIR -name "db_pre_deploy_*.sql" -type f -mtime +7 -delete
    
else
    echo "❌ Health check failed! Rolling back..."
    pm2 restart $APP_NAME
    exit 1
fi

echo "🎉 Deployment completed successfully for onghoangdohieu.com!"
EOF

chmod +x /home/deploy/deploy_onghoangdohieu.sh
```

---

## 📊 **BƯỚC 8: PERFORMANCE & SECURITY**

### **1. Optimize PostgreSQL cho onghoangdohieu.com:**
```bash
# Edit PostgreSQL config
sudo nano /etc/postgresql/14/main/postgresql.conf

# Add these optimizations:
shared_buffers = 2GB                    # 25% of RAM
effective_cache_size = 6GB              # 75% of RAM
maintenance_work_mem = 512MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### **2. Configure Fail2Ban:**
```bash
# Create Nginx jail for onghoangdohieu.com
sudo nano /etc/fail2ban/jail.d/onghoangdohieu-nginx.conf

# Content:
[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/onghoangdohieu.com.error.log
maxretry = 3
bantime = 3600

[nginx-noscript]
enabled = true
port = http,https
logpath = /var/log/nginx/onghoangdohieu.com.access.log
maxretry = 6
bantime = 86400

# Restart fail2ban
sudo systemctl restart fail2ban
```

### **3. Setup Log Rotation:**
```bash
# Create logrotate config for onghoangdohieu.com
sudo nano /etc/logrotate.d/onghoangdohieu

# Content:
/home/deploy/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 0644 deploy deploy
    postrotate
        pm2 reload onghoangdohieu-theme-editor > /dev/null
    endscript
}

/var/log/nginx/onghoangdohieu.com.*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    postrotate
        systemctl reload nginx > /dev/null
    endscript
}
```

---

## 📱 **BƯỚC 9: DOMAIN & DNS SETUP**

### **Cấu hình DNS cho onghoangdohieu.com:**
```dns
# A Records
onghoangdohieu.com.     A    YOUR_VPS_IP
www.onghoangdohieu.com. A    YOUR_VPS_IP

# Optional: AAAA for IPv6
onghoangdohieu.com.     AAAA YOUR_IPV6_IP

# MX Records (if hosting email)
onghoangdohieu.com.     MX   10 mail.onghoangdohieu.com.

# TXT Records for security
onghoangdohieu.com.     TXT  "v=spf1 include:_spf.google.com ~all"
_dmarc.onghoangdohieu.com. TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@onghoangdohieu.com"

# CAA Record for SSL
onghoangdohieu.com.     CAA  0 issue "letsencrypt.org"
```

---

## ✅ **CHECKLIST HOÀN THÀNH CHO ONGHOANGDOHIEU.COM**

- [ ] VPS Ubuntu 22.04 đã setup
- [ ] Domain onghoangdohieu.com đã trỏ về VPS IP
- [ ] Node.js 20+ installed
- [ ] PostgreSQL database `onghoangdohieu_theme_editor` created
- [ ] Nginx configured cho onghoangdohieu.com
- [ ] SSL certificate cho onghoangdohieu.com và www
- [ ] PM2 running `onghoangdohieu-theme-editor`
- [ ] Environment variables configured
- [ ] Database migrations completed
- [ ] Application built và accessible
- [ ] Backup scripts scheduled
- [ ] Monitoring scripts active
- [ ] Firewall configured
- [ ] Fail2ban configured
- [ ] Log rotation setup
- [ ] Health checks working
- [ ] SSL auto-renewal configured

---

## 🎯 **KIỂM TRA CUỐI CÙNG**

### **Test onghoangdohieu.com:**
```bash
# Test HTTP redirect
curl -I http://onghoangdohieu.com
# Should return 301 redirect to HTTPS

# Test HTTPS
curl -I https://onghoangdohieu.com
# Should return 200 OK

# Test SSL grade
https://www.ssllabs.com/ssltest/analyze.html?d=onghoangdohieu.com

# Test performance
https://pagespeed.web.dev/report?url=https://onghoangdohieu.com

# Check PM2 status
pm2 list
pm2 logs onghoangdohieu-theme-editor

# Check database connection
psql -h localhost -U deploy -d onghoangdohieu_theme_editor -c "SELECT version();"
```

---

## 🆘 **TROUBLESHOOTING ONGHOANGDOHIEU.COM**

### **Lỗi thường gặp:**

#### **1. Site không accessible:**
```bash
# Check nginx status
sudo systemctl status nginx

# Check nginx logs
sudo tail -f /var/log/nginx/onghoangdohieu.com.error.log

# Check if port 3080 is running
netstat -tulpn | grep :3080

# Restart services
sudo systemctl restart nginx
pm2 restart onghoangdohieu-theme-editor
```

#### **2. SSL issues:**
```bash
# Check SSL certificate
sudo certbot certificates

# Renew if needed
sudo certbot renew

# Test SSL configuration
openssl s_client -connect onghoangdohieu.com:443
```

#### **3. Database connection issues:**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test database connection
psql -h localhost -U deploy -d onghoangdohieu_theme_editor

# Check logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

---

## 🎉 **HOÀN THÀNH!**

Sau khi hoàn thành tất cả các bước trên, bạn sẽ có:

✅ **Theme Editor running tại:** https://onghoangdohieu.com
✅ **SSL A+ grade security**
✅ **Auto-backup hàng ngày**
✅ **Monitoring & health checks**
✅ **High performance với caching**
✅ **Security headers & protection**
✅ **Easy deployment script**

### **Quick Commands:**
```bash
# Deploy update
/home/deploy/deploy_onghoangdohieu.sh

# Check status
pm2 list
sudo systemctl status nginx

# View logs
pm2 logs onghoangdohieu-theme-editor
tail -f /var/log/nginx/onghoangdohieu.com.access.log

# Backup database
/home/deploy/backup_onghoangdohieu_db.sh
```

**🚀 onghoangdohieu.com is now live!** 🎯✨ 