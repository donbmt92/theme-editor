# Hướng dẫn Deploy Project với User Folder và Auto Deploy Script

## Tính năng

### 1. User Folder riêng biệt
- Mỗi user sẽ có folder riêng khi deploy project
- Tránh trùng lặp file khi nhiều user deploy cùng lúc
- Cấu trúc: `users/{userId}/{projectName}-{timestamp}/`

### 2. Deploy Script tự động
- Tạo và **tự động chạy** script deploy cho 4 loại server: Nginx, Apache, Node.js, Docker
- Script được execute ngay trên VPS sau khi generate
- Không cần SSH thủ công vào server

### 3. Domain Validation
- Kiểm tra domain đã trỏ về đúng IP VPS: `69.62.83.168`
- Tự động cập nhật script với domain khi valid
- Block deploy nếu domain trỏ sai IP

## Cách sử dụng

### 1. Trong Deploy Dialog

1. **Checkbox "Tạo folder riêng cho user"**
   - ✅ Bật: Tạo folder theo userId
   - ❌ Tắt: File deploy trực tiếp

2. **Checkbox "Tạo và chạy script deploy tự động"**
   - ✅ Bật: Generate + Execute script
   - ❌ Tắt: Chỉ generate files

3. **Dropdown "Loại server"** (nếu bật deploy script)
   - **Nginx**: Script cho web server Nginx
   - **Apache**: Script cho web server Apache  
   - **Node.js**: Script cho Node.js server với PM2
   - **Docker**: Script với Dockerfile và docker-compose

4. **Domain input** (optional)
   - Nhập domain và click **"Kiểm tra"**
   - ✅ Valid: Script sẽ cấu hình cho domain
   - ❌ Invalid: Không thể deploy

### 2. Kết quả Deploy

Sau khi deploy thành công, bạn sẽ nhận được:

- **Folder Path**: Đường dẫn folder trên server
- **User Folder Path**: Đường dẫn user folder
- **Deploy Script**: Script đã được chạy thành công
- **Filesystem Path**: Full path trên VPS

## Chi tiết Deploy Scripts

### Nginx Deploy Script (`deploy-nginx.sh`)

```bash
# Script tự động chạy và sẽ:
# 1. Copy files to /var/www/{project-name}
# 2. Tạo cấu hình Nginx
# 3. Enable site và reload Nginx
```

**Tính năng:**
- ✅ Gzip compression
- ✅ Static asset caching  
- ✅ Security headers
- ✅ SPA routing support
- ✅ SSL ready (hướng dẫn Let's Encrypt)

### Apache Deploy Script (`deploy-apache.sh`)

```bash
# Script tự động chạy và sẽ:
# 1. Copy files to /var/www/html/{project-name}
# 2. Tạo VirtualHost configuration
# 3. Enable site và reload Apache
```

**Tính năng:**
- ✅ URL rewriting
- ✅ Directory permissions
- ✅ Error và access logs
- ✅ mod_rewrite support

### Node.js Deploy Script (`deploy-node.sh`)

```bash
# Script tự động chạy và sẽ:
# 1. Setup static file server
# 2. Cài đặt/update PM2
# 3. Tạo ecosystem.config.js
# 4. Start/restart app với PM2
```

**Tính năng:**
- ✅ PM2 process management
- ✅ Auto restart
- ✅ Startup script
- ✅ Production environment

### Docker Deploy Script (`deploy-docker.sh`)

```bash
# Script tự động chạy và sẽ:
# 1. Tạo Dockerfile (nginx base)
# 2. Tạo docker-compose.yml  
# 3. Build Docker image
# 4. Stop container cũ (nếu có)
# 5. Start container mới
```

**Tính năng:**
- ✅ Nginx-based container
- ✅ Production optimized
- ✅ Container management
- ✅ Port configuration
- ✅ Auto restart policy

## Cấu trúc File Deploy

### Với User Folder
```
public/exports/
└── users/
    └── {userId}/
        └── {projectName}-{timestamp}/
            ├── index.html
            ├── css/
            │   └── style.css
            ├── js/
            │   └── main.js
            ├── images/
            │   └── (assets)
            ├── deploy-{server}.sh
            └── metadata.json
```

## Lợi ích

### 1. User Folder
- **Tránh conflict**: Nhiều user deploy cùng lúc không bị trùng file
- **Dễ quản lý**: Admin có thể theo dõi deploy của từng user
- **Bảo mật**: File của user này không ảnh hưởng user khác

### 2. Auto Deploy Script  
- **Tiết kiệm thời gian**: Không cần SSH thủ công
- **Zero downtime**: Script handle restart gracefully
- **Standardized**: Cấu hình server chuẩn và tối ưu
- **Beginner friendly**: User không cần biết server config

### 3. Domain Validation
- **Prevent errors**: Block deploy nếu domain sai
- **Auto config**: Script tự động cấu hình domain
- **SSL ready**: Dễ dàng cài Let's Encrypt

## Yêu cầu hệ thống

VPS cần có sẵn:

### Nginx
```bash
# Ubuntu/Debian
sudo apt install nginx
```

### Apache
```bash
# Ubuntu/Debian
sudo apt install apache2
```

### Node.js
```bash
# Node.js 18+
# PM2: npm install -g pm2
```

### Docker
```bash
# Docker + Docker Compose
# https://docs.docker.com/get-docker/
```

## Troubleshooting

### Lỗi không thể deploy
```bash
# Kiểm tra đã đăng nhập chưa
# Kiểm tra logs trong dialog
```

### Domain validation failed
```bash
# Kiểm tra A record trong DNS
# Đảm bảo trỏ về: 69.62.83.168
# Đợi DNS propagation (vài phút - vài giờ)
```

### Script execution failed
```bash
# Kiểm tra quyền trên VPS
# Xem logs chi tiết
# Đảm bảo server software đã cài
```

## Lưu ý quan trọng

1. **Authentication**: Phải đăng nhập để deploy
2. **Domain**: Phải validate trước khi deploy với domain
3. **Server**: Đảm bảo VPS đã cài sẵn server software
4. **Permissions**: User chạy script cần quyền phù hợp
5. **Backup**: Luôn backup trước khi deploy lên production

---

*Tính năng này giúp đơn giản hóa quá trình deploy và tránh conflict giữa các user.*