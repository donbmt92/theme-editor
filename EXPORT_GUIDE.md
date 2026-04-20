# 🚀 Deploy Project Guide

## Tính năng Deploy Static HTML Website lên VPS

### Mô tả
Tính năng này cho phép deploy theme/project thành website **Static HTML** hoàn chỉnh và tự động chạy script deploy trên VPS.

## ✨ Tính năng

### 1. **Deploy Static HTML**
- Website HTML tĩnh, hoạt động trên mọi web server
- Components được generate từ theme design
- Responsive design với mobile support
- SEO optimized với meta tags

### 2. **User Folder**
- Tạo folder riêng cho mỗi user
- Tránh conflict khi nhiều user deploy cùng lúc
- Cấu trúc: `users/{userId}/{projectName}-{timestamp}/`

### 3. **Auto Deploy Script**
- Tự động tạo và chạy deploy script trên VPS
- Hỗ trợ: **Nginx**, **Apache**, **Node.js**, **Docker**
- Script được execute tự động sau khi generate

### 4. **Domain Validation**
- Kiểm tra domain đã trỏ về đúng IP VPS
- Yêu cầu domain trỏ về: `69.62.83.168`
- Tự động cập nhật script với domain khi valid

## 🛠️ Cách sử dụng

### Từ Theme Editor:
1. Mở `/editor/[themeId]`
2. Click nút **"Deploy"** ở header
3. Cấu hình options trong dialog
4. Click **"Bắt đầu deploy project"**

### Từ Project Editor:
1. Mở `/project/[projectId]`
2. Click nút **"Deploy"** ở header
3. Cấu hình options trong dialog
4. Click **"Bắt đầu deploy project"**

## ⚙️ Deploy Options

### **Cài đặt cơ bản:**
| Option | Mô tả |
|--------|-------|
| **Tên project** | Tên folder và project |
| **Mô tả** | Description cho project |
| **Bao gồm assets** | Include ảnh, fonts |

### **Tùy chọn Deploy & Folder:**
| Option | Mô tả |
|--------|-------|
| **Tạo folder riêng cho user** | Tránh trùng file giữa các user |
| **Tạo và chạy script deploy** | Auto-generate và execute script |
| **Loại server** | Nginx / Apache / Node.js / Docker |
| **Domain** | Domain cho website (optional) |

## 📁 Cấu trúc Project được tạo

```
public/exports/users/{userId}/{projectName}-{timestamp}/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── images/
│   └── (assets from theme)
├── deploy-{server}.sh
└── metadata.json
```

## 🎨 Generated Content

### **Components được generate:**
- Header với logo và navigation
- Hero Section với CTA buttons
- About Section
- Problems Section
- Solutions Section
- Products/Services Section
- Testimonials
- Footer với contact info

### **Styling:**
- CSS thuần với CSS Variables
- Responsive breakpoints
- Theme colors từ editor

## 🔧 Server Types

### **Nginx**
```bash
# Script tự động:
# - Copy files to /var/www/{project-name}
# - Tạo Nginx config
# - Enable site và reload
```

### **Apache**
```bash
# Script tự động:
# - Copy files to /var/www/html/{project-name}
# - Tạo VirtualHost config
# - Enable site và reload
```

### **Node.js**
```bash
# Script tự động:
# - Setup với PM2
# - Tạo ecosystem.config.js
# - Start/restart với PM2
```

### **Docker**
```bash
# Script tự động:
# - Tạo Dockerfile
# - Tạo docker-compose.yml
# - Build và start container
```

## 🌐 Domain Validation

### **Quy trình:**
1. Nhập domain (vd: `mydomain.com`)
2. Click **"Kiểm tra"**
3. Hệ thống kiểm tra DNS
4. ✅ Valid: Domain trỏ về `69.62.83.168`
5. ❌ Invalid: Domain trỏ về IP khác hoặc chưa cấu hình

### **Lưu ý:**
- Domain phải được trỏ trước khi deploy
- Nếu không có domain, website sẽ accessible qua IP

## 🆘 Troubleshooting

### **Deploy Failed:**
- Kiểm tra authentication (đăng nhập)
- Kiểm tra theme data có đầy đủ
- Xem logs trong dialog

### **Domain Validation Failed:**
- Đảm bảo domain đã trỏ A record về `69.62.83.168`
- Đợi DNS propagation (có thể mất vài phút đến vài giờ)
- Kiểm tra lại cấu hình DNS

### **Script Execution Failed:**
- Kiểm tra quyền trên VPS
- Xem logs chi tiết trong dialog
- Đảm bảo server type phù hợp với VPS

## 📊 API Endpoints

| Endpoint | Chức năng |
|----------|-----------|
| `POST /api/deploy-project` | Tạo project và generate files |
| `POST /api/execute-deploy-script` | Chạy deploy script trên VPS |
| `POST /api/check-domain` | Validate domain DNS |
| `POST /api/update-deploy-script` | Cập nhật script với domain |

---

*Tính năng Deploy giúp bạn đưa website từ design lên production chỉ trong vài phút!* 🎉