# 📘 Hướng Dẫn Triển Khai Job Queue System

## 📋 Tổng Quan

Hệ thống Job Queue sử dụng **Redis + BullMQ** để xử lý các tác vụ nặng (deploy, AI generation) một cách bất đồng bộ, tránh timeout và cải thiện trải nghiệm người dùng.

---

## 🖥️ PHẦN 1: CÀI ĐẶT TRÊN LOCAL

### Option 1: Sử dụng Docker Compose (Khuyến nghị)

#### Bước 1: Chuẩn bị

Đảm bảo bạn đã cài đặt:

- Docker Desktop
- Node.js 20+

#### Bước 2: Cấu hình môi trường

Tạo file `.env` (nếu chưa có):

```env
# Database
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/theme_editor"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Redis (Docker)
REDIS_HOST="redis"
REDIS_PORT="6379"

# GitHub & Vercel (optional)
GITHUB_TOKEN="your-github-token"
VERCEL_TOKEN="your-vercel-token"
```

#### Bước 3: Khởi động toàn bộ hệ thống

```bash
# Build và start tất cả services (App + Redis + Workers)
docker-compose up -d --build

# Xem logs
docker-compose logs -f

# Xem log riêng Worker
docker-compose logs -f worker
```

#### Bước 4: Kiểm tra

- App: http://localhost:3033
- Redis: `localhost:6379`
- Worker logs: `docker-compose logs -f worker`

#### Dừng hệ thống

```bash
docker-compose down
```

---

### Option 2: Chạy Manual (Không dùng Docker)

#### Bước 1: Cài Redis

**Windows (WSL2):**

```bash
wsl --install
wsl
sudo apt update
sudo apt install redis-server -y
sudo service redis-server start
redis-cli ping  # Phải trả về PONG
```

**macOS:**

```bash
brew install redis
brew services start redis
```

**Linux:**

```bash
sudo apt update
sudo apt install redis-server -y
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

#### Bước 2: Cài dependencies

```bash
cd d:\2025\nextjs\theme\theme-editor
npm install --legacy-peer-deps
```

#### Bước 3: Cấu hình môi trường

File `.env`:

```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/theme_editor"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Redis local
REDIS_HOST="localhost"
REDIS_PORT="6379"
```

#### Bước 4: Chạy ứng dụng

**Terminal 1 - Start Next.js App:**

```bash
npm run dev
```

**Terminal 2 - Start Workers:**

```bash
npx tsx workers.ts
```

#### Bước 5: Kiểm tra

- App: http://localhost:3000 (hoặc 3080 tùy config)
- Redis: `redis-cli ping`
- Worker logs: Xem terminal 2

---

## 🚀 PHẦN 2: TRIỂN KHAI TRÊN VPS

### Yêu cầu VPS

- Ubuntu 22.04 LTS
- Docker & Docker Compose đã cài
- PostgreSQL đang chạy (hoặc dùng container riêng)
- Domain đã trỏ về VPS (nếu cần SSL)

### Bước 1: Chuẩn bị VPS

#### 1.1. Kết nối SSH

```bash
ssh deploy@your-vps-ip
```

#### 1.2. Cài Docker (nếu chưa có)

```bash
# Cài Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Cài Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Kiểm tra
docker --version
docker-compose --version
```

### Bước 2: Upload code

#### Option A: Sử dụng Git (Khuyến nghị)

```bash
# Trên VPS
cd /var/www
git clone https://github.com/your-username/theme-editor.git
cd theme-editor
```

#### Option B: Upload trực tiếp

```bash
# Trên máy local
scp -r d:\2025\nextjs\theme\theme-editor deploy@your-vps:/var/www/
```

### Bước 3: Cấu hình Production

#### 3.1. Tạo file `.env` trên VPS

```bash
cd /var/www/theme-editor
nano .env
```

Nội dung:

```env
# Database (VPS PostgreSQL)
DATABASE_URL="postgresql://deploy:password@localhost:5432/theme_editor"

# NextAuth
NEXTAUTH_URL="https://geekgolfers.com"
NEXTAUTH_SECRET="production-secret-key-here"

# Redis (Docker container)
REDIS_HOST="redis"
REDIS_PORT="6379"

# GitHub & Vercel
GITHUB_TOKEN="your-github-token"
VERCEL_TOKEN="your-vercel-token"
GOOGLE_AI_API_KEY="your-gemini-key"
```

#### 3.2. Cập nhật `docker-compose.yml` cho Production

Kiểm tra `DATABASE_URL` trong file `docker-compose.yml`:

```yaml
environment:
  - DATABASE_URL=postgresql://deploy:password@host.docker.internal:5432/theme_editor
```

> **Lưu ý:** `host.docker.internal` cho phép container truy cập PostgreSQL trên host.

### Bước 4: Khởi động Production

```bash
# Build và start
docker-compose up -d --build

# Kiểm tra containers
docker-compose ps

# Xem logs
docker-compose logs -f

# Xem log worker
docker-compose logs -f worker
```

### Bước 5: Migrate Database

```bash
# Chạy migrations (nếu cần)
docker-compose exec app npx prisma migrate deploy

# Hoặc push schema (dev)
docker-compose exec app npx prisma db push

# Generate Prisma Client
docker-compose exec app npx prisma generate
```

### Bước 6: Cấu hình Nginx (nếu cần Reverse Proxy + SSL)

#### 6.1. Cài Nginx

```bash
sudo apt install nginx -y
```

#### 6.2. Tạo config

```bash
sudo nano /etc/nginx/sites-available/geekgolfers.com
```

Nội dung:

```nginx
server {
    listen 80;
    server_name geekgolfers.com www.geekgolfers.com;

    location / {
        proxy_pass http://localhost:3033;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 6.3. Enable site

```bash
sudo ln -s /etc/nginx/sites-available/geekgolfers.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 6.4. Cài SSL (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d geekgolfers.com -d www.geekgolfers.com
```

### Bước 7: Auto-restart (Optional)

Để Docker Compose tự khởi động lại khi VPS reboot:

Thêm vào cron:

```bash
crontab -e
```

Thêm dòng:

```
@reboot cd /var/www/theme-editor && docker-compose up -d
```

---

## 🔍 TROUBLESHOOTING

### 1. Worker không chạy

```bash
# Kiểm tra worker logs
docker-compose logs worker

# Restart worker
docker-compose restart worker

# Kiểm tra Redis
docker-compose exec redis redis-cli ping
```

### 2. Database connection lỗi

```bash
# Kiểm tra PostgreSQL trên host
sudo systemctl status postgresql

# Test connection từ container
docker-compose exec app psql $DATABASE_URL -c "SELECT 1"
```

### 3. Redis connection refused

```bash
# Kiểm tra Redis container
docker-compose ps redis

# Test từ app container
docker-compose exec app ping redis
```

### 4. Build lỗi

```bash
# Xóa cache và rebuild
docker-compose down
docker system prune -a
docker-compose up -d --build
```

### 5. Xem job queue trực tiếp trong Redis

```bash
# Vào Redis CLI
docker-compose exec redis redis-cli

# Trong Redis CLI:
KEYS bull:*          # Xem tất cả keys của BullMQ
LLEN bull:deploy:wait  # Xem số job đang chờ
```

---

## 📊 MONITORING

### Xem trạng thái hệ thống

```bash
# Xem tất cả containers
docker-compose ps

# Xem resource usage
docker stats

# Xem logs realtime
docker-compose logs -f app worker redis
```

### Restart từng service

```bash
# Restart app
docker-compose restart app

# Restart worker
docker-compose restart worker

# Restart Redis
docker-compose restart redis
```

### Update code mới

```bash
# Pull code mới
git pull origin main

# Rebuild và restart
docker-compose up -d --build

# Hoặc restart không rebuild
docker-compose restart
```

---

## 🎯 KIỂM TRA HỆ THỐNG

### Test Job Queue

1. Truy cập ứng dụng
2. Trigger một deployment
3. Kiểm tra logs:
   ```bash
   docker-compose logs -f worker
   ```
4. Bạn sẽ thấy:
   ```
   🚀 [WORKER] Starting deploy job deploy-xxx-12345
   📊 Deploy job xxx: Generating file manifest...
   ✅ [WORKER] Deploy job xxx completed
   ```

### Test Redis

```bash
# Ping Redis
docker-compose exec redis redis-cli ping

# Xem monitor
docker-compose exec redis redis-cli monitor
```

---

## 🔐 BẢO MẬT

1. **Đừng commit `.env` vào Git:**

   ```bash
   echo ".env" >> .gitignore
   ```

2. **Rotate API keys thường xuyên**

3. **Giới hạn port Redis:**
   - Chỉ expose trong Docker network
   - Không expose `6379` ra ngoài internet

4. **Firewall VPS:**
   ```bash
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw allow 22/tcp
   sudo ufw enable
   ```

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề:

1. Kiểm tra logs: `docker-compose logs`
2. Restart services: `docker-compose restart`
3. Rebuild: `docker-compose up -d --build`
4. Xóa volumes: `docker-compose down -v` (⚠️ Mất data Redis)
