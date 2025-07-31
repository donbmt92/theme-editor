# Hướng dẫn Export Project với User Folder và Deploy Script

## Tính năng mới

### 1. User Folder riêng biệt
- Mỗi user sẽ có folder riêng khi export project
- Tránh trùng lặp file khi nhiều user export cùng lúc
- Cấu trúc: `users/{userId}/{projectName}-{timestamp}/`

### 2. Deploy Script tự động
- Tạo script deploy cho 4 loại server: Nginx, Apache, Node.js, Docker
- Script bao gồm:
  - Cài đặt dependencies
  - Build project
  - Cấu hình server
  - Deploy tự động

## Cách sử dụng

### 1. Trong Export Dialog

1. **Checkbox "Tạo folder riêng cho user"**
   - ✅ Bật: Tạo folder theo userId
   - ❌ Tắt: File export trực tiếp ở root

2. **Checkbox "Tạo script deploy tự động"**
   - ✅ Bật: Tạo script deploy
   - ❌ Tắt: Không tạo script

3. **Dropdown "Loại server"** (nếu bật deploy script)
   - **Nginx**: Script cho web server Nginx
   - **Apache**: Script cho web server Apache  
   - **Node.js**: Script cho Node.js server với PM2
   - **Docker**: Script với Dockerfile và docker-compose

### 2. Kết quả Export

Sau khi export thành công, bạn sẽ nhận được:

- **ZIP file** chứa project code
- **User folder path** (nếu đã chọn)
- **Deploy script** (nếu đã chọn)

## Chi tiết Deploy Scripts

### Nginx Deploy Script (`deploy-nginx.sh`)

```bash
# Chạy với quyền sudo
sudo ./deploy-nginx.sh

# Script sẽ:
# 1. Cài đặt dependencies (nếu cần)
# 2. Build project
# 3. Copy files to /var/www/{project-name}
# 4. Tạo cấu hình Nginx
# 5. Enable site và reload Nginx
```

**Tính năng:**
- ✅ Gzip compression
- ✅ Static asset caching  
- ✅ Security headers
- ✅ SPA routing support
- ✅ SSL ready (hướng dẫn Let's Encrypt)

### Apache Deploy Script (`deploy-apache.sh`)

```bash
# Chạy với quyền sudo
sudo ./deploy-apache.sh

# Script sẽ:
# 1. Cài đặt dependencies (nếu cần)
# 2. Build project
# 3. Copy files to /var/www/html/{project-name}
# 4. Tạo VirtualHost configuration
# 5. Enable site và reload Apache
```

**Tính năng:**
- ✅ URL rewriting cho SPA
- ✅ Directory permissions
- ✅ Error và access logs
- ✅ mod_rewrite support

### Node.js Deploy Script (`deploy-node.sh`)

```bash
# Chạy script
./deploy-node.sh

# Script sẽ:
# 1. Cài đặt dependencies
# 2. Build project 
# 3. Cài đặt PM2 (nếu chưa có)
# 4. Tạo ecosystem.config.js
# 5. Start/restart app với PM2
```

**Tính năng:**
- ✅ PM2 process management
- ✅ Auto restart
- ✅ Startup script
- ✅ Production environment
- ✅ Support Next.js và React

### Docker Deploy Script (`deploy-docker.sh`)

```bash
# Chạy script
./deploy-docker.sh

# Script sẽ:
# 1. Tạo Dockerfile phù hợp
# 2. Tạo docker-compose.yml  
# 3. Build Docker image
# 4. Stop container cũ
# 5. Start container mới
```

**Tính năng:**
- ✅ Multi-stage builds
- ✅ Production optimized
- ✅ Container management
- ✅ Port configuration
- ✅ Auto restart policy

## Cấu trúc File Export

### Với User Folder
```
exported-project.zip
└── users/
    └── {userId}/
        └── {projectName}-{timestamp}/
            ├── src/
            ├── public/
            ├── package.json
            ├── deploy-{server}.sh
            └── ...
```

### Không User Folder
```
exported-project.zip
├── src/
├── public/
├── package.json
├── deploy-{server}.sh
└── ...
```

## Lợi ích

### 1. User Folder
- **Tránh conflict**: Nhiều user export cùng lúc không bị trùng file
- **Dễ quản lý**: Admin có thể theo dõi export của từng user
- **Bảo mật**: File của user này không ảnh hưởng user khác

### 2. Deploy Script  
- **Tiết kiệm thời gian**: Không cần cấu hình manual
- **Standardized**: Cấu hình server chuẩn và tối ưu
- **Beginner friendly**: User không cần biết server config
- **Production ready**: Cấu hình cho production environment

## Yêu cầu hệ thống

### Nginx/Apache
- Ubuntu/Debian: `sudo apt install nginx` hoặc `sudo apt install apache2`
- CentOS/RHEL: `sudo yum install nginx` hoặc `sudo yum install httpd`

### Node.js
- Node.js 18+: https://nodejs.org/
- PM2: `npm install -g pm2`

### Docker
- Docker: https://docs.docker.com/get-docker/
- Docker Compose: https://docs.docker.com/compose/install/

## Troubleshooting

### Lỗi permission denied
```bash
# Thêm quyền execute cho script
chmod +x deploy-*.sh
```

### Nginx/Apache không start
```bash
# Kiểm tra cấu hình
sudo nginx -t
sudo apache2ctl configtest

# Xem logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/apache2/error.log
```

### PM2 app không start
```bash
# Xem PM2 logs
pm2 logs {app-name}

# Restart app
pm2 restart {app-name}
```

### Docker container không start
```bash
# Xem logs
docker-compose logs -f

# Rebuild container
docker-compose down
docker-compose up --build -d
```

## Lưu ý quan trọng

1. **Backup**: Luôn backup trước khi deploy
2. **Domain**: Thay đổi domain trong script trước khi chạy
3. **Port**: Kiểm tra port không bị conflict
4. **Permissions**: Đảm bảo user có quyền cần thiết
5. **Dependencies**: Cài đặt đủ dependencies trước khi deploy

## Hỗ trợ

Nếu gặp vấn đề trong quá trình export hoặc deploy, vui lòng:
1. Kiểm tra logs trong export dialog
2. Xem logs của server/container
3. Đảm bảo đã cài đặt đúng dependencies
4. Liên hệ support team

---

*Tính năng này được tạo để đơn giản hóa quá trình deploy và tránh conflict giữa các user.*