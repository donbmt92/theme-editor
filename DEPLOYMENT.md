# Theme Editor - Deployment Guide

## 📋 Tổng quan

Theme Editor là một ứng dụng Next.js cho phép tạo và chỉnh sửa themes, tích hợp thanh toán QR code và quản lý dự án. Hướng dẫn này cung cấp các bước chi tiết để deploy ứng dụng lên production.

## 🛠 Yêu cầu hệ thống

### Server Requirements
- **Node.js**: 18.0.0 hoặc mới hơn
- **RAM**: Tối thiểu 2GB (khuyến nghị 4GB+)
- **Storage**: Tối thiểu 10GB free space
- **Database**: PostgreSQL 13+ hoặc MySQL 8+

### Development Tools
- npm hoặc yarn
- Git
- PM2 (cho production deployment)

## 📦 Chuẩn bị deployment

### 1. Clone repository
```bash
git clone <your-repo-url>
cd theme-editor
```

### 2. Cài đặt dependencies
```bash
npm install
# hoặc
yarn install
```

### 3. Cấu hình Environment Variables

Tạo file `.env` từ `.env.example`:
```bash
cp env.example .env
```

Cập nhật các biến môi trường:

```env
# Database - Thay thế với thông tin database thực tế
DATABASE_URL="postgresql://username:password@localhost:5432/theme_editor_prod"

# Authentication - Tạo secret key mạnh
NEXTAUTH_SECRET="your-strong-secret-key-32-characters-min"
NEXTAUTH_URL="https://yourdomain.com"

# Payment Gateway
BANK_API_KEY="your-sepay-api-key"
BANK_API_SECRET="your-sepay-secret"
BANK_API_URL="https://my.sepay.vn/userapi"

# File Storage (AWS S3 hoặc local)
UPLOAD_DIR="uploads"
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_S3_BUCKET="theme-editor-exports"
AWS_REGION="ap-southeast-1"

# Email (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Redis (Optional)
REDIS_URL="redis://localhost:6379"
```

## 🗄 Cài đặt Database

### PostgreSQL Setup
```bash
# Cài đặt PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Tạo database và user
sudo -u postgres psql
CREATE DATABASE theme_editor_prod;
CREATE USER theme_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE theme_editor_prod TO theme_user;
\q
```

### Database Migration
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma db push

# Seed database (optional)
npm run db:seed
```

## 🚀 Deployment Options

## Option 1: Manual Deployment trên VPS

### 1. Build ứng dụng
```bash
npm run build
```

### 2. Cài đặt PM2
```bash
npm install -g pm2
```

### 3. Tạo ecosystem file
Tạo file `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'theme-editor',
    script: 'npm',
    args: 'start',
    cwd: '/path/to/your/theme-editor',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

### 4. Chạy với PM2
```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### 5. Cấu hình Nginx
Tạo file `/etc/nginx/sites-available/theme-editor`:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

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
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/theme-editor /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. SSL với Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Option 2: Deploy lên Vercel

### 1. Cài đặt Vercel CLI
```bash
npm install -g vercel
```

### 2. Deploy
```bash
vercel
```

### 3. Cấu hình Environment Variables
- Vào Vercel Dashboard
- Settings → Environment Variables
- Thêm tất cả variables từ file `.env`

### 4. Database Setup
- Sử dụng Vercel Postgres hoặc external PostgreSQL
- Cập nhật `DATABASE_URL` trong Vercel settings

## Option 3: Deploy lên Railway

### 1. Cấu hình railway.json
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "numReplicas": 1,
    "sleepApplication": false,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 2. Database
- Thêm PostgreSQL service trong Railway
- Sao chép DATABASE_URL vào environment variables

### 3. Deploy
```bash
# Cài đặt Railway CLI
npm install -g @railway/cli

# Login và deploy
railway login
railway link
railway up
```

## 🔧 Production Optimizations

### 1. Performance
```javascript
// next.config.ts
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  images: {
    domains: ['qr.sepay.vn'],
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
}

export default nextConfig
```

### 2. Security Headers
```javascript
// next.config.ts
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
]

const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}
```

## 📊 Monitoring & Logging

### 1. Cài đặt Monitoring
```bash
# Application monitoring
npm install @sentry/nextjs

# System monitoring với PM2
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 100M
pm2 set pm2-logrotate:retain 7
```

### 2. Health Check Endpoint
Tạo file `src/app/api/health/route.ts`:
```typescript
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected'
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message
      },
      { status: 500 }
    )
  }
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example
Tạo file `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build application
      run: npm run build
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.7
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USER }}
        key: ${{ secrets.SERVER_SSH_KEY }}
        script: |
          cd /path/to/theme-editor
          git pull origin main
          npm ci
          npm run build
          npx prisma db push
          pm2 reload theme-editor
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Error**
   ```bash
   # Check database status
   sudo systemctl status postgresql
   
   # Check connection
   npx prisma db push
   ```

2. **Build Errors**
   ```bash
   # Clear cache
   rm -rf .next
   npm run build
   ```

3. **PM2 Issues**
   ```bash
   # Check logs
   pm2 logs theme-editor
   
   # Restart application
   pm2 restart theme-editor
   ```

4. **Memory Issues**
   ```bash
   # Monitor memory usage
   pm2 monit
   
   # Increase Node.js memory limit
   NODE_OPTIONS="--max-old-space-size=4096" npm start
   ```

## 📋 Backup Strategy

### 1. Database Backup
```bash
#!/bin/bash
# backup.sh
BACKUP_DIR="/var/backups/theme-editor"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Database backup
pg_dump -h localhost -U theme_user theme_editor_prod > $BACKUP_DIR/db_backup_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "db_backup_*.sql" -mtime +7 -delete
```

### 2. File Backup
```bash
# Backup uploads directory
tar -czf $BACKUP_DIR/uploads_backup_$DATE.tar.gz uploads/
```

### 3. Automated Backup với Cron
```bash
# Thêm vào crontab
0 2 * * * /path/to/backup.sh
```

## ✅ Production Checklist

- [ ] Environment variables configured
- [ ] Database setup and migrated
- [ ] SSL certificate installed
- [ ] Monitoring setup
- [ ] Backup strategy implemented
- [ ] Health checks working
- [ ] Performance optimization applied
- [ ] Security headers configured
- [ ] CI/CD pipeline setup
- [ ] Documentation updated

## 📞 Support

Nếu gặp vấn đề trong quá trình deployment:

1. Kiểm tra logs: `pm2 logs theme-editor`
2. Kiểm tra health endpoint: `curl https://yourdomain.com/api/health`
3. Xem GitHub Issues cho các lỗi thường gặp
4. Liên hệ team support

---

**Lưu ý**: Đảm bảo backup dữ liệu trước khi deployment và luôn test trên staging environment trước khi deploy lên production. 