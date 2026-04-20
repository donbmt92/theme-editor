# 🔧 Hướng dẫn khắc phục vấn đề Domain Redirect

## 🚨 Vấn đề
Domain `test.dreaktech.xyz` đang bị redirect về `https://onghoangdohieu.com/`

## 🔍 Nguyên nhân có thể

### 1. **Default Nginx Site**
- Default site có thể đang catch tất cả domain không được cấu hình
- Có thể có redirect rule trong default site

### 2. **Server Name Conflicts**
- Có server block với `server_name _` hoặc `server_name *`
- Nhiều config có cùng server_name

### 3. **Redirect Rules**
- Có redirect rule 301/302 trong config
- SSL redirect không đúng domain

### 4. **DNS Issues**
- Domain chưa trỏ đúng IP VPS
- DNS cache chưa update

## 🛠️ Cách khắc phục

### **Bước 1: Kiểm tra cấu hình hiện tại**

```bash
# Chạy script kiểm tra
sudo chmod +x check-redirect-issue.sh
sudo ./check-redirect-issue.sh
```

### **Bước 2: Kiểm tra thủ công**

```bash
# 1. Kiểm tra các site đã enable
ls -la /etc/nginx/sites-enabled/

# 2. Kiểm tra default site
cat /etc/nginx/sites-enabled/default

# 3. Kiểm tra tất cả config
for config in /etc/nginx/sites-enabled/*; do
    echo "=== $config ==="
    cat "$config"
    echo ""
done
```

### **Bước 3: Disable default site (nếu cần)**

```bash
# Disable default site
sudo rm /etc/nginx/sites-enabled/default

# Test config
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### **Bước 4: Tạo config riêng cho test.dreaktech.xyz**

```bash
# Tạo config file
sudo nano /etc/nginx/sites-available/test.dreaktech.xyz
```

**Nội dung config:**

```nginx
# HTTP server for test.dreaktech.xyz
server {
    listen 80;
    server_name test.dreaktech.xyz www.test.dreaktech.xyz;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript;

    # Main application
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

    # API
    location /api/ {
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

    # Static Files
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 1y;
        add_header Cache-Control "public, immutable";
    }

    # Logging
    access_log /var/log/nginx/test.dreaktech.xyz.access.log;
    error_log /var/log/nginx/test.dreaktech.xyz.error.log;
}
```

### **Bước 5: Enable site**

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/test.dreaktech.xyz /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### **Bước 6: Kiểm tra DNS**

```bash
# Kiểm tra DNS resolution
nslookup test.dreaktech.xyz

# Kiểm tra IP
dig test.dreaktech.xyz

# Test từ VPS
curl -I http://test.dreaktech.xyz
```

### **Bước 7: Kiểm tra logs**

```bash
# Kiểm tra error logs
sudo tail -f /var/log/nginx/error.log

# Kiểm tra access logs
sudo tail -f /var/log/nginx/access.log

# Kiểm tra logs cụ thể cho domain
sudo tail -f /var/log/nginx/test.dreaktech.xyz.error.log
```

## 🔒 Thêm SSL (tùy chọn)

### **Tạo SSL certificate:**

```bash
# Cài đặt certbot (nếu chưa có)
sudo apt install -y snapd
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# Tạo certificate
sudo certbot certonly --standalone \
  -d test.dreaktech.xyz \
  -d www.test.dreaktech.xyz \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email
```

### **Cập nhật config với SSL:**

```nginx
# HTTP redirect to HTTPS
server {
    listen 80;
    server_name test.dreaktech.xyz www.test.dreaktech.xyz;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name test.dreaktech.xyz www.test.dreaktech.xyz;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/test.dreaktech.xyz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/test.dreaktech.xyz/privkey.pem;
    
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
    gzip_types text/plain text/css text/xml text/javascript application/javascript;

    # Main application
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

    # API
    location /api/ {
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

    # Static Files
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 1y;
        add_header Cache-Control "public, immutable";
    }

    # Logging
    access_log /var/log/nginx/test.dreaktech.xyz.access.log;
    error_log /var/log/nginx/test.dreaktech.xyz.error.log;
}
```

## 🧪 Test và Debug

### **Test từ local:**

```bash
# Test DNS
nslookup test.dreaktech.xyz

# Test HTTP
curl -I http://test.dreaktech.xyz

# Test HTTPS (nếu có SSL)
curl -I https://test.dreaktech.xyz

# Test với verbose
curl -v http://test.dreaktech.xyz
```

### **Test từ browser:**

1. Mở Developer Tools (F12)
2. Vào tab Network
3. Truy cập `http://test.dreaktech.xyz`
4. Kiểm tra response headers

### **Debug commands:**

```bash
# Kiểm tra nginx status
sudo systemctl status nginx

# Kiểm tra nginx config
sudo nginx -t

# Kiểm tra ports đang listen
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443

# Kiểm tra process
ps aux | grep nginx
```

## 🚨 Troubleshooting

### **Nếu vẫn bị redirect:**

1. **Kiểm tra tất cả config files:**
   ```bash
   grep -r "onghoangdohieu.com" /etc/nginx/
   ```

2. **Kiểm tra redirect rules:**
   ```bash
   grep -r "return 301" /etc/nginx/
   grep -r "return 302" /etc/nginx/
   ```

3. **Kiểm tra server_name conflicts:**
   ```bash
   grep -r "server_name" /etc/nginx/sites-enabled/
   ```

4. **Restart nginx hoàn toàn:**
   ```bash
   sudo systemctl stop nginx
   sudo systemctl start nginx
   ```

### **Nếu có lỗi SSL:**

1. **Kiểm tra certificate:**
   ```bash
   sudo certbot certificates
   ```

2. **Renew certificate:**
   ```bash
   sudo certbot renew
   ```

3. **Test SSL:**
   ```bash
   openssl s_client -connect test.dreaktech.xyz:443
   ```

## 📞 Hỗ trợ

Nếu vẫn gặp vấn đề, hãy cung cấp:

1. Output của script `check-redirect-issue.sh`
2. Nội dung file `/var/log/nginx/error.log`
3. Output của `nginx -t`
4. Kết quả `nslookup test.dreaktech.xyz` 