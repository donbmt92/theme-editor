# 🚨 HƯỚNG DẪN SỬA CHỮA LỖI 404 CHO UPLOADS

## 📋 **VẤN ĐỀ**
File upload thành công nhưng không thể truy cập được từ web:
- **URL:** `https://onghoangdohieu.com/uploads/1755768060756-xxo36j86sy.png`
- **Lỗi:** 404 Not Found
- **Nguyên nhân:** Nginx không serve static files từ thư mục uploads

---

## 🔍 **NGUYÊN NHÂN**

### **1. File Upload Thành Công**
- File được lưu vào `public/uploads/` trên server
- API `/api/upload` hoạt động bình thường
- Database ghi nhận URL upload

### **2. Nginx Không Serve Static Files**
- Không có `location /uploads/` trong Nginx config
- Next.js không handle route `/uploads/*` trong production
- File tồn tại trên disk nhưng không accessible từ web

---

## 🛠️ **GIẢI PHÁP**

### **BƯỚC 1: Sửa Chữa Cấu Hình Nginx**

#### **1.1 SSH vào VPS:**
```bash
ssh deploy@onghoangdohieu.com
# hoặc
ssh root@onghoangdohieu.com
```

#### **1.2 Backup cấu hình hiện tại:**
```bash
sudo cp /etc/nginx/sites-available/onghoangdohieu.com /etc/nginx/sites-available/onghoangdohieu.com.backup.$(date +%Y%m%d_%H%M%S)
```

#### **1.3 Thêm location /uploads/ vào Nginx config:**
```bash
sudo nano /etc/nginx/sites-available/onghoangdohieu.com
```

#### **1.4 Thêm đoạn code sau vào trước dòng `}` cuối cùng:**
```nginx
# Serve uploaded files directly from Nginx
location /uploads/ {
    alias /home/deploy/theme-editor/theme-editor/public/uploads/;
    
    # Security: only allow image and PDF files
    location ~* \.(jpg|jpeg|png|gif|webp|pdf)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
        add_header X-Content-Type-Options "nosniff";
        
        # Optional: Add CORS headers if needed
        add_header Access-Control-Allow-Origin "*";
        add_header Access-Control-Allow-Methods "GET, HEAD";
        add_header Access-Control-Allow-Headers "Accept, Accept-Encoding, Accept-Language, Cache-Control";
    }
    
    # Block access to other file types
    location ~* \.(php|js|html|txt|log|env|git|sql)$ {
        deny all;
        return 404;
    }
    
    # Block access to hidden files
    location ~ /\. {
        deny all;
        return 404;
    }
}
```

### **BƯỚC 2: Kiểm Tra và Reload Nginx**

#### **2.1 Test cấu hình:**
```bash
sudo nginx -t
```

#### **2.2 Reload Nginx:**
```bash
sudo systemctl reload nginx
```

#### **2.3 Kiểm tra status:**
```bash
sudo systemctl status nginx
```

### **BƯỚC 3: Kiểm Tra Quyền Truy Cập**

#### **3.1 Kiểm tra thư mục uploads:**
```bash
ls -la /home/deploy/theme-editor/theme-editor/public/uploads/
```

#### **3.2 Kiểm tra quyền:**
```bash
sudo chmod 755 /home/deploy/theme-editor/theme-editor/public/uploads/
sudo chown deploy:deploy /home/deploy/theme-editor/theme-editor/public/uploads/
```

#### **3.3 Test quyền đọc:**
```bash
sudo -u www-data test -r /home/deploy/theme-editor/theme-editor/public/uploads/
```

---

## 🚀 **SỬ DỤNG SCRIPT TỰ ĐỘNG**

### **Chạy script sửa chữa:**
```bash
# Download script
wget https://raw.githubusercontent.com/your-repo/fix-nginx-uploads.sh

# Chạy script
sudo bash fix-nginx-uploads.sh
```

### **Script sẽ tự động:**
- ✅ Backup cấu hình Nginx
- ✅ Thêm location /uploads/
- ✅ Test cấu hình
- ✅ Reload Nginx
- ✅ Kiểm tra quyền truy cập
- ✅ Sửa chữa permissions nếu cần

---

## 🧪 **KIỂM TRA SAU KHI SỬA**

### **1. Test truy cập file:**
```bash
# Test từ server
curl -I https://onghoangdohieu.com/uploads/1755768060756-xxo36j86sy.png

# Test từ browser
# Mở: https://onghoangdohieu.com/uploads/1755768060756-xxo36j86sy.png
```

### **2. Test upload mới:**
- Upload file mới từ editor
- Kiểm tra file có xuất hiện trong `public/uploads/`
- Test truy cập file mới

### **3. Kiểm tra logs:**
```bash
# Nginx access logs
sudo tail -f /var/log/nginx/onghoangdohieu.com.access.log

# Nginx error logs
sudo tail -f /var/log/nginx/onghoangdohieu.com.error.log

# Application logs
pm2 logs onghoangdohieu-theme-editor
```

---

## 🔧 **TROUBLESHOOTING**

### **Vấn đề 1: Nginx config invalid**
```bash
# Kiểm tra syntax
sudo nginx -t

# Xem lỗi cụ thể
sudo nginx -t 2>&1 | grep -A 5 -B 5 "error"
```

### **Vấn đề 2: Permission denied**
```bash
# Kiểm tra ownership
ls -la /home/deploy/theme-editor/theme-editor/public/uploads/

# Sửa ownership
sudo chown -R deploy:deploy /home/deploy/theme-editor/theme-editor/public/uploads/

# Sửa permissions
sudo chmod -R 755 /home/deploy/theme-editor/theme-editor/public/uploads/
```

### **Vấn đề 3: File không tồn tại**
```bash
# Kiểm tra file có tồn tại không
ls -la /home/deploy/theme-editor/theme-editor/public/uploads/1755768060756-xxo36j86sy.png

# Kiểm tra đường dẫn đúng
pwd
ls -la public/uploads/
```

### **Vấn đề 4: Nginx không reload**
```bash
# Kiểm tra Nginx status
sudo systemctl status nginx

# Restart Nginx nếu cần
sudo systemctl restart nginx

# Kiểm tra process
ps aux | grep nginx
```

---

## 📝 **CẤU HÌNH ALTERNATIVE**

### **Nếu muốn Next.js handle uploads (không khuyến nghị):**
```nginx
location /uploads/ {
    proxy_pass http://localhost:3080;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### **Lý do không khuyến nghị:**
- ❌ Tốn tài nguyên Next.js
- ❌ Chậm hơn serve trực tiếp từ Nginx
- ❌ Có thể gây timeout cho file lớn

---

## ✅ **CHECKLIST HOÀN THÀNH**

- [ ] Backup cấu hình Nginx
- [ ] Thêm location /uploads/ vào Nginx config
- [ ] Test cấu hình Nginx
- [ ] Reload Nginx
- [ ] Kiểm tra quyền thư mục uploads
- [ ] Test truy cập file upload
- [ ] Test upload file mới
- [ ] Kiểm tra logs không có lỗi

---

## 🎯 **KẾT QUẢ MONG ĐỢI**

Sau khi hoàn thành:
- ✅ File upload accessible từ web
- ✅ URL `https://onghoangdohieu.com/uploads/filename.png` hoạt động
- ✅ Performance tốt hơn (Nginx serve trực tiếp)
- ✅ Security headers được áp dụng
- ✅ Caching được cấu hình

---

## 🆘 **LIÊN HỆ HỖ TRỢ**

Nếu vẫn gặp vấn đề:
1. Kiểm tra logs: `sudo tail -f /var/log/nginx/onghoangdohieu.com.error.log`
2. Kiểm tra status: `sudo systemctl status nginx`
3. Kiểm tra cấu hình: `sudo nginx -t`
4. Restart services: `sudo systemctl restart nginx && pm2 restart onghoangdohieu-theme-editor`

**🚀 Uploads sẽ hoạt động bình thường sau khi sửa chữa!** ✨
