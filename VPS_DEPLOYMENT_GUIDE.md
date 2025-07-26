# 🚀 HƯỚNG DẪN DEPLOY THEME EDITOR LÊN VPS

## 📋 **MỤC LỤC**
1. [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
2. [Chuẩn bị VPS](#chuẩn-bị-vps)
3. [Cài đặt môi trường](#cài-đặt-môi-trường)
4. [Deploy ứng dụng](#deploy-ứng-dụng)
5. [Cấu hình Nginx](#cấu-hình-nginx)
6. [SSL Certificate](#ssl-certificate)
7. [Database Setup](#database-setup)
8. [Monitoring & Logs](#monitoring--logs)
9. [Backup & Maintenance](#backup--maintenance)

---

## 🖥️ **YÊU CẦU HỆ THỐNG**

### **Minimum Requirements:**
- **CPU:** 2 cores
- **RAM:** 4GB
- **Storage:** 20GB SSD
- **OS:** Ubuntu 20.04 LTS hoặc mới hơn
- **Bandwidth:** 100Mbps

### **Recommended:**
- **CPU:** 4 cores
- **RAM:** 8GB
- **Storage:** 50GB SSD
- **OS:** Ubuntu 22.04 LTS

---

## 🔧 **CHUẨN BỊ VPS**

### **1. Kết nối VPS:**
```bash
# SSH vào VPS
ssh root@your-vps-ip

# Hoặc với user khác
ssh username@your-vps-ip -p 22
```

### **2. Update hệ thống:**
```bash
# Update package list
sudo apt update && sudo apt upgrade -y

# Cài đặt các package cần thiết
sudo apt install -y curl wget git unzip software-properties-common
```

### **3. Tạo user deploy:**
```bash
# Tạo user mới
sudo adduser deploy

# Thêm vào sudo group
sudo usermod -aG sudo deploy

# Chuyển sang user deploy
su - deploy
```

---

## 🛠️ **CÀI ĐẶT MÔI TRƯỜNG**

### **1. Cài đặt Node.js (v20):**
```bash
# Cài đặt NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Cài đặt Node.js
sudo apt-get install -y nodejs

# Kiểm tra version
node --version
npm --version
```

### **2. Cài đặt PM2:**
```bash
# Cài đặt PM2 globally
sudo npm install -g pm2

# Thiết lập PM2 startup
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u deploy --hp /home/deploy
```

### **3. Cài đặt Nginx:**
```bash
# Cài đặt Nginx
sudo apt install -y nginx

# Khởi động Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Kiểm tra status
sudo systemctl status nginx
```

### **4. Cài đặt PostgreSQL:**
```bash
# Cài đặt PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Khởi động PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Tạo database và user
sudo -u postgres psql
CREATE DATABASE theme_editor;
CREATE USER deploy WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE theme_editor TO deploy;
\q
```

---

## 🚀 **DEPLOY ỨNG DỤNG**

### **1. Clone repository:**
```bash
# Chuyển về home directory
cd /home/deploy

# Clone repo
git clone https://github.com/donbmt92/theme-editor.git
cd theme-editor/theme-editor

# Cài đặt dependencies
npm install
```

### **2. Cấu hình Environment:**
```bash
# Copy env example
cp env.example .env

# Chỉnh sửa .env
nano .env
```

#### **Nội dung .env:**
```env
# Database
DATABASE_URL="postgresql://deploy:your_secure_password@localhost:5432/theme_editor"

# Next Auth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your_very_long_random_secret_key_here"

# Google AI
GOOGLE_AI_API_KEY="your_google_ai_api_key"

# GitHub Integration
GITHUB_TOKEN="your_github_token"

# Environment
NODE_ENV="production"
PORT=3000
```

### **3. Setup Database:**
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma db push

# Seed database (optional)
npx prisma db seed
```

### **4. Build ứng dụng:**
```bash
# Build Next.js app
npm run build

# Test production build
npm start
```

### **5. Chạy với PM2:**
```bash
# Tạo PM2 config
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'theme-editor',
    script: 'npm',
    args: 'start',
    cwd: '/home/deploy/theme-editor/theme-editor',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/home/deploy/logs/theme-editor-error.log',
    out_file: '/home/deploy/logs/theme-editor-out.log',
    log_file: '/home/deploy/logs/theme-editor.log',
    time: true
  }]
}
EOF

# Tạo thư mục logs
mkdir -p /home/deploy/logs

# Start với PM2
pm2 start ecosystem.config.js

# Save PM2 processes
pm2 save
```

---

## 🌐 **CẤU HÌNH NGINX**

### **1. Tạo Nginx config:**
```bash
sudo nano /etc/nginx/sites-available/theme-editor
```

#### **Nội dung config:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
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
}
```

### **2. Enable site:**
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/theme-editor /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## 🔒 **SSL CERTIFICATE**

### **1. Cài đặt Certbot:**
```bash
# Cài đặt snapd
sudo apt install -y snapd

# Cài đặt certbot
sudo snap install --classic certbot

# Tạo symlink
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

### **2. Tạo SSL Certificate:**
```bash
# Dừng Nginx tạm thời
sudo systemctl stop nginx

# Tạo certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Start lại Nginx
sudo systemctl start nginx
```

### **3. Auto-renewal:**
```bash
# Test renewal
sudo certbot renew --dry-run

# Crontab cho auto-renewal
sudo crontab -e

# Thêm dòng này:
0 12 * * * /usr/bin/certbot renew --quiet && systemctl reload nginx
```

---

## 🗄️ **DATABASE SETUP**

### **1. Backup Script:**
```bash
# Tạo backup script
cat > /home/deploy/backup_db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/deploy/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="theme_editor_backup_$DATE.sql"

mkdir -p $BACKUP_DIR

pg_dump -h localhost -U deploy -d theme_editor > $BACKUP_DIR/$BACKUP_FILE

# Giữ lại 7 backup gần nhất
find $BACKUP_DIR -name "theme_editor_backup_*.sql" -type f -mtime +7 -delete

echo "Database backup completed: $BACKUP_FILE"
EOF

chmod +x /home/deploy/backup_db.sh
```

### **2. Crontab cho backup tự động:**
```bash
# Crontab
crontab -e

# Backup hàng ngày lúc 2h sáng
0 2 * * * /home/deploy/backup_db.sh >> /home/deploy/logs/backup.log 2>&1
```

---

## 📊 **MONITORING & LOGS**

### **1. PM2 Monitoring:**
```bash
# Xem processes
pm2 list

# Monitor real-time
pm2 monit

# Logs
pm2 logs theme-editor

# Restart app
pm2 restart theme-editor

# Reload without downtime
pm2 reload theme-editor
```

### **2. System Monitoring:**
```bash
# Cài đặt htop
sudo apt install -y htop

# Check system resources
htop
df -h
free -h
```

### **3. Log Management:**
```bash
# Tạo logrotate config
sudo nano /etc/logrotate.d/theme-editor

# Nội dung:
/home/deploy/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0644 deploy deploy
    postrotate
        pm2 reload theme-editor > /dev/null
    endscript
}
```

---

## 🔄 **BACKUP & MAINTENANCE**

### **1. Complete Backup Script:**
```bash
cat > /home/deploy/full_backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/deploy/backups/full"
DATE=$(date +%Y%m%d_%H%M%S)
APP_DIR="/home/deploy/theme-editor"

mkdir -p $BACKUP_DIR

# Database backup
pg_dump -h localhost -U deploy -d theme_editor > $BACKUP_DIR/db_$DATE.sql

# Application backup
tar -czf $BACKUP_DIR/app_$DATE.tar.gz -C /home/deploy theme-editor

# Config backup
tar -czf $BACKUP_DIR/config_$DATE.tar.gz /etc/nginx/sites-available/theme-editor

echo "Full backup completed: $DATE"
EOF

chmod +x /home/deploy/full_backup.sh
```

### **2. Deployment Script:**
```bash
cat > /home/deploy/deploy.sh << 'EOF'
#!/bin/bash
APP_DIR="/home/deploy/theme-editor/theme-editor"

echo "Starting deployment..."

# Navigate to app directory
cd $APP_DIR

# Pull latest changes
git pull origin main

# Install dependencies
npm ci

# Build application
npm run build

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma db push

# Reload PM2
pm2 reload theme-editor

echo "Deployment completed!"
EOF

chmod +x /home/deploy/deploy.sh
```

### **3. Health Check Script:**
```bash
cat > /home/deploy/health_check.sh << 'EOF'
#!/bin/bash
HEALTH_URL="https://yourdomain.com/api/health"

if curl -f -s $HEALTH_URL > /dev/null; then
    echo "$(date): Application is healthy"
else
    echo "$(date): Application is down! Restarting..."
    pm2 restart theme-editor
fi
EOF

chmod +x /home/deploy/health_check.sh

# Crontab cho health check (mỗi 5 phút)
crontab -e
# Thêm:
*/5 * * * * /home/deploy/health_check.sh >> /home/deploy/logs/health.log 2>&1
```

---

## 🚨 **TROUBLESHOOTING**

### **Common Issues:**

#### **1. Application không start:**
```bash
# Check logs
pm2 logs theme-editor

# Check system resources
free -h
df -h

# Restart application
pm2 restart theme-editor
```

#### **2. Database connection error:**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test connection
psql -h localhost -U deploy -d theme_editor

# Restart PostgreSQL
sudo systemctl restart postgresql
```

#### **3. Nginx 502 Error:**
```bash
# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Check application port
netstat -tulpn | grep :3000

# Test Nginx config
sudo nginx -t
```

#### **4. SSL Issues:**
```bash
# Check certificate
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Test SSL
openssl s_client -connect yourdomain.com:443
```

---

## 🔧 **PERFORMANCE OPTIMIZATION**

### **1. Server Optimization:**
```bash
# Increase file limits
echo "* soft nofile 65536" | sudo tee -a /etc/security/limits.conf
echo "* hard nofile 65536" | sudo tee -a /etc/security/limits.conf

# Kernel optimization
echo "net.core.somaxconn = 65536" | sudo tee -a /etc/sysctl.conf
echo "net.core.netdev_max_backlog = 5000" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### **2. Database Optimization:**
```sql
-- PostgreSQL tuning
ALTER SYSTEM SET shared_buffers = '1GB';
ALTER SYSTEM SET effective_cache_size = '3GB';
ALTER SYSTEM SET maintenance_work_mem = '256MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
SELECT pg_reload_conf();
```

---

## 📱 **MOBILE ACCESS**

### **Setup SSH Key cho mobile:**
```bash
# Tạo SSH key trên mobile (Termux)
ssh-keygen -t rsa -b 4096

# Copy public key lên server
cat ~/.ssh/id_rsa.pub | ssh deploy@your-vps-ip 'mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys'
```

---

## ✅ **CHECKLIST DEPLOY**

- [ ] VPS đã cài đặt Ubuntu 20.04+
- [ ] Node.js 20+ đã cài đặt
- [ ] PostgreSQL đã setup
- [ ] Nginx đã cấu hình
- [ ] SSL Certificate đã cài đặt
- [ ] PM2 đã setup
- [ ] Environment variables đã cấu hình
- [ ] Database migrations đã chạy
- [ ] Application đã build thành công
- [ ] Backup scripts đã setup
- [ ] Monitoring đã cấu hình
- [ ] Firewall đã cấu hình
- [ ] DNS đã trỏ đúng
- [ ] Health checks đã test
- [ ] Auto-renewal SSL đã setup

---

## 🆘 **SUPPORT**

Nếu gặp vấn đề, vui lòng:
1. Check logs trước: `pm2 logs theme-editor`
2. Check system resources: `htop`, `df -h`
3. Test connectivity: `curl -I https://yourdomain.com`
4. Contact: your-support-email@domain.com

---

**🎉 Chúc bạn deploy thành công!** 