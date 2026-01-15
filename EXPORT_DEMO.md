# 🎬 Deploy Demo Guide

## Demo tính năng Deploy Project Static HTML

### 1. **Setup Demo Environment**

#### Tạo test project:
1. Mở theme editor `/editor/vietnam-coffee`
2. Hoặc project editor `/project/test-project-id`
3. Đảm bảo có theme data đầy đủ

#### Required cho full demo:
- Theme với content hoàn chỉnh
- Colors, typography, layout configured
- All sections có nội dung (hero, about, problems, solutions, etc.)

---

## 📋 **Test Scenario 1: Basic Deploy (No Domain)**

### **Input Configuration:**
```
✅ Cài đặt cơ bản:
   - Tên project: "vietnam-coffee-web"
   - Mô tả: "Premium coffee export website"
   - Bao gồm assets: ✅ Yes

✅ Tùy chọn Deploy:
   - Tạo folder riêng cho user: ✅ Yes
   - Tạo và chạy script deploy: ✅ Yes
   - Loại server: Nginx
   - Domain: (để trống)
```

### **Expected Result:**
- ✅ **Folder created:** `users/{userId}/vietnam-coffee-web-{timestamp}/`
- ✅ **Files generated:** HTML, CSS, JS, images
- ✅ **Deploy script:** `deploy-nginx.sh` được tạo và chạy
- ✅ **Website accessible:** Via server IP

---

## 📋 **Test Scenario 2: Deploy with Domain**

### **Input Configuration:**
```
✅ Cài đặt cơ bản:
   - Tên project: "coffee-export"
   - Mô tả: "Vietnam Coffee International"
   - Bao gồm assets: ✅ Yes

✅ Tùy chọn Deploy:
   - Tạo folder riêng cho user: ✅ Yes
   - Tạo và chạy script deploy: ✅ Yes
   - Loại server: Nginx
   - Domain: "coffee.example.com"
```

### **Domain Validation Step:**
1. Click **"Kiểm tra"** bên cạnh domain input
2. Hệ thống check DNS
3. ✅ Domain trỏ về `69.62.83.168` → Valid
4. ❌ Domain trỏ về IP khác → Invalid (không thể deploy)

### **Expected Result (Domain Valid):**
- ✅ **Folder created:** với domain config
- ✅ **Nginx config:** Cấu hình cho domain
- ✅ **SSL ready:** Có thể cài Let's Encrypt
- ✅ **Website accessible:** Via domain

---

## 📋 **Test Scenario 3: Different Server Types**

### A. Apache Deploy:
```
Server Type: Apache
→ Generates deploy-apache.sh
→ Creates /var/www/html/{project-name}
→ VirtualHost configuration
```

### B. Node.js Deploy:
```
Server Type: Node.js
→ Generates deploy-node.sh
→ PM2 ecosystem.config.js
→ Static file server
```

### C. Docker Deploy:
```
Server Type: Docker
→ Generates Dockerfile
→ docker-compose.yml
→ Container với nginx base
```

---

## 🔍 **Testing Deploy Quality**

### File Structure Validation:
```bash
public/exports/users/{userId}/{project}-{timestamp}/
├── index.html          ✅
├── css/
│   └── style.css       ✅ (Theme colors, responsive)
├── js/
│   └── main.js         ✅ (Interactivity)
├── images/             ✅ (All assets)
├── deploy-nginx.sh     ✅ (Executable script)
└── metadata.json       ✅ (Project info)
```

### HTML Quality Checks:
```html
<!-- index.html should contain: -->
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="...">
  <title>Vietnam Coffee</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <header>...</header>
  <section class="hero">...</section>
  <section class="about">...</section>
  <!-- All sections from theme -->
  <footer>...</footer>
  <script src="js/main.js"></script>
</body>
</html>
```

### CSS Validation:
```css
/* style.css should contain theme variables */
:root {
  --color-primary: #8B4513;
  --color-secondary: #D2691E;
  --color-accent: #CD853F;
}

/* Responsive breakpoints */
@media (max-width: 768px) { ... }
@media (max-width: 480px) { ... }
```

---

## 🎯 Success Criteria

### Minimum Viable Deploy:
- ✅ Folder created on server
- ✅ All HTML/CSS/JS files generated
- ✅ Deploy script executed successfully
- ✅ Website accessible via IP
- ✅ All components render correctly
- ✅ Theme colors applied
- ✅ Responsive design works

### Full-Featured Deploy:
- ✅ Domain validated and configured
- ✅ Nginx/Apache config created
- ✅ SSL ready (instructions provided)
- ✅ SEO meta tags present
- ✅ Performance optimized
- ✅ All assets included

---

## 🚀 Demo Scenarios

### Scenario 1: Freelancer
"Tôi design website cho client, cần deploy nhanh lên VPS"
→ **Use:** Nginx + No domain (dùng IP trước)

### Scenario 2: Small Business
"Tôi cần website với domain riêng"
→ **Use:** Nginx + Domain validation + SSL

### Scenario 3: Developer
"Muốn deploy với Docker để dễ manage"
→ **Use:** Docker + docker-compose

### Scenario 4: Agency
"Deploy nhiều projects cho nhiều clients"
→ **Use:** User folder + Different domains

---

*Deploy feature giúp đưa website từ design lên production trong vài phút!* 🎉